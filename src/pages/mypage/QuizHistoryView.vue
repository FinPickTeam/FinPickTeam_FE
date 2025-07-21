<template>
  <div class="quiz-history-container">
    <Headerbar />
    <!-- Quiz History Card -->
    <div class="quiz-history-card">
      <div class="card-header">
        <button class="back-btn" @click="goBack">←</button>
        <h2 class="card-title">금융 퀴즈 히스토리</h2>
      </div>

      <div class="quiz-list">
        <div
          v-for="(quiz, index) in quizHistory"
          :key="index"
          class="quiz-item"
          @click="showQuizDetail(quiz)"
        >
          <div class="question-text">{{ quiz.question }}</div>
          <div class="answer-status">
            <div
              class="status-circle"
              :class="{ correct: quiz.isCorrect, incorrect: !quiz.isCorrect }"
            >
              {{ quiz.isCorrect ? "O" : "X" }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quiz Detail Modal -->
    <div v-if="selectedQuiz" class="modal-overlay" @click="closeModal">
      <div class="quiz-detail-modal" @click.stop>
        <div class="modal-header">
          <h3>오늘의 금융 퀴즈</h3>
        </div>

        <div class="question-section">
          <p class="question">{{ selectedQuiz.question }}</p>
        </div>

        <div class="answer-options">
          <div
            class="answer-option"
            :class="{
              correct: selectedQuiz.correctAnswer === 'correct',
              selected: selectedQuiz.userAnswer === 'correct',
              wrong:
                selectedQuiz.userAnswer === 'correct' &&
                !selectedQuiz.isCorrect,
            }"
          >
            <span class="answer-icon">O</span>
            <span class="answer-text">맞다</span>
          </div>
          <div
            class="answer-option"
            :class="{
              correct: selectedQuiz.correctAnswer === 'incorrect',
              selected: selectedQuiz.userAnswer === 'incorrect',
              wrong:
                selectedQuiz.userAnswer === 'incorrect' &&
                !selectedQuiz.isCorrect,
            }"
          >
            <span class="answer-icon">X</span>
            <span class="answer-text">틀리다</span>
          </div>
        </div>

        <div
          class="feedback-box"
          :class="{
            correct: selectedQuiz.isCorrect,
            incorrect: !selectedQuiz.isCorrect,
          }"
        >
          <div class="feedback-title">
            {{ selectedQuiz.isCorrect ? "정답입니다" : "틀렸습니다" }}
          </div>
          <div class="feedback-content">
            {{ selectedQuiz.feedback }}
          </div>
        </div>

        <div
          v-if="selectedQuiz.isCorrect && selectedQuiz.explanation"
          class="explanation-box"
        >
          <div class="explanation-content">
            {{ selectedQuiz.explanation }}
          </div>
        </div>

        <button class="close-modal-btn" @click="closeModal">닫기</button>
      </div>
    </div>
    <Navbar />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import Headerbar from "../../components/Headerbar.vue";
import Navbar from "../../components/Navbar.vue";

const router = useRouter();
const selectedQuiz = ref(null);

// 샘플 퀴즈 히스토리 데이터
const quizHistory = ref([
  {
    question: "펀드 상품은 원금이 보장된다.",
    isCorrect: false,
    userAnswer: "correct",
    correctAnswer: "incorrect",
    feedback: "틀렸습니다! 펀드 상품은 원금이 보장되지 않는 투자상품입니다.",
    explanation:
      "펀드와 주식은 환금을 모두 일할 수 있는 상품입니다. 투자상품의 특성상 시장 상황에 따라 손실이 발생할 수 있으며, 원금보장이 되지 않습니다.",
  },
  {
    question: "주식매매간 생긴 수수료 상당 부분은 증권사에 지급된다.",
    isCorrect: true,
    userAnswer: "correct",
    correctAnswer: "correct",
    feedback: "맞습니다! 주식매매 수수료는 증권사에 지급됩니다.",
    explanation:
      "주식 거래 시 발생하는 수수료는 주로 증권사에 지급되며, 이는 증권사의 주요 수익원 중 하나입니다.",
  },
  {
    question: "ETF는 원금이 보장되는 투자상품이다.",
    isCorrect: false,
    userAnswer: "incorrect",
    correctAnswer: "incorrect",
    feedback: "틀렸습니다! ETF는 원금이 보장되지 않는 투자상품입니다.",
    explanation:
      "ETF는 주식형 펀드의 일종으로 원금보장이 되지 않으며, 시장 상황에 따라 손실이 발생할 수 있습니다.",
  },
  {
    question: "예금자보호제도는 1인당 5천만원까지 보호한다.",
    isCorrect: true,
    userAnswer: "correct",
    correctAnswer: "correct",
    feedback: "맞습니다! 예금자보호제도는 1인당 5천만원까지 보호합니다.",
    explanation:
      "예금자보호제도는 은행이 파산할 경우 예금자 1인당 원금과 이자를 합하여 5천만원까지 보호하는 제도입니다.",
  },
]);

const showQuizDetail = (quiz) => {
  selectedQuiz.value = quiz;
};

const closeModal = () => {
  selectedQuiz.value = null;
};

const goBack = () => {
  router.go(-1);
};
</script>

<style scoped>
.quiz-history-container {
  min-height: 100vh;
  background: #f5f5f5;
  position: relative;
  padding-bottom: 80px;
}

.quiz-history-card {
  margin: 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.card-title {
  flex: 1;
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin: 0;
  text-align: center;
}

.back-btn {
  background: none;
  border: none;
  font-size: 22px;
  color: #7c3aed;
  cursor: pointer;
  margin-right: 8px;
  padding: 2px 8px 2px 2px;
  border-radius: 8px;
  transition: background 0.15s;
}

.back-btn:hover {
  background: #f3e8ff;
}

.quiz-list {
  max-height: 60vh;
  overflow-y: auto;
}

.quiz-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.2s;
}

.quiz-item:hover {
  background-color: #f8f8f8;
}

.quiz-item:last-child {
  border-bottom: none;
}

.question-text {
  flex: 1;
  font-size: 14px;
  color: #333;
  line-height: 1.4;
  margin-right: 15px;
}

.answer-status {
  display: flex;
  align-items: center;
}

.status-circle {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  color: white;
}

.status-circle.correct {
  background: #4caf50;
}

.status-circle.incorrect {
  background: #f44336;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.quiz-detail-modal {
  background: #fff;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  max-height: 80vh;
  overflow-y: auto;
  padding: 20px;
}

.modal-header {
  text-align: center;
  margin-bottom: 20px;
}

.modal-header h3 {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.question-section {
  margin-bottom: 20px;
}

.question {
  font-size: 16px;
  color: #333;
  line-height: 1.5;
  margin: 0;
  text-align: center;
}

.answer-options {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.answer-option {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.answer-option.correct {
  border-color: #4caf50;
  background: #e8f5e8;
}

.answer-option.selected {
  border-color: #4caf50;
}

.answer-option.wrong {
  border-color: #f44336;
  background: #ffebee;
}

.answer-icon {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
}

.answer-text {
  font-size: 14px;
  font-weight: bold;
}

.feedback-box {
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
}

.feedback-box.correct {
  background: #e8f5e8;
  border: 1px solid #4caf50;
}

.feedback-box.incorrect {
  background: #ffebee;
  border: 1px solid #f44336;
}

.feedback-title {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 5px;
}

.feedback-box.correct .feedback-title {
  color: #2e7d32;
}

.feedback-box.incorrect .feedback-title {
  color: #c62828;
}

.feedback-content {
  font-size: 13px;
  line-height: 1.4;
}

.feedback-box.correct .feedback-content {
  color: #2e7d32;
}

.feedback-box.incorrect .feedback-content {
  color: #c62828;
}

.explanation-box {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
}

.explanation-content {
  font-size: 13px;
  color: #856404;
  line-height: 1.4;
}

.close-modal-btn {
  width: 100%;
  padding: 12px;
  background: #9e9e9e;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}

.close-modal-btn:hover {
  background: #757575;
}

/* Bottom Navigation */
.bottom-nav {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 540px;
  bottom: 0;
  background: white;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-around;
  padding: 8px 0;
  z-index: 100;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: #9c27b0;
  font-size: 12px;
  cursor: pointer;
}

.nav-item.active {
  color: #4a148c;
}

.nav-icon {
  font-size: 20px;
}

.nav-label {
  font-size: 10px;
}
</style>
