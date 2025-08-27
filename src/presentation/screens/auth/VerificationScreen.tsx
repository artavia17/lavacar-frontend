import { router, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect, useRef } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Keyboard,
  Dimensions,
} from 'react-native';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';
import { authService } from '../../../infrastructure/services/AuthService';
import { useAlert } from '../../../presentation/providers/ErrorProvider';

const { height } = Dimensions.get('window');

export const VerificationScreen: React.FC = () => {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [code, setCode] = useState(['', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(20);
  const [canResend, setCanResend] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const { alert } = useAlert();
  
  // Refs for TextInputs to manage focus
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    // Start countdown timer
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (event) => {
      setKeyboardHeight(event.endCoordinates.height);
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setTimeout(() => {
        setKeyboardHeight(0);
      }, 50);
    });

    const keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', () => {
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

  const handleCodeChange = (value: string, index: number) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !code[index] && index > 0) {
      // Focus previous input on backspace
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const verificationCode = code.join('').replace(/\s/g, ''); // Remove any spaces
    
    if (verificationCode.length < 3) {
      alert('Código incompleto', 'Por favor ingresa al menos 3 dígitos del código de verificación');
      return;
    }

    if (!email) {
      alert('Error de datos', 'Email no encontrado. Por favor regresa al registro.');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.verifyEmail({
        email,
        code: verificationCode,
      });

      if (response.success && response.data) {
        // Verificación exitosa - redirigir a dashboard de usuario
        console.log('✅ Email verification successful for user:', response.data.account.email);
        router.replace('/(protected)/(user)');
      } else {
        // Handle validation errors from API
        if (response.errors) {
          const errorMessages = Object.values(response.errors).flat().join('\n');
          alert('Error de validación', errorMessages);
        } else {
          const errorMessage = response.message || 'Código de verificación incorrecto';
          alert('Error de verificación', errorMessage);
        }
      }
    } catch (error) {
      console.error('Verification error:', error);
      alert('Error de conexión', 'No se pudo conectar con el servidor. Verifica tu conexión a internet.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend || !email) return;
    
    try {
      // TODO: Implementar endpoint de reenvío si existe
      // const response = await authService.resendVerificationCode(email);
      
      // Por ahora simular reenvío exitoso
      console.log('Resend code to:', email);
      
      // Reset timer
      setResendTimer(20);
      setCanResend(false);
      
      // Start countdown again
      const timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      alert('Código enviado', 'Hemos enviado un nuevo código a tu correo electrónico', 'Continuar');
    } catch (error) {
      console.error('Resend error:', error);
      alert('Error al enviar', 'No se pudo enviar el código. Inténtalo nuevamente.');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const filledDigits = code.filter(digit => digit !== '').length;
  const isCodeComplete = filledDigits >= 3; // Enable button when at least 3 digits are entered

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ChevronLeftIcon size={24} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={[
        styles.content,
        keyboardHeight > 0 && { paddingBottom: keyboardHeight + 20 }
      ]}>
        <Text style={styles.title}>Enter code</Text>
        
        <Text style={styles.subtitle}>
          Hemos enviado un código al correo{'\n'}
          <Text style={styles.email}>{email || 'ejemplo@gmail.com'}</Text>
        </Text>

        {/* Code Input */}
        <View style={styles.codeContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={[
                styles.codeInput,
                digit && styles.codeInputFilled
              ]}
              value={digit}
              onChangeText={(value) => handleCodeChange(value, index)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
              autoFocus={index === 0}
              placeholderTextColor="#9CA3AF"
            />
          ))}
        </View>

        {/* Resend Code */}
        <View style={styles.resendContainer}>
          <TouchableOpacity onPress={handleResendCode} disabled={!canResend}>
            <Text style={[styles.resendText, !canResend && styles.resendTextDisabled]}>
              Send code again
            </Text>
          </TouchableOpacity>
          <Text style={styles.timerText}>{formatTime(resendTimer)}</Text>
        </View>

        {/* Alternative option */}
        <View style={styles.alternativeContainer}>
          <TouchableOpacity onPress={handleResendCode}>
            <Text style={styles.alternativeText}>
              I didn't receive a code  <Text style={styles.resendLink}>Resend</Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* Verify Button */}
        <TouchableOpacity
          style={[
            styles.verifyButton,
            (!isCodeComplete || loading) && styles.verifyButtonDisabled
          ]}
          onPress={handleVerify}
          disabled={!isCodeComplete || loading}
          activeOpacity={0.8}
        >
          <Text style={styles.verifyButtonText}>Verify</Text>
        </TouchableOpacity>
      </View>
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    color: '#1A1A1A',
    marginBottom: 24,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#6C7278',
    textAlign: 'center',
    marginBottom: 60,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  email: {
    fontFamily: 'Poppins-SemiBold',
    color: '#1A1A1A',
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 48,
    gap: 12,
  },
  codeInput: {
    width: 58,
    height: 58,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E8E9EA',
    backgroundColor: '#FAFAFA',
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  codeInputFilled: {
    borderColor: '#4285F4',
    backgroundColor: '#F8FBFF',
    color: '#1A1A1A',
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  resendText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#6C7278',
    marginRight: 8,
  },
  resendTextDisabled: {
    color: '#9CA3AF',
  },
  timerText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#1A1A1A',
  },
  alternativeContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  alternativeText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
  },
  resendLink: {
    fontFamily: 'Poppins-SemiBold',
    color: '#4285F4',
    textDecorationLine: 'underline',
  },
  verifyButton: {
    height: 56,
    backgroundColor: '#4285F4',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 40,
    marginHorizontal: 0,
    width: '100%',
    shadowColor: '#4285F4',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  verifyButtonDisabled: {
    backgroundColor: '#C4C4C4',
    shadowOpacity: 0,
    elevation: 0,
  },
  verifyButtonText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
});