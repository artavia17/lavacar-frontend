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
    router.push('/(protected)/profile');
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    zIndex: 1000,
  },
  headerWithBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#E8E9EA',
  },
  logo: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#4285F4',
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});