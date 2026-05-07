import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import fr from './locales/fr.json';
import en from './locales/en.json';

const resources = {
  fr: { translation: fr },
  en: { translation: en },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: Localization.getLocales()[0].languageCode, // default language based on device
    fallbackLng: 'en',
    compatibilityJSON: 'v3', // Required for React Native Android
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
