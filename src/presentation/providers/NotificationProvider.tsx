import React, { createContext, useContext, useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { notificationService } from '../../infrastructure/services/NotificationService';

interface NotificationContextType {
  scheduleTestNotification: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    console.log('🔔 Initializing NotificationProvider...');
    
    // Initialize notification service
    notificationService.checkAndRequestInitialPermission();

    // Listener for notifications received while app is running
    notificationListener.current = notificationService.addNotificationReceivedListener(notification => {
      console.log('📱 Notification received:', notification);
      // You can add custom handling here, like updating app state
    });

    // Listener for when user taps on notification
    responseListener.current = notificationService.addNotificationResponseReceivedListener(response => {
      console.log('👆 Notification response:', response);
      // Handle notification tap - you can navigate to specific screens here
      // For example:
      // const data = response.notification.request.content.data;
      // if (data?.screen) {
      //   router.push(data.screen);
      // }
    });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  const scheduleTestNotification = async () => {
    await notificationService.scheduleTestNotification();
  };

  return (
    <NotificationContext.Provider value={{
      scheduleTestNotification,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};