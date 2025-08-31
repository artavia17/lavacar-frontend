import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CouponDetail, couponService } from '../../../infrastructure/services/CouponService';
import { useError } from '../../providers/ErrorProvider';
import { QRCouponModal } from '../../components/common/QRCouponModal';

interface CouponDetailScreenProps {
  couponId: number;
}

export const CouponDetailScreen: React.FC<CouponDetailScreenProps> = ({ couponId }) => {
  const insets = useSafeAreaInsets();
  const { showError } = useError();
  
  const [coupon, setCoupon] = useState<CouponDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showQRModal, setShowQRModal] = useState(false);

  useEffect(() => {
    loadCouponDetail();
  }, [couponId]);

  const loadCouponDetail = async () => {
    try {
      setLoading(true);
      const response = await couponService.getCouponDetail(couponId);
      setCoupon(response.data);
    } catch (error) {
      console.error('Error loading coupon detail:', error);
      showError('Error', 'No se pudo cargar el detalle del cupón');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleRedeem = () => {
    setShowQRModal(true);
  };

  const handleCloseQRModal = () => {
    setShowQRModal(false);
  };

  const formatExpiration = (expirationDate: string | null) => {
    if (!expirationDate) return 'Sin fecha de expiración';
    
    try {
      const date = new Date(expirationDate);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear().toString().slice(-2);
      return `Válido hasta el ${day}/${month}/${year}`;
    } catch {
      return 'Fecha inválida';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <ActivityIndicator size="large" color="#4285F4" />
      </View>
    );
  }

  if (!coupon) {
    return null;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ChevronLeftIcon size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cupón</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Coupon Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: coupon.cover_image_url }}
            style={styles.couponImage}
            resizeMode="cover"
          />
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>Detalle de cupón</Text>
            <Text style={styles.price}>₡{parseFloat(coupon.price).toLocaleString()}</Text>
          </View>

          <Text style={styles.description}>{coupon.description}</Text>
          
          <Text style={styles.expiration}>
            {formatExpiration(coupon.expiration_date)}
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={[styles.bottomContainer, { paddingBottom: insets.bottom + 20 }]}>
        <TouchableOpacity 
          style={styles.redeemButton}
          onPress={handleRedeem}
          activeOpacity={0.8}
        >
          <Text style={styles.redeemButtonText}>Canjear</Text>
        </TouchableOpacity>
      </View>

      {/* QR Modal */}
      {coupon && (
        <QRCouponModal
          visible={showQRModal}
          onClose={handleCloseQRModal}
          couponId={coupon.id}
          vehiclePlate={coupon.your_vehicle.license_plate}
          expirationDate={coupon.expiration_date}
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
  loadingContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
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
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#1A1A1A',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#F8F9FA',
  },
  couponImage: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
    color: '#1A1A1A',
    flex: 1,
  },
  price: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#1A1A1A',
    marginLeft: 16,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#6C7278',
    lineHeight: 24,
    marginBottom: 24,
  },
  expiration: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#9CA3AF',
    marginBottom: 32,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  redeemButton: {
    backgroundColor: '#4285F4',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  redeemButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
});