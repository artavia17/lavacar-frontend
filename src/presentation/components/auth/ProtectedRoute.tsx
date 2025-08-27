import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { authService } from '../../../infrastructure/services/AuthService';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedUserTypes: ('user' | 'agent')[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedUserTypes 
}) => {
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      console.log('🔐 ProtectedRoute: Checking authentication...');
      const authResult = await authService.checkAuthenticationStatus();

      console.log('🔐 ProtectedRoute auth result:', {
        isAuthenticated: authResult.isAuthenticated,
        userType: authResult.userType,
        allowedUserTypes,
      });

      if (!authResult.isAuthenticated || !authResult.userType) {
        // No autenticado, redirigir a login
        console.log('❌ Not authenticated, redirecting to login');
        router.replace('/(auth)/login');
        return;
      }

      if (!allowedUserTypes.includes(authResult.userType)) {
        // Usuario no autorizado para esta ruta
        console.log('❌ User type not allowed, redirecting to correct dashboard');
        if (authResult.userType === 'agent') {
          router.replace('/(protected)/(agent)');
        } else {
          router.replace('/(protected)/(user)');
        }
        return;
      }

      console.log('✅ Authentication successful, showing protected content');
      setIsAuthorized(true);
    } catch (error) {
      console.error('❌ Error checking auth:', error);
      router.replace('/(auth)/login');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
});