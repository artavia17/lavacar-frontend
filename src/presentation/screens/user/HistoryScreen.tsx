import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { CheckCircleIcon, ClockIcon, XCircleIcon } from 'react-native-heroicons/outline';

const mockHistory = [
  {
    id: '1',
    service: 'Lavado Completo',
    date: '2024-01-15',
    time: '10:30 AM',
    price: '$25.000',
    status: 'completed',
    vehicle: 'Toyota Prado - BMC120'
  },
  {
    id: '2',
    service: 'Lavado de Rines',
    date: '2024-01-12',
    time: '2:00 PM',
    price: '$15.000',
    status: 'completed',
    vehicle: 'Toyota Prado - BMC120'
  },
  {
    id: '3',
    service: 'Lavado Completo',
    date: '2024-01-08',
    time: '11:00 AM',
    price: '$25.000',
    status: 'cancelled',
    vehicle: 'Toyota Prado - BMC120'
  },
  {
    id: '4',
    service: 'Lavado de Rines',
    date: '2024-01-05',
    time: '3:30 PM',
    price: '$15.000',
    status: 'pending',
    vehicle: 'Toyota Prado - BMC120'
  },
];

export const HistoryScreen: React.FC = () => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon size={24} color="#10B981" />;
      case 'pending':
        return <ClockIcon size={24} color="#F59E0B" />;
      case 'cancelled':
        return <XCircleIcon size={24} color="#EF4444" />;
      default:
        return <ClockIcon size={24} color="#6C7278" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completado';
      case 'pending':
        return 'Pendiente';
      case 'cancelled':
        return 'Cancelado';
      default:
        return 'Desconocido';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#10B981';
      case 'pending':
        return '#F59E0B';
      case 'cancelled':
        return '#EF4444';
      default:
        return '#6C7278';
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Historial de Servicios</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {mockHistory.map((item) => (
          <TouchableOpacity key={item.id} style={styles.historyCard}>
            <View style={styles.historyHeader}>
              <View style={styles.historyInfo}>
                <Text style={styles.historyService}>{item.service}</Text>
                <Text style={styles.historyVehicle}>{item.vehicle}</Text>
              </View>
              <View style={styles.historyStatus}>
                {getStatusIcon(item.status)}
              </View>
            </View>
            
            <View style={styles.historyDetails}>
              <View style={styles.historyDetailItem}>
                <Text style={styles.historyDetailLabel}>Fecha:</Text>
                <Text style={styles.historyDetailValue}>{item.date}</Text>
              </View>
              <View style={styles.historyDetailItem}>
                <Text style={styles.historyDetailLabel}>Hora:</Text>
                <Text style={styles.historyDetailValue}>{item.time}</Text>
              </View>
              <View style={styles.historyDetailItem}>
                <Text style={styles.historyDetailLabel}>Estado:</Text>
                <Text style={[styles.historyDetailValue, { color: getStatusColor(item.status) }]}>
                  {getStatusText(item.status)}
                </Text>
              </View>
            </View>
            
            <View style={styles.historyFooter}>
              <Text style={styles.historyPrice}>{item.price}</Text>
              <TouchableOpacity style={styles.detailButton}>
                <Text style={styles.detailButtonText}>Ver detalles</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
        
        {/* Empty state if no history */}
        {mockHistory.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Sin servicios aún</Text>
            <Text style={styles.emptySubtitle}>Cuando solicites un servicio aparecerá aquí</Text>
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
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#1A1A1A',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  historyCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E8E9EA',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  historyInfo: {
    flex: 1,
  },
  historyService: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  historyVehicle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#6C7278',
  },
  historyStatus: {
    marginLeft: 16,
  },
  historyDetails: {
    marginBottom: 16,
  },
  historyDetailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  historyDetailLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#6C7278',
  },
  historyDetailValue: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#1A1A1A',
  },
  historyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E8E9EA',
  },
  historyPrice: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#4285F4',
  },
  detailButton: {
    backgroundColor: '#4285F4',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  detailButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
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
  },
});