<script lang="ts" setup>
  import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
  import { Menus } from '@/router/router-menu';
  import { flattenMenu } from '@/utils/MenuUtil';
  import { CustomRouteRecordRaw, useRouter } from 'vue-router';
  import { useI18n } from 'vue-i18n';
  import {useSystemStore} from "@/store/systemStore";

  let router = useRouter();
  const systemStore = useSystemStore()
  const { t } = useI18n();
  // localStorage 中最近搜索的Key
  const recentSearchesKey = 'recentSearches';

  // 搜索框输入框
  const search = ref<string>('');

  // 扁平化处理菜单
  const flattenMenus = computed(() => flattenMenu(Menus));

  // 菜单搜索结果
  const searchResult = computed(() => {
    return flattenMenus.value.filter((menu) => {
      return t(menu.meta.title).includes(search.value) || t(menu.path).includes(search.value);
    });
  });

  // 存储最近搜索数据
  const recentSearches = ref<CustomRouteRecordRaw[]>([]);

  // 从 localStorage 加载最近搜索
  const loadRecentSearches = () => {
    const savedSearches = localStorage.getItem(recentSearchesKey);
    recentSearches.value = savedSearches ? JSON.parse(savedSearches) : [];
  };

  // 监听Ctrl+K快捷键 弹出搜索框
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'k' && e.ctrlKey) {
      // 阻止默认行为
      e.preventDefault();

      // 加载最近搜索
      loadRecentSearches();

      systemStore.ctrlKDialog = true;
    }
  };

  // 跳转并存储最近搜索
  const handleTo = (to: CustomRouteRecordRaw) => {
    router.push(to.path);

    // 更新最近搜索
    recentSearches.value = [to, ...recentSearches.value.filter((item) => item.path !== to.path)].slice(0, 10);
    localStorage.setItem(recentSearchesKey, JSON.stringify(recentSearches.value));

    // 关闭搜索框
    search.value = '';
    systemStore.ctrlKDialog = false;
  };

  // 删除最近搜索
  const handleDeleteRecentSearches = (to: CustomRouteRecordRaw) => {
    recentSearches.value = recentSearches.value.filter((item) => item.path !== to.path);
    localStorage.setItem(recentSearchesKey, JSON.stringify(recentSearches.value));
  };

  onMounted(() => {
    window.addEventListener('keydown', handleKeyDown);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeyDown);
  });
</script>

<template>
  <v-dialog v-model="systemStore.ctrlKDialog" width="450" scrollable height="500">
    <v-card>
      <v-card-title>
        <v-text-field :label="$t('common.search')" prepend-inner-icon="mdi-magnify" clearable append-inner-icon="mdi-keyboard-esc" v-model="search" autofocus/>
      </v-card-title>

      <v-card-text>
        <v-card :title="$t('layout.searchResults')" prepend-icon="mdi-magnify-expand" v-if="search">
          <v-list>
            <v-list-item
              v-for="(item, index) in searchResult"
              :key="index"
              :prepend-icon="item.meta.icon"
              :title="$t(item.meta.title)"
              :subtitle="$t(item.path || '')"
              @click="handleTo(item)"
            />
          </v-list>
        </v-card>
        <v-card :title="$t('layout.recentSearch')" prepend-icon="mdi-history" v-else>
          <v-list>
            <v-list-item
              v-for="(item, index) in recentSearches"
              :key="index"
              :prepend-icon="item.meta.icon"
              :title="$t(item.meta.title)"
              :subtitle="$t(item.path || '')"
              active-color="success"
              @click="handleTo(item)"
            >
              <template #append>
                <v-btn icon="mdi-delete-outline" density="compact" variant="text" @click.stop="handleDeleteRecentSearches(item)" />
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped></style>
