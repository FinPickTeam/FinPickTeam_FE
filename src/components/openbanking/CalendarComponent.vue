<template>
  <div class="calendar-wrapper">
    <div class="cal-h" :class="viewMode">
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
          지난 달보다 <span class="diff">{{ lastMonthDiffText }}</span>
          {{ isExpanded ? '썼어요' : '쓰는 중' }}
        </div>
      </div>
    </div>

    <Calendar
      ref="calendarRef"
      v-model:pages="pagesProxy"
      v-model="innerSelected"
      :view="viewMode"
      :first-day-of-week="0"
      locale="ko-KR"
      :trim-weeks="true"
      :attributes="attrsForCurrentMonth"
      :select-attribute="null"
      class="custom-calendar"
      style="display: block; width: 100%"
    >
      <template #day-content="{ day }">
        <div class="day-box" @click="onDayClick(day)">
          <div
            class="day-number"
            :class="{
              'is-selected': isSelected(day.date),
              'is-today': isToday(day.date) && !isSelected(day.date),
            }"
          >
            {{ day.day }}
          </div>
          <div
            v-if="showDailyExpense && getDailyExpense(day.date) > 0"
            class="daily-expense"
          >
            {{ getDailyExpense(day.date).toLocaleString() }}
          </div>
        </div>
      </template>
    </Calendar>

    <div class="expand-toggle">
      <button class="toggle-btn" @click="emit('toggle-expanded', !isExpanded)">
        <FontAwesomeIcon :icon="isExpanded ? faChevronUp : faChevronDown" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { Calendar } from 'v-calendar';
import 'v-calendar/style.css';
import { formatDateKey } from '@/utils/dateUtils.js';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faChevronUp,
  faChevronDown,
  faCaretLeft,
  faCaretRight,
} from '@fortawesome/free-solid-svg-icons';

const calendarRef = ref(null);

const props = defineProps({
  pages: { type: Array, required: true }, // v-model:pages
  isExpanded: { type: Boolean, default: false },
  selectedDate: { type: Date, required: true },
  currentMonth: { type: String, required: true },
  showSummary: { type: Boolean, default: true },
  totalConsumption: { type: Number, default: 0 },
  lastMonthDiffText: { type: String, default: '' },
  dailyExpenses: { type: Object, default: () => ({}) },
  showDailyExpense: { type: Boolean, default: false },
});

const emit = defineEmits([
  'update:pages',
  'date-selected',
  'month-changed',
  'toggle-expanded',
  'scroll-to-date',
]);

const innerSelected = ref(new Date(props.selectedDate));
watch(
  () => props.selectedDate,
  (v) => (innerSelected.value = new Date(v)),
  { immediate: true }
);

// v-model:pages proxy
const pagesProxy = computed({
  get: () => props.pages,
  set: (value) => emit('update:pages', value),
});

const viewMode = computed(() => (props.isExpanded ? 'monthly' : 'weekly'));

const monthOnly = computed(() => {
  const m = props.currentMonth.split('-')[1];
  return `${parseInt(m, 10)}월`;
});

const getDailyExpense = (date) => props.dailyExpenses[formatDateKey(date)] || 0;
const isSameKey = (a, b) => formatDateKey(a) === formatDateKey(b);
const isSelected = (d) => isSameKey(new Date(d), innerSelected.value);
const isToday = (d) => isSameKey(new Date(d), new Date());

const curPage = () => pagesProxy.value?.[0];

const navTo = (delta) => {
  if (!calendarRef.value || !curPage()) return;

  const { year: cy, month: cm } = curPage();
  let year = cy,
    month = cm + delta;
  if (month < 1) {
    month = 12;
    year--;
  }
  if (month > 12) {
    month = 1;
    year++;
  }

  const sel =
    delta < 0 ? new Date(year, month, 0) : new Date(year, month - 1, 1);
  sel.setHours(0, 0, 0, 0);

  innerSelected.value = sel;
  emit('date-selected', sel);
  emit('scroll-to-date', { key: formatDateKey(sel), date: sel });

  calendarRef.value.move({ year, month });
};

watch(
  () => props.pages?.[0],
  (p, prev) => {
    if (!p) return;
    if (!prev || prev.year !== p.year || prev.month !== p.month) {
      emit('month-changed', { year: p.year, month: p.month });
    }
  }
);

const goPrevMonth = () => navTo(-1);
const goNextMonth = () => navTo(+1);

const onDayClick = (day) => {
  const date = new Date(day.date);
  date.setHours(0, 0, 0, 0);
  innerSelected.value = date;
  emit('date-selected', date);
  emit('scroll-to-date', { key: formatDateKey(date), date });
};

const attrsForCurrentMonth = computed(() => {
  const items = [];
  for (const [k, amount] of Object.entries(props.dailyExpenses || {})) {
    if (amount > 0) {
      const [y, m, d] = k.split('-').map(Number);
      items.push({ key: `amt-${k}`, dates: new Date(y, m - 1, d) });
    }
  }
  return items;
});
</script>

<style scoped>
.calendar-wrapper {
  --cal-col-gap: 16px;
  --cal-side-pad: 16px;
  --cal-wd-size: 12px;
  --cal-num-size: 16px;
  --cal-num-weight: 600;
  --cal-font: 'Noto Sans KR', sans-serif;
  --cal-today-dot: #e9ecef;
  --title-indent: 6px;
  background: transparent;
}
.cal-h {
  margin-bottom: 8px;
  padding: 0 12px;
}
.cal-h .title-row {
  display: inline-grid;
  grid-template-columns: 28px auto 28px;
  align-items: center;
  column-gap: 8px;
  height: 28px;
}
.cal-h .title {
  margin: 0;
  font-weight: 700;
  color: #111;
  font-size: 18px;
  line-height: 28px;
  display: flex;
  align-items: center;
}
.chev {
  background: transparent;
  border: 0;
  cursor: pointer;
  color: #4318d1;
  border-radius: 8px;
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.chev :deep(svg) {
  width: 14px;
  height: 14px;
}

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

.custom-calendar {
  margin: 12px 0 8px;
  width: 100% !important;
  font-family: var(--cal-font) !important;
}
:deep(.vc-container) {
  border: none;
}
:deep(.vc-header) {
  display: none;
}
.custom-calendar :deep(.vc-weeks) {
  padding: 0 var(--cal-side-pad) !important;
}
.custom-calendar :deep(.vc-weekday) {
  font-size: var(--cal-wd-size) !important;
  color: #8a8a8a !important;
  font-weight: 600 !important;
  text-align: center !important;
}

.day-box {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding-bottom: 12px;
  cursor: pointer;
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
.day-number.is-today:not(.is-selected) {
  background: var(--cal-today-dot);
}
.daily-expense {
  font-size: 11px;
  line-height: 1;
  color: #666;
}

.expand-toggle {
  display: flex;
  justify-content: center;
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
