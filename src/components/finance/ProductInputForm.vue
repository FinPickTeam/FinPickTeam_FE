<!-- 투자 금액/기간 입력 폼 -->
<template>
  <div class="product-input-form">
    <div class="input-summary">
      <span class="highlight">500,000,000</span> 원을
      <span class="highlight">12</span> 개월 동안 투자하면<br />
      어떤 예적금 상품이 좋을까요?
    </div>
    <button class="check-btn">추천 상품 확인하기</button>
  </div>
</template>

<script setup>
// 추후 v-model 등으로 금액/기간을 바인딩할 수 있음
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
  font-weight: var(--font-weight-bold);
  border-radius: 12px;
  padding: 2px 12px;
  font-size: var(--font-size-body);
  margin: 0 2px;
  display: inline-block;
}
.check-btn {
  width: 220px;
  margin-top: 4px;
  /* main.css의 button 스타일을 최대한 활용 */
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
</style>
