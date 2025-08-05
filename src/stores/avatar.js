import { ref } from "vue";
import { defineStore } from "pinia";

export const useAvatarStore = defineStore("avatar", () => {
  const coin = ref(1000);

  // 아바타 아이템 상태 관리
  const avatarItems = ref({
    titles: {
      "title-wizardhat": { purchased: false, wearing: false },
      "title-sprout": { purchased: false, wearing: false },
    },
    shirts: {
      "shirt-blue": { purchased: false, wearing: false },
      "shirt-red": { purchased: false, wearing: false },
    },
    shoes: {
      "shoes-brown": { purchased: false, wearing: false },
      shoes: { purchased: false, wearing: false },
    },
    glasses: {
      "sport-glasses": { purchased: false, wearing: false },
      "sun-glasses": { purchased: false, wearing: false },
    },
  });

  // 포인트 내역
  const coinHistory = ref([
    {
      type: "init",
      amount: 1000,
      desc: "초기 지급",
      date: new Date().toISOString(),
    },
  ]);

  function addCoinHistory(type, amount, desc) {
    coinHistory.value.unshift({
      type,
      amount,
      desc,
      date: new Date().toISOString(),
    });
  }

  // 아이템 구매 및 착용 토글
  function buyOrToggleItem(category, itemId, price) {
    const item = avatarItems.value[category][itemId];

    if (!item.purchased) {
      if (coin.value >= price) {
        coin.value -= price;
        item.purchased = true;
        item.wearing = true;
        addCoinHistory("사용", -price, `${category} 구매`);
      } else {
        alert("코인이 부족합니다!");
        return false;
      }
    } else {
      // 같은 카테고리의 다른 아이템 착용 해제
      Object.keys(avatarItems.value[category]).forEach((id) => {
        if (id !== itemId) {
          avatarItems.value[category][id].wearing = false;
        }
      });
      // 현재 아이템 착용/해제 토글
      item.wearing = !item.wearing;
    }
    return true;
  }

  // 현재 착용 중인 아이템 가져오기
  function getWearingItem(category) {
    const items = avatarItems.value[category];
    for (const [id, item] of Object.entries(items)) {
      if (item.wearing) {
        return { id, ...item };
      }
    }
    return null;
  }

  // 아이템 구매 상태 확인
  function isItemPurchased(category, itemId) {
    return avatarItems.value[category][itemId]?.purchased || false;
  }

  // 아이템 착용 상태 확인
  function isItemWearing(category, itemId) {
    return avatarItems.value[category][itemId]?.wearing || false;
  }

  // 아이템 상태 설정 (AvatarShop에서 사용)
  function setItemState(category, itemId, purchased, wearing) {
    if (avatarItems.value[category] && avatarItems.value[category][itemId]) {
      // 구매 상태가 true로 설정되면 영구적으로 유지
      if (purchased) {
        avatarItems.value[category][itemId].purchased = true;
      }
      // 착용 상태만 변경
      avatarItems.value[category][itemId].wearing = wearing;
    }
  }

  // 현재 착용 중인 아바타 정보를 저장 (MYPAGE, HOME에서 사용)
  function setAvatar(shirtId, shoesId, glassesId, titleId) {
    // 모든 아이템 착용 해제
    Object.keys(avatarItems.value.titles).forEach((id) => {
      avatarItems.value.titles[id].wearing = false;
    });
    Object.keys(avatarItems.value.shirts).forEach((id) => {
      avatarItems.value.shirts[id].wearing = false;
    });
    Object.keys(avatarItems.value.shoes).forEach((id) => {
      avatarItems.value.shoes[id].wearing = false;
    });
    Object.keys(avatarItems.value.glasses).forEach((id) => {
      avatarItems.value.glasses[id].wearing = false;
    });

    // 지정된 아이템들 착용
    if (titleId && avatarItems.value.titles[titleId]) {
      avatarItems.value.titles[titleId].wearing = true;
    }
    if (shirtId && avatarItems.value.shirts[shirtId]) {
      avatarItems.value.shirts[shirtId].wearing = true;
    }
    if (shoesId && avatarItems.value.shoes[shoesId]) {
      avatarItems.value.shoes[shoesId].wearing = true;
    }
    if (glassesId && avatarItems.value.glasses[glassesId]) {
      avatarItems.value.glasses[glassesId].wearing = true;
    }

    // 로컬 스토리지에 저장 (페이지 새로고침 시에도 유지)
    localStorage.setItem(
      "currentAvatar",
      JSON.stringify({
        titleId,
        shirtId,
        shoesId,
        glassesId,
      })
    );
  }

  // 저장된 아바타 정보 불러오기
  function loadAvatar() {
    const savedAvatar = localStorage.getItem("currentAvatar");
    if (savedAvatar) {
      const avatar = JSON.parse(savedAvatar);
      setAvatar(
        avatar.shirtId,
        avatar.shoesId,
        avatar.glassesId,
        avatar.titleId
      );
    }
  }

  function resetAvatar() {
    coin.value = 900;
    avatarItems.value = {
      titles: {
        "title-wizardhat": { purchased: false, wearing: false },
        "title-sprout": { purchased: false, wearing: false },
      },
      shirts: {
        "shirt-blue": { purchased: false, wearing: false },
        "shirt-red": { purchased: false, wearing: false },
      },
      shoes: {
        "shoes-brown": { purchased: false, wearing: false },
        shoes: { purchased: false, wearing: false },
      },
      glasses: {
        "sport-glasses": { purchased: false, wearing: false },
        "sun-glasses": { purchased: false, wearing: false },
      },
    };
    addCoinHistory("초기화", 900, "아바타 리셋");
  }

  function getCoinHistory() {
    return coinHistory.value;
  }

  return {
    coin,
    avatarItems,
    buyOrToggleItem,
    getWearingItem,
    isItemPurchased,
    isItemWearing,
    setItemState,
    resetAvatar,
    coinHistory,
    addCoinHistory,
    getCoinHistory,
    setAvatar,
    loadAvatar,
  };
});
