import dayjs from 'dayjs';
import updateLocale from 'dayjs/plugin/updateLocale';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import nb from './locales/nb.json';

dayjs.extend(updateLocale);

/**
 * Utility type for the schema of json translation files.
 * As a result, the english translation file is used as the baseline for others.
 */
type Translation = typeof en;

const resources = {
  en: {
    translation: en,
  },
  nb: {
    translation: nb satisfies Translation,
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
  lng: 'nb',
  fallbackLng: 'en',
});

/**
 * Enriches the dayjs locale with customized calendar strings.
 *
 * @param lng the language to configure the locale for
 */
const configureDayjsLocale = (lng: keyof typeof resources) => {
  const today = i18next.t('TIME.TODAY', { lng });
  const tomorrow = i18next.t('TIME.TOMORROW', { lng });
  const yesterday = i18next.t('TIME.YESTERDAY', { lng });
  const last = i18next.t('TIME.LAST', { lng });

  dayjs.updateLocale(lng, {
    calendar: {
      sameDay: `[${today}] LT`,
      nextDay: `[${tomorrow}] LT`,
      nextWeek: 'dddd LT',
      lastDay: `[${yesterday}] LT`,
      lastWeek: `[${last}] dddd LT`,
      sameElse: 'L LT',
    },
  });
};

configureDayjsLocale('en');
configureDayjsLocale('nb');

i18next.on('loaded', () => dayjs.locale(i18next.language));
i18next.on('languageChanged', (lang) => dayjs.locale(lang));

export default i18next;
