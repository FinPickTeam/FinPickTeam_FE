<!-- src/components/common/BaseHeader.vue -->
<template>
  <header class="header">
    <button class="back" @click="$router.back()">
      <i class="fas fa-chevron-left"></i>
    </button>
    <div class="right"><slot name="right"></slot></div>
  </header>
</template>

<script setup></script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  max-width: 390px;
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  background: var(--color-bg-light);
  z-index: 100;
}

.back {
  background: none;
  border: none;
  font-size: 24px;
  color: #222;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background 0.15s;
  min-width: 40px;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back:hover {
  background: #f3f3f3;
}

.right {
  min-width: 36px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
