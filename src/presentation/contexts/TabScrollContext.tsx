import React, { createContext, useContext, useState, ReactNode } from 'react';

interface TabScrollContextType {
  isScrolled: boolean;
  setIsScrolled: (scrolled: boolean) => void;
}

const TabScrollContext = createContext<TabScrollContextType | undefined>(undefined);

interface TabScrollProviderProps {
  children: ReactNode;
}

export const TabScrollProvider: React.FC<TabScrollProviderProps> = ({ children }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  const value: TabScrollContextType = {
    isScrolled,
    setIsScrolled,
  };

  return (
    <TabScrollContext.Provider value={value}>
      {children}
    </TabScrollContext.Provider>
  );
};

export const useTabScroll = (): TabScrollContextType => {
  const context = useContext(TabScrollContext);
  if (context === undefined) {
    throw new Error('useTabScroll must be used within a TabScrollProvider');
  }
  return context;
};