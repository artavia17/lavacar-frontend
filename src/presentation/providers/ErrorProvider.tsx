import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ErrorContextType {
  showError: (title?: string, message?: string, buttonText?: string, onButtonPress?: () => void, type?: 'error' | 'success') => void;
  hideError: () => void;
  isErrorVisible: boolean;
  errorData: {
    title: string;
    message: string;
    buttonText: string;
    onButtonPress?: () => void;
    type: 'error' | 'success';
  };
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

interface ErrorProviderProps {
  children: ReactNode;
}

export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const [errorData, setErrorData] = useState({
    title: 'Error',
    message: 'Ha ocurrido un error inesperado',
    buttonText: 'Entendido',
    onButtonPress: undefined as (() => void) | undefined,
    type: 'error' as 'error' | 'success',
  });

  const showError = (
    title = 'Error',
    message = 'Ha ocurrido un error inesperado',
    buttonText = 'Entendido',
    onButtonPress?: () => void,
    type: 'error' | 'success' = 'error'
  ) => {
    setErrorData({ title, message, buttonText, onButtonPress, type });
    setIsErrorVisible(true);
  };

  const hideError = () => {
    setIsErrorVisible(false);
  };

  const value: ErrorContextType = {
    showError,
    hideError,
    isErrorVisible,
    errorData,
  };

  return (
    <ErrorContext.Provider value={value}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = (): ErrorContextType => {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};

// Utility hook to replace Alert.alert
export const useAlert = () => {
  const { showError } = useError();
  
  return {
    alert: (title: string, message?: string, buttonText = 'Entendido', onButtonPress?: () => void, type: 'error' | 'success' = 'error') => {
      showError(title, message, buttonText, onButtonPress, type);
    }
  };
};