import { router } from 'expo-router';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Bars3Icon } from 'react-native-heroicons/outline';
import { useTabScroll } from '../../contexts/TabScrollContext';

export const TabHeader: React.FC = () => {
  const { isScrolled } = useTabScroll();
  const handleMenuPress = () => {
    router.push('/(protected)/account');
  };

  return (
    <View style={[
      styles.header,
      isScrolled && styles.headerWithBorder
    ]}>
      <Text style={styles.logo}>Logo</Text>
      <TouchableOpacity style={styles.menuButton} onPress={handleMenuPress}>
        <Bars3Icon size={24} color="#4285F4" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  headerWithBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#E8E9EA',
  },
  logo: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#4285F4',
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});