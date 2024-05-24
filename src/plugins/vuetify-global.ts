/**
 * Vuetify js 的全局配置：
 * 当前开发版本3.6.6是最新版本，目前最新版本不能全局在任何地方调用弹窗等；
 * 此插件主要这个问题，在创建Vuetify组件时，需要传入appContext，否则无法使用
 * 所以在初始化App是将appContext传入到全局，方便随时使用。
 */
import { type App, h, render, type VNode, AppContext } from 'vue';
import MessageQueue from '@/components/common/MessageQueue.vue';
import { useSystemStore } from '@/store/systemStore';
import LoadingDialog from '@/components/common/LoadingDialog.vue';
import ConfirmDialog from '@/components/common/ConfirmDialog.vue';

let messageQueueVNode: VNode;
let appContext: AppContext;

const createVuetifyGlobal = {
  install(app: App): void {
    // 组件注册时，创建一个全局的消息队列，用来展示系统中的消息弹窗。
    // MessageQueue组件为自己定义，封装的是v-snackbar-queue绑定的useSystemStore仓库的消息队列
    // 当useSystemStore中messageQueue有变化时，会重新渲染MessageQueue组件
    messageQueueVNode = h(MessageQueue);
    messageQueueVNode.appContext = app._context;
    appContext = app._context;
    render(messageQueueVNode, document.createElement('div'));
  },
};

interface MessageProps {
  text: string;
  timeout?: number;
  color?: string;
  location?: 'top' | 'bottom' | 'left' | 'right';
}

/**
 * 全局消息组件
 */
export class Message {
  private static updateAndRenderMessageQueue(props: MessageProps) {
    const systemStore = useSystemStore();
    // 向仓库中添加消息、v-snackbar-queue会自动渲染
    systemStore.messageQueue.push(props);
  }

  // 更宽泛的定义，自由度更高。
  static show(props: MessageProps) {
    this.updateAndRenderMessageQueue(props);
  }

  // 成功
  static success(text: string) {
    this.updateAndRenderMessageQueue({ text, color: 'success', location: 'top', timeout: 3000 });
  }

  // 失败
  static error(text: string) {
    this.updateAndRenderMessageQueue({ text, color: 'error', location: 'top', timeout: 3000 });
  }

  // 提醒
  static info(text: string) {
    this.updateAndRenderMessageQueue({ text, color: 'info', location: 'top', timeout: 3000 });
  }
}

/**
 * 全局加载组件
 */
export class Loading {
  private static loadingDialogVNode: VNode = h(LoadingDialog);

  private static init() {
    this.loadingDialogVNode.appContext = appContext;
    render(this.loadingDialogVNode, document.body);
  }

  // 显示加载
  static loading(loadingText: string) {
    Loading.init();
    if (this.loadingDialogVNode.component?.props) {
      this.loadingDialogVNode.component.props.dialog = true;
      this.loadingDialogVNode.component.props.loadingText = loadingText;
    }
  }

  // 关闭加载
  static close() {
    if (this.loadingDialogVNode.component?.props) {
      this.loadingDialogVNode.component.props.dialog = false;
      this.loadingDialogVNode.component.props.loadingText = '';
    }
  }
}

/**
 * ConfirmProps 接口定义了确认框组件的属性。
 * 用于配置确认框的外观和行为，例如标题、内容、按钮文本等。
 *
 * @property {string} [title] - 确认框的标题。
 * @property {string} [content] - 确认框展示的内容。
 * @property {string} [titlePreIcon] - 标题前的图标URL。
 * @property {string} [titleColor] - 标题的颜色。
 * @property {() => void} [onConfirm] - 点击确认按钮时的回调函数。
 * @property {string} [confirmText] - 确认按钮的文本。
 * @property {() => void} [onCancel] - 点击取消按钮时的回调函数。
 * @property {string} [cancelText] - 取消按钮的文本。
 * @property {number} [width] - 确认框的宽度。
 */
interface ConfirmProps {
  // 标题
  title?: string;
  content?: string;
  titlePreIcon?: string;
  titleColor?: string;
  onConfirm?: () => void;
  confirmText?: string;
  onCancel?: () => void;
  cancelText?: string;
  width?: number;
}

/**
 * 全局询问组件
 */
export class Confirm {
  private static confirmDialogVNode: VNode = h(ConfirmDialog, {
    onConfirm: this.createEventHandler('onConfirm'),
    onCancel: this.createEventHandler('onCancel'),
  });

  static init() {
    this.confirmDialogVNode.appContext = appContext;
    render(this.confirmDialogVNode, document.body);
  }

  static show(props: ConfirmProps) {
    Confirm.init();
    if (this.confirmDialogVNode.component?.props) {
      const componentProps = this.confirmDialogVNode.component.props;

      // 合并 props
      Object.assign(componentProps, props, {
        onConfirm: () => {
          if (props.onConfirm) {
            props.onConfirm();
          }
          componentProps.dialog = false;
        },
        onCancel: () => {
          if (props.onCancel) {
            props.onCancel();
          }
          componentProps.dialog = false;
        },
        dialog: true,
      });
    }
  }

  private static createEventHandler(eventName: string) {
    return () => {
      const eventHandler = this.confirmDialogVNode.component?.props?.[eventName];
      if (eventHandler && eventHandler instanceof Function) {
        eventHandler();
      }
    };
  }
}

export default createVuetifyGlobal;
