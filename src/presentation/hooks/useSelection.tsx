import { router } from 'expo-router';
import { useCallback } from 'react';

export interface SelectionItem {
  label: string;
  value: string;
}

export interface SelectionParams {
  title: string;
  items: SelectionItem[];
  selectedValue?: string;
  onSelect: (value: string) => void;
  emptyMessage?: string;
}

export const useSelection = () => {
  const openSelection = useCallback((params: SelectionParams) => {
    // Store the selection params in a global state or params
    // For now, we'll use router params (this could be improved with a global store)
    router.push({
      pathname: '/(auth)/selection',
      params: {
        title: params.title,
        items: JSON.stringify(params.items),
        selectedValue: params.selectedValue || '',
        emptyMessage: params.emptyMessage || 'No hay opciones disponibles',
        // We need to handle onSelect differently since functions can't be passed through params
        callbackId: Date.now().toString(), // Temporary solution
      }
    });
    
    // Store the callback in a temporary global object (this is a workaround)
    // In a real app, you'd use a proper state management solution
    (global as any).selectionCallbacks = (global as any).selectionCallbacks || {};
    (global as any).selectionCallbacks[Date.now().toString()] = params.onSelect;
  }, []);

  return { openSelection };
};