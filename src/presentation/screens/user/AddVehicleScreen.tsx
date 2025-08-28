import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';
import { router } from 'expo-router';
import { VehicleService, VehicleBrand, VehicleModel, VehicleType } from '../../../infrastructure/services/VehicleService';
import { useError } from '../../providers/ErrorProvider';
import { VehicleSelectInput, VehicleSelectItem } from '../../components/common/VehicleSelectInput';

interface FormData {
  vehicle_brand_id: string;
  vehicle_model_id: string;
  vehicle_type_id: string;
  license_plate: string;
  year: string;
  color?: string;
}

export const AddVehicleScreen: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    vehicle_brand_id: '',
    vehicle_model_id: '',
    vehicle_type_id: '',
    license_plate: '',
    year: '',
    color: '',
  });

  const [brands, setBrands] = useState<VehicleBrand[]>([]);
  const [models, setModels] = useState<VehicleModel[]>([]);
  const [types, setTypes] = useState<VehicleType[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [loadingBrands, setLoadingBrands] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  const [loadingTypes, setLoadingTypes] = useState(false);

  const [scrollY, setScrollY] = useState(0);
  const [isScrolledTop, setIsScrolledTop] = useState(true);
  const [isScrolledBottom, setIsScrolledBottom] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const { showError } = useError();

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

  const handleScroll = (event: any) => {
    const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
    const currentScrollY = contentOffset.y;
    setScrollY(currentScrollY);
    
    // Check if scrolled from top
    setIsScrolledTop(currentScrollY <= 10);
    
    // Check if scrolled to bottom
    const isAtBottom = currentScrollY + layoutMeasurement.height >= contentSize.height - 10;
    setIsScrolledBottom(isAtBottom);
  };

  useEffect(() => {
    loadBrands();
    loadTypes();
  }, []);

  const loadBrands = async () => {
    setLoadingBrands(true);
    try {
      const brandsData = await VehicleService.getBrands();
      setBrands(brandsData);
    } catch (error) {
      showError('Error al cargar las marcas');
    } finally {
      setLoadingBrands(false);
    }
  };

  const loadModels = async (brandId: string) => {
    if (!brandId) return;
    
    try {
      setLoadingModels(true);
      const modelsData = await VehicleService.getModelsByBrand(brandId);
      setModels(modelsData);
    } catch (error) {
      showError('Error al cargar los modelos');
    } finally {
      setLoadingModels(false);
    }
  };

  const loadTypes = async () => {
    setLoadingTypes(true);
    try {
      const typesData = await VehicleService.getVehicleTypes();
      setTypes(typesData);
    } catch (error) {
      showError('Error al cargar los tipos');
    } finally {
      setLoadingTypes(false);
    }
  };

  // Convert API data to VehicleSelectInput format
  const brandItems: VehicleSelectItem[] = brands.map(brand => ({
    label: brand.name,
    value: brand.id.toString()
  }));

  const modelItems: VehicleSelectItem[] = models.map(model => ({
    label: model.name,
    value: model.id.toString()
  }));

  const typeItems: VehicleSelectItem[] = types.map(type => ({
    label: type.name,
    value: type.id.toString()
  }));

  const handleBrandSelect = (value: string, label: string) => {
    setFormData(prev => ({
      ...prev,
      vehicle_brand_id: value,
      vehicle_model_id: '', // Reset model when brand changes
    }));
    setModels([]);
    loadModels(value);
  };

  const handleModelSelect = (value: string, label: string) => {
    setFormData(prev => ({
      ...prev,
      vehicle_model_id: value,
    }));
  };

  const handleTypeSelect = (value: string, label: string) => {
    setFormData(prev => ({
      ...prev,
      vehicle_type_id: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.vehicle_brand_id || !formData.vehicle_model_id || !formData.vehicle_type_id || !formData.license_plate || !formData.year) {
      showError('Por favor completa todos los campos obligatorios');
      return;
    }

    try {
      setLoading(true);
      
      const vehicleData = await VehicleService.createVehicle({
        vehicle_brand_id: parseInt(formData.vehicle_brand_id),
        vehicle_model_id: parseInt(formData.vehicle_model_id),
        vehicle_type_id: parseInt(formData.vehicle_type_id),
        license_plate: formData.license_plate,
        year: parseInt(formData.year),
        color: formData.color || undefined,
      });
      
      showError('Éxito', 'Vehículo agregado correctamente', 'Entendido', () => {
        router.back();
      }, 'success');
    } catch (error: any) {
      console.log('🔍 Error details:', error);
      console.log('🔍 Error response:', error?.response?.data);
      
      // Handle validation errors from API
      if (error?.response?.data?.errors) {
        const errors = error.response.data.errors;
        
        if (errors.license_plate) {
          showError('Error de Validación', 'Esta placa ya está registrada');
        } else if (errors.vehicle_brand_id) {
          showError('Error de Validación', 'Selecciona una marca válida');
        } else if (errors.vehicle_model_id) {
          showError('Error de Validación', 'Selecciona un modelo válido');
        } else if (errors.vehicle_type_id) {
          showError('Error de Validación', 'Selecciona un tipo válido');
        } else if (errors.year) {
          showError('Error de Validación', 'El año del vehículo no es válido');
        } else {
          // Show first validation error if we don't have specific handling
          const firstErrorKey = Object.keys(errors)[0];
          const firstErrorMessage = errors[firstErrorKey][0];
          showError('Error de Validación', firstErrorMessage);
        }
      } else if (error?.response?.data?.message) {
        showError('Error', error.response.data.message);
      } else {
        showError('Error', 'Ha ocurrido un error inesperado al agregar el vehículo');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
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
          <Text style={styles.title}>Detalles del vehículo</Text>

          {/* Vehicle Brand Select */}
          <VehicleSelectInput
            label="Marca"
            value={formData.vehicle_brand_id}
            placeholder={loadingBrands ? "Cargando marcas..." : "Selecciona una marca"}
            items={brandItems}
            onSelect={handleBrandSelect}
            disabled={loadingBrands}
          />

          {/* Vehicle Model Select */}
          <VehicleSelectInput
            key={`model-${formData.vehicle_brand_id}`}
            label="Modelo"
            value={formData.vehicle_model_id}
            placeholder={
              loadingModels ? "Cargando modelos..." : 
              !formData.vehicle_brand_id ? "Primero selecciona una marca" :
              models.length === 0 ? "Sin modelos disponibles" :
              "Selecciona un modelo"
            }
            items={modelItems}
            onSelect={handleModelSelect}
            disabled={!formData.vehicle_brand_id || loadingModels}
          />

          {/* Vehicle Type Select */}
          <VehicleSelectInput
            label="Tipo de vehículo"
            value={formData.vehicle_type_id}
            placeholder={loadingTypes ? "Cargando tipos..." : "Selecciona un tipo"}
            items={typeItems}
            onSelect={handleTypeSelect}
            disabled={loadingTypes}
          />

          {/* License Plate Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Placa</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                value={formData.license_plate}
                onChangeText={(text) => setFormData(prev => ({ ...prev, license_plate: text.toUpperCase() }))}
                placeholder="Número Placa"
                autoCapitalize="characters"
                maxLength={10}
              />
            </View>
          </View>

          {/* Year Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Año</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                value={formData.year}
                onChangeText={(text) => setFormData(prev => ({ ...prev, year: text }))}
                placeholder="Año del vehículo"
                keyboardType="numeric"
                maxLength={4}
              />
            </View>
          </View>

          {/* Color Input (Optional) */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Color (Opcional)</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                value={formData.color}
                onChangeText={(text) => setFormData(prev => ({ ...prev, color: text }))}
                placeholder="Color del vehículo"
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Footer Button */}
      <View style={[
        styles.footer,
        keyboardHeight > 0 && { bottom: keyboardHeight },
        !isScrolledBottom && styles.footerWithBorder
      ]}>
        <TouchableOpacity 
          style={[
            styles.nextButton,
            loading && styles.nextButtonDisabled
          ]} 
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.nextButtonText}>Agregar</Text>
          )}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  scrollView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-SemiBold',
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
    borderWidth: 1.5,
    borderColor: '#E8E9EA',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  textInput: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#1A1A1A',
    paddingHorizontal: 16,
    height: 56,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  footerWithBorder: {
    borderTopWidth: 1,
    borderTopColor: '#E8E9EA',
  },
  nextButton: {
    backgroundColor: '#4285F4',
    borderRadius: 12,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonDisabled: {
    opacity: 0.6,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
});