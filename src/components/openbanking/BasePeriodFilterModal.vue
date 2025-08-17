<template>
  <div
    v-if="modelValue"
    class="modal-overlay fade-in"
    @click="$emit('update:modelValue', false)"
    @keydown.esc="$emit('update:modelValue', false)"
  >
    <div
      class="modal-content filter-modal pop-in"
      @click.stop
      role="dialog"
      aria-modal="true"
      :aria-labelledby="titleId"
      tabindex="-1"
      ref="modalRef"
    >
      <!-- Header -->
      <div class="modal-header sticky">
        <h3 :id="titleId">기간 선택</h3>
        <button
          class="modal-close-btn icon-btn"
          @click="$emit('update:modelValue', false)"
          aria-label="닫기"
          title="닫기"
        >
          <font-awesome-icon :icon="['fas', 'times']" />
        </button>
      </div>

      <!-- Body -->
      <div class="modal-body">
        <!-- 옵션: 카드형 라디오 -->
        <div class="filter-options grid">
          <label
            class="option-card"
            :class="{ active: localPeriod === opt.value }"
            v-for="opt in options"
            :key="opt.value"
          >
            <input
              class="sr-only"
              type="radio"
              :value="opt.value"
              v-model="localPeriod"
              @change="emitChange"
            />
            <span class="dot" aria-hidden="true"></span>
            <span class="label">{{ opt.label }}</span>
            <svg class="check" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M20 6L9 17l-5-5"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </label>
        </div>

        <!-- 커스텀 기간 -->
        <div
          class="custom-date well"
          :class="{ disabled: localPeriod !== 'custom' }"
        >
          <div class="date-input-row">
            <div class="date-input-group">
              <label>시작일</label>
              <input
                type="date"
                v-model="localStart"
                @change="emitChange"
                class="date-input"
                :disabled="localPeriod !== 'custom'"
              />
            </div>
            <div class="date-input-group">
              <label>종료일</label>
              <input
                type="date"
                v-model="localEnd"
                @change="emitChange"
                class="date-input"
                :disabled="localPeriod !== 'custom'"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="modal-footer sticky">
        <button
          class="modal-btn subtle"
          @click="$emit('update:modelValue', false)"
        >
          취소
        </button>
        <button
          class="modal-btn primary"
          @click="$emit('update:modelValue', false)"
        >
          확인
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, ref, watch, nextTick } from 'vue';

const props = defineProps({
  modelValue: Boolean,
  period: { type: String, default: 'thisMonth' },
  start: String,
  end: String,
});
const emit = defineEmits([
  'update:modelValue',
  'update:period',
  'update:start',
  'update:end',
]);

const titleId = 'filter-modal-title';

const options = [
  { value: 'all', label: '전체 기간' },
  { value: 'thisMonth', label: '이번달' },
  { value: 'lastMonth', label: '지난달' },
  { value: 'custom', label: '직접 선택' },
];

const localPeriod = computed({
  get: () => props.period,
  set: (v) => emit('update:period', v),
});
const localStart = computed({
  get: () => props.start,
  set: (v) => emit('update:start', v),
});
const localEnd = computed({
  get: () => props.end,
  set: (v) => emit('update:end', v),
});

const emitChange = () => {
  /* v-model로 상위에 즉시 반영됨 */
};

// 열릴 때 포커스 이동 (ESC 가능)
const modalRef = ref(null);
watch(
  () => props.modelValue,
  (open) => {
    if (open) nextTick(() => modalRef.value?.focus());
  }
);
</script>

<style scoped>
/* ---- Overlay ---- */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: grid;
  place-items: center;
  z-index: 1000;
}

/* ---- Motion ---- */
.fade-in {
  animation: fade-in 0.18s ease-out;
}
.pop-in {
  animation: pop-in 0.18s ease-out;
}
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes pop-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ---- Card ---- */
.modal-content.filter-modal {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  width: min(560px, 92vw);
  max-height: 86vh;
  overflow: hidden;
  outline: none;
}

/* ---- Header / Footer ---- */
.modal-header,
.modal-footer {
  padding: 14px 18px;
  background: #f9f9f9;
}
.modal-header.sticky {
  position: sticky;
  top: 0;
  border-bottom: 1px solid #ddd;
  z-index: 2;
}
.modal-footer.sticky {
  position: sticky;
  bottom: 0;
  border-top: 1px solid #ddd;
  z-index: 2;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.modal-header h3 {
  font-size: 18px;
  font-weight: 700;
  color: #16181d;
}

/* ---- Buttons ---- */
.icon-btn {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background: #fff;
  transition: transform 0.08s ease, box-shadow 0.12s ease;
}
.icon-btn:hover {
  transform: translateY(-1px);
}
.icon-btn:active {
  transform: translateY(0);
}

.modal-btn {
  border: 0;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.06s ease, box-shadow 0.12s ease;
}
.modal-btn:active {
  transform: translateY(1px);
}

.modal-btn.subtle {
  background: #f5f5f5;
  color: #222;
  border: 1px solid #ddd;
}

.modal-btn.primary {
  background: #4318d1;
  color: #fff;
}

/* ---- Body ---- */
.modal-body {
  padding: 18px;
}

/* ---- 카드형 라디오 ---- */
.filter-options.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
@media (max-width: 420px) {
  .filter-options.grid {
    grid-template-columns: 1fr;
  }
}

.option-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid #ddd;
  background: #fff;
  padding: 12px 12px;
  border-radius: 8px;
  cursor: pointer;
  user-select: none;
  transition: border-color 0.12s ease, transform 0.06s ease;
}
.option-card:hover {
  transform: translateY(-1px);
}
.option-card.active {
  border-color: #4318d1;
}

.option-card .sr-only {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}
.option-card .dot {
  width: 14px;
  height: 14px;
  border-radius: 999px;
  border: 2px solid #ddd;
  flex: 0 0 auto;
  transition: border-color 0.12s ease;
}
.option-card.active .dot {
  border-color: #4318d1;
  background: #4318d1;
}
.option-card .label {
  font-weight: 700;
  color: #101317;
}
.option-card .check {
  margin-left: auto;
  width: 20px;
  height: 20px;
  opacity: 0;
  color: #4318d1;
  transition: opacity 0.12s ease;
}
.option-card.active .check {
  opacity: 1;
}

/* ---- Custom date area ---- */
.custom-date.well {
  margin-top: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 14px;
  background: #f9f9f9;
}
.custom-date.well.disabled {
  opacity: 0.6;
}

.date-input-row {
  display: flex;
  gap: 12px;
}
.date-input-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.date-input-group label {
  font-size: 12px;
  color: #5a6472;
  font-weight: 600;
}

.date-input {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px 12px;
  background: #fff;
  font-weight: 600;
  color: #0f172a;
}
.date-input:focus {
  outline: none;
  border-color: #4318d1;
}
.date-input:disabled {
  background: #f7f7f7;
  color: #9aa0aa;
  cursor: not-allowed;
}
</style>
