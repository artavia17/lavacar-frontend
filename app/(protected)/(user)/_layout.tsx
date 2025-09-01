import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import {
  GiftIcon,
  HomeIcon,
  TicketIcon,
  UserIcon
} from 'react-native-heroicons/outline';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { TabHeader } from '../../../src/presentation/components/common/TabHeader';
import { TabScrollProvider } from '../../../src/presentation/contexts/TabScrollContext';

const TabsWithSafeArea = () => {
  const insets = useSafeAreaInsets();
  
  return (
    <>
      <TabHeader />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: (Platform.OS === 'ios' ? 85 : 70) + insets.bottom,
            backgroundColor: '#FFFFFF',
            borderTopWidth: 1,
            borderTopColor: '#E8E9EA',
            paddingBottom: insets.bottom + (Platform.OS === 'ios' ? 25 : 10),
            paddingTop: 10,
          },
          tabBarActiveTintColor: '#4285F4',
          tabBarInactiveTintColor: '#6C7278',
          tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: 'Poppins-Medium',
            marginTop: 4,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Inicio',
            tabBarIcon: ({ color, size }) => (
              <HomeIcon size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="booking"
          options={{
            title: 'Cupones',
            tabBarIcon: ({ color, size }) => (
              <TicketIcon size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            title: 'Canje',
            tabBarIcon: ({ color, size }) => (
              <GiftIcon size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="account"
          options={{
            title: 'Cuenta',
            tabBarIcon: ({ color, size }) => (
              <UserIcon size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default function UserLayout() {
  return (
    <SafeAreaProvider>
      <TabScrollProvider>
        <TabsWithSafeArea />
      </TabScrollProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});