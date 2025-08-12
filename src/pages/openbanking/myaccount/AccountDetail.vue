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
import { getLedger } from '@/api/openbanking/ledgerApi';

const route = useRoute();
const accountId = route.params.accountId; // 라우트에 따라 조정

const period = ref('thisMonth');
const start = ref(''); // yyyy-MM-dd
const end = ref(''); // yyyy-MM-dd
const showFilter = ref(false);

const { getPeriodLabel } = usePeriodFilter(period, start, end);

// 서버 데이터
const items = ref([]);
const loading = ref(false);
const error = ref('');

// 필터 모달 열기 이벤트 리스너
const handleOpenFilter = () => {
  showFilter.value = true;
};

// 거래내역 조회
const fetchTransactions = async () => {
  if (!accountId) return;
  loading.value = true;
  error.value = '';
  try {
    const from = start.value || undefined;
    const to = end.value || undefined;
    const res = await getLedger({ from, to });
    // API 응답 구조: { status, message, data }
    const allTransactions = res?.data?.data ?? [];
    // 계좌 거래만 필터링 (sourceType이 BANK이고 accountId가 일치하는 것)
    items.value = allTransactions.filter(
      (t) => t.sourceType === 'BANK' && t.accountId === parseInt(accountId)
    );
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

// 최초 로드
onMounted(() => {
  fetchTransactions();
  // 필터 모달 열기 이벤트 리스너 등록
  window.addEventListener('open-filter-modal', handleOpenFilter);
});

onUnmounted(() => {
  // 이벤트 리스너 제거
  window.removeEventListener('open-filter-modal', handleOpenFilter);
});

// 기간 변경 시 재조회 (period 변경으로 start/end가 바뀜)
watch([period, start, end], fetchTransactions);

// 라우트가 바뀌는 경우 대비
watch(
  () => route.params.accountId,
  () => {
    // accountId가 바뀌면 목록 재조회
    fetchTransactions();
  }
);
</script>

<style scoped>
.account-detail-container {
  padding: 16px;
  background: #f7f8fa;
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
