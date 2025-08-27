import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  StatusBar,
  Animated,
} from 'react-native';
import { ExclamationTriangleIcon, XMarkIcon, CheckCircleIcon } from 'react-native-heroicons/outline';

const { width, height } = Dimensions.get('window');

interface ErrorModalProps {
  visible?: boolean;
  title?: string;
  message?: string;
  onClose?: () => void;
  buttonText?: string;
  onButtonPress?: () => void;
  type?: 'error' | 'success';
}

export const ErrorModal: React.FC<ErrorModalProps> = ({ 
  visible = false,
  title = 'Error',
  message = 'Ha ocurrido un error inesperado',
  onClose,
  buttonText = 'Entendido',
  onButtonPress,
  type = 'error'
}) => {
  const [slideAnim] = useState(new Animated.Value(height));

  useEffect(() => {
    if (visible) {
      showModal();
    } else {
      hideModal();
    }
  }, [visible]);

  const showModal = () => {
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 65,
      friction: 8,
    }).start();
  };

  const hideModal = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleClose = () => {
    hideModal();
    onClose?.();
  };

  const handleButtonPress = () => {
    hideModal();
    onClose?.();
    onButtonPress?.();
  };

  const handleBackdropPress = () => {
    handleClose();
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
    >
      <StatusBar backgroundColor="rgba(0, 0, 0, 0.5)" barStyle="light-content" />
      
      {/* Backdrop */}
      <View style={styles.backdrop}>
        <TouchableOpacity 
          style={styles.backdropTouchable}
          activeOpacity={1}
          onPress={handleBackdropPress}
        >
          <Animated.View 
            style={[
              styles.modalContainer,
              {
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            {/* Handle Bar */}
            <View style={styles.handleBar} />
            
            {/* Close Button */}
            <TouchableOpacity 
              style={styles.closeIconButton}
              onPress={handleClose}
              activeOpacity={0.7}
            >
              <XMarkIcon size={24} color="#6C7278" strokeWidth={2} />
            </TouchableOpacity>

            {/* Icon */}
            <View style={styles.iconContainer}>
              <View style={[
                styles.iconCircle,
                type === 'success' ? styles.successIconCircle : styles.errorIconCircle
              ]}>
                {type === 'success' ? (
                  <CheckCircleIcon size={32} color="#10B981" strokeWidth={2} />
                ) : (
                  <ExclamationTriangleIcon size={32} color="#FF6B6B" strokeWidth={2} />
                )}
              </View>
            </View>

            {/* Content */}
            <View style={styles.content}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.subtitle}>
                {message}
              </Text>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleButtonPress}
                activeOpacity={0.8}
              >
                <Text style={styles.closeButtonText}>{buttonText}</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  backdropTouchable: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    paddingHorizontal: 24,
    maxHeight: height * 0.7,
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: -4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  handleBar: {
    width: 36,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 8,
  },
  closeIconButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 16,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorIconCircle: {
    backgroundColor: '#FFF5F5',
    borderColor: '#FFE0E0',
  },
  successIconCircle: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  content: {
    alignItems: 'center',
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#6C7278',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 12,
  },
  actions: {
    gap: 12,
  },
  closeButton: {
    height: 56,
    backgroundColor: '#4285F4',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4285F4',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  closeButtonText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
});