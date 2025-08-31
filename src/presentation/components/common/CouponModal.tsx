import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { Coupon } from '../../../infrastructure/services/CouponService';

interface CouponModalProps {
  visible: boolean;
  coupon: Coupon | null;
  onClose: () => void;
  onViewCoupon: (coupon: Coupon) => void;
}

const { width, height } = Dimensions.get('window');

export const CouponModal: React.FC<CouponModalProps> = ({
  visible,
  coupon,
  onClose,
  onViewCoupon,
}) => {
  if (!coupon) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      statusBarTranslucent={true}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: coupon.cover_image_url }}
              style={styles.couponImage}
              resizeMode="cover"
            />
          </View>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.viewCouponButton}
              onPress={() => onViewCoupon(coupon)}
              activeOpacity={0.8}
            >
              <Text style={styles.viewCouponButtonText}>Ver cupón</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    width: width * 0.9,
    maxWidth: 400,
    maxHeight: height * 0.8,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1, // Square aspect ratio
  },
  couponImage: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    padding: 20,
    gap: 12,
  },
  viewCouponButton: {
    backgroundColor: '#4285F4',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  viewCouponButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
  closeButton: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E9EA',
  },
  closeButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#6C7278',
  },
});