<template>
  <!-- 입력 폼 모드 -->
  <form v-if="!isSummaryMode" class="input-form" @submit.prevent="handleSubmit">
    <!-- 기간/금액 -->
    <div class="section-label">투자 금액/기간</div>
    <div class="period-amount-card">
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
        매월
        <input
          v-model="formattedAmount"
          class="amount-input"
          type="text"
          @input="handleAmountInput"
        />원 저축하기
      </div>
    </div>

    <!-- 적립방식 -->
    <div class="section-label">적립방식</div>
    <div class="saving-type-row">
      <button
        type="button"
        :class="['saving-type-btn', { active: savingType === '자유적립식' }]"
        @click="savingType = '자유적립식'"
      >
        자유적립식
      </button>
      <button
        type="button"
        :class="['saving-type-btn', { active: savingType === '정액적립식' }]"
        @click="savingType = '정액적립식'"
      >
        정액적립식
      </button>
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
          <span class="summary-label">기간:</span>
          <span class="summary-value">{{ period }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">월 저축:</span>
          <span class="summary-value">{{ formattedAmount }}원</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">적립방식:</span>
          <span class="summary-value">{{ savingType }}</span>
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
import { useMyDataStore } from '@/stores/MyData';

// Props 정의
const props = defineProps({
  isSummaryMode: {
    type: Boolean,
    default: false,
  },
  formData: {
    type: Object,
    default: () => ({
      period: '1년',
      amount: 100000,
      savingType: '자유적립식',
      selectedPrefer: [],
    }),
  },
});

const myDataStore = useMyDataStore();
const period = ref(props.formData.period);
const amount = ref(props.formData.amount);
const savingType = ref(props.formData.savingType);
const preferList = [
  '자동이체 실적',
  '신용/체크카드 사용',
  '오픈뱅킹 가입',
  '급여/연금 이체',
  '공과금 자동이체',
  '마케팅 수신 동의',
  '주택청약통장 보유',
  '인터넷/모바일뱅킹 이용',
  '친환경/교통 미션',
  '신규 고객 여부',
  '소득이체 실적',
];
const selectedPrefer = ref([...props.formData.selectedPrefer]);

// props가 변경될 때 로컬 상태 업데이트
watch(
  () => props.formData,
  (newFormData) => {
    period.value = newFormData.period;
    amount.value = newFormData.amount;
    savingType.value = newFormData.savingType;
    selectedPrefer.value = [...newFormData.selectedPrefer];
  },
  { deep: true }
);

// 콤마가 포함된 포맷된 금액
const formattedAmount = computed({
  get: () => {
    return amount.value.toLocaleString();
  },
  set: (value) => {
    const numericValue = value.replace(/[^\d]/g, '');
    if (numericValue) {
      amount.value = parseInt(numericValue);
    } else {
      amount.value = 0;
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
    amount.value = parseInt(cleanValue);
  } else {
    input.value = '';
    amount.value = 0;
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
  emit('toggle-summary-mode');
}

// 폼 제출 시 입력값 콘솔 출력 및 부모에게 이벤트 전달
function handleSubmit() {
  console.log('=== handleSubmit 함수 실행됨 ===');
  console.log('기간:', period.value);
  console.log('월 저축 금액:', amount.value);
  console.log('적립방식:', savingType.value);
  console.log('우대항목:', selectedPrefer.value);

  // 필터링 객체 생성
  const filterObject = {
    autoTransfer: selectedPrefer.value.includes('자동이체 실적'),
    cardUsage: selectedPrefer.value.includes('신용/체크카드 사용'),
    openBanking: selectedPrefer.value.includes('오픈뱅킹 가입'),
    salaryTransfer: selectedPrefer.value.includes('급여/연금 이체'),
    utilityPayment: selectedPrefer.value.includes('공과금 자동이체'),
    marketingConsent: selectedPrefer.value.includes('마케팅 수신 동의'),
    housingSubscription: selectedPrefer.value.includes('주택청약통장 보유'),
    internetMobileBanking:
      selectedPrefer.value.includes('인터넷/모바일뱅킹 이용'),
    greenMission: selectedPrefer.value.includes('친환경/교통 미션'),
    incomeTransfer: selectedPrefer.value.includes('소득이체 실적'),
    newCustomer: selectedPrefer.value.includes('신규 고객 여부'),
  };

  console.log('=== 필터링 객체 생성 완료 ===');
  console.log('필터링 객체:', filterObject);
  console.log('=== 부모 컴포넌트로 데이터 전달 ===');

  // 부모 컴포넌트에 검색 완료 이벤트와 폼 데이터 전달
  emit('search-completed', {
    period: period.value,
    amount: amount.value,
    savingType: savingType.value,
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
  ensurePreferForLinked();
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

const AUTO_PREFER = ['급여/연금 이체', '주택청약통장 보유'];

function ensurePreferForLinked() {
  if (!myDataStore.linked) return;
  const set = new Set(selectedPrefer.value);
  for (const p of AUTO_PREFER) set.add(p);
  selectedPrefer.value = Array.from(set);
}
</script>

<style scoped>
.input-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px 0 20px 0;
}
.section-label {
  /*우대항목*/
  font-size: var(--font-size-body);
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 8px;
}
.period-amount-card {
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
.saving-type-row {
  display: flex;
  gap: 12px;
}
.saving-type-btn {
  flex: 1 1 0;
  border: 1.5px solid var(--color-bg-border);
  background: var(--color-bg);
  color: var(--color-text);
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-medium);
  border-radius: 12px;
  padding: 10px 0;
  cursor: pointer;
  transition: border 0.2s, color 0.2s;
}
.saving-type-btn.active {
  border: 1.5px solid var(--color-main);
  color: var(--color-main);
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
</style>
