<template>
  <div class="home-container">
    <main class="main-content">
      <!-- pixel clouds -->
      <div class="pixel-cloud cloud-1"></div>
      <div class="pixel-cloud cloud-2"></div>
      <!-- 캐릭터 말풍선 -->
      <div class="quiz-bubble">
        <img :src="textballonImage" class="textballon-img" alt="말풍선" />
        <div class="quiz-text">
          <span v-if="loadingBubble" class="loading-text">로딩 중...</span>
          <span v-else-if="bubbleError" class="error-text">{{
            bubbleError
          }}</span>
          <span v-else>{{ bubbleText }}</span>
        </div>
      </div>

      <!-- 아바타 섹션 -->
      <div class="avatar-section">
        <div class="avatar-pixel">
          <img :src="baseAvatar" class="avatar-img" alt="아바타" />
          <img
            v-if="getTitleImage"
            :src="getTitleImage"
            class="title-img"
            alt="칭호"
          />
          <img
            v-if="getShirtImage"
            :src="getShirtImage"
            class="shirt-img"
            alt="상의"
          />
          <img
            v-if="getShoesImage"
            :src="getShoesImage"
            class="shoes-img"
            alt="신발"
          />
          <!-- 여러 액세서리를 동시에 표시 -->
          <img
            v-for="(image, index) in getGlassesImages"
            :key="index"
            :src="image"
            class="glasses-img"
            alt="액세서리"
          />
        </div>
      </div>

      <!-- 누적 포인트 막대 -->
      <div class="points-progress">
        <div class="level-info">
          <div class="level-display">
            <span class="level-number">Lv {{ getCurrentLevel }}.</span>
            <span class="level-title">{{ getCurrentLevelTitle }}</span>
          </div>
          <div class="next-level-info">
            <span v-if="loadingCumulative" class="loading-text"
              >로딩 중...</span
            >
            <span v-else-if="cumulativeError" class="error-text">-</span>
            <span v-else
              >{{ getNextLevelTitle }}까지 {{ getProgressPercentage }}%</span
            >
          </div>
        </div>
        <div class="progress-bar-container">
          <div class="progress-bar">
            <div v-if="loadingCumulative" class="progress-fill loading"></div>
            <div
              v-else-if="cumulativeError"
              class="progress-fill error"
              :style="{ width: '0%' }"
            ></div>
            <div
              v-else
              class="progress-fill"
              :style="{ width: getProgressPercentage + '%' }"
            ></div>

            <!-- 포인트 정보를 경험치 바 안에 표시 -->
            <div class="points-display-inside">
              <span v-if="loadingCumulative" class="loading-text"
                >로딩 중...</span
              >
              <span v-else-if="cumulativeError" class="error-text">-</span>
              <span v-else>
                <span class="current-points">{{
                  formatNumber(totalEarnedPoints)
                }}</span>
                <span class="separator">/</span>
                <span class="target-points">{{
                  formatNumber(getTargetPoints)
                }}</span>
              </span>
            </div>
          </div>
        </div>

        <!-- 포인트 정보 표시 (기존 위치는 숨김) -->
        <div class="points-info" style="display: none">
          <div class="points-display">
            <span v-if="loadingCumulative" class="loading-text"
              >로딩 중...</span
            >
            <span v-else-if="cumulativeError" class="error-text">-</span>
            <span v-else>
              <span class="current-points">{{
                formatNumber(totalEarnedPoints)
              }}</span>
              <span class="separator">/</span>
              <span class="target-points">{{
                formatNumber(getTargetPoints)
              }}</span>
            </span>
          </div>
          <div class="points-status">
            <span v-if="loadingCumulative" class="loading-text"
              >포인트 정보 로딩 중...</span
            >
            <span v-else-if="cumulativeError" class="error-text"
              >포인트 정보를 불러올 수 없습니다</span
            >
            <span v-else-if="getCurrentLevel >= 4" class="status-complete"
              >🎉 모든 레벨 달성!</span
            >
          </div>
        </div>
      </div>

      <!-- 오른쪽 플로팅 버튼 그룹 -->
      <div class="floating-btn-group">
        <button class="floating-btn" @click="openQuiz">
          <i class="fa-solid fa-lightbulb"></i>
        </button>
        <button class="floating-btn">
          <i class="fas fa-envelope" @click="openNewsletter"></i>
        </button>
        <button class="floating-btn" @click="goToAvatarShop">
          <i class="fa-solid fa-store"></i>
        </button>
      </div>
    </main>

    <Quiz v-if="showQuiz" @close="closeQuiz" />
    <Newsletter v-if="showNewsletter" @close="closeNewsletter" />
    <WelcomePointModal v-if="showWelcomeModal" @close="closeWelcomeModal" />
  </div>
</template>

<script setup>
import Quiz from './Quiz.vue';
import Newsletter from './Newsletter.vue';
import WelcomePointModal from '@/components/WelcomePointModal.vue';
import { ref, computed } from 'vue';
import { useAvatarStore } from '../../stores/avatar.js';
import { getCumulativeCoin, getMyCoinStatus } from '@/api/mypage/avatar';
import { getAvatarStatus, getClothes } from '@/api/mypage/avatar/avatarApi.js';
import { getBubbleText } from '@/api/home/bubbleApi';
import { useAuthStore } from '@/stores/auth';
import baseAvatar from '../mypage/avatar/avatarimg/avatar-base.png';
import textballonImage from './homeimg/textballon.png';
// import bubbleApi from "@/api/home/bubbleApi.js";
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';

const router = useRouter();

const showQuiz = ref(false);
const showNewsletter = ref(false);
const showWelcomeModal = ref(false);

// 누적 포인트 API 상태 관리
const loadingCumulative = ref(false);
const cumulativeError = ref(null);

// 말풍선 텍스트 상태 관리
const bubbleText = ref('오늘의 퀴즈를 풀어보세요.');
const loadingBubble = ref(false);
const bubbleError = ref(null);

function openQuiz() {
  showQuiz.value = true;
}
function closeQuiz() {
  showQuiz.value = false;
  // 퀴즈가 닫힐 때 누적 포인트를 다시 가져와서 업데이트
  fetchCumulativePoints();
}
function openNewsletter() {
  showNewsletter.value = true;
}
function closeNewsletter() {
  showNewsletter.value = false;
}

function closeWelcomeModal() {
  showWelcomeModal.value = false;
}

function goToAvatarShop() {
  router.push('/avatar-shop');
}

const avatarStore = useAvatarStore();
const authStore = useAuthStore();

// 아바타 상태 관리 (AvatarShop2.vue와 동일한 방식)
const avatarItems = ref([]); // API에서 받아온 모든 아이템 데이터
const avatar = ref(null); // 아바타 데이터를 저장할 변수

// S3 URL을 HTTPS URL로 변환하는 함수
const convertS3Url = (s3Url) => {
  if (!s3Url) return '';
  if (s3Url.startsWith('s3://')) {
    return s3Url.replace(
      's3://finpickbucket/',
      'https://finpickbucket.s3.ap-northeast-2.amazonaws.com/'
    );
  }
  return s3Url;
};

// 착용 중인 아이템 확인 (AvatarShop2.vue와 동일한 방식)
const wearingTitle = computed(() => {
  const item = avatarItems.value.find(
    (item) => item.type === 'level' && item.wearing
  );
  return item ? item.itemId : null;
});

const wearingShirt = computed(() => {
  const item = avatarItems.value.find(
    (item) => item.type === 'top' && item.wearing
  );
  return item ? item.itemId : null;
});

const wearingShoes = computed(() => {
  const item = avatarItems.value.find(
    (item) => item.type === 'shoes' && item.wearing
  );
  return item ? item.itemId : null;
});

const wearingGlasses = computed(() => {
  const items = avatarItems.value.filter(
    (item) => item.type === 'accessory' && item.wearing
  );
  return items.map((item) => item.itemId);
});

// 착용 중인 아이템 이미지 가져오기 (AvatarShop2.vue와 동일한 방식)
const getTitleImage = computed(() => {
  const item = avatarItems.value.find(
    (item) => item.type === 'level' && item.wearing
  );
  return item ? convertS3Url(item.imageUrl) : null;
});

const getShirtImage = computed(() => {
  const item = avatarItems.value.find(
    (item) => item.type === 'top' && item.wearing
  );
  return item ? convertS3Url(item.imageUrl) : null;
});

const getShoesImage = computed(() => {
  const item = avatarItems.value.find(
    (item) => item.type === 'shoes' && item.wearing
  );
  return item ? convertS3Url(item.imageUrl) : null;
});

const getGlassesImages = computed(() => {
  const items = avatarItems.value.filter(
    (item) => item.type === 'accessory' && item.wearing
  );
  return items.map((item) => convertS3Url(item.imageUrl));
});

// 누적 포인트 관련 computed 속성들
const totalEarnedPoints = computed(() => {
  const points = avatarStore.cumulativePoints || 0;
  console.log(
    'totalEarnedPoints 계산:',
    points,
    'avatarStore.cumulativePoints:',
    avatarStore.cumulativePoints
  );
  return points;
});

// 아바타 상태 조회 (AvatarShop2.vue와 동일한 방식)
const fetchAvatarAndItemData = async () => {
  try {
    console.log('아바타 데이터 조회 시작');

    // 아바타 상태 조회
    const avatarResponse = await getAvatarStatus();
    console.log('아바타 상태 응답:', avatarResponse);

    if (avatarResponse.data && avatarResponse.data.data) {
      avatar.value = avatarResponse.data.data;
      console.log('아바타 상태 저장:', avatar.value);
    }

    // 모든 아이템 조회
    const itemsResponse = await getClothes();
    console.log('아이템 목록 응답:', itemsResponse);

    if (itemsResponse.data && itemsResponse.data.data) {
      const allItems = itemsResponse.data.data;

      // 착용 상태 설정
      const itemsWithWearingStatus = allItems.map((item) => ({
        ...item,
        wearing: false, // 기본값은 착용하지 않음
      }));

      // 아바타 상태에 따라 착용 상태 설정
      if (avatar.value) {
        if (avatar.value.levelId) {
          const levelItem = itemsWithWearingStatus.find(
            (item) => item.itemId === avatar.value.levelId
          );
          if (levelItem) levelItem.wearing = true;
        }
        if (avatar.value.topId) {
          const topItem = itemsWithWearingStatus.find(
            (item) => item.itemId === avatar.value.topId
          );
          if (topItem) topItem.wearing = true;
        }
        if (avatar.value.shoesId) {
          const shoesItem = itemsWithWearingStatus.find(
            (item) => item.itemId === avatar.value.shoesId
          );
          if (shoesItem) shoesItem.wearing = true;
        }
        if (avatar.value.accessoryId) {
          const accessoryItem = itemsWithWearingStatus.find(
            (item) => item.itemId === avatar.value.accessoryId
          );
          if (accessoryItem) accessoryItem.wearing = true;
        }
      }

      avatarItems.value = itemsWithWearingStatus;
      console.log('아이템 목록 저장:', avatarItems.value);
    }
  } catch (error) {
    console.error('아바타 데이터 조회 실패:', error);
  }
};

// 누적 포인트 데이터 가져오기 (새로운 코인 상태 API 사용)
const fetchCumulativePoints = async () => {
  try {
    loadingCumulative.value = true;
    cumulativeError.value = null;

    // 인증 상태 확인
    if (!authStore.isAuthenticated) {
      console.warn('로그인이 필요합니다.');
      return;
    }

    console.log('Home 누적 포인트 데이터 가져오기 시작 (새로운 API 사용)');
    console.log('인증 상태:', authStore.isAuthenticated);
    console.log('사용자 정보:', authStore.user);

    const response = await getMyCoinStatus();
    console.log('받아온 코인 상태 데이터:', response);

    if (
      response.status === 200 &&
      response.data &&
      response.data.status === 200
    ) {
      const coinData = response.data.data;
      if (coinData && typeof coinData.cumulativeAmount === 'number') {
        avatarStore.setCumulativePoints(coinData.cumulativeAmount);
        console.log(
          'Home 누적 포인트 업데이트 완료:',
          coinData.cumulativeAmount
        );
      } else {
        console.warn('유효한 누적 포인트 값을 찾을 수 없습니다:', response);
        cumulativeError.value = '누적 포인트 데이터를 가져오는데 실패했습니다.';
      }
    } else {
      console.warn('코인 상태 데이터 형식이 올바르지 않습니다:', response);
      cumulativeError.value = '누적 포인트 데이터를 가져오는데 실패했습니다.';
    }
  } catch (err) {
    console.error('Home 누적 포인트 조회 에러:', err);

    let errorMessage = '누적 포인트를 불러오는데 실패했습니다.';

    if (err.response?.status === 401) {
      errorMessage = '로그인이 필요합니다.';
    } else if (err.response?.status === 404) {
      errorMessage = '사용자 정보를 찾을 수 없습니다.';
    } else if (err.response?.status === 500) {
      errorMessage = '서버 오류가 발생했습니다.';
    } else if (err.message) {
      errorMessage = `연결 오류: ${err.message}`;
    }

    cumulativeError.value = errorMessage;
  } finally {
    loadingCumulative.value = false;
  }
};

// 말풍선 텍스트 가져오기
const fetchBubbleText = async () => {
  try {
    loadingBubble.value = true;
    bubbleError.value = null;

    const response = await getBubbleText();

    // 응답 데이터가 존재하는지 먼저 확인
    if (response && response.data.message) {
      let textValue;

      // 백엔드 응답이 `{"message": "텍스트"}` 형태일 경우
      if (typeof response.data.message === 'string') {
        textValue = response.data.data.message;
      }
      // 백엔드 응답이 `{"data": "텍스트"}` 형태일 경우
      else if (typeof response.data.data.message === 'string') {
        textValue = response.data.data.message;
      }
      // 백엔드 응답이 ` "텍스트" ` 형태일 경우
      else if (typeof response.data.message === 'string') {
        textValue = response.data.data.message;
      }

      if (textValue) {
        bubbleText.value = textValue;
        console.log('말풍선 텍스트 업데이트 완료:', textValue);
      } else {
        console.warn('유효한 말풍선 텍스트를 찾을 수 없습니다.');
        bubbleText.value = '오늘의 퀴즈를 풀어보세요.';
      }
    } else {
      console.warn('말풍선 텍스트 데이터가 없습니다.');
      bubbleText.value = '오늘의 퀴즈를 풀어보세요.';
    }
  } catch (err) {
    console.error('말풍선 텍스트 조회 에러:', err);
    bubbleError.value = '말풍선 텍스트를 불러오는데 실패했습니다.';
  } finally {
    loadingBubble.value = false;
  }
};

const progressPercentage = computed(() => {
  const current = totalEarnedPoints.value;
  if (current >= 60000) return 100;
  if (current >= 40000) return 75;
  if (current >= 20000) return 50;
  return 25;
});

const nextTargetPoints = computed(() => {
  const current = totalEarnedPoints.value;
  if (current >= 60000) return '완료!';
  if (current >= 40000) return '60,000';
  if (current >= 20000) return '40,000';
  return '20,000';
});

// 컴포넌트 마운트 시 저장된 아바타 정보 불러오기
onMounted(() => {
  fetchAvatarAndItemData(); // 아바타 데이터 조회 (AvatarShop2.vue와 동일한 방식)
  fetchCumulativePoints(); // 컴포넌트 마운트 시 누적 포인트 데이터 가져오기
  fetchBubbleText(); // 컴포넌트 마운트 시 말풍선 텍스트 가져오기

  // 회원가입 후 첫 방문 확인
  checkFirstVisit();
});

// 회원가입 후 첫 방문 확인 함수
const checkFirstVisit = () => {
  // URL 쿼리 파라미터에서 투자성향 분석 완료 여부 확인
  const urlParams = new URLSearchParams(window.location.search);
  const fromProfileComplete = urlParams.get('from') === 'profile-complete';

  // 로컬 스토리지에서 첫 방문 여부 확인
  const hasVisited = localStorage.getItem('hasVisitedHome');

  // 투자성향 분석 완료 후 홈으로 이동하거나, 첫 방문인 경우 모달 표시
  if ((fromProfileComplete || !hasVisited) && authStore.isAuthenticated) {
    // 모달 표시
    showWelcomeModal.value = true;

    // 로컬 스토리지에 방문 기록 저장
    localStorage.setItem('hasVisitedHome', 'true');

    // URL에서 쿼리 파라미터 제거
    if (fromProfileComplete) {
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }

    // 여기서 실제 포인트 지급 API 호출
    // giveWelcomePoints();
  }
};

// 가입 축하 포인트 지급 함수 (실제 API 연동 시 사용)
const giveWelcomePoints = async () => {
  try {
    // TODO: 실제 포인트 지급 API 호출
    // const response = await giveWelcomeBonus();
    console.log('가입 축하 포인트 지급 완료');
  } catch (error) {
    console.error('포인트 지급 실패:', error);
  }
};

// 목표 포인트 계산
const getTargetPoints = computed(() => {
  const current = totalEarnedPoints.value;
  if (current >= 60000) return 60000;
  if (current >= 40000) return 60000;
  if (current >= 20000) return 40000;
  return 20000;
});

// 숫자 포맷팅 함수
function formatNumber(num) {
  return num.toLocaleString();
}

// 진행 상태 메시지 함수
function getProgressMessage() {
  const current = totalEarnedPoints.value;
  if (current >= 60000) return '🎉 모든 목표 달성!';
  if (current >= 40000) return '🔥 40,000P 달성!';
  if (current >= 20000) return '💪 20,000P 달성!';
  return '🚀 목표 달성 중...';
}

// 현재 레벨 계산
const getCurrentLevel = computed(() => {
  const points = totalEarnedPoints.value;
  if (points >= 60000) return 4;
  if (points >= 40000) return 3;
  if (points >= 20000) return 2;
  return 1;
});

// 현재 레벨 제목
const getCurrentLevelTitle = computed(() => {
  const points = totalEarnedPoints.value;
  if (points >= 60000) return '금융도사';
  if (points >= 40000) return '금융법사';
  if (points >= 20000) return '금융견습';
  return '금융새싹';
});

// 다음 레벨 제목
const getNextLevelTitle = computed(() => {
  const points = totalEarnedPoints.value;
  if (points >= 60000) return '완료';
  if (points >= 40000) return '금융도사';
  if (points >= 20000) return '금융법사';
  return '금융견습';
});

// 진행률 계산 (현재 레벨 내에서의 진행률)
const getProgressPercentage = computed(() => {
  const current = totalEarnedPoints.value;
  console.log('진행률 계산 - 현재 포인트:', current);

  if (current >= 60000) {
    console.log('진행률: 100% (최고 레벨)');
    return 100;
  }
  if (current >= 40000) {
    // 40000-59999 구간에서 0-100%
    const percentage = Math.min(
      100,
      Math.round(((current - 40000) / 20000) * 100)
    );
    console.log('진행률 계산 (40000-59999):', percentage + '%');
    return percentage;
  }
  if (current >= 20000) {
    // 20000-39999 구간에서 0-100%
    const percentage = Math.min(
      100,
      Math.round(((current - 20000) / 20000) * 100)
    );
    console.log('진행률 계산 (20000-39999):', percentage + '%');
    return percentage;
  }
  // 0-19999 구간에서 0-100%
  const percentage = Math.min(100, Math.round((current / 20000) * 100));
  console.log('진행률 계산 (0-19999):', percentage + '%');
  console.log('상세 계산:', {
    current: current,
    division: current / 20000,
    percentage: (current / 20000) * 100,
    rounded: Math.round((current / 20000) * 100),
  });
  return percentage;
});
</script>

<style scoped>
/* 전역 스크롤 차단 */
:global(body) {
  overflow: hidden !important;
  height: 100vh !important;
}

:global(html) {
  overflow: hidden !important;
  height: 100vh !important;
}

.home-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 390px;
  margin: 0 auto;
  overflow: hidden;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
}

.main-content {
  width: 100%;
  max-width: 390px;
  margin: 0 auto;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 20px 0;
  overflow: hidden;
}

/* 캐릭터 뒤에 스카이-블루(하늘) + 그린(잔디) 배경 */
.main-content::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(#b3e5fc 0% 70%, #77b255 70% 100%);
  z-index: 0;
}

/* 내부 컨텐츠가 배경보다 위에 표시되도록 */
.main-content > * {
  position: relative;
  z-index: 1;
}

.quiz-bubble {
  position: relative;
  display: inline-block;
  margin: 0 auto 10px auto;
  text-align: center;
}

.textballon-img {
  width: 330px;
  height: calc(100% - 30px);
  display: block;
}

.quiz-text {
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #000000;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  white-space: nowrap;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.main-card {
  width: 260px;
  height: 260px;
  background: #d1d5db;
  border-radius: 12px;
  margin: 0 auto 16px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin: 0;
}

.avatar-pixel {
  position: relative;
  width: 230px;
  height: 359px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-img {
  width: 230px;
  height: 359px;
  z-index: 1;
}

.title-img,
.shirt-img,
.shoes-img,
.glasses-img {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 230px;
  height: 359px;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.title-img {
  z-index: 2;
}

.shirt-img {
  z-index: 2;
}

.shoes-img {
  z-index: 2;
}

.glasses-img {
  z-index: 3;
}

.floating-btn-group {
  position: absolute;
  top: 350px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  z-index: 2;
}

.floating-btn {
  width: 48px;
  height: 48px;
  background: #4318d1;
  color: #fff;
  border: none;
  border-radius: 12px;
  box-shadow: 0 2px 8px #0002;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  transition: background 0.2s;
  cursor: pointer;
}

.floating-btn:hover {
  background: #6c4cf1;
}

.points-progress {
  width: 340px;
  background: transparent;
  margin-top: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.level-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 8px;
}

.level-display {
  display: flex;
  align-items: baseline;
}

.level-number {
  font-size: 18px;
  font-weight: 700;
  color: #4318d1;
}

.level-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin-left: 4px;
}

.next-level-info {
  font-size: 14px;
  color: #1e293b;
  font-weight: 500;
}

.progress-bar-container {
  width: 100%;
  display: flex;
  align-items: center;
  margin-top: 6px;
}

.progress-bar {
  flex: 1;
  height: 24px;
  background: #f1f5f9;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: #4318d1;
  border-radius: 12px;
  transition: width 0.4s ease;
}

.progress-fill.loading {
  background: linear-gradient(90deg, #4318d1 0%, #6366f1 50%, #4318d1 100%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

.progress-fill.error {
  background: #ef4444;
}

.loading-text {
  color: #6366f1;
  font-weight: 600;
}

.error-text {
  color: #ef4444;
  font-weight: 600;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.points-info {
  width: 100%;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #e2e8f0;
}

.points-display {
  display: flex;
  align-items: baseline;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
}

.points-display-inside {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  color: #ffffff;
  z-index: 10;
  white-space: nowrap;
}

.current-points {
  color: #000000;
  font-size: 28px;
}

.points-display-inside .current-points {
  color: #000000;
  font-size: 15px;
  font-weight: 800;
}

.separator {
  margin: 0 8px;
  color: #64748b;
  font-weight: 500;
}

.points-display-inside .separator {
  margin: 0 2px;
  color: #ffffff;
  font-weight: 800;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.9);
}

.target-points {
  color: #3700ff;
  font-size: 28px;
  font-weight: 600;
}

.points-display-inside .target-points {
  color: #1900ff;
  font-size: 14px;
  font-weight: 800;
}

.points-status {
  font-size: 13px;
  color: #64748b;
  text-align: center;
  width: 100%;
  font-weight: 500;
}

.status-complete {
  color: #059669;
  font-weight: 600;
}

.status-progress {
  color: #64748b;
}

.pixel-cloud {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #ffffff;
  box-shadow: 8px 0 #ffffff, 16px 0 #ffffff, -8px 8px #ffffff, 0 8px #ffffff,
    8px 8px #ffffff, 16px 8px #ffffff, 24px 8px #ffffff, -8px 16px #ffffff,
    0 16px #ffffff, 8px 16px #ffffff, 16px 16px #ffffff, 0 24px #ffffff,
    8px 24px #ffffff;
  transform: scale(4);
  transform-origin: top left;
  image-rendering: pixelated;
  z-index: 0;
  pointer-events: none;
}

.cloud-1 {
  top: 40px;
  left: 30px;
}

.cloud-2 {
  top: 100px;
  right: 40px;
}
</style>
