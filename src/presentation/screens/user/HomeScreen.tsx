import { router } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  Linking,
  PanResponder,
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
import { Redemption, redemptionService } from '../../../infrastructure/services/RedemptionService';
import { UserVehicle, vehicleService } from '../../../infrastructure/services/VehicleService';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import { CouponModal } from '../../components/common/CouponModal';
import { NotificationPermissionModal } from '../../components/common/NotificationPermissionModal';
import { RedemptionModal } from '../../components/common/RedemptionModal';
import { QRRedemptionModal } from '../../components/common/QRRedemptionModal';
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
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [redemptionsLoading, setRedemptionsLoading] = useState(true);
  const [showRedemptionModal, setShowRedemptionModal] = useState(false);
  const [selectedRedemption, setSelectedRedemption] = useState<Redemption | null>(null);
  const [showQRRedemptionModal, setShowQRRedemptionModal] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Simple function to go to next banner
  const nextBanner = useCallback(() => {
    console.log('🔄 nextBanner called, current:', currentBannerIndex, 'total:', banners.length);
    
    if (banners.length <= 1) return;

    // Fade out
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      // Change to next index
      setCurrentBannerIndex(prev => {
        const next = prev >= banners.length - 1 ? 0 : prev + 1;
        console.log('➡️ Moving from', prev, 'to', next);
        return next;
      });
      
      // Fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  }, [currentBannerIndex, banners.length, fadeAnim]);

  // Simple function to go to previous banner
  const prevBanner = useCallback(() => {
    console.log('🔄 prevBanner called, current:', currentBannerIndex, 'total:', banners.length);
    
    if (banners.length <= 1) return;

    // Fade out
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      // Change to previous index
      setCurrentBannerIndex(prev => {
        const next = prev <= 0 ? banners.length - 1 : prev - 1;
        console.log('⬅️ Moving from', prev, 'to', next);
        return next;
      });
      
      // Fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  }, [currentBannerIndex, banners.length, fadeAnim]);

  // Pan responder for swipe gestures
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 10;
      },
      onPanResponderRelease: (_, gestureState) => {
        console.log('👆 Swipe gesture:', gestureState.dx);
        
        if (gestureState.dx > 30) {
          // Swipe right - previous banner
          console.log('👉 Swipe RIGHT -> Previous');
          prevBanner();
        } else if (gestureState.dx < -30) {
          // Swipe left - next banner
          console.log('👈 Swipe LEFT -> Next');
          nextBanner();
        }
      },
    })
  ).current;

  useEffect(() => {
    loadBanners();
    loadVehicles();
    loadCoupons();
    loadRedemptions();
  }, []);

  // Auto-change effect
  useEffect(() => {
    console.log('🔥 Auto-change effect triggered, banners:', banners.length);
    
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Start auto-change only if we have multiple banners
    if (banners.length > 1) {
      console.log('⏰ Starting auto-change interval');
      intervalRef.current = setInterval(() => {
        console.log('🔄 Auto-change triggered');
        nextBanner();
      }, 4000);
    }
    
    return () => {
      if (intervalRef.current) {
        console.log('🛑 Cleaning up interval');
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [banners.length, nextBanner]);

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

  const loadRedemptions = async () => {
    try {
      setRedemptionsLoading(true);
      const redemptionResponse = await redemptionService.getRedemptions();
      setRedemptions(redemptionResponse.data);
    } catch (error) {
      console.error('Error loading redemptions:', error);
      showError('Error', 'No se pudieron cargar los canjes');
    } finally {
      setRedemptionsLoading(false);
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
      await loadRedemptions(); // Refresh redemptions for new primary vehicle
      
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

  const handleCouponPress = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setShowCouponModal(true);
  };

  const handleCloseCouponModal = () => {
    setShowCouponModal(false);
    setSelectedCoupon(null);
  };

  const handleViewCoupon = (coupon: Coupon) => {
    setShowCouponModal(false);
    setSelectedCoupon(null);
    
    // Navigate to coupon detail screen (outside tabs)
    console.log('Navigate to coupon detail:', coupon.title, 'ID:', coupon.id);
    router.push(`/(protected)/coupon/${coupon.id}`);
  };

  const handleRedemptionPress = (redemption: Redemption) => {
    setSelectedRedemption(redemption);
    setShowRedemptionModal(true);
  };

  const handleCloseRedemptionModal = () => {
    setShowRedemptionModal(false);
    setSelectedRedemption(null);
  };

  const handleRedeemRedemption = (redemption: Redemption) => {
    console.log('Redeeming:', redemption.title);
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
          <View style={styles.bannerContainer}>
            <Animated.View 
              {...panResponder.panHandlers}
              style={[
                styles.bannerWrapper, 
                { 
                  width: width,
                  opacity: fadeAnim
                }
              ]}
            >
              {banners[currentBannerIndex] && (
                <TouchableOpacity
                  style={styles.bannerSlide}
                  onPress={() => handleBannerPress(banners[currentBannerIndex])}
                  activeOpacity={banners[currentBannerIndex].has_link ? 0.8 : 1}
                >
                  <Image
                    source={{ uri: banners[currentBannerIndex].banner_image_url }}
                    style={styles.bannerImage}
                    resizeMode="cover"
                  />
                  <View style={styles.bannerOverlay}>
                    <Text style={styles.bannerTitle}>
                      {banners[currentBannerIndex].title.toUpperCase()}
                    </Text>
                  </View>
                  
                  {/* Banner Indicators */}
                  {banners.length > 1 && (
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
              )}
            </Animated.View>
          </View>
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
                    onPress={() => handleCouponPress(coupon)}
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
          
          {redemptionsLoading ? (
            <View style={styles.redemptionLoading}>
              <ActivityIndicator size="large" color="#4285F4" />
            </View>
          ) : redemptions.length > 0 ? (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.canjesScroll}
              contentContainerStyle={styles.canjesScrollContent}
            >
              {redemptions.map((redemption, index) => (
                <View key={redemption.id} style={styles.canjeContainer}>
                  <TouchableOpacity
                    style={styles.canjeCard}
                    activeOpacity={0.8}
                    onPress={() => handleRedemptionPress(redemption)}
                  >
                    <Image
                      source={{ uri: redemption.presentation_image_url }}
                      style={styles.canjeImage}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                  <Text style={styles.canjeTitle}>
                    {redemption.title}
                  </Text>
                </View>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.noRedemptionsContainer}>
              <Text style={styles.noRedemptionsText}>No hay canjes disponibles</Text>
            </View>
          )}
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

      {/* Coupon Modal */}
      <CouponModal
        visible={showCouponModal}
        coupon={selectedCoupon}
        onClose={handleCloseCouponModal}
        onViewCoupon={handleViewCoupon}
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
    paddingHorizontal: 0, // Remove padding for full screen
    height: 200,
  },
  bannerSlide: {
    flex: 1,
    height: '100%',
    overflow: 'hidden',
    position: 'relative',
    borderRadius: 0, // Remove border radius for full screen
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
  },
  canjesScrollContent: {
    paddingHorizontal: 20,
  },
  canjeContainer: {
    marginRight: 16,
    alignItems: 'flex-start',
  },
  canjeCard: {
    width: 160,
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  canjeImage: {
    width: '100%',
    height: '100%',
  },
  canjeTitle: {
    fontSize: 14,
    fontFamily: 'Poppins',
    color: '#535353',
    textAlign: 'left',
    marginTop: 10,
  },
  redemptionLoading: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
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