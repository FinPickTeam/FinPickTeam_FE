<template>
  <div class="home-container">
    <main class="main-content">
      <!-- pixel clouds -->
      <div class="pixel-cloud cloud-1"></div>
      <div class="pixel-cloud cloud-2"></div>

      <!-- 상단 퀴즈 말풍선 -->
      <div class="quiz-bubble">
        <img :src="textballonImage" class="textballon-img" alt="말풍선" />
        <div class="quiz-text">
          <span v-if="loadingBubble" class="loading-text">로딩 중...</span>
          <span v-else-if="bubbleError" class="error-text">{{ bubbleError }}</span>
          <span v-else>{{ bubbleText }}</span>
        </div>
      </div>

      <!-- 아바타 섹션 -->
      <div class="avatar-section">
        <div class="avatar-pixel">
          <img :src="baseAvatar" class="avatar-img" alt="아바타" />
          <img v-if="getTitleImage" :src="getTitleImage" class="title-img" alt="칭호" />
          <img v-if="getShirtImage" :src="getShirtImage" class="shirt-img" alt="상의" />
          <img v-if="getShoesImage" :src="getShoesImage" class="shoes-img" alt="신발" />
          <img v-for="(image, index) in getGlassesImages" :key="index" :src="image" class="glasses-img" alt="액세서리" />

          <!-- 미확인 결과: 좌상단 플로팅 작은 느낌표 + 더 예쁜 말풍선 (앞으로 노출) -->
          <button
              v-if="hasUnconfirmedResults"
              class="result-fab"
              title="미확인 결과 있음"
              @click="showResultTip = !showResultTip"
          >!</button>

          <div
              v-if="hasUnconfirmedResults && showResultTip"
              class="result-fab-bubble"
              @click="goToChallengeResult"
          >
            <span class="bubble-title">결과 확인 필요</span>
            <span class="bubble-text">확인하면 보상 포인트가 지급돼요</span>
          </div>
        </div>
      </div>

      <!-- 누적 포인트 카드 -->
      <div class="meter-card">
        <div class="meter-top">
          <div class="level-chip" :class="chipClass">
            <span class="level-dot"></span>
            {{ getCurrentLevelTitle }}
          </div>

          <div class="next-remaining">
            <span class="label">레벨업까지</span>
            <span class="value">{{ formatNumber(remainingPoints) }}P ⛧彡</span>
          </div>
        </div>

        <!-- ▶ 트랙: 완전 불투명 파스텔, 채움: 진한 그라데이션 -->
        <div class="meter-track" :class="{ 'is-loading': loadingCumulative, 'is-error': cumulativeError }">
          <div
              class="meter-fill"
              :style="{ width: (loadingCumulative || cumulativeError) ? '0%' : getProgressPercentage + '%' }"
          ></div>
          <div
              class="meter-handle"
              :style="{ left: (loadingCumulative || cumulativeError) ? '0%' : `calc(${getProgressPercentage}% - 10px)` }"
              aria-hidden="true"
          ></div>

          <!-- 세그먼트 마커 -->
          <div class="tick" style="left: 33.333%"><span>20k</span></div>
          <div class="tick" style="left: 66.666%"><span>40k</span></div>
          <div class="tick" style="left: 100%"><span>60k</span></div>
        </div>

        <!-- 게이지 아래: 현재/목표 -->
        <div class="points-below">
          <span v-if="loadingCumulative" class="skeleton skeleton-text"></span>
          <span v-else-if="cumulativeError" class="error">-</span>
          <span v-else>
            <strong class="current">{{ formatNumber(totalEarnedPoints) }}</strong>
            <span class="slash">/</span>
            <span class="target">{{ formatNumber(getTargetPoints) }}</span>
          </span>
        </div>

        <div class="meter-footer">
          <span v-if="getCurrentLevel >= 4" class="done">🎉 모든 레벨 달성!</span>
        </div>
      </div>

      <!-- 오른쪽 플로팅 버튼 그룹 -->
      <div class="floating-btn-group">
        <button class="floating-btn" @click="openQuiz"><i class="fa-solid fa-lightbulb"></i></button>
        <button class="floating-btn" @click="openNewsletter"><i class="fas fa-envelope"></i></button>
        <button class="floating-btn" @click="goToAvatarShop"><i class="fa-solid fa-store"></i></button>
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
import { ref, computed, onMounted } from 'vue';
import { useAvatarStore } from '@/stores/avatar.js';
import { getMyCoinStatus } from '@/api/mypage/avatar';
import { getAvatarStatus, getClothes } from '@/api/mypage/avatar/avatarApi.js';
import { hasUnconfirmedChallengeResult } from '@/api/challenge/challenge.js';
import { getBubbleText } from '@/api/home/bubbleApi';
import { useAuthStore } from '@/stores/auth';
import baseAvatar from '../mypage/avatar/avatarimg/avatar-base.png';
import textballonImage from './homeimg/textballon.png';
import { useRouter } from 'vue-router';

const router = useRouter();

const showQuiz = ref(false);
const showNewsletter = ref(false);
const showWelcomeModal = ref(false);

// 누적 포인트 API 상태
const loadingCumulative = ref(false);
const cumulativeError = ref(null);

// 상단 말풍선
const bubbleText = ref('오늘의 퀴즈를 풀어보세요.');
const loadingBubble = ref(false);
const bubbleError = ref(null);

// 아바타/아이템
const avatarStore = useAvatarStore();
const authStore = useAuthStore();
const avatarItems = ref([]);
const avatar = ref(null);

// 미확인 결과
const hasUnconfirmedResults = ref(false);
const showResultTip = ref(false);

// S3 URL -> HTTPS
const convertS3Url = (s3Url) => {
  if (!s3Url) return '';
  return s3Url.startsWith('s3://')
      ? s3Url.replace('s3://finpickbucket/', 'https://finpickbucket.s3.ap-northeast-2.amazonaws.com/')
      : s3Url;
};

// 착용 이미지
const getTitleImage = computed(() => {
  const item = avatarItems.value.find((i) => i.type === 'level' && i.wearing);
  return item ? convertS3Url(item.imageUrl) : null;
});
const getShirtImage = computed(() => {
  const item = avatarItems.value.find((i) => i.type === 'top' && i.wearing);
  return item ? convertS3Url(item.imageUrl) : null;
});
const getShoesImage = computed(() => {
  const item = avatarItems.value.find((i) => i.type === 'shoes' && i.wearing);
  return item ? convertS3Url(item.imageUrl) : null;
});
const getGlassesImages = computed(() =>
    avatarItems.value.filter((i) => i.type === 'accessory' && i.wearing).map((i) => convertS3Url(i.imageUrl))
);

// 포인트/레벨 계산
const totalEarnedPoints = computed(() => avatarStore.cumulativePoints || 0);

const getCurrentLevel = computed(() => {
  const p = totalEarnedPoints.value;
  if (p >= 60000) return 4;
  if (p >= 40000) return 3;
  if (p >= 20000) return 2;
  return 1;
});

const getCurrentLevelTitle = computed(() => {
  const p = totalEarnedPoints.value;
  if (p >= 60000) return '금융도사';
  if (p >= 40000) return '금융법사';
  if (p >= 20000) return '금융견습';
  return '금융새싹';
});

const getTargetPoints = computed(() => {
  const p = totalEarnedPoints.value;
  if (p >= 40000) return 60000;
  if (p >= 20000) return 40000;
  return 20000;
});

const remainingPoints = computed(() => {
  const remain = getTargetPoints.value - totalEarnedPoints.value;
  return remain > 0 ? remain : 0;
});

const getProgressPercentage = computed(() => {
  const cur = totalEarnedPoints.value;
  if (cur >= 60000) return 100;
  if (cur >= 40000) return Math.min(100, Math.round(((cur - 40000) / 20000) * 100));
  if (cur >= 20000) return Math.min(100, Math.round(((cur - 20000) / 20000) * 100));
  return Math.min(100, Math.round((cur / 20000) * 100));
});

// 레벨 칩: 작게 + 톤다운 파스텔
const chipClass = computed(() => {
  const t = getCurrentLevelTitle.value;
  if (t === '금융새싹') return 'chip-seed';
  if (t === '금융견습') return 'chip-apprentice';
  if (t === '금융법사') return 'chip-mage';
  return 'chip-master';
});

// API
const fetchAvatarAndItemData = async () => {
  try {
    const avatarResponse = await getAvatarStatus();
    if (avatarResponse?.data?.data) avatar.value = avatarResponse.data.data;

    const itemsResponse = await getClothes();
    if (itemsResponse?.data?.data) {
      const all = itemsResponse.data.data.map((it) => ({ ...it, wearing: false }));
      if (avatar.value) {
        const { levelId, topId, shoesId, accessoryId } = avatar.value;
        [levelId, topId, shoesId, accessoryId].forEach((id) => {
          const target = all.find((x) => x.itemId === id);
          if (target) target.wearing = true;
        });
      }
      avatarItems.value = all;
    }
  } catch (e) {
    console.error('아바타 데이터 조회 실패:', e);
  }
};

const fetchCumulativePoints = async () => {
  try {
    loadingCumulative.value = true;
    cumulativeError.value = null;
    if (!authStore.isAuthenticated) return;

    const response = await getMyCoinStatus();
    if (response?.status === 200 && response.data?.status === 200) {
      const amt = response.data.data?.cumulativeAmount;
      if (typeof amt === 'number') avatarStore.setCumulativePoints(amt);
      else cumulativeError.value = '누적 포인트 데이터를 가져오는데 실패했습니다.';
    } else {
      cumulativeError.value = '누적 포인트 데이터를 가져오는데 실패했습니다.';
    }
  } catch (err) {
    console.error('누적 포인트 조회 에러:', err);
    cumulativeError.value = '서버 오류가 발생했습니다.';
  } finally {
    loadingCumulative.value = false;
  }
};

const fetchBubbleText = async () => {
  try {
    loadingBubble.value = true;
    bubbleError.value = null;
    const response = await getBubbleText();
    const textValue =
        response?.data?.data?.message ??
        response?.data?.message ??
        '오늘의 퀴즈를 풀어보세요.';
    bubbleText.value = typeof textValue === 'string' ? textValue : '오늘의 퀴즈를 풀어보세요.';
  } catch (err) {
    console.error('말풍선 텍스트 조회 에러:', err);
    bubbleError.value = '말풍선 텍스트를 불러오는데 실패했습니다.';
  } finally {
    loadingBubble.value = false;
  }
};

async function fetchUnconfirmedResults() {
  try {
    const res = await hasUnconfirmedChallengeResult();
    hasUnconfirmedResults.value = res?.data?.status === 200 ? !!res.data.data : false;
  } catch (e) {
    console.warn('미확인 결과 여부 조회 실패:', e);
    hasUnconfirmedResults.value = false;
  }
}

// 라우팅 & 핸들러
function openQuiz() { showQuiz.value = true; }
function closeQuiz() { showQuiz.value = false; fetchCumulativePoints(); }
function openNewsletter() { showNewsletter.value = true; }
function closeNewsletter() { showNewsletter.value = false; }
function closeWelcomeModal() { showWelcomeModal.value = false; }
function goToAvatarShop() { router.push('/avatar-shop'); }
function goToChallengeResult() { router.push('/challenge?tab=completed'); }

onMounted(() => {
  fetchAvatarAndItemData();
  fetchCumulativePoints();
  fetchBubbleText();
  fetchUnconfirmedResults();
  checkFirstVisit();
});

// 첫 방문 체크
const checkFirstVisit = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const fromProfileComplete = urlParams.get('from') === 'profile-complete';
  const hasVisited = localStorage.getItem('hasVisitedHome');
  if ((fromProfileComplete || !hasVisited) && authStore.isAuthenticated) {
    showWelcomeModal.value = true;
    localStorage.setItem('hasVisitedHome', 'true');
    if (fromProfileComplete) {
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }
};

// 유틸
function formatNumber(num) { return num.toLocaleString(); }
</script>

<style scoped>
/* ===== 기본 레이아웃 ===== */
:global(body), :global(html) { overflow: hidden !important; height: 100vh !important; }
.home-container {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  max-width: 390px; width: 100%; height: 100vh; margin: 0 auto;
  position: fixed; top: 0; left: 50%; transform: translateX(-50%);
}
.main-content {
  width: 100%; max-width: 390px; height: 100vh; padding: 20px 0;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  position: relative; overflow: hidden;
}
.main-content::before { content: ''; position: absolute; inset: 0; background: linear-gradient(#b3e5fc 0% 70%, #82c35c 70% 100%); z-index: 0; }
.main-content > * { position: relative; z-index: 1; }

/* 상단 퀴즈 말풍선 */
.quiz-bubble { position: relative; margin: 0 auto 10px; text-align: center; }
.textballon-img { width: 330px; display: block; }
.quiz-text { position: absolute; top: 30%; left: 50%; transform: translate(-50%, -50%); color: #000; font-size: 16px; font-weight: 600; width: 100%; padding: 0 20px; white-space: nowrap; }

/* 아바타 */
.avatar-section { display: flex; flex-direction: column; align-items: center; width: 100%; }
.avatar-pixel { position: relative; width: 230px; height: 359px; display: flex; align-items: center; justify-content: center; }
.avatar-img, .title-img, .shirt-img, .shoes-img, .glasses-img {
  position: absolute; left: 50%; top: 50%; width: 230px; height: 359px; transform: translate(-50%, -50%); pointer-events: none;
}
.avatar-img { z-index: 1; } .title-img, .shirt-img, .shoes-img { z-index: 2; } .glasses-img { z-index: 3; }

/* 플로팅 느낌표 + 말풍선 */
.result-fab {
  position: absolute; left: -6px; top: -6px;
  width: 28px; height: 28px; border-radius: 999px; border: none; cursor: pointer;
  background: #f59e0b; color: #fff; font-weight: 900; font-size: 14px;
  display: inline-flex; align-items: center; justify-content: center;
  box-shadow: 0 6px 14px rgba(245,158,11,0.35); z-index: 6;
  animation: pulse 1.6s infinite;
}
.result-fab-bubble {
  position: absolute; left: 34px; top: -10px; z-index: 7;
  display: inline-flex; flex-direction: column; gap: 2px;
  padding: 10px 12px; border-radius: 12px; cursor: pointer;
  background: #ffffff; color: #1f2937; font-size: 12px; font-weight: 600;
  border: 1px solid rgba(59,130,246,0.18);
  box-shadow: 0 10px 22px rgba(59,130,246,0.15);
}
.result-fab-bubble::before {
  content: ""; position: absolute; left: -6px; top: 12px; width: 0; height: 0;
  border-top: 6px solid transparent; border-bottom: 6px solid transparent; border-right: 6px solid #ffffff;
  filter: drop-shadow(-1px 0 rgba(59,130,246,0.18));
}
.result-fab-bubble .bubble-title { font-weight: 800; color: #2563eb; }
.result-fab-bubble .bubble-text { color: #475569; }

@keyframes pulse {
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(245,158,11,0.45); }
  70% { transform: scale(1.06); box-shadow: 0 0 0 10px rgba(245,158,11,0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(245,158,11,0); }
}

/* 픽셀 구름 */
.pixel-cloud {
  position: absolute; width: 8px; height: 8px; background: #fff;
  box-shadow: 8px 0 #fff, 16px 0 #fff, -8px 8px #fff, 0 8px #fff, 8px 8px #fff, 16px 8px #fff, 24px 8px #fff, -8px 16px #fff, 0 16px #fff, 8px 16px #fff, 16px 16px #fff, 0 24px #fff, 8px 24px #fff;
  transform: scale(4); transform-origin: top left; image-rendering: pixelated; z-index: 0; pointer-events: none;
}
.cloud-1 { top: 40px; left: 30px; } .cloud-2 { top: 100px; right: 40px; }

/* ===== 컬러 토큰 ===== */
:root{
  --card-bg: rgba(255,255,255,0.88);
  --card-border: rgba(0,0,0,0.06);
  --text-strong: #0f172a; --text: #334155; --muted: #64748b;
  /* 게이지/강조 파스텔 톤 */
  --brand: #6b8cff;             /* 채움(진한 파스텔 블루) */
  --brand-strong: #4f7cf8;
  --brand-soft-solid: #edf2ff;  /* ▶ 트랙: 완전 불투명 파스텔 */
  --brand-soft-solid-2: #e7eeff;
  --success: #16a34a; --error: #ef4444; --track: #e5e7eb; --glass: 10px;
}
@media (prefers-color-scheme: dark) {
  :root{
    --card-bg: rgba(15,23,42,0.6); --card-border: rgba(255,255,255,0.08);
    --text-strong:#e5e7eb; --text:#cbd5e1; --muted:#94a3b8;
    --brand:#7da0ff; --brand-strong:#5c86ff;
    --brand-soft-solid:#0f172a; --brand-soft-solid-2:#111827;
    --track:#1f2937;
  }
}

/* ===== 누적 포인트 카드 ===== */
.meter-card {
  width: 340px; padding: 16px 14px; border-radius: 16px;
  background: var(--card-bg); backdrop-filter: blur(var(--glass));
  border: 1px solid var(--card-border); box-shadow: 0 4px 24px rgba(0,0,0,0.06);
  display: flex; flex-direction: column; gap: 10px;
}
.meter-top { display: flex; align-items: center; justify-content: space-between; gap: 12px; }

/* 레벨 칩 */
.level-chip {
  display: inline-flex; align-items: center; gap: 6px; height: 26px; padding: 0 10px;
  border-radius: 999px; border: 1px solid var(--card-border);
  font-weight: 800; color: #fff; letter-spacing: -0.2px; font-size: 12px;
}
.level-dot { width: 7px; height: 7px; border-radius: 50%; background: rgba(255,255,255,0.9); }
.chip-seed{       background: linear-gradient(180deg, #8fcfb0, #79dd82); }
.chip-apprentice{ background: linear-gradient(180deg, #9bb9ff, #7398ff); }
.chip-mage{       background: linear-gradient(180deg, #bfb2ee, #a08be0); }
.chip-master{     background: linear-gradient(180deg, #f3bf9f, #eea67d); }

.next-remaining { display: inline-flex; align-items: baseline; gap: 6px; }
.next-remaining .label { font-size: 11px; color: var(--muted); }
.next-remaining .value { font-size: 14px; font-weight: 800; color: var(--brand-strong); }

/* ▶ 트랙: 완전 불투명 파스텔(잔디색 비침 방지) */
.meter-track {
  position: relative; height: 18px; border-radius: 999px; overflow: hidden;
  background: rgba(243, 244, 246, 0.6); /* 연한 그레이+투명감 */
  border: 1px solid var(--card-border);
}
.meter-track.is-error { background: var(--track); border-color: rgba(239,68,68,0.25); }
.meter-track.is-loading .meter-fill { animation: meter-shimmer 1.2s linear infinite; background-size: 200% 100%; }

/* 채움: 동일계열 진한 그라데이션 */
.meter-fill {
  position: absolute; inset: 0 auto 0 0; width: 0%;
  background: linear-gradient(90deg, #4f46e5, #5d51ff); /* 진한 블루바이올렛 계열 */
  border-radius: 999px;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.25);
  transition: width 420ms cubic-bezier(.2,.9,.2,1);
}
@keyframes meter-shimmer { 0%{background-position:200% 0;} 100%{background-position:-200% 0;} }

/* 핸들(원) */
.meter-handle {
  position: absolute; top: 50%; transform: translateY(-50%);
  width: 20px; height: 20px; border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #fff, #e2e8f0 60%);
  border: 1px solid var(--card-border); box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  transition: left 420ms cubic-bezier(.2,.9,.2,1);
}

/* 마커 */
.tick { position: absolute; top: 100%; width: 1px; height: 8px; background: var(--card-border); transform: translateX(-50%); }
.tick span { position: absolute; top: 10px; transform: translateX(-50%); font-size: 10px; color: var(--muted); }

/* 게이지 아래: 현재/목표 */
.points-below {
  display: flex; justify-content: center; gap: 6px; margin-top: 6px;
  font-size: 11px; font-weight: 800; color: #fff; text-shadow: 0 1px 2px rgba(0,0,0,.35);
}
.points-below .current { opacity: .98; }
.points-below .slash { opacity: .9; }
.points-below .target { opacity: .98; }

/* 푸터 */
.meter-footer { display: flex; justify-content: flex-end; font-size: 12px; color: var(--muted); }
.done { color: var(--success); font-weight: 700; }

/* 우측 플로팅 버튼 */
.floating-btn-group { position: absolute; top: 350px; right: 20px; display: flex; flex-direction: column; gap: 18px; z-index: 2; }
.floating-btn {
  width: 48px; height: 48px; border: none; border-radius: 12px; cursor: pointer;
  background: #4318d1; color: #fff; box-shadow: 0 2px 8px #0002; font-size: 22px; display: flex; align-items: center; justify-content: center;
  transition: background .2s;
}
.floating-btn:hover { background: #6c4cf1; }

/* 로딩/에러 & 스켈레톤 */
.loading-text { color: #6366f1; font-weight: 600; }
.error-text, .error { color: var(--error); font-weight: 600; }
.skeleton { display: inline-block; border-radius: 6px; background: linear-gradient(90deg, #e5e7eb, #f3f4f6, #e5e7eb); background-size: 200% 100%; animation: shimmer 1.2s infinite; }
.skeleton-text { width: 90px; height: 14px; }
@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
</style>
