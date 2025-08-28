import { useState, useEffect } from 'react';
import { notificationService } from '../../infrastructure/services/NotificationService';

export const useInitialNotificationPermission = () => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const checkPermission = async () => {
      try {
        const hasAsked = await notificationService.hasAskedForPermission();
        if (!hasAsked) {
          // Show modal after a delay
          setTimeout(() => {
            setShowModal(true);
          }, 2000);
        }
      } catch (error) {
        console.error('Error checking notification permission:', error);
      }
    };

    checkPermission();
  }, []);

  const handleAllow = async () => {
    try {
      setShowModal(false);
      await notificationService.setNotificationEnabled(true);
      await notificationService.markPermissionAsAsked();
    } catch (error) {
      console.error('Error allowing initial notifications:', error);
    }
  };

  const handleDeny = async () => {
    try {
      setShowModal(false);
      await notificationService.setNotificationEnabled(false);
      await notificationService.markPermissionAsAsked();
    } catch (error) {
      console.error('Error denying initial notifications:', error);
    }
  };

  return {
    showModal,
    handleAllow,
    handleDeny,
  };
};