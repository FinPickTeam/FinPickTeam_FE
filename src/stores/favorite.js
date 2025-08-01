import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useFavoriteStore = defineStore('favorite', () => {
  const favorites = ref([]);

  function addFavorite(product) {
    console.log('Adding favorite:', product);

    // 예금 상품인 경우
    if (product.depositProductName) {
      if (
        !favorites.value.find(
          (p) => p.depositProductName === product.depositProductName
        )
      ) {
        favorites.value.push(product);
        console.log('Deposit product added to favorites');
      }
    }
    // 적금 상품인 경우
    else if (product.installmentProductName) {
      console.log(
        'Processing installment product:',
        product.installmentProductName
      );
      if (
        !favorites.value.find(
          (p) => p.installmentProductName === product.installmentProductName
        )
      ) {
        favorites.value.push(product);
        console.log('Installment product added to favorites');
      } else {
        console.log('Installment product already in favorites');
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
    // 펀드 상품인 경우
    else if (product.name && product.type) {
      console.log('Adding fund to favorites:', product.name, product.type);
      if (
        !favorites.value.find(
          (p) => p.name === product.name && p.type === product.type
        )
      ) {
        favorites.value.push(product);
        console.log(
          'Fund added to favorites. Current favorites:',
          favorites.value
        );
      } else {
        console.log('Fund already in favorites');
      }
    }

    console.log('Current favorites after add:', favorites.value);
  }

  function removeFavorite(product) {
    // 예금 상품인 경우
    if (product.depositProductName) {
      favorites.value = favorites.value.filter(
        (p) => p.depositProductName !== product.depositProductName
      );
    }
    // 적금 상품인 경우
    else if (product.installmentProductName) {
      favorites.value = favorites.value.filter(
        (p) => p.installmentProductName !== product.installmentProductName
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
    // 펀드 상품인 경우
    else if (product.name && product.type) {
      favorites.value = favorites.value.filter(
        (p) => !(p.name === product.name && p.type === product.type)
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
    // 적금 상품인 경우
    else if (product.installmentProductName) {
      console.log(
        'Checking installment product:',
        product.installmentProductName
      );
      console.log('Current favorites:', favorites.value);
      const result = favorites.value.some(
        (p) => p.installmentProductName === product.installmentProductName
      );
      console.log('Is installment favorite:', result);
      return result;
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
    // 펀드 상품인 경우
    else if (product.name && product.type) {
      console.log('Checking favorite for fund:', product.name, product.type);
      console.log('Current favorites:', favorites.value);
      const result = favorites.value.some(
        (p) => p.name === product.name && p.type === product.type
      );
      console.log('Is favorite:', result);
      return result;
    }
    return false;
  }

  return { favorites, addFavorite, removeFavorite, isFavorite };
});
