import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { User } from '../../../core/entities/User';
import { container } from '../../../shared/utils/di-container';
import { GetUserUseCase } from '../../../core/usecases/GetUserUseCase';

export const ProfileScreen: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const getUserUseCase = container.resolve<GetUserUseCase>('getUserUseCase');
        const userData = await getUserUseCase.execute('user-123'); // ID de ejemplo
        setUser(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Cargando perfil...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil de Usuario</Text>
      {user && (
        <>
          <Text style={styles.label}>Nombre: {user.name}</Text>
          <Text style={styles.label}>Email: {user.email}</Text>
          <Text style={styles.label}>Estado: {user.isActive ? 'Activo' : 'Inactivo'}</Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  error: {
    color: 'red',
    fontSize: 16,
  },
});