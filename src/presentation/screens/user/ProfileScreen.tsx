import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { 
  UserIcon, 
  CogIcon, 
  CreditCardIcon, 
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
  ChevronRightIcon
} from 'react-native-heroicons/outline';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const ProfileScreen: React.FC = () => {
  const insets = useSafeAreaInsets();

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que quieres cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement actual logout logic
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  const profileOptions = [
    {
      icon: UserIcon,
      title: 'Información Personal',
      subtitle: 'Edita tu perfil y datos',
      onPress: () => console.log('Personal info'),
    },
    {
      icon: CogIcon,
      title: 'Configuración',
      subtitle: 'Notificaciones y preferencias',
      onPress: () => console.log('Settings'),
    },
    {
      icon: CreditCardIcon,
      title: 'Métodos de Pago',
      subtitle: 'Tarjetas y métodos guardados',
      onPress: () => console.log('Payment methods'),
    },
    {
      icon: QuestionMarkCircleIcon,
      title: 'Ayuda y Soporte',
      subtitle: 'FAQ y contacto',
      onPress: () => console.log('Help'),
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView 
        style={styles.content} 
        contentContainerStyle={[
          styles.scrollContent,
          { 
            paddingTop: 80 + insets.top, // Space for fixed header
            paddingBottom: (Platform.OS === 'ios' ? 110 : 90) + insets.bottom 
          }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Title */}
        <Text style={styles.title}>Mi Perfil</Text>
        
        {/* User Info */}
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <UserIcon size={40} color="#FFFFFF" />
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>Artavio Gómez</Text>
            <Text style={styles.userEmail}>artavio@gmail.com</Text>
            <Text style={styles.userPhone}>+57 300 123 4567</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Editar</Text>
          </TouchableOpacity>
        </View>

        {/* Vehicle Info */}
        <View style={styles.vehicleInfo}>
          <Text style={styles.sectionTitle}>Mi Vehículo</Text>
          <View style={styles.vehicleCard}>
            <View style={styles.vehicleDetails}>
              <Text style={styles.vehicleName}>Toyota Prado</Text>
              <Text style={styles.vehiclePlate}>Placa: BMC120</Text>
              <Text style={styles.vehicleType}>SUV • 2020</Text>
            </View>
            <TouchableOpacity style={styles.vehicleEdit}>
              <ChevronRightIcon size={20} color="#6C7278" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Options */}
        <View style={styles.options}>
          {profileOptions.map((option, index) => (
            <TouchableOpacity key={index} style={styles.optionItem} onPress={option.onPress}>
              <View style={styles.optionIcon}>
                <option.icon size={24} color="#4285F4" />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>{option.title}</Text>
                <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
              </View>
              <ChevronRightIcon size={20} color="#6C7278" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <ArrowRightOnRectangleIcon size={24} color="#EF4444" />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#1A1A1A',
    marginBottom: 32,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {},
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4285F4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userDetails: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#6C7278',
    marginBottom: 2,
  },
  userPhone: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#6C7278',
  },
  editButton: {
    backgroundColor: '#4285F4',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  editButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
  vehicleInfo: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  vehicleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 20,
  },
  vehicleDetails: {
    flex: 1,
  },
  vehicleName: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  vehiclePlate: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#6C7278',
    marginBottom: 2,
  },
  vehicleType: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#6C7278',
  },
  vehicleEdit: {
    padding: 8,
  },
  options: {
    marginBottom: 32,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EBF3FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#6C7278',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    padding: 20,
    marginBottom: 40,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#EF4444',
    marginLeft: 12,
  },
});