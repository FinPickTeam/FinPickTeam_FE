<template>
  <div class="calendar-wrapper">
    <Transition name="fade-slide" mode="out-in">
      <!-- ===== 주간(접힘) ===== -->
      <div v-if="!isExpanded" key="week-view">
        <div class="cal-h weekly">
          <div class="title-row">
            <button class="chev" @click="expandToMonth('prev')">
              <FontAwesomeIcon :icon="faCaretLeft" />
            </button>

            <Transition name="fade-slide" mode="out-in">
              <h2 class="title" :key="currentMonth">{{ monthOnly }}</h2>
            </Transition>

            <button class="chev" @click="expandToMonth('next')">
              <FontAwesomeIcon :icon="faCaretRight" />
            </button>
          </div>

          <div v-if="showSummary" class="summary">
            <div class="amount">
              {{ totalConsumption.toLocaleString()
              }}<span class="currency">원</span>
            </div>
            <div class="desc">
              지난 달보다 <span class="diff">{{ lastMonthDiffText }}</span> 쓰는
              중
            </div>
          </div>
        </div>

        <!-- 주간(이동 막음) -->
        <div class="week-wrap">
          <div class="week-header">
            <div v-for="d in weekDays" :key="'h-' + d.key" class="wh">
              {{ d.wd }}
            </div>
          </div>
          <div class="week-numbers">
            <button
              v-for="d in weekDays"
              :key="d.key"
              class="wn"
              :class="{
                selected: isSelected(d.date),
                today: isToday(d.date) && !isSelected(d.date),
                otherMonth: !isSameMonth(d.date),
              }"
              @click="onWeekClick(d.date)"
            >
              {{ d.day }}
            </button>
          </div>
        </div>
      </div>

      <!-- ===== 월간(펼침) ===== -->
      <div v-else key="month-view">
        <div class="cal-h monthly">
          <div class="title-row">
            <button class="chev" @click="goPrevMonth">
              <FontAwesomeIcon :icon="faCaretLeft" />
            </button>

            <Transition name="fade-slide" mode="out-in">
              <h2 class="title" :key="currentMonth">{{ monthOnly }}</h2>
            </Transition>

            <button class="chev" @click="goNextMonth">
              <FontAwesomeIcon :icon="faCaretRight" />
            </button>
          </div>

          <div v-if="showSummary" class="summary">
            <div class="amount">
              {{ totalConsumption.toLocaleString()
              }}<span class="currency">원</span>
            </div>
            <div class="desc">
              지난 달보다
              <span class="diff">{{ lastMonthDiffText }}</span> 썼어요
            </div>
          </div>
        </div>

        <Calendar
          :from-page="currentMonthPage"
          :columns="1"
          :rows="1"
          :first-day-of-week="0"
          :attributes="[]"
          class="custom-calendar"
          :key="currentMonth"
          style="display: block; width: 100%"
          @dayclick="onDayClick"
        >
          <template #day-content="{ day }">
            <div class="day-box">
              <div
                class="day-number"
                :class="{
                  'is-selected': isSelected(day.date),
                  'is-today': isToday(day.date) && !isSelected(day.date),
                }"
              >
                {{ day.day }}
              </div>
              <div v-if="getDailyExpense(day.date) > 0" class="daily-expense">
                {{ getDailyExpense(day.date).toLocaleString() }}
              </div>
            </div>
          </template>
        </Calendar>
      </div>
    </Transition>

    <div class="expand-toggle">
      <button class="toggle-btn" @click="emit('toggle-expanded', !isExpanded)">
        <FontAwesomeIcon :icon="isExpanded ? faChevronUp : faChevronDown" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue';
import { Calendar } from 'v-calendar';
import { formatDateKey } from '@/utils/dateUtils.js';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faChevronUp,
  faChevronDown,
  faCaretLeft,
  faCaretRight,
} from '@fortawesome/free-solid-svg-icons';

const props = defineProps({
  isExpanded: { type: Boolean, default: false },
  selectedDate: { type: Date, default: () => new Date() },
  currentMonth: {
    type: String,
    default: () => {
      const now = new Date();
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
        2,
        '0'
      )}`;
    },
  },
  showSummary: { type: Boolean, default: true },
  totalConsumption: { type: Number, default: 0 },
  lastMonthDiffText: { type: String, default: '' },
  dailyExpenses: { type: Object, default: () => ({}) }, // { 'YYYY-MM-DD': number }
  scrollRowIdPrefix: { type: String, default: 'tx-' },
  autoScrollOnSelect: { type: Boolean, default: true },
  scrollContainerSelector: { type: String, default: '.monthly-transactions' },
  scrollOffset: { type: Number, default: 8 },
});

const emit = defineEmits([
  'date-selected',
  'month-changed',
  'toggle-expanded',
  'scroll-to-date',
]);

const selectedDate = ref(new Date());

const currentMonthPage = computed(() => {
  const [y, m] = props.currentMonth.split('-').map((n) => parseInt(n));
  return {
    year: y || new Date().getFullYear(),
    month: m || new Date().getMonth() + 1,
  };
});

const getDailyExpense = (date) => props.dailyExpenses[formatDateKey(date)] || 0;
const isSameKey = (a, b) => formatDateKey(a) === formatDateKey(b);
const isSelected = (d) => isSameKey(new Date(d), selectedDate.value);
const isToday = (d) => isSameKey(new Date(d), new Date());
const isSameMonth = (d) => {
  const dt = new Date(d);
  const [cy, cm] = props.currentMonth.split('-').map(Number);
  return dt.getFullYear() === cy && dt.getMonth() + 1 === cm;
};

const parseKey = (key) => {
  const [y, m, day] = key.split('-').map(Number);
  const d = new Date(y, (m || 1) - 1, day || 1);
  d.setHours(0, 0, 0, 0);
  return d;
};

const findNearestDateKeyInMonth = (dateObj) => {
  const base = new Date(dateObj);
  base.setHours(0, 0, 0, 0);
  const [cy, cm] = props.currentMonth.split('-').map(Number);

  const candidates = Object.entries(props.dailyExpenses)
    .filter(([k, v]) => v > 0)
    .filter(([k]) => {
      const d = parseKey(k);
      return d.getFullYear() === cy && d.getMonth() + 1 === cm;
    })
    .map(([k]) => k);

  if (!candidates.length) return null;

  let best = candidates[0];
  let bestDiff = Math.abs(parseKey(best).getTime() - base.getTime());
  for (let i = 1; i < candidates.length; i++) {
    const diff = Math.abs(parseKey(candidates[i]).getTime() - base.getTime());
    if (diff < bestDiff) {
      best = candidates[i];
      bestDiff = diff;
    }
  }
  return best;
};

const scrollToDateKey = async (key) => {
  await nextTick();
  const id = `${props.scrollRowIdPrefix}${key}`;
  const el = document.getElementById(id);
  const container = document.querySelector(props.scrollContainerSelector);
  if (el && container) {
    container.scrollTop = el.offsetTop - (props.scrollOffset || 0);
  }
};

/* weekly */
const names = ['일', '월', '화', '수', '목', '금', '토'];
const firstDayOfWeek = 0;
const weekStart = computed(() => {
  const d = new Date(selectedDate.value);
  const diff = (d.getDay() - firstDayOfWeek + 7) % 7;
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
});
const weekDays = computed(() => {
  const start = weekStart.value;
  const todayKey = formatDateKey(new Date());
  const selKey = formatDateKey(selectedDate.value);
  return Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const key = formatDateKey(d);
    return {
      key,
      date: d,
      day: d.getDate(),
      wd: names[d.getDay()],
      isToday: key === todayKey,
      isSelected: key === selKey,
    };
  });
});

/* events */
const onDayClick = async (day) => {
  selectedDate.value = day.date;
  emit('date-selected', day.date);

  const clickedKey = formatDateKey(day.date);
  let targetKey = clickedKey;
  const hasData = (props.dailyExpenses[clickedKey] || 0) > 0;
  if (!hasData) {
    const nearest = findNearestDateKeyInMonth(day.date);
    if (nearest) targetKey = nearest;
  }

  emit('scroll-to-date', {
    date: new Date(parseKey(targetKey)),
    key: targetKey,
  });

  if (props.autoScrollOnSelect) {
    await scrollToDateKey(targetKey);
  }
};

const onWeekClick = async (date) => {
  selectedDate.value = new Date(date);
  emit('date-selected', selectedDate.value);

  const y = selectedDate.value.getFullYear();
  const m = selectedDate.value.getMonth() + 1;
  const [cy, cm] = props.currentMonth.split('-').map(Number);

  if (!props.isExpanded && (y !== cy || m !== cm)) {
    emit('toggle-expanded', true);
    await nextTick();
    emit('month-changed', { year: y, month: m });
  }
};

watch(
  () => props.selectedDate,
  (nd) => {
    if (nd instanceof Date) selectedDate.value = new Date(nd);
  },
  { immediate: true }
);

const goPrevMonth = () => {
  const [y, m] = props.currentMonth.split('-').map(Number);
  const nm = m === 1 ? 12 : m - 1;
  const ny = m === 1 ? y - 1 : y;
  emit('month-changed', { year: ny, month: nm });
};
const goNextMonth = () => {
  const [y, m] = props.currentMonth.split('-').map(Number);
  const nm = m === 12 ? 1 : m + 1;
  const ny = m === 12 ? y + 1 : y;
  emit('month-changed', { year: ny, month: nm });
};

const expandToMonth = async (dir) => {
  const [y, m] = props.currentMonth.split('-').map(Number);
  const prev = { year: m === 1 ? y - 1 : y, month: m === 1 ? 12 : m - 1 };
  const next = { year: m === 12 ? y + 1 : y, month: m === 12 ? 1 : m + 1 };
  const target = dir === 'prev' ? prev : next;

  emit('toggle-expanded', true);
  await nextTick();
  emit('month-changed', target);
};

const monthOnly = computed(() => {
  const m =
    props.currentMonth.split('-')[1] ?? String(new Date().getMonth() + 1);
  return `${parseInt(m)}월`;
});
</script>

<style scoped>
/* ---------- tokens ---------- */
.calendar-wrapper {
  --cal-col-gap: 16px;
  --cal-side-pad: 16px;
  --cal-wd-size: 12px;
  --cal-num-size: 16px;
  --cal-num-weight: 600;
  --cal-font: 'Noto Sans KR', sans-serif;
  --cal-today-dot: #e9ecef;
  --title-indent: 6px;
}

/* ---------- container ---------- */
.calendar-wrapper {
  background: transparent;
  margin: 0;
  padding: 0;
}

/* ---------- header (주/월 공통, 좌측정렬) ---------- */
.cal-h {
  margin-bottom: 8px;
  padding: 0 16px;
}
.cal-h .title-row {
  display: inline-grid;
  grid-template-columns: 28px auto 28px; /* 좌/우 caret + 제목 */
  align-items: center;
  column-gap: 8px;
  height: 28px;
  width: auto;
}
.cal-h .title {
  margin: 0;
  font-weight: 700;
  color: #111;
  font-size: 18px;
  line-height: 28px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.chev {
  background: transparent;
  border: 0;
  cursor: pointer;
  color: #4318d1;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  line-height: 0;
}
.chev :deep(svg) {
  width: 14px;
  height: 14px;
}

/* 요약 – 간격을 넉넉하게 */
.summary {
  margin-top: 12px;
  padding-left: var(--title-indent);
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.summary .amount {
  font-size: 30px;
  font-weight: 800;
  color: #4318d1;
  line-height: 1.05;
}
.summary .currency {
  font-size: 13px;
  color: #8a8a8a;
  margin-left: 4px;
}
.summary .desc {
  font-size: 13.5px;
  color: #8a8a8a;
}
.summary .diff {
  color: #e11d48;
  font-weight: 700;
}

/* 월간 헤더는 캘린더와 간격을 더 둠 */
.cal-h.monthly {
  margin-bottom: 12px;
}

/* ---------- weekly rows ---------- */
.week-wrap {
  width: 100%;
  margin: 6px 0 10px;
  font-family: var(--cal-font);
}
.week-header,
.week-numbers {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  column-gap: var(--cal-col-gap);
  padding: 0 var(--cal-side-pad);
  box-sizing: border-box;
}
.wh {
  font-size: var(--cal-wd-size);
  line-height: 16px;
  letter-spacing: -0.2px;
  color: #8a8a8a;
  font-weight: 600;
  text-align: center;
  padding: 6px 0;
}
.wn {
  all: unset;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin: 2px auto;
  font-family: var(--cal-font);
  font-size: var(--cal-num-size);
  font-weight: var(--cal-num-weight);
  letter-spacing: -0.2px;
  color: #9aa0a6;
  cursor: pointer;
  border-radius: 9999px;
}
.wn.selected {
  color: #4318d1;
  font-weight: 800;
}
.wn.today:not(.selected) {
  background: var(--cal-today-dot);
  color: #111;
}
.wn.otherMonth {
  color: #d0d4da;
}
.wn:focus-visible {
  outline: 2px solid rgba(67, 24, 209, 0.2);
  outline-offset: 2px;
  border-radius: 9999px;
}

/* ---------- month grid (v-calendar) ---------- */
.custom-calendar {
  margin: 12px 0 8px;
  width: 100% !important;
}
.custom-calendar.vc-container {
  display: block !important;
  width: 100% !important;
  max-width: none !important;
  font-family: var(--cal-font) !important;
}
:deep(.vc-container) {
  border: none;
  font-family: inherit;
}
:deep(.vc-header) {
  display: none;
}

/* v-calendar 기본 하이라이트 제거*/
:deep(.vc-day.is-selected),
:deep(.vc-day.is-today) {
  background: transparent !important;
  color: inherit !important;
}

/* layout */
.custom-calendar :deep(.vc-pane-layout) {
  display: grid !important;
  grid-template-columns: 1fr !important;
}
.custom-calendar :deep(.vc-pane) {
  width: 100% !important;
}
.custom-calendar :deep(.vc-weeks) {
  display: grid !important;
  width: 100% !important;
  row-gap: 10px !important;
  padding: 0 var(--cal-side-pad) !important;
  box-sizing: border-box !important;
}
.custom-calendar :deep(.vc-weekdays),
.custom-calendar :deep(.vc-week) {
  display: grid !important;
  grid-template-columns: repeat(7, minmax(0, 1fr)) !important;
  column-gap: var(--cal-col-gap) !important;
  padding: 0 var(--cal-side-pad) !important;
}
.custom-calendar :deep(.vc-weekdays) {
  margin-bottom: 4px !important;
}
.custom-calendar :deep(.vc-weekday) {
  font-size: var(--cal-wd-size) !important;
  color: #8a8a8a !important;
  font-weight: 600 !important;
  text-align: center !important;
}
.custom-calendar :deep(.vc-day) {
  min-height: 60px !important;
}

/* cells */
.day-box {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding-bottom: 6px;
}
.day-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 9999px;
  line-height: 1;
  font-size: var(--cal-num-size);
  font-weight: var(--cal-num-weight);
  color: #111;
}
.day-number.is-selected {
  color: #4318d1;
  font-weight: 800;
}
.day-number.is-today {
  background: var(--cal-today-dot);
}
.daily-expense {
  font-size: 11px;
  line-height: 1;
  color: #666;
}

/* ---------- transitions ---------- */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.22s cubic-bezier(0.2, 0.7, 0.2, 1),
    transform 0.22s cubic-bezier(0.2, 0.7, 0.2, 1);
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

/* toggle */
.expand-toggle {
  display: flex;
  justify-content: center;
  margin-top: 6px;
}
.toggle-btn {
  background: transparent;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
}
</style>
