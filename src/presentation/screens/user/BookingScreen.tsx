import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Coupon, couponService } from '../../../infrastructure/services/CouponService';
import { CouponModal } from '../../components/common/CouponModal';
import { useTabScroll } from '../../contexts/TabScrollContext';
import { useError } from '../../providers/ErrorProvider';

export const BookingScreen: React.FC = () => {
  const { setIsScrolled } = useTabScroll();
  const insets = useSafeAreaInsets();
  const { showError } = useError();

  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    try {
      setLoading(true);
      const response = await couponService.getAllCoupons();
      setCoupons(response.data);
    } catch (error) {
      console.error('Error loading coupons:', error);
      showError('Error', 'No se pudieron cargar los cupones');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadCoupons();
    } catch (error) {
      console.error('Error refreshing coupons:', error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleScroll = (event: any) => {
    const { contentOffset } = event.nativeEvent;
    const currentScrollY = contentOffset.y;
    setIsScrolled(currentScrollY > 10);
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
    router.push(`/(protected)/coupon/${coupon.id}`);
  };

  // Categorizar cupones por tipo de servicio
  const categorizeCoupons = () => {
    const categories = {
      lavado: coupons.filter(coupon => 
        coupon.title.toLowerCase().includes('lavado') && 
        !coupon.title.toLowerCase().includes('encerado') &&
        !coupon.title.toLowerCase().includes('lustrado')
      ),
      lustrado: coupons.filter(coupon => 
        coupon.title.toLowerCase().includes('encerado') || 
        coupon.title.toLowerCase().includes('lustrado')
      ),
      interior: coupons.filter(coupon => 
        coupon.title.toLowerCase().includes('interior') ||
        coupon.title.toLowerCase().includes('rines')
      )
    };
    return categories;
  };

  const categories = categorizeCoupons();

  const renderCouponSection = (title: string, coupons: Coupon[]) => {
    if (coupons.length === 0) return null;

    return (
      <View style={styles.section} key={title}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.couponsScroll}
          contentContainerStyle={styles.couponsScrollContent}
        >
          {coupons.map((coupon) => (
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
      </View>
    );
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
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4285F4" />
          </View>
        ) : (
          <>
            {renderCouponSection('Lavado', categories.lavado)}
            {renderCouponSection('Lustrado', categories.lustrado)}
            {renderCouponSection('Interior', categories.interior)}
          </>
        )}
      </ScrollView>

      {/* Coupon Modal */}
      <CouponModal
        visible={showCouponModal}
        coupon={selectedCoupon}
        onClose={handleCloseCouponModal}
        onViewCoupon={handleViewCoupon}
      />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: 'Poppins-Bold',
    color: '#1A1A1A',
    marginBottom: 1,
  },
  couponsScroll: {
    marginHorizontal: -20,
  },
  couponsScrollContent: {
    paddingHorizontal: 20,
  },
  couponContainer: {
    marginRight: 16,
    alignItems: 'flex-start',
  },
  coupon: {
    width: 160,
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 8,
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
    marginTop: 0,
  },
});