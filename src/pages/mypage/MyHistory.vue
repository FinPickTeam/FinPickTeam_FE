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

    <!-- 챌린지 탭 내용 -->
    <div v-if="activeTab === 'challenge'" class="tab-content">
      <div class="challenge-history-card">
        <div class="challenge-list">
          <!-- 로딩 상태 -->
          <div v-if="challengeLoading" class="loading-state">
            <div class="loading-spinner"></div>
            <div>챌린지 히스토리를 불러오는 중...</div>
          </div>

          <!-- 에러 상태 -->
          <div v-else-if="challengeError" class="error-state">
            <i class="fa-solid fa-exclamation-triangle"></i>
            <div>{{ challengeError }}</div>
            <button class="retry-btn" @click="fetchChallengeHistory">
              다시 시도
            </button>
          </div>

          <!-- 챌린지 히스토리 목록 -->
          <div v-else-if="challengeHistory.length > 0">
            <div class="challenge-list-header">
              <span class="challenge-list-header-title">챌린지명</span>
              <span class="challenge-list-header-status">상태</span>
            </div>
            <div
              v-for="(challenge, index) in challengeHistory"
              :key="challenge.id || index"
              class="challenge-item"
            >
              <div class="challenge-title">{{ challenge.title }}</div>
              <span
                class="challenge-status"
                :class="{
                  completed: challenge.status === '성공',
                  failed: challenge.status === '실패',
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
        </div>
      </div>
    </div>

    <!-- 금융 퀴즈 탭 내용 -->
    <div v-if="activeTab === 'quiz'" class="tab-content">
      <div class="quiz-history-card">
        <div class="quiz-list">
          <!-- 로딩 상태 -->
          <div v-if="loading" class="loading-state">
            <div class="loading-spinner"></div>
            <div>퀴즈 히스토리를 불러오는 중...</div>
          </div>

          <!-- 에러 상태 -->
          <div v-else-if="error" class="error-state">
            <i class="fa-solid fa-exclamation-triangle"></i>
            <div>{{ error }}</div>
            <button class="retry-btn" @click="fetchQuizHistory">
              다시 시도
            </button>
          </div>

          <!-- 퀴즈 히스토리 목록 -->
          <div v-else-if="quizHistory.length > 0">
            <div class="quiz-list-header">
              <span class="quiz-list-header-title">문제</span>
              <span class="quiz-list-header-status">정답여부</span>
            </div>
            <div
              v-for="(quiz, index) in quizHistory"
              :key="index"
              class="quiz-item"
              :class="{ 'no-id': quiz._hasNoId }"
              @click="selectQuiz(quiz)"
            >
              <div class="quiz-title">
                {{ quiz.question || "질문을 불러올 수 없습니다." }}
              </div>
              <span
                class="quiz-status"
                :class="{
                  correct: quiz.isCorrect,
                  wrong: !quiz.isCorrect,
                }"
              >
                {{ quiz.isCorrect ? "정답" : "오답" }}
              </span>
              <!-- ID가 없는 경우 경고 표시 -->
              <div v-if="quiz._hasNoId" class="quiz-warning">
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
        </div>
      </div>
    </div>

    <!-- Quiz Detail Modal -->
    <div v-if="showModal" class="quiz-modal-backdrop" @click="closeModal">
      <div class="quiz-card" @click.stop>
        <button class="quiz-close-btn" @click="closeModal">
          <i class="fa-solid fa-xmark"></i>
        </button>
        <div class="quiz-title">👤퀴즈 결과👤</div>
        <div class="quiz-question">{{ selectedQuiz.question }}</div>

        <!-- O X 섹션 - 사용자가 선택한 답만 표시 -->
        <div class="quiz-ox-group">
          <button
            class="quiz-ox-btn o"
            :class="{
              selected: selectedQuiz.userAnswer === 'O',
            }"
            disabled
          >
            <div class="ox-circle">
              <i class="fa-solid fa-check"></i>
            </div>
            <span>맞다</span>
          </button>
          <button
            class="quiz-ox-btn x"
            :class="{
              selected: selectedQuiz.userAnswer === 'X',
            }"
            disabled
          >
            <div class="ox-circle">
              <i class="fa-solid fa-times"></i>
            </div>
            <span>틀리다</span>
          </button>
        </div>

        <!-- 정답/오답 결과 UI -->
        <div
          class="quiz-result"
          :class="{
            correct: selectedQuiz.isCorrect,
            wrong: !selectedQuiz.isCorrect,
          }"
        >
          <div class="result-icon">
            <i
              class="fa-regular fa-circle-check"
              v-if="selectedQuiz.isCorrect"
            ></i>
            <i
              class="fa-regular fa-circle-xmark"
              v-if="!selectedQuiz.isCorrect"
            ></i>
          </div>
          <div class="result-content">
            <div class="result-title">
              {{ selectedQuiz.isCorrect ? "정답입니다!" : "틀렸습니다" }}
            </div>
            <div class="result-desc">
              {{ selectedQuiz.explanation }}
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
            {{ selectedQuiz.explanation || selectedQuiz.question }}
          </div>
        </div>

        <!-- 버튼 -->
        <button class="quiz-close-btn-bottom" @click="closeModal">닫기</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getQuizHistoryList, getQuizHistoryDetail } from "@/api/home";
import {
  getUserChallengeHistory,
  getChallengeResult,
} from "@/api/challenge/challenge";
import { useAuthStore } from "@/stores/auth";
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
const authStore = useAuthStore();

// 상태 관리
const quizHistory = ref([]);
const selectedQuiz = ref(null);
const showModal = ref(false);
const loading = ref(false);
const error = ref(null);
const activeTab = ref("challenge"); // 기본값은 챌린지 탭

// 챌린지 히스토리 데이터
const challengeHistory = ref([]);
const challengeLoading = ref(false);
const challengeError = ref(null);

// 챌린지 히스토리 데이터 가져오기
const fetchChallengeHistory = async () => {
  try {
    challengeLoading.value = true;
    challengeError.value = null;

    // 인증 상태 확인
    if (!authStore.isAuthenticated) {
      console.warn("챌린지 히스토리를 보려면 로그인이 필요합니다.");
      challengeError.value = "챌린지 히스토리를 보려면 로그인이 필요합니다.";
      challengeLoading.value = false;
      return;
    }

    console.log("챌린지 히스토리 데이터 가져오기 시작");
    const response = await getUserChallengeHistory();
    console.log("받아온 챌린지 히스토리 데이터:", response);

    if (Array.isArray(response)) {
      // 각 챌린지의 결과를 개별적으로 조회
      const challengeResults = await Promise.allSettled(
        response.map(async (challenge) => {
          try {
            const result = await getChallengeResult(challenge.id);
            return {
              id: challenge.id,
              title: challenge.title || challenge.challengeName || "챌린지",
              status: getChallengeStatus(result?.resultType),
              resultType: result?.resultType,
              actualRewardPoint: result?.actualRewardPoint,
              savedAmount: result?.savedAmount,
            };
          } catch (error) {
            console.warn(`챌린지 ${challenge.id} 결과 조회 실패:`, error);
            return {
              id: challenge.id,
              title: challenge.title || challenge.challengeName || "챌린지",
              status: "미완료",
              resultType: null,
              actualRewardPoint: 0,
              savedAmount: 0,
            };
          }
        })
      );

      challengeHistory.value = challengeResults
        .filter((result) => result.status === "fulfilled")
        .map((result) => result.value)
        .filter((challenge) => challenge.status !== "미완료"); // 완료된 챌린지만 표시

      console.log("챌린지 히스토리 데이터 설정 완료:", challengeHistory.value);
    } else {
      console.warn("챌린지 히스토리 데이터가 배열이 아닙니다:", response);
      challengeError.value = "챌린지 히스토리 데이터 형식이 올바르지 않습니다.";
    }
  } catch (err) {
    console.error("챌린지 히스토리 조회 에러:", err);

    let errorMessage = "챌린지 히스토리를 불러오는데 실패했습니다.";

    if (err.response?.status === 401) {
      errorMessage = "로그인이 필요합니다.";
    } else if (err.response?.status === 404) {
      errorMessage = "챌린지 히스토리를 찾을 수 없습니다.";
    } else if (err.response?.status === 500) {
      errorMessage = "서버 오류가 발생했습니다.";
    } else if (err.message) {
      errorMessage = `연결 오류: ${err.message}`;
    }

    challengeError.value = errorMessage;
  } finally {
    challengeLoading.value = false;
  }
};

// 챌린지 결과 타입을 상태로 변환
const getChallengeStatus = (resultType) => {
  switch (resultType) {
    case "SUCCESS_WIN":
    case "SUCCESS_EQUAL":
      return "성공";
    case "FAIL":
      return "실패";
    default:
      return "미완료";
  }
};

// 퀴즈 히스토리 데이터 가져오기
const fetchQuizHistory = async () => {
  try {
    loading.value = true;
    error.value = null;

    // 인증 상태 확인
    if (!authStore.isAuthenticated) {
      console.warn("퀴즈 히스토리를 보려면 로그인이 필요합니다.");
      error.value = "퀴즈 히스토리를 보려면 로그인이 필요합니다.";
      loading.value = false;
      return;
    }

    console.log("퀴즈 히스토리 데이터 가져오기 시작");
    const response = await getQuizHistoryList();
    console.log("받아온 퀴즈 히스토리 데이터:", response);
    console.log("response.data:", response.data);
    console.log("response.data.status:", response.data?.status);
    console.log("response.data.data:", response.data?.data);

    // API 응답 구조에 따른 데이터 추출
    let quizData;

    // 구조 1: { status: 0, message: "...", data: [...] }
    if (response.data && response.data.status === 0 && response.data.data) {
      quizData = response.data.data;
    }
    // 구조 2: { status: 200, data: [...] } (기존 호환성)
    else if (
      response.data &&
      response.data.status === 200 &&
      response.data.data
    ) {
      quizData = response.data.data;
    }
    // 구조 3: 직접 배열로 응답하는 경우
    else if (response.data && Array.isArray(response.data)) {
      quizData = response.data;
    }
    // 구조 4: response 자체가 데이터인 경우
    else if (response && Array.isArray(response)) {
      quizData = response;
    } else {
      console.warn("퀴즈 히스토리 데이터 형식이 올바르지 않습니다:", response);
      error.value = "퀴즈 히스토리 데이터를 가져오는데 실패했습니다.";
      return;
    }

    // 데이터 유효성 검사 및 ID 필드 확인
    if (Array.isArray(quizData)) {
      quizHistory.value = quizData.map((quiz) => {
        // historyId를 id로 매핑하고, 다른 ID 필드들도 확인
        const quizId = quiz.historyId || quiz.id || quiz.quizId || quiz.quiz_id;

        if (!quizId) {
          console.warn("퀴즈 항목에 ID가 없습니다:", quiz);
          return {
            ...quiz,
            id: `temp_${Date.now()}_${Math.random()}`, // 임시 ID
            _hasNoId: true, // ID가 없음을 표시
          };
        }

        // historyId를 id로 매핑하여 일관성 유지
        return {
          ...quiz,
          id: quizId,
          historyId: quizId, // 원본 필드도 유지
        };
      });
      console.log("퀴즈 히스토리 데이터 설정 완료:", quizHistory.value);
      console.log("첫 번째 퀴즈 항목 예시:", quizHistory.value[0]);
      console.log("퀴즈 항목 개수:", quizHistory.value.length);
    } else {
      console.warn("퀴즈 히스토리 데이터가 배열이 아닙니다:", quizData);
      error.value = "퀴즈 히스토리 데이터 형식이 올바르지 않습니다.";
    }
  } catch (err) {
    console.error("퀴즈 히스토리 조회 에러:", err);

    let errorMessage = "퀴즈 히스토리를 불러오는데 실패했습니다.";

    if (err.response?.status === 401) {
      errorMessage = "로그인이 필요합니다.";
    } else if (err.response?.status === 404) {
      errorMessage = "퀴즈 히스토리를 찾을 수 없습니다.";
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

// 퀴즈 상세 정보 가져오기
const fetchQuizDetail = async (quizId) => {
  try {
    if (!quizId || quizId === "undefined" || quizId === "null") {
      console.error("유효하지 않은 quizId:", quizId);
      error.value = "유효하지 않은 퀴즈 ID입니다.";
      return;
    }

    console.log("퀴즈 상세 정보 가져오기 시작, quizId:", quizId);
    const response = await getQuizHistoryDetail(quizId);
    console.log("받아온 퀴즈 상세 데이터:", response);

    let quizDetailData;

    // (주의) getQuizHistoryDetail이 res.data를 반환한다면 response.data는 없을 수 있음

    if (response?.data && response.data?.data) {
      // 응답이 {status, data} 형태인 경우
      quizDetailData = response.data.data;
    } else if (response?.data && typeof response.data === "object") {
      // 응답이 { ... } 객체인 경우
      quizDetailData = response.data;
    } else if (response && typeof response === "object") {
      // getQuizHistoryDetail이 이미 res.data를 반환하는 경우
      quizDetailData = response;
    }

    if (!quizDetailData) {
      console.warn("퀴즈 상세 데이터가 비어있습니다:", response);
      error.value = "퀴즈 상세 정보를 가져오는데 실패했습니다.";
      return;
    }

    // 필드 정규화(안전 매핑)
    const normalized = {
      id:
        quizDetailData.id ??
        quizDetailData.historyId ??
        quizDetailData.quizId ??
        quizDetailData.quiz_id ??
        null,
      question:
        quizDetailData.data?.question ??
        quizDetailData.question ??
        quizDetailData.title ??
        "",
      answer:
        quizDetailData.answer ??
        quizDetailData.correctAnswer ??
        quizDetailData.ox ??
        "",
      isCorrect: quizDetailData.isCorrect ?? quizDetailData.correct ?? false,
      explanation:
        quizDetailData.explanation ??
        quizDetailData.data.message ??
        quizDetailData.detail ??
        quizDetailData.message ??
        "",
    };

    // 모달에 이미 있는 값(사용자 답 등)은 유지하고 서버 상세로 덮어쓰기
    selectedQuiz.value = { ...(selectedQuiz.value || {}), ...normalized };

    console.log("퀴즈 상세 데이터 설정 완료:", selectedQuiz.value);
  } catch (err) {
    console.error("퀴즈 상세 조회 에러:", err);
    let errorMessage = "퀴즈 상세 정보를 불러오는데 실패했습니다.";
    if (err.response?.status === 400) errorMessage = "잘못된 퀴즈 ID입니다.";
    else if (err.response?.status === 404)
      errorMessage = "퀴즈를 찾을 수 없습니다.";
    else if (err.response?.status === 500)
      errorMessage = "서버 오류가 발생했습니다.";
    error.value = errorMessage;
  }
};

// 퀴즈 선택 시 상세 정보 가져오기
const selectQuiz = async (quiz) => {
  console.log("퀴즈 선택:", quiz);

  // historyId를 우선적으로 사용하고, 다른 ID 필드들도 확인
  const quizId = quiz.historyId || quiz.id || quiz.quizId || quiz.quiz_id;

  if (!quizId) {
    console.error("퀴즈 ID를 찾을 수 없습니다:", quiz);
    error.value = "퀴즈 ID를 찾을 수 없습니다.";
    return;
  }

  console.log("사용할 quizId:", quizId);

  // 사용자가 선택한 답을 저장 (isCorrect를 기반으로 추정)
  // isCorrect가 true이면 정답을 선택한 것이고, false이면 오답을 선택한 것
  // 실제 정답은 quiz.answer에서 확인 가능
  let userAnswer = "";
  if (quiz.isCorrect) {
    // 정답을 선택했다면, quiz.answer가 사용자가 선택한 답
    userAnswer = quiz.answer;
  } else {
    // 오답을 선택했다면, quiz.answer와 다른 답을 선택한 것
    userAnswer = quiz.answer === "O" ? "X" : "O";
  }

  // 선택된 퀴즈 정보를 모달에 전달
  selectedQuiz.value = {
    ...quiz,
    userAnswer: userAnswer, // 사용자가 선택한 답 추가
    // explanation: await fetchQuizDetail(quizId),
  };

  showModal.value = true;
  await fetchQuizDetail(quizId); // 내부에서 selectedQuiz를 덮어씁니다
};

// 모달 닫기
const closeModal = () => {
  showModal.value = false;
  selectedQuiz.value = null;
};

// 탭 전환 함수들
const switchToChallengeTab = () => {
  activeTab.value = "challenge";
  if (challengeHistory.value.length === 0 && !challengeLoading.value) {
    fetchChallengeHistory();
  }
};

const switchToQuizTab = () => {
  activeTab.value = "quiz";
  if (quizHistory.value.length === 0 && !loading.value) {
    fetchQuizHistory();
  }
};

// 뒤로가기
const goBack = () => {
  router.go(-1);
};

// 컴포넌트 마운트 시 히스토리 데이터 가져오기
onMounted(() => {
  fetchQuizHistory();
  fetchChallengeHistory();
});
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
  min-width: 0;
  overflow: hidden;
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
  max-width: calc(100% - 60px);
  min-width: 0;
  word-break: keep-all;
  padding-right: 8px;
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

.quiz-list-header-title {
  flex: 1;
  text-align: left;
}

.quiz-list-header-status {
  width: 60px;
  text-align: center;
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
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 14px;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 48px;
  height: 48px;
  min-width: 0;
  overflow: hidden;
}

.quiz-item:hover {
  background: #f9f9f9;
}

.quiz-item:hover {
  background: #f9f9f9;
}

.quiz-item:last-child {
  border-bottom: none;
}

.question-text {
  flex: 1;
  font-size: 14px;
  color: #333;
  font-weight: 400;
  text-align: left;
  padding-right: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
  word-break: keep-all;
  max-width: calc(100% - 60px);
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
  width: 200px;
  height: 28px;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  color: #6b7280;
  border: 1px solid #e5e7eb;
  flex-shrink: 0;
}

.quiz-result i {
  font-size: 20px;
  margin-top: 2px;
}

.result-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

.quiz-result.correct .result-icon {
  background: rgba(34, 197, 94, 0.2);
}

.quiz-result.wrong .result-icon {
  background: rgba(239, 68, 68, 0.2);
}

.result-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.result-title {
  font-weight: 700;
  margin-bottom: 4px;
  font-size: 16px;
  text-align: center;
}

.result-desc {
  font-size: 14px;
  line-height: 1.4;
  opacity: 0.9;
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

.quiz-result.correct {
  background: #e8f5e8;
  color: #22c55e;
  border-color: #bbf7d0;
}

.quiz-result.wrong {
  background: #ffebee;
  color: #e11d48;
  border-color: #fecaca;
}

/* 퀴즈 모달 스타일 */
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
  margin-bottom: 32px;
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
  align-items: center;
  justify-content: center;
  gap: 16px;
  animation: slideIn 0.4s ease-out;
  position: relative;
  overflow: hidden;
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

.quiz-explanation-section {
  width: 100%;
  background: #f8fafc;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
}

.explanation-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
}

.explanation-content {
  color: #6b7280;
  line-height: 1.5;
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

/* 로딩 상태 스타일 */
.loading-state {
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
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 40px 20px;
  color: #ef4444;
  font-size: 15px;
  text-align: center;
}

.error-state i {
  font-size: 32px;
  color: #ef4444;
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
  transition: background 0.2s;
}

.retry-btn:hover {
  background: #3730a3;
}

/* 빈 상태 스타일 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 40px 20px;
  color: #666;
  font-size: 15px;
  text-align: center;
}

.empty-state i {
  font-size: 48px;
  color: #d1d5db;
}

/* 퀴즈 히스토리 스타일 */
.history-content {
  padding: 20px;
}

.history-section h3 {
  font-size: 18px;
  font-weight: 600;
  color: #222;
  margin-bottom: 20px;
}

.quiz-list {
  background: #fff;
  border: 1px solid #ececec;
  border-radius: 12px;
  overflow: hidden;
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
  transition: all 0.2s;
  position: relative;
  min-width: 0;
  overflow: hidden;
}

.quiz-item:last-child {
  border-bottom: none;
}

.quiz-item.no-id {
  opacity: 0.7;
  cursor: not-allowed;
}

.quiz-item.no-id:hover {
  transform: none;
  box-shadow: none;
}

.quiz-warning {
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

.quiz-item:hover {
  background: #f9f9f9;
}

.quiz-title {
  flex: 1;
  font-size: 15px;
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

.quiz-status {
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

.quiz-status.correct {
  color: #22c55e;
  background: #e8f5e8;
}

.quiz-status.wrong {
  color: #e11d48;
  background: #ffebee;
}
</style>
