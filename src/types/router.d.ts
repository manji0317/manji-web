import 'vue-router';
import {RouteRecordRaw as VueRouteRecordRaw} from 'vue-router';

// 定义自定义的 Meta 类型
declare module 'vue-router' {

  interface RouteMeta {
    id: string;
    title: string;
    // 是否在侧边栏显示
    sidebar: boolean;
    icon?: string;
    // 菜单下面副标题
    subCaption?: string;
  }

  interface CustomRouteRecordRaw extends Omit<VueRouteRecordRaw, 'meta' | 'children'> {
    meta: RouteMeta;
    children?: CustomRouteRecordRaw[];
  }
}
