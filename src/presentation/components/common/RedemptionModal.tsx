import React from 'react';
import {
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Redemption } from '../../../infrastructure/services/RedemptionService';

interface RedemptionModalProps {
  visible: boolean;
  redemption: Redemption | null;
  onClose: () => void;
  onRedeem: (redemption: Redemption) => void;
}

const { width, height } = Dimensions.get('window');

export const RedemptionModal: React.FC<RedemptionModalProps> = ({
  visible,
  redemption,
  onClose,
  onRedeem,
}) => {
  if (!redemption) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      statusBarTranslucent={true}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.contentContainer}>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: redemption.background_image_url }}
                style={styles.redemptionImage}
                resizeMode="cover"
              />
            </View>
            
            <Text style={styles.title}>{redemption.title}</Text>
            
            <Text style={styles.description}>{redemption.description}</Text>
          </View>
          
          <View style={styles.buttonContainer}>
            {redemption.user_can_redeem ? (
              <TouchableOpacity
                style={styles.viewRedemptionButton}
                onPress={() => onRedeem(redemption)}
                activeOpacity={0.8}
              >
                <Text style={styles.viewRedemptionButtonText}>Ver cupón</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.disabledButton}
                activeOpacity={1}
              >
                <Text style={styles.disabledButtonText}>
                  Necesitas {redemption.points_required} puntos para canjear
                </Text>
              </TouchableOpacity>
            )}
            
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
  contentContainer: {
    padding: 16,
  },
  imageContainer: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  redemptionImage: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#1A1A1A',
    textAlign: 'left',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#6C7278',
    textAlign: 'left',
    lineHeight: 20,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  viewRedemptionButton: {
    backgroundColor: '#4285F4',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  viewRedemptionButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
  disabledButton: {
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  disabledButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#9CA3AF',
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