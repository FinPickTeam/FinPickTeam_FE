<template>
  <div class="main-layout">
    <HeaderBar
        v-if="shouldHideHeader"
        :class="{
        'finance-header': route.name === 'FinanceHome',
        'transparent-header': route.name === 'Home',
      }"
    />
    <main :class="['main-content', { 'finance-center': route.name === 'FinanceHome' }, { 'finance-bg': route.name === 'FinanceHome' }]">
      <router-view/>
    </main>
    <!-- Navbar는 App.vue에서 고정 렌더 -->
  </div>
</template>

<script setup>
import HeaderBar from '@/components/Headerbar.vue';
import {useRoute} from 'vue-router';
import {computed} from 'vue';

const route = useRoute();
const hideHeaderNames = [/* 기존 배열 그대로 */];
const shouldHideHeader = computed(() => !hideHeaderNames.includes(route.name));
</script>

<style scoped>
.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-bottom: 80px;
}

.main-content {
  flex: 1 0 auto;
}

.finance-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.finance-bg {
  background: var(--color-bg-light);
}
</style>
