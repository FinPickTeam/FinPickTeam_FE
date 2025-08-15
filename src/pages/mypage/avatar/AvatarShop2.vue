<template>
  <div class="shop-container">
    <!-- 헤더 영역 -->
    <div class="dictionary-header-bar">
      <button class="back-btn" @click="goBack">
        <font-awesome-icon :icon="['fas', 'angle-left']" />
      </button>
      <span class="dictionary-header-title">아바타 상점</span>
    </div>

    <!-- 아바타 및 코인 (항상 표시) -->
    <div class="avatar-section">
      <div class="avatar-container">
        <div class="avatar-pixel">
          <img
            :src="avatarBase"
            class="avatar-img"
            alt="아바타"
            @load="onAvatarImageLoad"
            @error="onAvatarImageError"
            v-show="avatarImageLoaded"
          />
          <div v-if="!avatarImageLoaded" class="avatar-loading">
            <span>아바타 로딩 중...</span>
          </div>
          <div v-if="avatarImageError" class="avatar-error">
            <span>아바타 이미지를 불러올 수 없습니다</span>
          </div>
          <div v-if="previewLevel || wearingLevel" class="title-placeholder">
            <img
              :src="
                previewLevel ? previewLevel.imageUrl : wearingLevel.imageUrl
              "
              :alt="previewLevel ? previewLevel.name : wearingLevel.name"
              class="wearing-item-img"
              @error="onWearingItemImageError"
            />
          </div>
          <div v-else class="title-placeholder">
            <span class="item-text"></span>
          </div>
          <div v-if="previewTop || wearingTop" class="shirt-placeholder">
            <img
              :src="previewTop ? previewTop.imageUrl : wearingTop.imageUrl"
              :alt="previewTop ? previewTop.name : wearingTop.name"
              class="wearing-item-img"
              @error="onWearingItemImageError"
            />
          </div>
          <div v-else class="shirt-placeholder">
            <span class="item-text"></span>
          </div>
          <div v-if="previewShoes || wearingShoes" class="shoes-placeholder">
            <img
              :src="
                previewShoes ? previewShoes.imageUrl : wearingShoes.imageUrl
              "
              :alt="previewShoes ? previewShoes.name : wearingShoes.name"
              class="wearing-item-img"
              @error="onWearingItemImageError"
            />
          </div>
          <div v-else class="shoes-placeholder">
            <span class="item-text"></span>
          </div>
          <div
            v-if="previewAccessory || wearingAccessory"
            class="glasses-placeholder"
          >
            <img
              :src="
                previewAccessory
                  ? previewAccessory.imageUrl
                  : wearingAccessory.imageUrl
              "
              :alt="
                previewAccessory ? previewAccessory.name : wearingAccessory.name
              "
              class="wearing-item-img"
              @error="onWearingItemImageError"
            />
          </div>
          <div v-else class="glasses-placeholder">
            <span class="item-text"></span>
          </div>
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
          <span v-else class="coin-value">{{ currentCoin }}</span>
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
      <div class="item-category" data-category="title">
        <span class="category-icon">👑</span> 칭호
      </div>
      <div class="item-list">
        <div
          v-for="item in titleItems"
          :key="item.itemId"
          class="item-card"
          :class="{
            owned: isOwned(item.itemId, 'level'),
            wearing: isWearing(item.itemId, 'level'),
            disabled: !item.isAvailable,
          }"
          @click="item.isAvailable ? handleItemClick(item, 'level') : null"
        >
          <div
            class="item-image"
            :class="{ 'disabled-image': !item.isAvailable }"
          >
            <img
              :src="resolveImage(item)"
              :alt="item.name"
              class="item-img"
              @error="onImgError"
            />
            <div v-if="!item.isAvailable" class="level-requirement-overlay">
              <span class="requirement-text">{{ item.requirementText }}</span>
            </div>
          </div>
          <div class="item-info">
            <span
              class="item-name"
              :class="{ 'disabled-text': !item.isAvailable }"
              >{{ item.name }}</span
            >
            <span v-if="!item.isAvailable" class="item-requirement">
              {{ item.requirementText }}
            </span>
          </div>
          <div class="item-status">
            <span v-if="!item.isAvailable" class="disabled-badge">잠김</span>
            <span
              v-else-if="isWearing(item.itemId, 'level')"
              class="wearing-badge"
              >착용중</span
            >
            <span v-else class="owned-badge">선택가능</span>
          </div>
        </div>
      </div>

      <!-- 상의 아이템 -->
      <div class="item-category" data-category="shirt">
        <span class="category-icon">👕</span> 상의
      </div>
      <div class="item-list">
        <div
          v-for="item in shirtItems"
          :key="item.itemId"
          class="item-card"
          :class="{
            owned: isOwned(item.itemId, 'top'),
            wearing: isWearing(item.itemId, 'top'),
          }"
          @click="handleItemClick(item, 'top')"
        >
          <div v-if="resolveImage(item)" class="item-image">
            <img
              :src="resolveImage(item)"
              :alt="item.name"
              class="item-img"
              @error="onImgError"
            />
          </div>
          <div v-else class="item-image-placeholder">
            <span class="item-image-text">{{ item.name }}</span>
          </div>
          <div class="item-info">
            <span class="item-name">{{ item.name }}</span>
            <span class="item-price">🪙 {{ item.cost }}</span>
          </div>
          <div class="item-status">
            <span v-if="isOwned(item.itemId, 'top')" class="owned-badge"
              >보유</span
            >
            <span
              v-else-if="isWearing(item.itemId, 'top')"
              class="wearing-badge"
              >착용중</span
            >
            <span v-else class="buy-badge">구매</span>
          </div>
        </div>
      </div>

      <!-- 신발 아이템 -->
      <div class="item-category" data-category="shoes">
        <span class="category-icon">👟</span> 신발
      </div>
      <div class="item-list">
        <div
          v-for="item in shoesItems"
          :key="item.itemId"
          class="item-card"
          :class="{
            owned: isOwned(item.itemId, 'shoes'),
            wearing: isWearing(item.itemId, 'shoes'),
          }"
          @click="handleItemClick(item, 'shoes')"
        >
          <div v-if="resolveImage(item)" class="item-image">
            <img
              :src="resolveImage(item)"
              :alt="item.name"
              class="item-img"
              @error="onImgError"
            />
          </div>
          <div v-else class="item-image-placeholder">
            <span class="item-image-text">{{ item.name }}</span>
          </div>
          <div class="item-info">
            <span class="item-name">{{ item.name }}</span>
            <span class="item-price">🪙 {{ item.cost }}</span>
          </div>
          <div class="item-status">
            <span v-if="isOwned(item.itemId, 'shoes')" class="owned-badge"
              >보유</span
            >
            <span
              v-else-if="isWearing(item.itemId, 'shoes')"
              class="wearing-badge"
              >착용중</span
            >
            <span v-else class="buy-badge">구매</span>
          </div>
        </div>
      </div>

      <!-- 액세서리 아이템 -->
      <div class="item-category" data-category="accessory">
        <span class="category-icon">🕶️</span> 액세서리
      </div>
      <div class="item-list">
        <div
          v-for="item in glassesItems"
          :key="item.itemId"
          class="item-card"
          :class="{
            owned: isOwned(item.itemId, 'accessory'),
            wearing: isWearing(item.itemId, 'accessory'),
          }"
          @click="handleItemClick(item, 'accessory')"
        >
          <div v-if="resolveImage(item)" class="item-image">
            <img
              :src="resolveImage(item)"
              :alt="item.name"
              class="item-img"
              @error="onImgError"
            />
          </div>
          <div v-else class="item-image-placeholder">
            <span class="item-image-text">{{ item.name }}</span>
          </div>
          <div class="item-info">
            <span class="item-name">{{ item.name }}</span>
            <span class="item-price">🪙 {{ item.cost }}</span>
          </div>
          <div class="item-status">
            <span v-if="isOwned(item.itemId, 'accessory')" class="owned-badge"
              >보유</span
            >
            <span
              v-else-if="isWearing(item.itemId, 'accessory')"
              class="wearing-badge"
              >착용중</span
            >
            <span v-else class="buy-badge">구매</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 기프티콘 탭 내용 -->
    <div v-if="activeTab === 'gifticon'" class="tab-content">
      <div class="item-category">
        <span class="category-icon">🎁</span> 기프티콘
      </div>
      <div class="item-list">
        <div
          v-for="item in gifticonItems"
          :key="item.itemId"
          class="item-card"
          :class="{ owned: isOwned(item.itemId, 'giftCard') }"
          @click="handleItemClick(item, 'giftCard')"
        >
          <div v-if="item.imageUrl" class="item-image">
            <img :src="item.imageUrl" :alt="item.name" class="item-img" />
          </div>
          <div v-else class="item-image-placeholder">
            <span class="item-image-text">{{ item.name }}</span>
          </div>
          <div class="item-info">
            <span class="item-name">{{ item.name }}</span>
            <span class="item-price">🪙 {{ item.cost }}</span>
          </div>
          <div class="item-status">
            <span v-if="isOwned(item.itemId, 'giftCard')" class="owned-badge"
              >보유</span
            >
            <span v-else class="buy-badge">구매</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 구매 확인 모달 -->
    <div
      v-if="showPurchaseModal"
      class="modal-overlay"
      @click="closePurchaseModal"
    >
      <div class="modal-content" @click.stop>
        <h3>아이템 구매</h3>
        <p>{{ selectedItem?.name }}을(를) 구매하시겠습니까?</p>
        <p class="price-info">가격: 🪙 {{ selectedItem?.cost }}</p>
        <p class="balance-info">현재 포인트: 🪙 {{ currentCoin }}</p>
        <div class="modal-buttons">
          <button
            @click="confirmPurchase"
            :disabled="currentCoin < selectedItem?.cost"
          >
            구매하기
          </button>
          <button @click="closePurchaseModal">취소</button>
        </div>
      </div>
    </div>

    <!-- 아바타 착용 버튼 -->
    <div class="avatar-wear-section">
      <button
        class="avatar-wear-btn"
        :disabled="!selectedItemForWear || wearLoading"
        @click="wearSelectedItem"
      >
        <span v-if="wearLoading" class="wear-loading">
          <font-awesome-icon :icon="['fas', 'spinner']" spin />
          착용 중...
        </span>
        <span v-else class="wear-btn-content">
          <font-awesome-icon :icon="['fas', 'tshirt']" class="wear-btn-icon" />
          <span class="wear-btn-text">
            {{
              selectedItemForWear
                ? `${selectedItemForWear.name} 착용하기`
                : "아이템을 선택해주세요"
            }}
          </span>
        </span>
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import {
  getCurrentCoin,
  getClothes,
  insertClothe,
  getAvatarStatus,
  updateAvatar,
  getAvatar,
} from "@/api/mypage/avatar/avatarApi.js";
import baseAvatar from "./avatarimg/avatar-base.png";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faAngleLeft,
  faTshirt,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

library.add(faAngleLeft, faTshirt, faSpinner);

export default {
  name: "AvatarShop2",
  components: {
    FontAwesomeIcon,
  },
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();

    // 상태 관리
    const currentCoin = ref(0);
    const loadingCoin = ref(false);
    const coinError = ref(false);
    const showCoinError = ref(false);
    const activeTab = ref("avatar");
    const avatarItems = ref([]); // API에서 받아온 모든 아이템 데이터
    const ownedItems = ref([]);

    // 누적 포인트 상태
    const cumulativeAmount = ref(0);
    const loadingCumulativeCoin = ref(false);
    const cumulativeCoinError = ref(false);

    // 아바타 이미지 로딩 상태
    const avatarImageLoaded = ref(false);
    const avatarImageError = ref(false);

    // 모달 상태
    const showPurchaseModal = ref(false);
    const selectedItem = ref(null);
    const selectedItemType = ref("");

    // 착용 관련 상태
    const selectedItemForWear = ref(null);
    const wearLoading = ref(false);
    const avatar = ref(null); // 아바타 데이터를 저장할 변수
    const userId = ref(1); // 실제 userId로 변경 필요

    // 미리보기 관련 상태
    const previewLevel = ref(null);
    const previewTop = ref(null);
    const previewShoes = ref(null);
    const previewAccessory = ref(null);

    // 아바타 기본 이미지
    const avatarBase = ref(baseAvatar);

    // 이미지 경로 디버깅
    console.log("baseAvatar import 값:", baseAvatar);
    console.log("avatarBase ref 값:", avatarBase.value);

    // 타입별 아이템 computed 속성
    const titleItems = computed(() => getItemsByType("level"));
    const shirtItems = computed(() => getItemsByType("top"));
    const shoesItems = computed(() => getItemsByType("shoes"));
    const glassesItems = computed(() => getItemsByType("accessory"));
    const gifticonItems = computed(() => getItemsByType("giftCard"));

    // 착용 중인 아이템 computed 속성
    const wearingLevel = computed(() => {
      const item = avatarItems.value.find(
        (item) => item.type === "level" && item.wearing
      );
      if (item) {
        return {
          ...item,
          imageUrl: convertS3Url(item.imageUrl),
        };
      }
      console.log("착용 중인 칭호:", item);
      return item;
    });
    const wearingTop = computed(() => {
      const item = avatarItems.value.find(
        (item) => item.type === "top" && item.wearing
      );
      if (item) {
        return {
          ...item,
          imageUrl: convertS3Url(item.imageUrl),
        };
      }
      console.log("착용 중인 상의:", item);
      return item;
    });
    const wearingShoes = computed(() => {
      const item = avatarItems.value.find(
        (item) => item.type === "shoes" && item.wearing
      );
      if (item) {
        return {
          ...item,
          imageUrl: convertS3Url(item.imageUrl),
        };
      }
      console.log("착용 중인 신발:", item);
      return item;
    });
    const wearingAccessory = computed(() => {
      const item = avatarItems.value.find(
        (item) => item.type === "accessory" && item.wearing
      );
      if (item) {
        return {
          ...item,
          imageUrl: convertS3Url(item.imageUrl),
        };
      }
      console.log("착용 중인 액세서리:", item);
      return item;
    });

    // 포인트 조회 (현재 포인트 + 누적 포인트)
    const fetchCurrentCoin = async () => {
      loadingCoin.value = true;
      coinError.value = false;

      try {
        const response = await getCurrentCoin();
        if (response.data && response.data.data) {
          // amount: 현재 포인트, cumulativeAmount: 누적 포인트
          currentCoin.value = response.data.data.amount || 0;
          cumulativeAmount.value = response.data.data.cumulativeAmount || 0;
          console.log("현재 포인트:", currentCoin.value);
          console.log("누적 포인트:", cumulativeAmount.value);
        }
      } catch (error) {
        console.error("포인트 조회 실패:", error);
        coinError.value = true;
      } finally {
        loadingCoin.value = false;
      }
    };

    // 아바타 상태 조회
    // 아바타 상태 조회
    const fetchAvatarAndItemData = async () => {
      try {
        // 사용자 ID 가져오기 (authStore에서)
        const userId = authStore.user?.id || 1; // 기본값 1

        // 아바타 조회 API 호출
        const avatarResponse = await getAvatar(userId);
        console.log("아바타 조회 응답:", avatarResponse);

        // 의상 목록 조회 API 호출
        const clothesResponse = await getClothes();
        console.log("의상 목록 응답:", clothesResponse);

        if (clothesResponse.data && clothesResponse.data.data) {
          const allItems = clothesResponse.data.data;

          if (avatarResponse.data && avatarResponse.data.data) {
            const avatarData = avatarResponse.data.data;
            avatar.value = avatarData;
            console.log("아바타 데이터 로드 성공:", avatar.value);

            const updatedItems = allItems.map((item) => {
              let wearing = false;

              switch (item.type) {
                case "level":
                  wearing = avatarData.levelId === item.itemId;
                  break;
                case "top":
                  wearing = avatarData.topId === item.itemId;
                  break;
                case "shoes":
                  wearing = avatarData.shoesId === item.itemId;
                  break;
                case "accessory":
                  wearing = avatarData.accessoryId === item.itemId;
                  break;
                case "giftCard":
                  wearing = avatarData.giftCardId === item.itemId;
                  break;
              }

              return {
                ...item,
                wearing: wearing,
              };
            });

            avatarItems.value = updatedItems;
            ownedItems.value = updatedItems;
          } else {
            avatarItems.value = allItems;
            ownedItems.value = allItems;
          }
          console.log("아바타 및 아이템 데이터 로드 완료:", avatarItems.value);
        } else {
          avatarItems.value = [];
          ownedItems.value = [];
        }
      } catch (error) {
        console.error("아바타 및 아이템 데이터 조회 실패:", error);
      }
    };
    // 아바타 상태 조회 (PUT 후 수정된 상태 조회용)
    const fetchAvatarStatus = async () => {
      try {
        const response = await getAvatarStatus();
        if (response.data && response.data.data) {
          console.log("수정된 아바타 상태:", response.data.data);
          // 여기서 필요한 경우 아바타 상태를 업데이트할 수 있습니다
        }
      } catch (error) {
        console.error("아바타 상태 조회 실패:", error);
      }
    };

    // 보유 아이템 조회
    const fetchOwnedItems = async () => {
      try {
        const response = await getClothes();
        if (response.data && response.data.data) {
          ownedItems.value = response.data.data;
        }
      } catch (error) {
        console.error("보유 아이템 조회 실패:", error);
      }
    };

    // 아이템 보유 여부 확인
    const isOwned = (itemId, type) => {
      // 칭호(level) 타입은 항상 보유한 것으로 처리
      if (type === "level") {
        return true;
      }
      return avatarItems.value.some(
        (item) => item.itemId === itemId && item.type === type && item.owned
      );
    };

    // 아이템 착용 여부 확인
    const isWearing = (itemId, type) => {
      return avatarItems.value.some(
        (item) => item.itemId === itemId && item.type === type && item.wearing
      );
    };

    // S3 URL을 HTTPS URL로 변환
    const convertS3Url = (url) => {
      if (!url) return "";
      if (url.startsWith("s3://")) {
        return url.replace(
          "s3://finpickbucket/",
          "https://finpickbucket.s3.ap-northeast-2.amazonaws.com/"
        );
      }
      return url;
    };

    // 아바타 레벨 제한 로직
    const getLevelRequirement = (levelName) => {
      switch (levelName) {
        case "금융새싹":
          return 0;
        case "금융견습":
          return 20000;
        case "금융법사":
          return 40000;
        case "금융도사":
          return 60000;
        default:
          return 0;
      }
    };

    const isLevelAvailable = (levelName) => {
      const requirement = getLevelRequirement(levelName);
      return cumulativeAmount.value >= requirement;
    };

    const getLevelRequirementText = (levelName) => {
      const requirement = getLevelRequirement(levelName);
      if (requirement === 0) return "";
      return `누적 ${requirement.toLocaleString()} 포인트 이상`;
    };

    // 타입별 아이템 필터링 (중복 제거)
    const getItemsByType = (type) => {
      const items = avatarItems.value.filter((item) => item.type === type);
      // itemId 기준으로 중복 제거
      const uniqueItems = items.filter(
        (item, index, self) =>
          index === self.findIndex((t) => t.itemId === item.itemId)
      );

      // S3 URL을 HTTPS URL로 변환하고 레벨 제한 정보 추가
      return uniqueItems.map((item) => ({
        ...item,
        imageUrl: convertS3Url(item.imageUrl),
        isAvailable: type === "level" ? isLevelAvailable(item.name) : true,
        requirementText:
          type === "level" ? getLevelRequirementText(item.name) : "",
      }));
    };

    // 이미지 경로 반환 함수들 (플레이스홀더)
    const getTitleImage = (levelId) => {
      return "";
    };

    const getShirtImage = (topId) => {
      return "";
    };

    const getShoesImage = (shoesId) => {
      return "";
    };

    const getGlassesImage = (accessoryId) => {
      return "";
    };

    // 아이템 클릭 처리
    const handleItemClick = (item, type) => {
      console.log("아이템 클릭:", item, type);

      // 미리보기 설정
      setPreviewItem(item, type);

      // 칭호(level) 타입은 구매 로직 없이 바로 착용 선택
      if (type === "level") {
        if (item.isAvailable) {
          selectedItemForWear.value = { ...item, type };
          console.log("칭호 아이템 선택됨:", selectedItemForWear.value);
        }
        return;
      }

      // 미보유 아이템이면 구매 모달 표시
      if (!isOwned(item.itemId, type)) {
        console.log("미보유 아이템 - 구매 모달 표시");
        selectedItem.value = item;
        selectedItemType.value = type;

        if (currentCoin.value < item.cost) {
          showCoinError.value = true;
          setTimeout(() => {
            showCoinError.value = false;
          }, 2000);
        } else {
          showPurchaseModal.value = true;
        }
      } else {
        // 보유한 아이템이면 착용할 아이템으로 선택
        console.log("보유 아이템 - 착용 선택");
        selectedItemForWear.value = { ...item, type };
      }
    };

    // 미리보기 아이템 설정
    const setPreviewItem = (item, type) => {
      const previewItem = {
        ...item,
        imageUrl: convertS3Url(item.imageUrl),
      };

      switch (type) {
        case "level":
          previewLevel.value = previewItem;
          break;
        case "top":
          previewTop.value = previewItem;
          break;
        case "shoes":
          previewShoes.value = previewItem;
          break;
        case "accessory":
          previewAccessory.value = previewItem;
          break;
      }
    };

    // 미리보기 초기화
    const clearPreview = () => {
      previewLevel.value = null;
      previewTop.value = null;
      previewShoes.value = null;
      previewAccessory.value = null;
    };

    // 구매 확인
    const confirmPurchase = async () => {
      if (!selectedItem.value) return;

      try {
        const purchaseData = {
          itemId: selectedItem.value.itemId,
        };

        console.log("구매할 아이템:", purchaseData);

        const response = await insertClothe(purchaseData);

        if (
          response.data &&
          (response.data.status === 0 || response.data.status === 200)
        ) {
          console.log("아이템 구매 성공:", response);
          // 구매 성공 시 포인트와 아바타 상태 갱신
          await fetchCurrentCoin();
          await fetchAvatarAndItemData();
          closePurchaseModal();
        } else {
          console.error("아이템 구매 실패:", response);
        }
      } catch (error) {
        console.error("구매 실패:", error);
      }
    };

    // 모달 닫기
    const closePurchaseModal = () => {
      showPurchaseModal.value = false;
      selectedItem.value = null;
      selectedItemType.value = "";
    };

    // 아이템 착용 함수
    // AvatarShop2.vue 파일의 wearSelectedItem 함수
    const wearSelectedItem = async () => {
      if (!selectedItemForWear.value) return;

      wearLoading.value = true;
      try {
        const currentAvatar = avatar.value;
        const newItemId = selectedItemForWear.value.itemId;
        const newItemType = selectedItemForWear.value.type;

        // 현재 아바타가 착용 중인 모든 아이템 ID를 저장할 객체
        const avatarItems = {
          level: currentAvatar.levelId,
          top: currentAvatar.topId,
          shoes: currentAvatar.shoesId,
          accessory: currentAvatar.accessoryId,
        };

        // 새로 선택한 아이템으로 기존 아이템을 교체
        // 예를 들어, newItemType이 'top'이면 avatarItems.top을 새 ID로 업데이트
        if (avatarItems.hasOwnProperty(newItemType)) {
          avatarItems[newItemType] = newItemId;
        }

        // 유효한 ID만 추출하여 배열로 변환
        const itemsToWear = Object.values(avatarItems).filter(
          (id) => id !== null && typeof id !== "undefined"
        );

        console.log("백엔드에 전송할 전체 아이템 배열:", itemsToWear);

        const response = await updateAvatar(itemsToWear);

        if (
          response.data &&
          (response.data.status === 0 || response.data.status === 200)
        ) {
          console.log("아이템 착용 성공:", response);
          await fetchAvatarAndItemData();
          selectedItemForWear.value = null;
          clearPreview();
          console.log("아이템 착용 완료");
        } else {
          console.error("아이템 착용 실패:", response);
        }
      } catch (error) {
        console.error("아이템 착용 중 에러 발생:", error);
      } finally {
        wearLoading.value = false;
      }
    };
    // 뒤로가기
    const goBack = () => {
      router.go(-1);
    };

    // 아바타 이미지 로딩 이벤트 핸들러
    const onAvatarImageLoad = () => {
      console.log("아바타 이미지 로딩 성공");
      avatarImageLoaded.value = true;
      avatarImageError.value = false;
    };

    const onAvatarImageError = (error) => {
      console.error("아바타 이미지 로딩 실패:", error);
      avatarImageLoaded.value = false;
      avatarImageError.value = true;

      // 이미지 경로 확인을 위한 로그
      console.log("시도한 이미지 경로:", avatarBase.value);
      console.log("이미지 import 값:", baseAvatar);
    };

    const onWearingItemImageError = (error) => {
      console.error("착용 아이템 이미지 로딩 실패:", error);
      // 이미지 로딩 실패 시 텍스트로 대체하거나 기본 이미지 표시
    };

    // 컴포넌트 마운트 시 데이터 로드
    onMounted(async () => {
      console.log("AvatarShop2 컴포넌트 마운트 시작");
      console.log("현재 사용자:", authStore.user);
      console.log("사용자 ID:", authStore.user?.id);
      console.log("사용자 userId:", authStore.user?.userId);
      console.log("인증 상태:", authStore.isAuthenticated);
      console.log("액세스 토큰:", authStore.accessToken);
      console.log("아바타 이미지 경로:", avatarBase.value);

      // 이미지 로딩 상태 초기화
      avatarImageLoaded.value = false;
      avatarImageError.value = false;

      // 사용자 인증 상태 확인
      if (!authStore.isAuthenticated) {
        console.error("사용자가 인증되지 않았습니다. 로그인이 필요합니다.");
        router.push("/login");
        return;
      }

      if (!authStore.user) {
        console.error("사용자 정보가 없습니다.");
        router.push("/login");
        return;
      }

      // 사용자 ID가 없어도 백엔드에서 @AuthenticationPrincipal을 사용하므로 API 호출 시도
      console.log("API 호출을 시도합니다...");

      try {
        await fetchCurrentCoin(); // 현재 포인트와 누적 포인트를 모두 가져옴
        await fetchAvatarAndItemData(); // 개선된 함수 호출
        console.log("모든 데이터 로드 완료");
      } catch (error) {
        console.error("컴포넌트 마운트 중 오류:", error);
      }
    });
    const CDN = "https://finpickbucket.s3.ap-northeast-2.amazonaws.com";

    const IMAGE_MAP = {
      accessory: {
        blush: `${CDN}/accessory/blush.png`,
        sunglasses: `${CDN}/accessory/sunglasses.png`,
      },
      level: {
        금융새싹: `${CDN}/level/SEEDLING/sprout.png`,
        금융견습: `${CDN}/level/TRAINEE/beginner.png`,
        금융법사: `${CDN}/level/WIZARD/wizardhat.png`,
        금융도사: `${CDN}/level/MASTER/dosa.png`,
      },
    };

    const normalizeKey = (s) =>
      String(s || "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "")
        .replace(/-/g, "");

    // 아이템 → 이미지 URL 해석
    const resolveImage = (item) => {
      // 1) 서버가 imageUrl 주면 그거 우선
      if (item?.imageUrl) return item.imageUrl;

      // 2) 타입별/이름별 수동 매핑
      if (item?.type === "accessory") {
        const k = normalizeKey(item.name);
        if (k.includes("블러셔") || k.includes("blush"))
          return IMAGE_MAP.accessory.blush;
        if (k.includes("선글라스") || k.includes("sunglass"))
          return IMAGE_MAP.accessory.sunglasses;
      }
      if (item?.type === "level") {
        const name = String(item.name || "");
        if (name.includes("금융새싹")) return IMAGE_MAP.level["금융새싹"];
        if (name.includes("금융견습")) return IMAGE_MAP.level["금융견습"];
        if (name.includes("금융법사")) return IMAGE_MAP.level["금융법사"];
        if (name.includes("금융도사")) return IMAGE_MAP.level["금융도사"];
      }

      // 3) 못 찾으면 빈 값 → placeholder로 대체
      return "";
    };

    const placeholder = `${CDN}/accessory/sunglasses.png`; // 임시 대체이미지
    const onImgError = (e) => {
      if (e?.target && e.target.src !== placeholder) {
        e.target.src = placeholder;
      }
    };
    return {
      currentCoin,
      loadingCoin,
      coinError,
      showCoinError,
      activeTab,
      avatarItems,
      ownedItems,
      cumulativeAmount,
      showPurchaseModal,
      selectedItem,
      selectedItemType,
      selectedItemForWear,
      wearLoading,
      avatarBase,
      avatarImageLoaded,
      avatarImageError,
      titleItems,
      shirtItems,
      shoesItems,
      glassesItems,
      gifticonItems,
      wearingLevel,
      wearingTop,
      wearingShoes,
      wearingAccessory,
      previewLevel,
      previewTop,
      previewShoes,
      previewAccessory,
      isOwned,
      isWearing,
      getTitleImage,
      getShirtImage,
      getShoesImage,
      getGlassesImage,
      handleItemClick,
      confirmPurchase,
      wearSelectedItem,
      closePurchaseModal,
      onAvatarImageLoad,
      onAvatarImageError,
      onWearingItemImageError,
      resolveImage,
      onImgError,
      clearPreview,
      goBack,
    };
  },
};
</script>

<style scoped>
.shop-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 120px; /* 하단 navbar 높이 + 여유 공간 */
  overflow-y: auto;
  scroll-behavior: smooth;
}

/* 스크롤바 스타일링 */
.shop-container::-webkit-scrollbar {
  width: 6px;
}

.shop-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.shop-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.shop-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.dictionary-header-bar {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  background-color: white;
  border-bottom: 1px solid #e0e0e0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.back-btn {
  background: none;
  border: none;
  font-size: 18px;
  color: #333;
  cursor: pointer;
  margin-right: 15px;
}

.dictionary-header-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.avatar-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background-color: white;
  margin-bottom: 10px;
}

.avatar-container {
  flex: 1;
  display: flex;
  justify-content: center;
}

.avatar-pixel {
  position: relative;
  width: 120px;
  height: 120px;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 8px;
}

.disabled-image {
  position: relative;
  filter: grayscale(100%);
}

.disabled-text {
  color: #6c757d !important;
}

.level-requirement-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

.requirement-text {
  color: white;
  font-size: 10px;
  font-weight: 600;
  text-align: center;
  padding: 4px;
  line-height: 1.2;
}

.avatar-loading,
.avatar-error {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  font-size: 12px;
  color: #6c757d;
  text-align: center;
  padding: 10px;
}

.avatar-loading {
  color: #007bff;
}

.avatar-error {
  color: #dc3545;
}

.avatar-placeholder,
.title-placeholder,
.shirt-placeholder,
.shoes-placeholder,
.glasses-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border: 2px dashed #dee2e6;
  border-radius: 8px;
}

.avatar-text,
.item-text {
  font-size: 12px;
  color: #6c757d;
  font-weight: 500;
  text-align: center;
}

.wearing-item-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 8px;
}

.coin-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 100px;
}

.coin-error-space {
  height: 20px;
  margin-bottom: 5px;
}

.coin-error {
  color: #ff4444;
  font-size: 12px;
  font-weight: 600;
}

.coin-balance {
  display: flex;
  align-items: center;
  background-color: #fff3cd;
  padding: 8px 12px;
  border-radius: 20px;
  border: 2px solid #ffc107;
}

.coin-icon {
  font-size: 16px;
  margin-right: 5px;
}

.coin-value {
  font-size: 16px;
  font-weight: 600;
  color: #856404;
}

.coin-value.loading {
  color: #999;
}

.coin-value.error {
  color: #ff4444;
}

.subtab-row {
  display: flex;
  background-color: white;
  border-bottom: 1px solid #e0e0e0;
}

.subtab {
  flex: 1;
  padding: 15px;
  text-align: center;
  cursor: pointer;
  font-weight: 500;
  color: #666;
  border-bottom: 3px solid transparent;
  transition: all 0.3s ease;
}

.subtab.active {
  color: #007bff;
  border-bottom-color: #007bff;
}

.tab-content {
  padding: 10px;
  padding-bottom: 240px; /* 하단 navbar 높이 + 여유 공간 */
  max-height: calc(100vh - 200px);
  overflow-y: auto;
  scroll-behavior: smooth;
}

.item-category {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
}

.category-icon {
  margin-right: 8px;
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
  flex-wrap: nowrap; /* Ensures items stay in a single row */
  overflow-x: auto; /* Enables horizontal scrolling */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scroll-behavior: smooth; /* Smooth scrolling */
}

.item-list::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.item-card {
  background-color: white;
  border-radius: 12px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
}

.item-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.item-card.owned {
  border-color: #28a745;
}

.item-card.wearing {
  border-color: #007bff;
  background-color: #f8f9ff;
}

.item-card.disabled {
  border-color: #dee2e6;
  background-color: #f8f9fa;
  opacity: 0.6;
  cursor: not-allowed;
}

.item-card.disabled:hover {
  transform: none;
  box-shadow: none;
}

.item-image-placeholder {
  width: 100px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  margin-bottom: 10px;
}

.item-image {
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  border-radius: 8px;
  overflow: hidden;
}

.item-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.item-image-text {
  font-size: 12px;
  color: #6c757d;
  font-weight: 500;
  text-align: center;
}

.item-info {
  text-align: center;
}

.item-name {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.item-requirement {
  display: block;
  font-size: 10px;
  color: #dc3545;
  font-weight: 500;
  margin-top: 2px;
}

.item-price {
  display: block;
  font-size: 12px;
  color: #666;
}

.item-status {
  position: absolute;
  top: 10px;
  right: 10px;
}

.owned-badge,
.wearing-badge,
.buy-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
}

.owned-badge {
  background-color: #28a745;
  color: white;
}

.wearing-badge {
  background-color: #007bff;
  color: white;
}

.buy-badge {
  background-color: #ffc107;
  color: #333;
}

.disabled-badge {
  background-color: #6c757d;
  color: white;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000; /* 아바타 착용 버튼보다 높은 우선순위 */
}

.modal-content {
  background-color: white;
  border-radius: 12px;
  padding: 25px;
  max-width: 400px;
  width: 90%;
  text-align: center;
}

.modal-content h3 {
  margin-bottom: 15px;
  color: #333;
}

.modal-content p {
  margin-bottom: 10px;
  color: #666;
}

.price-info,
.balance-info {
  font-weight: 600;
  color: #333;
}

.modal-buttons {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.modal-buttons button {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.modal-buttons button:first-child {
  background-color: #007bff;
  color: white;
}

.modal-buttons button:first-child:hover:not(:disabled) {
  background-color: #0056b3;
}

.modal-buttons button:first-child:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.modal-buttons button:last-child {
  background-color: #6c757d;
  color: white;
}

.modal-buttons button:last-child:hover {
  background-color: #545b62;
}

@media (max-width: 768px) {
  .item-list {
    gap: 8px;
    max-width: 350px;
  }

  .item-card {
    padding: 10px;
  }

  .item-image-placeholder {
    height: 30px;
  }

  .item-name {
    font-size: 12px;
    text-overflow: ellipsis;
  }

  .item-price {
    font-size: 10px;
  }

  .tab-content {
    max-height: calc(100vh - 280px); /* navbar 높이 고려 */
  }

  /* 모바일에서 아바타 착용 버튼 위치 조정 */
  .avatar-wear-section {
    bottom: 90px;
  }
}

/* 아바타 착용 버튼 스타일 */
.avatar-wear-section {
  position: fixed;
  bottom: 100px; /* 하단 navbar 위에 위치 */
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.avatar-wear-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 15px 25px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
  min-width: 200px;
  justify-content: center;
}

.avatar-wear-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

.avatar-wear-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.wear-btn-icon {
  font-size: 18px;
}

.wear-btn-text {
  font-size: 14px;
}

.wear-loading {
  color: #667eea;
  font-size: 14px;
  font-weight: 500;
  animation: pulse 1.5s infinite;
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
</style>
