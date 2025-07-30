<template>
  <!-- 입력 폼 -->
  <form class="input-form" @submit.prevent="handleSubmit">
    <!-- 기간/금액 -->
    <div class="section-label">기간/금액</div>
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
</template>

<script setup>
import { ref, computed } from 'vue';

const period = ref('1년');
const amount = ref(100000);
const savingType = ref('자유적립식');
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

const selectedPrefer = ref([]);

const formattedAmount = computed({
  get: () => amount.value.toLocaleString(),
  set: (value) => {
    const numericValue = value.replace(/[^\d]/g, '');
    amount.value = numericValue ? parseInt(numericValue) : 0;
  },
});

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
}

// 요약 텍스트 생성
const summaryText = computed(() => {
  const preferText =
    selectedPrefer.value.length > 0
      ? selectedPrefer.value.length === 1
        ? selectedPrefer.value[0]
        : selectedPrefer.value.length === 2
        ? selectedPrefer.value.join('+')
        : selectedPrefer.value[0] +
          '+' +
          selectedPrefer.value[1] +
          ' 외 ' +
          (selectedPrefer.value.length - 2) +
          '건'
      : '';
  return `${period.value} | 월 ${amount.value.toLocaleString()}원 | ${
    savingType.value
  }${preferText ? ' | ' + preferText : ''}`;
});

const emit = defineEmits(['search-completed']);

function handleSubmit() {
  // 콘솔 출력
  console.log('기간:', period.value);
  console.log('월 저축 금액:', amount.value);
  console.log('적립방식:', savingType.value);
  console.log('우대항목:', selectedPrefer.value);

  emit('search-completed', summaryText.value);
}
</script>

<style scoped>
.input-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px 0 0 0;
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
  width: 120px;
  font-size: var(--font-size-title-sub);
  color: var(--color-main);
  font-weight: 600;
  text-align: right;
  margin: 0 2px;
  outline: none;
  background: none;
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
</style>
