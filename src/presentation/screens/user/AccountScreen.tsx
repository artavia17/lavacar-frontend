import React, { useCallback, useEffect, useState } from 'react';
import {
  Dimensions,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Transaction, transactionService } from '../../../infrastructure/services/TransactionService';
import { UserVehicle, vehicleService } from '../../../infrastructure/services/VehicleService';
import { TransactionsSectionSkeleton, VehicleHeaderSkeleton } from '../../components/common/SkeletonLoader';
import { useTabScroll } from '../../contexts/TabScrollContext';
import { useError } from '../../providers/ErrorProvider';

const { width } = Dimensions.get('window');

export const AccountScreen: React.FC = () => {
  const { setIsScrolled } = useTabScroll();
  const insets = useSafeAreaInsets();
  const { showError } = useError();

  const [primaryVehicle, setPrimaryVehicle] = useState<UserVehicle | null>(null);
  const [vehicleLoading, setVehicleLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await Promise.all([
      loadPrimaryVehicle(),
      loadTransactions()
    ]);
  };

  const loadPrimaryVehicle = async () => {
    try {
      setVehicleLoading(true);
      const vehicle = await vehicleService.getPrimaryVehicle();
      setPrimaryVehicle(vehicle);
    } catch (error) {
      console.error('Error loading primary vehicle:', error);
      showError('Error', 'No se pudo cargar el vehículo principal');
    } finally {
      setVehicleLoading(false);
    }
  };

  const loadTransactions = async () => {
    try {
      setTransactionsLoading(true);
      const response = await transactionService.getRecentTransactions(6);
      setTransactions(response.data);
    } catch (error) {
      console.error('Error loading transactions:', error);
      showError('Error', 'No se pudieron cargar las transacciones');
    } finally {
      setTransactionsLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadData();
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleScroll = (event: any) => {
    const { contentOffset } = event.nativeEvent;
    const currentScrollY = contentOffset.y;
    setIsScrolled(currentScrollY > 10);
  };

  const formatTransactionDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 
                   'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${date.getDate()} ${months[date.getMonth()]}`;
  };

  const groupTransactionsByMonth = (transactions: Transaction[]) => {
    const grouped: { [key: string]: Transaction[] } = {};
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.created_at);
      const currentDate = new Date();
      const isCurrentMonth = date.getMonth() === currentDate.getMonth() && 
                           date.getFullYear() === currentDate.getFullYear();
      
      let monthKey: string;
      if (isCurrentMonth) {
        monthKey = 'Este mes';
      } else {
        const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                       'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        monthKey = months[date.getMonth()];
      }
      
      if (!grouped[monthKey]) {
        grouped[monthKey] = [];
      }
      grouped[monthKey].push(transaction);
    });
    
    return grouped;
  };


  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView 
        style={styles.content} 
        contentContainerStyle={[
          styles.scrollContent,
          { 
            paddingTop: 80 + insets.top,
            paddingBottom: (Platform.OS === 'ios' ? 110 : 90) + insets.bottom 
          }
        ]}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#4285F4']}
            tintColor="#4285F4"
            progressViewOffset={80 + insets.top}
          />
        }
      >
        {/* Vehicle Header */}
        {vehicleLoading ? (
          <VehicleHeaderSkeleton />
        ) : primaryVehicle ? (
          <View style={styles.vehicleHeader}>
            <Text style={styles.vehicleTitle}>
              {primaryVehicle.brand.name} {primaryVehicle.model.name}
            </Text>
            <Text style={styles.vehiclePlate}>
              Placa: {primaryVehicle.license_plate}
            </Text>
          </View>
        ) : (
          <View style={styles.vehicleHeader}>
            <Text style={styles.vehicleTitle}>Sin vehículo</Text>
            <Text style={styles.vehiclePlate}>No hay vehículo principal</Text>
          </View>
        )}


        {/* Transactions by Month */}
        {transactionsLoading ? (
          <TransactionsSectionSkeleton />
        ) : transactions.length > 0 ? (
          Object.entries(groupTransactionsByMonth(transactions)).map(([month, monthTransactions]) => (
            <View key={month} style={styles.monthSection}>
              <Text style={styles.monthTitle}>{month}</Text>
              
              {monthTransactions.map((transaction) => (
                <View key={transaction.id} style={styles.transactionItem}>
                  <View style={styles.transactionInfo}>
                    <Text style={styles.transactionDescription}>
                      {transaction.description}
                    </Text>
                    <Text style={styles.transactionDate}>
                      {formatTransactionDate(transaction.created_at)}
                    </Text>
                  </View>
                  <Text style={styles.transactionAmount}>
                    {transaction.formatted_points} puntos
                  </Text>
                </View>
              ))}
            </View>
          ))
        ) : (
          <View style={styles.noTransactionsContainer}>
            <Text style={styles.noTransactionsText}>No hay transacciones disponibles</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginTop: Platform.OS === 'android' ? 20 : 0,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {},
  vehicleHeader: {
    marginBottom: 20,
  },
  vehicleTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  vehiclePlate: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#6C7278',
  },
  monthSection: {
    marginBottom: 32,
  },
  monthTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#6C7278',
  },
  transactionAmount: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#1A1A1A',
  },
  noTransactionsContainer: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  noTransactionsText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#6C7278',
    textAlign: 'center',
  },
});