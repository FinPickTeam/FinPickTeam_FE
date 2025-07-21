import { ref } from "vue";
import { defineStore } from "pinia";

export const useAvatarStore = defineStore("avatar", () => {
  const coin = ref(1000);
  const hasShirt = ref(false);
  const wearingShirt = ref(false);
  const hasPants = ref(false);
  const wearingPants = ref(false);
  const hasAcc = ref(false);
  const wearingAcc = ref(false);

  function buyOrToggleShirt(price = 50) {
    if (!hasShirt.value) {
      if (coin.value >= price) {
        coin.value -= price;
        hasShirt.value = true;
        wearingShirt.value = true;
      } else {
        alert("코인이 부족합니다!");
      }
    } else {
      wearingShirt.value = !wearingShirt.value;
    }
  }

  function buyOrTogglePants(price = 50) {
    if (!hasPants.value) {
      if (coin.value >= price) {
        coin.value -= price;
        hasPants.value = true;
        wearingPants.value = true;
      } else {
        alert("코인이 부족합니다!");
      }
    } else {
      wearingPants.value = !wearingPants.value;
    }
  }

  function buyOrToggleAcc(price = 50) {
    if (!hasAcc.value) {
      if (coin.value >= price) {
        coin.value -= price;
        hasAcc.value = true;
        wearingAcc.value = true;
      } else {
        alert("코인이 부족합니다!");
      }
    } else {
      wearingAcc.value = !wearingAcc.value;
    }
  }

  function resetAvatar() {
    coin.value = 900;
    hasShirt.value = false;
    wearingShirt.value = false;
    hasPants.value = false;
    wearingPants.value = false;
    hasAcc.value = false;
    wearingAcc.value = false;
  }

  return {
    coin,
    hasShirt,
    wearingShirt,
    buyOrToggleShirt,
    hasPants,
    wearingPants,
    buyOrTogglePants,
    hasAcc,
    wearingAcc,
    buyOrToggleAcc,
    resetAvatar,
  };
});
