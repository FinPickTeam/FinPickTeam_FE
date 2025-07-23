<!-- 투자 금액/기간 입력 폼 -->
<template>
  <div class="product-input-form">
    <div class="input-summary">
      <div class="input-wrap">
        <input
          v-model="amountRaw"
          type="text"
          class="highlight input-amount"
          min="0"
          :placeholder="'금액'"
          @input="onAmountInput"
        />
        <span class="input-overlay" v-if="amountRaw">
          {{ formattedAmount }}
        </span>
      </div>
      원을
      <input
        v-model="period"
        type="number"
        class="highlight input-period"
        min="1"
        :placeholder="'개월'"
        :class="{ bold: period }"
      />
      개월 동안 투자하면<br />
      어떤 예적금 상품이 좋을까요?
    </div>
    <button class="check-btn" @click="logValues">추천 상품 확인하기</button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const amountRaw = ref('500000000');
const period = ref(12);

const formattedAmount = computed(() => {
  const num = Number(amountRaw.value.replace(/[^0-9]/g, ''));
  return num ? num.toLocaleString() : '';
});

function onAmountInput(e) {
  amountRaw.value = e.target.value.replace(/[^0-9]/g, '');
}

function logValues() {
  console.log('입력한 금액:', formattedAmount.value);
  console.log('입력한 기간:', period.value);
}
</script>

<style scoped>
.product-input-form {
  background: var(--color-bg);
  border-radius: 16px;
  padding: 20px 5px 20px 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.04);
  max-width: 350px;
  margin: 0 auto;
}
.input-summary {
  color: var(--color-text);
  font-size: var(--font-size-body);
  text-align: center;
  margin-bottom: 18px;
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
  max-width: 17ch;
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
  max-width: 17ch;
  width: auto;
  background: #edeaff;
  font-weight: var(--font-weight-regular);
  border-radius: 12px;
  padding: 2px 12px;
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
.check-btn {
  width: 220px;
  margin-top: 4px;
  background: var(--color-main);
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 4px 0;
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-regular);
  cursor: pointer;
  transition: background 0.2s;
}
.check-btn:hover {
  background: var(--color-main-dark);
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
