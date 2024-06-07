import 'vue-router';
import {RouteRecordRaw as VueRouteRecordRaw} from 'vue-router';

// 定义自定义的 Meta 类型
declare module 'vue-router' {

  interface RouteMeta {
    // 菜单ID，此值必须唯一
    id: string;
    // 父菜单ID，此值不用填写，在调用MenuUtil.flattenMenu()会自动生成
    // pId?: string;
    // 菜单标题名称
    title: string;
    // 菜单描述
    description?: string;
    // 是否在侧边栏显示
    sidebar: boolean;
    // 菜单图标
    icon?: string;
    // 菜单下面副标题
    subtitle?: string;
    // 菜单中包含的功能
    permissions?: string[],
  }

  interface CustomRouteRecordRaw extends Omit<VueRouteRecordRaw, 'meta' | 'children'> {
    meta: RouteMeta;
    children?: CustomRouteRecordRaw[];
  }
}
