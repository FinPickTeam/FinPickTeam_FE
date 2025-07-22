<template>
  <header class="header-bar">
    <h1 class="logo">FinPick</h1>
    <div class="header-icons">
      <button class="icon-btn" @click="goToDictionary">
        <i class="fas fa-search"></i>
      </button>
      <button class="icon-btn notification-btn" @click="goToNotification">
        <i class="fas fa-bell"></i>
        <span class="notification-dot"></span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goToNotification = () => {
  router.push('/notification');
};
const goToDictionary = () => {
  router.push('/dictionary');
};
</script>

<style scoped>
.header-bar {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  background: var(--color-bg);
  padding: 16px 0;
  min-height: 80px;
}
.header-icons {
  position: absolute;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: 18px;
}
.icon-btn {
  background: none;
  border: none;
  font-size: 22px;
  color: var(--color-main);
  cursor: pointer;
  position: relative;
}
.notification-btn {
  position: relative;
}
.notification-dot {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 8px;
  height: 8px;
  background: var(--color-accent);
  border-radius: 50%;
  border: 2px solid #fff;
  display: inline-block;
}
</style>
