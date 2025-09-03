import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  ArrowRightOnRectangleIcon,
  BellIcon,
  ChevronLeftIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  LockClosedIcon,
  ShareIcon,
  StarIcon
} from 'react-native-heroicons/outline';
import { authService } from '../../../infrastructure/services/AuthService';
import { notificationService } from '../../../infrastructure/services/NotificationService';
import { NotificationPermissionModal } from '../../components/common/NotificationPermissionModal';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import { useError } from '../../providers/ErrorProvider';
import { useNotification } from '../../providers/NotificationProvider';

interface ConfigurationItem {
  icon: React.ComponentType<any>;
  title: string;
  onPress: () => void;
  showToggle?: boolean;
  toggleValue?: boolean;
  onToggle?: (value: boolean) => void;
}

export const ConfigurationScreen: React.FC = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isScrolledTop, setIsScrolledTop] = useState(true);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { showError } = useError();
  const { scheduleTestNotification } = useNotification();

  const handleScroll = (event: any) => {
    const { contentOffset } = event.nativeEvent;
    const currentScrollY = contentOffset.y;
    setScrollY(currentScrollY);
    setIsScrolledTop(currentScrollY <= 10);
  };

  useEffect(() => {
    loadNotificationSettings();
  }, []);

  const loadNotificationSettings = async () => {
    try {
      const enabled = await notificationService.isNotificationEnabled();
      setNotificationsEnabled(enabled);
    } catch (error) {
      console.error('Error loading notification settings:', error);
    }
  };

  const handleNotificationToggle = async (value: boolean) => {
    try {
      if (value) {
        // Show custom permission modal
        setShowPermissionModal(true);
      } else {
        setNotificationsEnabled(false);
        await notificationService.setNotificationEnabled(false);
      }
    } catch (error) {
      console.error('Error toggling notifications:', error);
      showError('Error', 'No se pudo cambiar la configuración de notificaciones');
    }
  };

  const handlePermissionAllow = async () => {
    try {
      setShowPermissionModal(false);
      setNotificationsEnabled(true);
      await notificationService.setNotificationEnabled(true);
    } catch (error) {
      console.error('Error allowing notifications:', error);
      showError('Error', 'No se pudo habilitar las notificaciones');
    }
  };

  const handlePermissionDeny = () => {
    setShowPermissionModal(false);
    // The switch will stay in the off position since we didn't change the state
  };

  const handleBack = () => {
    router.back();
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = async () => {
    setShowLogoutModal(false);
    try {
      await authService.logout();
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Logout error:', error);
      showError('Error', 'Error al cerrar sesión');
    }
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    setShowDeleteModal(false);
    showError('Función no disponible', 'Esta función estará disponible próximamente');
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleTestNotification = async () => {
    try {
      await scheduleTestNotification();
      showError('Éxito', 'Notificación de prueba programada', 'OK', undefined, 'success');
    } catch (error) {
      showError('Error', 'Error al enviar notificación de prueba');
    }
  };

  const configurationItems: ConfigurationItem[] = [
    {
      icon: BellIcon,
      title: 'Notification',
      onPress: () => {},
      showToggle: true,
      toggleValue: notificationsEnabled,
      onToggle: handleNotificationToggle,
    },
    {
      icon: BellIcon,
      title: 'Test Notification',
      onPress: handleTestNotification,
    },
    {
      icon: StarIcon,
      title: 'Calificar',
      onPress: () => showError('Próximamente', 'Esta función estará disponible próximamente'),
    },
    {
      icon: ShareIcon,
      title: 'Compartir',
      onPress: () => showError('Próximamente', 'Esta función estará disponible próximamente'),
    },
    {
      icon: LockClosedIcon,
      title: 'Política de privacidad',
      onPress: () => showError('Próximamente', 'Esta función estará disponible próximamente'),
    },
    {
      icon: DocumentTextIcon,
      title: 'Términos y Condiciones',
      onPress: () => showError('Próximamente', 'Esta función estará disponible próximamente'),
    },
    {
      icon: EnvelopeIcon,
      title: 'Contacto',
      onPress: () => showError('Próximamente', 'Esta función estará disponible próximamente'),
    }
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={[
        styles.header,
        !isScrolledTop && styles.headerWithBorder
      ]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ChevronLeftIcon size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.title}>Configuración</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Configuration Options */}
        <View style={styles.optionsContainer}>
          {configurationItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionItem}
              onPress={item.onPress}
              disabled={item.showToggle}
            >
              <View style={styles.optionIcon}>
                <item.icon size={24} color="#4285F4" />
              </View>
              <Text style={styles.optionTitle}>{item.title}</Text>
              {item.showToggle ? (
                <Switch
                  value={item.toggleValue}
                  onValueChange={item.onToggle}
                  trackColor={{ false: '#E8E9EA', true: '#4285F4' }}
                  thumbColor={item.toggleValue ? '#FFFFFF' : '#FFFFFF'}
                />
              ) : (
                <View style={styles.placeholder} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <ArrowRightOnRectangleIcon size={24} color="#4285F4" />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>

        {/* Delete Account Button */}
        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
          <Text style={styles.deleteText}>Eliminar cuenta</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Notification Permission Modal */}
      <NotificationPermissionModal
        visible={showPermissionModal}
        onAllow={handlePermissionAllow}
        onDeny={handlePermissionDeny}
      />

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        visible={showLogoutModal}
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
        title="Cerrar Sesión"
        message="¿Estás seguro que quieres cerrar sesión?"
        confirmText="Cerrar Sesión"
        cancelText="Cancelar"
        type="warning"
      />

      {/* Delete Account Confirmation Modal */}
      <ConfirmationModal
        visible={showDeleteModal}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        title="Eliminar Cuenta"
        message="¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  headerWithBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#E8E9EA',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#4285F4',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  optionsContainer: {
    marginBottom: 32,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 0,
  },
  optionIcon: {
    marginRight: 20,
  },
  optionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#1A1A1A',
    flex: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EBF3FF',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#4285F4',
    marginLeft: 12,
  },
  deleteButton: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  deleteText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#EF4444',
  },
});