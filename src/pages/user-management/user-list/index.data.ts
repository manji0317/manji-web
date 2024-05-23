import { computed } from 'vue';
import { TableHeaderType } from '@/types/vuetify';
import i18n from '@/plugins/i18n';
const { t } = i18n.global;

export const TableHeader = computed<TableHeaderType>(() => [
  {
    title: t('user.avatar'),
    key: 'avatar',
    sortable: false,
  },
  {
    title: t('user.nickname'),
    key: 'nickname',
    sortable: false,
  },
  {
    title: t('common.account'),
    key: 'username',
    sortable: false,
  },
  {
    title: t('user.gender'),
    key: 'gender',
    sortable: false,
  },
  {
    title: t('user.birthday'),
    key: 'birthday',
  },
  {
    title: t('common.email'),
    key: 'email',
    sortable: false,
  },
  {
    title: t('common.phone'),
    key: 'phone',
    sortable: false,
  },
  {
    title: t('common.status'),
    key: 'status',
    sortable: false,
  },
  {
    title: t('common.createTime'),
    key: 'createTime',
  },
]);