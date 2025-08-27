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
import NetInfo from '@react-native-community/netinfo';
import { WifiIcon, ExclamationTriangleIcon } from 'react-native-heroicons/outline';

const { width, height } = Dimensions.get('window');

interface NetworkStatusModalProps {
  visible?: boolean;
  onRetry?: () => void;
}

export const NetworkStatusModal: React.FC<NetworkStatusModalProps> = ({ 
  visible = false, 
  onRetry
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

  const handleRetry = async () => {
    try {
      onRetry?.();
    } catch (error) {
      console.error('Network check failed:', error);
    }
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
        <View style={styles.backdropTouchable}>
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
            
            {/* Icon */}
            <View style={styles.iconContainer}>
              <View style={styles.iconCircle}>
                <WifiIcon size={32} color="#FF6B6B" strokeWidth={2} />
                <View style={styles.iconOverlay}>
                  <ExclamationTriangleIcon size={20} color="#FF6B6B" strokeWidth={3} />
                </View>
              </View>
            </View>

            {/* Content */}
            <View style={styles.content}>
              <Text style={styles.title}>Sin conexión a internet</Text>
              <Text style={styles.subtitle}>
                Necesitas conexión a internet para usar Lavacar. Verifica tu Wi-Fi o datos móviles y toca "Reintentar".
              </Text>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={handleRetry}
                activeOpacity={0.8}
              >
                <Text style={styles.retryButtonText}>Reintentar</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
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
    maxHeight: height * 0.6,
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
    marginBottom: 24,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF5F5',
    borderWidth: 2,
    borderColor: '#FFE0E0',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  iconOverlay: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFE0E0',
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
  retryButton: {
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
  retryButtonText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
});