import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useFavoriteStore = defineStore('favorite', () => {
  const favorites = ref([]);

  function addFavorite(product) {
    // 예금 상품인 경우
    if (product.depositProductName) {
      if (
        !favorites.value.find(
          (p) => p.depositProductName === product.depositProductName
        )
      ) {
        favorites.value.push(product);
      }
    }
    // 주식 상품인 경우
    else if (product.stockName) {
      if (
        !favorites.value.find(
          (p) =>
            p.stockName === product.stockName &&
            p.stockCode === product.stockCode
        )
      ) {
        favorites.value.push(product);
      }
    }
  }

  function removeFavorite(product) {
    // 예금 상품인 경우
    if (product.depositProductName) {
      favorites.value = favorites.value.filter(
        (p) => p.depositProductName !== product.depositProductName
      );
    }
    // 주식 상품인 경우
    else if (product.stockName) {
      favorites.value = favorites.value.filter(
        (p) =>
          !(
            p.stockName === product.stockName &&
            p.stockCode === product.stockCode
          )
      );
    }
  }

  function isFavorite(product) {
    // 예금 상품인 경우
    if (product.depositProductName) {
      return favorites.value.some(
        (p) => p.depositProductName === product.depositProductName
      );
    }
    // 주식 상품인 경우
    else if (product.stockName) {
      console.log(
        'Checking favorite for stock:',
        product.stockName,
        product.stockCode
      );
      console.log('Current favorites:', favorites.value);
      const result = favorites.value.some(
        (p) =>
          p.stockName === product.stockName && p.stockCode === product.stockCode
      );
      console.log('Is favorite:', result);
      return result;
    }
    return false;
  }

  return { favorites, addFavorite, removeFavorite, isFavorite };
});
