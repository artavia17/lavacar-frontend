import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export const LoginScreen: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = () => {
    router.push('/(auth)/email-login');
  };

  const handleCreateAccount = () => {
    router.push('/(auth)/register');
  };

  const handleLogin = () => {
    router.push('/(auth)/email-login');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Main Content */}
      <View style={styles.content}>
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>App Logo</Text>
          </View>
          <Text style={styles.subtitle}>
            Now your finances are in one place{'\n'}and always under control
          </Text>
        </View>

        {/* Buttons Section */}
        <View style={styles.buttonsSection}>

          {/* Email Login Button */}
          <TouchableOpacity
            style={styles.emailButton}
            onPress={handleEmailLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.emailButtonText}>Continuar con correo</Text>
            </View>
          </TouchableOpacity>

          {/* Create Account Button */}
          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreateAccount}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.createButtonText}>Crear cuenta</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Already have an account?{' '}
            <Text style={styles.loginLink} onPress={handleLogin}>
              Log in
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoSection: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoPlaceholder: {
    width: width - 64,
    height: 280,
    backgroundColor: '#E8E9EA',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  logoText: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 17,
    color: '#6C7278',
    textAlign: 'center',
    lineHeight: 26,
    fontFamily: 'Poppins-Regular',
    paddingHorizontal: 20,
  },
  buttonsSection: {
    flex: 1,
    justifyContent: 'flex-start',
    gap: 16,
    marginTop: 20,
  },
  googleButton: {
    height: 56,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: '#E8E9EA',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  emailButton: {
    height: 56,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: '#E8E9EA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButton: {
    height: 56,
    backgroundColor: '#4285F4',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconStyle: {
    marginRight: 12,
  },
  googleIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4285F4',
    marginRight: 12,
    fontFamily: 'System',
  },
  googleButtonText: {
    fontSize: 16,
    color: '#1A1A1A',
    fontFamily: 'Poppins-Medium',
  },
  emailButtonText: {
    fontSize: 16,
    color: '#1A1A1A',
    fontFamily: 'Poppins-Medium',
  },
  createButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Poppins-SemiBold',
  },
  footer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  footerText: {
    fontSize: 16,
    color: '#6C7278',
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
  loginLink: {
    color: '#1A1A1A',
    fontFamily: 'Poppins-SemiBold',
    textDecorationLine: 'underline',
  },
});