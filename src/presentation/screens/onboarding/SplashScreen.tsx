import { router } from 'expo-router';
import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { authService } from '../../../infrastructure/services/AuthService';

const { width, height } = Dimensions.get('window');

export const SplashScreen: React.FC = () => {
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      console.log('🚀 Checking authentication status...');
      
      // Ensure minimum 5 seconds display time
      const [authResult] = await Promise.all([
        authService.checkAuthenticationStatus(),
        new Promise(resolve => setTimeout(resolve, 2000))
      ]);
      
      console.log('🔐 Auth result:', {
        isAuthenticated: authResult.isAuthenticated,
        userType: authResult.userType,
        hasUserData: !!authResult.userData
      });

      if (authResult.isAuthenticated && authResult.userType) {
        // User is authenticated, redirect based on user type
        if (authResult.userType === 'agent') {
          console.log('👔 Redirecting to agent dashboard...');
          router.replace('/(protected)/(agent)');
        } else {
          console.log('👤 Redirecting to user dashboard...');
          router.replace('/(protected)/(user)');
        }
      } else {
        // User is not authenticated, go to login
        console.log('🚫 User not authenticated, redirecting to login...');
        router.replace('/(auth)/login');
      }
    } catch (error) {
      console.error('❌ Error checking auth status:', error);
      // Ensure minimum time even on error
      await new Promise(resolve => setTimeout(resolve, 2000));
      // On any error, redirect to login for safety
      router.replace('/(auth)/login');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <View style={styles.content}>
        {/* Logo Area */}
        <View style={styles.logoContainer}>
          <Text style={styles.appName}>Welcome!</Text>
        </View>

        {/* Loading Indicator */}
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large" 
            color="#4285F4" 
          />
          <Text style={styles.loadingText}>Verificando cuenta...</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  gradient: {
    flex: 1,
    width: width,
    height: height,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    zIndex: 2,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoText: {
    fontSize: 48,
  },
  appName: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#007BFF',
    marginBottom: 10,
    fontFamily: 'Poppins-Bold',
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontFamily: 'Poppins-Light',
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
});