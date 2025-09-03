import React, { useCallback, useEffect, useState } from 'react';
import {
  Dimensions,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  QrCodeIcon,
  TicketIcon
} from 'react-native-heroicons/outline';
import { AgentTransaction, agentTransactionService, ClaimCouponResponse, ClaimRedemptionResponse } from '../../../../infrastructure/services/AgentTransactionService';
import { authService } from '../../../../infrastructure/services/AuthService';
import { QRScanner } from '../../../components/agent/QRScanner';
import { CouponClaimSuccessModal } from '../../../components/common/CouponClaimSuccessModal';
import { LoadingModal } from '../../../components/common/LoadingModal';
import { RedemptionClaimSuccessModal } from '../../../components/common/RedemptionClaimSuccessModal';
import { SimpleSuccessModal } from '../../../components/common/SimpleSuccessModal';
import { useAlert } from '../../../providers/ErrorProvider';

const { width } = Dimensions.get('window');

type ScanMode = 'redemption' | 'coupon' | null;

export const AgentDashboardScreen: React.FC = () => {
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [scanMode, setScanMode] = useState<ScanMode>(null);
  const [recentTransactions, setRecentTransactions] = useState<AgentTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [processingClaim, setProcessingClaim] = useState(false);
  const [showCouponSuccessModal, setShowCouponSuccessModal] = useState(false);
  const [showRedemptionSuccessModal, setShowRedemptionSuccessModal] = useState(false);
  const [showSimpleSuccessModal, setShowSimpleSuccessModal] = useState(false);
  const [simpleSuccessData, setSimpleSuccessData] = useState({ title: '', message: '' });
  const [couponClaimData, setCouponClaimData] = useState<ClaimCouponResponse | null>(null);
  const [redemptionClaimData, setRedemptionClaimData] = useState<ClaimRedemptionResponse | null>(null);
  const { alert } = useAlert();

  const handleScanRedemption = () => {
    setScanMode('redemption');
    setShowQRScanner(true);
  };

  const handleScanCoupon = () => {
    if (processingClaim) return; // Prevent scanning while processing
    setScanMode('coupon');
    setShowQRScanner(true);
  };

  const handleQRScan = (data: string) => {
    // Prevent double processing
    if (processingClaim) {
      console.log('🚫 Already processing, ignoring duplicate scan');
      return;
    }

    console.log('📱 QR Scanned in dashboard:', data);
    setShowQRScanner(false);
    
    try {
      const qrData = JSON.parse(data);
      console.log('📋 Processing QR data:', qrData);
      
      // Process based on scan mode
      if (scanMode === 'redemption') {
        handleRedemptionData(qrData);
      } else if (scanMode === 'coupon') {
        handleCouponData(qrData);
      }
    } catch (error) {
      console.error('❌ Error processing QR data:', error);
      alert('QR Inválido', 'No se pudo procesar la información del código QR');
    }
    
    setScanMode(null);
  };

  const handleRedemptionData = async (qrData: any) => {
    console.log('💰 Processing redemption:', qrData);
    
    // Validate QR data structure
    if (!qrData.license_plate || !qrData.redemption_id) {
      alert(
        'QR Inválido',
        'El código QR no contiene la información necesaria.',
        'Entendido'
      );
      return;
    }

    setProcessingClaim(true);

    try {
      const response = await agentTransactionService.claimRedemption({
        license_plate: qrData.license_plate,
        redemption_id: qrData.redemption_id.toString(),
      });

      if (response.success) {
        // Check if we have the expected claim data structure
        // API returns: { success: true, data: { transaction: {...}, redemption: {...}, account: {...}, vehicle: {...}, agent: {...} } }
        if (response.data && response.data.data && response.data.data.transaction && response.data.data.redemption) {
          // Success - show success modal with proper data
          console.log('✅ Using full redemption success modal with data:', response.data.data);
          setRedemptionClaimData(response.data.data);
          setShowRedemptionSuccessModal(true);
        } else {
          // API returned success but wrong data structure - show simple success modal
          console.log('⚠️ API success but unexpected structure, using simple modal');
          setSimpleSuccessData({
            title: '¡Canje Realizado Exitosamente!',
            message: `El canje ha sido procesado correctamente para el vehículo ${qrData.license_plate}`
          });
          setShowSimpleSuccessModal(true);
        }
        
        // Refresh recent transactions to show the new one
        await loadRecentTransactions();
      } else {
        // Handle API error response
        const errorMessage = response.message || 'Error desconocido al procesar el canje';
        
        // Check if we have detailed error information
        if (response.errors) {
          const errorDetails = Object.entries(response.errors)
            .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
            .join('\n');
          
          alert(
            'Error al Procesar Canje',
            `${errorMessage}\n\nDetalles:\n${errorDetails}`,
            'Entendido'
          );
        } else {
          alert(
            'Error al Procesar Canje',
            errorMessage,
            'Entendido'
          );
        }
      }
    } catch (error) {
      console.error('❌ Error claiming redemption:', error);
      alert(
        'Error de Conexión',
        'No se pudo conectar con el servidor. Verifica tu conexión a internet e intenta nuevamente.',
        'Entendido'
      );
    } finally {
      setProcessingClaim(false);
    }
  };

  const handleCouponData = async (qrData: any) => {
    console.log('💰 Processing redemption:', qrData);
    
    // Validate QR data structure
    if (!qrData.license_plate || !qrData.coupon_id) {
      alert(
        'QR Inválido',
        'El código QR no contiene la información necesaria (license_plate y coupon_id)',
        'Entendido'
      );
      return;
    }

    setProcessingClaim(true);

    try {
      const response = await agentTransactionService.claimCoupon({
        license_plate: qrData.license_plate,
        coupon_id: qrData.coupon_id.toString(),
      });

      if (response.success) {
        // Check if we have the expected claim data structure
        // API returns: { success: true, data: { transaction: {...}, coupon: {...}, account: {...}, vehicle: {...}, agent: {...} } }
        if (response.data && response.data.data && response.data.data.transaction && response.data.data.coupon) {
          // Success - show success modal with proper data
          console.log('✅ Using full coupon success modal with data:', response.data.data);
          setCouponClaimData(response.data.data);
          setShowCouponSuccessModal(true);
        } else {
          // API returned success but wrong data structure - show simple success modal
          console.log('⚠️ API success but unexpected structure, using simple modal');
          setSimpleSuccessData({
            title: '¡Cupón Canjeado Exitosamente!',
            message: `El cupón ha sido procesado correctamente para el vehículo ${qrData.license_plate}`
          });
          setShowSimpleSuccessModal(true);
        }
        
        // Refresh recent transactions to show the new one
        await loadRecentTransactions();
      } else {
        // Handle API error response
        const errorMessage = response.message || 'Error desconocido al procesar el cupón';
        
        // Check if we have detailed error information
        if (response.errors) {
          const errorDetails = Object.entries(response.errors)
            .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
            .join('\n');
          
          alert(
            'Error al Canjear Cupón',
            `${errorMessage}\n\nDetalles:\n${errorDetails}`,
            'Entendido'
          );
        } else {
          alert(
            'Error al Canjear Cupón',
            errorMessage,
            'Entendido'
          );
        }
      }
    } catch (error) {
      console.error('❌ Error claiming coupon:', error);
      alert(
        'Error de Conexión',
        'No se pudo conectar con el servidor. Verifica tu conexión a internet e intenta nuevamente.',
        'Entendido'
      );
    } finally {
      setProcessingClaim(false);
    }
  };

  const handleCloseQRScanner = () => {
    setShowQRScanner(false);
    setScanMode(null);
  };

  const handleCloseCouponSuccessModal = () => {
    setShowCouponSuccessModal(false);
    setCouponClaimData(null);
  };

  const handleCloseRedemptionSuccessModal = () => {
    setShowRedemptionSuccessModal(false);
    setRedemptionClaimData(null);
  };

  const handleCloseSimpleSuccessModal = () => {
    setShowSimpleSuccessModal(false);
    setSimpleSuccessData({ title: '', message: '' });
  };

  const loadRecentTransactions = useCallback(async () => {
    try {
      // Check if user is authenticated before loading
      const token = await authService.getCurrentToken();
      if (!token) {
        console.log('🚫 No token available, skipping transaction load');
        return;
      }

      setLoading(true);
      const response = await agentTransactionService.getRecentTransactions();
      
      if (response.success && response.data) {
        setRecentTransactions(response.data);
      } else {
        console.error('Error loading recent transactions:', response.message);
      }
    } catch (error) {
      console.error('Error loading recent transactions:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadRecentTransactions();
    setRefreshing(false);
  }, [loadRecentTransactions]);

  useEffect(() => {
    loadRecentTransactions();
  }, [loadRecentTransactions]);

  const formatTransactionDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionIcon = (type: string) => {
    return type === 'redemption' ? 
      <CurrencyDollarIcon size={20} color="#4285F4" /> : 
      <TicketIcon size={20} color="#34C759" />;
  };

  const getTransactionColor = (type: string) => {
    return type === 'redemption' ? '#4285F4' : '#34C759';
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#4285F4']}
            tintColor="#4285F4"
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>¡Bienvenido Agente!</Text>
          <Text style={styles.subtitle}>Gestiona canjes y cupones de manera eficiente</Text>
        </View>


        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          
          <View style={styles.actionGrid}>
            <TouchableOpacity 
              style={[styles.quickActionCard, styles.redemptionCard]}
              onPress={handleScanRedemption}
              activeOpacity={0.8}
            >
              <View style={styles.quickActionIcon}>
                <CurrencyDollarIcon size={32} color="#FFFFFF" />
              </View>
              <Text style={styles.quickActionTitle}>Procesar{'\n'}Canje</Text>
              <View style={styles.qrIndicator}>
                <QrCodeIcon size={16} color="rgba(255,255,255,0.8)" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.quickActionCard, styles.couponCard]}
              onPress={handleScanCoupon}
              activeOpacity={0.8}
            >
              <View style={styles.quickActionIcon}>
                <TicketIcon size={32} color="#FFFFFF" />
              </View>
              <Text style={styles.quickActionTitle}>Validar{'\n'}Cupón</Text>
              <View style={styles.qrIndicator}>
                <QrCodeIcon size={16} color="rgba(255,255,255,0.8)" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.activitySection}>
          <Text style={styles.sectionTitle}>Actividad Reciente</Text>
          {recentTransactions.length > 0 ? (
            <View style={styles.transactionsList}>
              {recentTransactions.map((transaction) => (
                <View key={transaction.id} style={styles.transactionCard}>
                  <View style={styles.transactionHeader}>
                    <View style={[
                      styles.transactionIconContainer, 
                      { backgroundColor: `${getTransactionColor(transaction.type)}15` }
                    ]}>
                      {getTransactionIcon(transaction.type)}
                    </View>
                    <View style={styles.transactionInfo}>
                      <Text style={styles.transactionTitle}>
                        {transaction.item_title}
                      </Text>
                      <Text style={styles.transactionPlate}>
                        {transaction.license_plate}
                      </Text>
                    </View>
                    <View style={styles.transactionMeta}>
                      <Text style={[
                        styles.transactionType,
                        { color: getTransactionColor(transaction.type) }
                      ]}>
                        {transaction.type === 'redemption' ? 'Canje' : 'Cupón'}
                      </Text>
                      <Text style={styles.transactionDate}>
                        {formatTransactionDate(transaction.transaction_date)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.transactionDetails}>
                    {transaction.points && (
                      <Text style={styles.transactionPoints}>
                        {transaction.points} puntos
                      </Text>
                    )}
                    {transaction.value && (
                      <Text style={styles.transactionValue}>
                        ${parseFloat(transaction.value).toLocaleString()}
                      </Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <ChartBarIcon size={48} color="#C7C7CC" />
              </View>
              <Text style={styles.emptyTitle}>No hay actividad aún</Text>
              <Text style={styles.emptySubtitle}>
                Los canjes y cupones procesados aparecerán aquí
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* QR Scanner Modal */}
      <QRScanner
        visible={showQRScanner}
        onClose={handleCloseQRScanner}
        onScan={handleQRScan}
      />

      {/* Loading Modal */}
      <LoadingModal
        visible={processingClaim}
        message={"Procesando..."}
      />

      {/* Coupon Success Modal (with full data) */}
      <CouponClaimSuccessModal
        visible={showCouponSuccessModal}
        onClose={handleCloseCouponSuccessModal}
        claimData={couponClaimData}
      />

      {/* Redemption Success Modal (with full data) */}
      <RedemptionClaimSuccessModal
        visible={showRedemptionSuccessModal}
        onClose={handleCloseRedemptionSuccessModal}
        claimData={redemptionClaimData}
      />

      {/* Simple Success Modal (when API returns wrong structure) */}
      <SimpleSuccessModal
        visible={showSimpleSuccessModal}
        onClose={handleCloseSimpleSuccessModal}
        title={simpleSuccessData.title}
        message={simpleSuccessData.message}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#6C7278',
    lineHeight: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: '#6C7278',
    textAlign: 'center',
  },
  actionsSection: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#1A1A1A',
    marginBottom: 20,
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  quickActionCard: {
    flex: 1,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 160,
    position: 'relative',
  },
  redemptionCard: {
    backgroundColor: '#4285F4',
  },
  couponCard: {
    backgroundColor: '#34C759',
  },
  quickActionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  quickActionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 22,
  },
  qrIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  activitySection: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#6C7278',
    textAlign: 'center',
    lineHeight: 20,
  },
  transactionsList: {
    gap: 12,
  },
  transactionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
  },
  transactionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  transactionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  transactionPlate: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#6C7278',
  },
  transactionMeta: {
    alignItems: 'flex-end',
  },
  transactionType: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#6C7278',
  },
  transactionDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  transactionPoints: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#FF9500',
  },
  transactionValue: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#34C759',
  },
});