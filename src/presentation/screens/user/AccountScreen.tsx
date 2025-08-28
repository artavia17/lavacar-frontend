import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  ArrowRightOnRectangleIcon,
  ChevronLeftIcon,
  CogIcon,
  TruckIcon
} from 'react-native-heroicons/outline';
import QRCode from 'react-native-qrcode-svg';
import { authService } from '../../../infrastructure/services/AuthService';
import { UserAccount, UserVehicle, vehicleService } from '../../../infrastructure/services/VehicleService';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import { useError } from '../../providers/ErrorProvider';

export const AccountScreen: React.FC = () => {
  const [primaryVehicle, setPrimaryVehicle] = useState<UserVehicle | null>(null);
  const [userAccount, setUserAccount] = useState<UserAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [isScrolledTop, setIsScrolledTop] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { showError } = useError();

  // Debug logs for modal states
  useEffect(() => {
    console.log('Logout modal state:', showLogoutModal);
  }, [showLogoutModal]);

  useEffect(() => {
    console.log('Delete modal state:', showDeleteModal);
  }, [showDeleteModal]);

  useEffect(() => {
    loadAccountData();
  }, []);

  const loadAccountData = async () => {
    try {
      // Load both user account and primary vehicle in parallel
      const [accountData, primaryVehicleData] = await Promise.all([
        vehicleService.getUserAccount(),
        vehicleService.getPrimaryVehicle().catch(() => null) // Allow this to fail gracefully
      ]);

      setUserAccount(accountData);
      setPrimaryVehicle(primaryVehicleData);
    } catch (error) {
      console.error('Error loading account data:', error);
      showError('Error', 'Error de conexión al cargar datos de la cuenta');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleMyVehicles = () => {
    router.push('/(protected)/vehicles');
  };

  const handleConfiguration = () => {
    router.push('/(protected)/configuration');
  };

  const handleLogout = () => {
    console.log('Opening logout modal');
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
    console.log('Opening delete modal');
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    setShowDeleteModal(false);
    showError('Función no disponible', 'Esta función estará disponible próximamente');
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleScroll = (event: any) => {
    const { contentOffset } = event.nativeEvent;
    const currentScrollY = contentOffset.y;
    setScrollY(currentScrollY);
    
    // Check if scrolled from top
    setIsScrolledTop(currentScrollY <= 10);
  };

  const getQRValue = () => {
    if (primaryVehicle) {
      return primaryVehicle.license_plate;
    }
    return userAccount?.id?.toString() || 'No data';
  };

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
        <Text style={styles.headerTitle}>Cuenta</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >

        {/* QR Code Section */}
        <View style={styles.qrSection}>
          {loading ? (
            <ActivityIndicator size="large" color="#4285F4" />
          ) : (
            <>
              <Text style={styles.userName}>
                {userAccount?.first_name || 'Usuario'}
              </Text>
              <QRCode
                value={getQRValue()}
                size={200}
                color="#000000"
                backgroundColor="#FFFFFF"
              />
            </>
          )}
        </View>

        {/* Menu Options */}
        <View style={styles.menuSection}>
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={handleMyVehicles}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, styles.vehiclesIcon]}>
                <TruckIcon size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.menuItemText}>Mis vehículos</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={handleConfiguration}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, styles.configIcon]}>
                <CogIcon size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.menuItemText}>Configuración</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <ArrowRightOnRectangleIcon size={20} color="#4285F4" />
          <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
        </TouchableOpacity>

        {/* Delete Account */}
        <TouchableOpacity 
          style={styles.deleteButton} 
          onPress={handleDeleteAccount}
          activeOpacity={0.7}
        >
          <Text style={styles.deleteButtonText}>Eliminar cuenta</Text>
        </TouchableOpacity>
      </ScrollView>

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
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#4285F4',
    textAlign: 'center',
    marginHorizontal: 16,
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 40,
  },
  userName: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#1A1A1A',
  },
  qrSection: {
    alignItems: 'center',
    marginBottom: 60,
    padding: 20,
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
  },
  menuSection: {
    marginBottom: 60,
  },
  menuItem: {
    marginBottom: 20,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  vehiclesIcon: {
    backgroundColor: '#4285F4',
  },
  configIcon: {
    backgroundColor: '#4285F4',
  },
  menuItemText: {
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    color: '#1A1A1A',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F8FF',
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  logoutButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#4285F4',
    marginLeft: 8,
  },
  deleteButton: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  deleteButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#FF6B6B',
  },
});