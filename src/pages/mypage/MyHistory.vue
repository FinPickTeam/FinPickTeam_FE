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
              {{ quiz.isCorrect ? "정답" : "오답" }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Quiz Detail Modal -->
    <div v-if="selectedQuiz" class="quiz-modal-backdrop" @click="closeModal">
      <div class="quiz-card">
        <button class="quiz-close-btn" @click="closeModal">
          <i class="fa-solid fa-xmark"></i>
        </button>
        <div class="quiz-title">👤퀴즈 결과👤</div>
        <div class="quiz-question">{{ selectedQuiz.question }}</div>

        <!-- O X 섹션 추가 -->
        <div class="quiz-ox-group">
          <button
            class="quiz-ox-btn o"
            :class="{
              correct: selectedQuiz.userAnswer === 'O',
            }"
            disabled
          >
            <div class="ox-circle">O</div>
            <span>맞다</span>
          </button>
          <button
            class="quiz-ox-btn x"
            :class="{
              correct: selectedQuiz.userAnswer === 'X',
            }"
            disabled
          >
            <div class="ox-circle">X</div>
            <span>틀리다</span>
          </button>
        </div>

        <!-- 정답/오답 결과 UI -->
        <div v-if="selectedQuiz.isCorrect" class="quiz-result correct">
          <i class="fa-regular fa-circle-check"></i>
          <div>
            <div class="result-title">정답입니다</div>
            <div class="result-desc">
              {{ selectedQuiz.feedback }}
            </div>
          </div>
        </div>
        <div v-if="!selectedQuiz.isCorrect" class="quiz-result wrong">
          <i class="fa-regular fa-circle-xmark"></i>
          <div>
            <div class="result-title">틀렸습니다.</div>
            <div class="result-desc">
              {{ selectedQuiz.feedback }}
            </div>
          </div>
        </div>

        <!-- 상세 해설 섹션 -->
        <div class="quiz-explanation-section">
          <div class="explanation-header">
            <i class="fa-solid fa-lightbulb"></i>
            <span>상세 해설</span>
          </div>
          <div class="explanation-content">
            {{ selectedQuiz.explanation }}
          </div>
        </div>

        <!-- 버튼 -->
        <button class="quiz-close-btn-bottom" @click="closeModal">닫기</button>
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
import {
  faAngleLeft,
  faTimes,
  faCheckCircle,
  faTimesCircle,
  faLightbulb,
  faInfoCircle,
  faGraduationCap,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
library.add(
  faAngleLeft,
  faTimes,
  faCheckCircle,
  faTimesCircle,
  faLightbulb,
  faInfoCircle,
  faGraduationCap,
  faCheck
);

const router = useRouter();
const selectedQuiz = ref(null);
const activeTab = ref("challenge"); // 기본값은 챌린지 탭

// 샘플 챌린지 히스토리 데이터
const challengeHistory = ref([
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
    status: "완료",
    startDate: "2024-01-15",
    endDate: "2024-02-15",
  },
  {
    title: "운동 챌린지",
    status: "실패",
    startDate: "2024-01-01",
    endDate: "2024-01-31",
  },
]);

// 샘플 퀴즈 히스토리 데이터
const quizHistory = ref([
  {
    question: "펀드 상품은 원금이 보장된다.",
    isCorrect: false,
    userAnswer: "O",
    correctAnswer: "X",
    feedback: "틀렸습니다! 펀드 상품은 원금이 보장되지 않는 투자상품입니다.",
    explanation:
      "펀드와 주식은 환금을 모두 일할 수 있는 상품입니다. 투자상품의 특성상 시장 상황에 따라 손실이 발생할 수 있으며, 원금보장이 되지 않습니다.",
  },
  {
    question: "주식매매간 생긴 수수료 상당 부분은 증권사에 지급된다.",
    isCorrect: true,
    userAnswer: "O",
    correctAnswer: "O",
    feedback: "맞습니다! 주식매매 수수료는 증권사에 지급됩니다.",
    explanation:
      "주식 거래 시 발생하는 수수료는 주로 증권사에 지급되며, 이는 증권사의 주요 수익원 중 하나입니다.",
  },
  {
    question: "ETF는 원금이 보장되는 투자상품이다.",
    isCorrect: false,
    userAnswer: "O",
    correctAnswer: "X",
    feedback: "틀렸습니다! ETF는 원금이 보장되지 않는 투자상품입니다.",
    explanation:
      "ETF는 주식형 펀드의 일종으로 원금보장이 되지 않으며, 시장 상황에 따라 손실이 발생할 수 있습니다.",
  },
  {
    question: "예금자보호제도는 1인당 5천만원까지 보호한다.",
    isCorrect: true,
    userAnswer: "O",
    correctAnswer: "O",
    feedback: "맞습니다! 예금자보호제도는 1인당 5천만원까지 보호합니다.",
    explanation:
      "예금자보호제도는 은행이 파산할 경우 예금자 1인당 원금과 이자를 합하여 5천만원까지 보호하는 제도입니다.",
  },
  {
    question: "신용카드 연체 시 신용등급이 하락할 수 있다.",
    isCorrect: true,
    userAnswer: "X",
    correctAnswer: "O",
    feedback: "틀렸습니다! 신용카드 연체 시 신용등급이 하락할 수 있습니다.",
    explanation:
      "신용카드 결제일을 지키지 못하면 연체가 발생하고, 이는 신용정보에 부정적으로 기록되어 신용등급 하락의 원인이 됩니다.",
  },
  {
    question: "적금은 만기 전에 중도해지할 수 없다.",
    isCorrect: false,
    userAnswer: "X",
    correctAnswer: "X",
    feedback: "맞습니다! 적금은 만기 전에 중도해지할 수 있습니다.",
    explanation:
      "적금은 만기 전에도 중도해지가 가능하며, 다만 중도해지 시 이자율이 낮아지거나 수수료가 발생할 수 있습니다.",
  },
  {
    question: "주식투자는 원금손실 위험이 없다.",
    isCorrect: false,
    userAnswer: "X",
    correctAnswer: "X",
    feedback: "맞습니다! 주식투자는 원금손실 위험이 있습니다.",
    explanation:
      "주식투자는 시장 상황에 따라 원금손실이 발생할 수 있는 고위험 투자상품입니다. 투자 시 신중한 판단이 필요합니다.",
  },
  {
    question: "예금은 원금이 보장되는 상품이다.",
    isCorrect: true,
    userAnswer: "X",
    correctAnswer: "O",
    feedback: "틀렸습니다! 예금은 원금이 보장되는 상품입니다.",
    explanation:
      "예금은 원금이 보장되는 안전한 금융상품으로, 은행이 파산하지 않는 한 원금과 약정이자를 받을 수 있습니다.",
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
  width: 50px;
  height: 32px;
  font-size: 12px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
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

/* Quiz Modal Styles */
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
  padding: 32px 24px 24px 24px;
  max-width: 360px;
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
  transition: border 0.2s;
  flex: 1;
}

.quiz-ox-btn.selected {
  border: 2px solid #4318d1 !important;
}

.quiz-ox-btn.o .ox-circle {
  background: #22c55e;
  color: #fff;
}

.quiz-ox-btn.x .ox-circle {
  background: #ef4444;
  color: #fff;
}

.quiz-ox-btn.o.correct {
  border: 2.5px solid #22c55e;
}

.quiz-ox-btn.x.correct {
  border: 2.5px solid #ef4444;
}

.quiz-ox-btn.wrong {
  border: 2.5px solid #ef4444;
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

.quiz-close-btn-bottom {
  width: 100%;
  background: #4318d1;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 14px 0;
  font-size: 16px;
  font-weight: 600;
  margin-top: 8px;
  cursor: pointer;
}

.quiz-result.wrong {
  background: #fef2f2;
  color: #ef4444;
  border-color: #fecaca;
}

/* Quiz.vue와 동일한 O/X 버튼 스타일링 */
.quiz-ox-btn.o.correct {
  border: 2.5px solid #22c55e;
}

/* 상세 해설 섹션 스타일링 */
.quiz-explanation-section {
  background: #fef3c7;
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 16px;
  border: 1.5px solid #f59e0b;
}

.explanation-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-weight: 600;
  color: #92400e;
  font-size: 15px;
}

.explanation-header i {
  font-size: 18px;
  color: #f59e0b;
}

.explanation-content {
  color: #78350f;
  font-size: 14px;
  line-height: 1.5;
  font-weight: 400;
}

.quiz-ox-btn.x.correct {
  border: 2.5px solid #ef4444;
}

.quiz-ox-btn.wrong {
  border: 2.5px solid #ef4444;
}
</style>
