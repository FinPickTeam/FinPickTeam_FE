<template>
  <teleport to="body">
    <div class="quiz-modal-backdrop" @click.self="close">
      <div class="quiz-card">
        <button class="quiz-close-btn" @click="close">
          <i class="fa-solid fa-xmark"></i>
        </button>

        <!-- 헤더 섹션 -->
        <div class="quiz-header">
          <!-- <div class="quiz-icon">
            <i class="fa-solid fa-brain"></i>
          </div> -->
          <div class="quiz-title">오늘의 금융 퀴즈</div>
          <div class="quiz-subtitle">매일 하나씩, 금융 지식 쌓기</div>
        </div>

        <!-- 로딩 상태 -->
        <div v-if="loading" class="quiz-loading">
          <div class="loading-spinner"></div>
          <div>퀴즈를 불러오는 중...</div>
        </div>

        <!-- 에러 상태 -->
        <div v-else-if="error" class="quiz-error">
          <i class="fa-solid fa-exclamation-triangle"></i>
          <div>{{ error }}</div>
          <button
            v-if="error.includes('응시할 수 있는 퀴즈가 없습니다')"
            class="quiz-retry-btn"
            @click="close"
          >
            창 닫기
          </button>
          <button v-else class="quiz-retry-btn" @click="fetchQuiz">
            다시 시도
          </button>
        </div>

        <!-- 퀴즈 내용 -->
        <div v-else-if="quizData" class="quiz-content">
          <!-- 질문 섹션 -->
          <div class="quiz-question-section">
            <div class="quiz-question">{{ quizData.question }}</div>
          </div>

          <!-- O/X 버튼 섹션 -->
          <div class="quiz-ox-group">
            <button
              class="quiz-ox-btn o"
              :class="{
                selected: answer === 'O',
                wrong: showResult && answer === 'O' && quizData.answer !== 'O',
                correct:
                  showResult && quizData.answer === 'O' && answer === 'O',
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
                selected: answer === 'X',
                wrong: showResult && answer === 'X' && quizData.answer !== 'X',
                correct:
                  showResult && quizData.answer === 'X' && answer === 'X',
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
            <div class="result-content">
              <div class="result-title">정답입니다!</div>
              <div class="result-desc">
                {{ quizData.message || quizData.explanation }}
              </div>
            </div>
          </div>

          <div v-if="showResult && !isCorrect" class="quiz-result wrong">
            <div class="result-content">
              <div class="result-title">틀렸습니다</div>
              <div class="result-desc">
                {{ quizData.message || quizData.explanation }}
              </div>
            </div>
          </div>

          <!-- 포인트 적립 -->
          <div v-if="showResult && isCorrect" class="quiz-point-section">
            <div v-if="pointsLoading" class="quiz-point loading">
              <div class="loading-spinner-small"></div>
              포인트 적립 중...
            </div>
            <div v-else-if="pointsEarned" class="quiz-point earned">
              <div class="point-icon">
                <i class="fa-solid fa-star"></i>
              </div>
              <div class="point-content">
                <div class="point-amount">10 포인트</div>
                <div class="point-desc">획득했습니다!</div>
              </div>
            </div>
            <div v-else class="quiz-point">
              <div class="point-icon">
                <i class="fa-solid fa-star"></i>
              </div>
              <div class="point-content">
                <div class="point-amount">포인트 적립 중...</div>
              </div>
            </div>
          </div>

          <!-- 액션 버튼들 -->
          <div class="quiz-actions">
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
              <i class="fa-solid fa-times"></i>
              닫기
            </button>
            <button
              v-if="showResult && isCorrect && pointsEarned"
              class="quiz-close-btn-bottom"
              @click="close"
            >
              <i class="fa-solid fa-times"></i>
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { getTodayQuiz, submitQuiz } from "@/api/home";
import { useAuthStore } from "@/stores/auth";
import { useAvatarStore } from "@/stores/avatar.js";
import { addQuizPoints } from "@/api/mypage/avatar";
// import { getMyCoinStatus } from "@/api/mypage/avatar/coinApi";

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

// 포인트 적립 함수 (새로운 코인 상태 API 사용) - 정답인 경우에만 포인트 적립
const addQuizPointsToUser = async () => {
  // 정답이 아니거나 이미 포인트를 받은 경우 함수 종료
  if (!isCorrect.value || pointsEarned.value) {
    console.log("포인트 적립 조건 불충족:", {
      isCorrect: isCorrect.value,
      pointsEarned: pointsEarned.value,
    });
    return;
  }

  try {
    pointsLoading.value = true;
    console.log("정답 확인됨 - 10포인트 적립 시작");

    // 퀴즈 제출 API 호출 (정답인 경우에만)
    const userId = authStore.user?.id || authStore.user?.userId || 1;

    console.log("퀴즈 포인트 API 호출 시작, userId:", userId);
    const response = await addQuizPoints(userId, 10);
    console.log("퀴즈 포인트 API 응답:", response);

    // 퀴즈 제출 후 새로운 코인 상태 API로 업데이트된 포인트 가져오기
    const coinResponse = await getMyCoinStatus();
    console.log("코인 상태 응답:", coinResponse);

    if (
      coinResponse.status === 200 &&
      coinResponse.data &&
      coinResponse.data.status === 200
    ) {
      const coinData = coinResponse.data.data;
      if (coinData) {
        // 현재 포인트와 누적 포인트 업데이트
        if (coinData.amount !== undefined) {
          avatarStore.setCoin(coinData.amount);
          console.log("현재 포인트 업데이트:", coinData.amount);
        }
        if (coinData.cumulativeAmount !== undefined) {
          avatarStore.setCumulativePoints(coinData.cumulativeAmount);
          console.log("누적 포인트 업데이트:", coinData.cumulativeAmount);
        }

        console.log("포인트 업데이트 완료:", {
          current: coinData.amount,
          cumulative: coinData.cumulativeAmount,
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

    // 임시로 하드코딩된 오류 메시지 (API가 구현되지 않음)
    error.value = "오늘은 응시할 수 있는 퀴즈가 없습니다.";
    loading.value = false;
    return;
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
    isCorrect: isCorrect.value,
  });

  try {
    // 퀴즈 응답 제출 - API 스펙에 맞게 isCorrect 필드로 전송
    const submitData = {
      quizId: quizData.value.id,
      isCorrect: isCorrect.value, // 정답 여부를 true/false로 전송
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
      pointsEarned.value = true; // 오답인 경우에도 포인트 표시를 위해 true로 설정
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
      pointsEarned.value = true; // 오답인 경우에도 포인트 표시를 위해 true로 설정
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
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(67, 24, 209, 0.05) 0%,
    rgba(99, 102, 241, 0.05) 100%
  );
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

/* 선택된 버튼이 결과 표시 후에도 유지되도록 */
.quiz-ox-btn.selected.o {
  border: 2px solid #4318d1;
  background: rgba(67, 24, 209, 0.05);
}

.quiz-ox-btn.selected.x {
  border: 2px solid #4318d1;
  background: rgba(67, 24, 209, 0.05);
}

@keyframes correctPulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes wrongShake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
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

.quiz-point.earned i {
  color: #ffffff;
}
</style>
