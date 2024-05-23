import { createI18n } from 'vue-i18n';
import zh_Hans from '@/locales/zh_Hans.json';
import en_US from '@/locales/en_US.json';
import { en, zhHans } from 'vuetify/locale';

export default createI18n({
  legacy: false,
  locale: localStorage.getItem('locale') || 'zh-Hans',
  fallbackLocale: 'zh-Hans',
  messages: {
    'zh-Hans': {
      ...zh_Hans,
      $vuetify: {
        ...zhHans,
      },
    },
    'en-US': {
      ...en_US,
      $vuetify: {
        ...en,
      },
    },
  },
  datetimeFormats: {
    'en-US': {
      short: {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      },
      long: {
        month: '2-digit',
        day: '2-digit',
        year: '2-digit',
        hour: 'numeric',
        minute: 'numeric',
      },
    },

    'zh-Hans': {
      short: {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      },
      long: {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      },
    },
  },
});
