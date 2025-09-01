import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Keyboard,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { ChevronLeftIcon, EyeIcon, EyeSlashIcon } from 'react-native-heroicons/outline';
import { authService } from '../../../infrastructure/services/AuthService';
import { useAlert } from '../../../presentation/providers/ErrorProvider';

const { height } = Dimensions.get('window');

export const EmailLoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState<'agent' | 'user'>('user');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [isScrolledTop, setIsScrolledTop] = useState(true);
  const [isScrolledBottom, setIsScrolledBottom] = useState(true);
  const { alert } = useAlert();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (event) => {
      setKeyboardHeight(event.endCoordinates.height);
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      // Forzar reset del estado después de un pequeño delay
      setTimeout(() => {
        setKeyboardHeight(0);
      }, 50);
    });

    const keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', () => {
      // Preparar el reset inmediatamente
      setKeyboardHeight(0);
    });

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
      keyboardWillHideListener?.remove();
    };
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handleLogin = async () => {
    if (userType === 'user' && !email.trim()) {
      alert('Campo requerido', 'Por favor ingresa tu email');
      return;
    }
    if (userType === 'agent' && !code.trim()) {
      alert('Campo requerido', 'Por favor ingresa tu código de agente');
      return;
    }
    if (!password.trim()) {
      alert('Campo requerido', 'Por favor ingresa tu contraseña');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.login({
        email: userType === 'user' ? email.trim() : undefined,
        code: userType === 'agent' ? code.trim() : undefined,
        password: password.trim(),
        userType,
      });

      if (response.success && response.data) {
        // Login exitoso - redirigir según tipo de usuario
        if (userType === 'agent') {
          console.log('✅ Agent login successful:', response.data.account.email);
          router.replace('/(protected)/(agent)');
        } else {
          console.log('✅ User login successful:', response.data.account.email);
          router.replace('/(protected)/(user)');
        }
      } else {
        // Check if it's a 403 status for unverified account
        if (response.status === 403) {
          // Show success modal for email verification
          alert(
            'Cuenta no verificada',
            'Tu cuenta no está verificada. Te hemos enviado un nuevo email de verificación a tu correo electrónico. Por favor revisa tu bandeja de entrada.',
            'Entendido',
            undefined,
            'success'
          );
          return; // Prevent further execution
        } else if (response.errors) {
          // Handle other validation errors from API
          const errorMessages = Object.values(response.errors).flat().join('\n');
          alert('Error de validación', errorMessages);
          return; // Prevent further execution
        } else {
          const errorMessage = response.message || 'Credenciales incorrectas';
          alert('Error de login', errorMessage);
          return; // Prevent further execution
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Error de conexión', 'No se pudo conectar con el servidor. Verifica tu conexión a internet.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.push('/(auth)/forgot-password');
  };

  const handleSignUp = () => {
    router.push('/(auth)/register');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleScroll = (event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const currentScrollY = contentOffset.y;
    setScrollY(currentScrollY);
    
    // Check if scrolled from top
    setIsScrolledTop(currentScrollY <= 10);
    
    // Check if scrolled to bottom
    const isAtBottom = currentScrollY + layoutMeasurement.height >= contentSize.height - 10;
    setIsScrolledBottom(isAtBottom);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={[
        styles.header,
        !isScrolledTop && styles.headerWithBorder
      ]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ChevronLeftIcon size={24} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView 
        style={[
          styles.scrollView,
          keyboardHeight > 0 && { marginBottom: keyboardHeight + 80 } // Más espacio para el footer
        ]}
        contentContainerStyle={[
          styles.scrollContent,
          keyboardHeight > 0 && { paddingBottom: 20 } // Padding adicional cuando hay teclado
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View style={styles.content}>
        <Text style={styles.title}>Log in</Text>

        {/* User Type Selector */}
        <View style={styles.userTypeContainer}>
          <Text style={styles.label}>Tipo de usuario</Text>
          <View style={styles.userTypeSelector}>
            <TouchableOpacity
              style={[
                styles.userTypeOption,
                userType === 'user' && styles.userTypeOptionActive
              ]}
              onPress={() => setUserType('user')}
            >
              <Text style={[
                styles.userTypeText,
                userType === 'user' && styles.userTypeTextActive
              ]}>
                Usuario
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.userTypeOption,
                userType === 'agent' && styles.userTypeOptionActive
              ]}
              onPress={() => setUserType('agent')}
            >
              <Text style={[
                styles.userTypeText,
                userType === 'agent' && styles.userTypeTextActive
              ]}>
                Agente
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Email Input (only for users) */}
        {userType === 'user' && (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email address</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>
          </View>
        )}

        {/* Code Input (only for agents) */}
        {userType === 'agent' && (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Agent Code</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                value={code}
                onChangeText={setCode}
                placeholder="Enter your agent code"
                autoCapitalize="characters"
                autoComplete="off"
              />
            </View>
          </View>
        )}


        {/* Password Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry={!showPassword}
              autoComplete="password"
            />
            <TouchableOpacity 
              style={styles.iconContainer}
              onPress={togglePasswordVisibility}
            >
              {
                showPassword ? (
                  <EyeIcon size={20} color="#6C7278" />
                ) : (
                  <EyeSlashIcon size={20} color="#6C7278" />
                )
              }
            </TouchableOpacity>
          </View>
        </View>

        {/* Forgot Password */}
        <TouchableOpacity style={styles.forgotContainer} onPress={handleForgotPassword}>
          <Text style={styles.forgotText}>Forgot password?</Text>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity
          style={[styles.loginButton, loading && styles.loginButtonDisabled]}
          onPress={handleLogin}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Text style={styles.loginButtonText}>Log in</Text>
        </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={[
        styles.footer,
        !isScrolledBottom && styles.footerWithBorder,
        keyboardHeight > 0 && { 
          position: 'absolute',
          bottom: keyboardHeight + 30,
          left: 0,
          right: 0,
          paddingBottom: 20,
          backgroundColor: '#FFFFFF'
        }
      ]}>
        <Text style={styles.footerText}>
          Don't have an account?{' '}
          <Text style={styles.signUpLink} onPress={handleSignUp}>
            Sign up
          </Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  headerWithBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#E8E9EA',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    color: '#1A1A1A',
    marginBottom: 32,
  },
  userTypeContainer: {
    marginBottom: 24,
  },
  userTypeSelector: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 4,
  },
  userTypeOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  userTypeOptionActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userTypeText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#6C7278',
  },
  userTypeTextActive: {
    color: '#1A1A1A',
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E8E9EA',
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  textInput: {
    flex: 1,
    height: 56,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#1A1A1A',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  forgotContainer: {
    alignItems: 'flex-end',
    marginBottom: 32,
  },
  forgotText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#1A1A1A',
  },
  loginButton: {
    height: 56,
    backgroundColor: '#4285F4',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonDisabled: {
    backgroundColor: '#A0A0A0',
    shadowOpacity: 0.1,
  },
  loginButtonText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 50,
    paddingTop: 20,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  footerWithBorder: {
    borderTopWidth: 1,
    borderTopColor: '#E8E9EA',
  },
  footerText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#6C7278',
    textAlign: 'center',
  },
  signUpLink: {
    fontFamily: 'Poppins-SemiBold',
    color: '#1A1A1A',
    textDecorationLine: 'underline',
  },
});