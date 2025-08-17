<template>
  <div class="account-detail-container">
    <!-- ───── 상단 흰 박스 (계좌 요약) ───── -->
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

    <!-- ───── 거래 내역 (풀블리드 흰 영역) ───── -->
    <section class="account-transactions">
      <div class="tx-header">
        <button
          class="tx-filter-btn"
          @click="handleOpenFilter"
          aria-label="기간 필터 열기"
        >
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
import { getAccountTransactions } from '@/api/openbanking/accountsApi';

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

// 카드 표기값
const summary = computed(() => {
  const first = items.value[0] || {};
  const bank = route.query.bank || first.bankName || first.bank || 'KB국민은행';
  const accNo =
    route.query.accountNo ||
    first.accountNo ||
    first.accountNumber ||
    '7018-0000-1111-22';
  const bal =
    first.balanceAfter ?? first.balance ?? first.afterBalanceAmt ?? 10000000;
  return { bankName: bank, accountNo: accNo, balance: Number(bal) || 0 };
});

const handleOpenFilter = () => (showFilter.value = true);

// API
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
    const res = await getAccountTransactions(accountId, { from, to });
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

// 표시 유틸
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
  const v = t.balanceAfter ?? t.balance ?? t.afterBalanceAmt ?? null;
  return v === undefined ? null : v;
};
const formatCurrency = (n) =>
  (Number(n) || 0).toLocaleString(undefined, { maximumFractionDigits: 0 });
const signedAmount = (t) => {
  const a = Math.abs(getAmount(t));
  const sign = isIncome(t) ? '+' : '-';
  return `${sign}${formatCurrency(a)}원`;
};
const formatTime = (dateish) => {
  const d = dateish instanceof Date ? dateish : new Date(dateish);
  if (Number.isNaN(+d)) return '';
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
};
const formatDateLabel = (d) => {
  const date = d instanceof Date ? d : new Date(d);
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
};

// 날짜별 그룹핑
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
:root {
  --bg-page: #f6f7f8; /* 리스트 페이지 톤 */
  --white: #fff;
  --strong: #222;
  --sub: #8a8a8a;
  --border: #eee;
}

/* 페이지 배경/여백: 리스트 페이지 톤 */
.account-detail-container {
  background: var(--bg-page);
  min-height: 100vh;
  padding: 0 0 100px; /* 좌우 패딩 제거, 하단 탭 여백 유지 */
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

/* ── 상단 흰 카드: 리스트 페이지처럼 마진 0 16px */
.account-card {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  margin: 0 16px 24px;
}
.ac-top {
  display: flex;
  flex-direction: column; /* 세로 정렬 */
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

/* ── 거래 내역: 풀블리드 흰 영역 (좌우 꽉 차게) */
.account-transactions {
  background: #fff;
  margin: 0 0 16px; /* 좌우 꽉 (컨테이너 패딩 제거됐으니) */
  padding: 12px 16px 24px; /* 내부 패딩만 유지 */
}

/* 헤더 라인 */
.tx-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 5px 0 16px 0px;
}
.tx-filter-btn {
  appearance: none;
  border: 0;
  background: none; /* 배경 제거 */
  color: var(--strong); /* 검정 글씨 */
  font-weight: 800;
  font-size: 16px;
  padding: 0; /* 여백 제거 */
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

/* 날짜/아이템 그리드: 왼쪽 날짜 좁게, 오른쪽 리스트 */
.tx-group {
  display: grid;
  grid-template-columns: 72px 1fr; /* 날짜 폭 고정 */
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

/* 아이템 한 줄: 좌(상호/시간) 우(금액/잔액) */
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
} /* 스샷처럼 진한 검정 */
.tx-balance {
  font-size: 12px;
  color: var(--sub);
}

/* 빈 상태 */
.tx-empty {
  text-align: center;
  color: var(--sub);
  padding: 20px 0 8px;
}

/* 추가: 거래 내역을 스크롤 가능하도록 */
.tx-groups {
  max-height: 60vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
</style>
