<template>
  <div class="quiz-modal-backdrop" @click.self="close">
    <div class="quiz-card">
      <button class="quiz-close-btn" @click="close">
        <i class="fa-solid fa-xmark"></i>
      </button>
      <div class="quiz-title">
        <i class="fa-regular fa-bookmark"></i>
        👤오늘의 금융 퀴즈
      </div>
      <div class="quiz-question">ETF는 원금이 보장되는 투자상품이다.</div>
      <div class="quiz-ox-group">
        <button
          class="quiz-ox-btn o"
          :class="{ selected: answer === 'O' }"
          @click="answer = 'O'"
        >
          <div class="ox-circle">O</div>
          <span>맞다</span>
        </button>
        <button
          class="quiz-ox-btn x"
          :class="{ selected: answer === 'X' }"
          @click="answer = 'X'"
        >
          <div class="ox-circle">X</div>
          <span>틀리다</span>
        </button>
      </div>
      <button class="quiz-submit-btn">정답 확인</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const answer = ref('');
const emit = defineEmits(['close']);
function close() {
  emit('close');
}
</script>

<style scoped>
.quiz-modal-backdrop {
  position: fixed;
  z-index: 2000;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}
.quiz-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 16px #0001;
  padding: 32px 24px 24px 24px;
  max-width: 340px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}
.quiz-close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 22px;
  color: #bbb;
  cursor: pointer;
}
.quiz-title {
  display: flex;
  align-items: center;
  font-size: 15px;
  font-weight: 600;
  color: #4318d1;
  margin-bottom: 18px;
  gap: 6px;
  margin-top: 8px;
}
.quiz-title i {
  font-size: 18px;
}
.quiz-question {
  font-size: 17px;
  color: #222;
  font-weight: 500;
  margin-bottom: 28px;
  text-align: center;
}
.quiz-ox-group {
  display: flex;
  gap: 24px;
  margin-bottom: 28px;
}
.quiz-ox-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 18px 24px 12px 24px;
  font-size: 15px;
  font-weight: 500;
  color: #222;
  cursor: pointer;
  transition: border 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 8px #0001;
}
.quiz-ox-btn.selected {
  border: 2px solid #4318d1;
  box-shadow: 0 4px 16px #a78bfa33;
}
.quiz-ox-btn.o .ox-circle {
  background: #22c55e;
  color: #fff;
}
.quiz-ox-btn.x .ox-circle {
  background: #ef4444;
  color: #fff;
}
.ox-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
}
.quiz-submit-btn {
  width: 100%;
  background: #a78bfa;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 14px 0;
  font-size: 16px;
  font-weight: 600;
  margin-top: 8px;
  cursor: pointer;
  transition: background 0.2s;
}
.quiz-submit-btn:hover {
  background: #4318d1;
}
</style>
