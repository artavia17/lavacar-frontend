import { router } from 'expo-router';
import React from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { ChevronLeftIcon, CheckIcon } from 'react-native-heroicons/outline';

interface SelectionItem {
  label: string;
  value: string;
}

interface SelectionScreenProps {
  title: string;
  items: SelectionItem[];
  selectedValue?: string;
  onSelect: (value: string) => void;
  searchPlaceholder?: string;
  emptyMessage?: string;
}

export const SelectionScreen: React.FC<SelectionScreenProps> = ({
  title,
  items,
  selectedValue,
  onSelect,
  emptyMessage = 'No hay opciones disponibles'
}) => {
  const handleBack = () => {
    router.back();
  };

  const handleSelect = (value: string) => {
    onSelect(value);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ChevronLeftIcon size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {items.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{emptyMessage}</Text>
          </View>
        ) : (
          <View style={styles.itemsContainer}>
            {items.map((item, index) => (
              <TouchableOpacity
                key={item.value}
                style={[
                  styles.item,
                  selectedValue === item.value && styles.itemSelected,
                  index === items.length - 1 && styles.itemLast
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
    </SafeAreaView>
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
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    borderBottomWidth: 0.5,
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#6C7278',
    textAlign: 'center',
  },
  itemsContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  item: {
    paddingVertical: 16,
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