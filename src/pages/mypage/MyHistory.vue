<!-- src/pages/mypage/MyHistory.vue -->
<template>
  <div class="my-history-container">
    <!-- 고정 헤더 -->
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
        @click="switchToChallengeTab"
      >
        챌린지
      </button>
      <button
        class="tab-button"
        :class="{ active: activeTab === 'quiz' }"
        @click="switchToQuizTab"
      >
        금융 퀴즈
      </button>
    </div>

    <!-- 챌린지 탭 -->
    <div v-if="activeTab === 'challenge'" class="tab-content">
      <div class="history-card">
        <div class="list">
          <!-- 로딩 -->
          <div v-if="challengeLoading" class="loading-state">
            <div class="loading-spinner"></div>
            <div>챌린지 히스토리를 불러오는 중...</div>
          </div>

          <!-- 에러 -->
          <div v-else-if="challengeError" class="error-state">
            <i class="fa-solid fa-exclamation-triangle"></i>
            <div>{{ challengeError }}</div>
            <button class="retry-btn" @click="fetchChallengeHistory">
              다시 시도
            </button>
          </div>

          <!-- 목록 -->
          <template v-else>
            <div v-if="challengeHistory.length > 0">
              <div class="list-header">
                <span class="list-header-title">챌린지명</span>
                <span class="list-header-status">상태</span>
              </div>

              <div
                v-for="(challenge, index) in challengeHistory"
                :key="challenge.id || index"
                class="list-item"
              >
                <div class="item-title">{{ challenge.title }}</div>
                <span
                  class="item-status"
                  :class="{
                    completed: challenge.status === '성공',
                    failed: challenge.status === '실패',
                    unconfirmed: challenge.status === '진행중',
                  }"
                >
                  {{ challenge.status }}
                </span>
              </div>
            </div>

            <!-- 빈 상태 -->
            <div v-else class="empty-state">
              <i class="fa-solid fa-inbox"></i>
              <div>챌린지 히스토리가 없습니다.</div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- 금융 퀴즈 탭 -->
    <div v-if="activeTab === 'quiz'" class="tab-content">
      <div class="history-card">
        <div class="list">
          <!-- 로딩 -->
          <div v-if="loading" class="loading-state">
            <div class="loading-spinner"></div>
            <div>퀴즈 히스토리를 불러오는 중...</div>
          </div>

          <!-- 에러 -->
          <div v-else-if="error" class="error-state">
            <i class="fa-solid fa-exclamation-triangle"></i>
            <div>{{ error }}</div>
            <button class="retry-btn" @click="fetchQuizHistory">
              다시 시도
            </button>
          </div>

          <!-- 목록 -->
          <template v-else>
            <div v-if="quizHistory.length > 0">
              <div class="list-header">
                <span class="list-header-title">문제</span>
                <span class="list-header-status">정답여부</span>
              </div>

              <div
                v-for="(quiz, index) in quizHistory"
                :key="quiz.id || index"
                class="list-item clickable"
                :class="{ 'no-id': quiz._hasNoId }"
                @click="selectQuiz(quiz)"
              >
                <div class="item-title">
                  {{ quiz.question || "질문을 불러올 수 없습니다." }}
                </div>
                <span
                  class="item-status"
                  :class="{ correct: quiz.isCorrect, wrong: !quiz.isCorrect }"
                >
                  {{ quiz.isCorrect ? "정답" : "오답" }}
                </span>

                <!-- ID 없음 안내 -->
                <div v-if="quiz._hasNoId" class="item-warning">
                  <i class="fa-solid fa-exclamation-triangle"></i>
                  상세 정보 불가
                </div>
              </div>
            </div>

            <!-- 빈 상태 -->
            <div v-else class="empty-state">
              <i class="fa-solid fa-inbox"></i>
              <div>퀴즈 히스토리가 없습니다.</div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- 퀴즈 상세 모달 -->
    <div v-if="showModal" class="quiz-modal-backdrop" @click="closeModal">
      <div class="quiz-card" @click.stop>
        <button class="quiz-close-btn" @click="closeModal">
          <i class="fa-solid fa-xmark"></i>
        </button>

        <div class="quiz-title">👤퀴즈 결과👤</div>
        <div class="quiz-question">{{ selectedQuiz.question }}</div>

        <!-- 사용자가 선택한 OX만 하이라이트 -->
        <div class="quiz-ox-group">
          <button
            class="quiz-ox-btn o"
            :class="{ selected: selectedQuiz.userAnswer === 'O' }"
            disabled
          >
            <div class="ox-circle"><i class="fa-solid fa-check"></i></div>
            <span>맞다</span>
          </button>
          <button
            class="quiz-ox-btn x"
            :class="{ selected: selectedQuiz.userAnswer === 'X' }"
            disabled
          >
            <div class="ox-circle"><i class="fa-solid fa-times"></i></div>
            <span>틀리다</span>
          </button>
        </div>

        <!-- 정답/오답 결과 -->
        <div
          class="quiz-result"
          :class="{
            correct: selectedQuiz.isCorrect,
            wrong: !selectedQuiz.isCorrect,
          }"
        >
          <div class="result-icon">
            <i
              class="fa-regular"
              :class="
                selectedQuiz.isCorrect ? 'fa-circle-check' : 'fa-circle-xmark'
              "
            ></i>
          </div>
          <div class="result-content">
            <div class="result-title">
              {{ selectedQuiz.isCorrect ? "정답입니다!" : "틀렸습니다" }}
            </div>
            <div class="result-desc">{{ selectedQuiz.explanation }}</div>
          </div>
        </div>

        <!-- 상세 해설 -->
        <div class="quiz-explanation-section">
          <div class="explanation-header">
            <i class="fa-solid fa-lightbulb"></i>
            <span>상세 해설</span>
          </div>
          <div class="explanation-content">
            {{ selectedQuiz.explanation || selectedQuiz.question }}
          </div>
        </div>

        <button class="quiz-close-btn-bottom" @click="closeModal">닫기</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getQuizHistoryList, getQuizHistoryDetail } from "@/api/home";
import { getChallengeHistory } from "@/api/challenge/challenge";
import { useAuthStore } from "@/stores/auth";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
library.add(faAngleLeft);

const router = useRouter();
const authStore = useAuthStore();

/* 상태 */
const activeTab = ref("challenge");
const quizHistory = ref([]);
const selectedQuiz = ref(null);
const showModal = ref(false);
const loading = ref(false);
const error = ref(null);

const challengeHistory = ref([]);
const challengeLoading = ref(false);
const challengeError = ref(null);

/* 챌린지 */
const fetchChallengeHistory = async () => {
  try {
    challengeLoading.value = true;
    challengeError.value = null;

    if (!authStore.isAuthenticated) {
      challengeError.value = "챌린지 히스토리를 보려면 로그인이 필요합니다.";
      return;
    }

    const response = await getChallengeHistory();
    if (!Array.isArray(response)) {
      challengeError.value = "챌린지 히스토리 데이터 형식이 올바르지 않습니다.";
      return;
    }

    challengeHistory.value = response.map((challenge) => ({
      id: challenge.challengeId,
      title: challenge.title,
      status: challenge.resultChecked
        ? challenge.isSuccess
          ? "성공"
          : "실패"
        : "진행중",
    }));
  } catch {
    challengeError.value = "챌린지 히스토리를 불러오는데 실패했습니다.";
  } finally {
    challengeLoading.value = false;
  }
};

/* 퀴즈 */
const fetchQuizHistory = async () => {
  try {
    loading.value = true;
    error.value = null;

    if (!authStore.isAuthenticated) {
      error.value = "퀴즈 히스토리를 보려면 로그인이 필요합니다.";
      return;
    }

    const response = await getQuizHistoryList();
    let data;

    if (response?.data?.status === 0 && response?.data?.data)
      data = response.data.data;
    else if (response?.data?.status === 200 && response?.data?.data)
      data = response.data.data;
    else if (Array.isArray(response?.data)) data = response.data;
    else if (Array.isArray(response)) data = response;
    else {
      error.value = "퀴즈 히스토리 데이터를 가져오는데 실패했습니다.";
      return;
    }

    quizHistory.value = (Array.isArray(data) ? data : []).map((q) => {
      const id = q.historyId || q.id || q.quizId || q.quiz_id;
      if (!id) {
        return {
          ...q,
          id: `temp_${Date.now()}_${Math.random()}`,
          _hasNoId: true,
        };
      }
      return { ...q, id, historyId: id };
    });
  } catch {
    error.value = "퀴즈 히스토리를 불러오는데 실패했습니다.";
  } finally {
    loading.value = false;
  }
};

const fetchQuizDetail = async (quizId) => {
  try {
    if (!quizId) {
      error.value = "유효하지 않은 퀴즈 ID입니다.";
      return;
    }
    const res = await getQuizHistoryDetail(quizId);
    const d = res?.data?.data ?? res?.data ?? res ?? {};

    const normalized = {
      id: d.id ?? d.historyId ?? d.quizId ?? d.quiz_id ?? null,
      question: d.data?.question ?? d.question ?? d.title ?? "",
      answer: d.answer ?? d.correctAnswer ?? d.ox ?? "",
      isCorrect: d.isCorrect ?? d.correct ?? false,
      explanation:
        d.explanation ?? d.data?.message ?? d.detail ?? d.message ?? "",
    };

    selectedQuiz.value = { ...(selectedQuiz.value || {}), ...normalized };
  } catch {
    error.value = "퀴즈 상세 정보를 불러오는데 실패했습니다.";
  }
};

const selectQuiz = async (quiz) => {
  const quizId = quiz.historyId || quiz.id || quiz.quizId || quiz.quiz_id;
  if (!quizId) {
    error.value = "퀴즈 ID를 찾을 수 없습니다.";
    return;
  }

  // 사용자 선택 답 추정
  const userAnswer = quiz.isCorrect
    ? quiz.answer
    : quiz.answer === "O"
    ? "X"
    : "O";
  selectedQuiz.value = { ...quiz, userAnswer };
  showModal.value = true;
  await fetchQuizDetail(quizId);
};

/* 공통 */
const switchToChallengeTab = () => {
  activeTab.value = "challenge";
  if (!challengeLoading.value && challengeHistory.value.length === 0) {
    fetchChallengeHistory();
  }
};
const switchToQuizTab = () => {
  activeTab.value = "quiz";
  if (!loading.value && quizHistory.value.length === 0) {
    fetchQuizHistory();
  }
};
const closeModal = () => {
  showModal.value = false;
  selectedQuiz.value = null;
};
const goBack = () => router.go(-1);

onMounted(() => {
  fetchChallengeHistory();
  fetchQuizHistory();
});
</script>

<style scoped>
/* 컨테이너: 중앙 정렬 + 고정 헤더 공간 확보 */
.my-history-container {
  min-height: 100vh;
  width: 100%;
  max-width: 390px;
  margin: 0 auto;
  background: var(--color-bg-light);
  font-family: var(--font-main);
  padding: 56px 12px 84px; /* ← fixed 헤더 높이 상쇄 + 좌우 패딩 + 하단 여유 */
  box-sizing: border-box;
}

/* 고정 헤더 */
.history-header-bar {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 390px;
  height: 56px;
  padding: 0 12px;
  z-index: 1100;
  background: #fff;
  border-bottom: 1px solid #e5e6ea;
}
.history-header-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--color-text);
}
.back-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: none;
  border: none;
  font-size: 22px;
  color: #222;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}
.back-btn:hover {
  background: transparent;
} /* 호버 제거 */
.back-btn:active {
  transform: scale(0.98);
} /* 클릭 반응만 */

/* 탭 */
.tab-navigation {
  display: flex;
  margin: 12px 0 16px; /* 헤더 아래 여백 과도 문제 ↓ 조정 */
  background: #fff;
  border-radius: 12px;
  padding: 4px;
  border: 1px solid #ececec;
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

.tab-content {
  margin: 0;
}

/* 공용 카드/리스트 */
.history-card {
  background: var(--color-bg);
  border-radius: 12px;
  overflow: hidden;
}
.list {
  border-radius: 12px;
  border: 1px solid #ececec;
  background: #fff;
  overflow: hidden;
}
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fafafa;
  font-weight: 700;
  font-size: 14px;
  padding: 10px 12px;
  border-bottom: 1px solid #ececec;
}
.list-header-title {
  flex: 1;
  text-align: left;
}
.list-header-status {
  width: 60px;
  text-align: center;
}

.list-item {
  display: flex;
  align-items: center;
  padding: 12px 12px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 15px;
  background: #fff;
  min-width: 0;
  overflow: hidden;
}
.list-item:last-child {
  border-bottom: none;
}
.list-item.clickable {
  cursor: pointer;
  transition: background 0.2s;
}
.list-item.clickable:hover {
  background: #f9f9f9;
}

.item-title {
  flex: 1;
  color: #222;
  font-weight: 400;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: calc(100% - 60px);
  min-width: 0;
  word-break: keep-all;
  padding-right: 8px;
}
.item-status {
  width: 32px;
  height: 32px;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #f3f3f3;
  margin-left: 8px;
}
.item-status.completed {
  color: #22c55e;
  background: #e8f5e8;
}
.item-status.failed {
  color: #e11d48;
  background: #ffebee;
}
.item-status.correct {
  color: #22c55e;
  background: #e8f5e8;
}
.item-status.wrong {
  color: #e11d48;
  background: #ffebee;
}
.item-status.unconfirmed {
  color: #f59e0b;
  background: #fef3c7;
}

.item-warning {
  position: absolute;
  top: 8px;
  right: 8px;
  background: #fef3c7;
  color: #92400e;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 상태 UI */
.loading-state,
.error-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 40px 20px;
  font-size: 15px;
  text-align: center;
}
.loading-state {
  color: #666;
}
.error-state {
  color: #ef4444;
}
.empty-state {
  color: #666;
}
.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f3f4f6;
  border-top: 3px solid #4318d1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.retry-btn {
  background: #4318d1;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}
.retry-btn:hover {
  background: #3730a3;
}

/* 모달 */
.quiz-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
  animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.quiz-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 24px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(255, 255, 255, 0.05);
  padding: 32px 28px 28px;
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
  backdrop-filter: blur(10px);
}
.quiz-close-btn:hover {
  background: rgba(255, 255, 255, 0.95);
  color: #374151;
  transform: scale(1.05);
}

.quiz-title {
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 6px;
  text-align: center;
}
.quiz-question {
  font-size: 18px;
  color: #1f2937;
  font-weight: 600;
  text-align: center;
  line-height: 1.5;
  padding: 0 8px;
  margin-bottom: 24px;
}

.quiz-ox-group {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  width: 100%;
}
.quiz-ox-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  padding: 18px 16px 14px;
  font-size: 15px;
  font-weight: 600;
  color: #374151;
}
.quiz-ox-btn:disabled {
  cursor: default;
}
.quiz-ox-btn.selected {
  border: 2px solid #4318d1;
  box-shadow: 0 8px 25px rgba(67, 24, 209, 0.2);
  transform: translateY(-2px);
  background: rgba(67, 24, 209, 0.05);
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
  margin-bottom: 10px;
  transition: all 0.3s;
}

.quiz-result {
  width: 100%;
  border-radius: 16px;
  padding: 18px;
  margin-bottom: 18px;
  font-size: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  position: relative;
  overflow: hidden;
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
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}
.result-title {
  font-weight: 700;
  font-size: 16px;
  text-align: center;
}
.result-desc {
  font-size: 14px;
  line-height: 1.45;
  opacity: 0.9;
}

.quiz-explanation-section {
  background: #fef3c7;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  border: 1.5px solid #f59e0b;
  width: 100%;
}
.explanation-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  font-weight: 600;
  color: #92400e;
  font-size: 15px;
}
.explanation-content {
  color: #78350f;
  font-size: 14px;
  line-height: 1.5;
}

.quiz-close-btn-bottom {
  width: 100%;
  background: #f3f4f6;
  color: #6b7280;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 14px 0;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}
.quiz-close-btn-bottom:hover {
  background: #e5e7eb;
  color: #374151;
  transform: translateY(-1px);
}
</style>
