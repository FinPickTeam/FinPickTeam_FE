<template>
  <div class="card-detail-container">
    <!-- ===== 상단 카드 요약: 진짜 카드 메타 + 이 기간 합계 ===== -->
    <section class="card-summary-card">
      <div class="cs-top">
        <div class="cs-cardno">{{ header.brand }} {{ header.maskedNo }}</div>
        <div class="cs-badge">{{ header.badge }}</div>
      </div>
      <div class="cs-amount">
        {{ formatCurrency(header.amount) }}<span class="cs-won">원</span>
      </div>
    </section>

    <!-- ===== 승인 내역 ===== -->
    <section class="card-transaction-section">
      <div class="tx-header">
        <button class="tx-filter-btn" @click="handleOpenFilter">
          {{ periodLabel }} <span class="chev">▾</span>
        </button>
        <span class="transaction-count">{{ items.length }}건</span>
      </div>

      <div v-if="loading" class="tx-loading">불러오는 중...</div>
      <div v-else-if="error" class="tx-error">{{ error }}</div>

      <div v-else class="tx-groups">
        <div class="tx-group" v-for="g in grouped" :key="g.key">
          <div class="date-col">{{ g.label }}</div>
          <div class="tx-items">
            <div
              class="tx-item"
              v-for="t in g.items"
              :key="t.id ?? t.approvalNo ?? t.uuid ?? g.key + Math.random()"
            >
              <div class="tx-left">
                <div class="tx-title">{{ t.merchantName || '거래' }}</div>
                <div class="tx-sub">{{ formatTime(t.approvedAt) }}</div>
              </div>

              <!-- ✅ 환급/취소만 +, 나머지 전부 지출(-) -->
              <div
                class="tx-right"
                :class="{ plus: isRefund(t), minus: !isRefund(t) }"
              >
                <div class="tx-amount">{{ signedAmount(t.amount, t) }}</div>
                <div class="tx-type">{{ subLabel(t) }}</div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="!items.length" class="tx-empty">표시할 거래가 없어요.</div>
      </div>
    </section>

    <BasePeriodFilterModal
      v-model="showFilter"
      v-model:period="period"
      v-model:start="start"
      v-model:end="end"
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import BasePeriodFilterModal from '@/components/openbanking/BasePeriodFilterModal.vue';
import { usePeriodFilter } from '@/components/openbanking/usePeriodFilter';
import {
  getCardTransactions,
  getCardsWithTotal,
} from '@/api/openbanking/cardsApi';

const route = useRoute();
const cardId = route.params.cardId;

const period = ref('thisMonth');
const start = ref('');
const end = ref('');
const showFilter = ref(false);

const { getPeriodLabel, getRange } = usePeriodFilter(period, start, end);
const periodLabel = computed(() => getPeriodLabel());

const items = ref([]);
const loading = ref(false);
const error = ref('');

const cardMeta = ref(null); // DB 기반 카드 메타(발급사/마스킹/유형/이번달합계)

// --- 데이터 불러오기 ---
const handleOpenFilter = () => (showFilter.value = true);

const fetchCardMeta = async () => {
  try {
    // 목록 API에서 해당 cardId 찾기(백엔드에 단건 조회가 있으면 그걸 쓰세요)
    const now = new Date();
    const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      '0'
    )}`;
    const r = await getCardsWithTotal({ month: ym });
    const list = Array.isArray(r?.data) ? r.data : [];
    cardMeta.value = list.find((c) => String(c.id) === String(cardId)) || null;
  } catch {
    cardMeta.value = null;
  }
};

const fetchTransactions = async () => {
  if (!cardId) return;
  loading.value = true;
  error.value = '';
  try {
    let from = start.value || undefined;
    let to = end.value || undefined;
    if (!from && !to && period.value !== 'all') {
      const { start: s, end: e } = getRange();
      const fmt = (d) =>
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
          2,
          '0'
        )}-${String(d.getDate()).padStart(2, '0')}`;
      from = fmt(s);
      to = fmt(e);
    }
    const res = await getCardTransactions(cardId, { from, to });
    items.value = res?.data ?? [];
  } catch (e) {
    error.value =
      e?.response?.data?.message ||
      e?.message ||
      '카드 승인내역 조회에 실패했습니다.';
    items.value = [];
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await fetchCardMeta();
  await fetchTransactions();
  window.addEventListener('open-filter-modal', handleOpenFilter);
});
onUnmounted(() =>
  window.removeEventListener('open-filter-modal', handleOpenFilter)
);
watch([period, start, end], fetchTransactions);
watch(
  () => route.params.cardId,
  async () => {
    await fetchCardMeta();
    await fetchTransactions();
  }
);

// ===== 표시 유틸 =====
const formatCurrency = (n) =>
  (Number(n) || 0).toLocaleString(undefined, { maximumFractionDigits: 0 });
const formatTime = (dateish) => {
  const d = dateish ? new Date(dateish) : null;
  if (!d || Number.isNaN(+d)) return '';
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
};
const formatDateLabel = (d) => {
  const date = d instanceof Date ? d : new Date(d);
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
};
const isRefund = (t) =>
  t?.isCancelled === true ||
  t?.cancelled === true ||
  /cancel|취소/i.test(t?.status || t?.payType || '');
const signedAmount = (amount, t) => {
  const num =
    typeof amount === 'string'
      ? Number(amount.replaceAll(',', ''))
      : Number(amount || 0);
  const sign = isRefund(t) ? '+' : '-';
  return `${sign}${formatCurrency(Math.abs(num))}원`;
};
const subLabel = (t) => {
  if (t.isCancelled || t.cancelled) return '취소';
  if (t.isCashAdvance || /cash/i.test(t.category || '')) return '현금서비스';
  if (t.currency && t.currency !== 'KRW') return '해외일시불';
  if (t.installmentMonths && Number(t.installmentMonths) > 1) return '할부';
  return t.payType || t.transactionType || t.cardType || '일시불';
};
const mask = (no = '') =>
  no
    .replace(/\s+/g, '')
    .replace(/(\d{6})\d+(\d{4})$/, (_, a, b) => `${a}******${b}`);

// ===== 헤더: 진짜 카드 메타 + 기간 합계(지출은 음수 취급, 환급은 양수)
const header = computed(() => {
  const meta = cardMeta.value || {};
  const brand =
    meta.bankName ||
    meta.cardName?.split(' ')[0] ||
    route.query.brand ||
    '카드';
  const masked =
    meta.cardMaskednum ||
    (route.query.cardNo ? mask(String(route.query.cardNo)) : '****');

  // 이 기간 합계: 환급/취소는 +, 나머지는 - 로 누적
  const sum = items.value.reduce((acc, t) => {
    const v =
      typeof t.amount === 'string'
        ? Number(t.amount.replaceAll(',', ''))
        : Number(t.amount || 0);
    return acc + (isRefund(t) ? +Math.abs(v) : -Math.abs(v));
  }, 0);

  return {
    brand: brand + '카드',
    maskedNo: masked,
    badge:
      meta.cardType === 'CREDIT'
        ? '신용'
        : meta.cardType === 'DEBIT'
        ? '체크'
        : route.query.badge || '카드',
    amount: Number.isFinite(sum)
      ? Math.abs(sum)
      : Number(meta.monthlySpent || 0), // 화면엔 절대값
  };
});

// 날짜별 그룹핑
const grouped = computed(() => {
  const by = new Map();
  items.value.forEach((t) => {
    const k = (t.approvedAt ?? '').toString().slice(0, 10);
    if (!by.has(k)) by.set(k, []);
    by.get(k).push(t);
  });
  const arr = [...by.entries()].map(([key, list]) => {
    list.sort((a, b) => new Date(b.approvedAt) - new Date(a.approvedAt));
    return { key, label: formatDateLabel(key), items: list };
  });
  arr.sort((a, b) => new Date(b.key) - new Date(a.key));
  return arr;
});
</script>

<style scoped>
/* (기존 스타일 유지) */
:root {
  --bg-page: #f6f7f8;
  --white: #fff;
  --strong: #222;
  --sub: #8a8a8a;
  --border: #eee;
}
.card-detail-container {
  background: var(--bg-page);
  min-height: 100vh;
  padding: 0 0 100px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
.card-summary-card {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  margin: 0 16px 24px;
}
.cs-top {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}
.cs-cardno {
  font-size: 15px;
  font-weight: 700;
  color: var(--strong);
}
.cs-badge {
  font-size: 13px;
  color: #666;
}
.cs-amount {
  text-align: right;
  font-weight: 900;
  font-size: 2rem;
  color: #4318d1;
}
.cs-won {
  margin-left: 6px;
  font-size: 18px;
  font-weight: 800;
}
.card-transaction-section {
  background: #fff;
  margin: 0 0 16px;
  padding: 12px 16px 24px;
}
.tx-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 5px 0 16px 0;
}
.tx-filter-btn {
  appearance: none;
  border: 0;
  background: none;
  color: var(--strong);
  font-weight: 800;
  font-size: 16px;
  padding: 0;
  border-radius: 0;
}
.tx-filter-btn .chev {
  margin-left: 2px;
}
.transaction-count {
  margin-left: auto;
  color: var(--sub);
  font-size: 13px;
  font-weight: 500;
}
.tx-loading {
  padding: 12px 0;
  color: #666;
}
.tx-error {
  padding: 12px 0;
  color: #d33;
}
.tx-group {
  display: grid;
  grid-template-columns: 72px 1fr;
  align-items: start;
}
.date-col {
  color: var(--sub);
  font-size: 12px;
  padding-top: 12px;
}
.tx-items {
  grid-column: 2;
}
.tx-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--border);
}
.tx-item:last-child {
  border-bottom: 0;
}
.tx-left {
  min-width: 0;
}
.tx-title {
  color: var(--strong);
  font-weight: 800;
  font-size: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tx-sub {
  margin-top: 4px;
  color: var(--sub);
  font-size: 12px;
}
.tx-right {
  text-align: right;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}
.tx-amount {
  font-size: 16px;
  font-weight: 900;
}
.tx-right.plus .tx-amount {
  color: var(--primary);
}
.tx-right.minus .tx-amount {
  color: var(--strong);
}
.tx-type {
  font-size: 12px;
  color: var(--sub);
}
.tx-empty {
  text-align: center;
  color: var(--sub);
  padding: 20px 0 8px;
}
.tx-groups {
  max-height: 60vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
</style>
