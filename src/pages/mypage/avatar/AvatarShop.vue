<template>
  <div class="shop-container">
    <!-- 헤더 영역 -->
    <div class="dictionary-header-bar">
      <button class="back-btn" @click="goBack">
        <font-awesome-icon :icon="['fas', 'angle-left']" />
      </button>
      <span class="dictionary-header-title">상점</span>
    </div>

    <!-- 아바타 및 코인 (항상 표시) -->
    <div class="avatar-section">
      <div class="avatar-container">
        <div class="avatar-pixel">
          <img
            :src="avatarBase"
            class="avatar-img"
            alt="아바타"
            @error="handleImageError"
            @load="handleImageLoad"
          />
          <img
            v-if="tempWearingTitle"
            :src="
              titleItems.find((item) => item.id === tempWearingTitle)?.image
            "
            class="title-img"
            alt="칭호"
            @error="handleImageError"
          />
          <img
            v-if="tempWearingShirt"
            :src="
              shirtItems.find((item) => item.id === tempWearingShirt)?.image
            "
            class="shirt-img"
            alt="상의"
            @error="handleImageError"
          />
          <img
            v-if="tempWearingShoes"
            :src="
              shoesItems.find((item) => item.id === tempWearingShoes)?.image
            "
            class="shoes-img"
            alt="신발"
            @error="handleImageError"
          />
          <!-- 여러 액세서리를 동시에 표시 -->
          <img
            v-for="glassesId in tempWearingGlasses"
            :key="glassesId"
            :src="glassesItems.find((item) => item.id === glassesId)?.image"
            class="glasses-img"
            :alt="glassesItems.find((item) => item.id === glassesId)?.name"
            @error="handleImageError"
          />
        </div>
      </div>
      <div class="coin-container">
        <div class="coin-error-space">
          <span v-if="showCoinError" class="coin-error"
            >포인트가 부족합니다!</span
          >
        </div>
        <div class="coin-balance">
          <span class="coin-icon">🪙</span>
          <span v-if="loadingCoin" class="coin-value loading">...</span>
          <span v-else-if="coinError" class="coin-value error">-</span>
          <span v-else class="coin-value">{{ avatarStore.coin }}</span>
        </div>
      </div>
    </div>

    <!-- 탭 헤더 -->
    <div class="subtab-row">
      <span
        class="subtab"
        :class="{ active: activeTab === 'avatar' }"
        @click="activeTab = 'avatar'"
      >
        아바타
      </span>
      <span
        class="subtab"
        :class="{ active: activeTab === 'gifticon' }"
        @click="activeTab = 'gifticon'"
      >
        기프티콘
      </span>
    </div>

    <!-- 아바타 탭 내용 -->
    <div v-if="activeTab === 'avatar'" class="tab-content">
      <!-- 칭호 아이템 -->
      <div class="item-category">
        <span class="category-icon">👑</span> 칭호
      </div>
      <div class="item-list">
        <div
          class="item-card"
          :class="{
            selected: currentWearingTitle === item.id,
            active: getTitleItemStatus(item).isActive,
            inactive: !getTitleItemStatus(item).isActive,
          }"
          v-for="item in titleItems"
          :key="item.id"
          @click="handleTitleItemClick(item)"
        >
          <img :src="item.image" class="item-img" :alt="item.name" />
          <span class="item-requirement">
            {{
              item.requiredPoints === 0
                ? "기본"
                : `누적 ${item.requiredPoints.toLocaleString()}P`
            }}
          </span>
          <span v-if="currentWearingTitle === item.id" class="wearing-label"
            >착용중</span
          >
          <div
            v-if="!getTitleItemStatus(item).isActive"
            class="inactive-overlay"
          >
            <div class="inactive-text">
              <div>누적</div>
              <div>{{ item.requiredPoints.toLocaleString() }}P</div>
              <div>필요</div>
            </div>
          </div>
          <font-awesome-icon
            v-if="currentWearingTitle === item.id"
            class="check-icon"
            :icon="['fas', 'check-circle']"
          />
          <div v-if="currentWearingTitle === item.id" class="wearing-overlay">
            <font-awesome-icon
              class="wearing-icon"
              :icon="['fas', 'check-circle']"
            />
          </div>
        </div>
      </div>

      <!-- 상의 아이템 -->
      <div class="item-category"><span class="category-icon">👕</span> 옷</div>
      <div class="item-list">
        <div
          class="item-card"
          :class="{
            selected: tempWearingShirt === item.id,
            purchased: item.purchased,
          }"
          v-for="item in shirtItems"
          :key="item.id"
          @click="handleBuyOrToggleShirt(item)"
        >
          <img :src="item.image" class="item-img" :alt="item.name" />
          <span class="item-price">🪙 {{ item.price }}</span>
          <span v-if="item.purchased" class="own-label">보유중</span>
          <span v-if="tempWearingShirt === item.id" class="wearing-label"
            >착용중</span
          >
          <font-awesome-icon
            v-if="item.purchased"
            class="check-icon"
            :icon="['fas', 'check-circle']"
          />
          <div v-if="tempWearingShirt === item.id" class="wearing-overlay">
            <font-awesome-icon
              class="wearing-icon"
              :icon="['fas', 'check-circle']"
            />
          </div>
        </div>
      </div>

      <!-- 신발 아이템 -->
      <div class="item-category">
        <span class="category-icon">👟</span> 신발
      </div>
      <div class="item-list">
        <div
          class="item-card"
          :class="{
            selected: tempWearingShoes === item.id,
            purchased: item.purchased,
          }"
          v-for="item in shoesItems"
          :key="item.id"
          @click="handleBuyOrToggleShoes(item)"
        >
          <img :src="item.image" class="item-img" :alt="item.name" />
          <span class="item-price">🪙 {{ item.price }}</span>
          <span v-if="item.purchased" class="own-label">보유중</span>
          <span v-if="tempWearingShoes === item.id" class="wearing-label"
            >착용중</span
          >
          <font-awesome-icon
            v-if="item.purchased"
            class="check-icon"
            :icon="['fas', 'check-circle']"
          />
          <div v-if="tempWearingShoes === item.id" class="wearing-overlay">
            <font-awesome-icon
              class="wearing-icon"
              :icon="['fas', 'check-circle']"
            />
          </div>
        </div>
      </div>

      <!-- 액세서리 아이템 -->
      <div class="item-category">
        <span class="category-icon">🕶️</span> 액세서리
      </div>
      <div class="item-list">
        <div
          class="item-card"
          :class="{
            selected: tempWearingGlasses.includes(item.id),
            purchased: item.purchased,
          }"
          v-for="item in glassesItems"
          :key="item.id"
          @click="handleBuyOrToggleGlasses(item)"
        >
          <img :src="item.image" class="item-img" :alt="item.name" />
          <span class="item-price">🪙 {{ item.price }}</span>
          <span v-if="item.purchased" class="own-label">보유중</span>
          <span
            v-if="tempWearingGlasses.includes(item.id)"
            class="wearing-label"
            >착용중</span
          >
          <font-awesome-icon
            v-if="item.purchased"
            class="check-icon"
            :icon="['fas', 'check-circle']"
          />
          <div
            v-if="tempWearingGlasses.includes(item.id)"
            class="wearing-overlay"
          >
            <font-awesome-icon
              class="wearing-icon"
              :icon="['fas', 'check-circle']"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 기프티콘 탭 내용 -->
    <div v-if="activeTab === 'gifticon'" class="tab-content">
      <!-- 카테고리 필터 -->
      <div class="gifticon-categories">
        <div
          class="category-btn"
          :class="{ active: selectedCategory === 'coffee' }"
          @click="selectedCategory = 'coffee'"
        >
          <span class="category-btn-icon">☕</span>
          커피
        </div>
        <div
          class="category-btn"
          :class="{ active: selectedCategory === 'popcorn' }"
          @click="selectedCategory = 'popcorn'"
        >
          <span class="category-btn-icon">🍿</span>
          팝콘
        </div>
      </div>

      <!-- 커피 카테고리 -->
      <div v-if="selectedCategory === 'coffee'" class="gifticon-items">
        <div class="brand-section">
          <h3 class="brand-title">투썸플레이스</h3>
          <div
            class="gifticon-item"
            v-for="item in coffeeItems"
            :key="item.id"
            @click="handleBuyGifticon(item)"
          >
            <img :src="item.image" class="gifticon-item-img" :alt="item.name" />
            <div class="gifticon-item-info">
              <div class="gifticon-item-name">{{ item.name }}</div>
              <div class="gifticon-item-price">
                <span class="cash-icon">🪙</span>
                {{ item.price.toLocaleString() }}캐시
              </div>
            </div>
            <font-awesome-icon
              v-if="item.purchased"
              class="gifticon-check-icon"
              :icon="['fas', 'check-circle']"
            />
          </div>
        </div>
      </div>

      <!-- 팝콘 카테고리 -->
      <div v-if="selectedCategory === 'popcorn'" class="gifticon-items">
        <div class="brand-section">
          <h3 class="brand-title">메가박스</h3>
          <div
            class="gifticon-item"
            v-for="item in megaboxItems"
            :key="item.id"
            @click="handleBuyGifticon(item)"
          >
            <img :src="item.image" class="gifticon-item-img" :alt="item.name" />
            <div class="gifticon-item-info">
              <div class="gifticon-item-name">{{ item.name }}</div>
              <div class="gifticon-item-price">
                <span class="cash-icon">🪙</span>
                {{ item.price.toLocaleString() }}캐시
              </div>
            </div>
            <font-awesome-icon
              v-if="item.purchased"
              class="gifticon-check-icon"
              :icon="['fas', 'check-circle']"
            />
          </div>
        </div>

        <div class="brand-section">
          <h3 class="brand-title">CGV</h3>
          <div
            class="gifticon-item"
            v-for="item in artboxItems"
            :key="item.id"
            @click="handleBuyGifticon(item)"
          >
            <img :src="item.image" class="gifticon-item-img" :alt="item.name" />
            <div class="gifticon-item-info">
              <div class="gifticon-item-name">{{ item.name }}</div>
              <div class="gifticon-item-price">
                <span class="cash-icon">🪙</span>
                {{ item.price.toLocaleString() }}캐시
              </div>
            </div>
            <font-awesome-icon
              v-if="item.purchased"
              class="gifticon-check-icon"
              :icon="['fas', 'check-circle']"
            />
          </div>
        </div>

        <div class="brand-section">
          <h3 class="brand-title">롯데시네마</h3>
          <div
            class="gifticon-item"
            v-for="item in lotteItems"
            :key="item.id"
            @click="handleBuyGifticon(item)"
          >
            <img :src="item.image" class="gifticon-item-img" :alt="item.name" />
            <div class="gifticon-item-info">
              <div class="gifticon-item-name">{{ item.name }}</div>
              <div class="gifticon-item-price">
                <span class="cash-icon">🪙</span>
                {{ item.price.toLocaleString() }}캐시
              </div>
            </div>
            <font-awesome-icon
              v-if="item.purchased"
              class="gifticon-check-icon"
              :icon="['fas', 'check-circle']"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 아바타 착용 버튼 -->
    <div class="wear-avatar-section">
      <button class="wear-avatar-btn" @click="wearAvatar">아바타 착용</button>
    </div>

    <Navbar />
    <div v-if="showPurchaseModal" class="purchase-modal-overlay">
      <div class="purchase-modal">
        <div
          v-if="pendingPurchaseType === 'gifticon'"
          class="purchase-modal-message"
        >
          기프티콘을 전송받을 번호를 입력해주세요.
        </div>
        <div v-else class="purchase-modal-message">정말 구매하시겠습니까?</div>

        <div
          v-if="pendingPurchaseType === 'gifticon'"
          class="phone-input-section"
        >
          <input
            v-model="phoneNumber"
            type="tel"
            class="phone-input"
            placeholder="번호를 입력해주세요(010-1234-5678)"
            @input="formatPhoneNumber"
          />
          <div v-if="phoneNumberError" class="phone-error-message">
            {{ phoneNumberError }}
          </div>
        </div>

        <div class="purchase-modal-actions">
          <button class="modal-cancel-btn" @click="closePurchaseModal">
            취소
          </button>
          <button class="modal-confirm-btn" @click="confirmPurchase">
            구매
          </button>
        </div>
      </div>
    </div>

    <!-- 아바타 적용 성공 모달 -->
    <div v-if="showSuccessModal" class="success-modal-overlay">
      <div class="success-modal">
        <div class="success-modal-icon">✅</div>
        <div class="success-modal-message">아바타가 적용되었습니다!</div>
        <div class="success-modal-actions">
          <button class="modal-confirm-btn" @click="closeSuccessModal">
            확인
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useAvatarStore } from "../../../stores/avatar.js";
import {
  getCurrentCoin,
  getCumulativeCoin,
  getClothes,
  insertClothe,
  getMyCoinStatus,
} from "@/api/mypage/avatar";
import { useAuthStore } from "@/stores/auth";
import Navbar from "../../../components/Navbar.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faAngleLeft,
  faCheckCircle,
  faCheckDouble,
} from "@fortawesome/free-solid-svg-icons";
import { ref, onMounted, computed } from "vue";
import { storeToRefs } from "pinia";

// 아바타 이미지 import
import avatarBase from "./avatarimg/avatar-base.png";

// fallback 이미지 (기본 아바타가 로드되지 않을 경우)
const fallbackAvatar =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYwIiBoZWlnaHQ9IjI1MCIgdmlld0JveD0iMCAwIDE2MCAyNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNjAiIGhlaWdodD0iMjUwIiBmaWxsPSIjRkZGRkZGIi8+CjxjaXJjbGUgY3g9IjgwIiBjeT0iNjAiIHI9IjMwIiBmaWxsPSIjNjY2NjY2Ii8+CjxyZWN0IHg9IjUwIiB5PSI5MCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjNjY2NjY2Ii8+Cjwvc3ZnPgo=";
import hatWizardhat from "./avatarimg/hat-3wizardhat.png";
import hatSprout from "./avatarimg/hat-1sprout.png";
import hatDosa from "./avatarimg/hat-4dosa.png";
import hatBeginner from "./avatarimg/hat-2beginner.png";
import shirtBlue from "./avatarimg/shirts-blue.png";
import shirtRed from "./avatarimg/shirt-red.png";
import shoesBrown from "./avatarimg/shoese-brown.png";
import shoes from "./avatarimg/shoese.png";
import sportGlasses from "./avatarimg/sporglasses.png";
import sunGlasses from "./avatarimg/etc-sunglasses.png";
import blush from "./avatarimg/etc-blush.png";

// 기프티콘 이미지 import
import twosomeColdBrew from "./giftshopimg/TWOSOMEPLACE  COLDBRUE.png";
import twosomeCafeLatte from "./giftshopimg/TWOSOMEPLACE  CAFELATTE.png";
import twosomeHotLatte from "./giftshopimg/TWOSOMEPLACE HOTLATTE.png";
import twosomeAmericano from "./giftshopimg/TWOSOMEPLACE AMECARICANO.png";
import megaboxPopcorn from "./giftshopimg/MEGABOX CINEMA POPCORN SET.jpg";
import cgvTicket from "./giftshopimg/CGV TICKET.jpeg";
import lotteCombo from "./giftshopimg/LOTTECINEMA SWEET COMBO.jpg";

library.add(faAngleLeft, faCheckCircle, faCheckDouble);

const router = useRouter();
const avatarStore = useAvatarStore();
const authStore = useAuthStore();
const { cumulativePoints } = storeToRefs(avatarStore);
const showCoinError = ref(false);

// 포인트 상태 관리
const loadingCoin = ref(false);
const coinError = ref(null);
const loadingCumulative = ref(false);
const cumulativeError = ref(null);
const activeTab = ref("avatar");
const selectedCategory = ref("coffee");
const showSuccessModal = ref(false);

// 전화번호 입력 관련
const phoneNumber = ref("");
const phoneNumberError = ref("");

// 임시 착용 상태를 저장하는 변수들
const tempWearingTitle = ref(null);
const tempWearingShirt = ref(null);
const tempWearingShoes = ref(null);
const tempWearingGlasses = ref([]);

// computed 속성들
const totalEarnedPoints = computed(() => {
  return cumulativePoints.value;
});

const isItemActive = (requiredPoints) => {
  return totalEarnedPoints.value >= requiredPoints;
};

// 칭호 아이템 활성화 상태 확인
const getTitleItemStatus = (item) => {
  const isActive = isItemActive(item.requiredPoints);
  return {
    isActive,
    canWear: isActive,
    isWearing: item.wearing,
  };
};

// 현재 선택된 칭호 (없으면 첫 번째 활성화된 칭호)
const currentWearingTitle = computed(() => {
  if (tempWearingTitle.value) {
    return tempWearingTitle.value;
  }
  // 선택된 칭호가 없으면 첫 번째 활성화된 칭호 반환
  const firstActiveTitle = titleItems.value.find(
    (item) => getTitleItemStatus(item).isActive
  );
  return firstActiveTitle ? firstActiveTitle.id : null;
});

// 아바타 아이템 데이터 (서버에서 가져온 데이터로 초기화)
const titleItems = ref([]);
const shirtItems = ref([]);
const shoesItems = ref([]);
const glassesItems = ref([]);
const gifticonItems = ref([]);

// 서버에서 의상 데이터 가져오기 (API 명세에 맞게 수정)
const fetchUserClothes = async () => {
  try {
    const userId = authStore.user?.id || authStore.user?.userId || 1;
    console.log("사용자 의상 조회 시작, userId:", userId);

    const response = await getClothes(userId);
    console.log("사용자 의상 조회 결과:", response);
    console.log("response.data:", response.data);
    console.log("response.data.data:", response.data?.data);

    // API 명세에 따른 응답 구조 확인
    // { "data": [...], "message": "string", "status": 0 }
    if (response.data && response.data.status === 0 && response.data.data) {
      const userClothes = response.data.data;
      console.log("서버에서 받은 의상 데이터:", userClothes);
      console.log("userClothes 타입:", typeof userClothes);
      console.log(
        "userClothes 길이:",
        Array.isArray(userClothes) ? userClothes.length : "배열이 아님"
      );

      if (Array.isArray(userClothes) && userClothes.length > 0) {
        console.log("첫 번째 아이템 예시:", userClothes[0]);
        console.log(
          "모든 아이템의 type:",
          userClothes.map((item) => item.type)
        );

        // 타입별로 아이템 분류 (API 명세의 필드명 사용)
        titleItems.value = userClothes
          .filter((item) => item.type === "title")
          .map((item) => ({
            id: `hat-${item.itemId}sprout`, // 서버 itemId를 로컬 ID 형식으로 변환
            name: item.name,
            price: item.cost,
            image: item.imageUrl || getItemImage(item.type, item.itemId), // imageUrl 우선 사용
            purchased: item.owned, // API 명세: owned
            wearing: item.wearing, // API 명세: wearing
            requiredPoints: getRequiredPoints(item.type, item.itemId),
          }));

        shirtItems.value = userClothes
          .filter((item) => item.type === "shirt")
          .map((item) => ({
            id: `shirt-${item.itemId}`, // 서버 itemId를 로컬 ID 형식으로 변환
            name: item.name,
            price: item.cost,
            image: item.imageUrl || getItemImage(item.type, item.itemId), // imageUrl 우선 사용
            purchased: item.owned, // API 명세: owned
            wearing: item.wearing, // API 명세: wearing
          }));

        shoesItems.value = userClothes
          .filter((item) => item.type === "shoes")
          .map((item) => ({
            id: `shoes-${item.itemId}`, // 서버 itemId를 로컬 ID 형식으로 변환
            name: item.name,
            price: item.cost,
            image: item.imageUrl || getItemImage(item.type, item.itemId), // imageUrl 우선 사용
            purchased: item.owned, // API 명세: owned
            wearing: item.wearing, // API 명세: wearing
          }));

        glassesItems.value = userClothes
          .filter((item) => item.type === "glasses")
          .map((item) => ({
            id: `glasses-${item.itemId}`, // 서버 itemId를 로컬 ID 형식으로 변환
            name: item.name,
            price: item.cost,
            image: item.imageUrl || getItemImage(item.type, item.itemId), // imageUrl 우선 사용
            purchased: item.owned, // API 명세: owned
            wearing: item.wearing, // API 명세: wearing
          }));

        gifticonItems.value = userClothes
          .filter((item) => item.type === "gifticon")
          .map((item) => ({
            id: `gifticon-${item.itemId}`, // 서버 itemId를 로컬 ID 형식으로 변환
            name: item.name,
            price: item.cost,
            image: item.imageUrl || getItemImage(item.type, item.itemId), // imageUrl 우선 사용
            purchased: item.owned, // API 명세: owned
            wearing: item.wearing, // API 명세: wearing
          }));

        console.log("아이템 데이터 변환 완료 (API 명세 준수):", {
          titles: titleItems.value,
          shirts: shirtItems.value,
          shoes: shoesItems.value,
          glasses: glassesItems.value,
          gifticons: gifticonItems.value,
        });

        // 디버깅: 각 배열의 길이 확인
        console.log("아이템 배열 길이:", {
          titleItemsLength: titleItems.value.length,
          shirtItemsLength: shirtItems.value.length,
          shoesItemsLength: shoesItems.value.length,
          glassesItemsLength: glassesItems.value.length,
          gifticonItemsLength: gifticonItems.value.length,
        });
      } else {
        console.log("서버 응답에 데이터가 없어서 기본 데이터 사용");
        initializeDefaultItems();
      }
    } else {
      console.log(
        "API 응답 구조가 올바르지 않아서 기본 데이터 사용:",
        response.data
      );
      initializeDefaultItems();
    }
  } catch (error) {
    console.error("사용자 의상 조회 실패:", error);
    console.log("에러로 인해 기본 데이터 사용");
    // 에러 시 기본 데이터 사용
    initializeDefaultItems();
  }
};

// 아이템 이미지 매핑 함수
const getItemImage = (type, itemId) => {
  // 서버에서 받은 itemId에 따라 적절한 이미지 반환
  const imageMap = {
    title: {
      1: "https://finpickbucket.s3.ap-northeast-2.amazonaws.com/level/SEEDLING/sprout.png", // 금융새싹
      2: "https://finpickbucket.s3.ap-northeast-2.amazonaws.com/level/TRAINEE/beginner.png", // 금융견습
      3: "https://finpickbucket.s3.ap-northeast-2.amazonaws.com/level/WIZARD/wizardhat.png", // 금융법사
      4: "https://finpickbucket.s3.ap-northeast-2.amazonaws.com/level/MASTER/dosa.png", // 금융도사
    },
    shirt: {
      1: shirtBlue,
      2: shirtRed,
    },
    shoes: {
      1: shoesBrown,
      2: shoes,
    },
    glasses: {
      1: sportGlasses,
      2: sunGlasses,
    },
  };

  const image = imageMap[type]?.[itemId] || avatarBase;
  return image;
};

// 필요 포인트 매핑 함수
const getRequiredPoints = (type, itemId) => {
  const pointsMap = {
    title: {
      1: 0,
      2: 20000,
      3: 40000,
      4: 60000,
    },
  };

  return pointsMap[type]?.[itemId] || 0;
};

// 기본 아이템 데이터 초기화 함수에 추가
const initializeDefaultItems = () => {
  console.log("기본 아이템 데이터 초기화 시작");
  console.log("초기화 전 아이템 배열 길이:", {
    titleItemsLength: titleItems.value.length,
    shirtItemsLength: shirtItems.value.length,
    shoesItemsLength: shoesItems.value.length,
    glassesItemsLength: glassesItems.value.length,
  });
  titleItems.value = [
    {
      id: "hat-1sprout",
      name: "씨앗",
      price: 50000,
      image: hatSprout,
      purchased: false,
      wearing: false,
      requiredPoints: 0,
    },
    {
      id: "hat-2beginner",
      name: "초보자 모자",
      price: 25000,
      image: hatBeginner,
      purchased: false,
      wearing: false,
      requiredPoints: 20000,
    },
    {
      id: "hat-3wizardhat",
      name: "마법사 모자",
      price: 100000,
      image: hatWizardhat,
      purchased: false,
      wearing: false,
      requiredPoints: 40000,
    },
    {
      id: "hat-4dosa",
      name: "도사 모자",
      price: 75000,
      image: hatDosa,
      purchased: false,
      wearing: false,
      requiredPoints: 60000,
    },
  ];

  shirtItems.value = [
    {
      id: "shirt-blue",
      name: "파란 상의",
      price: 50000,
      image: shirtBlue,
      purchased: false,
      wearing: false,
    },
    {
      id: "shirt-red",
      name: "빨간 상의",
      price: 50,
      image: shirtRed,
      purchased: false,
      wearing: false,
    },
  ];

  shoesItems.value = [
    {
      id: "shoes-brown",
      name: "갈색 신발",
      price: 30,
      image: shoesBrown,
      purchased: false,
      wearing: false,
    },
    {
      id: "shoes",
      name: "검은 신발",
      price: 30,
      image: shoes,
      purchased: false,
      wearing: false,
    },
  ];

  glassesItems.value = [
    {
      id: "sport-glasses",
      name: "스포츠 안경",
      price: 40,
      image: sportGlasses,
      purchased: false,
      wearing: false,
    },
    {
      id: "etc-sunglasses",
      name: "선글라스",
      price: 40,
      image: sunGlasses,
      purchased: false,
      wearing: false,
    },
    {
      id: "etc-blush",
      name: "블러시",
      price: 30,
      image: blush,
      purchased: false,
      wearing: false,
    },
  ];
  console.log("기본 아이템 데이터 초기화 완료:", {
    titles: titleItems.value,
    shirts: shirtItems.value,
    shoes: shoesItems.value,
    glasses: glassesItems.value,
  });

  // 디버깅: 기본 아이템 배열 길이 확인
  console.log("기본 아이템 배열 길이:", {
    titleItemsLength: titleItems.value.length,
    shirtItemsLength: shirtItems.value.length,
    shoesItemsLength: shoesItems.value.length,
    glassesItemsLength: glassesItems.value.length,
  });
};

// store 상태를 로컬 상태에 동기화하는 함수
function syncStoreState() {
  // 칭호 아이템 동기화 - 누적 포인트에 따른 활성화 상태는 computed로 처리되므로 착용 상태만 동기화
  titleItems.value.forEach((item) => {
    const wearing = avatarStore.isItemWearing("titles", item.id);
    item.wearing = wearing;
  });

  // 상의 아이템 동기화
  shirtItems.value.forEach((item) => {
    const purchased = avatarStore.isItemPurchased("shirts", item.id);
    const wearing = avatarStore.isItemWearing("shirts", item.id);

    // 구매 상태는 한번 true가 되면 영구적으로 유지
    if (purchased) {
      item.purchased = true;
    }
    item.wearing = wearing;
  });

  // 신발 아이템 동기화
  shoesItems.value.forEach((item) => {
    const purchased = avatarStore.isItemPurchased("shoes", item.id);
    const wearing = avatarStore.isItemWearing("shoes", item.id);

    // 구매 상태는 한번 true가 되면 영구적으로 유지
    if (purchased) {
      item.purchased = true;
    }
    item.wearing = wearing;
  });

  // 액세서리 아이템 동기화
  glassesItems.value.forEach((item) => {
    const purchased = avatarStore.isItemPurchased("glasses", item.id);
    const wearing = avatarStore.isItemWearing("glasses", item.id);

    // 구매 상태는 한번 true가 되면 영구적으로 유지
    if (purchased) {
      item.purchased = true;
    }
    item.wearing = wearing;
  });
}

// 포인트 데이터 가져오기
const fetchCurrentCoin = async () => {
  try {
    loadingCoin.value = true;
    coinError.value = null;

    // 인증 상태 확인
    console.log("인증 상태 확인:", {
      isAuthenticated: authStore.isAuthenticated,
      user: authStore.user,
      accessToken: authStore.accessToken ? "존재함" : "없음",
    });

    if (!authStore.isAuthenticated) {
      console.warn("로그인이 필요합니다.");
      return;
    }

    // 사용자 ID 가져오기
    const userId = authStore.user?.id || authStore.user?.userId || 1;

    console.log("AvatarShop 현재 포인트 데이터 가져오기 시작, userId:", userId);
    const response = await getCurrentCoin(userId);
    console.log("받아온 현재 포인트 데이터 (전체 응답):", response);
    console.log("response.data:", response.data);
    console.log("response.data.data:", response.data?.data);
    console.log("response.status:", response.status);

    if (response.status === 200 && response.data !== undefined) {
      // 백엔드 응답 구조에 따라 coin 값 추출
      let coinValue;

      // 구조 1: { status: 200, data: 1500 }
      if (typeof response.data === "number") {
        coinValue = response.data;
      }
      // 구조 2: { status: 200, message: "...", data: 1500 }
      else if (response.data.data !== undefined) {
        coinValue = response.data.data;
      }
      // 구조 3: { data: 1500 }
      else if (response.data !== undefined) {
        coinValue = response.data;
      }

      console.log("추출된 현재 포인트 값:", coinValue);

      if (coinValue !== undefined && typeof coinValue === "number") {
        avatarStore.setCoin(coinValue);
        console.log("AvatarShop 현재 포인트 업데이트 완료:", coinValue);
        console.log("avatarStore.coin 값:", avatarStore.coin);
      } else {
        console.warn("유효한 현재 포인트 값을 찾을 수 없습니다:", response);
        coinError.value = "현재 포인트 데이터를 가져오는데 실패했습니다.";
      }
    } else {
      console.warn("현재 포인트 데이터 형식이 올바르지 않습니다:", response);
      coinError.value = "현재 포인트 데이터를 가져오는데 실패했습니다.";
    }
  } catch (err) {
    console.error("AvatarShop 현재 포인트 조회 에러:", err);
    console.error("에러 상세 정보:", {
      message: err.message,
      status: err.response?.status,
      data: err.response?.data,
      config: err.config,
    });

    let errorMessage = "현재 포인트를 불러오는데 실패했습니다.";

    if (err.response?.status === 401) {
      errorMessage = "로그인이 필요합니다.";
    } else if (err.response?.status === 404) {
      errorMessage = "사용자 정보를 찾을 수 없습니다.";
    } else if (err.response?.status === 500) {
      errorMessage = "서버 오류가 발생했습니다.";
    } else if (err.message) {
      errorMessage = `연결 오류: ${err.message}`;
    }

    coinError.value = errorMessage;
  } finally {
    loadingCoin.value = false;
  }
};

// 코인 상태 조회 (getMyCoinStatus API 사용 - API 명세에 맞게 수정)
const fetchCoinStatus = async () => {
  try {
    loadingCoin.value = true;
    coinError.value = null;

    // 인증 상태 확인
    if (!authStore.isAuthenticated) {
      console.warn("로그인이 필요합니다.");
      return;
    }

    console.log("코인 상태 조회 시작 (getMyCoinStatus API 사용)");
    const response = await getMyCoinStatus();
    console.log("코인 상태 조회 결과:", response);

    // API 명세에 따른 응답 구조 확인
    // { "data": { "amount": 0, "cumulativeAmount": 0, ... }, "message": "string", "status": 200 }
    if (
      response.data &&
      response.data.status === 200 &&
      response.data.data &&
      response.data.data.amount !== undefined
    ) {
      const coinValue = response.data.data.amount;
      console.log("추출된 코인 값:", coinValue);

      if (typeof coinValue === "number") {
        avatarStore.setCoin(coinValue);
        console.log("코인 상태 업데이트 완료:", coinValue);
      } else {
        console.warn("유효한 코인 데이터를 찾을 수 없습니다:", response);
        coinError.value = "코인 상태를 가져오는데 실패했습니다.";
      }
    } else {
      console.warn("API 응답 구조가 올바르지 않습니다:", response.data);
      coinError.value = "코인 상태를 가져오는데 실패했습니다.";
    }
  } catch (err) {
    console.error("코인 상태 조회 에러:", err);

    let errorMessage = "코인 상태를 불러오는데 실패했습니다.";

    if (err.response?.status === 401) {
      errorMessage = "로그인이 필요합니다.";
    } else if (err.response?.status === 404) {
      errorMessage = "사용자 정보를 찾을 수 없습니다.";
    } else if (err.response?.status === 500) {
      errorMessage = "서버 오류가 발생했습니다.";
    } else if (err.message) {
      errorMessage = `연결 오류: ${err.message}`;
    }

    coinError.value = errorMessage;
  } finally {
    loadingCoin.value = false;
  }
};

// 누적 포인트 데이터 가져오기
const fetchCumulativePoints = async () => {
  try {
    loadingCumulative.value = true;
    cumulativeError.value = null;

    // 인증 상태 확인
    if (!authStore.isAuthenticated) {
      console.warn("로그인이 필요합니다.");
      return;
    }

    // 사용자 ID 가져오기
    const userId = authStore.user?.id || authStore.user?.userId || 1;

    console.log("AvatarShop 누적 포인트 데이터 가져오기 시작, userId:", userId);
    const response = await getCumulativeCoin(userId);
    console.log("받아온 누적 포인트 데이터:", response);

    if (response.status === 200 && response.data !== undefined) {
      // 백엔드 응답 구조에 따라 누적 포인트 값 추출
      let cumulativeValue;

      // 구조 1: { status: 200, data: 1500 }
      if (typeof response.data === "number") {
        cumulativeValue = response.data;
      }
      // 구조 2: { status: 200, message: "...", data: 1500 }
      else if (response.data.data !== undefined) {
        cumulativeValue = response.data.data;
      }
      // 구조 3: { data: 1500 }
      else if (response.data !== undefined) {
        cumulativeValue = response.data;
      }

      console.log("AvatarShop 추출된 누적 포인트 값:", cumulativeValue);

      if (
        cumulativeValue !== undefined &&
        typeof cumulativeValue === "number"
      ) {
        avatarStore.setCumulativePoints(cumulativeValue);
        console.log("AvatarShop 누적 포인트 업데이트 완료:", cumulativeValue);
      } else {
        console.warn("유효한 누적 포인트 값을 찾을 수 없습니다:", response);
        cumulativeError.value = "누적 포인트 데이터를 가져오는데 실패했습니다.";
      }
    } else {
      console.warn("누적 포인트 데이터 형식이 올바르지 않습니다:", response);
      cumulativeError.value = "누적 포인트 데이터를 가져오는데 실패했습니다.";
    }
  } catch (err) {
    console.error("AvatarShop 누적 포인트 조회 에러:", err);

    let errorMessage = "누적 포인트를 불러오는데 실패했습니다.";

    if (err.response?.status === 401) {
      errorMessage = "로그인이 필요합니다.";
    } else if (err.response?.status === 404) {
      errorMessage = "사용자 정보를 찾을 수 없습니다.";
    } else if (err.response?.status === 500) {
      errorMessage = "서버 오류가 발생했습니다.";
    } else if (err.message) {
      errorMessage = `연결 오류: ${err.message}`;
    }

    cumulativeError.value = errorMessage;
  } finally {
    loadingCumulative.value = false;
  }
};

// 이미지 에러 핸들링 함수
const handleImageError = (event) => {
  console.error("이미지 로드 실패:", event.target.src);
  // fallback 이미지로 대체
  if (event.target.src !== fallbackAvatar) {
    event.target.src = fallbackAvatar;
  }
};

const handleImageLoad = (event) => {
  console.log("이미지 로드 성공:", event.target.src);
};

// 컴포넌트 마운트 시 서버에서 데이터 가져오기 및 초기화
onMounted(async () => {
  console.log("AvatarShop 컴포넌트 마운트 시작");

  // 서버에서 사용자 의상 데이터 가져오기
  await fetchUserClothes();
  console.log("의상 데이터 로드 후 아이템 상태:", {
    titleItems: titleItems.value.length,
    shirtItems: shirtItems.value.length,
    shoesItems: shoesItems.value.length,
    glassesItems: glassesItems.value.length,
  });

  // 포인트 데이터 가져오기
  fetchCoinStatus();

  // 아바타 상태 동기화
  syncStoreState();

  // 기존 착용 상태를 임시 착용 상태로 복사
  const wearingTitle = titleItems.value.find((item) => item.wearing);
  if (wearingTitle) {
    tempWearingTitle.value = wearingTitle.id;
  } else {
    // 착용 중인 칭호가 없으면 첫 번째 활성화된 칭호 자동 선택
    const firstActiveTitle = titleItems.value.find(
      (item) => getTitleItemStatus(item).isActive
    );
    if (firstActiveTitle) {
      tempWearingTitle.value = firstActiveTitle.id;
    }
  }

  const wearingShirt = shirtItems.value.find((item) => item.wearing);
  if (wearingShirt) {
    tempWearingShirt.value = wearingShirt.id;
  }

  const wearingShoes = shoesItems.value.find((item) => item.wearing);
  if (wearingShoes) {
    tempWearingShoes.value = wearingShoes.id;
  }

  const wearingGlasses = glassesItems.value.filter((item) => item.wearing);
  if (wearingGlasses.length > 0) {
    tempWearingGlasses.value = wearingGlasses.map((item) => item.id);
  }
});

// 기프티콘 상품 데이터 (구매 상태 없음, 포인트 차감만)
const coffeeItems = ref([
  {
    id: 1,
    name: "투썸플레이스 콜드브루 R",
    price: 8100,
    image: twosomeColdBrew,
  },
  {
    id: 2,
    name: "투썸플레이스 카페라떼 R",
    price: 8,
    image: twosomeCafeLatte,
  },
  {
    id: 3,
    name: "투썸플레이스 HOT 카페라떼 R",
    price: 80,
    image: twosomeHotLatte,
  },
  {
    id: 4,
    name: "투썸플레이스 아메리카노 L",
    price: 80,
    image: twosomeAmericano,
  },
]);

const megaboxItems = ref([
  {
    id: 5,
    name: "메가박스 2인 패키지 (2D 일반관람권2+팝콘(L)+음료(R)2)",
    price: 54,
    image: megaboxPopcorn,
  },
]);

const artboxItems = ref([
  {
    id: 6,
    name: "CGV 영화관람권 1인인",
    price: 8,
    image: cgvTicket,
  },
]);

const lotteItems = ref([
  {
    id: 7,
    name: "롯데시네마 스위트콤보",
    price: 20000,
    image: lotteCombo,
  },
  {
    id: 8,
    name: "롯데시네마 2D 1인 영화관람권",
    price: 20,
    image: cgvTicket,
  },
]);

const showPurchaseModal = ref(false);
const pendingPurchase = ref(null);
const pendingPurchaseType = ref(""); // 'shirt' | 'shoes' | 'glasses' | 'gifticon'

function openPurchaseModal(item, type) {
  pendingPurchase.value = item;
  pendingPurchaseType.value = type;
  showPurchaseModal.value = true;
}
function closePurchaseModal() {
  showPurchaseModal.value = false;
  pendingPurchase.value = null;
  pendingPurchaseType.value = "";
  phoneNumber.value = ""; // 전화번호 초기화
  phoneNumberError.value = ""; // 전화번호 에러 메시지 초기화
}

// 전화번호 자동 하이픈 포맷팅
function formatPhoneNumber(event) {
  let value = event.target.value.replace(/[^0-9]/g, "");

  if (value.length <= 3) {
    phoneNumber.value = value;
  } else if (value.length <= 7) {
    phoneNumber.value = value.slice(0, 3) + "-" + value.slice(3);
  } else {
    phoneNumber.value =
      value.slice(0, 3) + "-" + value.slice(3, 7) + "-" + value.slice(7, 11);
  }
}

function closeSuccessModal() {
  showSuccessModal.value = false;
}

function confirmPurchase() {
  if (!pendingPurchase.value) return;

  // 기프티콘 구매 시 전화번호 검증
  if (pendingPurchaseType.value === "gifticon") {
    const phoneDigits = phoneNumber.value.replace(/[^0-9]/g, "");
    if (phoneDigits.length < 10 || phoneDigits.length > 11) {
      phoneNumberError.value = "올바른 전화번호를 입력해주세요.";
      setTimeout(() => {
        phoneNumberError.value = "";
      }, 5000);
      return;
    }
  }

  if (pendingPurchaseType.value === "title") {
    actuallyBuyTitle(pendingPurchase.value);
  } else if (pendingPurchaseType.value === "shirt") {
    actuallyBuyShirt(pendingPurchase.value);
  } else if (pendingPurchaseType.value === "shoes") {
    actuallyBuyShoes(pendingPurchase.value);
  } else if (pendingPurchaseType.value === "glasses") {
    actuallyBuyGlasses(pendingPurchase.value);
  } else if (pendingPurchaseType.value === "gifticon") {
    actuallyBuyGifticon(pendingPurchase.value);
  }
  closePurchaseModal();
}

function actuallyBuyTitle(item) {
  // 칭호 아이템은 구매가 아닌 누적 포인트에 따른 활성화이므로 이 함수는 사용하지 않음
  // 대신 handleTitleItemClick 함수를 사용
  handleTitleItemClick(item);
}
async function actuallyBuyShirt(item) {
  if (!item.purchased && avatarStore.coin < item.price) {
    showCoinError.value = true;
    setTimeout(() => {
      showCoinError.value = false;
    }, 2000);
    return;
  }
  if (!item.purchased) {
    try {
      const userId = authStore.user?.id || authStore.user?.userId || 1;

      // itemId 처리: 디버깅 및 안전한 파싱
      console.log("구매 시도 아이템 정보:", item);
      console.log("item.id 타입:", typeof item.id, "값:", item.id);

      let itemId;
      if (typeof item.id === "string" && item.id.includes("-")) {
        const parts = item.id.split("-");
        console.log("split 결과:", parts);
        itemId = parseInt(parts[1]); // shirt-1 -> 1
      } else if (typeof item.id === "number") {
        itemId = item.id; // 이미 숫자인 경우
      } else if (typeof item.id === "string") {
        // 단순 문자열인 경우 (예: "shoes", "glasses" 등)
        // 서버에서 사용하는 실제 itemId를 매핑
        const itemIdMap = {
          shoes: 1,
          glasses: 1,
          shirt: 1,
          title: 1,
        };
        itemId = itemIdMap[item.id] || 1; // 기본값 1
        console.log("매핑된 itemId:", itemId, "원본:", item.id);
      } else {
        itemId = parseInt(item.id); // 기타 경우
      }

      console.log("추출된 itemId:", itemId, "타입:", typeof itemId);

      // itemId가 유효한 숫자인지 확인
      if (isNaN(itemId)) {
        console.error(
          "유효하지 않은 itemId:",
          itemId,
          "원본 item.id:",
          item.id
        );
        throw new Error("유효하지 않은 아이템 ID입니다.");
      }

      // 서버에 의상 구매 요청 (API 명세에 따른 필수 파라미터만)
      const purchaseData = {
        userId: userId,
        itemId: itemId,
      };

      const response = await insertClothe(purchaseData);

      // API 명세에 따른 응답 확인: { "data": "string", "message": "string", "status": 0 }
      if (response.data && response.data.status === 0) {
        // 구매 성공 시 로컬 상태 업데이트
        item.purchased = true;
        avatarStore.setItemState("shirts", item.id, true, false);

        // 구매 후 자동으로 착용
        handleBuyOrToggleShirt(item, true);

        // 서버에서 업데이트된 포인트 가져오기
        await fetchCoinStatus();

        console.log("상의 구매 완료, 차감된 포인트:", item.price);
      }
    } catch (error) {
      console.error("상의 구매 실패:", error);
      // 구매 실패 시 에러 처리
      showCoinError.value = true;
      setTimeout(() => {
        showCoinError.value = false;
      }, 2000);
    }
  } else {
    // 착용/해제 토글 기존 로직
    handleBuyOrToggleShirt(item, true);
  }
}
async function actuallyBuyShoes(item) {
  if (!item.purchased && avatarStore.coin < item.price) {
    showCoinError.value = true;
    setTimeout(() => {
      showCoinError.value = false;
    }, 2000);
    return;
  }
  if (!item.purchased) {
    try {
      const userId = authStore.user?.id || authStore.user?.userId || 1;

      // itemId 처리: 디버깅 및 안전한 파싱
      console.log("구매 시도 아이템 정보:", item);
      console.log("item.id 타입:", typeof item.id, "값:", item.id);

      let itemId;
      if (typeof item.id === "string" && item.id.includes("-")) {
        const parts = item.id.split("-");
        console.log("split 결과:", parts);
        itemId = parseInt(parts[1]); // shoes-1 -> 1
      } else if (typeof item.id === "number") {
        itemId = item.id; // 이미 숫자인 경우
      } else if (typeof item.id === "string") {
        // 단순 문자열인 경우 (예: "shoes", "glasses" 등)
        // 서버에서 사용하는 실제 itemId를 매핑
        const itemIdMap = {
          shoes: 1,
          glasses: 1,
          shirt: 1,
          title: 1,
        };
        itemId = itemIdMap[item.id] || 1; // 기본값 1
        console.log("매핑된 itemId:", itemId, "원본:", item.id);
      } else {
        itemId = parseInt(item.id); // 기타 경우
      }

      console.log("추출된 itemId:", itemId, "타입:", typeof itemId);

      // itemId가 유효한 숫자인지 확인
      if (isNaN(itemId)) {
        console.error(
          "유효하지 않은 itemId:",
          itemId,
          "원본 item.id:",
          item.id
        );
        throw new Error("유효하지 않은 아이템 ID입니다.");
      }

      // 서버에 의상 구매 요청 (API 명세에 따른 필수 파라미터만)
      const purchaseData = {
        userId: userId,
        itemId: itemId,
      };

      const response = await insertClothe(purchaseData);

      // API 명세에 따른 응답 확인: { "data": "string", "message": "string", "status": 0 }
      if (response.data && response.data.status === 0) {
        // 구매 성공 시 로컬 상태 업데이트
        item.purchased = true;
        avatarStore.setItemState("shoes", item.id, true, false);

        // 구매 후 자동으로 착용
        handleBuyOrToggleShoes(item, true);

        // 서버에서 업데이트된 포인트 가져오기
        await fetchCoinStatus();

        console.log("신발 구매 완료, 차감된 포인트:", item.price);
      }
    } catch (error) {
      console.error("신발 구매 실패:", error);
      // 구매 실패 시 에러 처리
      showCoinError.value = true;
      setTimeout(() => {
        showCoinError.value = false;
      }, 2000);
    }
  } else {
    handleBuyOrToggleShoes(item, true);
  }
}
async function actuallyBuyGlasses(item) {
  if (!item.purchased && avatarStore.coin < item.price) {
    showCoinError.value = true;
    setTimeout(() => {
      showCoinError.value = false;
    }, 2000);
    return;
  }
  if (!item.purchased) {
    try {
      const userId = authStore.user?.id || authStore.user?.userId || 1;

      // itemId 처리: 디버깅 및 안전한 파싱
      console.log("구매 시도 아이템 정보:", item);
      console.log("item.id 타입:", typeof item.id, "값:", item.id);

      let itemId;
      if (typeof item.id === "string" && item.id.includes("-")) {
        const parts = item.id.split("-");
        console.log("split 결과:", parts);
        itemId = parseInt(parts[1]); // glasses-1 -> 1
      } else if (typeof item.id === "number") {
        itemId = item.id; // 이미 숫자인 경우
      } else if (typeof item.id === "string") {
        // 단순 문자열인 경우 (예: "shoes", "glasses" 등)
        // 서버에서 사용하는 실제 itemId를 매핑
        const itemIdMap = {
          shoes: 1,
          glasses: 1,
          shirt: 1,
          title: 1,
        };
        itemId = itemIdMap[item.id] || 1; // 기본값 1
        console.log("매핑된 itemId:", itemId, "원본:", item.id);
      } else {
        itemId = parseInt(item.id); // 기타 경우
      }

      console.log("추출된 itemId:", itemId, "타입:", typeof itemId);

      // itemId가 유효한 숫자인지 확인
      if (isNaN(itemId)) {
        console.error(
          "유효하지 않은 itemId:",
          itemId,
          "원본 item.id:",
          item.id
        );
        throw new Error("유효하지 않은 아이템 ID입니다.");
      }

      // 서버에 의상 구매 요청 (API 명세에 따른 필수 파라미터만)
      const purchaseData = {
        userId: userId,
        itemId: itemId,
      };

      const response = await insertClothe(purchaseData);

      // API 명세에 따른 응답 확인: { "data": "string", "message": "string", "status": 0 }
      if (response.data && response.data.status === 0) {
        // 구매 성공 시 로컬 상태 업데이트
        item.purchased = true;
        avatarStore.setItemState("glasses", item.id, true, false);

        // 구매 후 자동으로 착용
        handleBuyOrToggleGlasses(item, true);

        // 서버에서 업데이트된 포인트 가져오기
        await fetchCoinStatus();

        console.log("액세서리 구매 완료, 차감된 포인트:", item.price);
      }
    } catch (error) {
      console.error("액세서리 구매 실패:", error);
      // 구매 실패 시 에러 처리
      showCoinError.value = true;
      setTimeout(() => {
        showCoinError.value = false;
      }, 2000);
    }
  } else {
    handleBuyOrToggleGlasses(item, true);
  }
}
async function actuallyBuyGifticon(item) {
  if (avatarStore.coin < item.price) {
    showCoinError.value = true;
    setTimeout(() => {
      showCoinError.value = false;
    }, 2000);
    return;
  }

  try {
    const userId = authStore.user?.id || authStore.user?.userId || 1;

    // itemId 처리: 디버깅 및 안전한 파싱
    console.log("구매 시도 아이템 정보:", item);
    console.log("item.id 타입:", typeof item.id, "값:", item.id);

    let itemId;
    if (typeof item.id === "string" && item.id.includes("-")) {
      const parts = item.id.split("-");
      console.log("split 결과:", parts);
      itemId = parseInt(parts[1]); // gifticon-1 -> 1
    } else if (typeof item.id === "number") {
      itemId = item.id; // 이미 숫자인 경우
    } else if (typeof item.id === "string") {
      // 단순 문자열인 경우 (예: "shoes", "glasses" 등)
      // 서버에서 사용하는 실제 itemId를 매핑
      const itemIdMap = {
        shoes: 1,
        glasses: 1,
        shirt: 1,
        title: 1,
      };
      itemId = itemIdMap[item.id] || 1; // 기본값 1
      console.log("매핑된 itemId:", itemId, "원본:", item.id);
    } else {
      itemId = parseInt(item.id); // 기타 경우
    }

    console.log("추출된 itemId:", itemId, "타입:", typeof itemId);

    // itemId가 유효한 숫자인지 확인
    if (isNaN(itemId)) {
      console.error("유효하지 않은 itemId:", itemId, "원본 item.id:", item.id);
      throw new Error("유효하지 않은 아이템 ID입니다.");
    }

    // 서버에 기프티콘 구매 요청 (API 명세에 따른 필수 파라미터만)
    const purchaseData = {
      userId: userId,
      itemId: itemId,
    };

    const response = await insertClothe(purchaseData);

    // API 명세에 따른 응답 확인: { "data": "string", "message": "string", "status": 0 }
    if (response.data && response.data.status === 0) {
      // 구매 성공 시 서버에서 업데이트된 포인트 가져오기
      await fetchCoinStatus();

      console.log("기프티콘 구매 완료, 차감된 포인트:", item.price);
    }
  } catch (error) {
    console.error("기프티콘 구매 실패:", error);
    // 구매 실패 시 에러 처리
    showCoinError.value = true;
    setTimeout(() => {
      showCoinError.value = false;
    }, 2000);
  }
}

function goBack() {
  router.back();
}

async function handleBuyOrToggleShirt(item, skipModal = false) {
  if (!item.purchased && !skipModal) {
    openPurchaseModal(item, "shirt");
    return;
  }
  if (!item.purchased && avatarStore.coin < item.price) {
    showCoinError.value = true;
    setTimeout(() => {
      showCoinError.value = false;
    }, 2000);
    return;
  }
  if (!item.purchased) {
    try {
      const userId = authStore.user?.id || authStore.user?.userId || 1;

      // itemId 처리: 디버깅 및 안전한 파싱
      console.log("구매 시도 아이템 정보:", item);
      console.log("item.id 타입:", typeof item.id, "값:", item.id);

      let itemId;
      if (typeof item.id === "string" && item.id.includes("-")) {
        const parts = item.id.split("-");
        console.log("split 결과:", parts);
        itemId = parseInt(parts[1]); // shirt-1 -> 1
      } else if (typeof item.id === "number") {
        itemId = item.id; // 이미 숫자인 경우
      } else {
        itemId = parseInt(item.id); // 문자열을 숫자로 변환
      }

      console.log("추출된 itemId:", itemId, "타입:", typeof itemId);

      // itemId가 유효한 숫자인지 확인
      if (isNaN(itemId)) {
        console.error(
          "유효하지 않은 itemId:",
          itemId,
          "원본 item.id:",
          item.id
        );
        throw new Error("유효하지 않은 아이템 ID입니다.");
      }

      // 서버에 의상 구매 요청 (API 명세에 따른 필수 파라미터만)
      const purchaseData = {
        userId: userId,
        itemId: itemId,
      };

      const response = await insertClothe(purchaseData);

      // API 명세에 따른 응답 확인: { "data": "string", "message": "string", "status": 0 }
      if (response.data && response.data.status === 0) {
        // 구매 성공 시 로컬 상태 업데이트
        item.purchased = true;
        avatarStore.setItemState("shirts", item.id, true, false);

        // 서버에서 업데이트된 포인트 가져오기
        await fetchCoinStatus();

        console.log(
          "상의 구매 완료 (handleBuyOrToggle), 차감된 포인트:",
          item.price
        );
      }
    } catch (error) {
      console.error("상의 구매 실패 (handleBuyOrToggle):", error);
      showCoinError.value = true;
      setTimeout(() => {
        showCoinError.value = false;
      }, 2000);
      return;
    }
  }

  // 임시 착용 상태 토글
  if (tempWearingShirt.value === item.id) {
    // 착용 해제
    tempWearingShirt.value = null;
  } else {
    // 현재 아이템 착용 (다른 아이템은 자동으로 해제됨)
    tempWearingShirt.value = item.id;
  }
}

async function handleBuyOrToggleShoes(item, skipModal = false) {
  if (!item.purchased && !skipModal) {
    openPurchaseModal(item, "shoes");
    return;
  }
  if (!item.purchased && avatarStore.coin < item.price) {
    showCoinError.value = true;
    setTimeout(() => {
      showCoinError.value = false;
    }, 2000);
    return;
  }
  if (!item.purchased) {
    try {
      const userId = authStore.user?.id || authStore.user?.userId || 1;

      // itemId 처리: 디버깅 및 안전한 파싱
      console.log("구매 시도 아이템 정보:", item);
      console.log("item.id 타입:", typeof item.id, "값:", item.id);

      let itemId;
      if (typeof item.id === "string" && item.id.includes("-")) {
        const parts = item.id.split("-");
        console.log("split 결과:", parts);
        itemId = parseInt(parts[1]); // shoes-1 -> 1
      } else if (typeof item.id === "number") {
        itemId = item.id; // 이미 숫자인 경우
      } else {
        itemId = parseInt(item.id); // 문자열을 숫자로 변환
      }

      console.log("추출된 itemId:", itemId, "타입:", typeof itemId);

      // itemId가 유효한 숫자인지 확인
      if (isNaN(itemId)) {
        console.error(
          "유효하지 않은 itemId:",
          itemId,
          "원본 item.id:",
          item.id
        );
        throw new Error("유효하지 않은 아이템 ID입니다.");
      }

      // 서버에 의상 구매 요청 (API 명세에 따른 필수 파라미터만)
      const purchaseData = {
        userId: userId,
        itemId: itemId,
      };

      const response = await insertClothe(purchaseData);

      // API 명세에 따른 응답 확인: { "data": "string", "message": "string", "status": 0 }
      if (response.data && response.data.status === 0) {
        // 구매 성공 시 로컬 상태 업데이트
        item.purchased = true;
        avatarStore.setItemState("shoes", item.id, true, false);

        // 서버에서 업데이트된 포인트 가져오기
        await fetchCoinStatus();

        console.log(
          "신발 구매 완료 (handleBuyOrToggle), 차감된 포인트:",
          item.price
        );
      }
    } catch (error) {
      console.error("신발 구매 실패 (handleBuyOrToggle):", error);
      showCoinError.value = true;
      setTimeout(() => {
        showCoinError.value = false;
      }, 2000);
      return;
    }
  }

  // 임시 착용 상태 토글
  if (tempWearingShoes.value === item.id) {
    // 착용 해제
    tempWearingShoes.value = null;
  } else {
    // 현재 아이템 착용 (다른 아이템은 자동으로 해제됨)
    tempWearingShoes.value = item.id;
  }
}

async function handleBuyOrToggleGlasses(item, skipModal = false) {
  if (!item.purchased && !skipModal) {
    openPurchaseModal(item, "glasses");
    return;
  }
  if (!item.purchased && avatarStore.coin < item.price) {
    showCoinError.value = true;
    setTimeout(() => {
      showCoinError.value = false;
    }, 2000);
    return;
  }
  if (!item.purchased) {
    try {
      const userId = authStore.user?.id || authStore.user?.userId || 1;

      // itemId 처리: 디버깅 및 안전한 파싱
      console.log("구매 시도 아이템 정보:", item);
      console.log("item.id 타입:", typeof item.id, "값:", item.id);

      let itemId;
      if (typeof item.id === "string" && item.id.includes("-")) {
        const parts = item.id.split("-");
        console.log("split 결과:", parts);
        itemId = parseInt(parts[1]); // glasses-1 -> 1
      } else if (typeof item.id === "number") {
        itemId = item.id; // 이미 숫자인 경우
      } else {
        itemId = parseInt(item.id); // 문자열을 숫자로 변환
      }

      console.log("추출된 itemId:", itemId, "타입:", typeof itemId);

      // itemId가 유효한 숫자인지 확인
      if (isNaN(itemId)) {
        console.error(
          "유효하지 않은 itemId:",
          itemId,
          "원본 item.id:",
          item.id
        );
        throw new Error("유효하지 않은 아이템 ID입니다.");
      }

      // 서버에 의상 구매 요청 (API 명세에 따른 필수 파라미터만)
      const purchaseData = {
        userId: userId,
        itemId: itemId,
      };

      const response = await insertClothe(purchaseData);

      // API 명세에 따른 응답 확인: { "data": "string", "message": "string", "status": 0 }
      if (response.data && response.data.status === 0) {
        // 구매 성공 시 로컬 상태 업데이트
        item.purchased = true;
        avatarStore.setItemState("glasses", item.id, true, false);

        // 서버에서 업데이트된 포인트 가져오기
        await fetchCoinStatus();

        console.log(
          "액세서리 구매 완료 (handleBuyOrToggle), 차감된 포인트:",
          item.price
        );
      }
    } catch (error) {
      console.error("액세서리 구매 실패 (handleBuyOrToggle):", error);
      showCoinError.value = true;
      setTimeout(() => {
        showCoinError.value = false;
      }, 2000);
      return;
    }
  }

  // 임시 착용 상태 토글 (다른 아이템에 영향 없음)
  const index = tempWearingGlasses.value.indexOf(item.id);
  if (index > -1) {
    // 착용 해제
    tempWearingGlasses.value.splice(index, 1);
  } else {
    // 착용 (다른 아이템 착용 해제하지 않음)
    tempWearingGlasses.value.push(item.id);
  }
}

async function handleBuyGifticon(item, skipModal = false) {
  if (!skipModal) {
    openPurchaseModal(item, "gifticon");
    return;
  }
  if (avatarStore.coin < item.price) {
    showCoinError.value = true;
    setTimeout(() => {
      showCoinError.value = false;
    }, 2000);
    return;
  }

  try {
    const userId = authStore.user?.id || authStore.user?.userId || 1;

    // itemId 처리: 디버깅 및 안전한 파싱
    console.log("구매 시도 아이템 정보:", item);
    console.log("item.id 타입:", typeof item.id, "값:", item.id);

    let itemId;
    if (typeof item.id === "string" && item.id.includes("-")) {
      const parts = item.id.split("-");
      console.log("split 결과:", parts);
      itemId = parseInt(parts[1]); // gifticon-1 -> 1
    } else if (typeof item.id === "number") {
      itemId = item.id; // 이미 숫자인 경우
    } else {
      itemId = parseInt(item.id); // 문자열을 숫자로 변환
    }

    console.log("추출된 itemId:", itemId, "타입:", typeof itemId);

    // itemId가 유효한 숫자인지 확인
    if (isNaN(itemId)) {
      console.error("유효하지 않은 itemId:", itemId, "원본 item.id:", item.id);
      throw new Error("유효하지 않은 아이템 ID입니다.");
    }

    // 서버에 기프티콘 구매 요청 (API 명세에 따른 필수 파라미터만)
    const purchaseData = {
      userId: userId,
      itemId: itemId,
    };

    const response = await insertClothe(purchaseData);

    // API 명세에 따른 응답 확인: { "data": "string", "message": "string", "status": 0 }
    if (response.data && response.data.status === 0) {
      // 구매 성공 시 새로운 코인 상태 API로 업데이트된 포인트 가져오기
      await fetchCoinStatus();

      console.log(
        "기프티콘 구매 완료 (handleBuyGifticon), 차감된 포인트:",
        item.price
      );
    }
  } catch (error) {
    console.error("기프티콘 구매 실패 (handleBuyGifticon):", error);
    showCoinError.value = true;
    setTimeout(() => {
      showCoinError.value = false;
    }, 2000);
  }
}

function handleTitleItemClick(item) {
  const status = getTitleItemStatus(item);

  // 비활성화된 아이템은 클릭 불가
  if (!status.isActive) {
    return;
  }

  // 칭호는 무조건 하나는 장착되어야 하므로 착용 해제 불가
  // 다른 아이템을 선택하면 자동으로 교체됨
  tempWearingTitle.value = item.id;
}

async function wearAvatar() {
  // 임시 착용 상태를 실제로 적용
  if (
    !tempWearingTitle.value &&
    !tempWearingShirt.value &&
    !tempWearingShoes.value &&
    tempWearingGlasses.value.length === 0
  ) {
    alert("착용할 아바타 아이템을 먼저 선택해주세요.");
    return;
  }

  // 칭호가 없으면 기본 칭호(첫 번째 활성화된 아이템) 자동 선택
  if (!tempWearingTitle.value) {
    const firstActiveTitle = titleItems.value.find(
      (item) => getTitleItemStatus(item).isActive
    );
    if (firstActiveTitle) {
      tempWearingTitle.value = firstActiveTitle.id;
    }
  }

  try {
    // 서버 API 호출 없이 로컬 상태만 업데이트 (임시 해결책)
    console.log("아바타 착용 - 로컬 상태 업데이트");

    // 기존 착용 상태 초기화
    titleItems.value.forEach((item) => {
      item.wearing = false;
      avatarStore.setItemState("titles", item.id, true, false);
    });
    shirtItems.value.forEach((item) => {
      item.wearing = false;
      avatarStore.setItemState("shirts", item.id, item.purchased, false);
    });
    shoesItems.value.forEach((item) => {
      item.wearing = false;
      avatarStore.setItemState("shoes", item.id, item.purchased, false);
    });
    glassesItems.value.forEach((item) => {
      item.wearing = false;
      avatarStore.setItemState("glasses", item.id, item.purchased, false);
    });

    // 임시 착용 상태를 실제로 적용
    if (tempWearingTitle.value) {
      const titleItem = titleItems.value.find(
        (item) => item.id === tempWearingTitle.value
      );
      if (titleItem) {
        titleItem.wearing = true;
        avatarStore.setItemState("titles", titleItem.id, true, true);
      }
    }

    if (tempWearingShirt.value) {
      const shirtItem = shirtItems.value.find(
        (item) => item.id === tempWearingShirt.value
      );
      if (shirtItem) {
        shirtItem.wearing = true;
        avatarStore.setItemState(
          "shirts",
          shirtItem.id,
          shirtItem.purchased,
          true
        );
      }
    }

    if (tempWearingShoes.value) {
      const shoesItem = shoesItems.value.find(
        (item) => item.id === tempWearingShoes.value
      );
      if (shoesItem) {
        shoesItem.wearing = true;
        avatarStore.setItemState(
          "shoes",
          shoesItem.id,
          shoesItem.purchased,
          true
        );
      }
    }

    tempWearingGlasses.value.forEach((glassesId) => {
      const glassesItem = glassesItems.value.find(
        (item) => item.id === glassesId
      );
      if (glassesItem) {
        glassesItem.wearing = true;
        avatarStore.setItemState(
          "glasses",
          glassesItem.id,
          glassesItem.purchased,
          true
        );
      }
    });

    // 성공 모달 표시
    showSuccessModal.value = true;
    console.log("아바타 착용 완료 - 로컬 상태 업데이트됨");
  } catch (error) {
    console.error("아바타 업데이트 실패:", error);
    alert("아바타 업데이트에 실패했습니다. 다시 시도해주세요.");
  }
}
</script>

<style scoped>
.shop-container {
  min-height: 100vh;
  max-width: 540px;
  margin: 0 auto;
  background: #fff;
  position: relative;
  padding-bottom: 100px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  max-height: 100vh;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.shop-container::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.tab-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 5px;
}

.avatar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.coin-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.item-category,
.item-list {
  width: 100%;
  max-width: 420px;
  margin-left: auto;
  margin-right: auto;
}

.item-list {
  justify-content: center;
}

.shop-title,
.coin-balance {
  text-align: center;
  width: 100%;
}

.avatar-pixel {
  width: 160px;
  height: 250px;
  background: #fff;
  border-radius: 20px;
  border: 2px solid #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-bottom: 0;
}

.avatar-img {
  width: 160px;
  height: 250px;
  z-index: 1;
  object-fit: contain;
  background: transparent;
  display: block;
}

.title-img {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 160px;
  height: 250px;
  transform: translate(-50%, -50%);
  z-index: 2;
  pointer-events: none;
}

.shirt-img {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 160px;
  height: 250px;
  transform: translate(-50%, -50%);
  z-index: 2;
  pointer-events: none;
}

.shoes-img {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 160px;
  height: 250px;
  transform: translate(-50%, -50%);
  z-index: 2;
  pointer-events: none;
}

.glasses-img {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 160px;
  height: 250px;
  transform: translate(-50%, -50%);
  z-index: 2;
  pointer-events: none;
}

.coin-balance {
  background: #faf7ff;
  border-radius: 16px;
  padding: 6px 18px;
  font-size: 18px;
  color: #222;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(160, 120, 255, 0.08);
  display: flex;
  align-items: center;
  gap: 6px;
}

.coin-icon {
  font-size: 18px;
}

.coin-value {
  font-weight: 600;
  color: #222;
}

.coin-value.loading {
  color: #666;
  animation: pulse 1.5s infinite;
}

.coin-value.error {
  color: #e74c3c;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.item-category {
  margin: 18px 0 6px 24px;
  font-size: 15px;
  color: #888;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
}

.category-icon {
  font-size: 18px;
}

.item-list {
  display: flex;
  gap: 6px;
  margin: 0 0 12px 24px;
  justify-content: flex-start;
  max-width: 390px;
  margin-left: 24px;
  margin-right: auto;
}

.item-card {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 8px 6px 4px 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80px;
  min-width: 80px;
  box-shadow: 0 2px 8px rgba(160, 120, 255, 0.06);
  font-size: 18px;
  font-weight: 500;
  position: relative;
  cursor: pointer;
  border: 2px solid transparent;
  transition: border 0.2s;
  flex-shrink: 0;
}

.item-card.active {
  border: 2px solid #10b981;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
}

.item-card.inactive {
  opacity: 0.5;
  cursor: not-allowed;
  border: 2px solid #e5e7eb;
}

.item-card.inactive:hover {
  transform: none;
}

.item-card.selected {
  border: 2px solid #10b981;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
}

.item-requirement {
  font-size: 11px;
  color: #6b7280;
  margin-top: 2px;
  font-weight: 600;
  text-align: center;
}

.inactive-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.inactive-text {
  color: white;
  font-size: 15px;
  font-weight: 600;
  text-align: center;
  padding: 0 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
}

.inactive-text > div {
  line-height: 1.3;
}

.item-img {
  width: 35px;
  height: 35px;
  margin-bottom: 4px;
}

.item-price {
  font-size: 13px;
  color: #a78bfa;
  margin-top: 2px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 2px;
}

.coin-error {
  color: #e53935;
  font-size: 15px;
  font-weight: bold;
  margin: 8px 0 0 0;
  text-align: center;
}

@media (max-width: 540px) {
  .shop-container,
  .status-bar,
  .shop-header,
  .bottom-nav {
    max-width: 100vw;
  }
}

/* === 헤더 스타일 Dictionary.vue와 동일하게 적용 === */
.dictionary-header-bar {
  margin-top: 32px;
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 48px;
  padding: 0;
  margin-bottom: 18px;
  z-index: 1100;
}
.dictionary-header-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  margin: 0;
}
.back-btn {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background: none;
  border: none;
  font-size: 22px;
  color: #222;
  cursor: pointer;
  padding: 2px 8px 2px 2px;
  border-radius: 8px;
  transition: background 0.15s;
  position: relative;
  z-index: 1200;
}
.back-btn:hover {
  background: #f3f3f3;
}
/* === 기존 shop-header-bar, shop-header-title 스타일 제거 또는 무시 === */

.subtab-row {
  display: flex;
  width: 100%;
  margin-bottom: 10px;
  margin-top: 18px;
}
.subtab {
  flex: 1 1 0;
  text-align: center;
  color: #888;
  cursor: pointer;
  padding-bottom: 2px;
  border-bottom: 2px solid transparent;
  font-size: 16px;
  font-weight: 600;
  background: none;
  transition: color 0.2s, border-bottom 0.2s;
}
.subtab.active {
  color: var(--color-main-light, #8e74e3);
  border-bottom: 2px solid var(--color-main-light, #8e74e3);
  font-weight: bold;
}

.subtab-row .subtab:first-child {
  margin-left: 20px; /* Adjust as needed */
}
.subtab-row .subtab:last-child {
  margin-right: 20px; /* Adjust as needed */
}

.pants-img {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 100px;
  height: 100px;
  transform: translate(-50%, -50%);
  z-index: 2;
  pointer-events: none;
}

.acc-img {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 100px;
  height: 100px;
  transform: translate(-50%, -50%);
  z-index: 3;
  pointer-events: none;
}

.own-label {
  font-size: 11px;
  color: #a78bfa;
  margin-top: 2px;
  font-weight: 600;
}

.wearing-label {
  font-size: 11px;
  color: #fff;
  background: #10b981;
  border-radius: 8px;
  padding: 1px 8px;
  margin-top: 2px;
  font-weight: 600;
  margin-left: 4px;
}

.wearing-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(16, 185, 129, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.wearing-icon {
  font-size: 24px;
  color: #10b981;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  padding: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.check-icon {
  position: absolute;
  right: 6px;
  bottom: 6px;
  font-size: 18px;
  color: #a78bfa;
  background: #fff;
  border-radius: 50%;
  z-index: 10;
}

.item-card {
  position: relative;
}

/* 기프티콘 스타일 */
.gifticon-categories {
  display: flex;
  gap: 12px;
  margin: 20px 0;
  width: 100%;
  max-width: 420px;
  padding: 0 20px;
}

.category-btn {
  flex: 1;
  padding: 12px 16px;
  border-radius: 12px;
  background: #f5f5f5;
  color: #666;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.category-btn.active {
  background: #a78bfa;
  color: #fff;
}

.category-btn-icon {
  font-size: 16px;
}

.gifticon-items {
  width: 100%;
  max-width: 420px;
  padding: 0 20px;
}

.brand-section {
  margin-bottom: 24px;
}

.brand-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
  padding-left: 4px;
}

.gifticon-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background 0.15s;
  position: relative;
}

.gifticon-item:hover {
  background: #f9f9f9;
}

.gifticon-item:last-child {
  border-bottom: none;
}

.gifticon-item-img {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
}

.gifticon-item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.gifticon-item-name {
  font-size: 14px;
  color: #333;
  font-weight: 500;
  line-height: 1.3;
}

.gifticon-item-price {
  font-size: 13px;
  color: #a78bfa;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
}

.cash-icon {
  font-size: 14px;
}

.gifticon-check-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 20px;
  color: #10b981;
  background: #fff;
  border-radius: 50%;
  z-index: 10;
}

.item-card.purchased {
  border: 2px solid #10b981;
}

.item-card.selected {
  border: 2px solid #a78bfa;
  background: #f3e8ff;
}

.coin-error-space {
  min-height: 40px; /* Further increased to ensure no UI shift */
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 구매 확인 모달 스타일 */
.purchase-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}
.purchase-modal {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
  padding: 32px 24px 24px 24px;
  min-width: 260px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.purchase-modal-message {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 24px;
  color: #222;
  text-align: center;
}

.phone-input-section {
  width: 100%;
  margin-bottom: 24px;
}

.phone-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.2s;
}

.phone-input:focus {
  border-color: #4318d1;
}

.phone-input::placeholder {
  color: #999;
}

.phone-error-message {
  color: #ef4444;
  font-size: 14px;
  margin-top: 8px;
  text-align: left;
}
.purchase-modal-actions {
  display: flex;
  gap: 18px;
}
.modal-cancel-btn,
.modal-confirm-btn {
  padding: 8px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  cursor: pointer;
}
.modal-cancel-btn {
  background: #eee;
  color: #333;
}
.modal-confirm-btn {
  background: #4318d1;
  color: #fff;
}

/* 아바타 착용 버튼 스타일 */
.wear-avatar-section {
  width: 100%;
  max-width: 420px;
  margin-top: 20px;
  margin-bottom: 20px;
  padding: 0 20px;
}

.wear-avatar-btn {
  width: 100%;
  padding: 12px 16px;
  background: #a78bfa;
  color: #fff;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(167, 139, 250, 0.2);
  transition: background 0.2s;
}

.wear-avatar-btn:hover {
  background: #9370ea;
}

/* 아바타 적용 성공 모달 스타일 */
.success-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}
.success-modal {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
  padding: 32px 24px 24px 24px;
  min-width: 260px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.success-modal-icon {
  font-size: 48px;
  color: #10b981;
  margin-bottom: 16px;
}
.success-modal-message {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 24px;
  color: #222;
  text-align: center;
}
.success-modal-actions {
  display: flex;
  gap: 18px;
}

.success-modal-actions .modal-confirm-btn {
  padding: 12px 32px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  background: #4318d1;
  color: #fff;
  transition: background 0.2s;
}

.success-modal-actions .modal-confirm-btn:hover {
  background: #6c4cf1;
}
</style>
