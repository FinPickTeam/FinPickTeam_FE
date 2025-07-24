<template>
  <div class="deposit-container">
    <!-- 상단 탭 -->
    <div class="tab-row">
      <span class="tab active">예/적금</span>
      <span class="tab">주식</span>
      <span class="tab">펀드</span>
    </div>

    <!-- 추천/전체보기 탭 -->
    <div class="subtab-row">
      <span class="subtab active">추천</span>
      <span class="subtab">전체 보기</span>
    </div>

    <!-- 조건 입력 폼 -->
    <ProductInputForm />

    <!-- 안내 문구 -->
    <div class="info-text">
      수익률 좋은 상품이 궁금하신가요?<br />
      버튼만 누르면 확인하실 수 있어요 <span class="emoji">👇</span>
    </div>
  </div>
</template>

<script setup>
import ProductInputForm from '@/components/finance/ProductInputForm.vue';
</script>

<style scoped>
.deposit-container {
  max-width: 390px;
  margin: 0 auto;
  padding: 24px 16px;
  font-family: var(--font-main);
}

.tab-row {
  display: flex;
  gap: 16px;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
}

.tab {
  color: #888;
  cursor: pointer;
  padding-bottom: 4px;
  border-bottom: 2px solid transparent;
}

.tab.active {
  color: var(--color-main);
  border-bottom: 2px solid var(--color-main);
}

.subtab-row {
  display: flex;
  gap: 16px;
  font-size: 15px;
  margin-bottom: 18px;
}

.subtab {
  color: #888;
  cursor: pointer;
  padding-bottom: 2px;
  border-bottom: 2px solid transparent;
}

.subtab.active {
  color: var(--color-main-light);
  border-bottom: 2px solid var(--color-main-light);
}

.info-text {
  margin-top: 36px;
  font-size: 17px;
  color: #222;
  text-align: center;
  font-weight: 500;
  line-height: 1.6;
}

.emoji {
  font-size: 20px;
  vertical-align: middle;
}
</style>
