// Styles
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';

// Composables
import { createVuetify } from 'vuetify';
import { VSnackbarQueue } from 'vuetify/labs/VSnackbarQueue';
import { createVueI18nAdapter } from 'vuetify/locale/adapters/vue-i18n';
import { useI18n } from 'vue-i18n';
import i18n from './i18n';

export default createVuetify({
  theme: {
    defaultTheme: 'light',
  },
  locale: {
    adapter: createVueI18nAdapter({ i18n, useI18n }),
  },
  components: {
    VSnackbarQueue,
  },
});
