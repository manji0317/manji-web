import { computed } from 'vue';
import { TableHeaderType } from '@/types/vuetify';
import i18n from '@/plugins/i18n';

const { t } = i18n.global;

/**
 * 列表表头数据
 */
export const TableHeader = computed<TableHeaderType>(() => [
  {
    title: t('role.name'),
    key: 'roleName',
    sortable: false,
  },
  {
    title: t('role.description'),
    key: 'description',
    sortable: false,
  },
  { title: t('common.actions'), key: 'actions', sortable: false, minWidth: '180' },
]);
