<template>
  <div class="diaryhome-scroll-container">
    <div class="diaryhome-container">
      <!-- 상단 헤더 -->
      <div class="diaryhome-header">
        <button class="diaryhome-back" @click="goBack">
          <font-awesome-icon :icon="['fas', 'angle-left']" />
        </button>
        <div class="diaryhome-header-icons">
          <button class="diaryhome-icon-btn" @click="goToDictionary">
            <font-awesome-icon :icon="['fas', 'search']" />
          </button>
          <button class="diaryhome-icon-btn">
            <font-awesome-icon :icon="['fas', 'plus']" />
          </button>
        </div>
      </div>

      <!-- 월간 소비/달력 영역 -->
      <div class="diaryhome-month-card">
        <div class="diaryhome-month-row">
          <button class="diaryhome-month-arrow" @click="goPrevMonth">
            <font-awesome-icon :icon="['fas', 'angle-left']" />
          </button>
          <span class="diaryhome-month-title"
            >{{ currentYear }}년 {{ currentMonth }}월</span
          >
          <button class="diaryhome-month-arrow" @click="goNextMonth">
            <font-awesome-icon :icon="['fas', 'angle-right']" />
          </button>
        </div>
        <div class="diaryhome-month-amount">
          {{ totalConsumption.toLocaleString()
          }}<span class="diaryhome-won">원</span>
        </div>
        <div class="diaryhome-month-desc">
          지난 달보다
          <span class="diaryhome-more">{{ lastMonthDiffText }}</span> 쓰는 중
        </div>
        <!-- 달력 박스 -->
        <div class="diaryhome-calendar-box">
          <!-- 일주일 달력 -->
          <div v-if="calendarMode === 'week'" class="diaryhome-calendar-week">
            <div class="diaryhome-calendar-header">
              <button class="diaryhome-week-arrow" @click="goPrevWeek">
                <font-awesome-icon :icon="['fas', 'angle-left']" />
              </button>
              <div class="diaryhome-calendar-columns">
                <div
                  v-for="(day, index) in weekDays"
                  :key="day"
                  class="diaryhome-calendar-column"
                >
                  <div class="diaryhome-weekday">{{ day }}</div>
                  <div
                    class="diaryhome-date"
                    :class="{
                      selected: isSelectedDate(currentWeekDates[index].date),
                      'other-month': !currentWeekDates[index].isCurrentMonth,
                      today: isToday(currentWeekDates[index].date),
                    }"
                    @click="selectDate(currentWeekDates[index].date)"
                  >
                    {{ currentWeekDates[index].day }}
                  </div>
                </div>
              </div>
              <button class="diaryhome-week-arrow" @click="goNextWeek">
                <font-awesome-icon :icon="['fas', 'angle-right']" />
              </button>
            </div>
          </div>

          <!-- 한달 달력 -->
          <div v-else class="diaryhome-calendar-month">
            <div class="diaryhome-calendar-header">
              <span v-for="day in weekDays" :key="day">{{ day }}</span>
            </div>
            <div class="diaryhome-calendar-grid">
              <span
                v-for="date in currentMonthDates"
                :key="date.date"
                :class="{
                  selected: isSelectedDate(date.date),
                  'other-month': !date.isCurrentMonth,
                  today: isToday(date.date),
                }"
                @click="selectDate(date.date)"
              >
                {{ date.day }}
              </span>
            </div>
          </div>
        </div>
        <div class="diaryhome-calendar-date-row">
          <span class="diaryhome-calendar-arrow" @click="goCalendarDetail">
            <font-awesome-icon
              :icon="[
                'fas',
                calendarMode === 'week' ? 'angle-down' : 'angle-up',
              ]"
            />
          </span>
        </div>
      </div>
      <hr class="diaryhome-divider" />
      <!-- 거래 내역 리스트 -->
      <div class="diaryhome-list-section">
        <div class="diaryhome-list-title">선택된 날짜 거래 내역</div>
        <div class="diaryhome-list-container">
          <div
            class="diaryhome-list-item"
            v-for="transaction in displayedTransactions"
            :key="transaction.id"
          >
            <div class="diaryhome-bank-logo">
              <img :src="kakaoLogo" alt="은행로고" />
            </div>
            <div class="diaryhome-list-info">
              <div
                class="diaryhome-list-amount"
                :class="{
                  income: transaction.type === '입금',
                  expense: transaction.type === '출금',
                }"
              >
                {{ transaction.type === "입금" ? "+" : "-"
                }}{{ Number(transaction.amount).toLocaleString() }}원
              </div>
              <div class="diaryhome-list-name">
                {{ transaction.account }} | {{ transaction.description }}
              </div>
            </div>
          </div>
          <div
            v-if="selectedDateTransactions.length === 0"
            class="diaryhome-no-data"
          >
            해당 날짜의 거래 내역이 없습니다.
          </div>
          <div
            v-if="selectedDateTransactions.length > 2"
            class="diaryhome-more-btn"
            @click="toggleTransactions"
          >
            {{
              showAllTransactions
                ? "숨기기"
                : `더보기 (${selectedDateTransactions.length - 2}개 더)`
            }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faAngleLeft,
  faSearch,
  faPlus,
  faAngleRight,
  faAngleUp,
  faAngleDown,
} from "@fortawesome/free-solid-svg-icons";
library.add(
  faAngleLeft,
  faSearch,
  faPlus,
  faAngleRight,
  faAngleUp,
  faAngleDown
);

// 은행 로고 이미지 import
import kakaoLogo from "@/assets/bank_logo/카카오뱅크.png";

// Transaction 데이터 import
import transactionData from "./Transaction_dummy.json";

const router = useRouter();

// 달력 관련 상태
const currentYear = ref(new Date().getFullYear());
const currentMonth = ref(new Date().getMonth() + 1);
const selectedDate = ref(new Date());
const currentWeekStart = ref(new Date());

// 주차 이동을 위한 상태
const weekOffset = ref(0);

// 더보기 기능을 위한 상태
const showAllTransactions = ref(false);

// 달력 모드 상태 (week: 일주일, month: 한달)
const calendarMode = ref("week");

// 요일 배열
const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

// 월 이동 함수
const goPrevMonth = () => {
  if (currentMonth.value === 1) {
    currentYear.value--;
    currentMonth.value = 12;
  } else {
    currentMonth.value--;
  }
  updateCurrentWeekStart();
};

const goNextMonth = () => {
  if (currentMonth.value === 12) {
    currentYear.value++;
    currentMonth.value = 1;
  } else {
    currentMonth.value++;
  }
  updateCurrentWeekStart();
};

// 주차 이동 함수
const goPrevWeek = () => {
  weekOffset.value--;
  updateCurrentWeekStart();
};

const goNextWeek = () => {
  weekOffset.value++;
  updateCurrentWeekStart();
};

// 현재 주의 시작일 업데이트
const updateCurrentWeekStart = () => {
  const firstDayOfMonth = new Date(
    currentYear.value,
    currentMonth.value - 1,
    1
  );
  const dayOfWeek = firstDayOfMonth.getDay();
  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(1 - dayOfWeek);
  startDate.setDate(startDate.getDate() + weekOffset.value * 7);
  currentWeekStart.value = startDate;
};

// 현재 주의 날짜들 계산
const currentWeekDates = computed(() => {
  const dates = [];
  const startDate = new Date(currentWeekStart.value);

  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);

    dates.push({
      date: date,
      day: date.getDate(),
      isCurrentMonth:
        date.getMonth() === currentMonth.value - 1 &&
        date.getFullYear() === currentYear.value,
    });
  }

  return dates;
});

// 현재 월의 모든 날짜들 계산
const currentMonthDates = computed(() => {
  const dates = [];
  const firstDayOfMonth = new Date(
    currentYear.value,
    currentMonth.value - 1,
    1
  );
  const lastDayOfMonth = new Date(currentYear.value, currentMonth.value, 0);

  // 이전 달의 날짜들 (달력 시작 부분)
  const firstDayOfWeek = firstDayOfMonth.getDay();
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(firstDayOfMonth);
    date.setDate(date.getDate() - (i + 1));
    dates.push({
      date: date,
      day: date.getDate(),
      isCurrentMonth: false,
    });
  }

  // 현재 달의 날짜들
  for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
    const date = new Date(currentYear.value, currentMonth.value - 1, i);
    dates.push({
      date: date,
      day: i,
      isCurrentMonth: true,
    });
  }

  // 다음 달의 날짜들 (달력 끝 부분)
  const remainingDays = 42 - dates.length; // 6주 * 7일 = 42
  for (let i = 1; i <= remainingDays; i++) {
    const date = new Date(currentYear.value, currentMonth.value, i);
    dates.push({
      date: date,
      day: date.getDate(),
      isCurrentMonth: false,
    });
  }

  return dates;
});

// 더보기/숨기기 토글 함수
const toggleTransactions = () => {
  showAllTransactions.value = !showAllTransactions.value;
};

// 달력 모드 토글 함수
const toggleCalendarMode = () => {
  calendarMode.value = calendarMode.value === "week" ? "month" : "week";
};

// 날짜 선택 함수
const selectDate = (date) => {
  // 날짜 객체를 새로 생성하여 참조 문제 방지
  const newDate = new Date(date.getTime());
  selectedDate.value = newDate;
  showAllTransactions.value = false; // 날짜 변경 시 더보기 상태 초기화

  // 선택된 날짜의 년월이 현재 표시된 년월과 다르면 업데이트
  const selectedYear = newDate.getFullYear();
  const selectedMonth = newDate.getMonth() + 1;

  if (
    selectedYear !== currentYear.value ||
    selectedMonth !== currentMonth.value
  ) {
    currentYear.value = selectedYear;
    currentMonth.value = selectedMonth;

    // 선택된 날짜가 속한 주의 시작일을 계산하여 해당 주가 표시되도록 설정
    const selectedDayOfWeek = newDate.getDay();
    const daysToSubtract = selectedDayOfWeek;
    const weekStartDate = new Date(newDate);
    weekStartDate.setDate(newDate.getDate() - daysToSubtract);

    // 현재 주 시작일을 선택된 날짜가 속한 주의 시작일로 설정
    currentWeekStart.value = weekStartDate;
    weekOffset.value = 0; // 주차 오프셋 초기화
  }
};

// 선택된 날짜인지 확인
const isSelectedDate = (date) => {
  return date.toDateString() === selectedDate.value.toDateString();
};

// 오늘 날짜인지 확인
const isToday = (date) => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

// 현재 월의 총 소비 계산
const totalConsumption = computed(() => {
  return Array.isArray(transactionData?.transactions)
    ? transactionData.transactions
        .filter((t) => {
          const tDate = new Date(t.date);
          return (
            tDate.getFullYear() === currentYear.value &&
            tDate.getMonth() + 1 === currentMonth.value &&
            (t.type || "").trim() === "출금"
          );
        })
        .reduce((sum, t) => sum + Number(t.amount || 0), 0)
    : 0;
});

// 이전달 총 소비 계산
const prevMonthConsumption = computed(() => {
  const prevYear =
    currentMonth.value === 1 ? currentYear.value - 1 : currentYear.value;
  const prevMonth = currentMonth.value === 1 ? 12 : currentMonth.value - 1;

  return Array.isArray(transactionData?.transactions)
    ? transactionData.transactions
        .filter((t) => {
          const tDate = new Date(t.date);
          return (
            tDate.getFullYear() === prevYear &&
            tDate.getMonth() + 1 === prevMonth &&
            (t.type || "").trim() === "출금"
          );
        })
        .reduce((sum, t) => sum + Number(t.amount || 0), 0)
    : 0;
});

// 지난달 대비 증감 텍스트
const lastMonthDiffText = computed(() => {
  const diff = totalConsumption.value - prevMonthConsumption.value;
  if (diff > 0) {
    return `${Math.round(diff / 10000)}만원 더`;
  } else if (diff < 0) {
    return `${Math.round(Math.abs(diff) / 10000)}만원 덜`;
  } else {
    return "같이";
  }
});

// 선택된 날짜의 거래 내역 계산
const selectedDateTransactions = computed(() => {
  return Array.isArray(transactionData?.transactions)
    ? transactionData.transactions
        .filter((t) => {
          const tDate = new Date(t.date);
          return (
            tDate.getFullYear() === selectedDate.value.getFullYear() &&
            tDate.getMonth() + 1 === selectedDate.value.getMonth() + 1 &&
            tDate.getDate() === selectedDate.value.getDate()
          );
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date))
    : [];
});

// 화면에 표시할 거래 내역 계산 (최대 2개 또는 전체)
const displayedTransactions = computed(() => {
  if (showAllTransactions.value) {
    return selectedDateTransactions.value;
  } else {
    return selectedDateTransactions.value.slice(0, 2);
  }
});

// 네비게이션 함수들
const goToDictionary = () => {
  router.push("/dictionary");
};

const goBack = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push("/");
  }
};

const goToReport = () => {
  router.push("/openbanking/myhome");
};

const goCalendarDetail = () => {
  toggleCalendarMode();
};

// 초기화
updateCurrentWeekStart();
</script>

<style scoped>
.diaryhome-scroll-container {
  max-height: calc(100vh - 64px);
  overflow-y: auto;
  padding-bottom: 100px;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
}

.diaryhome-scroll-container::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.diaryhome-container {
  width: 390px;
  min-height: 844px;
  margin: 0 auto;
  background: #f7f8fa;
  font-family: "Noto Sans KR", sans-serif;
  box-sizing: border-box;
  padding-bottom: 80px;
}
.diaryhome-header {
  width: 100%;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 0 16px;
  box-sizing: border-box;
  border-bottom: 1px solid #ececec;
}
.diaryhome-back {
  background: none;
  border: none;
  font-size: 24px;
  color: #222;
  cursor: pointer;
  padding: 4px 8px 4px 0;
  border-radius: 8px;
  transition: background 0.15s;
}
.diaryhome-back:hover {
  background: #f3f3f3;
}
.diaryhome-header-icons {
  display: flex;
  gap: 12px;
}
.diaryhome-icon-btn {
  background: none;
  border: none;
  font-size: 22px;
  color: #4318d1;
  cursor: pointer;
  padding: 4px 4px;
  border-radius: 8px;
  transition: background 0.15s;
}
.diaryhome-icon-btn:hover {
  background: #f3f3f3;
}

.diaryhome-month-card {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 8px rgba(67, 24, 209, 0.07);
  margin: 18px 16px 16px 16px;
  padding: 22px 20px 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.diaryhome-month-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  color: #222;
  margin-bottom: 2px;
}
.diaryhome-month-arrow {
  background: none;
  border: none;
  color: #4318d1;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background 0.15s;
}

.diaryhome-month-arrow:hover {
  background: #f3f3f3;
}
.diaryhome-month-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #222;
}
.diaryhome-month-amount {
  font-size: 2.1rem;
  font-weight: 700;
  color: #4318d1;
  margin-bottom: 2px;
}
.diaryhome-won {
  font-size: 1.1rem;
  font-weight: 400;
  color: #888;
  margin-left: 2px;
}
.diaryhome-month-desc {
  font-size: 1rem;
  color: #888;
  margin-bottom: 8px;
}
.diaryhome-more {
  color: #e11d48;
  font-weight: 600;
}
.diaryhome-calendar {
  margin-bottom: 6px;
}
.diaryhome-calendar-row {
  display: flex;
  justify-content: space-between;
  font-size: 1rem;
  color: #888;
}
.diaryhome-calendar-header {
  font-weight: 600;
  color: #222;
  margin-bottom: 2px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: center;
  min-height: 70px; /* 버튼과 컬럼의 높이 증가 */
  width: 100%;
  gap: 2px; /* 버튼과 컬럼 사이 간격 줄임 */
}

.diaryhome-calendar-columns {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  min-height: 70px; /* 컬럼의 높이 증가 */
  gap: 0px; /* 컬럼 사이 간격 제거 */
  width: 100%; /* 전체 너비 사용 */
}

.diaryhome-calendar-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px; /* 요일과 날짜 사이 간격 줄임 */
  flex: 1;
  min-height: 70px; /* 각 컬럼의 높이 증가 */
  width: calc(100% / 7); /* 7개 컬럼으로 균등 분할 */
}

.diaryhome-weekday {
  font-size: 1.1rem;
  font-weight: 600;
  color: #222;
  margin-bottom: 2px;
}

.diaryhome-date {
  cursor: pointer;
  padding: 6px;
  border-radius: 50%;
  transition: background 0.15s;
  min-width: 32px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  color: #888;
}

.diaryhome-week-arrow {
  background: none;
  border: none;
  color: #4318d1;
  font-size: 1rem;
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 4px;
  transition: background 0.15s;
  width: 32px; /* 버튼 너비 조정 */
  height: 32px; /* 버튼 높이 조정 */
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0; /* 버튼 크기 고정 */
}

/* 호버 효과 제거 */
.diaryhome-date:hover {
  background: #f3f3f3;
}

.diaryhome-date.other-month {
  color: #ccc;
}

.diaryhome-date.today {
  background: #e0f2fe;
  color: #0369a1;
  font-weight: bold;
}

.diaryhome-list-section {
  margin: 0 16px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.diaryhome-list-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #222;
  margin-bottom: 8px;
}
.diaryhome-list-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: #fff;
  border-radius: 12px;
  padding: 14px 14px;
  box-shadow: 0 1px 4px rgba(67, 24, 209, 0.04);
}
.diaryhome-list-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.diaryhome-list-item:last-child {
  border-bottom: none;
}
.diaryhome-bank-logo {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ececec;
  overflow: hidden;
  flex-shrink: 0;
}

.diaryhome-bank-logo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}
.diaryhome-list-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}
.diaryhome-list-amount {
  font-size: 0.95rem;
  color: #4318d1;
  font-weight: 700;
}
.diaryhome-list-amount.income {
  color: #4318d1;
}
.diaryhome-list-amount.expense {
  color: #e11d48;
}
.diaryhome-list-name {
  font-size: 0.9rem;
  color: #666;
  font-weight: 400;
}
.diaryhome-no-data {
  font-size: 0.95rem;
  color: #888;
  text-align: center;
  padding: 10px 0;
}

.diaryhome-more-btn {
  width: 100%;
  background: #f7f8fa;
  color: #4318d1;
  border: none;
  border-radius: 8px;
  padding: 12px 0;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
  margin-top: 8px;
  text-align: center;
}

.diaryhome-more-btn:hover {
  background: #ece9fd;
}

.diaryhome-report-btn {
  width: calc(100% - 32px);
  margin: 0 16px 16px 16px;
  background: #ece9fd;
  color: #4318d1;
  border: none;
  border-radius: 8px;
  padding: 12px 0;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}
.diaryhome-report-btn:hover {
  background: #e0d7fa;
}

.diaryhome-calendar-box {
  /* border: 2px solid #764ba2; */
  border-radius: 16px;
  margin-bottom: 8px;
  background: #fff;
}
.diaryhome-date.selected,
.diaryhome-calendar-grid span.selected {
  background: #4318d1;
  color: #fff;
  border-radius: 50%;
  padding: 8px;
  font-weight: 700;
}

.diaryhome-calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  margin-top: 8px;
}

.diaryhome-calendar-grid span {
  cursor: pointer;
  padding: 6px;
  border-radius: 50%;
  transition: background 0.15s;
  min-width: 28px;
  text-align: center;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.diaryhome-calendar-grid span:hover {
  background: #f3f3f3;
}

.diaryhome-calendar-grid span.other-month {
  color: #ccc;
}

.diaryhome-calendar-grid span.today {
  background: #e0f2fe;
  color: #0369a1;
  font-weight: bold;
}
.diaryhome-calendar-date-row {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin: 0 2px 8px 2px;
  font-size: 1rem;
  color: #222;
}
.diaryhome-calendar-arrow {
  color: #4318d1;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
}
.diaryhome-divider {
  border: none;
  border-top: 1.5px solid #ececec;
  margin: 0 0 10px 0;
}

@media (max-width: 430px) {
  .diaryhome-container {
    width: 100vw;
    min-width: 100vw;
    max-width: 100vw;
  }
}
</style>
