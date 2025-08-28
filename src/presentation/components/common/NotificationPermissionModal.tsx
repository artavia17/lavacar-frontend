import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { BellIcon } from 'react-native-heroicons/outline';

interface NotificationPermissionModalProps {
  visible: boolean;
  onAllow: () => void;
  onDeny: () => void;
  title?: string;
  message?: string;
}

const { width } = Dimensions.get('window');

export const NotificationPermissionModal: React.FC<NotificationPermissionModalProps> = ({
  visible,
  onAllow,
  onDeny,
  title = 'Permitir Notificaciones',
  message = 'Esta aplicación quiere enviarte notificaciones para mantenerte informado sobre tus servicios de lavado.',
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
          <View style={styles.iconContainer}>
            <BellIcon size={48} color="#4285F4" />
          </View>
          
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.denyButton}
              onPress={onDeny}
              activeOpacity={0.7}
            >
              <Text style={styles.denyButtonText}>No Permitir</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.allowButton}
              onPress={onAllow}
              activeOpacity={0.7}
            >
              <Text style={styles.allowButtonText}>Permitir</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: width * 0.85,
    maxWidth: 340,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EBF3FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
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
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  denyButton: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E9EA',
  },
  denyButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#6C7278',
  },
  allowButton: {
    flex: 1,
    backgroundColor: '#4285F4',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  allowButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
});