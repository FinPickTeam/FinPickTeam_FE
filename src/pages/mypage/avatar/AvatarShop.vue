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
      <div class="avatar-pixel">
        <img :src="avatarBase" class="avatar-img" alt="아바타" />
        <img
          v-if="shirtItems.find((item) => item.wearing)"
          :src="shirtItems.find((item) => item.wearing)?.image"
          class="shirt-img"
          alt="상의"
        />
        <img
          v-if="shoesItems.find((item) => item.wearing)"
          :src="shoesItems.find((item) => item.wearing)?.image"
          class="shoes-img"
          alt="신발"
        />
        <img
          v-if="glassesItems.find((item) => item.wearing)"
          :src="glassesItems.find((item) => item.wearing)?.image"
          class="glasses-img"
          alt="안경"
        />
      </div>
      <div class="coin-error-space">
        <span v-if="showCoinError" class="coin-error"
          >포인트가 부족합니다!</span
        >
      </div>
      <div class="coin-balance">
        <span class="coin-icon">🪙</span> {{ avatarStore.coin }}
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
      <!-- 상의 아이템 -->
      <div class="item-category"><span class="category-icon">👕</span> 옷</div>
      <div class="item-list">
        <div
          class="item-card"
          :class="{ selected: item.wearing, purchased: item.purchased }"
          v-for="item in shirtItems"
          :key="item.id"
          @click="handleBuyOrToggleShirt(item)"
        >
          <img :src="item.image" class="item-img" :alt="item.name" />
          <span class="item-price">🪙 {{ item.price }}</span>
          <span v-if="item.purchased" class="own-label">보유중</span>
          <span v-if="item.wearing" class="wearing-label">착용중</span>
          <font-awesome-icon
            v-if="item.purchased"
            class="check-icon"
            :icon="['fas', 'check-circle']"
          />
          <div v-if="item.wearing" class="wearing-overlay">
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
          :class="{ selected: item.wearing, purchased: item.purchased }"
          v-for="item in shoesItems"
          :key="item.id"
          @click="handleBuyOrToggleShoes(item)"
        >
          <img :src="item.image" class="item-img" :alt="item.name" />
          <span class="item-price">🪙 {{ item.price }}</span>
          <span v-if="item.purchased" class="own-label">보유중</span>
          <span v-if="item.wearing" class="wearing-label">착용중</span>
          <font-awesome-icon
            v-if="item.purchased"
            class="check-icon"
            :icon="['fas', 'check-circle']"
          />
          <div v-if="item.wearing" class="wearing-overlay">
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
          :class="{ selected: item.wearing, purchased: item.purchased }"
          v-for="item in glassesItems"
          :key="item.id"
          @click="handleBuyOrToggleGlasses(item)"
        >
          <img :src="item.image" class="item-img" :alt="item.name" />
          <span class="item-price">🪙 {{ item.price }}</span>
          <span v-if="item.purchased" class="own-label">보유중</span>
          <span v-if="item.wearing" class="wearing-label">착용중</span>
          <font-awesome-icon
            v-if="item.purchased"
            class="check-icon"
            :icon="['fas', 'check-circle']"
          />
          <div v-if="item.wearing" class="wearing-overlay">
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
        <div class="purchase-modal-message">정말 구매하시겠습니까?</div>
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
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useAvatarStore } from "../../../stores/avatar.js";
import Navbar from "../../../components/Navbar.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faAngleLeft,
  faCheckCircle,
  faCheckDouble,
} from "@fortawesome/free-solid-svg-icons";
import { ref, onMounted } from "vue";

// 아바타 이미지 import
import avatarBase from "./avatarimg/avatar-base.png";
import shirtBlue from "./avatarimg/shirts-blue.png";
import shirtRed from "./avatarimg/shirt-red.png";
import shoesBrown from "./avatarimg/shoese-brown.png";
import shoes from "./avatarimg/shoese.png";
import sportGlasses from "./avatarimg/sporglasses.png";
import sunGlasses from "./avatarimg/sunglasses.png";

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
const showCoinError = ref(false);
const activeTab = ref("avatar");
const selectedCategory = ref("coffee");

// 아바타 아이템 데이터
const shirtItems = ref([
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
]);

const shoesItems = ref([
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
]);

const glassesItems = ref([
  {
    id: "sport-glasses",
    name: "스포츠 안경",
    price: 40,
    image: sportGlasses,
    purchased: false,
    wearing: false,
  },
  {
    id: "sun-glasses",
    name: "선글라스",
    price: 40,
    image: sunGlasses,
    purchased: false,
    wearing: false,
  },
]);

// store 상태를 로컬 상태에 동기화하는 함수
function syncStoreState() {
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

// 컴포넌트 마운트 시 store 상태 동기화 및 저장된 아바타 정보 불러오기
onMounted(() => {
  avatarStore.loadAvatar();
  syncStoreState();
});

// 기프티콘 상품 데이터
const coffeeItems = ref([
  {
    id: 1,
    name: "투썸플레이스 콜드브루 R",
    price: 8100,
    image: twosomeColdBrew,
    purchased: false,
  },
  {
    id: 2,
    name: "투썸플레이스 카페라떼 R",
    price: 8,
    image: twosomeCafeLatte,
    purchased: false,
  },
  {
    id: 3,
    name: "투썸플레이스 HOT 카페라떼 R",
    price: 80,
    image: twosomeHotLatte,
    purchased: false,
  },
  {
    id: 4,
    name: "투썸플레이스 아메리카노 L",
    price: 80,
    image: twosomeAmericano,
    purchased: false,
  },
]);

const megaboxItems = ref([
  {
    id: 5,
    name: "메가박스 2인 패키지 (2D 일반관람권2+팝콘(L)+음료(R)2)",
    price: 54,
    image: megaboxPopcorn,
    purchased: false,
  },
]);

const artboxItems = ref([
  {
    id: 6,
    name: "CGV 영화관람권 1인인",
    price: 8,
    image: cgvTicket,
    purchased: false,
  },
]);

const lotteItems = ref([
  {
    id: 7,
    name: "롯데시네마 스위트콤보",
    price: 20000,
    image: lotteCombo,
    purchased: false,
  },
  {
    id: 8,
    name: "롯데시네마 2D 1인 영화관람권",
    price: 20,
    image: cgvTicket,
    purchased: false,
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
}
function confirmPurchase() {
  if (!pendingPurchase.value) return;
  if (pendingPurchaseType.value === "shirt") {
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

function actuallyBuyShirt(item) {
  if (!item.purchased && avatarStore.coin < item.price) {
    showCoinError.value = true;
    setTimeout(() => {
      showCoinError.value = false;
    }, 2000);
    return;
  }
  if (!item.purchased) {
    avatarStore.coin -= item.price;
    item.purchased = true;
    avatarStore.setItemState("shirts", item.id, true, false); // 구매만 하고 착용은 안함

    // 구매 후 자동으로 착용
    handleBuyOrToggleShirt(item, true);
  } else {
    // 착용/해제 토글 기존 로직
    handleBuyOrToggleShirt(item, true);
  }
}
function actuallyBuyShoes(item) {
  if (!item.purchased && avatarStore.coin < item.price) {
    showCoinError.value = true;
    setTimeout(() => {
      showCoinError.value = false;
    }, 2000);
    return;
  }
  if (!item.purchased) {
    avatarStore.coin -= item.price;
    item.purchased = true;
    avatarStore.setItemState("shoes", item.id, true, false); // 구매만 하고 착용은 안함

    // 구매 후 자동으로 착용
    handleBuyOrToggleShoes(item, true);
  } else {
    handleBuyOrToggleShoes(item, true);
  }
}
function actuallyBuyGlasses(item) {
  if (!item.purchased && avatarStore.coin < item.price) {
    showCoinError.value = true;
    setTimeout(() => {
      showCoinError.value = false;
    }, 2000);
    return;
  }
  if (!item.purchased) {
    avatarStore.coin -= item.price;
    item.purchased = true;
    avatarStore.setItemState("glasses", item.id, true, false); // 구매만 하고 착용은 안함

    // 구매 후 자동으로 착용
    handleBuyOrToggleGlasses(item, true);
  } else {
    handleBuyOrToggleGlasses(item, true);
  }
}
function actuallyBuyGifticon(item) {
  if (avatarStore.coin < item.price) {
    showCoinError.value = true;
    setTimeout(() => {
      showCoinError.value = false;
    }, 2000);
    return;
  }
  avatarStore.coin -= item.price;
  item.purchased = true;
}

function goBack() {
  router.back();
}

function handleBuyOrToggleShirt(item, skipModal = false) {
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
    avatarStore.coin -= item.price;
    item.purchased = true;
    avatarStore.setItemState("shirts", item.id, true, false); // 구매 상태만 설정

    // 같은 카테고리의 다른 아이템 착용 해제
    shirtItems.value.forEach((otherItem) => {
      if (otherItem.id !== item.id) {
        otherItem.wearing = false;
        avatarStore.setItemState(
          "shirts",
          otherItem.id,
          otherItem.purchased,
          false
        );
      }
    });

    // 현재 아이템 착용
    item.wearing = true;
    avatarStore.setItemState("shirts", item.id, true, true);
  } else {
    // 착용/해제 토글
    if (item.wearing) {
      // 착용 해제
      item.wearing = false;
      avatarStore.setItemState("shirts", item.id, true, false);
    } else {
      // 착용 - 다른 아이템 착용 해제 후 착용
      shirtItems.value.forEach((otherItem) => {
        if (otherItem.id !== item.id) {
          otherItem.wearing = false;
          avatarStore.setItemState(
            "shirts",
            otherItem.id,
            otherItem.purchased,
            false
          );
        }
      });
      item.wearing = true;
      avatarStore.setItemState("shirts", item.id, true, true);
    }
  }

  // 상태 변경 후 동기화
  syncStoreState();
}

function handleBuyOrToggleShoes(item, skipModal = false) {
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
    avatarStore.coin -= item.price;
    item.purchased = true;
    avatarStore.setItemState("shoes", item.id, true, false); // 구매 상태만 설정

    // 같은 카테고리의 다른 아이템 착용 해제
    shoesItems.value.forEach((otherItem) => {
      if (otherItem.id !== item.id) {
        otherItem.wearing = false;
        avatarStore.setItemState(
          "shoes",
          otherItem.id,
          otherItem.purchased,
          false
        );
      }
    });

    // 현재 아이템 착용
    item.wearing = true;
    avatarStore.setItemState("shoes", item.id, true, true);
  } else {
    // 착용/해제 토글
    if (item.wearing) {
      // 착용 해제
      item.wearing = false;
      avatarStore.setItemState("shoes", item.id, true, false);
    } else {
      // 착용 - 다른 아이템 착용 해제 후 착용
      shoesItems.value.forEach((otherItem) => {
        if (otherItem.id !== item.id) {
          otherItem.wearing = false;
          avatarStore.setItemState(
            "shoes",
            otherItem.id,
            otherItem.purchased,
            false
          );
        }
      });
      item.wearing = true;
      avatarStore.setItemState("shoes", item.id, true, true);
    }
  }

  // 상태 변경 후 동기화
  syncStoreState();
}

function handleBuyOrToggleGlasses(item, skipModal = false) {
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
    avatarStore.coin -= item.price;
    item.purchased = true;
    avatarStore.setItemState("glasses", item.id, true, false); // 구매 상태만 설정

    // 같은 카테고리의 다른 아이템 착용 해제
    glassesItems.value.forEach((otherItem) => {
      if (otherItem.id !== item.id) {
        otherItem.wearing = false;
        avatarStore.setItemState(
          "glasses",
          otherItem.id,
          otherItem.purchased,
          false
        );
      }
    });

    // 현재 아이템 착용
    item.wearing = true;
    avatarStore.setItemState("glasses", item.id, true, true);
  } else {
    // 착용/해제 토글
    if (item.wearing) {
      // 착용 해제
      item.wearing = false;
      avatarStore.setItemState("glasses", item.id, true, false);
    } else {
      // 착용 - 다른 아이템 착용 해제 후 착용
      glassesItems.value.forEach((otherItem) => {
        if (otherItem.id !== item.id) {
          otherItem.wearing = false;
          avatarStore.setItemState(
            "glasses",
            otherItem.id,
            otherItem.purchased,
            false
          );
        }
      });
      item.wearing = true;
      avatarStore.setItemState("glasses", item.id, true, true);
    }
  }

  // 상태 변경 후 동기화
  syncStoreState();
}

function handleBuyGifticon(item, skipModal = false) {
  if (!item.purchased && !skipModal) {
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
  avatarStore.coin -= item.price;
  item.purchased = true;
}

function wearAvatar() {
  // 현재 착용 중인 아바타 정보를 가져옴
  const currentShirt = shirtItems.value.find((item) => item.wearing);
  const currentShoes = shoesItems.value.find((item) => item.wearing);
  const currentGlasses = glassesItems.value.find((item) => item.wearing);

  // 착용 중인 아이템이 없으면 종료
  if (!currentShirt && !currentShoes && !currentGlasses) {
    alert("착용할 아바타 아이템을 먼저 선택해주세요.");
    return;
  }

  // 현재 착용 중인 아바타 정보를 스토어에 저장
  avatarStore.setAvatar(
    currentShirt?.id || null,
    currentShoes?.id || null,
    currentGlasses?.id || null
  );

  // 성공 메시지 표시
  alert("아바타가 성공적으로 적용되었습니다!");
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
  width: 120px;
  height: 120px;
  background: #fff;
  border-radius: 20px;
  border: 2px solid #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-bottom: 10px;
}

.avatar-img {
  width: 100px;
  height: 100px;
  z-index: 1;
}

.shirt-img {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 100px;
  height: 100px;
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
  gap: 18px;
  margin: 0 0 12px 24px;
}

.item-card {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 10px 8px 4px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 60px;
  box-shadow: 0 2px 8px rgba(160, 120, 255, 0.06);
  font-size: 18px;
  font-weight: 500;
  position: relative;
  cursor: pointer;
  border: 2px solid transparent;
  transition: border 0.2s;
}

.item-card.selected {
  border: 2px solid #10b981;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
}

.item-img {
  width: 40px;
  height: 40px;
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

.shoes-img {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 100px;
  height: 100px;
  transform: translate(-50%, -50%);
  z-index: 2;
  pointer-events: none;
}

.glasses-img {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 100px;
  height: 100px;
  transform: translate(-50%, -50%);
  z-index: 3;
  pointer-events: none;
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
</style>
