import React from 'react';
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';

interface QRCouponModalProps {
  visible: boolean;
  onClose: () => void;
  couponId: number;
  vehiclePlate: string;
  expirationDate: string | null;
}

const { width } = Dimensions.get('window');

export const QRCouponModal: React.FC<QRCouponModalProps> = ({
  visible,
  onClose,
  couponId,
  vehiclePlate,
  expirationDate,
}) => {
  // Create QR data as JSON string
  const qrData = JSON.stringify({
    license_plate: vehiclePlate,
    coupon_id: couponId.toString(),
  });

  const formatExpiration = (expirationDate: string | null) => {
    if (!expirationDate) return 'Sin fecha de expiración';
    
    try {
      const date = new Date(expirationDate);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `Válido hasta ${day}/${month}/${year}`;
    } catch {
      return 'Sin fecha de expiración';
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      statusBarTranslucent={true}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Tipo de cupón</Text>
          
          <View style={styles.qrContainer}>
            <QRCode
              value={qrData}
              size={200}
              color="#000000"
              backgroundColor="#FFFFFF"
            />
          </View>

          <Text style={styles.expiration}>
            {formatExpiration(expirationDate)}
          </Text>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
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
    padding: 24,
    width: width * 0.85,
    maxWidth: 350,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 24,
  },
  qrContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  expiration: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 24,
  },
  closeButton: {
    backgroundColor: '#4285F4',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 40,
    minWidth: 120,
  },
  closeButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});