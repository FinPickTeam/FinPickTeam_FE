<template>
  <div class="account-detail-container">
    <BaseHeader>
      <template #title>계좌 상세</template>
      <template #right>
        <button
          class="icon-btn"
          @click="showFilter = true"
          aria-label="필터 열기"
        >
          <font-awesome-icon :icon="['fas', 'sliders']" />
        </button>
      </template>
    </BaseHeader>

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
    <Navbar />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import BaseHeader from '@/components/openbanking/BaseHeader.vue';
import BasePeriodFilterModal from '@/components/openbanking/BasePeriodFilterModal.vue';
import TransactionList from '@/components/openbanking/TransactionList.vue';
import Navbar from '@/components/Navbar.vue';
import { usePeriodFilter } from '@/components/openbanking/usePeriodFilter';
import { getAccountTransactions } from '@/api/openbanking/transactionApi';

// FontAwesome 아이콘 (슬라이더 버튼용)
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSliders } from '@fortawesome/free-solid-svg-icons';
library.add(faSliders);

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

// 파라미터 정리 유틸
const clean = (obj = {}) =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v ?? v === 0));

// 거래내역 조회
const fetchTransactions = async () => {
  if (!accountId) return;
  loading.value = true;
  error.value = '';
  try {
    const params = clean({
      from: start.value || undefined,
      to: end.value || undefined,
    });
    const res = await getAccountTransactions(accountId, params);
    // instance가 원본 response를 반환하므로 data.data 에 리스트가 있음
    items.value = res?.data?.data ?? [];
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
onMounted(fetchTransactions);

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
