import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useThemeStore = create(
  persist(
    (set, get) => ({
      mode: 'dark',
      toggleTheme: () => set({ mode: get().mode === 'dark' ? 'light' : 'dark' }),
      setTheme: (mode) => set({ mode: mode === 'light' ? 'light' : 'dark' }),
    }),
    {
      name: 'ow-theme',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ mode: s.mode }),
    }
  )
);
