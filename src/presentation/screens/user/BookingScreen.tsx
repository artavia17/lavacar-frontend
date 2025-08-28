import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { CalendarIcon, ClockIcon, MapPinIcon } from 'react-native-heroicons/outline';

export const BookingScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Title */}
        <Text style={styles.title}>Solicitar Servicio</Text>
        {/* Service Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Selecciona tu servicio</Text>
          
          <TouchableOpacity style={styles.serviceCard}>
            <Text style={styles.serviceName}>Lavado Completo</Text>
            <Text style={styles.servicePrice}>$25.000</Text>
            <Text style={styles.serviceDescription}>Lavado exterior e interior completo</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.serviceCard}>
            <Text style={styles.serviceName}>Lavado de Rines</Text>
            <Text style={styles.servicePrice}>$15.000</Text>
            <Text style={styles.serviceDescription}>Limpieza profunda de rines y llantas</Text>
          </TouchableOpacity>
        </View>

        {/* Date & Time */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fecha y Hora</Text>
          
          <TouchableOpacity style={styles.optionCard}>
            <CalendarIcon size={24} color="#4285F4" />
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Seleccionar fecha</Text>
              <Text style={styles.optionSubtitle}>Elige el día que prefieras</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.optionCard}>
            <ClockIcon size={24} color="#4285F4" />
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Seleccionar hora</Text>
              <Text style={styles.optionSubtitle}>Disponible de 8:00 AM a 6:00 PM</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ubicación</Text>
          
          <TouchableOpacity style={styles.optionCard}>
            <MapPinIcon size={24} color="#4285F4" />
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Dirección de servicio</Text>
              <Text style={styles.optionSubtitle}>¿Dónde quieres el servicio?</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Book Button */}
        <TouchableOpacity style={styles.bookButton}>
          <Text style={styles.bookButtonText}>Solicitar Servicio</Text>
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
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 100, // Space for tab bar
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  serviceCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E8E9EA',
  },
  serviceName: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  servicePrice: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#4285F4',
    marginBottom: 8,
  },
  serviceDescription: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#6C7278',
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E8E9EA',
  },
  optionContent: {
    marginLeft: 16,
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
  bookButton: {
    backgroundColor: '#4285F4',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginVertical: 20,
  },
  bookButtonText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
});