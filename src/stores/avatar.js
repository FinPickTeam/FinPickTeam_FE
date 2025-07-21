import { ref } from "vue";
import { defineStore } from "pinia";

export const useAvatarStore = defineStore("avatar", () => {
  const coin = ref(900);
  const hasShirt = ref(false);
  const wearingShirt = ref(false);

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

  function resetAvatar() {
    coin.value = 900;
    hasShirt.value = false;
    wearingShirt.value = false;
  }

  return { coin, hasShirt, wearingShirt, buyOrToggleShirt, resetAvatar };
});
