<template>
  <config-provider :locale="zhCN">
    <router-view v-slot="{ Component }">
      <Suspense>
        <component :is="Component" />
      </Suspense>
    </router-view>
    <transition name="slide-up">
      <lock-screen />
    </transition>
  </config-provider>
</template>

<script setup lang="ts">
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { ConfigProvider } from 'ant-design-vue'
// import SuspenseWithError from '@/components/SuspenseWithError.vue'
import { LockScreen } from '@/components/lockscreen'
</script>

<style lang="less">
@import '~@/styles/global.less';
@import '~@/styles/common.less';
@import '~@/styles/override.less';

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.35s ease-in;
}

.slide-up-enter-form,
.slide-up-leave-to {
  transform: translateY(-100%);
}
</style>
