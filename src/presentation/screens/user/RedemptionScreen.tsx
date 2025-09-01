import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Redemption, redemptionService } from '../../../infrastructure/services/RedemptionService';
import { UserVehicle, vehicleService } from '../../../infrastructure/services/VehicleService';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import { QRRedemptionModal } from '../../components/common/QRRedemptionModal';
import { RedemptionModal } from '../../components/common/RedemptionModal';
import { useTabScroll } from '../../contexts/TabScrollContext';
import { useError } from '../../providers/ErrorProvider';

const { width } = Dimensions.get('window');

export const RedemptionScreen: React.FC = () => {
  const { setIsScrolled } = useTabScroll();
  const insets = useSafeAreaInsets();
  const { showError } = useError();

  // Vehicle Slider State
  const [vehicles, setVehicles] = useState<UserVehicle[]>([]);
  const [vehiclesLoading, setVehiclesLoading] = useState(true);
  const [primaryVehicle, setPrimaryVehicle] = useState<UserVehicle | null>(null);
  const [showPrimaryVehicleModal, setShowPrimaryVehicleModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<UserVehicle | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Redemptions State
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [redemptionsLoading, setRedemptionsLoading] = useState(true);
  const [showRedemptionModal, setShowRedemptionModal] = useState(false);
  const [selectedRedemption, setSelectedRedemption] = useState<Redemption | null>(null);
  const [showQRRedemptionModal, setShowQRRedemptionModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadVehicles();
    loadRedemptions();
  }, []);

  const loadVehicles = async () => {
    try {
      setVehiclesLoading(true);
      const vehiclesData = await vehicleService.getUserVehicles();
      setVehicles(vehiclesData);
      
      // Find primary vehicle
      const primary = vehiclesData.find(vehicle => vehicle.is_primary);
      setPrimaryVehicle(primary || null);
    } catch (error) {
      console.error('Error loading vehicles:', error);
      showError('Error', 'No se pudieron cargar los vehículos');
    } finally {
      setVehiclesLoading(false);
    }
  };

  const loadRedemptions = async () => {
    try {
      setRedemptionsLoading(true);
      const response = await redemptionService.getRedemptions();
      setRedemptions(response.data);
    } catch (error) {
      console.error('Error loading redemptions:', error);
      showError('Error', 'No se pudieron cargar los canjes');
    } finally {
      setRedemptionsLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        loadVehicles(),
        loadRedemptions()
      ]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleScroll = (event: any) => {
    const { contentOffset } = event.nativeEvent;
    const currentScrollY = contentOffset.y;
    setIsScrolled(currentScrollY > 10);
  };

  // Vehicle Selection Handlers
  const handleVehiclePress = (vehicle: UserVehicle) => {
    if (vehicle.id === primaryVehicle?.id) return; // Already primary
    setSelectedVehicle(vehicle);
    setShowPrimaryVehicleModal(true);
  };

  const handleConfirmPrimaryVehicle = async () => {
    if (!selectedVehicle) return;

    try {
      setShowPrimaryVehicleModal(false);
      await vehicleService.setPrimaryVehicle(selectedVehicle.id);
      await loadVehicles();
      await loadRedemptions(); // Refresh redemptions for new primary vehicle
      
      setSuccessMessage(`${selectedVehicle.brand.name} ${selectedVehicle.model.name} es ahora tu vehículo principal`);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error setting primary vehicle:', error);
      showError('Error', 'No se pudo cambiar el vehículo principal. Inténtalo de nuevo.');
    }
  };

  const handleCancelPrimaryVehicle = () => {
    setShowPrimaryVehicleModal(false);
    setSelectedVehicle(null);
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    setSelectedVehicle(null);
  };

  // Redemption Handlers
  const handleRedemptionPress = (redemption: Redemption) => {
    setSelectedRedemption(redemption);
    setShowRedemptionModal(true);
  };

  const handleCloseRedemptionModal = () => {
    setShowRedemptionModal(false);
    setSelectedRedemption(null);
  };

  const handleRedeemRedemption = (redemption: Redemption) => {
    setShowRedemptionModal(false);
    setShowQRRedemptionModal(true);
  };

  const handleCloseQRRedemptionModal = () => {
    setShowQRRedemptionModal(false);
    setSelectedRedemption(null);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView 
        style={styles.content} 
        contentContainerStyle={[
          styles.scrollContent,
          { 
            paddingTop: 80 + insets.top,
            paddingBottom: (Platform.OS === 'ios' ? 110 : 90) + insets.bottom 
          }
        ]}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#4285F4']}
            tintColor="#4285F4"
            progressViewOffset={80 + insets.top}
          />
        }
      >
        {/* Vehicle Slider */}
        <View style={styles.vehicleSection}>
          {vehiclesLoading ? (
            <View style={styles.vehicleLoading}>
              <ActivityIndicator size="large" color="#4285F4" />
            </View>
          ) : vehicles.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.vehicleContainer}
              contentContainerStyle={styles.vehicleScrollContent}
            >
              {vehicles
                .sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0)) // Primary vehicle first
                .map((vehicle, index) => (
                <TouchableOpacity
                  key={vehicle.id}
                  style={[
                    styles.vehicleCard,
                    vehicle.is_primary && styles.primaryVehicleCard
                  ]}
                  activeOpacity={0.7}
                  onPress={() => handleVehiclePress(vehicle)}
                >
                  <View style={styles.vehicleInfo}>
                    <Text style={[
                      styles.vehicleName,
                      !vehicle.is_primary && styles.vehicleNameGray
                    ]}>
                      {vehicle.brand.name} {vehicle.model.name}
                    </Text>
                    <Text style={[
                      styles.vehiclePlate,
                      !vehicle.is_primary && styles.vehiclePlateGray
                    ]}>Placa: {vehicle.license_plate}</Text>
                  </View>
                  <View style={[
                    styles.vehiclePoints,
                    !vehicle.is_primary && styles.vehiclePointsGray
                  ]}>
                    <Text style={[
                      styles.pointsLabel,
                      !vehicle.is_primary && styles.pointsLabelGray
                    ]}>sellos a favor</Text>
                    <Text style={[
                      styles.pointsNumber,
                      !vehicle.is_primary && styles.pointsNumberGray
                    ]}>{vehicle.points.available}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : null}
        </View>

        {/* Redemptions */}
        <View style={styles.section}>
          {redemptionsLoading ? (
            <View style={styles.redemptionLoading}>
              <ActivityIndicator size="large" color="#4285F4" />
            </View>
          ) : redemptions.length > 0 ? (
            <>
              {redemptions.map((redemption) => (
                <View key={redemption.id} style={styles.redemptionContainer}>
                  <Text style={styles.redemptionTitle}>
                    {redemption.title}, {redemption.points_required} sellos
                  </Text>
                  <TouchableOpacity
                    style={styles.redemptionCard}
                    activeOpacity={0.8}
                    onPress={() => handleRedemptionPress(redemption)}
                  >
                    <Image
                      source={{ uri: redemption.background_image_url }}
                      style={styles.redemptionImage}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </>
          ) : (
            <View style={styles.noRedemptionsContainer}>
              <Text style={styles.noRedemptionsText}>No hay canjes disponibles</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Primary Vehicle Confirmation Modal */}
      <ConfirmationModal
        visible={showPrimaryVehicleModal}
        onConfirm={handleConfirmPrimaryVehicle}
        onCancel={handleCancelPrimaryVehicle}
        title="Cambiar Vehículo Principal"
        message={selectedVehicle ? `¿Quieres hacer ${selectedVehicle.brand.name} ${selectedVehicle.model.name} (${selectedVehicle.license_plate}) tu vehículo principal?` : ''}
        confirmText="Continuar"
        cancelText="Cancelar"
        type="warning"
      />

      {/* Success Modal */}
      <ConfirmationModal
        visible={showSuccessModal}
        onConfirm={handleSuccessClose}
        onCancel={() => {}}
        title="¡Éxito!"
        message={successMessage}
        confirmText="Continuar"
        cancelText=""
        type="success"
      />

      {/* Redemption Modal */}
      <RedemptionModal
        visible={showRedemptionModal}
        redemption={selectedRedemption}
        onClose={handleCloseRedemptionModal}
        onRedeem={handleRedeemRedemption}
      />

      {/* QR Redemption Modal */}
      {selectedRedemption && (
        <QRRedemptionModal
          visible={showQRRedemptionModal}
          onClose={handleCloseQRRedemptionModal}
          redemptionId={selectedRedemption.id}
          redemptionTitle={selectedRedemption.title}
          vehiclePlate={primaryVehicle?.license_plate || ''}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {},
  section: {
    marginBottom: 32,
  },
  // Vehicle Slider Styles (copied from HomeScreen)
  vehicleSection: {
    marginBottom: 32,
  },
  vehicleLoading: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vehicleContainer: {
    marginHorizontal: -20,
  },
  vehicleScrollContent: {
    paddingHorizontal: 20,
  },
  vehicleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D6D6D6',
    borderRadius: 20,
    padding: 16,
    marginRight: 12,
    width: width - 40, // Full screen menos padding
    minWidth: width - 40,
    marginTop: 20,
  },
  vehicleNameGray: {
    color: '#6F6E6E',
  },
  vehiclePlateGray: {
    color: '#424242',
  },
  pointsLabelGray: {
    color: '#6F6E6E',
  },
  pointsNumberGray: {
    color: '#6F6E6E',
  },
  vehiclePointsGray: {
    backgroundColor: 'transparent',
    borderColor: '#6F6E6E',
    borderWidth: 1,
    borderRadius: 25,
  },
  primaryVehicleCard: {
    backgroundColor: '#4285F4',
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleName: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  vehiclePlate: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(255,255,255,0.8)',
  },
  vehiclePoints: {
    alignItems: 'center',
    backgroundColor: '#004187',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 0,
    marginRight: 12,
    flexDirection: 'row',
    gap: 8,
  },
  pointsLabel: {
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(255, 255, 255, 1)',
    marginBottom: 2,
  },
  pointsNumber: {
    fontSize: 25,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
  },
  // Redemptions Styles
  redemptionLoading: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  redemptionContainer: {
    marginBottom: 24,
  },
  redemptionTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  redemptionCard: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
  },
  redemptionImage: {
    width: '100%',
    height: '100%',
  },
  noRedemptionsContainer: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  noRedemptionsText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#6C7278',
    textAlign: 'center',
  },
});