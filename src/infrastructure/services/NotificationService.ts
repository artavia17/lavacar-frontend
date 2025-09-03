import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { httpClient } from '../http/HttpClient';
import { API_ENDPOINTS } from '../../shared/config/environment';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export interface PushToken {
  token: string;
  type: 'expo' | 'fcm' | 'apns';
}

export class NotificationService {
  private static readonly NOTIFICATION_PERMISSION_KEY = 'notification_permission_asked';
  private static readonly NOTIFICATIONS_ENABLED_KEY = 'notifications_enabled';
  private static readonly PUSH_TOKEN_KEY = 'push_token';

  static async hasAskedForPermission(): Promise<boolean> {
    try {
      const asked = await AsyncStorage.getItem(this.NOTIFICATION_PERMISSION_KEY);
      return asked === 'true';
    } catch (error) {
      console.error('Error checking notification permission asked status:', error);
      return false;
    }
  }

  static async markPermissionAsAsked(): Promise<void> {
    try {
      await AsyncStorage.setItem(this.NOTIFICATION_PERMISSION_KEY, 'true');
    } catch (error) {
      console.error('Error marking notification permission as asked:', error);
    }
  }

  static async isNotificationEnabled(): Promise<boolean> {
    try {
      const enabled = await AsyncStorage.getItem(this.NOTIFICATIONS_ENABLED_KEY);
      return enabled === 'true';
    } catch (error) {
      console.error('Error checking notification enabled status:', error);
      return false;
    }
  }

  static async setNotificationEnabled(enabled: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(this.NOTIFICATIONS_ENABLED_KEY, enabled.toString());
    } catch (error) {
      console.error('Error setting notification enabled status:', error);
    }
  }

  static async registerForPushNotificationsAsync(): Promise<PushToken | null> {
    let token: string | null = null;
    let tokenType: 'expo' | 'fcm' | 'apns' = 'expo';

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#4285F4',
        sound: 'default',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return null;
      }
      
      try {
        const projectId = Constants.expoConfig?.extra?.eas?.projectId || Constants.expoConfig?.projectId;
        const pushTokenData = await Notifications.getExpoPushTokenAsync({
          projectId: projectId,
        });
        token = pushTokenData.data;
        tokenType = 'expo';
      } catch (error) {
        console.error('Error getting Expo push token:', error);
        return null;
      }
    } else {
      console.log('Must use physical device for Push Notifications');
      return null;
    }

    return token ? { token, type: tokenType } : null;
  }

  static async sendTokenToServer(pushToken: PushToken): Promise<boolean> {
    try {
      console.log('📱 Sending push token to server:', pushToken);
      
      const response = await httpClient.post(
        API_ENDPOINTS.PUSH_TOKEN, // You'll need to add this endpoint
        {
          token: pushToken.token,
          type: pushToken.type,
          platform: Platform.OS,
        },
        true // Requires auth
      );

      if (response.success) {
        await AsyncStorage.setItem(this.PUSH_TOKEN_KEY, JSON.stringify(pushToken));
        console.log('✅ Push token sent successfully');
        return true;
      } else {
        console.error('❌ Failed to send push token:', response.message);
        return false;
      }
    } catch (error) {
      console.error('❌ Error sending push token to server:', error);
      return false;
    }
  }

  static async getStoredPushToken(): Promise<PushToken | null> {
    try {
      const storedToken = await AsyncStorage.getItem(this.PUSH_TOKEN_KEY);
      return storedToken ? JSON.parse(storedToken) : null;
    } catch (error) {
      console.error('Error getting stored push token:', error);
      return null;
    }
  }

  static async setupPushNotifications(): Promise<boolean> {
    try {
      console.log('🔔 Setting up push notifications...');
      
      const pushToken = await this.registerForPushNotificationsAsync();
      if (!pushToken) {
        console.log('❌ Failed to register for push notifications');
        return false;
      }

      const success = await this.sendTokenToServer(pushToken);
      if (success) {
        console.log('✅ Push notifications setup completed');
        return true;
      } else {
        console.log('❌ Failed to send token to server');
        return false;
      }
    } catch (error) {
      console.error('❌ Error setting up push notifications:', error);
      return false;
    }
  }

  static async requestInitialPermission(): Promise<boolean> {
    return new Promise((resolve) => {
      Alert.alert(
        'Mantente Informado',
        'Habilita las notificaciones para recibir actualizaciones importantes sobre tus servicios de lavado y ofertas especiales.',
        [
          {
            text: 'Ahora No',
            style: 'cancel',
            onPress: async () => {
              await this.setNotificationEnabled(false);
              await this.markPermissionAsAsked();
              resolve(false);
            },
          },
          {
            text: 'Habilitar',
            onPress: async () => {
              await this.setNotificationEnabled(true);
              await this.markPermissionAsAsked();
              
              // Setup push notifications when user enables them
              const setupSuccess = await this.setupPushNotifications();
              resolve(setupSuccess);
            },
          },
        ],
        { cancelable: false }
      );
    });
  }

  static async checkAndRequestInitialPermission(): Promise<void> {
    try {
      const hasAsked = await this.hasAskedForPermission();
      if (!hasAsked) {
        // Wait a bit after app startup to show the permission dialog
        setTimeout(async () => {
          await this.requestInitialPermission();
        }, 2000); // 2 seconds delay
      } else {
        // If user has already enabled notifications, ensure push notifications are setup
        const isEnabled = await this.isNotificationEnabled();
        if (isEnabled) {
          const storedToken = await this.getStoredPushToken();
          if (!storedToken) {
            await this.setupPushNotifications();
          }
        }
      }
    } catch (error) {
      console.error('Error in checkAndRequestInitialPermission:', error);
    }
  }

  static addNotificationReceivedListener(listener: (notification: Notifications.Notification) => void) {
    return Notifications.addNotificationReceivedListener(listener);
  }

  static addNotificationResponseReceivedListener(listener: (response: Notifications.NotificationResponse) => void) {
    return Notifications.addNotificationResponseReceivedListener(listener);
  }

  static async resetPermissionStatus(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.NOTIFICATION_PERMISSION_KEY);
      await AsyncStorage.removeItem(this.NOTIFICATIONS_ENABLED_KEY);
      await AsyncStorage.removeItem(this.PUSH_TOKEN_KEY);
    } catch (error) {
      console.error('Error resetting notification permission status:', error);
    }
  }

  // Test notification (for development)
  static async scheduleTestNotification(): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Test Notification',
          body: 'This is a test notification from your app!',
          sound: 'default',
        },
        trigger: { seconds: 1 },
      });
    } catch (error) {
      console.error('Error scheduling test notification:', error);
    }
  }
}

// Export singleton instance
export const notificationService = NotificationService;