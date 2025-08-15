<template>
  <Teleport to="body">
    <transition name="fade">
      <div
          v-if="modelValue"
          class="cm-overlay"
          @click.self="onCancel"
      >
        <div
            class="cm-dialog"
            role="dialog"
            aria-modal="true"
            :aria-labelledby="titleId"
            tabindex="-1"
            ref="dialogRef"
            @keydown.esc.prevent.stop="onCancel"
        >
          <h3 :id="titleId" class="cm-title">{{ title }}</h3>
          <p v-if="message" class="cm-message">{{ message }}</p>

          <div class="cm-actions">
            <button
                type="button"
                class="btn outline"
                :disabled="loading"
                @click="onCancel"
            >
              {{ cancelText }}
            </button>
            <button
                type="button"
                class="btn danger"
                :disabled="loading"
                @click="onConfirm"
            >
              {{ loading ? processingText : confirmText }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '확인' },
  message: { type: String, default: '' },
  confirmText: { type: String, default: '확인' },
  cancelText: { type: String, default: '취소' },
  processingText: { type: String, default: '처리 중...' },
  loading: { type: Boolean, default: false },
});

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel']);

const dialogRef = ref(null);
const titleId = `cm-title-${Math.random().toString(36).slice(2, 8)}`;

function onCancel() {
  if (props.loading) return;
  emit('cancel');
  emit('update:modelValue', false);
}

function onConfirm() {
  emit('confirm');
}

watch(
    () => props.modelValue,
    (v) => {
      if (v) {
        // 포커스 이동
        setTimeout(() => {
          dialogRef.value?.focus?.();
        }, 0);
        // 스크롤 잠금
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    },
    { immediate: true }
);

onMounted(() => {
  if (props.modelValue) document.body.style.overflow = 'hidden';
});
</script>

<style scoped>
/* overlay & transition */
.cm-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
}
.fade-enter-active, .fade-leave-active { transition: opacity .18s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* dialog */
.cm-dialog {
  width: 100%;
  max-width: 360px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0,0,0,.12);
  padding: 16px;
  outline: none;
  animation: pop .18s ease;
}
@keyframes pop {
  from { transform: translateY(6px) scale(.98); opacity: .95; }
  to   { transform: translateY(0) scale(1); opacity: 1; }
}

.cm-title {
  margin: 4px 2px 8px 2px;
  font-size: 16px;
  font-weight: 800;
  color: #222;
}
.cm-message {
  margin: 0 2px 14px;
  font-size: 14px;
  color: #555;
  line-height: 1.5;
}

/* actions */
.cm-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.btn {
  width: 100%;
  border: none;
  border-radius: 12px;
  padding: 12px;
  font-weight: 700;
  cursor: pointer;
}
.btn.outline {
  background: #fff;
  color: #333;
  border: 1px solid #ddd;
}
.btn.danger {
  color: #fff;
  background: linear-gradient(
      135deg,
      #ef4444,
      #dc2626
  );
}
.btn:disabled {
  opacity: .6;
  cursor: not-allowed;
}
</style>
