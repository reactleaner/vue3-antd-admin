<template>
  <LockScreen v-if="isLock && $route.name != 'login'" />
</template>

<script setup lang="ts">
import LockScreen from './lockscreen.vue'
import { computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useLockscreenStore } from '@/store/modules/lockscreen'

const lockscreenStore = useLockscreenStore()
const route = useRoute()
const isLock = computed(() => lockscreenStore.isLock)
const lockTime = computed(() => lockscreenStore.lockTime)

let timer

const timekeeping = () => {
  clearInterval(timer)
  if (route.name == 'login' || isLock.value) return
  // 设置不锁屏
  lockscreenStore.setLock(false)
  // 重置锁屏时间
  lockscreenStore.setLockTime()
  timer = setInterval(() => {
    // 锁屏倒计时递减
    lockscreenStore.setLockTime(lockTime.value - 1)
    if (lockTime.value <= 0) {
      // 设置锁屏
      lockscreenStore.setLock(true)
      return clearInterval(timer)
    }
    // console.log(lockTime.value, '锁屏倒计时')
  }, 1000)
}

onMounted(() => {
  document.addEventListener('mousedown', timekeeping)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', timekeeping)
})
</script>
