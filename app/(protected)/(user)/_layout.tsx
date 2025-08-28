import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import { 
  HomeIcon, 
  CalendarIcon, 
  ClockIcon
} from 'react-native-heroicons/outline';
import { TabHeader } from '../../../src/presentation/components/common/TabHeader';
import { TabScrollProvider } from '../../../src/presentation/contexts/TabScrollContext';

export default function UserLayout() {
  return (
    <TabScrollProvider>
      <View style={styles.container}>
        <TabHeader />
        <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: Platform.OS === 'ios' ? 85 : 70,
            backgroundColor: '#FFFFFF',
            borderTopWidth: 1,
            borderTopColor: '#E8E9EA',
            paddingBottom: Platform.OS === 'ios' ? 25 : 10,
            paddingTop: 10,
            elevation: 10,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: -2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 8,
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
      </Tabs>
      </View>
    </TabScrollProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});