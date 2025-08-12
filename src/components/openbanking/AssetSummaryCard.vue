<template>
  <div class="asset-summary-card">
    <div class="asset-header">
      <span class="asset-title">{{ title }}</span>
      <button class="refresh-btn" @click="$emit('refresh')">
        <font-awesome-icon :icon="['fas', 'sync-alt']" />
      </button>
    </div>
    <div class="asset-amount">
      {{ formatAmount(amount) }}
      <span class="asset-won">원</span>
    </div>
    <div class="asset-subtitle">{{ subtitle }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';

// FontAwesome 아이콘 등록
library.add(faSyncAlt);

const props = defineProps({
  title: {
    type: String,
    default: '총 자산',
  },
  amount: {
    type: Number,
    required: true,
  },
  subtitle: String,
  description: String,
  showRefresh: {
    type: Boolean,
    default: false,
  },
  refreshTime: String,
});

const emit = defineEmits(['refresh']);

const isNegative = computed(() => props.amount < 0);

const formatAmount = (amount) => {
  return Math.abs(amount).toLocaleString();
};
</script>

<style scoped>
.asset-summary-card {
  background: #fff;
  margin: 16px;
  padding: 24px 20px;
  border-radius: 18px;
  box-shadow: 0 2px 8px rgba(67, 24, 209, 0.07);
}

.asset-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.asset-title {
  color: #888;
  font-size: 1.05rem;
  font-weight: 500;
}

.refresh-btn {
  background: none;
  border: none;
  font-size: 0.85rem;
  color: #bdbdbd;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: color 0.15s;
}

.refresh-btn:hover {
  color: #4318d1;
}

.asset-amount {
  font-size: 2.1rem;
  font-weight: 700;
  color: #4318d1;
  margin-bottom: 4px;
}

.asset-won {
  font-size: 1.1rem;
  font-weight: 400;
  color: #888;
  margin-left: 2px;
}

.asset-subtitle {
  color: #666;
  margin-top: 6px;
  font-size: 0.95rem;
}
</style>
