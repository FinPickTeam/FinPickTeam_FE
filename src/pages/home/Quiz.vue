<template>
  <teleport to="body">
    <div class="quiz-modal-backdrop" @click.self="close">
      <div class="quiz-card">
        <button class="quiz-close-btn" @click="close">
          <i class="fa-solid fa-xmark"></i>
        </button>
        
        <!-- 헤더 섹션 -->
        <div class="quiz-header">
          <div class="quiz-icon">
            <i class="fa-solid fa-brain"></i>
          </div>
          <div class="quiz-title">오늘의 금융 퀴즈</div>
          <div class="quiz-subtitle">매일 하나씩, 금융 지식 쌓기</div>
        </div>

        <!-- 질문 섹션 -->
        <div class="quiz-question-section">
          <div class="quiz-question">ETF는 원금이 보장되는 투자상품이다.</div>
        </div>

        <!-- O/X 버튼 섹션 -->
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
            <div class="ox-circle">
              <i class="fa-solid fa-check"></i>
            </div>
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
            <div class="ox-circle">
              <i class="fa-solid fa-times"></i>
            </div>
            <span>틀리다</span>
          </button>
        </div>

        <!-- 정답/오답 결과 UI -->
        <div v-if="showResult && isCorrect" class="quiz-result correct">
          <div class="result-icon">
            <i class="fa-solid fa-trophy"></i>
          </div>
          <div class="result-content">
            <div class="result-title">정답입니다! 🎉</div>
            <div class="result-desc">
              맞습니다! ETF는 원금이 보장되지 않는 투자상품입니다.
            </div>
          </div>
        </div>
        
        <div v-if="showResult && !isCorrect" class="quiz-result wrong">
          <div class="result-icon">
            <i class="fa-solid fa-lightbulb"></i>
          </div>
          <div class="result-content">
            <div class="result-title">틀렸습니다</div>
            <div class="result-desc">
              틀렸습니다! ETF는 원금이 보장되지 않는 투자상품입니다.
            </div>
          </div>
        </div>

        <!-- 포인트 획득 버튼 -->
        <button v-if="showResult && isCorrect" class="quiz-point" @click="close">
          <div class="point-icon">
            <i class="fa-solid fa-star"></i>
          </div>
          <div class="point-content">
            <div class="point-amount">+10 포인트</div>
            <div class="point-desc">획득했습니다!</div>
          </div>
        </button>

        <!-- 액션 버튼들 -->
        <div class="quiz-actions">
          <button
            v-if="!showResult"
            class="quiz-submit-btn"
            :disabled="!answer"
            @click="checkAnswer"
          >
            <i class="fa-solid fa-paper-plane"></i>
            정답 확인
          </button>
          <button
            v-if="showResult && !isCorrect"
            class="quiz-close-btn-bottom"
            @click="close"
          >
            <i class="fa-solid fa-times"></i>
            닫기
          </button>
        </div>
      </div>
    </div>
  </teleport>
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
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.quiz-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 24px;
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  padding: 32px 28px 28px 28px;
  max-width: 380px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  animation: slideUp 0.4s ease-out;
}

@keyframes slideUp {
  from { 
    opacity: 0; 
    transform: translateY(20px) scale(0.95);
  }
  to { 
    opacity: 1; 
    transform: translateY(0) scale(1);
  }
}

.quiz-close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  font-size: 16px;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
}

.quiz-close-btn:hover {
  background: rgba(255, 255, 255, 0.95);
  color: #374151;
  transform: scale(1.05);
}

.quiz-header {
  text-align: center;
  margin-bottom: 32px;
}

.quiz-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #4318d1 0%, #6366f1 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  box-shadow: 0 8px 16px rgba(67, 24, 209, 0.3);
}

.quiz-icon i {
  font-size: 28px;
  color: white;
}

.quiz-title {
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 6px;
}

.quiz-subtitle {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.quiz-question-section {
  width: 100%;
  margin-bottom: 32px;
}

.question-number {
  font-size: 14px;
  font-weight: 600;
  color: #4318d1;
  margin-bottom: 12px;
  text-align: center;
}

.quiz-question {
  font-size: 18px;
  color: #1f2937;
  font-weight: 600;
  text-align: center;
  line-height: 1.5;
  padding: 0 8px;
}

.quiz-ox-group {
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
  width: 100%;
}

.quiz-ox-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #ffffff;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  padding: 20px 16px 16px 16px;
  font-size: 15px;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
}

.quiz-ox-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(67, 24, 209, 0.05) 0%, rgba(99, 102, 241, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.quiz-ox-btn:hover::before {
  opacity: 1;
}

.quiz-ox-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.quiz-ox-btn.selected {
  border: 2px solid #4318d1;
  box-shadow: 0 8px 25px rgba(67, 24, 209, 0.2);
  transform: translateY(-2px);
}

.quiz-ox-btn.o .ox-circle {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

.quiz-ox-btn.x .ox-circle {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.ox-circle {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #fff;
  font-weight: 700;
  margin-bottom: 12px;
  transition: all 0.3s ease;
}

.quiz-result {
  width: 100%;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  font-size: 15px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  animation: slideIn 0.4s ease-out;
}

@keyframes slideIn {
  from { 
    opacity: 0; 
    transform: translateY(10px);
  }
  to { 
    opacity: 1; 
    transform: translateY(0);
  }
}

.quiz-result.correct {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border: 1.5px solid #bbf7d0;
  color: #16a34a;
}

.quiz-result.wrong {
  background: linear-gradient(135deg, #fef2f2 0%, #fecaca 100%);
  border: 1.5px solid #fecaca;
  color: #dc2626;
}

.result-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.quiz-result.correct .result-icon {
  background: rgba(34, 197, 94, 0.2);
}

.quiz-result.wrong .result-icon {
  background: rgba(239, 68, 68, 0.2);
}

.result-content {
  flex: 1;
}

.result-title {
  font-weight: 700;
  margin-bottom: 4px;
  font-size: 16px;
}

.result-desc {
  font-size: 14px;
  line-height: 1.4;
  opacity: 0.9;
}

.quiz-point {
  width: 100%;
  background: linear-gradient(135deg, #4318d1 0%, #6366f1 100%);
  color: #fff;
  border-radius: 16px;
  padding: 16px 20px;
  font-size: 16px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(67, 24, 209, 0.3);
  animation: bounceIn 0.6s ease-out;
}

@keyframes bounceIn {
  0% { 
    opacity: 0; 
    transform: scale(0.3);
  }
  50% { 
    transform: scale(1.05);
  }
  70% { 
    transform: scale(0.9);
  }
  100% { 
    opacity: 1; 
    transform: scale(1);
  }
}

.quiz-point:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(67, 24, 209, 0.4);
}

.quiz-point:active {
  transform: translateY(0);
}

.point-icon {
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.point-icon i {
  color: #ffe066;
  font-size: 16px;
}

.point-content {
  text-align: left;
}

.point-amount {
  font-size: 18px;
  font-weight: 800;
  margin-bottom: 2px;
}

.point-desc {
  font-size: 14px;
  opacity: 0.9;
  font-weight: 500;
}

.quiz-actions {
  width: 100%;
}

.quiz-submit-btn {
  width: 100%;
  background: linear-gradient(135deg, #4318d1 0%, #6366f1 100%);
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 16px 0;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 15px rgba(67, 24, 209, 0.3);
}

.quiz-submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(67, 24, 209, 0.4);
}

.quiz-submit-btn:disabled {
  background: #d1d5db;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.quiz-close-btn-bottom {
  width: 100%;
  background: #f3f4f6;
  color: #6b7280;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px 0;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.quiz-close-btn-bottom:hover {
  background: #e5e7eb;
  color: #374151;
  transform: translateY(-1px);
}

.quiz-close-btn-bottom:active {
  transform: translateY(0);
}

/* 정답/오답 상태 스타일 */
.quiz-ox-btn.o.correct {
  border: 2px solid #22c55e;
  box-shadow: 0 8px 25px rgba(34, 197, 94, 0.3);
  animation: correctPulse 0.6s ease-out;
}

.quiz-ox-btn.x.correct {
  border: 2px solid #ef4444;
  box-shadow: 0 8px 25px rgba(239, 68, 68, 0.3);
  animation: correctPulse 0.6s ease-out;
}

.quiz-ox-btn.wrong {
  border: 2px solid #ef4444;
  box-shadow: 0 8px 25px rgba(239, 68, 68, 0.2);
  animation: wrongShake 0.6s ease-out;
}

@keyframes correctPulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

@keyframes wrongShake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

/* 반응형 디자인 */
/* @media (max-width: 480px) {
  .quiz-card {
    margin: 20px;
    padding: 24px 20px 20px 20px;
  }
  
  .quiz-ox-group {
    gap: 12px;
  }
  
  .quiz-ox-btn {
    padding: 16px 12px 12px 12px;
  }
  
  .ox-circle {
    width: 44px;
    height: 44px;
    font-size: 18px;
  }
} */
</style>
