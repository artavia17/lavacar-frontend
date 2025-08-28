import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  TextInput,
  Keyboard,
} from 'react-native';
import { ChevronLeftIcon, CheckIcon, MagnifyingGlassIcon, XMarkIcon } from 'react-native-heroicons/outline';

interface SelectionItem {
  label: string;
  value: string;
}

interface SelectionData {
  title: string;
  items: SelectionItem[];
  selectedValue?: string;
  onSelect: (value: string) => void;
}

export default function VehicleSelectionScreen() {
  const { selectionKey } = useLocalSearchParams<{ selectionKey: string }>();
  const [selectionData, setSelectionData] = useState<SelectionData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    if (selectionKey && (global as any).pendingVehicleSelections) {
      const data = (global as any).pendingVehicleSelections[selectionKey];
      if (data) {
        setSelectionData(data);
      }
    }
  }, [selectionKey]);

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

  const handleSelect = (value: string) => {
    if (selectionData?.onSelect) {
      selectionData.onSelect(value);
    }
    router.back();
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  // Filter items based on search query
  const filteredItems = selectionData?.items.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (!selectionData) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando...</Text>
        </View>
      </View>
    );
  }

  const { title, selectedValue } = selectionData;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ChevronLeftIcon size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <MagnifyingGlassIcon size={20} color="#6C7278" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={`Buscar ${title.toLowerCase()}...`}
            placeholderTextColor="#9CA3AF"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity style={styles.clearButton} onPress={clearSearch}>
              <XMarkIcon size={18} color="#6C7278" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Content */}
      <ScrollView 
        style={[
          styles.scrollView,
          keyboardHeight > 0 && { marginBottom: keyboardHeight }
        ]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {filteredItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery ? `No se encontraron resultados para "${searchQuery}"` : 'No hay opciones disponibles'}
            </Text>
          </View>
        ) : (
          <View style={styles.itemsContainer}>
            {filteredItems.map((item, index) => (
              <TouchableOpacity
                key={item.value}
                style={[
                  styles.item,
                  selectedValue === item.value && styles.itemSelected,
                  index === filteredItems.length - 1 && styles.itemLast
                ]}
                onPress={() => handleSelect(item.value)}
                activeOpacity={0.7}
              >
                <View style={styles.itemContent}>
                  <Text style={[
                    styles.itemText,
                    selectedValue === item.value && styles.itemTextSelected
                  ]}>
                    {item.label}
                  </Text>
                  {selectedValue === item.value && (
                    <View style={styles.checkContainer}>
                      <CheckIcon size={20} color="#4285F4" />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#6C7278',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
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
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#1A1A1A',
    textAlign: 'center',
    marginHorizontal: 16,
  },
  headerRight: {
    width: 40,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E8E9EA',
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E8E9EA',
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    height: 48,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#1A1A1A',
    padding: 0,
  },
  clearButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  emptyContainer: {
    paddingVertical: 60,
    paddingHorizontal: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#6C7278',
    textAlign: 'center',
    lineHeight: 24,
  },
  itemsContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  item: {
    paddingVertical: 18,
    paddingHorizontal: 0,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F0F0F0',
  },
  itemLast: {
    borderBottomWidth: 0,
  },
  itemSelected: {
    backgroundColor: '#F8FBFF',
    borderRadius: 12,
    marginHorizontal: -16,
    paddingHorizontal: 16,
    borderBottomWidth: 0,
    marginBottom: 4,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#1A1A1A',
    flex: 1,
  },
  itemTextSelected: {
    color: '#4285F4',
    fontFamily: 'Poppins-Medium',
  },
  checkContainer: {
    marginLeft: 12,
  },
});