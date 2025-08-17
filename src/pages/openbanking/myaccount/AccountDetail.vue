<template>
  <div class="account-detail-container">
    <!-- 상단 요약: 항상 '실제 표시 잔액' -->
    <section class="account-card">
      <div class="ac-top">
        <div class="ac-bank">
          {{ summary.bankName }} {{ summary.accountNo }}
        </div>
        <div class="ac-type">입출금</div>
      </div>
      <div class="ac-balance">
        {{ formatCurrency(summary.balance) }}<span class="ac-won">원</span>
      </div>
    </section>

    <!-- 거래 내역 -->
    <section class="account-transactions">
      <div class="tx-header">
        <button class="tx-filter-btn" @click="handleOpenFilter">
          {{ periodLabel }} <span class="chev">▾</span>
        </button>
        <span class="tx-count">{{ items.length }}건</span>
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
              :key="
                t.id ??
                t.tranId ??
                t.uuid ??
                g.key + String(t.apprNo || t.seq || Math.random())
              "
            >
              <div class="tx-left">
                <div class="tx-title">{{ getTitle(t) }}</div>
                <div class="tx-sub">{{ formatTime(getDate(t)) }}</div>
              </div>
              <div
                class="tx-right"
                :class="{ plus: isIncome(t), minus: !isIncome(t) }"
              >
                <div class="tx-amount">{{ signedAmount(t) }}</div>
                <div v-if="getBalance(t) !== null" class="tx-balance">
                  {{ formatCurrency(getBalance(t)) }}원
                </div>
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
  getAccountTransactions,
  getAccountsWithTotal,
} from '@/api/openbanking/accountsApi';

const route = useRoute();
const accountId = route.params.accountId;

const period = ref('thisMonth');
const start = ref('');
const end = ref('');
const showFilter = ref(false);

const { getPeriodLabel, getRange } = usePeriodFilter(period, start, end);
const periodLabel = computed(() => getPeriodLabel());

const items = ref([]);
const loading = ref(false);
const error = ref('');

const accountMeta = ref(null); // 서버 메타(계좌번호/은행/DB잔액)
const latestAfter = ref(null); // 최신 afterBalance

const handleOpenFilter = () => (showFilter.value = true);

const fetchTransactions = async () => {
  if (!accountId) return;
  loading.value = true;
  error.value = '';
  try {
    let from = start.value || undefined;
    let to = end.value || undefined;
    if (!from && !to && period.value !== 'all') {
      const { start: sDate, end: eDate } = getRange();
      const fmt = (d) =>
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
          2,
          '0'
        )}-${String(d.getDate()).padStart(2, '0')}`;
      from = fmt(sDate);
      to = fmt(eDate);
    }
    const res = await getAccountTransactions(accountId, {
      from,
      to,
      page: 0,
      size: 100,
    });
    const arr = Array.isArray(res?.data) ? res.data : [];
    items.value = arr;

    // 최신 거래의 afterBalance 파악(이 페이지 실표시 잔액 기준)
    const first = arr[0];
    latestAfter.value = first
      ? Number(
          first.balanceAfter ?? first.afterBalanceAmt ?? first.balance ?? null
        )
      : null;
  } catch (e) {
    error.value =
      e?.response?.data?.message ||
      e?.message ||
      '거래내역 조회에 실패했습니다.';
    items.value = [];
    latestAfter.value = null;
  } finally {
    loading.value = false;
  }
};

const loadAccountMeta = async () => {
  try {
    const r = await getAccountsWithTotal();
    const list = r?.data?.accounts ?? [];
    accountMeta.value =
      list.find((a) => String(a.id) === String(accountId)) || null;
  } catch {
    accountMeta.value = null;
  }
};

onMounted(() => {
  loadAccountMeta();
  fetchTransactions();
  window.addEventListener('open-filter-modal', handleOpenFilter);
});
onUnmounted(() =>
  window.removeEventListener('open-filter-modal', handleOpenFilter)
);
watch([period, start, end], fetchTransactions);
watch(
  () => route.params.accountId,
  async () => {
    await loadAccountMeta();
    await fetchTransactions();
  }
);

/** ===== 표시 유틸 ===== */
const getTitle = (t) =>
  t.place || t.merchantName || t.accountName || t.memo || '거래';
const getDate = (t) =>
  t.date || t.tranDtime || t.tranDateTime || t.tranDate || t.approvalDtime;
const getAmount = (t) => {
  if (typeof t.amount === 'number') return t.amount;
  if (typeof t.amount === 'string')
    return Number(t.amount.replaceAll(',', '')) || 0;
  if (typeof t.tranAmt !== 'undefined') return Number(t.tranAmt) || 0;
  return 0;
};
const isIncome = (t) => {
  if (t.type) return /in|deposit|입금/i.test(t.type);
  return getAmount(t) > 0;
};
const getBalance = (t) => {
  const v = t.balanceAfter ?? t.afterBalanceAmt ?? t.balance ?? null;
  return v === undefined ? null : v;
};
const formatCurrency = (n) =>
  (Number(n) || 0).toLocaleString(undefined, { maximumFractionDigits: 0 });
const signedAmount = (t) => {
  const a = Math.abs(getAmount(t));
  const sign = isIncome(t) ? '+' : '-';
  return `${sign}${formatCurrency(a)}원`;
};
const formatDateLabel = (d) => {
  const date = d instanceof Date ? d : new Date(d);
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
};
const formatTime = (dateish) => {
  const d = dateish instanceof Date ? dateish : new Date(dateish);
  if (Number.isNaN(+d)) return '';
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
};

/** ===== 헤더 요약: 밖/목록과 완전 동일 수치 =====
 * 우선순위: 라우트(query.displayBalance) → 최신 afterBalance → 서버 balance
 */
const summary = computed(() => {
  const meta = accountMeta.value || {};
  const bank =
    (typeof route.query.bank === 'string' && route.query.bank) ||
    meta.productName ||
    'KB국민은행';
  const accNo =
    (typeof route.query.accountNo === 'string' && route.query.accountNo) ||
    meta.accountNumber ||
    '****';
  const fromRoute =
    route.query.displayBalance != null
      ? Number(route.query.displayBalance)
      : null;
  const finalBalance =
    fromRoute ??
    (latestAfter.value != null
      ? Number(latestAfter.value)
      : Number(meta.balance ?? 0));
  return { bankName: bank, accountNo: accNo, balance: finalBalance };
});

/** 날짜별 그룹핑 */
const grouped = computed(() => {
  const by = new Map();
  items.value.forEach((t) => {
    const dt = getDate(t);
    const key = (dt ?? '').toString().slice(0, 10);
    if (!by.has(key)) by.set(key, []);
    by.get(key).push(t);
  });
  const arr = [...by.entries()].map(([key, list]) => {
    list.sort((a, b) => new Date(getDate(b)) - new Date(getDate(a)));
    return { key, label: formatDateLabel(key), items: list };
  });
  arr.sort((a, b) => new Date(b.key) - new Date(a.key));
  return arr;
});
</script>

<style scoped>
/* 기존 스타일 그대로 포함(생략 없이) */
:root {
  --bg-page: #f6f7f8;
  --white: #fff;
  --strong: #222;
  --sub: #8a8a8a;
  --border: #eee;
}
.account-detail-container {
  background: var(--bg-page);
  min-height: 100vh;
  padding: 0 0 100px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
.account-card {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  margin: 0 16px 24px;
}
.ac-top {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}
.ac-bank {
  font-size: 15px;
  font-weight: 700;
  color: var(--strong);
}
.ac-type {
  font-size: 13px;
  color: #666;
}
.ac-balance {
  text-align: right;
  font-weight: 900;
  font-size: 2rem;
  color: #4318d1;
}
.ac-won {
  margin-left: 6px;
  font-size: 18px;
  font-weight: 800;
}
.account-transactions {
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
.tx-count {
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
.tx-balance {
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
