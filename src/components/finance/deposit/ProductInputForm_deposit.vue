<!-- 투자 금액/기간 입력 폼 -->
<template>
  <!-- 입력 폼 모드 -->
  <form v-if="!isSummaryMode" class="input-form" @submit.prevent="handleSubmit">
    <!-- 투자 금액/기간 -->
    <div class="section-label">투자 금액/기간</div>
    <div class="amount-period-card">
      <div class="period-select-row">
        <select v-model="period" class="period-select">
          <option value="1년">1년</option>
          <option value="2년">2년</option>
          <option value="3년">3년</option>
          <option value="4년">4년</option>
          <option value="5년">5년</option>
        </select>
        <span class="period-label">만기로</span>
      </div>
      <div class="amount-row">
        <input
          v-model="formattedAmount"
          class="amount-input"
          type="text"
          @input="handleAmountInput"
        />원 저축하기
      </div>
    </div>

    <!-- 우대항목 -->
    <div class="section-label">
      우대항목 <span class="prefer-desc">선택하지 않아도 검색 가능</span>
    </div>
    <div class="prefer-row">
      <label
        v-for="item in preferList"
        :key="item"
        :class="['prefer-tag', { checked: selectedPrefer.includes(item) }]"
      >
        <input type="checkbox" v-model="selectedPrefer" :value="item" hidden />
        {{ item }}
      </label>
    </div>

    <!-- 검색 버튼 -->
    <button class="search-btn" type="submit">검색</button>
  </form>

  <!-- 요약 모드 -->
  <div v-else class="summary-container">
    <div class="summary-card">
      <div class="summary-header">
        <span class="summary-title">검색 조건</span>
        <button class="edit-btn" @click="toggleSummaryMode">수정</button>
      </div>
      <div class="summary-content">
        <div class="summary-item">
          <span class="summary-label">투자 금액:</span>
          <span class="summary-value">{{ formattedAmount }}원</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">투자 기간:</span>
          <span class="summary-value">{{ period }}</span>
        </div>
        <div class="summary-item" v-if="selectedPrefer.length > 0">
          <span class="summary-label">우대항목:</span>
          <span class="summary-value">{{ selectedPrefer.join(', ') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue';

// Props 정의
const props = defineProps({
  isSummaryMode: {
    type: Boolean,
    default: false,
  },
  formData: {
    type: Object,
    default: () => ({
      amountRaw: 1000000,
      period: '1년',
      selectedPrefer: [],
    }),
  },
});

const amountRaw = ref(props.formData?.amountRaw ?? 1000000);
const period = ref(props.formData.period);
const preferList = [
  '신규 고객',
  '급여 이체 실적 있음',
  '신용/체크카드 실적 있음',
  '오픈뱅킹 가입 및 유지 중',
  '마케팅 정보 수신에 동의',
  '주택청약 보유',
  '쿠폰 사용 경험 있음',
];
const selectedPrefer = ref([...props.formData.selectedPrefer]);

// props가 변경될 때 로컬 상태 업데이트
watch(
  () => props.formData,
  (newFormData) => {
    // 안전한 값 할당
    amountRaw.value = newFormData?.amountRaw ?? 1000000;
    period.value = newFormData?.period ?? '1년';
    selectedPrefer.value = [...(newFormData?.selectedPrefer ?? [])];
  },
  { deep: true }
);

// 콤마가 포함된 포맷된 금액
const formattedAmount = computed({
  get: () => {
    // amountRaw.value가 유효한 숫자인지 확인
    if (
      amountRaw.value === undefined ||
      amountRaw.value === null ||
      isNaN(amountRaw.value)
    ) {
      return '';
    }
    return amountRaw.value.toLocaleString();
  },
  set: (value) => {
    const numericValue = value.replace(/[^\d]/g, '');
    if (numericValue) {
      amountRaw.value = parseInt(numericValue);
    } else {
      amountRaw.value = 0;
    }
  },
});

// 입력 처리 함수
function handleAmountInput(event) {
  const input = event.target;
  const value = input.value;
  const numericValue = value.replace(/[^\d,]/g, '');
  const cleanValue = numericValue.replace(/,/g, '');
  if (cleanValue) {
    const formatted = parseInt(cleanValue).toLocaleString();
    input.value = formatted;
    amountRaw.value = parseInt(cleanValue);
  } else {
    input.value = '';
    amountRaw.value = 0;
  }
  
  // 입력값 길이에 따라 너비 조정
  adjustInputWidth(input);
}

// 입력 필드 너비 조정 함수
function adjustInputWidth(input) {
  // 임시 span 요소 생성하여 텍스트 너비 측정
  const span = document.createElement('span');
  span.style.visibility = 'hidden';
  span.style.position = 'absolute';
  span.style.whiteSpace = 'pre';
  span.style.font = window.getComputedStyle(input).font;
  span.textContent = input.value || '0';
  
  document.body.appendChild(span);
  const textWidth = span.offsetWidth;
  document.body.removeChild(span);
  
  // 패딩과 여백을 고려한 최종 너비 계산
  const padding = 24; // 좌우 패딩 (12px * 2)
  const margin = 4; // 좌우 마진 (2px * 2)
  const minWidth = 120;
  const maxWidth = 200;
  
  let newWidth = Math.max(minWidth, textWidth + padding + margin);
  newWidth = Math.min(maxWidth, newWidth);
  
  input.style.width = newWidth + 'px';
}

// 요약 모드 토글
function toggleSummaryMode() {
  // 현재 입력된 값들을 부모 컴포넌트에 전달
  emit('toggle-summary-mode', {
    amountRaw: amountRaw.value,
    period: period.value,
    selectedPrefer: selectedPrefer.value,
  });
}

// 폼 제출 시 입력값 콘솔 출력 및 부모에게 이벤트 전달
function handleSubmit() {
  console.log('투자 금액:', formattedAmount.value);
  console.log('투자 기간:', period.value);
  console.log('우대항목:', selectedPrefer.value);

  // 필터링 객체 생성
  const filterObject = {
    newCustomer: selectedPrefer.value.includes('신규 고객'),
    salaryTransfer: selectedPrefer.value.includes('급여 이체 실적 있음'),
    cardUsage: selectedPrefer.value.includes('신용/체크카드 실적 있음'),
    internetMobileBanking:
      selectedPrefer.value.includes('오픈뱅킹 가입 및 유지 중'),
    marketingConsent: selectedPrefer.value.includes('마케팅 정보 수신에 동의'),
    housingSubscription: selectedPrefer.value.includes('주택청약 보유'),
    couponUsed: selectedPrefer.value.includes('쿠폰 사용 경험 있음'),
  };

  console.log('필터링 객체:', filterObject);

  // 부모 컴포넌트에 검색 완료 이벤트와 폼 데이터 전달
  emit('search-completed', {
    amount: amountRaw.value,
    period: period.value,
    selectedPrefer: selectedPrefer.value,
    filterObject: filterObject,
  });
}

// 이벤트 정의
const emit = defineEmits(['search-completed', 'toggle-summary-mode']);

// 컴포넌트 마운트 시 초기 너비 설정
onMounted(() => {
  nextTick(() => {
    const input = document.querySelector('.amount-input');
    if (input) {
      adjustInputWidth(input);
    }
  });
});

// formattedAmount가 변경될 때마다 너비 조정
watch(formattedAmount, () => {
  nextTick(() => {
    const input = document.querySelector('.amount-input');
    if (input) {
      adjustInputWidth(input);
    }
  });
});
</script>

<style scoped>
.input-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px 0 0 0;
}

.section-label {
  font-size: var(--font-size-body);
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 8px;
}

.amount-period-card {
  background: var(--color-bg);
  border-radius: 16px;
  box-shadow: 0 2px 8px #0001;
  padding: 10px 18px 14px 18px;
  margin-bottom: 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.period-select-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.period-select {
  border: none;
  background: none;
  font-size: var(--font-size-title-sub);
  color: var(--color-main);
  font-weight: 600;
  outline: none;
  cursor: pointer;

}

.period-label {
  font-size: var(--font-size-body-large);
  color: var(--color-text);
  font-weight: 500;
}

.amount-row {
  font-size: var(--font-size-body-large);
  color: var(--color-text);
  font-weight: var(--font-weight-medium);
}

.amount-input {
  border: none;
  border-bottom: 1.5px solid var(--color-main);
  border-radius: 0;
  min-width: 120px;
  max-width: 200px;
  width: 120px; /* 기본 너비 */
  font-size: var(--font-size-title-sub);
  color: var(--color-main);
  font-weight: 600;
  text-align: right;
  margin: 0 2px;
  outline: none;
  background: none;
  padding: 16px 12px 4px 12px;
  transition: width 0.3s ease;
}

.input-summary {
  color: var(--color-text);
  font-size: var(--font-size-body);
  text-align: center;
  margin-bottom: 4px;
  line-height: 1.7;
}

.highlight {
  background: #edeaff;
  color: var(--color-main);
  font-weight: var(--font-weight-regular);
  border-radius: 12px;
  padding: 2px 12px;
  font-size: var(--font-size-body);
  margin: 0 2px;
  display: inline-block;
  border: none;
  text-align: right;
  transition: background 0.2s, color 0.2s;
  min-width: 6ch;
  max-width: 12ch;
  width: auto;
}

.input-wrap {
  position: relative;
  display: inline-block;
  min-width: 10ch;
  max-width: 14ch;
  width: 100%;
  vertical-align: middle;
}

.input-amount {
  background: transparent;
  color: transparent;
  caret-color: var(--color-main);
  position: relative;
  z-index: 2;
  min-width: 10ch;
  max-width: 14ch;
  width: auto;
  background: #edeaff;
  font-weight: var(--font-weight-regular);
  border-radius: 12px;
  padding: 2px 5px;
  font-size: var(--font-size-body);
  margin: 0 2px;
  display: inline-block;
  border: none;
  text-align: right;
  transition: background 0.2s, color 0.2s;
  overflow: hidden;
  white-space: nowrap;
}

.input-overlay {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: 100%;
  color: var(--color-main);
  background: none;
  pointer-events: none;
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-body);
  padding: 2px 12px;
  border-radius: 12px;
  z-index: 3;
  display: flex;
  align-items: center;
  text-align: right;
  overflow: hidden;
  white-space: nowrap;
  min-width: 10ch;
  max-width: 17ch;
  justify-content: flex-end;
}

.input-period {
  width: 6ch;
}

.input-period.bold {
  font-weight: var(--font-weight-bold);
}

.prefer-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 8px;
  margin-top: 6px;
}

.prefer-tag {
  display: flex;
  align-items: center;
  border: 1.5px solid var(--color-bg-border);
  background: var(--color-bg);
  color: var(--color-text-light);
  font-size: var(--font-size-body);
  border-radius: 12px;
  padding: 7px 14px;
  cursor: pointer;
  font-weight: var(--font-weight-medium);
  transition: border 0.2s, color 0.2s, background 0.2s;
}

.prefer-tag.checked {
  border: 1.5px solid var(--color-main);
  color: var(--color-main);
  background: #f3f0fa;
}

.prefer-desc {
  display: inline-block;
  background: var(--color-text);
  color: var(--color-bg);
  font-size: var(--font-size-caption);
  font-weight: var(--font-weight-medium);
  border-radius: 8px;
  padding: 2px 10px;
  margin-left: 8px;
  vertical-align: middle;
}

.search-btn {
  width: 100%;
  background: var(--color-main);
  color: var(--color-bg);
  border: none;
  border-radius: 10px;
  padding: 13px 0;
  font-size: var(--font-size-title-sub);
  font-weight: var(--font-weight-medium);
  margin-top: 10px;
  cursor: pointer;
  transition: background 0.2s;
}

.search-btn:hover {
  background: var(--color-main-dark);
}

/* 요약 모드 스타일 */
.summary-container {
  padding: 10px 0 0 0;
}

.summary-card {
  background: var(--color-bg);
  border-radius: 16px;
  box-shadow: 0 2px 8px #0001;
  padding: 16px;
  margin-bottom: 8px;
}

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.summary-title {
  font-size: var(--font-size-title-sub);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
}

.edit-btn {
  background: var(--color-main);
  color: var(--color-bg);
  border: none;
  border-radius: 8px;
  padding: 6px 12px;
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: background 0.2s;
}

.edit-btn:hover {
  background: var(--color-main-dark);
}

.summary-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.summary-label {
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-light);
  min-width: 60px;
}

.summary-value {
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
}

/* Chrome, Safari, Edge, Opera */
input[type='number'].highlight::-webkit-outer-spin-button,
input[type='number'].highlight::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type='number'].highlight {
  -moz-appearance: textfield;
}
</style>
