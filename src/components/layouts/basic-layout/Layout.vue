<script setup lang="ts">
  import { computed, onMounted, ref, watch } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useDisplay, useTheme } from 'vuetify';
  import { getUserIdFromToken, removeToken } from '@/utils/TokenUtil';
  import { Loading, Message } from '@/plugins/vuetify-global';
  import { getUserInfo } from '@/api/user.api';
  import { CustomRouteRecordRaw, useRouter } from 'vue-router';
  import { checkRoutePermission, findMenuItemsByIds } from '@/utils/MenuUtil';
  import { useAuthStore } from '@/store/authStore';
  import { Websocket } from '@/utils/WebsocketUtil';
  import { useWebsocketStore } from '@/store/websocketStore';
  import { useSystemStore } from '@/store/systemStore';

  const websocketStore = useWebsocketStore();
  const systemStore = useSystemStore();
  const { mobile } = useDisplay();
  const themeInstance = useTheme();
  const { t, locale } = useI18n();
  const router = useRouter();
  const authStore = useAuthStore();
  // 用户菜单数据
  const userMenus = ref<CustomRouteRecordRaw[]>([]);
  // 是否展开侧边菜单
  const sidebarDrawer = ref(true);
  const rail = ref(false);

  // 面包屑数据
  const breadcrumbs = computed<BreadcrumbItem[]>(() => {
    const matched = router.currentRoute.value.matched;
    return matched
      .filter((r) => r.meta && r.meta.title)
      .map((r) => {
        return {
          to: r.redirect ?? r.path,
          title: r.meta.title,
          disabled: false,
        };
      });
  });

  // 切换主题
  const handleChangeTheme = () => {
    themeInstance.global.name.value = themeInstance.global.name.value === 'dark' ? 'light' : 'dark';
  };

  // 切换国际化
  const handleChangeLocale = (value: string) => {
    const storageLocale = localStorage.getItem('locale');
    if (!storageLocale || storageLocale !== value) {
      localStorage.setItem('locale', value);
    }
    locale.value = localStorage.getItem('locale') || value;
  };

  // 处理点击用户信息
  const handleClickUser = () => {
    // 跳转到用户信息页面，携带userId参数
    router.push({
      name: 'user-info',
      params: {
        userId: authStore.id,
      },
    });
  };

  // 加载消息通知等信息
  const handleLoadNotifications = () => {};

  // 监听路由变化，判断用户是否有权限访问该页面
  watch(router.currentRoute, (to) => {
    const userMenuIds = Object.keys(authStore.permissions || {});
    let routePermission = checkRoutePermission(userMenuIds, to.meta.id);
    if (!routePermission) {
      router.push('/403');
    }
  });

  // 组件挂载成功之后，处理菜单数据
  onMounted(() => {
    console.log(router);
    let userId = getUserIdFromToken();
    if (!userId) {
      // 没有Username提示错误信息，删除Token数据，跳转到登录页面。
      removeToken();
      Message.error(t('login.usernameRetrievalError'));
      return;
    }
    Loading.loading(t('login.buildingPage'));

    // 获取用户数据（配置的菜单数据、用户基本信息）
    getUserInfo(userId)
      .then((res) => {
        // 模拟后台返回可访问的菜单数据
        const userMenuIds = Object.keys(res.data.permissions || {});
        authStore.id = res.data.id;
        authStore.nickname = res.data.nickname;
        authStore.username = res.data.username;
        authStore.email = res.data.email;
        authStore.phone = res.data.phone;
        authStore.gender = res.data.gender;
        authStore.birthday = res.data.birthday;
        authStore.avatar = res.data.avatar;
        authStore.status = res.data.status;
        authStore.roles = res.data.roles;
        authStore.permissions = res.data.permissions;

        // 过滤出来用户可以访问的菜单
        userMenus.value = findMenuItemsByIds(userMenuIds);

        // 判断用户是否有权限访问该页面，主要防止直接通过浏览器输入栏跳转
        let routePermission = checkRoutePermission(userMenuIds, router.currentRoute.value.meta.id);
        if (!routePermission) {
          router.push('/403');
        } else {
          // 启动websocket
          Websocket.connect(userId);
        }
      })
      .finally(() => Loading.close());
  });
</script>

<template>
  <v-app>
    <!-- 侧边栏菜单展示区域 -->
    <v-navigation-drawer v-model="sidebarDrawer" :rail="rail" width="300">
      <v-list nav>
        <!-- 用户信息 -->
        <v-list-item :prepend-avatar="authStore.avatar" :subtitle="authStore.email" :title="authStore.nickname" @click="handleClickUser">
          <template #append>
            <!-- 国际化切换 -->
            <v-menu location="right" width="169">
              <template v-slot:activator="{ props }">
                <v-btn icon="mdi-translate" v-bind="props" variant="text" />
              </template>
              <v-list density="compact" rounded="lg">
                <v-list-subheader>{{ $t('common.languageSwitch') }}</v-list-subheader>
                <v-list-item rounded="lg" @click="handleChangeLocale('en-US')">
                  <v-list-item-title>
                    {{ $t('common.english') }}
                  </v-list-item-title>
                </v-list-item>
                <v-list-item rounded="lg" @click="handleChangeLocale('zh-Hans')">
                  <v-list-item-title> {{ $t('common.simplifiedChinese') }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </v-list-item>

        <v-divider></v-divider>

        <!-- 菜单区域 -->
        <template v-for="item in userMenus" :key="item.meta.id">
          <!-- 是否有子菜单 -->
          <NavCollapse :item="item" v-if="item.children" />

          <!-- 渲染Item -->
          <NavItem :item="item" v-else />
        </template>
      </v-list>

      <!-- 登出 -->
      <template #append>
        <div class="pa-2">
          <v-btn
            variant="tonal"
            prepend-icon="mdi-logout-variant"
            color="primary"
            block
            :text="!rail ? $t('common.logout') : ''"
            @click="authStore.handleLogout()"
          />
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar elevation="0">
      <v-app-bar-nav-icon @click="sidebarDrawer = !sidebarDrawer" v-if="mobile" />
      <v-app-bar-nav-icon @click="rail = !rail" v-else />

      <v-app-bar-title>
        <v-btn prepend-icon="mdi-magnify" @click="systemStore.ctrlKDialog = true" class="text-medium-emphasis text-body-2 text-capitalize" :text="$t('common.search')">
          <template #append>
            <v-chip rounded density="compact" variant="outlined"> CTRL + K</v-chip>
          </template>
        </v-btn>
      </v-app-bar-title>

      <template v-slot:append>
        <!-- 主题切换 -->
        <v-btn stacked :color="themeInstance.global.name.value === 'light' ? 'orange' : 'red'" @click="handleChangeTheme">
          <v-icon size="30">
            {{ themeInstance.global.name.value === 'light' ? 'mdi-weather-night' : 'mdi-white-balance-sunny' }}
          </v-icon>
        </v-btn>

        <!-- 消息通知 -->
        <v-btn stacked @click="handleLoadNotifications">
          <v-badge dot :color="websocketStore.systemNotice > 0 ? 'error' : 'transparent'">
            <v-icon size="30" icon="mdi-bell-outline" />
          </v-badge>
        </v-btn>
      </template>
    </v-app-bar>

    <v-main scrollable>
      <v-breadcrumbs :items="breadcrumbs" density="compact">
        <template #item="{ item }">
          <v-chip color="info">
            <v-breadcrumbs-item :to="item.to">
              {{ $t(item.title || '') }}
            </v-breadcrumbs-item>
          </v-chip>
        </template>
      </v-breadcrumbs>

      <router-view v-slot="{ Component }">
        <v-fade-transition>
          <v-container>
            <component :is="Component" />
          </v-container>
        </v-fade-transition>
      </router-view>
    </v-main>
  </v-app>
</template>

<style scoped></style>
