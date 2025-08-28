import React from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import { NotificationPermissionModal } from '../../components/common/NotificationPermissionModal';
import { useInitialNotificationPermission } from '../../hooks/useInitialNotificationPermission';
import { useTabScroll } from '../../contexts/TabScrollContext';

const { width } = Dimensions.get('window');

export const HomeScreen: React.FC = () => {
  const { showModal, handleAllow, handleDeny } = useInitialNotificationPermission();
  const { setIsScrolled } = useTabScroll();

  const handleScroll = (event: any) => {
    const { contentOffset } = event.nativeEvent;
    const currentScrollY = contentOffset.y;
    setIsScrolled(currentScrollY > 10);
  };
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Promoción Principal */}
        <View style={styles.mainPromo}>
          <View style={styles.promoOverlay}>
            <Text style={styles.promoTitle}>LAVADO DE RINES</Text>
            <Text style={styles.promoDiscount}>50%</Text>
            <Text style={styles.promoSubtitle}>de descuento</Text>
          </View>
          {/* Indicadores */}
          <View style={styles.indicators}>
            <View style={[styles.indicator, styles.indicatorActive]} />
            <View style={styles.indicator} />
            <View style={styles.indicator} />
          </View>
        </View>

        {/* Servicio Destacado */}
        <View style={styles.featuredService}>
          <View style={styles.serviceInfo}>
            <Text style={styles.serviceName}>Toyota Prado</Text>
            <Text style={styles.servicePlate}>Placa BMC120</Text>
          </View>
          <View style={styles.serviceAction}>
            <Text style={styles.serviceLabel}>sellos a favor</Text>
            <Text style={styles.serviceNumber}>10</Text>
          </View>
          <TouchableOpacity style={styles.moreButton}>
            <Text style={styles.moreButtonText}>Lo...</Text>
          </TouchableOpacity>
        </View>

        {/* Cupones */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cupones</Text>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.couponsScroll}
          >
            <View style={styles.coupon}>
              <Text style={styles.couponDiscount}>$5 OFF</Text>
              <Text style={styles.couponService}>FULL CAR WASH</Text>
              <Text style={styles.couponDetail}>Detalle de cupón</Text>
            </View>
            
            <View style={[styles.coupon, styles.couponDark]}>
              <Text style={styles.couponBrandDark}>LAVADO DE RINES</Text>
              <View style={styles.couponInfoDark}>
                <Text style={styles.couponTypeDark}>PROFESIONAL</Text>
                <Text style={styles.couponPriceDark}>$1000</Text>
                <Text style={styles.couponTimeDark}>3H-5H</Text>
              </View>
              <Text style={styles.couponDetailDark}>Detalle de cupón</Text>
            </View>
            
            <View style={styles.couponPlaceholder}>
              <Text style={styles.couponDetail}>De...</Text>
            </View>
          </ScrollView>
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
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 100, // Space for tab bar
  },
  mainPromo: {
    height: 200,
    marginHorizontal: 20,
    borderRadius: 16,
    backgroundColor: '#2A2A2A',
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 20,
  },
  promoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    paddingLeft: 24,
    zIndex: 1,
  },
  promoTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  promoDiscount: {
    fontSize: 48,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    lineHeight: 48,
  },
  promoSubtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#FFFFFF',
  },
  indicators: {
    position: 'absolute',
    bottom: 16,
    left: 24,
    flexDirection: 'row',
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  indicatorActive: {
    backgroundColor: '#FFFFFF',
  },
  featuredService: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4285F4',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    marginBottom: 32,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
  servicePlate: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(255,255,255,0.8)',
  },
  serviceAction: {
    alignItems: 'center',
    marginRight: 16,
  },
  serviceLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  serviceNumber: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
  },
  moreButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  moreButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#FFFFFF',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  couponsScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  coupon: {
    width: 180,
    height: 160,
    backgroundColor: '#4285F4',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    justifyContent: 'space-between',
  },
  couponDark: {
    backgroundColor: '#2A2A2A',
  },
  couponPlaceholder: {
    width: 120,
    height: 160,
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: 16,
    justifyContent: 'flex-end',
    marginRight: 12,
  },
  couponDiscount: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
  },
  couponService: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    marginTop: 8,
  },
  couponDetail: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#9CA3AF',
    marginTop: 'auto',
  },
  couponBrandDark: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  couponInfoDark: {
    flex: 1,
  },
  couponTypeDark: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 4,
  },
  couponPriceDark: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
  },
  couponTimeDark: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
  couponDetailDark: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(255,255,255,0.5)',
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