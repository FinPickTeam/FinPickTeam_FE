<template>
  <div class="my-history-container">
    <div class="history-header-bar">
      <button class="back-btn" @click="goBack">
        <font-awesome-icon :icon="['fas', 'angle-left']" />
      </button>
      <span class="history-header-title">마이 히스토리</span>
    </div>

    <!-- 탭 네비게이션 -->
    <div class="tab-navigation">
      <button
        class="tab-button"
        :class="{ active: activeTab === 'challenge' }"
        @click="activeTab = 'challenge'"
      >
        챌린지
      </button>
      <button
        class="tab-button"
        :class="{ active: activeTab === 'quiz' }"
        @click="activeTab = 'quiz'"
      >
        금융 퀴즈
      </button>
    </div>

    <!-- 챌린지 탭 내용 -->
    <div v-if="activeTab === 'challenge'" class="tab-content">
      <div class="challenge-history-card">
        <div class="challenge-list">
          <div class="challenge-list-header">
            <span class="challenge-list-header-title">챌린지명</span>
            <span class="challenge-list-header-status">상태</span>
          </div>
          <div
            v-for="(challenge, index) in challengeHistory"
            :key="index"
            class="challenge-item"
          >
            <div class="challenge-title">{{ challenge.title }}</div>
            <span
              class="challenge-status"
              :class="{
                ongoing: challenge.status === '진행중',
                completed: challenge.status === '완료',
                failed: challenge.status === '실패',
              }"
            >
              {{ challenge.status }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 금융 퀴즈 탭 내용 -->
    <div v-if="activeTab === 'quiz'" class="tab-content">
      <div class="quiz-history-card">
        <div class="quiz-list">
          <div class="quiz-list-header">
            <span class="quiz-list-header-question">문제</span>
            <span class="quiz-list-header-answer">정답여부</span>
          </div>
          <div
            v-for="(quiz, index) in quizHistory"
            :key="index"
            class="quiz-item"
            @click="showQuizDetail(quiz)"
          >
            <div class="question-text">{{ quiz.question }}</div>
            <span
              class="answer-result"
              :class="{ correct: quiz.isCorrect, incorrect: !quiz.isCorrect }"
            >
              {{ quiz.isCorrect ? "O" : "X" }}
            </span>
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
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import Navbar from "../../components/Navbar.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
library.add(faAngleLeft);

const router = useRouter();
const selectedQuiz = ref(null);
const activeTab = ref("challenge"); // 기본값은 챌린지 탭

// 샘플 챌린지 히스토리 데이터
const challengeHistory = ref([
  {
    title: "매일 30분 운동하기",
    status: "진행중",
    startDate: "2024-01-01",
    endDate: "2024-01-31",
  },
  {
    title: "한 달 저축 챌린지",
    status: "완료",
    startDate: "2023-12-01",
    endDate: "2023-12-31",
  },
  {
    title: "독서 챌린지",
    status: "실패",
    startDate: "2023-11-01",
    endDate: "2023-11-30",
  },
  {
    title: "금연 챌린지",
    status: "진행중",
    startDate: "2024-01-15",
    endDate: "2024-02-15",
  },
]);

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
.my-history-container {
  min-height: 100vh;
  background: var(--color-bg-light);
  position: relative;
  padding-bottom: 80px;
  font-family: var(--font-main);
  padding-left: 10px;
  padding-right: 10px;
}

.history-header-bar {
  position: relative;
  display: flex;
  align-items: center;
  padding: 20px 0 0 0;
  height: 48px;
  margin-left: 10px;
}

.back-btn {
  position: relative;
  z-index: 2;
  background: none;
  border: none;
  font-size: 22px;
  color: #222;
  cursor: pointer;
  margin-right: 8px;
  padding: 2px 8px 2px 2px;
  border-radius: 8px;
  transition: background 0.15s;
}

.back-btn:hover {
  background: var(--color-bg-accent);
}

.history-header-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--color-text);
}

/* 탭 네비게이션 스타일 */
.tab-navigation {
  display: flex;
  margin: 20px 10px 16px 10px;
  background: #fff;
  border-radius: 12px;
  padding: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.tab-button {
  flex: 1;
  padding: 12px 16px;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-button.active {
  background: #4318d1;
  color: #fff;
  font-weight: 600;
}

.tab-button:hover:not(.active) {
  background: #f5f5f5;
}

/* 탭 콘텐츠 스타일 */
.tab-content {
  margin: 0 10px;
}

/* 챌린지 히스토리 스타일 */
.challenge-history-card {
  background: var(--color-bg);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.challenge-list {
  border-radius: 12px;
  border: 1px solid #ececec;
  background: #fff;
  overflow: hidden;
}

.challenge-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fafafa;
  font-weight: bold;
  font-size: 14px;
  padding: 10px 12px;
  border-bottom: 1px solid #ececec;
}

.challenge-list-header-title {
  flex: 1;
  text-align: left;
}

.challenge-list-header-status {
  width: 60px;
  text-align: center;
}

.challenge-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 12px 12px;
  border-bottom: 1px solid #ececec;
  font-size: 15px;
  background: #fff;
}

.challenge-item:last-child {
  border-bottom: none;
}

.challenge-title {
  flex: 1;
  font-size: 15px;
  color: #222;
  font-weight: 400;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.challenge-status {
  width: 32px;
  height: 32px;
  font-size: 12px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #f3f3f3;
  margin-left: 8px;
}

.challenge-status.ongoing {
  color: #f59e0b;
  background: #fef3c7;
}

.challenge-status.completed {
  color: #22c55e;
  background: #e8f5e8;
}

.challenge-status.failed {
  color: #e11d48;
  background: #ffebee;
}

/* 퀴즈 히스토리 스타일 */
.quiz-history-card {
  background: var(--color-bg);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.quiz-list {
  border-radius: 12px;
  border: 1px solid #ececec;
  background: #fff;
  overflow: hidden;
}

.quiz-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fafafa;
  font-weight: bold;
  font-size: 14px;
  padding: 10px 12px;
  border-bottom: 1px solid #ececec;
}

.quiz-list-header-question {
  flex: 1;
  text-align: left;
}

.quiz-list-header-answer {
  width: 60px;
  text-align: center;
}

.quiz-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 12px 12px;
  border-bottom: 1px solid #ececec;
  font-size: 15px;
  background: #fff;
  cursor: pointer;
  transition: background 0.15s;
}

.quiz-item:hover {
  background: #f9f9f9;
}

.quiz-item:last-child {
  border-bottom: none;
}

.question-text {
  flex: 1;
  font-size: 15px;
  color: #222;
  font-weight: 400;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.answer-result {
  width: 32px;
  height: 32px;
  font-size: 18px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #f3f3f3;
  margin-left: 8px;
}

.answer-result.correct {
  color: #22c55e;
  background: #e8f5e8;
}

.answer-result.incorrect {
  color: #e11d48;
  background: #ffebee;
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
  background: var(--color-bg);
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
  color: var(--color-text);
  margin: 0;
}

.question-section {
  margin-bottom: 20px;
}

.question {
  font-size: 16px;
  color: var(--color-text);
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
  border: 2px solid var(--color-border);
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
  border-color: var(--color-accent);
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
  border: 1px solid var(--color-accent);
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
  color: var(--color-accent);
}

.feedback-content {
  font-size: 13px;
  line-height: 1.4;
}

.feedback-box.correct .feedback-content {
  color: #2e7d32;
}

.feedback-box.incorrect .feedback-content {
  color: var(--color-accent);
}

.explanation-box {
  background: var(--color-warning);
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
  background: var(--color-bg-light);
  color: var(--color-text);
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}

.close-modal-btn:hover {
  background: var(--color-main-light);
  color: #fff;
}
</style>
