<template>
  <div class="avatar-stack" :style="{ width: sizePx, height: sizePx }">
    <template v-if="layerUrls.length">
      <img
          v-for="(url, i) in layerUrls"
          :key="i"
          :src="url"
          class="layer"
          loading="lazy"
          decoding="async"
          alt=""
      />
    </template>
    <div v-else class="fallback">{{ initial }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
// 기본 아바타 이미지 import
import baseAvatar from '../../pages/mypage/avatar/avatarimg/avatar-base.png';

const props = defineProps({
  levelId: Number,
  topId: Number,
  shoesId: Number,
  accessoryId: Number,
  giftCardId: Number,
  nickname: String,
  size: {type: Number, default: 56}, // 썸네일 한 변(px)
});

// S3 베이스 (고정)
const S3_BASE = 'https://finpickbucket.s3.ap-northeast-2.amazonaws.com';

// 폴더 구조
const DIR = {
  accessory: 'accessory',
  giftCard: 'giftCard',
  level: 'level',
  shoes: 'shoes',
  top: 'top',
};

// ===== 맵핑 =====
// 레벨 (levelId → 하위 디렉터리/파일)
const LEVEL_MAP = {
  1: `${DIR.level}/SEEDLING/sprout.png`,   // 금융새싹
  2: `${DIR.level}/TRAINEE/beginner.png`,  // 금융견습
  3: `${DIR.level}/WIZARD/wizardhat.png`,  // 금융법사
  4: `${DIR.level}/MASTER/dosa.png`,       // 금융도사
};

// 액세서리 (accessoryId → 파일)
const ACCESSORY_MAP = {
  1: `${DIR.accessory}/blush.png`,         // 블러셔
  2: `${DIR.accessory}/sunglasses.png`,    // 선글라스
};

// 상의/신발/기프트카드: 실제 파일명에 맞게 추가해 주세요.
const TOP_MAP = {
  // 예) 1: `${DIR.top}/hoodie.png`,
};
const SHOES_MAP = {
  // 예) 1: `${DIR.shoes}/sneakers.png`,
};
const GIFT_CARD_MAP = {
  // 예) 1: `${DIR.giftCard}/gift.png`,
};

const makeUrl = (path) => `${S3_BASE}/${path}`;

const layerUrls = computed(() => {
  const arr = [];
  
  // 기본 아바타 이미지를 베이스로 설정
  arr.push(baseAvatar);
  
  // 레이어 순서: 레벨(베이스) → 상의 → 신발 → 액세서리 → 기프트카드
  if (props.levelId && LEVEL_MAP[props.levelId]) arr.push(makeUrl(LEVEL_MAP[props.levelId]));
  if (props.topId && TOP_MAP[props.topId]) arr.push(makeUrl(TOP_MAP[props.topId]));
  if (props.shoesId && SHOES_MAP[props.shoesId]) arr.push(makeUrl(SHOES_MAP[props.shoesId]));
  if (props.accessoryId && ACCESSORY_MAP[props.accessoryId]) arr.push(makeUrl(ACCESSORY_MAP[props.accessoryId]));
  if (props.giftCardId && GIFT_CARD_MAP[props.giftCardId]) arr.push(makeUrl(GIFT_CARD_MAP[props.giftCardId]));
  
  return arr;
});

const sizePx = computed(() => props.size + 'px');
const initial = computed(() => (props.nickname || '?').slice(0, 1));
</script>

<style scoped>
.avatar-stack {
  position: relative;
  overflow: hidden;
}

.layer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain; /* 원형 안에 자연스럽게 */
}

.fallback {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #666;
}
</style>
