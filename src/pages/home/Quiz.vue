<template>
  <div class="quiz-modal-backdrop" @click.self="close">
    <div class="quiz-card">
      <button class="quiz-close-btn" @click="close">
        <i class="fa-solid fa-xmark"></i>
      </button>
      <div class="quiz-title">👤오늘의 금융 퀴즈👤</div>
      <div class="quiz-question">ETF는 원금이 보장되는 투자상품이다.</div>
      <div class="quiz-ox-group">
        <button
          class="quiz-ox-btn o"
          :class="{
            selected: answer === 'O' && !showResult,
            wrong: showResult && answer === 'O' && correctAnswer !== 'O',
            correct: showResult && correctAnswer === 'O' && answer === 'O',
          }"
          @click="answer = 'O'"
          :disabled="showResult"
        >
          <div class="ox-circle">O</div>
          <span>맞다</span>
        </button>
        <button
          class="quiz-ox-btn x"
          :class="{
            selected: answer === 'X' && !showResult,
            wrong: showResult && answer === 'X' && correctAnswer !== 'X',
            correct: showResult && correctAnswer === 'X' && answer === 'X',
          }"
          @click="answer = 'X'"
          :disabled="showResult"
        >
          <div class="ox-circle">X</div>
          <span>틀리다</span>
        </button>
      </div>

      <!-- 정답/오답 결과 UI -->
      <div v-if="showResult && isCorrect" class="quiz-result correct">
        <i class="fa-regular fa-circle-check"></i>
        <div>
          <div class="result-title">정답입니다</div>
          <div class="result-desc">
            맞습니다! ETF는 원금이 보장되지 않는 투자상품입니다.
          </div>
        </div>
      </div>
      <div v-if="showResult && !isCorrect" class="quiz-result wrong">
        <i class="fa-regular fa-circle-xmark"></i>
        <div>
          <div class="result-title">틀렸습니다.</div>
          <div class="result-desc">
            틀렸습니다! ETF는 원금이 보장되지 않는 투자상품입니다.
          </div>
        </div>
      </div>
      <!-- 포인트 안내 -->
      <button v-if="showResult && isCorrect" class="quiz-point" @click="close">
        <i class="fa-solid fa-star"></i>
        10 포인트 획득!
      </button>

      <!-- 버튼 -->
      <button
        v-if="!showResult"
        class="quiz-submit-btn"
        :disabled="!answer"
        @click="checkAnswer"
      >
        정답 확인
      </button>
      <button
        v-if="showResult && !isCorrect"
        class="quiz-close-btn-bottom"
        @click="close"
      >
        닫기
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
const answer = ref('');
const showResult = ref(false);
const correctAnswer = 'O';
const emit = defineEmits(['close']);

const isCorrect = computed(() => answer.value === correctAnswer);

function checkAnswer() {
  if (!answer.value) return;
  showResult.value = true;
}
function close() {
  // 상태 초기화
  answer.value = '';
  showResult.value = false;
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
  background: rgba(0, 0, 0, 0.18);
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
  border: 2px solid #4318d1 !important;
  box-shadow: 0 4px 16px #a78bfa33 !important;
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
.quiz-result {
  width: 100%;
  border-radius: 10px;
  padding: 14px 12px 12px 12px;
  margin-bottom: 12px;
  font-size: 15px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  border: 1.5px solid #bbf7d0;
  background: #f0fdf4;
  color: #16a34a;
}
.quiz-result i {
  font-size: 20px;
  margin-top: 2px;
}
.result-title {
  font-weight: 700;
  margin-bottom: 2px;
}
.result-desc {
  font-size: 13px;
  margin-top: 2px;
}
.quiz-point {
  width: 100%;
  background: linear-gradient(90deg, #4318d1 0%, #6366f1 100%);
  color: #fff;
  border-radius: 8px;
  padding: 10px 0;
  font-size: 16px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  cursor: pointer;
  transition: filter 0.2s;
}
.quiz-point:active {
  filter: brightness(0.95);
}
.quiz-point i {
  color: #ffe066;
  font-size: 18px;
}
.quiz-close-btn-bottom {
  width: 100%;
  background: #f3f4f6;
  color: #bbb;
  border: none;
  border-radius: 8px;
  padding: 14px 0;
  font-size: 16px;
  font-weight: 600;
  margin-top: 8px;
  cursor: pointer;
}
.quiz-close-btn-bottom:active {
  background: #e5e7eb;
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
.quiz-ox-btn.x.correct {
  border: 2.5px solid #ef4444;
  box-shadow: 0 0 0 2px #fecaca;
}
.quiz-result.wrong {
  background: #fef2f2;
  color: #ef4444;
  border-color: #fecaca;
}
.quiz-ox-btn.o.correct {
  border: 2.5px solid #22c55e;
  box-shadow: 0 0 0 2px #bbf7d0;
}
.quiz-ox-btn.x.correct {
  border: 2.5px solid #ef4444;
  box-shadow: 0 0 0 2px #fecaca;
}
.quiz-ox-btn.wrong {
  border: 2.5px solid #ef4444;
  box-shadow: 0 0 0 2px #fecaca;
}
</style>
