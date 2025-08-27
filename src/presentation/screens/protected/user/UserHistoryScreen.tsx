import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function UserHistoryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial de Servicios</Text>
      <Text style={styles.subtitle}>Ver servicios anteriores</Text>
    </View>
  );
}

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
    fontFamily: 'Poppins-Bold',
    marginBottom: 10,
    color: '#1A1A1A',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#6C757D',
    textAlign: 'center',
  },
});