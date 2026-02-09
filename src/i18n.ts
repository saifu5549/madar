import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import translationEN from './locales/en/translation.json';
import translationHI from './locales/hi/translation.json';
import translationUR from './locales/ur/translation.json';

const resources = {
    en: {
        translation: translationEN
    },
    hi: {
        translation: translationHI
    },
    ur: {
        translation: translationUR
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'hi', // Default to Hindi
        supportedLngs: ['en', 'hi', 'ur'],

        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
        },

        interpolation: {
            escapeValue: false // React already escapes
        },

        react: {
            useSuspense: false
        }
    });

export default i18n;
