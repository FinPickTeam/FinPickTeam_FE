<!-- src/pages/mypage/Mypage.vue -->
<template>
  <div class="mypage-container">
    <!-- Profile Section -->
    <section class="profile-section">
      <div class="profile-card">
        <div class="avatar-container">
          <div class="avatar-pixel">
            <img :src="baseAvatar" class="avatar-img" alt="아바타" />
            <img v-if="wearingTitle" :src="convertS3Url(avatarItems.find((i) => i.itemId === wearingTitle)?.imageUrl)" class="title-img" alt="칭호" />
            <img v-if="wearingShirt" :src="convertS3Url(avatarItems.find((i) => i.itemId === wearingShirt)?.imageUrl)" class="shirt-img" alt="상의" />
            <img v-if="wearingShoes" :src="convertS3Url(avatarItems.find((i) => i.itemId === wearingShoes)?.imageUrl)" class="shoes-img" alt="신발" />
            <img v-for="(glassesId, index) in wearingGlasses" :key="index" :src="convertS3Url(avatarItems.find((i) => i.itemId === glassesId)?.imageUrl)" class="glasses-img" alt="액세서리" />
          </div>
        </div>
      </div>
    </section>

    <!-- Modern Stats (투자성향/포인트/레벨) -->
    <section class="stats-card">
      <div class="stat">
        <div class="stat-label">투자성향</div>
        <div class="stat-value">
          <span v-if="loadingPropensity" class="skeleton skeleton-text"></span>
          <span v-else-if="propensityError" class="error">-</span>
          <span v-else>{{ propensityType || "안정자산 추구" }}</span>
        </div>
      </div>

      <div class="divider"></div>

      <div class="stat">
        <div class="stat-label">포인트</div>
        <div class="stat-value">
          <template v-if="loadingCoin">
            <span class="skeleton skeleton-text"></span>
          </template>
          <template v-else-if="coinError">
            <span class="error">-</span>
          </template>
          <template v-else>
            <strong class="accent">{{ currentCoinDisplay }}</strong>
            <span class="coin">🪙</span>
          </template>
        </div>
      </div>

      <div class="divider"></div>

      <div class="stat">
        <div class="stat-label">레벨</div>
        <div class="stat-value">{{ levelText }}</div>
      </div>
    </section>

    <!-- Menu List -->
    <section class="menu-list">
      <div class="menu-item">
        <router-link to="/profile" class="menu-link">
          <span>회원정보 관리</span>
          <font-awesome-icon class="chevron" :icon="['fas', 'angle-right']" />
        </router-link>
      </div>

      <div class="menu-item" @click="goToMyHistory">
        <span>마이 히스토리</span>
        <font-awesome-icon class="chevron" :icon="['fas', 'angle-right']" />
      </div>

      <div class="menu-item" @click="goToPinpickCertificate">
        <span>간편 비밀번호 관리</span>
        <font-awesome-icon class="chevron" :icon="['fas', 'angle-right']" />
      </div>

      <div class="menu-item" @click="goToInvestmentTest">
        <span>투자성향 재검사</span>
        <font-awesome-icon class="chevron" :icon="['fas', 'angle-right']" />
      </div>

      <div class="menu-item" @click="goToCustomerService">
        <span>고객센터</span>
        <font-awesome-icon class="chevron" :icon="['fas', 'angle-right']" />
      </div>

      <div class="menu-item" @click="openConfirm('logout')">
        <span>로그아웃</span>
        <font-awesome-icon class="chevron" :icon="['fas', 'angle-right']" />
      </div>

      <div class="menu-item danger" @click="openConfirm('withdraw')">
        <div class="menu-link">
          <span>회원탈퇴</span>
          <font-awesome-icon class="chevron danger-chevron" :icon="['fas', 'angle-right']" />
        </div>
      </div>
    </section>

    <!-- 확인 모달 -->
    <div v-if="showConfirm" class="confirm-overlay" @click="closeConfirm">
      <div class="confirm-card" @click.stop>
        <div class="confirm-icon" :class="confirmType">
          <font-awesome-icon :icon="confirmType === 'withdraw' ? ['fas','triangle-exclamation'] : ['fas','right-from-bracket']" />
        </div>
        <div class="confirm-title">{{ confirmTitle }}</div>
        <div class="confirm-desc">{{ confirmDesc }}</div>
        <div class="confirm-actions">
          <button class="btn-outline" @click="closeConfirm">취소</button>
          <button
              v-if="confirmType === 'withdraw'"
              class="btn-danger"
              @click="confirmAction"
          >정말 탈퇴할래요</button>
          <button
              v-else
              class="btn-primary"
              @click="confirmAction"
          >확인</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";

import { useAvatarStore } from "../../stores/avatar.js";
import { useAuthStore } from "@/stores/auth";
import { useProfileStore } from "@/stores/profile.js";

import { getMyCoinStatus } from "@/api/mypage/avatar";
import { getAvatarStatus, getClothes } from "@/api/mypage/avatar/avatarApi.js";
import { getInvestmentPropensity } from "@/api/mypage/profile.js";

import baseAvatar from "./avatar/avatarimg/avatar-base.png";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faAngleRight, faRightFromBracket, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
library.add(faAngleRight, faRightFromBracket, faTriangleExclamation);

const router = useRouter();
const authStore = useAuthStore();
const avatarStore = useAvatarStore();
const profileStore = useProfileStore();
const { coin } = storeToRefs(avatarStore);

// 레벨 텍스트(임시)
const levelText = computed(() => "금융 새싹");

// 포인트 상태
const coinStatus = ref({ amount: 0, cumulativeAmount: 0, monthlyCumulativeAmount: 0, updatedAt: null });
const loadingCoin = ref(false);
const coinError = ref(null);

// 투자성향 상태
const propensityType = ref("");
const loadingPropensity = ref(false);
const propensityError = ref(false);

// 현재 포인트 표시(스토어 우선)
const currentCoinDisplay = computed(() => coin.value || coinStatus.value.amount);

// 아바타/아이템
const avatarItems = ref([]);
const avatar = ref(null);

const convertS3Url = (s3Url) => {
  if (!s3Url) return "";
  return s3Url.startsWith("s3://")
      ? s3Url.replace("s3://finpickbucket/", "https://finpickbucket.s3.ap-northeast-2.amazonaws.com/")
      : s3Url;
};

// 착용 중인 아이템 ID
const wearingTitle = computed(() => avatarItems.value.find((i) => i.type === "level" && i.wearing)?.itemId ?? null);
const wearingShirt = computed(() => avatarItems.value.find((i) => i.type === "top" && i.wearing)?.itemId ?? null);
const wearingShoes = computed(() => avatarItems.value.find((i) => i.type === "shoes" && i.wearing)?.itemId ?? null);
const wearingGlasses = computed(() => avatarItems.value.filter((i) => i.type === "accessory" && i.wearing).map((i) => i.itemId));

// API: 아바타/아이템
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
          const t = all.find((x) => x.itemId === id);
          if (t) t.wearing = true;
        });
      }
      avatarItems.value = all;
    }
  } catch (e) {
    console.error("아바타 데이터 조회 실패:", e);
  }
};

// API: 코인
const fetchCurrentCoin = async () => {
  try {
    loadingCoin.value = true;
    coinError.value = null;

    if (!authStore.isAuthenticated) return;

    const response = await getMyCoinStatus();
    if (response?.status === 200 && response.data?.data) {
      const c = response.data.data;
      coinStatus.value = {
        amount: c.amount || 0,
        cumulativeAmount: c.cumulativeAmount || 0,
        monthlyCumulativeAmount: c.monthlyCumulativeAmount || 0,
        updatedAt: c.updatedAt || null,
      };
      avatarStore.setCoin(coinStatus.value.amount);
    } else {
      coinError.value = "코인 상태 데이터를 가져오는데 실패했습니다.";
    }
  } catch (err) {
    console.error("MyPage 코인 상태 조회 에러:", err);
    coinError.value = "서버 오류가 발생했습니다.";
  } finally {
    loadingCoin.value = false;
  }
};

// API: 투자성향
const fetchInvestmentPropensity = async () => {
  loadingPropensity.value = true;
  propensityError.value = false;
  try {
    const response = await getInvestmentPropensity();
    if (response?.data?.data) {
      propensityType.value = response.data.data.propensityType;
    }
  } catch (error) {
    console.error("투자성향 조회 실패:", error);
    propensityError.value = true;
  } finally {
    loadingPropensity.value = false;
  }
};

// 네비게이션 핸들러
function goToMyHistory() {
  profileStore.resetAnswers();
  router.push("/my-history");
}
function goToInvestmentTest() {
  profileStore.resetAnswers();
  router.push("/profile-step-1?from=mypage");
}
function goToPinpickCertificate() { router.push("/mycertificate"); }
function goToCustomerService() { router.push("/customer-support"); }

// 확인 모달
const showConfirm = ref(false);
const confirmType = ref(null);
const confirmTitle = computed(() =>
    confirmType.value === 'logout' ? '로그아웃 하시겠어요?' : '정말 떠나신다니 너무 아쉬워요 😢'
);
const confirmDesc  = computed(() =>
    confirmType.value === 'logout'
        ? '현재 계정에서 로그아웃됩니다.'
        : '탈퇴 후에는 계정과 데이터가 삭제되어 복구가 어려워요. 그래도 진행할까요?'
);

function openConfirm(type) {
  confirmType.value = type;
  showConfirm.value = true;
}
function closeConfirm() {
  showConfirm.value = false;
  confirmType.value = null;
}
async function confirmAction() {
  if (confirmType.value === 'logout') {
    try { await authStore.logout(); } finally { router.push('/login'); }
  } else if (confirmType.value === 'withdraw') {
    router.push('/withdraw');
  }
  closeConfirm();
}

// 마운트
onMounted(() => {
  fetchAvatarAndItemData();
  fetchCurrentCoin();
  fetchInvestmentPropensity();
});
</script>

<style scoped>
/* ===== 레이아웃 ===== */
.mypage-container {
  min-height: 100vh;
  width: 100%;
  max-width: 390px;
  margin: 0 auto;
  background: var(--color-bg);
  box-sizing: border-box;
  padding-top: 56px;          /* 전체적으로 살짝 더 아래 */
  padding-bottom: 104px;      /* 하단 네비바 공간 */
  font-family: var(--font-main);
  overflow-x: hidden;         /* 오른쪽 잘림 방지 */
}

/* 공통 폭 제한 */
.profile-section,
.stats-card,
.menu-list {
  width: 100%;
  max-width: 390px;
  margin: 0 auto;
  box-sizing: border-box;
  display: block;
}

/* ===== 프로필 카드 ===== */
.profile-section {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 32px 0 18px;        /* 더 아래 */
}
.profile-card {
  position: relative;
  display: flex;
  justify-content: center;
  margin: 0 30px;
  padding: 10px 0 0 0;
  border: 2px solid #ffffff;
  border-radius: 12px;
  background: var(--color-bg);
  box-sizing: border-box;
  width: calc(100% - 60px);
  max-width: 330px;
}

/* 아바타 사이즈 유지(이전 단계) */
.avatar-container { position: relative; width: 112px; height: 174px; display: flex; align-items: center; justify-content: center; }
.avatar-pixel     { position: relative; width: 112px; height: 174px; display: flex; align-items: center; justify-content: center; }

.avatar-img,
.title-img,
.shirt-img,
.shoes-img,
.glasses-img {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 112px;
  height: 174px;
  transform: translate(-50%, -50%);
  pointer-events: none;
}
.avatar-img  { z-index: 1; }
.title-img,
.shirt-img,
.shoes-img   { z-index: 2; }
.glasses-img { z-index: 3; }

/* ===== Modern Stats Card (처음 디자인 회귀: 테두리 없음) ===== */
.stats-card {
  /* 양옆 여백 기준으로 너비 고정 → 잘림 방지 */
  width: calc(100% - 32px);
  margin: 20px 16px 18px;
  padding: 14px 12px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(10px);

  /* 테두리 옅은 회색, 은은한 그림자만 */
  border: 1px solid #e5e7eb; /* 옅은 회색(=Tailwind slate-200 근처) */
  box-shadow:
      0 3px 10px rgba(0, 0, 0, 0.06);    /* 가까운 부드러운 그림자 */

  display: grid;
  grid-template-columns: 1fr auto 1fr auto 1fr;
  align-items: center;
  gap: 10px;
  overflow: hidden;  /* 내부 그림자/구분선으로 인한 가로흐름 방지 */
}

.stat { display: grid; gap: 4px; justify-items: center; min-width: 0; }
.stat-label { font-size: 11px; color: #64748b; letter-spacing: .2px; }
.stat-value { font-size: 15px; font-weight: 800; color: #0f172a; }
.stat-value .accent { color: #4f46e5; }
.stat-value .coin { margin-left: 4px; }

.divider {
  width: 1px;
  height: 28px;
  background: linear-gradient(180deg, rgba(2,6,23,0), rgba(2,6,23,.12), rgba(2,6,23,0));
  border-radius: 1px;
}

/* ===== 메뉴 ===== */
.menu-list {
  width: 100%;
  max-width: 390px;
  padding: 0 30px;
  box-sizing: border-box;
  margin-bottom: 16px;       /* 리스트도 살짝 아래 */
}
.menu-item {
  width: 100%;
  padding: 16px 0;
  border-bottom: 1px solid var(--color-border);
  font-size: 15px;
  color: var(--color-text);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.menu-item:last-child { border-bottom: none; }
.menu-item.danger { color: var(--color-accent); }

.menu-link {
  color: inherit;
  text-decoration: none;
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
}
.chevron { color: #ccc; font-size: 17px; }
.danger-chevron { color: var(--color-accent); }

/* ===== 스켈레톤/에러 ===== */
.skeleton {
  display: inline-block;
  border-radius: 6px;
  background: linear-gradient(90deg, #e5e7eb, #f3f4f6, #e5e7eb);
  background-size: 200% 100%;
  animation: shimmer 1.2s infinite;
}
.skeleton-text { width: 80px; height: 14px; }
@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
.error { color: #ef4444; font-weight: 700; }

/* ===== 확인 모달 ===== */
.confirm-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,.4);
  display: flex; align-items: center; justify-content: center; z-index: 2000;
}
.confirm-card {
  width: calc(100% - 48px);      /* 더 큼 */
  max-width: 440px;              /* 더 큼 */
  background: #fff; border-radius: 18px; padding: 22px 18px 16px;
  box-shadow: 0 18px 40px rgba(0,0,0,.2);
  text-align: center;
}
.confirm-icon {
  width: 56px; height: 56px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 10px; font-size: 22px;
  background: #eef2ff; color: #4f46e5;
}
.confirm-icon.withdraw { background: #ffe4e6; color: #dc2626; }
.confirm-title { font-size: 18px; font-weight: 800; color: #111827; margin-bottom: 8px; }
.confirm-desc  { font-size: 14px; color: #6b7280; margin-bottom: 16px; }
.confirm-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.btn-outline {
  height: 46px; border-radius: 10px; border: 1.5px solid #e5e7eb; background: #fff; font-weight: 700; color: #374151;
}
.btn-primary {
  height: 46px; border-radius: 10px; border: none; font-weight: 800; color: #fff; background: #4318d1;
  box-shadow: 0 8px 20px rgba(67,24,209,.22);
}
.btn-danger {
  height: 46px; border-radius: 10px; border: none; font-weight: 800; color: #fff; background: #dc2626; /* 빨강 */
  box-shadow: 0 8px 20px rgba(220,38,38,.22);
}
</style>
