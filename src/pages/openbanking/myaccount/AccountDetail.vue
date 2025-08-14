<template>
  <div class="account-detail-container">
    <!-- 요약/상세 카드 섹션은 기존 코드 유지 -->

    <div class="account-transactions">
      <div class="transactions-title">
        거래 내역 ({{ getPeriodLabel() }})
        <span class="tx-count">{{ items.length }}건</span>
      </div>

      <!-- 로딩/에러/리스트 -->
      <div v-if="loading" class="tx-loading">불러오는 중...</div>
      <div v-else-if="error" class="tx-error">{{ error }}</div>
      <TransactionList
        v-else
        :items="items"
        :getters="{
          title: (t) => t.place || t.merchantName || t.accountName || '거래',
          type: (t) => t.type,
          date: (t) => t.date,
          amount: (t) => t.amount,
        }"
      />
    </div>

    <BasePeriodFilterModal
      v-model="showFilter"
      v-model:period="period"
      v-model:start="start"
      v-model:end="end"
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import BasePeriodFilterModal from '@/components/openbanking/BasePeriodFilterModal.vue';
import TransactionList from '@/components/openbanking/TransactionList.vue';
import { usePeriodFilter } from '@/components/openbanking/usePeriodFilter';
import { getAccountTransactions } from '@/api/openbanking/accountsApi';

const route = useRoute();
const accountId = route.params.accountId;

const period = ref('thisMonth');
const start = ref('');
const end = ref('');
const showFilter = ref(false);

const { getPeriodLabel, getRange } = usePeriodFilter(period, start, end);

const items = ref([]);
const loading = ref(false);
const error = ref('');

const handleOpenFilter = () => {
  showFilter.value = true;
};

const fetchTransactions = async () => {
  if (!accountId) return;
  loading.value = true;
  error.value = '';
  try {
    let from = start.value || undefined;
    let to = end.value || undefined;
    if (!from && !to && period.value !== 'all') {
      const { start: sDate, end: eDate } = getRange();
      const fmt = (d) => {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const da = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${da}`;
      };
      from = fmt(sDate);
      to = fmt(eDate);
    }
    const res = await getAccountTransactions(accountId, { from, to });
    // 래퍼 반환: { status, message, data }
    items.value = res?.data ?? [];
  } catch (e) {
    error.value =
      e?.response?.data?.message ||
      e?.message ||
      '거래내역 조회에 실패했습니다.';
    items.value = [];
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchTransactions();
  window.addEventListener('open-filter-modal', handleOpenFilter);
});
onUnmounted(() =>
  window.removeEventListener('open-filter-modal', handleOpenFilter)
);

watch([period, start, end], fetchTransactions);
watch(() => route.params.accountId, fetchTransactions);
</script>

<style scoped>
.account-detail-container {
  padding: 16px;
  background: var(--color-bg-light);
  height: calc(
    100dvh - 160px
  ); /* 헤더(80px) + 네비게이션(80px) 높이만큼 빼기 */
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: max(16px, env(safe-area-inset-bottom));
  min-height: 0;
}

.account-transactions {
  background: #fff;
  border-radius: 18px;
  padding: 20px;
  margin-top: 16px;
}

.transactions-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #222;
  margin-bottom: 16px;
}

.tx-count {
  margin-left: 0.4rem;
  color: #888;
  font-weight: 500;
  font-size: 0.9rem;
}

.tx-loading {
  padding: 12px 0;
  color: #666;
}

.tx-error {
  padding: 12px 0;
  color: #d33;
}
</style>
