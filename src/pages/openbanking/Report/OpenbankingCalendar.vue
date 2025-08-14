<template>
  <div class="obcal-container">
    <div class="obcal-month-card">
      <CalendarComponent
        :is-expanded="isExpanded"
        :selected-date="selectedDate"
        :current-month="currentMonthStr"
        :show-summary="true"
        :total-consumption="totalConsumption"
        :last-month-diff-text="lastMonthDiffText"
        :daily-expenses="dailyExpensesObject"
        scroll-row-id-prefix="d-"
        :auto-scroll-on-select="false"
        @date-selected="onDateSelected"
        @month-changed="onMonthChanged"
        @toggle-expanded="onToggleExpanded"
        @scroll-to-date="onScrollToDate"
      />
    </div>

    <!-- 거래 내역 리스트 -->
    <div class="obcal-list-section">
      <!-- 주간(접힘) -->
      <div v-if="!isExpanded" class="transaction-section">
        <div class="obcal-list-title">{{ formatDay(selectedDate) }}</div>
        <div class="obcal-list-container">
          <div
            class="obcal-list-item"
            v-for="(transaction, index) in selectedDateOnly || []"
            :key="transaction.id ?? index"
            @click="goToTransactionDetail(transaction.id)"
          >
            <div class="obcal-bank-logo">
              <img :src="getLogo(transaction)" :alt="getAlt(transaction)" />
            </div>
            <div class="obcal-list-info">
              <div
                class="obcal-list-amount"
                :class="{
                  income: transaction.type === 'INCOME',
                  expense: transaction.type === 'EXPENSE',
                }"
              >
                {{ transaction.type === 'INCOME' ? '+' : '-' }}
                {{ Number(transaction.amount).toLocaleString() }}원
              </div>
              <div class="obcal-list-name">
                {{ transaction.merchantName }} · {{ transaction.sourceName }}
              </div>
            </div>
            <div class="obcal-list-arrow">›</div>
          </div>

          <div
            v-if="(selectedDateOnly || []).length === 0"
            class="obcal-no-data"
          >
            해당 날짜의 거래 내역이 없습니다.
          </div>
        </div>
      </div>

      <!-- 월간(펼침) -->
      <div
        v-else
        class="monthly-transactions"
        ref="monthlyListRef"
        aria-label="월간 거래 내역 목록"
      >
        <div
          v-for="(dateGroup, dateKey) in monthlyTransactionGroups"
          :key="dateKey"
          :id="'d-' + dateKey"
          class="transaction-section"
        >
          <div class="obcal-list-title">{{ formatDay(dateKey) }}</div>
          <div class="obcal-list-container">
            <div
              class="obcal-list-item"
              v-for="transaction in dateGroup"
              :key="transaction.id"
              @click="goToTransactionDetail(transaction.id)"
            >
              <div class="obcal-bank-logo">
                <img
                  :src="getLogo(transaction)"
                  :alt="transaction.category + ' 로고'"
                />
              </div>
              <div class="obcal-list-info">
                <div
                  class="obcal-list-amount"
                  :class="{
                    income: transaction.type === 'INCOME',
                    expense: transaction.type === 'EXPENSE',
                  }"
                >
                  {{ transaction.type === 'INCOME' ? '+' : '-' }}
                  {{ Number(transaction.amount).toLocaleString() }}원
                </div>
                <div class="obcal-list-name">
                  {{ transaction.merchantName }} · {{ transaction.sourceName }}
                </div>
              </div>
              <div class="obcal-list-arrow">›</div>
            </div>
          </div>
        </div>

        <div
          v-if="Object.keys(monthlyTransactionGroups).length === 0"
          class="obcal-no-data"
        >
          이번 달 거래가 없습니다.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import CalendarComponent from '@/components/openbanking/CalendarComponent.vue';
import { getLedger } from '@/api/openbanking/ledgerApi.js';
import { formatDay, formatDateKey } from '@/utils/dateUtils.js';
import { categoryToLogo, categoryAlt } from '@/utils/categoryLogo.js';

const router = useRouter();

/* 로고/alt */
const getLogo = (tx) => categoryToLogo(tx?.category);
const getAlt = (tx) => categoryAlt(tx?.category);

/* 상태 */
const isExpanded = ref(false);
const selectedDate = ref(new Date());
const currentYear = ref(new Date().getFullYear());
const currentMonth = ref(new Date().getMonth() + 1);

const selectedYM = computed(
  () => `${currentYear.value}-${String(currentMonth.value).padStart(2, '0')}`
);

/* 현재/전월 거래 & 합계 */
const monthTx = ref([]);
const monthTotal = ref(0);
const prevMonthTotal = ref(0);

/* 지출 합계(지출만) */
const sumExpense = (list) =>
  (list || [])
    .filter((t) => t.type === 'EXPENSE')
    .reduce((a, b) => a + Number(b.amount || 0), 0);

/* “지난달보다 n만원 더/덜” */
const formatDiffText = (current, prev) => {
  if (!isFinite(current) || !isFinite(prev)) return '같이';
  const diff = current - prev;
  if (Math.abs(diff) < 1000) return '같이';
  const man = Math.round(Math.abs(diff) / 10000);
  return `${man.toLocaleString()}만원 ${diff > 0 ? '더' : '덜'}`;
};
const lastMonthDiffText = computed(() =>
  formatDiffText(monthTotal.value ?? 0, prevMonthTotal.value ?? 0)
);

/* 캘린더 prop */
const currentMonthStr = computed(
  () => `${currentYear.value}-${String(currentMonth.value).padStart(2, '0')}`
);

/* 상단 금액(현재월 지출 합) */
const totalConsumption = computed(() => monthTotal.value || 0);

/* 날짜별 지출 합계 */
const dailyExpensesObject = computed(() => {
  const o = {};
  (monthTx.value || []).forEach((t) => {
    if (t.type !== 'EXPENSE') return;
    const k = formatDateKey(t.date);
    o[k] = (o[k] || 0) + Number(t.amount || 0);
  });
  return o;
});

/* 일자별 그룹 (최신일자 우선 정렬) */
const monthlyTransactionGroups = computed(() => {
  const g = {};
  (monthTx.value || []).forEach((t) => {
    const k = formatDateKey(t.date);
    (g[k] ||= []).push(t);
  });
  return Object.fromEntries(
    Object.entries(g).sort((a, b) => b[0].localeCompare(a[0]))
  );
});

const selectedDateOnly = computed(() => {
  const key = formatDateKey(selectedDate.value);
  return (monthTx.value || []).filter((t) => formatDateKey(t.date) === key);
});

/* 기간 도우미 */
const monthRange = (y, m) => {
  const mm = String(m).padStart(2, '0');
  const from = `${y}-${mm}-01`;
  const to = `${y}-${mm}-${String(new Date(y, m, 0).getDate()).padStart(
    2,
    '0'
  )}`;
  return { from, to };
};

/* 월 변경 시: ledger 두 번 호출해서 정확 비교 */
watch(
  selectedYM,
  async (ym) => {
    try {
      const [y, m] = ym.split('-').map(Number);

      // 현재월
      const { from, to } = monthRange(y, m);
      const curRes = await getLedger({ from, to }); // {status, message, data}
      const cur = curRes?.data ?? [];
      monthTx.value = cur;
      monthTotal.value = sumExpense(cur);

      // 지난달
      const prev = new Date(y, m - 1, 1);
      const py = prev.getFullYear();
      const pm = prev.getMonth() + 1;
      const { from: pFrom, to: pTo } = monthRange(py, pm);
      const prvRes = await getLedger({ from: pFrom, to: pTo });
      const prv = prvRes?.data ?? [];
      prevMonthTotal.value = sumExpense(prv);
    } catch (e) {
      console.error('Failed to load month data:', e);
      monthTx.value = [];
      monthTotal.value = 0;
      prevMonthTotal.value = 0;
    }
  },
  { immediate: true }
);

/* 월간 리스트 스크롤 */
const monthlyListRef = ref(null);
const scrollToDate = async (date) => {
  await nextTick();
  const key = formatDateKey(date);
  const el = document.getElementById('d-' + key);
  const container = monthlyListRef.value;
  if (el && container) {
    const top = el.offsetTop - 8;
    if (container.scrollTo) container.scrollTo({ top, behavior: 'smooth' });
    else container.scrollTop = top;
  }
};
const onScrollToDate = async ({ key, date }) => {
  if (!isExpanded.value) return;
  await nextTick();
  const el = document.getElementById('d-' + key);
  const container = monthlyListRef.value;
  if (el && container) {
    const top = el.offsetTop - 8;
    if (container.scrollTo) container.scrollTo({ top, behavior: 'smooth' });
    else container.scrollTop = top;
  } else {
    requestAnimationFrame(() => scrollToDate(date));
  }
};

/* 이벤트 */
const onDateSelected = (date) => {
  selectedDate.value = new Date(date);
};
const onMonthChanged = ({ year, month }) => {
  currentYear.value = year;
  currentMonth.value = month;
};
const onToggleExpanded = (expanded) => {
  isExpanded.value = expanded;
  if (expanded) requestAnimationFrame(() => scrollToDate(selectedDate.value));
};

/* 네비게이션 */
const goToTransactionDetail = (transactionId) => {
  router.push({ name: 'CalendarDetail', params: { id: transactionId } });
};

/* 정리 */
const cleanupSessionStorage = () => {
  Object.keys(sessionStorage).forEach((key) => {
    if (key.startsWith('selectedCategory_')) sessionStorage.removeItem(key);
  });
};
onUnmounted(() => cleanupSessionStorage());
</script>

<style scoped>
/* ===== 페이지 레이아웃 ===== */
.obcal-container {
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  background: #fff;
}
.obcal-month-card {
  background: transparent;
  border-radius: 0;
  box-shadow: none;
  padding: 0 16px 8px;
  margin: 0;
}
.obcal-list-section {
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: #fff;
}

/* 날짜 섹션 */
.transaction-section {
  background: #fff;
  border-radius: 0;
  box-shadow: none;
  border: none;
  scroll-margin-top: 12px;
}
.obcal-list-title {
  padding: 10px 16px;
  border-bottom: 1px solid #f0f0f0;
  font: 600 15px/1.2 'Noto Sans KR', sans-serif;
  color: #111;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* 주간: 리스트 스크롤 */
.obcal-list-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: #fff;
  padding: 16px;
  max-height: 60vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

/* 월간: 부모가 스크롤 */
.monthly-transactions .obcal-list-container {
  max-height: none;
  overflow: visible;
  padding: 12px 16px 0;
}
.monthly-transactions {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-y: contain;
  background: #fff;
  scroll-margin-top: 12px;
}

/* 아이템 */
.obcal-list-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  min-height: 44px;
}
.obcal-list-item:hover {
  background: #f8f9fa;
}
.obcal-list-item:last-child {
  border-bottom: none;
}

.obcal-bank-logo {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ececec;
  overflow: hidden;
  flex-shrink: 0;
}
.obcal-bank-logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 50%;
}

.obcal-list-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
}
.obcal-list-amount {
  font-size: 0.95rem;
  color: #4318d1;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.obcal-list-amount.income {
  color: #4318d1;
}
.obcal-list-amount.expense {
  color: #ef4444;
}
.obcal-list-name {
  font-size: 0.9rem;
  color: #666;
  font-weight: 400;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.obcal-list-arrow {
  font-size: 18px;
  color: #4318d1;
  flex-shrink: 0;
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.obcal-no-data {
  font-size: 0.95rem;
  color: #888;
  text-align: center;
  padding: 20px 0;
}

/* 반응형 */
@media (max-width: 430px) {
  .obcal-container {
    width: 100vw;
    min-width: 100vw;
    max-width: 100vw;
  }
  .obcal-month-card {
    padding: 16px 16px 8px;
  }
  .obcal-list-container {
    padding: 12px;
  }
  .obcal-list-item {
    padding: 10px 12px;
  }
}
</style>
