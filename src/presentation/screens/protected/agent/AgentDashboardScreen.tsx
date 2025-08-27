import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const AgentDashboardScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Panel de Agente</Text>
      <Text style={styles.subtitle}>Gestiona servicios y clientes</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1A1A1A',
  },
  subtitle: {
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
  },
});