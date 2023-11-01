import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import no from './locales/no.json';
import dayjs from 'dayjs';

/**
 * Utility type for the schema of json translation files.
 * As a result, the english translation file is used as the baseline for others.
 */
type Translation = typeof en;

const resources = {
  en: {
    translation: en,
  },
  no: {
    translation: no satisfies Translation,
  },
};

/**
 * Module augmentation to provide the correct type for the resources option.
 * This enables autocompletion of translation keys when using the t function.
 */
declare module 'i18next' {
  interface CustomTypeOptions {
    resources: (typeof resources)['en'];
  }
}

i18next.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  resources,
  lng: 'no',
  fallbackLng: 'en',
});

i18next.on('languageChanged', (lang) => {
  if (lang === 'no') {
    // alternative is to rename the language
    dayjs.locale('nb');
    return;
  }

  dayjs.locale(lang);
});

export default i18next;
