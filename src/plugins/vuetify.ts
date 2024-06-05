// Styles
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';

// Composables
import { createVuetify } from 'vuetify';

// Start 实验性组件
import { VSnackbarQueue } from 'vuetify/labs/VSnackbarQueue';
import { VTreeview } from 'vuetify/labs/VTreeview';
// End 实验性组件

// Start 使Vuetify支持vue-i18n
import { createVueI18nAdapter } from 'vuetify/locale/adapters/vue-i18n';
import { useI18n } from 'vue-i18n';
import i18n from './i18n';
// End 使Vuetify支持vue-i18n

export default createVuetify({
  theme: {
    defaultTheme: 'light',
  },
  locale: {
    adapter: createVueI18nAdapter({ i18n, useI18n }),
  },
  defaults: {
    VToolbar: {
      height: 50,
    },
  },
  components: {
    VSnackbarQueue,
    VTreeview,
  },
});
