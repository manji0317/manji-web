/**
 * 系统中前端的websocket连接处理工具类，
 *
 * 如果不需要websocket连接:a
 *    1. 则无需引用此工具类；
 *    2. 删除package.json中的 "socket.io-client" 依赖;
 *    3. 删除配置文件 .env.x 中的VITE_WEBSOCKET_URL和VITE_WEBSOCKET_PATH;
 */
import { io } from 'socket.io-client';
import { MenuNotice, useWebsocketStore } from '@/store/websocketStore';

const websocketStore = useWebsocketStore();

const socket = io(import.meta.env.VITE_WEBSOCKET_URL, {
  transports: ['websocket'],
  path: import.meta.env.VITE_WEBSOCKET_PATH,
  upgrade: false,
  reconnection: true,
  reconnectionAttempts: 5,
  autoConnect: false,
});

export class Websocket {
  // 链接时候需要将userId传递到后端，用来区分用户
  private static setOpts(userId: string) {
    socket.io.opts.query = {
      userId,
    };
  }

  /**
   * 连接websocket
   * @param userId 用户ID
   */
  static connect(userId: string) {
    this.setOpts(userId);
    socket.on('connect', () => {
      // 系统右上角小铃铛通知
      socket.on('Notifications', (args: number) => {
        websocketStore.systemNotice = args;
      });

      // 菜单中内容变化通知
      socket.on('MenuNotifications', (args: MenuNotice) => {
        Object.keys(args).forEach((key) => {
          websocketStore.menuNotice[key] = args[key];
        });
      });
    });
    socket.connect();
  }

  /**
   * 断开websocket
   */
  static disconnect() {
    socket.disconnect();
  }
}
