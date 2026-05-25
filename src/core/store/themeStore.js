import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useThemeStore = create((set, get) => ({
  isDark: true,
  initialized: false,

  toggleTheme: async () => {
    const newTheme = !get().isDark;
    set({isDark: newTheme});
    await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
  },

  setTheme: async (isDark) => {
    set({isDark});
    await AsyncStorage.setItem('theme', isDark ? 'dark' : 'light');
  },

  initTheme: async () => {
    const saved = await AsyncStorage.getItem('theme');
    if (saved) {
      set({isDark: saved === 'dark', initialized: true});
    } else {
      set({initialized: true});
    }
  },
}));
