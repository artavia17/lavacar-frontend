import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import { CheckCircleIcon, UserIcon, TruckIcon, CurrencyDollarIcon } from 'react-native-heroicons/outline';
import { ClaimRedemptionResponse } from '../../../infrastructure/services/AgentTransactionService';

interface RedemptionClaimSuccessModalProps {
  visible: boolean;
  onClose: () => void;
  claimData: ClaimRedemptionResponse | null;
}

const { width } = Dimensions.get('window');

export const RedemptionClaimSuccessModal: React.FC<RedemptionClaimSuccessModalProps> = ({
  visible,
  onClose,
  claimData,
}) => {
  if (!claimData) return null;

  const { redemption, account, vehicle, agent } = claimData;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      statusBarTranslucent={true}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <ScrollView 
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Success Icon */}
            <View style={styles.successIcon}>
              <CheckCircleIcon size={48} color="#34C759" />
            </View>

            <Text style={styles.title}>¡Canje Realizado Exitosamente!</Text>
            
            {/* Redemption Info */}
            <View style={styles.infoSection}>
              <View style={styles.infoHeader}>
                <CurrencyDollarIcon size={20} color="#4285F4" />
                <Text style={styles.sectionTitle}>Canje</Text>
              </View>
              <Text style={styles.redemptionTitle}>{redemption.title}</Text>
              <Text style={styles.redemptionDescription}>{redemption.description}</Text>
              <View style={styles.redemptionDetails}>
                <Text style={styles.detailLabel}>Puntos utilizados: <Text style={styles.points}>{redemption.points_required}</Text></Text>
              </View>
            </View>

            {/* Customer Info */}
            <View style={styles.infoSection}>
              <View style={styles.infoHeader}>
                <UserIcon size={20} color="#4285F4" />
                <Text style={styles.sectionTitle}>Cliente</Text>
              </View>
              <Text style={styles.customerName}>{account.first_name} {account.last_name}</Text>
              <Text style={styles.customerDetail}>{account.email}</Text>
              <Text style={styles.customerDetail}>{account.phone}</Text>
            </View>

            {/* Vehicle Info */}
            <View style={styles.infoSection}>
              <View style={styles.infoHeader}>
                <TruckIcon size={20} color="#4285F4" />
                <Text style={styles.sectionTitle}>Vehículo</Text>
              </View>
              <Text style={styles.vehiclePlate}>{vehicle.license_plate}</Text>
              <Text style={styles.vehicleDetail}>{vehicle.brand} - {vehicle.type}</Text>
              <Text style={styles.vehiclePoints}>Puntos disponibles: {vehicle.available_points}</Text>
            </View>

            {/* Agent Info */}
            <View style={styles.agentSection}>
              <Text style={styles.agentText}>Procesado por: {agent.name} ({agent.code})</Text>
            </View>
          </ScrollView>

          {/* Fixed Close Button */}
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
    width: width * 0.9,
    maxWidth: 400,
    maxHeight: '80%',
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 8,
  },
  successIcon: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 24,
  },
  infoSection: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#4285F4',
    marginLeft: 8,
  },
  redemptionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  redemptionDescription: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#6C7278',
    lineHeight: 20,
    marginBottom: 8,
  },
  redemptionDetails: {
    alignItems: 'flex-start',
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#1A1A1A',
  },
  points: {
    color: '#FF9500',
    fontFamily: 'Poppins-SemiBold',
  },
  customerName: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  customerDetail: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#6C7278',
    marginBottom: 2,
  },
  vehiclePlate: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  vehicleDetail: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#6C7278',
    marginBottom: 4,
  },
  vehiclePoints: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#FF9500',
  },
  agentSection: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  agentText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: '#6C7278',
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#4285F4',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 40,
    marginTop: 16,
    alignSelf: 'stretch',
  },
  closeButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});