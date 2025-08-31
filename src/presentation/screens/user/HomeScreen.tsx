import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Linking,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Banner, bannerService } from '../../../infrastructure/services/BannerService';
import { Coupon, couponService } from '../../../infrastructure/services/CouponService';
import { UserVehicle, vehicleService } from '../../../infrastructure/services/VehicleService';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import { NotificationPermissionModal } from '../../components/common/NotificationPermissionModal';
import { useTabScroll } from '../../contexts/TabScrollContext';
import { useInitialNotificationPermission } from '../../hooks/useInitialNotificationPermission';
import { useError } from '../../providers/ErrorProvider';

const { width } = Dimensions.get('window');

export const HomeScreen: React.FC = () => {
  const { showModal, handleAllow, handleDeny } = useInitialNotificationPermission();
  const { setIsScrolled } = useTabScroll();
  const insets = useSafeAreaInsets();
  const { showError } = useError();
  
  const [banners, setBanners] = useState<Banner[]>([]);
  const [bannersLoading, setBannersLoading] = useState(true);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  
  const [vehicles, setVehicles] = useState<UserVehicle[]>([]);
  const [vehiclesLoading, setVehiclesLoading] = useState(true);
  const [primaryVehicle, setPrimaryVehicle] = useState<UserVehicle | null>(null);
  
  const [showPrimaryVehicleModal, setShowPrimaryVehicleModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<UserVehicle | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [couponsLoading, setCouponsLoading] = useState(true);

  useEffect(() => {
    loadBanners();
    loadVehicles();
    loadCoupons();
  }, []);

  const loadBanners = async () => {
    try {
      setBannersLoading(true);
      const bannersData = await bannerService.getBanners();
      setBanners(bannersData);
    } catch (error) {
      console.error('Error loading banners:', error);
      showError('Error', 'No se pudieron cargar los banners');
    } finally {
      setBannersLoading(false);
    }
  };

  const loadVehicles = async () => {
    try {
      setVehiclesLoading(true);
      const vehiclesData = await vehicleService.getUserVehicles();
      
      // Sort vehicles to show primary vehicle first
      const sortedVehicles = vehiclesData.sort((a, b) => {
        if (a.is_primary && !b.is_primary) return -1;
        if (!a.is_primary && b.is_primary) return 1;
        return 0;
      });
      
      setVehicles(sortedVehicles);
      
      // Find primary vehicle
      const primary = sortedVehicles.find(vehicle => vehicle.is_primary);
      setPrimaryVehicle(primary || sortedVehicles[0] || null);
    } catch (error) {
      console.error('Error loading vehicles:', error);
      showError('Error', 'No se pudieron cargar los vehículos');
    } finally {
      setVehiclesLoading(false);
    }
  };

  const loadCoupons = async () => {
    try {
      setCouponsLoading(true);
      const couponResponse = await couponService.getRecentCoupons();
      setCoupons(couponResponse.data);
    } catch (error) {
      console.error('Error loading coupons:', error);
      showError('Error', 'No se pudieron cargar los cupones');
    } finally {
      setCouponsLoading(false);
    }
  };

  const handleScroll = (event: any) => {
    const { contentOffset } = event.nativeEvent;
    const currentScrollY = contentOffset.y;
    setIsScrolled(currentScrollY > 10);
  };

  const handleBannerPress = async (banner: Banner) => {
    const navigation = bannerService.handleBannerNavigation(banner);
    
    switch (navigation.type) {
      case 'external':
        if (navigation.url) {
          try {
            await Linking.openURL(navigation.url);
          } catch (error) {
            console.error('Error opening external URL:', error);
            showError('Error', 'No se pudo abrir el enlace');
          }
        }
        break;
      case 'internal':
        if (navigation.url) {
          try {
            router.push(navigation.url as any);
          } catch (error) {
            console.error('Error navigating to internal URL:', error);
            showError('Error', 'No se pudo navegar a la página');
          }
        }
        break;
      case 'none':
      default:
        // No action needed
        break;
    }
  };

  const handleVehiclePress = (vehicle: UserVehicle) => {
    if (vehicle.is_primary) {
      // Si ya es el vehículo principal, no hacer nada
      return;
    }
    
    setSelectedVehicle(vehicle);
    setShowPrimaryVehicleModal(true);
  };

  const handleConfirmPrimaryVehicle = async () => {
    if (!selectedVehicle) return;

    try {
      setShowPrimaryVehicleModal(false);
      
      // Llamar al API para cambiar el vehículo principal
      await vehicleService.setPrimaryVehicle(selectedVehicle.id);
      
      // Refrescar los datos del home
      await loadVehicles();
      await loadCoupons(); // Refresh coupons for new primary vehicle
      
      // Mostrar modal de éxito
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
    setSuccessMessage('');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { 
            paddingTop: 80 + insets.top, // Space for fixed header
            paddingBottom: (Platform.OS === 'ios' ? 110 : 90) + insets.bottom 
          }
        ]}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Banners */}
        {bannersLoading ? (
          <View style={styles.bannerLoading}>
            <ActivityIndicator size="large" color="#4285F4" />
          </View>
        ) : banners.length > 0 ? (
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={styles.bannerContainer}
            onMomentumScrollEnd={(event) => {
              const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
              setCurrentBannerIndex(newIndex);
            }}
          >
            {banners.map((banner, index) => (
              <View
                key={banner.id}
                style={[styles.bannerWrapper, { width: width }]}
              >
                <TouchableOpacity
                  style={styles.bannerSlide}
                  onPress={() => handleBannerPress(banner)}
                  activeOpacity={banner.has_link ? 0.8 : 1}
                >
                <Image
                  source={{ uri: banner.banner_image_url }}
                  style={styles.bannerImage}
                  resizeMode="cover"
                />
                <View style={styles.bannerOverlay}>
                  <Text style={styles.bannerTitle}>{banner.title.toUpperCase()}</Text>
                </View>
                
                {/* Banner Indicators - show only on current banner */}
                {banners.length > 1 && index === currentBannerIndex && (
                  <View style={styles.bannerIndicators}>
                    {banners.map((_, indicatorIndex) => (
                      <View
                        key={indicatorIndex}
                        style={[
                          styles.indicator,
                          indicatorIndex === currentBannerIndex && styles.activeIndicator
                        ]}
                      />
                    ))}
                  </View>
                )}
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.noBannersContainer}>
            <Text style={styles.noBannersText}>No hay banners disponibles</Text>
          </View>
        )}

        {/* Vehicle Slider */}
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
            {vehicles.map((vehicle, index) => (
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
        ) : (
          <View style={styles.noVehiclesContainer}>
            <Text style={styles.noVehiclesText}>No hay vehículos registrados</Text>
          </View>
        )}

        {/* Cupones */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cupones</Text>
          
          {couponsLoading ? (
            <View style={styles.couponsLoading}>
              <ActivityIndicator size="large" color="#4285F4" />
            </View>
          ) : coupons.length > 0 ? (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.couponsScroll}
              contentContainerStyle={styles.couponsScrollContent}
            >
              {coupons.map((coupon, index) => (
                <View key={coupon.id} style={styles.couponContainer}>
                  <TouchableOpacity 
                    style={styles.coupon}
                    activeOpacity={0.8}
                  >
                    <Image
                      source={{ uri: coupon.presentation_image_url }}
                      style={styles.couponImage}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                  <Text style={styles.couponTitle}>
                    {coupon.title}
                  </Text>
                </View>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.noCouponsContainer}>
              <Text style={styles.noCouponsText}>No hay cupones disponibles para tu vehículo</Text>
            </View>
          )}
        </View>

        {/* Canjes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Canjes</Text>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.canjesScroll}
          >
            <View style={[styles.canjeCard, styles.canjeActive]}>
              <Text style={styles.canjeNumber}>10</Text>
              <Text style={styles.canjeLabel}>SELLOS</Text>
              <Text style={styles.canjeDescription}>canjear por 10 sellos</Text>
            </View>
            
            <View style={styles.canjeCard}>
              <Text style={styles.canjeNumber}>15</Text>
              <Text style={styles.canjeLabel}>SELLOS</Text>
              <Text style={styles.canjeDescription}>Canjear por 15 sellos</Text>
            </View>
            
            <View style={styles.canjeCard}>
              <Text style={styles.canjeNumber}>20</Text>
              <Text style={styles.canjeLabel}>SELLOS</Text>
              <Text style={styles.canjeDescription}>canjear por 20</Text>
            </View>
          </ScrollView>
        </View>
      </ScrollView>

      {/* Initial Notification Permission Modal */}
      <NotificationPermissionModal
        visible={showModal}
        onAllow={handleAllow}
        onDeny={handleDeny}
        title="Mantente Informado"
        message="Habilita las notificaciones para recibir actualizaciones importantes sobre tus servicios de lavado y ofertas especiales."
      />

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
        onCancel={() => {}} // No cancel needed for success
        title="¡Éxito!"
        message={successMessage}
        confirmText="Success"
        cancelText=""
        type="success"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {},
  bannerLoading: {
    height: 200,
    marginHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    marginBottom: 16,
  },
  bannerContainer: {
    marginBottom: 8,
  },
  bannerWrapper: {
    paddingHorizontal: 20,
    height: 200,
  },
  bannerSlide: {
    flex: 1,
    height: '100%',
    overflow: 'hidden',
    position: 'relative',
    borderRadius: 16,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: '40%', // No supera el 60% del contenedor
    padding: 20,
    justifyContent: 'flex-end',
  },
  bannerTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    lineHeight: 28,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  bannerIndicators: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#ffffffff',
  },
  noBannersContainer: {
    height: 200,
    marginHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    marginBottom: 32,
  },
  noBannersText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#6C7278',
  },
  vehicleLoading: {
    height: 120,
    marginHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    marginBottom: 32,
  },
  vehicleContainer: {
    marginBottom: 32,
  },
  vehicleScrollContent: {
    paddingHorizontal: 20,
  },
  vehicleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D6D6D6', // Color gris por defecto para vehículos no principales
    borderRadius: 20,
    padding: 16,
    marginRight: 12,
    width: width - 60,
    minWidth: 300,
    marginTop: 20,
  },
  vehicleNameGray:{
    color: '#6F6E6E',
  },
  vehiclePlateGray:{
    color: '#424242',
  },
  pointsLabelGray:{
    color: '#6F6E6E',
  },
  pointsNumberGray:{
    color: '#6F6E6E',
  },
  vehiclePointsGray:{
    backgroundColor: 'transparent',
    borderColor: '#6F6E6E',
    borderWidth: 1,
    borderRadius: 25,
  },
  primaryVehicleCard: {
    backgroundColor: '#4285F4', // Color azul para vehículo principal
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
  vehicleMoreButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  vehicleMoreButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#FFFFFF',
  },
  noVehiclesContainer: {
    height: 120,
    marginHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    marginBottom: 32,
  },
  noVehiclesText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#6C7278',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#1A1A1A',
    marginBottom: 10,
  },
  couponsLoading: {
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    marginHorizontal: 0,
  },
  couponsScroll: {
    marginHorizontal: -20,
    paddingLeft: 20,
  },
  couponsScrollContent: {
    paddingRight: 20,
  },
  couponContainer: {
    marginRight: 16,
  },
  coupon: {
    width: (width - 60) / 2, // Two coupons per screen (width - padding - spacing) / 2
    height: 250,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 5,
  },
  couponImage: {
    width: '100%',
    height: '100%',
  },
  couponTitle: {
    fontSize: 14,
    fontFamily: 'Poppins',
    color: '#535353',
    textAlign: 'left',
    maxWidth: (width - 60) / 2,
  },
  noCouponsContainer: {
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    marginHorizontal: 0,
  },
  noCouponsText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#6C7278',
    textAlign: 'center',
  },
  canjesScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  canjeCard: {
    width: 120,
    height: 120,
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  canjeActive: {
    backgroundColor: '#FFD700',
  },
  canjeNumber: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  canjeLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  canjeDescription: {
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    color: '#666666',
    textAlign: 'center',
    lineHeight: 12,
  },
});