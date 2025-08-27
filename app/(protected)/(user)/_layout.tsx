import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { 
  HomeIcon, 
  CalendarIcon, 
  ClockIcon,
  UserIcon 
} from 'react-native-heroicons/outline';

export default function UserLayout() {
  return (
    <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: Platform.select({
            ios: {
              position: 'absolute',
            },
            default: {},
          }),
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
            title: 'Solicitar',
            tabBarIcon: ({ color, size }) => (
              <CalendarIcon size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            title: 'Historial',
            tabBarIcon: ({ color, size }) => (
              <ClockIcon size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Perfil',
            tabBarIcon: ({ color, size }) => (
              <UserIcon size={size} color={color} />
            ),
          }}
        />
      </Tabs>
  );
}