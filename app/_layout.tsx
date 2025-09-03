import React from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import {
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';

import { useColorScheme } from '@/hooks/useColorScheme';
import { NetworkProvider } from '../src/presentation/providers/NetworkProvider';
import { NetworkStatusModal } from '../src/presentation/components/common/NetworkStatusModal';
import { useNetwork } from '../src/presentation/providers/NetworkProvider';
import { ErrorProvider } from '../src/presentation/providers/ErrorProvider';
import { ErrorModal } from '../src/presentation/components/common/ErrorModal';
import { useError } from '../src/presentation/providers/ErrorProvider';
import { NotificationProvider } from '../src/presentation/providers/NotificationProvider';

const AppContent: React.FC = () => {
  const colorScheme = useColorScheme();
  const { isOfflineModalVisible } = useNetwork();
  const { isErrorVisible, errorData, hideError } = useError();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(protected)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
      
      <NetworkStatusModal 
        visible={isOfflineModalVisible}
        onRetry={async () => {
          console.log('🔄 Retrying connection...');
          try {
            const NetInfo = await import('@react-native-community/netinfo');
            const state = await NetInfo.default.fetch();
            const connected = state.isConnected && (state.isInternetReachable !== false);
            
            if (connected) {
              console.log('✅ Connection restored!');
            } else {
              console.log('❌ Still no connection');
            }
          } catch (error) {
            console.error('Error checking network:', error);
          }
        }}
      />
      
      <ErrorModal 
        visible={isErrorVisible}
        title={errorData.title}
        message={errorData.message}
        buttonText={errorData.buttonText}
        onButtonPress={errorData.onButtonPress}
        type={errorData.type}
        onClose={hideError}
      />
    </ThemeProvider>
  );
};

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    'Poppins-Light': Poppins_300Light,
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-Medium': Poppins_500Medium,
    'Poppins-SemiBold': Poppins_600SemiBold,
    'Poppins-Bold': Poppins_700Bold,
  });

  if (!loaded) {
    return null;
  }

  return (
    <ErrorProvider>
      <NetworkProvider>
        <NotificationProvider>
          <AppContent />
        </NotificationProvider>
      </NetworkProvider>
    </ErrorProvider>
  );
}
