import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { 
  HomeIcon, 
  ClipboardDocumentListIcon, 
  UserIcon 
} from 'react-native-heroicons/outline';

export default function AgentLayout() {
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
            title: 'Dashboard',
            tabBarIcon: ({ color, size }) => (
              <HomeIcon size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="transactions"
          options={{
            title: 'Transacciones',
            tabBarIcon: ({ color, size }) => (
              <ClipboardDocumentListIcon size={size} color={color} />
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