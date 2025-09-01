import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { CheckCircleIcon } from 'react-native-heroicons/outline';

interface SimpleSuccessModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

const { width } = Dimensions.get('window');

export const SimpleSuccessModal: React.FC<SimpleSuccessModalProps> = ({
  visible,
  onClose,
  title,
  message,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      statusBarTranslucent={true}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Success Icon */}
          <View style={styles.successIcon}>
            <CheckCircleIcon size={64} color="#34C759" />
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.closeButtonText}>Continuar</Text>
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
    padding: 32,
    width: width * 0.85,
    maxWidth: 350,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  successIcon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#6C7278',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  closeButton: {
    backgroundColor: '#34C759',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 40,
    minWidth: 120,
    shadowColor: '#34C759',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  closeButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});