<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useTheme } from 'vuetify';
  import { getUsernameFromToken, removeToken } from '@/utils/TokenUtil';
  import { Loading, Message } from '@/plugins/vuetify-global';
  import { getUserInfo } from '@/api/user.api';
  import { CustomRouteRecordRaw, useRouter } from 'vue-router';
  import { checkRoutePermission, findMenuItemsByIds } from '@/utils/MenuUtil';
  import { useAuthStore } from '@/store/authStore';

  const themeInstance = useTheme();
  const { t, locale } = useI18n();
  const router = useRouter();
  const authStore = useAuthStore();
  // 用户菜单数据
  const userMenus = ref<CustomRouteRecordRaw[]>([]);
  // 是否展开侧边菜单
  const sidebarDrawer = ref(false);
  // 主题数据
  const themes = [
    { title: t('common.light'), icon: 'mdi-weather-sunny', value: 'light' },
    { title: t('common.dark'), icon: 'mdi-weather-night', value: 'dark' },
  ];
  // 切换主题
  const handleChangeTheme = (theme: string) => {
    themeInstance.global.name.value = theme;
  };
  // 国际化数据
  const locales = [
    { title: t('common.english'), value: 'en-US' },
    { title: t('common.simplifiedChinese'), value: 'zh-Hans' },
  ];
  // 切换国际化
  const handleChangeLocale = (value: string) => {
    const storageLocale = localStorage.getItem('locale');
    if (!storageLocale || storageLocale !== value) {
      localStorage.setItem('locale', value);
    }
    locale.value = localStorage.getItem('locale') || value;
  };

  // 组件挂载成功之后，处理菜单数据
  onMounted(() => {
    let username = getUsernameFromToken();
    if (!username) {
      // 没有Username提示错误信息，删除Token数据，跳转到登录页面。
      removeToken();
      Message.error(t('login.usernameRetrievalError'));
      return;
    }
    Loading.loading(t('login.buildingPage'));

    // 获取用户数据（配置的菜单数据、用户基本信息）
    getUserInfo(username)
      .then((res) => {
        // 模拟后台返回可访问的菜单数据
        const userMenuIds = res.data.menuIds || ['1', '2', '3', '4'];
        // TODO 此处模拟后台返回菜单数据，实际开发中，后台返回菜单数据，前端根据菜单数据渲染菜单。
        authStore.menuIds = userMenuIds;

        // 过滤出来用户可以访问的菜单
        userMenus.value = findMenuItemsByIds(userMenuIds);

        // 判断用户是否有权限访问该页面，主要防止直接通过浏览器输入栏跳转
        let routePermission = checkRoutePermission(authStore.menuIds, router.currentRoute.value.meta.id);
        if (!routePermission) {
          router.push('/403');
        }
      })
      .finally(() => Loading.close());
  });
</script>

<template>
  <v-app>
    <v-navigation-drawer :rail="sidebarDrawer" permanent expand-on-hover width="350">
      <!-- 菜单区域 -->
      <v-list nav>
        <template v-for="item in userMenus" :key="item.meta.id">
          <!-- 是否有子菜单 -->
          <NavCollapse :item="item" v-if="item.children" />

          <!-- 渲染Item -->
          <NavItem :item="item" v-else />
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar>
      <v-app-bar-nav-icon @click="sidebarDrawer = !sidebarDrawer" />
      <template v-slot:append>
        <!-- 主题切换 -->
        <v-menu location="bottom">
          <template v-slot:activator="{ props }">
            <v-btn icon="mdi-theme-light-dark" v-bind="props" />
          </template>
          <v-list density="compact" rounded="lg">
            <v-list-subheader>{{ $t('common.themeSwitching') }}</v-list-subheader>
            <v-list-item v-for="(item, index) in themes" :key="index" rounded="lg" @click="handleChangeTheme(item.value)">
              <template v-slot:prepend>
                <v-icon :icon="item.icon" />
              </template>
              <v-list-item-title v-text="item.title" />
            </v-list-item>
          </v-list>
        </v-menu>

        <!-- 国际化切换 -->
        <v-menu location="bottom">
          <template v-slot:activator="{ props }">
            <v-btn icon="mdi-translate-variant" v-bind="props" />
          </template>
          <v-list density="compact" rounded="lg">
            <v-list-subheader>{{ $t('common.languageSwitch') }}</v-list-subheader>
            <v-list-item v-for="(item, index) in locales" :key="index" rounded="lg" @click="handleChangeLocale(item.value)">
              <v-list-item-title v-text="item.title" />
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<style scoped></style>
