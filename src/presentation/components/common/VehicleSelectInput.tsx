import { router } from 'expo-router';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ChevronRightIcon } from 'react-native-heroicons/outline';

export interface VehicleSelectItem {
  label: string;
  value: string;
}

interface VehicleSelectInputProps {
  label: string;
  value?: string;
  placeholder: string;
  items: VehicleSelectItem[];
  onSelect: (value: string, label: string) => void;
  disabled?: boolean;
  screenTitle?: string;
}

export const VehicleSelectInput: React.FC<VehicleSelectInputProps> = ({
  label,
  value,
  placeholder,
  items,
  onSelect,
  disabled = false,
  screenTitle,
}) => {
  const selectedItem = items.find(item => item.value === value);
  const displayText = selectedItem ? selectedItem.label : placeholder;
  
  const handlePress = () => {
    if (disabled || items.length === 0) return;
    
    // Create a unique key for this selection
    const selectionKey = `selection_${Date.now()}`;
    
    // Store selection data globally (temporary solution)
    if (!(global as any).pendingVehicleSelections) {
      (global as any).pendingVehicleSelections = {};
    }
    
    (global as any).pendingVehicleSelections[selectionKey] = {
      title: screenTitle || `Seleccionar ${label}`,
      items,
      selectedValue: value,
      onSelect: (selectedValue: string) => {
        const selectedItem = items.find(item => item.value === selectedValue);
        if (selectedItem) {
          onSelect(selectedValue, selectedItem.label);
        }
        // Clean up
        delete (global as any).pendingVehicleSelections[selectionKey];
      }
    };
    
    // Navigate to selection screen
    router.push({
      pathname: '/(protected)/vehicle-selection',
      params: { selectionKey }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={[
          styles.selectButton,
          disabled && styles.selectButtonDisabled
        ]}
        onPress={handlePress}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.selectButtonText,
          !value && styles.placeholderText,
          disabled && styles.disabledText
        ]}>
          {displayText}
        </Text>
        <ChevronRightIcon 
          size={20} 
          color={disabled ? '#C4C4C4' : '#6C7278'} 
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: '#E8E9EA',
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    height: 56,
  },
  selectButtonDisabled: {
    backgroundColor: '#F8F9FA',
    borderColor: '#E0E0E0',
  },
  selectButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#1A1A1A',
    flex: 1,
  },
  placeholderText: {
    color: '#9CA3AF',
  },
  disabledText: {
    color: '#C4C4C4',
  },
});