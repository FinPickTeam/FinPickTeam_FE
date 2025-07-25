import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useFavoriteStore = defineStore('favorite', () => {
  const favorites = ref([]);

  function addFavorite(product) {
    if (
      !favorites.value.find(
        (p) => p.depositProductName === product.depositProductName
      )
    ) {
      favorites.value.push(product);
    }
  }

  function removeFavorite(product) {
    favorites.value = favorites.value.filter(
      (p) => p.depositProductName !== product.depositProductName
    );
  }

  function isFavorite(product) {
    return favorites.value.some(
      (p) => p.depositProductName === product.depositProductName
    );
  }

  return { favorites, addFavorite, removeFavorite, isFavorite };
});
