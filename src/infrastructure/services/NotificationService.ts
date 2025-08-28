import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export class NotificationService {
  private static readonly NOTIFICATION_PERMISSION_KEY = 'notification_permission_asked';
  private static readonly NOTIFICATIONS_ENABLED_KEY = 'notifications_enabled';

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
              resolve(true);
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
      }
    } catch (error) {
      console.error('Error in checkAndRequestInitialPermission:', error);
    }
  }

  static async resetPermissionStatus(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.NOTIFICATION_PERMISSION_KEY);
      await AsyncStorage.removeItem(this.NOTIFICATIONS_ENABLED_KEY);
    } catch (error) {
      console.error('Error resetting notification permission status:', error);
    }
  }
}

// Export singleton instance
export const notificationService = NotificationService;