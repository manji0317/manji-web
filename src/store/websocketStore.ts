import { defineStore } from 'pinia';

export interface MenuNotice {
  [key: string]: number
}

interface WebsocketStore {
  // 系统小铃铛通知条数
  systemNotice: number;
  // 系统左侧菜单栏通知条数
  menuNotice: MenuNotice;
}

export const useWebsocketStore = defineStore('websocket', {
  state: (): WebsocketStore => ({
    systemNotice: 0,
    menuNotice: {},
  }),
});
