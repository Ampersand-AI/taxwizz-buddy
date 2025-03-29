
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import enTranslation from './locales/en.json';
import esTranslation from './locales/es.json';
import frTranslation from './locales/fr.json';
import deTranslation from './locales/de.json';
import zhTranslation from './locales/zh.json';
import hiTranslation from './locales/hi.json';
import arTranslation from './locales/ar.json';

i18n
  // detect user language
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next
  .use(initReactI18next)
  // init i18next
  .init({
    resources: {
      en: { 
        translation: enTranslation 
      },
      es: { 
        translation: esTranslation 
      },
      fr: { 
        translation: frTranslation 
      },
      de: { 
        translation: deTranslation 
      },
      zh: { 
        translation: zhTranslation 
      },
      hi: { 
        translation: hiTranslation 
      },
      ar: { 
        translation: arTranslation 
      }
    },
    fallbackLng: 'en',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    }
  });

export default i18n;
