<template>
  <div class="newsletter-modal-backdrop" @click.self="close">
    <div class="newsletter-modal">
      <button class="newsletter-close-btn" @click="close">
        <i class="fa-solid fa-xmark"></i>
      </button>
      <div class="newsletter-title">
        <i class="fas fa-envelope"></i>
        오늘의 금융 요약
      </div>
      <div class="newsletter-content">
        <h3>ETF, 오늘의 시장 동향</h3>
        <ul>
          <li>ETF는 원금이 보장되지 않는 투자상품입니다.</li>
          <li>오늘 코스피 지수는 2,500선에서 등락을 반복했습니다.</li>
          <li>
            미국 연준의 금리 동결 소식에 글로벌 증시가 강보합세를 보였습니다.
          </li>
          <li>주요 은행의 예금 금리는 3% 초반대를 유지하고 있습니다.</li>
        </ul>
        <div class="newsletter-tip">
          <i class="fa-solid fa-lightbulb"></i>
          <span>금융 상식: 분산투자를 통해 위험을 줄일 수 있습니다.</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['close']);
function close() {
  emit('close');
}
</script>

<style scoped>
.newsletter-modal-backdrop {
  position: fixed;
  z-index: 2000;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.28);
  display: flex;
  align-items: center;
  justify-content: center;
}
.newsletter-modal {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 16px #0001;
  padding: 32px 24px 24px 24px;
  max-width: 340px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
}
.newsletter-close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 22px;
  color: #bbb;
  cursor: pointer;
}
.newsletter-title {
  display: flex;
  align-items: center;
  font-size: 17px;
  font-weight: 700;
  color: #4318d1;
  margin-bottom: 18px;
  gap: 8px;
}
.newsletter-title i {
  font-size: 18px;
}
.newsletter-content {
  font-size: 15px;
  color: #222;
  width: 100%;
}
.newsletter-content h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 10px;
}
.newsletter-content ul {
  padding-left: 18px;
  margin-bottom: 16px;
}
.newsletter-content li {
  margin-bottom: 6px;
  line-height: 1.5;
}
.newsletter-tip {
  background: #fef9c3;
  color: #b45309;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}
.newsletter-tip i {
  color: #facc15;
}
</style>
