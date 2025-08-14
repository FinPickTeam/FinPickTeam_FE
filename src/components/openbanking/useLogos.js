// src/composables/useLogos.js
export function useLogos() {
  const bankLogo = (bank) => {
    try {
      return new URL(`../../assets/bank_logo/${bank}.png`, import.meta.url)
        .href;
    } catch {
      return new URL(`../../assets/bank_logo/KB국민은행.png`, import.meta.url)
        .href;
    }
  };
  const cardLogo = (bank) => {
    const map = {
      신한은행: '신한카드.png',
      하나은행: '하나카드.png',
      NH농협은행: '농협카드.png',
      우리은행: '우리카드.png',
      KB국민은행: '국민카드.png',
    };
    const name = map[bank] || 'bc카드.png';
    try {
      return new URL(`../../assets/card_logo/${name}`, import.meta.url).href;
    } catch {
      return new URL(`../../assets/card_logo/bc카드.png`, import.meta.url).href;
    }
  };
  return { bankLogo, cardLogo };
}
