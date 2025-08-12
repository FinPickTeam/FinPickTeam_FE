<template>
  <div v-if="isDeleteMode" class="delete-footer">
    <button
      class="delete-btn"
      :disabled="!selectedCount"
      @click="$emit('delete')"
    >
      {{ buttonText }}
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  isDeleteMode: {
    type: Boolean,
    default: false,
  },
  selectedCount: {
    type: Number,
    default: 0,
  },
  itemType: {
    type: String,
    default: '항목',
  },
});

const emit = defineEmits(['delete']);

const buttonText = computed(() => {
  if (props.selectedCount === 0) {
    return `${props.itemType} 삭제`;
  }
  return `${props.selectedCount}개 ${props.itemType} 삭제`;
});
</script>

<style scoped>
.delete-footer {
  position: fixed;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  max-width: 390px;
  width: 100%;
  padding: 0 16px;
  z-index: 1000;
}

.delete-btn {
  width: 100%;
  background: #dc2626;
  color: #fff;
  border: 0;
  border-radius: 12px;
  padding: 16px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.15s;
}

.delete-btn:hover:not(:disabled) {
  background: #b91c1c;
}

.delete-btn:disabled {
  background: #e5e7eb;
  color: #9ca3af;
  cursor: not-allowed;
}
</style>
