import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from 'react-native-heroicons/outline';
import { Alert } from '../../../infrastructure/services/AlertService';

interface AlertsModalProps {
  visible: boolean;
  onClose: () => void;
  alerts: Alert[];
  onCouponPress?: (couponId: number) => void;
}

const { width, height } = Dimensions.get('window');

export const AlertsModal: React.FC<AlertsModalProps> = ({
  visible,
  onClose,
  alerts,
  onCouponPress,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!alerts || alerts.length === 0) return null;

  const handleNext = () => {
    if (currentIndex < alerts.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleCouponAction = (alert: Alert) => {
    if (alert.type === 'coupon' && onCouponPress) {
      onCouponPress(alert.id);
      onClose(); // Close modal after navigation
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
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <XMarkIcon size={24} color="#6C7278" />
            </TouchableOpacity>
          </View>

          {/* Alerts Content */}
          <View style={styles.contentContainer}>
            <View style={styles.alertSlide}>
              <ScrollView 
                style={styles.alertContent}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.alertScrollContent}
              >
                {/* Alert Image */}
                {alerts[currentIndex].has_image && alerts[currentIndex].alert_image_url && (
                  <View style={styles.imageContainer}>
                    <Image
                      source={{ uri: alerts[currentIndex].alert_image_url }}
                      style={styles.alertImage}
                      resizeMode="cover"
                    />
                  </View>
                )}

                <View style={styles.alertHeader}>
                  <Text style={styles.alertTitle}>{alerts[currentIndex].title}</Text>
                </View>

                {/* Alert Description */}
                <Text style={styles.alertDescription}>{alerts[currentIndex].description}</Text>

                {/* Action Button */}
                {alerts[currentIndex].type === 'coupon' ? (
                  <TouchableOpacity
                    style={styles.couponButton}
                    onPress={() => handleCouponAction(alerts[currentIndex])}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.couponButtonText}>Ver Cupón</Text>
                  </TouchableOpacity>
                ) : ('')}
              </ScrollView>
            </View>
          </View>

          {/* Navigation */}
          {alerts.length > 1 && (
            <View style={styles.navigation}>
              <TouchableOpacity
                style={[styles.navButton, currentIndex === 0 && styles.navButtonDisabled]}
                onPress={handlePrevious}
                disabled={currentIndex === 0}
                activeOpacity={0.7}
              >
                <ChevronLeftIcon size={20} color={currentIndex === 0 ? "#C7C7CC" : "#4285F4"} />
              </TouchableOpacity>

              {/* Page Indicators */}
              <View style={styles.pageIndicators}>
                {alerts.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.pageIndicator,
                      index === currentIndex && styles.pageIndicatorActive
                    ]}
                  />
                ))}
              </View>

              <TouchableOpacity
                style={[styles.navButton, currentIndex === alerts.length - 1 && styles.navButtonDisabled]}
                onPress={handleNext}
                disabled={currentIndex === alerts.length - 1}
                activeOpacity={0.7}
              >
                <ChevronRightIcon size={20} color={currentIndex === alerts.length - 1 ? "#C7C7CC" : "#4285F4"} />
              </TouchableOpacity>
            </View>
          )}
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
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    maxHeight: height * 0.85,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#1A1A1A',
  },
  closeButton: {
    padding: 4,
  },
  slider: {
    flex: 1,
  },
  sliderContent: {
    flexGrow: 1,
  },
  contentContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
  },
  alertSlide: {
    width: '100%',
  },
  alertContent: {
    maxHeight: 500,
  },
  alertScrollContent: {
    padding: 16,
    paddingBottom: 20,
  },
  imageContainer: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  alertImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#F8F9FA',
  },
  alertHeader: {
    marginBottom: 12,
  },
  typeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    marginLeft: 4,
    marginRight: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
  alertTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#1A1A1A',
    lineHeight: 28,
  },
  alertDescription: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#6C7278',
    lineHeight: 22,
    marginBottom: 16,
  },
  couponData: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  couponDataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  couponLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#6C7278',
  },
  couponPrice: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#34C759',
  },
  couponPoints: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#FF9500',
  },
  couponButton: {
    backgroundColor: '#34C759',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#34C759',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  couponButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
  alertButton: {
    backgroundColor: '#4285F4',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  alertButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
  navigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  navButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonDisabled: {
    backgroundColor: '#F0F0F0',
  },
  pageIndicators: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pageIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E5EA',
    marginHorizontal: 4,
  },
  pageIndicatorActive: {
    backgroundColor: '#4285F4',
    width: 20,
  },
});