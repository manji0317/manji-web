import { defineStore } from 'pinia';
import { type VSnackbar } from 'vuetify/components';

type SnackbarMessage = Omit<
  VSnackbar['$props'],
  | '$children'
  | 'modelValue'
  | 'onUpdate:modelValue'
  | 'activator'
  | 'activatorProps'
  | 'closeDelay'
  | 'openDelay'
  | 'openOnClick'
  | 'openOnFocus'
  | 'openOnHover'
>;

interface SystemStore {
  messageQueue: SnackbarMessage[];
  // 控制搜索弹窗显示与隐藏
  ctrlKDialog: boolean;
}

export const useSystemStore = defineStore('system', {
  state: (): SystemStore => ({
    messageQueue: [],
    ctrlKDialog: false,
  }),
});
