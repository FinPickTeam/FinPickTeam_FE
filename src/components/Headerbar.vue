<template>
  <header class="header-bar">
    <h1 class="logo">FinPick</h1>
    <div class="header-icons">
      <button class="icon-btn"><i class="fas fa-search"></i></button>
      <button class="icon-btn notification-btn">
        <i class="fas fa-bell"></i>
        <span class="notification-dot"></span>
      </button>
    </div>
  </header>
</template>

<script setup>
// 특별한 로직 없음
</script>

<style scoped>
.header-bar {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  background: #fff;
}
.logo {
  color: #4318d1;
  font-size: 48px;
  font-weight: 900;
  margin-bottom: 8px;
  letter-spacing: 1px;
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
  color: #4318d1;
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
  background: #e11d48;
  border-radius: 50%;
  border: 2px solid #fff;
  display: inline-block;
}
</style>
