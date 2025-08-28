import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { ChevronLeftIcon, PlusIcon } from 'react-native-heroicons/outline';
import { router } from 'expo-router';
import { VehicleService, UserVehicle } from '../../../infrastructure/services/VehicleService';
import { useError } from '../../providers/ErrorProvider';

export const VehiclesScreen: React.FC = () => {
  const [vehicles, setVehicles] = useState<UserVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [isScrolledTop, setIsScrolledTop] = useState(true);
  const [isScrolledBottom, setIsScrolledBottom] = useState(false);
  const { showError } = useError();

  const handleScroll = (event: any) => {
    const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
    const currentScrollY = contentOffset.y;
    setScrollY(currentScrollY);
    
    // Check if scrolled from top
    setIsScrolledTop(currentScrollY <= 10);
    
    // Check if scrolled to bottom
    const isAtBottom = currentScrollY + layoutMeasurement.height >= contentSize.height - 10;
    setIsScrolledBottom(isAtBottom);
  };

  const loadVehicles = async () => {
    try {
      setLoading(true);
      const userVehicles = await VehicleService.getUserVehicles();
      setVehicles(userVehicles);
    } catch (error) {
      showError('Error al cargar los vehículos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handleAddVehicle = () => {
    router.push('/(protected)/add-vehicle');
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
        <Text style={styles.title}>Vehículos</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4285F4" />
            <Text style={styles.loadingText}>Cargando vehículos...</Text>
          </View>
        ) : (
          <>
            {vehicles.map((vehicle) => (
              <View key={vehicle.id} style={styles.vehicleCard}>
                <View style={styles.vehicleHeader}>
                  <View style={styles.vehicleInfo}>
                    <Text style={styles.vehicleBrand}>
                      {vehicle.brand?.name || 'Marca desconocida'}
                    </Text>
                    <Text style={styles.vehicleModel}>
                      {vehicle.model?.name || 'Modelo desconocido'}
                    </Text>
                    <Text style={styles.vehicleType}>
                      {vehicle.type?.name || 'Tipo desconocido'} • {vehicle.year || 'Año desconocido'}
                    </Text>
                  </View>
                  <View style={styles.vehiclePlateContainer}>
                    <Text style={styles.vehiclePlate}>{vehicle.license_plate}</Text>
                  </View>
                </View>
                
                {vehicle.is_primary && (
                  <View style={styles.primaryBadge}>
                    <Text style={styles.primaryText}>Principal</Text>
                  </View>
                )}
              </View>
            ))}

            {vehicles.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>Sin vehículos registrados</Text>
                <Text style={styles.emptySubtitle}>Agrega tu primer vehículo para comenzar</Text>
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Add Vehicle Button */}
      <View 
        style={[
          styles.addButton,
          !isScrolledBottom && styles.addButtonWithBorder
        ]}
      >
        <TouchableOpacity style={styles.buttonInner} onPress={handleAddVehicle}>
          <PlusIcon size={24} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Añadir Vehículo</Text>
        </TouchableOpacity>
      </View>
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
    paddingBottom: 140, // Space for floating button container
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#6C7278',
    marginTop: 16,
  },
  vehicleCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E8E9EA',
  },
  vehicleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleBrand: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  vehicleModel: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  vehicleType: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#6C7278',
  },
  vehiclePlateContainer: {
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: 16,
  },
  vehiclePlate: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
  },
  primaryBadge: {
    backgroundColor: '#4285F4',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  primaryText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#6C7278',
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  addButtonWithBorder: {
    borderTopWidth: 1,
    borderTopColor: '#E8E9EA',
  },
  buttonInner: {
    backgroundColor: '#4285F4',
    borderRadius: 12,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
});