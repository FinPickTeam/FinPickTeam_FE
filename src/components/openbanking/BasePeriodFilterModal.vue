<template>
  <div
    v-if="modelValue"
    class="modal-overlay"
    @click="$emit('update:modelValue', false)"
  >
    <div class="modal-content filter-modal" @click.stop>
      <div class="modal-header">
        <h3>기간 선택</h3>
        <button
          class="modal-close-btn"
          @click="$emit('update:modelValue', false)"
        >
          <font-awesome-icon :icon="['fas', 'times']" />
        </button>
      </div>

      <div class="modal-body">
        <div class="filter-options">
          <label class="filter-option" v-for="opt in options" :key="opt.value">
            <input
              type="radio"
              :value="opt.value"
              v-model="localPeriod"
              @change="emitChange"
            />
            <span>{{ opt.label }}</span>
          </label>
        </div>

        <div v-if="localPeriod === 'custom'" class="custom-date-inputs">
          <div class="date-input-row">
            <div class="date-input-group">
              <label>시작일</label>
              <input
                type="date"
                v-model="localStart"
                @change="emitChange"
                class="date-input"
              />
            </div>
            <div class="date-input-group">
              <label>종료일</label>
              <input
                type="date"
                v-model="localEnd"
                @change="emitChange"
                class="date-input"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button
          class="modal-btn cancel-btn"
          @click="$emit('update:modelValue', false)"
        >
          취소
        </button>
        <button
          class="modal-btn confirm-btn"
          @click="$emit('update:modelValue', false)"
        >
          확인
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
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
</script>
