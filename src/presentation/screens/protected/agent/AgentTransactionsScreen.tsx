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
} from 'react-native';
import {
  CurrencyDollarIcon,
  TicketIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
} from 'react-native-heroicons/outline';
import { agentTransactionService, AgentTransaction } from '../../../../infrastructure/services/AgentTransactionService';
import { authService } from '../../../../infrastructure/services/AuthService';
import { useAlert } from '../../../providers/ErrorProvider';

export const AgentTransactionsScreen: React.FC = () => {
  const [transactions, setTransactions] = useState<AgentTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'redemption' | 'coupon'>('all');
  const { alert } = useAlert();

  const loadTransactions = useCallback(async () => {
    try {
      // Check if user is authenticated before loading
      const token = await authService.getCurrentToken();
      if (!token) {
        console.log('🚫 No token available, skipping transaction load');
        return;
      }

      setLoading(true);
      const response = await agentTransactionService.getTransactions(); // Use default limit from API
      
      if (response.success && response.data) {
        const transactions = response.data.data || response.data;
        const transactionArray = Array.isArray(transactions) ? transactions : [];
        
        // Remove duplicates by id and ensure unique keys
        const uniqueTransactions = transactionArray.filter((transaction, index, self) => 
          index === self.findIndex(t => t.id === transaction.id)
        );
        
        console.log(`✅ Loaded ${uniqueTransactions.length} unique transactions`);
        setTransactions(uniqueTransactions);
      } else {
        console.error('Error loading transactions:', response.message);
        alert('Error', response.message || 'No se pudieron cargar las transacciones');
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
      alert('Error', 'Error de conexión al cargar transacciones');
    } finally {
      setLoading(false);
    }
  }, []); // Remove alert from dependencies

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadTransactions();
    setRefreshing(false);
  }, [loadTransactions]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true;
    return transaction.type === filter;
  });

  const formatTransactionDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionIcon = (type: string) => {
    return type === 'redemption' ? 
      <CurrencyDollarIcon size={24} color="#4285F4" /> : 
      <TicketIcon size={24} color="#34C759" />;
  };

  const getTransactionColor = (type: string) => {
    return type === 'redemption' ? '#4285F4' : '#34C759';
  };

  const getFilterButtonStyle = (filterType: 'all' | 'redemption' | 'coupon') => {
    return [
      styles.filterButton,
      filter === filterType && styles.filterButtonActive
    ];
  };

  const getFilterTextStyle = (filterType: 'all' | 'redemption' | 'coupon') => {
    return [
      styles.filterText,
      filter === filterType && styles.filterTextActive
    ];
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Transacciones</Text>
        <Text style={styles.subtitle}>
          Historial completo de canjes y cupones procesados
        </Text>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersScroll}
        >
          <TouchableOpacity
            style={getFilterButtonStyle('all')}
            onPress={() => setFilter('all')}
          >
            <Text style={getFilterTextStyle('all')}>
              Todas ({transactions.length})
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={getFilterButtonStyle('redemption')}
            onPress={() => setFilter('redemption')}
          >
            <CurrencyDollarIcon size={16} color={filter === 'redemption' ? '#FFFFFF' : '#4285F4'} />
            <Text style={getFilterTextStyle('redemption')}>
              Canjes ({transactions.filter(t => t.type === 'redemption').length})
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={getFilterButtonStyle('coupon')}
            onPress={() => setFilter('coupon')}
          >
            <TicketIcon size={16} color={filter === 'coupon' ? '#FFFFFF' : '#34C759'} />
            <Text style={getFilterTextStyle('coupon')}>
              Cupones ({transactions.filter(t => t.type === 'coupon').length})
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Transactions List */}
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
        {filteredTransactions.length > 0 ? (
          <View style={styles.transactionsList}>
            {filteredTransactions.map((transaction) => (
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
                      Placa: {transaction.license_plate}
                    </Text>
                    <Text style={styles.transactionDate}>
                      {formatTransactionDate(transaction.transaction_date)}
                    </Text>
                  </View>
                  <View style={styles.transactionMeta}>
                    <View style={[
                      styles.transactionBadge,
                      { backgroundColor: getTransactionColor(transaction.type) }
                    ]}>
                      <Text style={styles.transactionBadgeText}>
                        {transaction.type === 'redemption' ? 'Canje' : 'Cupón'}
                      </Text>
                    </View>
                    <Text style={styles.transactionStatus}>
                      {transaction.status === 'completed' ? 'Completado' : transaction.status}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.transactionDetails}>
                  {transaction.points && (
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Puntos:</Text>
                      <Text style={styles.detailPoints}>
                        {transaction.points} pts
                      </Text>
                    </View>
                  )}
                  {transaction.value && (
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Valor:</Text>
                      <Text style={styles.detailValue}>
                        ${parseFloat(transaction.value).toLocaleString()}
                      </Text>
                    </View>
                  )}
                  {transaction.points_before !== undefined && transaction.points_after !== undefined && (
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Puntos:</Text>
                      <Text style={styles.detailPointsChange}>
                        {transaction.points_before} → {transaction.points_after}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <MagnifyingGlassIcon size={48} color="#C7C7CC" />
            </View>
            <Text style={styles.emptyTitle}>
              {filter === 'all' ? 'No hay transacciones' : `No hay ${filter === 'redemption' ? 'canjes' : 'cupones'}`}
            </Text>
            <Text style={styles.emptySubtitle}>
              {filter === 'all' 
                ? 'Las transacciones procesadas aparecerán aquí'
                : `Los ${filter === 'redemption' ? 'canjes' : 'cupones'} procesados aparecerán aquí`
              }
            </Text>
          </View>
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
  filtersContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E9EA',
  },
  filtersScroll: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    gap: 6,
  },
  filterButtonActive: {
    backgroundColor: '#4285F4',
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#6C7278',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  transactionsList: {
    gap: 16,
  },
  transactionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  transactionHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  transactionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  transactionPlate: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#6C7278',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#9CA3AF',
  },
  transactionMeta: {
    alignItems: 'flex-end',
  },
  transactionBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 4,
  },
  transactionBadgeText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
  transactionStatus: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#34C759',
  },
  transactionDetails: {
    flexDirection: 'row',
    gap: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#6C7278',
  },
  detailPoints: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#FF9500',
  },
  detailValue: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#34C759',
  },
  detailPointsChange: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#4285F4',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#6C7278',
    textAlign: 'center',
    lineHeight: 24,
  },
});