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
      <div v-if="!isExpanded" class="transaction-section">
        <div class="obcal-list-title">
          {{ formatDay(selectedDate) }}
        </div>
        <div class="obcal-list-container">
          <div
            class="obcal-list-item"
            v-for="(transaction, index) in selectedDateOnly || []"
            :key="transaction.id"
            @click="goToTransactionDetail(transaction.id)"
          >
            <div class="obcal-bank-logo">
              <img
                :src="getBankLogoBySource(transaction)"
                :alt="transaction.sourceName + ' 로고'"
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
                {{ transaction.type === 'INCOME' ? '+' : '-'
                }}{{ Number(transaction.amount).toLocaleString() }}원
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

      <!-- 월간 모드 (펼침) -->
      <div v-else class="monthly-transactions" ref="monthlyListRef">
        <div
          v-for="(dateGroup, dateKey) in monthlyTransactionGroups"
          :key="dateKey"
          :id="'d-' + dateKey"
          class="transaction-section"
        >
          <div class="obcal-list-title">
            {{ formatDay(dateKey) }}
          </div>
          <div class="obcal-list-container">
            <div
              class="obcal-list-item"
              v-for="transaction in dateGroup"
              :key="transaction.id"
              @click="goToTransactionDetail(transaction.id)"
            >
              <div class="obcal-bank-logo">
                <img
                  :src="getBankLogoBySource(transaction)"
                  :alt="transaction.sourceName + ' 로고'"
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
                  {{ transaction.type === 'INCOME' ? '+' : '-'
                  }}{{ Number(transaction.amount).toLocaleString() }}원
                </div>
                <div class="obcal-list-name">
                  {{ transaction.merchantName }} · {{ transaction.sourceName }}
                </div>
              </div>
              <div class="obcal-list-arrow">›</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import CalendarComponent from '@/components/openbanking/CalendarComponent.vue';
import { getLedger } from '@/api/openbanking/ledgerApi.js';
import { getAssetSummaryCompare } from '@/api/openbanking/assetSummaryApi.js';
import { formatDay, formatDateKey } from '@/utils/dateUtils.js';
import { useLogos } from '@/components/openbanking/useLogos.js';
const { bankLogo } = useLogos();
const router = useRouter();

const getBankLogoBySource = (transaction) => {
  const map = {
    ACCOUNT: 'KB국민은행.png',
    CARD: '국민카드.png',
    NH: 'NH농협은행.png',
  };
  const name = map[transaction.sourceType] || 'KB국민은행.png';
  return bankLogo(name.replace('.png', ''));
};

// 상태 관리
const isExpanded = ref(false);
const selectedDate = ref(new Date());
const currentYear = ref(new Date().getFullYear());
const currentMonth = ref(new Date().getMonth() + 1);

// 선택월 문자열
const selectedYM = computed(
  () => `${currentYear.value}-${String(currentMonth.value).padStart(2, '0')}`
);

// 월 합계 상태
const monthTx = ref([]);
const monthTotal = ref(0);
const prevMonthTotal = ref(0);
const compare = ref({ currentSpending: 0, prevSpending: 0, spendingDiff: 0 });

// 차이 텍스트 포매터
const formatDiffText = (current, prev) => {
  if (!isFinite(current) || !isFinite(prev)) return '같이';
  const diff = current - prev;
  if (Math.abs(diff) < 1000) return '같이'; // 1천원 미만 무시
  const man = Math.round(Math.abs(diff) / 10000);
  return `${man.toLocaleString()}만원 ${diff > 0 ? '더' : '덜'}`;
};

// 비교 문구(같이/더/덜) – 우선 API, 폴백 ledger
const lastMonthDiffText = computed(() => {
  if (compare.value) {
    const { currentSpending, prevSpending } = compare.value;
    const txt = formatDiffText(currentSpending ?? 0, prevSpending ?? 0);
    if (txt) return txt;
  }
  return formatDiffText(monthTotal.value ?? 0, prevMonthTotal.value ?? 0);
});

// 선택월 변경 시 현재월/전월 데이터 조회
watch(
  selectedYM,
  async (ym) => {
    const [y, m] = ym.split('-').map(Number);
    const from = `${y}-${String(m).padStart(2, '0')}-01`;
    const to = `${y}-${String(m).padStart(2, '0')}-${String(
      new Date(y, m, 0).getDate()
    ).padStart(2, '0')}`;

    try {
      const cur = (await getLedger({ from, to })).data?.data ?? [];
      monthTx.value = cur;
      monthTotal.value = sumExpense(cur);

      const prev = new Date(y, m - 1, 1);
      const py = prev.getFullYear(),
        pm = prev.getMonth() + 1;
      const pFrom = `${py}-${String(pm).padStart(2, '0')}-01`;
      const pTo = `${py}-${String(pm).padStart(2, '0')}-${String(
        new Date(py, pm, 0).getDate()
      ).padStart(2, '0')}`;
      const prv = (await getLedger({ from: pFrom, to: pTo })).data?.data ?? [];
      prevMonthTotal.value = sumExpense(prv);

      // 비교 API 호출
      try {
        const res = await getAssetSummaryCompare({ month: ym });
        const data = res?.data?.data || {};
        compare.value = {
          currentSpending: Number(data.currentSpending) || 0,
          prevSpending: Number(data.prevSpending) || 0,
          spendingDiff: Number(data.spendingDiff) || 0,
        };
      } catch (e) {
        // API 실패 시 ledger 합계로 대체
        compare.value = {
          currentSpending: monthTotal.value,
          prevSpending: prevMonthTotal.value,
          spendingDiff: monthTotal.value - prevMonthTotal.value,
        };
      }
    } catch (error) {
      console.error('Failed to load month data:', error);
      monthTx.value = [];
      monthTotal.value = 0;
      prevMonthTotal.value = 0;
      compare.value = { currentSpending: 0, prevSpending: 0, spendingDiff: 0 };
    }
  },
  { immediate: true }
);

function sumExpense(list) {
  return (list || [])
    .filter((t) => t.type === 'EXPENSE')
    .reduce((a, b) => a + Number(b.amount || 0), 0);
}

// 현재 월 문자열
const currentMonthStr = computed(() => {
  return `${currentYear.value}-${String(currentMonth.value).padStart(2, '0')}`;
});

// ⬇️ 렌더 소스 교체
const totalConsumption = computed(
  () => (compare.value?.currentSpending ?? monthTotal.value) || 0
);

const dailyExpensesObject = computed(() => {
  const o = {};
  (monthTx.value || []).forEach((t) => {
    if (t.type !== 'EXPENSE') return;
    const k = formatDateKey(t.date); // 유틸이 문자열 안전 파싱
    o[k] = (o[k] || 0) + Number(t.amount || 0);
  });
  return o;
});

const monthlyTransactionGroups = computed(() => {
  const g = {};
  (monthTx.value || []).forEach((t) => {
    const k = formatDateKey(t.date); // 안전 파싱 유틸 사용
    (g[k] ||= []).push(t);
  });
  return Object.fromEntries(
    Object.entries(g).sort((a, b) => b[0].localeCompare(a[0])) // 'YYYY-MM-DD' 문자열 비교
  );
});

const selectedDateOnly = computed(() => {
  const key = formatDateKey(selectedDate.value);
  return (monthTx.value || []).filter((t) => formatDateKey(t.date) === key);
});

// 월간 리스트 ref
const monthlyListRef = ref(null);

// 날짜로 스크롤하는 함수
const scrollToDate = (date) => {
  const key = formatDateKey(date);
  const el = document.getElementById('d-' + key);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

const onScrollToDate = ({ key, date }) => {
  // 월간 상태일 때만 스크롤
  if (!isExpanded.value) return;
  // 우선 key로 스크롤 시도
  const el = document.getElementById('d-' + key);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    // 섹션이 아직 렌더 안됐으면 date 기반으로 재시도
    requestAnimationFrame(() => scrollToDate(date));
  }
};

// 날짜 선택 시: 주간/월간에 따라 동작 분기
const onDateSelected = (date) => {
  selectedDate.value = new Date(date);
};

const onMonthChanged = ({ year, month }) => {
  currentYear.value = year;
  currentMonth.value = month;
};

const onToggleExpanded = (expanded) => {
  isExpanded.value = expanded;
  if (expanded) {
    // 펼치자마자 현재 선택일 섹션으로 스크롤
    requestAnimationFrame(() => scrollToDate(selectedDate.value));
  }
};

// 네비게이션 함수들
const goToDictionary = () => {
  router.push('/dictionary');
};

const goBack = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push('/');
  }
};

const goToAccountLinkSelect = () => {
  router.push('/openbanking/account-link-select');
};

// 거래 상세로 이동
const goToTransactionDetail = (transactionId) => {
  router.push({ name: 'CalendarDetail', params: { id: transactionId } });
};

// 페이지를 벗어날 때 sessionStorage 정리
const cleanupSessionStorage = () => {
  // 모든 selectedCategory_ 키를 찾아서 삭제
  Object.keys(sessionStorage).forEach((key) => {
    if (key.startsWith('selectedCategory_')) {
      sessionStorage.removeItem(key);
    }
  });
};

onMounted(() => {});
onUnmounted(() => {
  cleanupSessionStorage();
});
</script>

<style scoped>
/* 페이지 전체 흰색 */
.obcal-container {
  background: #fff; /* ✅ 전체 흰색 */
}

/* 상단 캘린더 카드 느낌 삭제(통짜 흰색) */
.obcal-month-card {
  background: transparent; /* ✅ 카드 배경 제거 */
  border-radius: 0; /* ✅ 라운드 제거 */
  box-shadow: none; /* ✅ 그림자 제거 */
  padding: 0 16px 8px; /* 여백만 유지 */
  margin: 0; /* 외곽 여백 제거 */
}

/* 섹션 타이틀은 흰 바탕에 얇은 분리선 느낌만 */
.obcal-list-title {
  padding: 10px 16px;
  border-bottom: 1px solid #f0f0f0;
  font: 600 15px/1.2 'Noto Sans KR', sans-serif;
  color: #111;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.obcal-list-title .obcal-arrow-btn {
  margin-left: 8px;
}

/* 거래 리스트 영역도 종이처럼 평평하게 */
.transaction-section {
  background: #fff;
  border-radius: 0;
  box-shadow: none; /* ✅ 그림자 제거 */
  border: none; /* 보더도 제거(분리선은 타이틀에서 처리) */
  scroll-margin-top: 12px;
}

/* 바닥의 회색 띠(있으면 유지, 없으면 선택) */
.monthly-transactions,
.obcal-list-section {
  background: #fff;
}

.obcal-list-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.obcal-arrow-btn {
  background: none;
  border: none;
  font-size: 20px;
  color: #4318d1;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background 0.15s;
}

.obcal-arrow-btn:hover {
  background: #f3f3f3;
}

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

.obcal-list-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background 0.15s;
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

.monthly-transactions {
  scroll-margin-top: 12px;
  max-height: calc(100vh - 280px); /* 헤더·캘린더 높이 제외 대략값 */
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

@media (max-width: 430px) {
  .obcal-container {
    width: 100vw;
    min-width: 100vw;
    max-width: 100vw;
  }

  .obcal-month-card {
    padding: 16px 16px 0 16px;
  }

  .obcal-list-container {
    padding: 12px;
  }

  .obcal-list-item {
    padding: 10px 12px;
  }
}

/* 이 페이지에서만 헤더 흰색 오버라이드 - overrides.css에서 처리됨 */
</style>
