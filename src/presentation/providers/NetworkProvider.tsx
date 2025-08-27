import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

interface NetworkContextType {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  connectionType: string | null;
  isOfflineModalVisible: boolean;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

interface NetworkProviderProps {
  children: ReactNode;
}

export const NetworkProvider: React.FC<NetworkProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(true);
  const [isInternetReachable, setIsInternetReachable] = useState<boolean | null>(true);
  const [connectionType, setConnectionType] = useState<string | null>(null);
  const [isOfflineModalVisible, setIsOfflineModalVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      console.log('📶 Network state changed:', {
        isConnected: state.isConnected,
        isInternetReachable: state.isInternetReachable,
        type: state.type,
        details: state.details,
      });

      setIsConnected(state.isConnected ?? false);
      setIsInternetReachable(state.isInternetReachable);
      setConnectionType(state.type);

      // Show modal automatically when offline
      // Consider connected if isConnected is true and isInternetReachable is not explicitly false
      const hasConnection = state.isConnected && (state.isInternetReachable !== false);
      
      if (!hasConnection) {
        console.log('🚫 No connection detected - showing offline modal');
        setIsOfflineModalVisible(true);
      } else if (hasConnection) {
        console.log('✅ Connection restored - hiding modal');
        setIsOfflineModalVisible(false);
      }
    });

    // Get initial state
    NetInfo.fetch().then((state: NetInfoState) => {
      setIsConnected(state.isConnected ?? false);
      setIsInternetReachable(state.isInternetReachable);
      setConnectionType(state.type);

      const hasConnection = state.isConnected && (state.isInternetReachable !== false);
      if (!hasConnection) {
        console.log('🚫 Initial state - no connection detected');
        setIsOfflineModalVisible(true);
      }
    });

    return () => unsubscribe();
  }, [isOfflineModalVisible]);

  const value: NetworkContextType = {
    isConnected,
    isInternetReachable,
    connectionType,
    isOfflineModalVisible,
  };

  return (
    <NetworkContext.Provider value={value}>
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = (): NetworkContextType => {
  const context = useContext(NetworkContext);
  if (context === undefined) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
};