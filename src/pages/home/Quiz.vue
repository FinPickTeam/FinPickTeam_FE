<template>
  <div class="quiz-modal-backdrop" @click.self="close">
    <div class="quiz-card">
      <button class="quiz-close-btn" @click="close">
        <i class="fa-solid fa-xmark"></i>
      </button>
      <div class="quiz-title">👤오늘의 금융 퀴즈👤</div>

      <!-- 로딩 상태 -->
      <div v-if="loading" class="quiz-loading">
        <div class="loading-spinner"></div>
        <div>퀴즈를 불러오는 중...</div>
      </div>

      <!-- 에러 상태 -->
      <div v-else-if="error" class="quiz-error">
        <i class="fa-solid fa-exclamation-triangle"></i>
        <div>{{ error }}</div>
        <button class="quiz-retry-btn" @click="fetchQuiz">다시 시도</button>
      </div>

      <!-- 퀴즈 내용 -->
      <div v-else-if="quizData" class="quiz-content">
        <div class="quiz-question">{{ quizData.question }}</div>
        <div class="quiz-ox-group">
          <button
            class="quiz-ox-btn o"
            :class="{
              selected: answer === 'O' && !showResult,
              wrong: showResult && answer === 'O' && quizData.answer !== 'O',
              correct: showResult && quizData.answer === 'O' && answer === 'O',
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
              wrong: showResult && answer === 'X' && quizData.answer !== 'X',
              correct: showResult && quizData.answer === 'X' && answer === 'X',
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
              {{ quizData.explanation }}
            </div>
          </div>
        </div>
        <div v-if="showResult && !isCorrect" class="quiz-result wrong">
          <i class="fa-regular fa-circle-xmark"></i>
          <div>
            <div class="result-title">틀렸습니다.</div>
            <div class="result-desc">
              {{ quizData.explanation }}
            </div>
          </div>
        </div>

        <!-- 포인트 안내 -->
        <div v-if="showResult && isCorrect" class="quiz-point-section">
          <div v-if="pointsLoading" class="quiz-point loading">
            <div class="loading-spinner-small"></div>
            포인트 적립 중...
          </div>
          <div v-else-if="pointsEarned" class="quiz-point earned">
            <i class="fa-solid fa-star"></i>
            10 포인트 획득!
          </div>
          <div v-else class="quiz-point">
            <i class="fa-solid fa-star"></i>
            포인트 적립 중...
          </div>
        </div>

        <!-- 정답일 때 닫기 버튼 -->
        <button
          v-if="showResult && isCorrect && pointsEarned"
          class="quiz-close-btn-bottom"
          @click="close"
        >
          닫기
        </button>

        <!-- 오답일 때 닫기 버튼 -->
        <button
          v-if="showResult && !isCorrect"
          class="quiz-close-btn-bottom"
          @click="close"
        >
          닫기
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
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { getTodayQuiz, submitQuiz } from "@/api/home";
import { useAuthStore } from "@/stores/auth";
import { useAvatarStore } from "@/stores/avatar.js";
import { addQuizPoints } from "@/api/mypage/avatar";

const answer = ref("");
const showResult = ref(false);
const loading = ref(false);
const error = ref(null);
const quizData = ref(null);
const authStore = useAuthStore();
const avatarStore = useAvatarStore();

// 포인트 적립 상태
const pointsEarned = ref(false);
const pointsLoading = ref(false);

// 포인트 적립 함수 (API 사용)
const addQuizPointsToUser = async () => {
  if (!isCorrect.value || pointsEarned.value) return;

  try {
    pointsLoading.value = true;

    // 사용자 ID 가져오기
    const userId = authStore.user?.id || authStore.user?.userId || 1;

    console.log("퀴즈 포인트 API 호출 시작, userId:", userId);
    const response = await addQuizPoints(userId, 10);
    console.log("퀴즈 포인트 API 응답:", response);

    // API 응답에서 업데이트된 포인트 정보 추출
    if (response.status === 200 && response.data) {
      let updatedData;

      // 응답 구조에 따라 데이터 추출
      if (response.data.data) {
        updatedData = response.data.data;
      } else if (response.data) {
        updatedData = response.data;
      }

      if (updatedData) {
        // 현재 포인트와 누적 포인트 업데이트
        if (updatedData.currentPoints !== undefined) {
          avatarStore.setCoin(updatedData.currentPoints);
          console.log("현재 포인트 업데이트:", updatedData.currentPoints);
        }
        if (updatedData.cumulativePoints !== undefined) {
          avatarStore.setCumulativePoints(updatedData.cumulativePoints);
          console.log("누적 포인트 업데이트:", updatedData.cumulativePoints);
        }

        console.log("포인트 업데이트 완료:", {
          current: updatedData.currentPoints,
          cumulative: updatedData.cumulativePoints,
        });
      }
    }

    pointsEarned.value = true;
    console.log("퀴즈 포인트 적립 완료");
  } catch (err) {
    console.error("퀴즈 포인트 적립 API 에러:", err);

    // API 실패 시에도 로컬에서 포인트 추가 (fallback)
    const currentCoin = avatarStore.coin || 0;
    const newCoin = currentCoin + 10;
    avatarStore.setCoin(newCoin);

    const currentCumulative = avatarStore.cumulativePoints || 0;
    const newCumulative = currentCumulative + 10;
    avatarStore.setCumulativePoints(newCumulative);

    pointsEarned.value = true;
    console.log("API 실패로 인한 로컬 포인트 적립 완료:", {
      current: newCoin,
      cumulative: newCumulative,
    });
  } finally {
    pointsLoading.value = false;
  }
};

const emit = defineEmits(["close"]);

const isCorrect = computed(() => {
  if (!quizData.value || !answer.value) return false;
  return answer.value === quizData.value.answer;
});

// 퀴즈 데이터 가져오기
const fetchQuiz = async () => {
  try {
    loading.value = true;
    error.value = null;

    // 인증 상태 확인
    if (!authStore.isAuthenticated) {
      console.warn("퀴즈를 보려면 로그인이 필요합니다.");
      error.value = "퀴즈를 보려면 로그인이 필요합니다.";
      loading.value = false;
      return;
    }

    console.log("퀴즈 데이터 가져오기 시작");
    const response = await getTodayQuiz();
    console.log("받아온 퀴즈 데이터:", response);

    // 백엔드 응답 구조에 따라 퀴즈 데이터 추출
    let quizDataValue;

    // 구조 1: { status: 200, message: "...", data: {...} }
    if (response.status === 200 && response.data && response.data.data) {
      quizDataValue = response.data.data;
    }
    // 구조 2: { status: 200, data: {...} }
    else if (response.status === 200 && response.data) {
      quizDataValue = response.data;
    }
    // 구조 3: { data: {...} }
    else if (response.data) {
      quizDataValue = response.data;
    }

    console.log("추출된 퀴즈 데이터:", quizDataValue);

    if (quizDataValue && quizDataValue.id && quizDataValue.question) {
      quizData.value = quizDataValue;
      console.log("퀴즈 데이터 설정 완료:", quizData.value);
    } else {
      console.warn("유효한 퀴즈 데이터를 찾을 수 없습니다:", response);
      error.value = "퀴즈 데이터를 가져오는데 실패했습니다.";
    }
  } catch (err) {
    console.error("퀴즈 조회 에러:", err);

    let errorMessage = "퀴즈를 불러오는데 실패했습니다.";

    if (err.response?.status === 401) {
      errorMessage = "로그인이 필요합니다.";
    } else if (err.response?.status === 404) {
      errorMessage = "퀴즈를 찾을 수 없습니다.";
    } else if (err.response?.status === 500) {
      errorMessage = "서버 오류가 발생했습니다.";
    } else if (err.message) {
      errorMessage = `연결 오류: ${err.message}`;
    }

    error.value = errorMessage;
  } finally {
    loading.value = false;
  }
};

async function checkAnswer() {
  if (!answer.value || !quizData.value) return;

  console.log("정답 확인 시작:", {
    userAnswer: answer.value,
    correctAnswer: quizData.value.answer,
    isCorrect: answer.value === quizData.value.answer,
  });

  try {
    // 퀴즈 응답 제출
    const submitData = {
      quizId: quizData.value.id,
      userAnswer: answer.value,
    };

    console.log("퀴즈 응답 제출:", submitData);
    await submitQuiz(submitData);
    console.log("퀴즈 응답 제출 성공");

    // 결과 표시
    showResult.value = true;

    // 정답인 경우 포인트 적립 (제출 성공 후)
    if (isCorrect.value) {
      console.log("정답 확인됨 - 포인트 적립 시작");
      await addQuizPointsToUser();
    } else {
      console.log("오답 - 포인트 적립하지 않음");
    }
  } catch (err) {
    console.error("퀴즈 제출 에러:", err);
    // 제출 실패해도 결과는 표시
    showResult.value = true;

    // 정답인 경우 포인트 적립 (제출 실패해도 정답이면 포인트는 적립)
    if (isCorrect.value) {
      console.log("제출 실패했지만 정답이므로 포인트 적립 시작");
      await addQuizPointsToUser();
    } else {
      console.log("제출 실패하고 오답이므로 포인트 적립하지 않음");
    }
  }
}

function close() {
  // 상태 초기화
  answer.value = "";
  showResult.value = false;
  quizData.value = null;
  error.value = null;
  pointsEarned.value = false;
  pointsLoading.value = false;
  emit("close");
}

// 컴포넌트 마운트 시 퀴즈 데이터 가져오기
onMounted(() => {
  fetchQuiz();
});
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

/* 로딩 상태 스타일 */
.quiz-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 40px 20px;
  color: #666;
  font-size: 15px;
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
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 에러 상태 스타일 */
.quiz-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 40px 20px;
  color: #ef4444;
  font-size: 15px;
  text-align: center;
}

.quiz-error i {
  font-size: 32px;
  color: #ef4444;
}

.quiz-retry-btn {
  background: #4318d1;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.quiz-retry-btn:hover {
  background: #3730a3;
}

/* 퀴즈 내용 컨테이너 */
.quiz-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 포인트 적립 섹션 스타일 */
.quiz-point-section {
  width: 100%;
  margin-top: 12px;
}

.quiz-point {
  width: 100%;
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  color: #92400e;
  border: none;
  border-radius: 8px;
  padding: 14px 0;
  font-size: 16px;
  font-weight: 600;
  margin-top: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.3);
}

.quiz-point.loading {
  background: #f3f4f6;
  color: #6b7280;
  box-shadow: none;
}

.quiz-point.earned {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(34, 197, 94, 0.3);
}

.loading-spinner-small {
  width: 16px;
  height: 16px;
  border: 2px solid #e5e7eb;
  border-top: 2px solid #4318d1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.quiz-point i {
  color: #ffe066;
  font-size: 18px;
}

.quiz-point.earned i {
  color: #ffffff;
}
</style>
