import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../locales/en.json';
import no from '../locales/no.json';

const languageResources = {
  en: {
    translation: en,
  },
  no: {
    translation: no,
  },
};

i18next.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  resources: languageResources,
  lng: 'no',
  fallbackLng: 'en',
});

export default i18next;
