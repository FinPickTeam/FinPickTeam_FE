// /src/utils/categoryLogo.js
// spending_logo 폴더의 모든 png 미리 매핑
const logos = import.meta.glob('/src/assets/spending_logo/*.png', {
  eager: true,
  import: 'default',
});

// API가 주는 라벨의 별칭 정규화(슬래시/및 → 쉼표, 공백 정돈)
const normalize = (label) => {
  let s = (label || '').trim();
  if (!s) return '기타';
  // 대표 케이스 치환
  s = s.replaceAll('/', ', ');
  s = s.replace(/(\s*)및(\s*)/g, ', ');
  // 공백/쉼표 정리: ",  " → ", ", "  " → " "
  s = s
    .replace(/\s*,\s*/g, ', ')
    .replace(/\s+/g, ' ')
    .trim();
  // 특수 케이스 보정 (원하는 파일명에 정확히 맞추기)
  const ALIAS = {
    '카페/간식': '카페, 간식',
    '쇼핑/미용': '쇼핑, 미용',
    '편의점/마트/잡화': '편의점, 마트, 잡화',
    '주거/통신': '주거, 통신',
    '보험 및 기타 금융': '보험, 기타 금융',
    카테고리없음: '카테고리 없음',
  };
  if (ALIAS[label]) return ALIAS[label];
  return s;
};

// 카테고리 라벨 -> 이미지 src
export const categoryToLogo = (label) => {
  const normalized = normalize(label);
  const key = `/src/assets/spending_logo/${normalized}.png`;
  return logos[key] || logos['/src/assets/spending_logo/기타.png'];
};

// alt 텍스트용 라벨
export const categoryAlt = (label) => `${(label || '기타').trim()} 로고`;
