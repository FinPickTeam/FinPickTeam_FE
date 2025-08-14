<!-- src/components/common/ConfirmModal.vue -->
<template>
  <div v-if="open" class="overlay" @click="$emit('close')">
    <div class="content" @click.stop>
      <div class="header">
        <h3>{{ title }}</h3>
      </div>
      <div class="body"><slot /></div>
      <div class="footer">
        <button class="btn gray" @click="$emit('close')">취소</button>
        <button class="btn red" @click="$emit('confirm')">삭제</button>
      </div>
    </div>
  </div>
</template>
<script setup>
defineProps({ open: Boolean, title: { type: String, default: '확인' } });
defineEmits(['close', 'confirm']);
</script>
\
<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.content {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  width: 90%;
  max-width: 350px;
}
.header {
  margin-bottom: 12px;
}
.footer {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}
.btn {
  flex: 1;
  padding: 12px;
  border: 0;
  border-radius: 8px;
  cursor: pointer;
}
.btn.gray {
  background: #f3f4f6;
}
.btn.red {
  background: #dc2626;
  color: #fff;
}
</style>
