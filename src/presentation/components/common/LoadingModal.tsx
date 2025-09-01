import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  ActivityIndicator,
  Dimensions,
} from 'react-native';

interface LoadingModalProps {
  visible: boolean;
  message?: string;
}

const { width } = Dimensions.get('window');

export const LoadingModal: React.FC<LoadingModalProps> = ({
  visible,
  message = 'Cargando...',
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
          <ActivityIndicator size="large" color="#4285F4" />
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  message: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#1A1A1A',
    textAlign: 'center',
    marginTop: 16,
  },
});