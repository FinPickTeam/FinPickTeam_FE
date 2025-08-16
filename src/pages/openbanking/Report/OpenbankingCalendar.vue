<template>
  <div class="obcal-container">
    <div class="obcal-month-card">
      <CalendarComponent
        v-model:pages="calendarPage"
        :is-expanded="isExpanded"
        :selected-date="selectedDate"
        :current-month="currentMonthStr"
        :show-summary="true"
        :total-consumption="totalConsumption"
        :last-month-diff-text="lastMonthDiffText"
        :daily-expenses="dailyExpensesObject"
        @date-selected="onDateSelected"
        @month-changed="onMonthChanged"
        @toggle-expanded="onToggleExpanded"
        @scroll-to-date="onScrollToDate"
      />
    </div>

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
            v-if="!selectedDateOnly || selectedDateOnly.length === 0"
            class="obcal-no-data"
          >
            해당 날짜의 거래 내역이 없습니다.
          </div>
        </div>
      </div>

      <!-- 월간(펼침) -->
      <div v-else class="monthly-transactions" ref="monthlyListRef">
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
import { ref, computed, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import CalendarComponent from '@/components/openbanking/CalendarComponent.vue';
import { getLedger } from '@/api/openbanking/ledgerApi.js';
import {
  formatDay,
  formatDateKey,
} from '@/components/openbanking/dateUtils.js';
import {
  categoryToLogo,
  categoryAlt,
} from '@/components/openbanking/categoryLogo.js';

const router = useRouter();

const getLogo = (tx) => categoryToLogo(tx?.category);
const getAlt = (tx) => categoryAlt(tx?.category);

// --- 상태 ---
const isExpanded = ref(false);
const selectedDate = ref(new Date());
const calendarPage = ref([
  { year: new Date().getFullYear(), month: new Date().getMonth() + 1 },
]);

// --- 계산값 ---
const currentYear = computed(() => calendarPage.value[0].year);
const currentMonth = computed(() => calendarPage.value[0].month);
const currentMonthStr = computed(
  () => `${currentYear.value}-${String(currentMonth.value).padStart(2, '0')}`
);

// --- 데이터 상태 ---
const monthTx = ref([]);
const prevMonthTotal = ref(0);

// --- UI 데이터 ---
const totalConsumption = computed(() => sumExpense(monthTx.value));
const lastMonthDiffText = computed(() =>
  formatDiffText(totalConsumption.value, prevMonthTotal.value)
);

const dailyExpensesObject = computed(() => {
  const o = {};
  monthTx.value.forEach((t) => {
    if (t.type === 'EXPENSE') {
      const k = formatDateKey(new Date(t.date));
      o[k] = (o[k] || 0) + Number(t.amount);
    }
  });
  return o;
});

const monthlyTransactionGroups = computed(() => {
  const g = {};
  monthTx.value.forEach((t) => {
    const k = formatDateKey(new Date(t.date));
    (g[k] ||= []).push(t);
  });
  return Object.fromEntries(
    Object.entries(g).sort((a, b) => b[0].localeCompare(a[0]))
  );
});

const selectedDateOnly = computed(
  () => monthlyTransactionGroups.value[formatDateKey(selectedDate.value)] || []
);

// --- 헬퍼 ---
const sumExpense = (list) =>
  list.reduce(
    (acc, t) => acc + (t.type === 'EXPENSE' ? Number(t.amount) : 0),
    0
  );

const formatDiffText = (current, prev) => {
  if (prev === 0 && current > 0) return '새롭게';
  if (prev === 0) return '변동 없이';
  const diff = current - prev;
  if (Math.abs(diff) < 1000) return '비슷하게';
  const man = Math.round(Math.abs(diff) / 10000);
  return `${man.toLocaleString()}만원 ${diff > 0 ? '더' : '덜'}`;
};

const monthRange = (y, m) => {
  const start = new Date(y, m - 1, 1);
  const end = new Date(y, m, 0);
  return { from: formatDateKey(start), to: formatDateKey(end) };
};

// --- 스크롤 오프셋 유틸 ---
const SCROLL_OFFSET = 12; // 스티키 헤더 높이(+여유)
function scrollToKeyWithOffset(key, offset = SCROLL_OFFSET) {
  nextTick(() => {
    const container = monthlyListRef.value;
    const target = document.getElementById(`d-${key}`);
    if (!target) return;

    if (container) {
      const cTop = container.getBoundingClientRect().top;
      const tTop = target.getBoundingClientRect().top;
      const to = container.scrollTop + (tTop - cTop) + offset;
      container.scrollTo({ top: Math.max(0, to), behavior: 'smooth' });
    } else {
      const tTop = target.getBoundingClientRect().top + window.pageYOffset;
      const to = tTop + offset;
      window.scrollTo({ top: Math.max(0, to), behavior: 'smooth' });
    }
  });
}

// --- 이벤트 핸들러 ---
const onDateSelected = (date) => {
  selectedDate.value = new Date(date);
  if (isExpanded.value) {
    const key = formatDateKey(selectedDate.value);
    scrollToKeyWithOffset(key);
  }
};

const onScrollToDate = ({ key, date, offset }) => {
  if (date) selectedDate.value = new Date(date);
  if (isExpanded.value) {
    scrollToKeyWithOffset(key, offset ?? SCROLL_OFFSET);
  }
};

const onMonthChanged = ({ year, month }) => {
  calendarPage.value = [{ year, month }];

  const cur = new Date(selectedDate.value);
  const sameMonth = cur.getFullYear() === year && cur.getMonth() + 1 === month;

  if (!sameMonth) {
    const keepDay = cur.getDate?.() ?? 1;
    const lastDay = new Date(year, month, 0).getDate();
    const day = Math.min(keepDay, lastDay);
    const d = new Date(year, month - 1, day);
    d.setHours(0, 0, 0, 0);
    selectedDate.value = d;
  }
};
const onToggleExpanded = (expanded) => {
  isExpanded.value = expanded;
  if (!expanded) {
    const s = new Date(selectedDate.value);
    calendarPage.value = [{ year: s.getFullYear(), month: s.getMonth() + 1 }];
  } else {
    ensureSelectedInMonth();
  }
};

const goToTransactionDetail = (id) =>
  router.push({ name: 'CalendarDetail', params: { id } });

const monthlyListRef = ref(null);
const ensureSelectedInMonth = () => {
  if (!isExpanded.value) return;
  const key = formatDateKey(selectedDate.value);
  scrollToKeyWithOffset(key);
};

// --- 데이터 로드 ---
watch(
  currentMonthStr,
  async (ym) => {
    try {
      const [y, m] = ym.split('-').map(Number);

      // 현재 월
      const range = monthRange(y, m);
      const res = await getLedger({ from: range.from, to: range.to });
      monthTx.value = res.data ?? [];

      // 이전 월
      const prevM = new Date(y, m - 2, 1);
      const pRange = monthRange(prevM.getFullYear(), prevM.getMonth() + 1);
      const prevRes = await getLedger({ from: pRange.from, to: pRange.to });
      prevMonthTotal.value = sumExpense(prevRes.data ?? []);

      ensureSelectedInMonth();
    } catch (error) {
      console.error('데이터 로드 실패:', error);
      monthTx.value = [];
      prevMonthTotal.value = 0;
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.obcal-container {
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  background: #fff;
}
.obcal-month-card {
  background: transparent;
  padding: 0 16px 8px;
  margin: 0;
}
.obcal-list-section {
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
  background: #fff;
}
.transaction-section {
  /* JS로 오프셋 처리하지만 보조로 margin도 줌 */
  scroll-margin-top: 56px;
}
.obcal-list-title {
  position: sticky;
  top: 0;
  z-index: 5;
  background: #fff;
  padding: 0 0 5px 25px;
  border-bottom: 1px solid #f0f0f0;
  font: 600 15px/1.2 'Noto Sans KR', sans-serif;
  color: #111;
}
.obcal-list-container {
  padding: 16px;
}
.monthly-transactions {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
.obcal-list-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
}
.obcal-list-item:last-child {
  border-bottom: none;
}
.obcal-bank-logo {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid #ececec;
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.obcal-bank-logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.obcal-list-info {
  flex: 1;
  min-width: 0;
}
.obcal-list-amount {
  font-size: 0.95rem;
  font-weight: 700;
  white-space: nowrap;
}
.obcal-list-amount.income {
  color: var(--color-main);
}
.obcal-list-amount.expense {
  color: var(--color-accent);
}
.obcal-list-name {
  font-size: 0.9rem;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.obcal-list-arrow {
  font-size: 18px;
  color: #aaa;
}
.obcal-no-data {
  font-size: 0.95rem;
  color: #888;
  text-align: center;
  padding: 20px 0;
}
</style>
