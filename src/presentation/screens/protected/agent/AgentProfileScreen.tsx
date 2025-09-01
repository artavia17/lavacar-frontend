import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import {
  UserIcon,
  MapPinIcon,
  CalendarIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  TicketIcon,
  ClockIcon,
  ArrowRightOnRectangleIcon,
  CheckCircleIcon,
  XCircleIcon,
} from 'react-native-heroicons/outline';
import { agentProfileService, AgentData, AgentStats } from '../../../../infrastructure/services/AgentProfileService';
import { authService } from '../../../../infrastructure/services/AuthService';
import { useAlert } from '../../../providers/ErrorProvider';
import { router } from 'expo-router';

export const AgentProfileScreen: React.FC = () => {
  const [agentData, setAgentData] = useState<AgentData | null>(null);
  const [stats, setStats] = useState<AgentStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { alert } = useAlert();

  const loadProfile = useCallback(async () => {
    try {
      // Check if user is authenticated before loading
      const token = await authService.getCurrentToken();
      if (!token) {
        console.log('🚫 No token available, skipping profile load');
        return;
      }

      setLoading(true);
      const response = await agentProfileService.getAgentProfile();
      
      if (response.success && response.data) {
        setAgentData(response.data.agent);
        setStats(response.data.stats);
      } else {
        console.error('Error loading agent profile:', response.message);
        alert('Error', response.message || 'No se pudo cargar el perfil del agente');
      }
    } catch (error) {
      console.error('Error loading agent profile:', error);
      alert('Error', 'Error de conexión al cargar el perfil');
    } finally {
      setLoading(false);
    }
  }, []); // Remove alert from dependencies

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadProfile();
    setRefreshing(false);
  }, [loadProfile]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            try {
              await authService.logout();
              router.replace('/(auth)/login');
            } catch (error) {
              console.error('Logout error:', error);
              alert('Error', 'No se pudo cerrar sesión correctamente');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#4285F4']}
            tintColor="#4285F4"
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Mi Perfil</Text>
          <Text style={styles.subtitle}>Información del agente y estadísticas</Text>
        </View>

        {agentData && (
          <>
            {/* Agent Info Card */}
            <View style={styles.section}>
              <View style={styles.agentCard}>
                <View style={styles.agentHeader}>
                  <View style={styles.avatarContainer}>
                    <UserIcon size={32} color="#4285F4" />
                  </View>
                  <View style={styles.agentInfo}>
                    <Text style={styles.agentName}>{agentData.name}</Text>
                    <Text style={styles.agentCode}>{agentData.code}</Text>
                    <View style={styles.statusContainer}>
                      {agentData.is_active ? (
                        <>
                          <CheckCircleIcon size={16} color="#34C759" />
                          <Text style={[styles.statusText, { color: '#34C759' }]}>Activo</Text>
                        </>
                      ) : (
                        <>
                          <XCircleIcon size={16} color="#FF3B30" />
                          <Text style={[styles.statusText, { color: '#FF3B30' }]}>Inactivo</Text>
                        </>
                      )}
                    </View>
                  </View>
                </View>

                {agentData.description && (
                  <View style={styles.descriptionContainer}>
                    <Text style={styles.descriptionText}>{agentData.description}</Text>
                  </View>
                )}

                <View style={styles.detailsContainer}>
                  <View style={styles.detailRow}>
                    <MapPinIcon size={20} color="#6C7278" />
                    <Text style={styles.detailText}>{agentData.location}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <CalendarIcon size={20} color="#6C7278" />
                    <Text style={styles.detailText}>
                      Último acceso: {formatDate(agentData.last_login_at)}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <ClockIcon size={20} color="#6C7278" />
                    <Text style={styles.detailText}>
                      Miembro desde: {formatDate(agentData.created_at)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Statistics */}
            {stats && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Estadísticas</Text>
                
                {/* Main Stats Grid */}
                <View style={styles.statsGrid}>
                  <View style={styles.statCard}>
                    <View style={[styles.statIcon, { backgroundColor: '#4285F415' }]}>
                      <ChartBarIcon size={24} color="#4285F4" />
                    </View>
                    <Text style={styles.statNumber}>{stats.total_transactions}</Text>
                    <Text style={styles.statLabel}>Total Transacciones</Text>
                  </View>

                  <View style={styles.statCard}>
                    <View style={[styles.statIcon, { backgroundColor: '#34C75915' }]}>
                      <TicketIcon size={24} color="#34C759" />
                    </View>
                    <Text style={styles.statNumber}>{stats.total_coupon_transactions}</Text>
                    <Text style={styles.statLabel}>Cupones</Text>
                  </View>

                  <View style={styles.statCard}>
                    <View style={[styles.statIcon, { backgroundColor: '#FF950015' }]}>
                      <CurrencyDollarIcon size={24} color="#FF9500" />
                    </View>
                    <Text style={styles.statNumber}>{stats.total_redemption_transactions}</Text>
                    <Text style={styles.statLabel}>Canjes</Text>
                  </View>
                </View>

                {/* Activity Stats */}
                <View style={styles.activityStats}>
                  <View style={styles.activityRow}>
                    <Text style={styles.activityLabel}>Transacciones hoy:</Text>
                    <Text style={styles.activityValue}>{stats.transactions_today}</Text>
                  </View>
                  <View style={styles.activityRow}>
                    <Text style={styles.activityLabel}>Esta semana:</Text>
                    <Text style={styles.activityValue}>{stats.transactions_this_week}</Text>
                  </View>
                  {stats.last_transaction_date && (
                    <View style={styles.lastTransactionRow}>
                      <Text style={styles.activityLabel}>Última transacción:</Text>
                      <Text style={styles.lastTransactionValue}>
                        {formatDate(stats.last_transaction_date)}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            {/* Actions */}
            <View style={styles.section}>
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <ArrowRightOnRectangleIcon size={24} color="#FF3B30" />
                <Text style={styles.logoutText}>Cerrar Sesión</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
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
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E9EA',
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
  section: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  agentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  agentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F0F7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  agentInfo: {
    flex: 1,
  },
  agentName: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  agentCode: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#4285F4',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
  },
  descriptionContainer: {
    marginBottom: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  descriptionText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#6C7278',
    lineHeight: 24,
  },
  detailsContainer: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#6C7278',
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 28,
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
  activityStats: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  activityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastTransactionRow: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  activityLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#6C7278',
  },
  activityValue: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#1A1A1A',
  },
  lastTransactionValue: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#1A1A1A',
    marginTop: 4,
    lineHeight: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    gap: 12,
    shadowColor: '#FF3B30',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#FF3B30',
  },
});