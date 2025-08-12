<template>
  <div class="list">
    <div v-if="items.length === 0" class="no-transactions">
      <p>해당 기간에 거래 내역이 없습니다.</p>
    </div>
    <div v-else class="rows">
      <div class="row" v-for="(t, i) in sortedItems" :key="i">
        <div class="info">
          <div class="title">{{ getTitle(t) }}</div>
          <div class="sub">{{ formatDate(getDate(t)) }}</div>
        </div>
        <div
          class="amount"
          :class="getType(t) === '입금' ? 'income' : 'expense'"
        >
          {{ getType(t) === '입금' ? '+' : '-'
          }}{{ getAmount(t).toLocaleString() }}원
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  items: { type: Array, default: () => [] },
  // 데이터 키가 달라도 매핑할 수 있게 getter 전달
  getters: {
    type: Function,
    amount: Function,
    date: Function,
    title: Function,
  },
});
const getType = (t) => props.getters?.type?.(t) ?? t.type;
const getAmount = (t) => props.getters?.amount?.(t) ?? t.amount;
const getDate = (t) => props.getters?.date?.(t) ?? t.date;
const getTitle = (t) => props.getters?.title?.(t) ?? t.description;

const sortedItems = computed(() =>
  [...props.items].sort((a, b) => new Date(getDate(b)) - new Date(getDate(a)))
);

const formatDate = (d) => {
  const dt = new Date(d);
  return `${dt.getMonth() + 1}.${dt.getDate()}`;
};
</script>

<style scoped>
.rows {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}
.info .title {
  font-weight: 600;
}
.amount.income {
  color: #059669;
}
.amount.expense {
  color: #dc2626;
}
.no-transactions {
  text-align: center;
  padding: 40px 20px;
  color: #888;
}
</style>
