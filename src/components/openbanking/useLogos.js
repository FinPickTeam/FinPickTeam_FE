// src/composables/useLogos.js
const BANK_SYNONYMS = {
  KB국민은행: ['KB', '국민', '국민은행', 'KB국민'],
  신한은행: ['신한', 'shinhan'],
  하나은행: ['하나', 'KEB', 'KEB하나'],
  NH농협은행: ['농협', 'NH', 'NH농협'],
  우리은행: ['우리', 'woori'],
  카카오뱅크: ['카카오', 'kakao'],
  토스뱅크: ['토스', 'toss'],
  IBK기업은행: ['기업', 'IBK', '기업은행'],
  SC제일은행: ['SC', '제일'],
  대구은행: ['대구', 'DGB'],
  부산은행: ['부산', 'BNK부산', 'BNK'],
  경남은행: ['경남', 'BNK경남'],
  광주은행: ['광주'],
  전북은행: ['전북'],
  제주은행: ['제주'],
  우체국: ['우체국'],
  새마을금고: ['새마을', 'MG'],
  신협: ['신협', '신용협동조합'],
};

const CARD_BY_BANK = {
  KB국민은행: '국민카드',
  신한은행: '신한카드',
  하나은행: '하나카드',
  NH농협은행: '농협카드',
  우리은행: '우리카드',
  카카오뱅크: '카카오뱅크카드',
  토스뱅크: '토스카드',
  IBK기업은행: 'IBK카드',
  SC제일은행: '비씨카드', // 대부분 BC 라우팅
  대구은행: 'DGB카드',
  부산은행: 'BNK카드',
  경남은행: 'BNK카드',
  광주은행: '광주카드',
  전북은행: '전북카드',
  제주은행: '제주카드',
  우체국: '우체국카드',
  새마을금고: 'MG카드',
  신협: '신협카드',
};

const DEFAULT_BANK = 'KB국민은행';
const DEFAULT_CARD = 'bc카드';

const toKey = (s = '') => s.replace(/\s+/g, '').toLowerCase();

function buildReverseIndex(map) {
  const idx = new Map();
  Object.entries(map).forEach(([std, arr]) => {
    idx.set(toKey(std), std);
    arr.forEach((a) => idx.set(toKey(a), std));
  });
  return idx;
}

const BANK_INDEX = buildReverseIndex(BANK_SYNONYMS);

export function useLogos() {
  // 파일 맵 (파일명 기준 키 생성)
  const bankFiles = import.meta.glob('@/assets/bank_logo/*.png', {
    eager: true,
    import: 'default',
  });
  const cardFiles = import.meta.glob('@/assets/card_logo/*.png', {
    eager: true,
    import: 'default',
  });

  const mapByBasename = (files) =>
    Object.fromEntries(
      Object.entries(files).map(([p, url]) => {
        const name = decodeURIComponent(p.split('/').pop().replace('.png', '')); // "KB국민은행"
        return [name, url];
      })
    );

  const BANK_FILES = mapByBasename(bankFiles);
  const CARD_FILES = mapByBasename(cardFiles);

  const resolveBank = (text = '') => {
    // productName에서 은행 토큰 대충 뽑기
    const base = (text.split(/[ \t\-\[\]()]/).find(Boolean) || '').trim();
    const k = toKey(base);
    // 1) 정확 파일명 매치
    if (BANK_FILES[base]) return base;
    // 2) 시노님스 인덱스 탐색 (부분포함 허용)
    for (const key of BANK_INDEX.keys()) {
      if (k.includes(key)) return BANK_INDEX.get(key);
    }
    return DEFAULT_BANK;
  };

  const bankLogo = (bankLike) => {
    const std = resolveBank(bankLike || '');
    return BANK_FILES[std] || BANK_FILES[DEFAULT_BANK];
  };

  const cardLogo = (bankLike) => {
    const std = resolveBank(bankLike || '');
    const cardKey = CARD_BY_BANK[std] || DEFAULT_CARD;
    return CARD_FILES[cardKey] || CARD_FILES[DEFAULT_CARD];
  };

  return { bankLogo, cardLogo, resolveBank };
}
