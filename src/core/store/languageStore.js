import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RNLocalize from 'react-native-localize';
import i18n from '../../localization/i18n';

export const useLanguageStore = create((set, get) => ({
  language: 'en',
  initialized: false,

  setLanguage: async (lang) => {
    set({language: lang});
    await i18n.changeLanguage(lang);
    await AsyncStorage.setItem('language', lang);
  },

  initLanguage: async () => {
    const saved = await AsyncStorage.getItem('language');
    const locales = RNLocalize.getLocales();
    const deviceLang = locales[0]?.languageCode;

    let finalLang = 'en';
    if (saved && ['en', 'sw', 'zh'].includes(saved)) {
      finalLang = saved;
    } else if (deviceLang === 'zh') {
      finalLang = 'zh';
    } else if (deviceLang === 'sw') {
      finalLang = 'sw';
    }

    set({language: finalLang, initialized: true});
    await i18n.changeLanguage(finalLang);
  },
}));
