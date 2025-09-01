import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Keyboard,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { CheckIcon, ChevronLeftIcon, EyeIcon, EyeSlashIcon } from 'react-native-heroicons/outline';
import { authService } from '../../../infrastructure/services/AuthService';
import { VehicleBrand, VehicleModel, vehicleService, VehicleType } from '../../../infrastructure/services/VehicleService';
import { useAlert } from '../../../presentation/providers/ErrorProvider';
import { SelectInput, SelectItem } from '../../components/common/SelectInput';


export const RegisterScreen: React.FC = () => {
  const { alert } = useAlert();
  const [step, setStep] = useState(1);
  
  // Step 1 - User Data
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  // Step 2 - Vehicle Data
  const [vehicleBrand, setVehicleBrand] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [vehicleYear, setVehicleYear] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  
  // API Data
  const [brands, setBrands] = useState<VehicleBrand[]>([]);
  const [models, setModels] = useState<VehicleModel[]>([]);
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [loadingBrands, setLoadingBrands] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  const [loadingTypes, setLoadingTypes] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [isScrolledTop, setIsScrolledTop] = useState(true);
  const [isScrolledBottom, setIsScrolledBottom] = useState(true);

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

  // Load initial data when component mounts
  useEffect(() => {
    loadBrands();
    loadVehicleTypes();
  }, []);

  const loadBrands = async () => {
    setLoadingBrands(true);
    try {
      const response = await vehicleService.getBrands();
      if (response.success && response.data) {
        setBrands(response.data);
      } else {
        alert('Error', response.message || 'No se pudieron cargar las marcas de vehículos');
      }
    } catch (error) {
      console.error('Error loading brands:', error);
      alert('Error', 'Error al cargar las marcas de vehículos');
    } finally {
      setLoadingBrands(false);
    }
  };

  const loadModels = async (brandId: number) => {
    setLoadingModels(true);
    try {
      const response = await vehicleService.getModelsByBrand(brandId.toString());
      if (response.success && response.data) {
        setModels(response.data);
      } else {
        alert('Error', response.message || 'No se pudieron cargar los modelos de vehículos');
      }
    } catch (error) {
      console.error('Error loading models:', error);
      alert('Error', 'Error al cargar los modelos de vehículos');
    } finally {
      setLoadingModels(false);
    }
  };

  const loadVehicleTypes = async () => {
    setLoadingTypes(true);
    try {
      const response = await vehicleService.getVehicleTypes();
      if (response.success && response.data) {
        setVehicleTypes(response.data);
      } else {
        alert('Error', response.message || 'No se pudieron cargar los tipos de vehículos');
      }
    } catch (error) {
      console.error('Error loading vehicle types:', error);
      alert('Error', 'Error al cargar los tipos de vehículos');
    } finally {
      setLoadingTypes(false);
    }
  };

  const handleBack = () => {
    if (step === 1) {
      router.back();
    } else {
      setStep(1);
    }
  };

  const validateStep1 = () => {
    if (!nombre.trim()) {
      alert('Error', 'Por favor ingresa tu nombre');
      return false;
    }
    if (!apellidos.trim()) {
      alert('Error', 'Por favor ingresa tus apellidos');
      return false;
    }
    if (!email.trim()) {
      alert('Error', 'Por favor ingresa tu email');
      return false;
    }
    if (!phone.trim()) {
      alert('Error', 'Por favor ingresa tu número de teléfono');
      return false;
    }
    if (phone.replace(/\D/g, '').length !== 8) {
      alert('Error', 'El número de teléfono debe tener 8 dígitos');
      return false;
    }
    if (!password.trim()) {
      alert('Error', 'Por favor ingresa tu contraseña');
      return false;
    }
    if (!confirmPassword.trim()) {
      alert('Error', 'Por favor confirma tu contraseña');
      return false;
    }
    if (password !== confirmPassword) {
      alert('Error', 'Las contraseñas no coinciden');
      return false;
    }
    if (!acceptTerms) {
      alert('Error', 'Debes aceptar los términos y condiciones');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!vehicleBrand) {
      alert('Error', 'Por favor selecciona la marca del vehículo');
      return false;
    }
    if (!vehicleModel) {
      alert('Error', 'Por favor selecciona el modelo del vehículo');
      return false;
    }
    if (!vehicleType) {
      alert('Error', 'Por favor selecciona el tipo de vehículo');
      return false;
    }
    if (!vehicleYear.trim()) {
      alert('Error', 'Por favor ingresa el año del vehículo');
      return false;
    }
    if (!vehiclePlate.trim()) {
      alert('Error', 'Por favor ingresa la placa del vehículo');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      handleRegister();
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      const userData = {
        first_name: nombre,
        last_name: apellidos,
        email,
        phone, // Send phone with hyphen format to API
        password,
        password_confirmation: confirmPassword,
        vehicle_brand_id: vehicleBrand,
        vehicle_model_id: vehicleModel,
        vehicle_type_id: vehicleType,
        vehicle_year: vehicleYear,
        license_plate: vehiclePlate
      };

      const response = await authService.register(userData);

      if (response.success) {
        // Mostrar modal de éxito con mensaje de verificación
        alert(
          'Cuenta creada exitosamente', 
          'Se ha enviado un correo de verificación a tu email. Por favor revisa tu bandeja de entrada y verifica tu cuenta.',
          'Aceptar',
          () => {
            // Redirigir al login cuando se presiona el botón
            router.push('/(auth)/login');
          },
          'success'
        );
      } else {
        // Mostrar errores de validación específicos
        if (response.errors) {
          // Mostrar el primer error encontrado
          const firstErrorKey = Object.keys(response.errors)[0];
          const firstError = response.errors[firstErrorKey][0];
          alert('Error de Validación', firstError);
        } else {
          // Mensaje de error genérico
          const errorMessage = response.message || 'Error al crear la cuenta';
          alert('Error', errorMessage);
        }
      }
    } catch (error) {
      console.error('Register error:', error);
      alert('Error', 'Error de conexión. Verifica tu internet.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    router.push('/(auth)/email-login');
  };

  const formatPhoneNumber = (value: string) => {
    // Remove all non-numeric characters
    const numbersOnly = value.replace(/\D/g, '');
    
    // Limit to 8 digits
    const limited = numbersOnly.substring(0, 8);
    
    // Add hyphen after 4 digits
    if (limited.length > 4) {
      return `${limited.substring(0, 4)}-${limited.substring(4)}`;
    }
    
    return limited;
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    setPhone(formatted);
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Convert API data to SelectInput format
  const brandItems: SelectItem[] = brands.map(brand => ({
    label: brand.name,
    value: brand.id.toString()
  }));

  const modelItems: SelectItem[] = models.map(model => ({
    label: model.name,
    value: model.id.toString()
  }));

  const typeItems: SelectItem[] = vehicleTypes.map(type => ({
    label: type.name,
    value: type.id.toString()
  }));

  const handleBrandSelect = (value: string, label: string) => {
    setVehicleBrand(value);
    setVehicleModel(''); // Reset model when brand changes
    
    // Load models for selected brand
    const brandId = parseInt(value);
    if (brandId) {
      loadModels(brandId);
    }
  };

  const handleModelSelect = (value: string, label: string) => {
    setVehicleModel(value);
  };

  const handleTypeSelect = (value: string, label: string) => {
    setVehicleType(value);
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
          keyboardHeight > 0 && { marginBottom: keyboardHeight + 80 }
        ]}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: keyboardHeight > 0 ? 20 : 120 }
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Create account</Text>

          {step === 1 ? (
            <>
              {/* Step 1: User Data */}
              
              {/* Nombre Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Nombre</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.textInput}
                    value={nombre}
                    onChangeText={setNombre}
                    placeholder="Your username"
                    autoCapitalize="words"
                    autoComplete="given-name"
                  />
                </View>
              </View>

              {/* Apellidos Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Apellidos</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.textInput}
                    value={apellidos}
                    onChangeText={setApellidos}
                    placeholder="Your username"
                    autoCapitalize="words"
                    autoComplete="family-name"
                  />
                </View>
              </View>

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.textInput}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Your email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                  />
                </View>
              </View>

              {/* Phone Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Teléfono</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.textInput}
                    value={phone}
                    onChangeText={handlePhoneChange}
                    placeholder="xxxx-xxxx"
                    keyboardType="phone-pad"
                    autoComplete="tel"
                    maxLength={9} // 4 digits + hyphen + 4 digits
                  />
                </View>
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Contraseña</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.textInput}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="••••••••"
                    secureTextEntry={!showPassword}
                    autoComplete="new-password"
                  />
                  <TouchableOpacity 
                    style={styles.iconContainer}
                    onPress={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <EyeIcon size={20} color="#6C7278" />
                    ) : (
                      <EyeSlashIcon size={20} color="#6C7278" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirm Password Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirmar contraseña</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.textInput}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="••••••••"
                    secureTextEntry={!showConfirmPassword}
                    autoComplete="new-password"
                  />
                  <TouchableOpacity 
                    style={styles.iconContainer}
                    onPress={toggleConfirmPasswordVisibility}
                  >
                    {showConfirmPassword ? (
                      <EyeIcon size={20} color="#6C7278" />
                    ) : (
                      <EyeSlashIcon size={20} color="#6C7278" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Terms and Conditions */}
              <TouchableOpacity 
                style={styles.checkboxContainer}
                onPress={() => setAcceptTerms(!acceptTerms)}
              >
                <View style={[styles.checkbox, acceptTerms && styles.checkboxActive]}>
                  {acceptTerms && <CheckIcon size={16} color="#FFFFFF" />}
                </View>
                <Text style={styles.checkboxText}>
                  I accept the terms and privacy policy
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {/* Step 2: Vehicle Data */}
              
              {/* Vehicle Brand Select */}
              <SelectInput
                label="Marca"
                value={vehicleBrand}
                placeholder={loadingBrands ? "Cargando marcas..." : "Selecciona una marca"}
                items={brandItems}
                onSelect={handleBrandSelect}
                screenTitle="Seleccionar Marca"
                disabled={loadingBrands}
              />

              {/* Vehicle Model Select */}
              <SelectInput
                key={`model-${vehicleBrand}`}
                label="Modelo"
                value={vehicleModel}
                placeholder={
                  loadingModels ? "Cargando modelos..." : 
                  !vehicleBrand ? "Selecciona una marca primero" : 
                  "Selecciona un modelo"
                }
                items={modelItems}
                onSelect={handleModelSelect}
                disabled={!vehicleBrand || loadingModels}
                screenTitle="Seleccionar Modelo"
              />

              {/* Vehicle Type Select */}
              <SelectInput
                label="Tipo de vehículo"
                value={vehicleType}
                placeholder={loadingTypes ? "Cargando tipos..." : "Selecciona un tipo"}
                items={typeItems}
                onSelect={handleTypeSelect}
                disabled={loadingTypes}
                screenTitle="Seleccionar Tipo"
              />

              {/* Vehicle Year Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Año</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.textInput}
                    value={vehicleYear}
                    onChangeText={setVehicleYear}
                    placeholder="2024"
                    keyboardType="numeric"
                    maxLength={4}
                  />
                </View>
              </View>

              {/* Vehicle Plate Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Placa</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.textInput}
                    value={vehiclePlate}
                    onChangeText={setVehiclePlate}
                    placeholder="ABC-123"
                    autoCapitalize="characters"
                  />
                </View>
              </View>
            </>
          )}

        </View>
      </ScrollView>

      {/* Fixed Footer Button */}
      <View style={[
        styles.fixedFooter,
        !isScrolledBottom && styles.footerWithBorder,
        keyboardHeight > 0 && { bottom: keyboardHeight + 40 }
      ]}>
        <TouchableOpacity
          style={[styles.actionButton, loading && styles.actionButtonDisabled]}
          onPress={handleNext}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Text style={styles.actionButtonText}>
            {step === 1 ? 'Siguiente' : 'Crear cuenta'}
          </Text>
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#E8E9EA',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: '#4285F4',
    borderColor: '#4285F4',
  },
  checkboxText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#6C7278',
    flex: 1,
  },
  fixedFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  footerWithBorder: {
    borderTopWidth: 1,
    borderTopColor: '#E8E9EA',
  },
  actionButton: {
    height: 56,
    backgroundColor: '#4285F4',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonDisabled: {
    backgroundColor: '#A0A0A0',
  },
  actionButtonText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 50,
    paddingTop: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#6C7278',
    textAlign: 'center',
  },
  loginLink: {
    fontFamily: 'Poppins-SemiBold',
    color: '#1A1A1A',
    textDecorationLine: 'underline',
  },
});