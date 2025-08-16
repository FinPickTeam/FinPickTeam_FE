<script setup>
import { computed } from 'vue';

const props = defineProps({
  product: { type: Object, required: true },
  selected: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
});

// 표시용 데이터 가드 + 포맷
const name = computed(
  () => props.product.name ?? props.product.stockName ?? ''
);
const code = computed(() =>
  String(props.product.id ?? props.product.stockCode ?? '').padStart(6, '0')
);
const market = computed(() => props.product.stockMarketType ?? '');
const priceRaw = computed(() =>
  Number(String(props.product.stockPrice ?? '').replace(/[^\d.-]/g, ''))
);
const priceText = computed(() =>
  Number.isFinite(priceRaw.value) ? priceRaw.value.toLocaleString() : '-'
);

const chgRaw = computed(() =>
  Number(String(props.product.stockChangeRate ?? '').replace(/[^\d.-]/g, ''))
);
const chgSign = computed(() =>
  Number.isFinite(chgRaw.value)
    ? chgRaw.value > 0
      ? '+'
      : chgRaw.value < 0
      ? '−'
      : ''
    : ''
);
const chgText = computed(() =>
  Number.isFinite(chgRaw.value)
    ? `${chgSign.value}${Math.abs(chgRaw.value).toFixed(2)}%`
    : '-'
);
const chgClass = computed(() =>
  chgRaw.value > 0 ? 'up' : chgRaw.value < 0 ? 'down' : 'flat'
);
</script>

<template>
  <!-- role/aria로 접근성 부여(모달 래퍼에서 클릭을 처리하더라도 카드도 상태를 노출) -->
  <article
    class="card"
    :class="{ selected, disabled }"
    role="group"
    :aria-disabled="disabled"
    :aria-pressed="selected"
  >
    <div class="left">
      <div class="title">
        <span class="name">{{ name }}</span>
        <span class="code">· {{ code }}</span>
      </div>
      <div class="meta">
        <span class="market-chip">{{ market }}</span>
      </div>
    </div>

    <div class="right">
      <div class="price">{{ priceText }}</div>
      <div class="change" :class="chgClass">{{ chgText }}</div>
    </div>

    <!-- 선택 체크 표시 -->
    <div class="check" v-if="selected" aria-hidden="true">
      <!-- 심플 체크 SVG -->
      <svg viewBox="0 0 24 24" class="check-icon">
        <circle cx="12" cy="12" r="12" class="check-bg" />
        <path d="M6.5 12.5l3.2 3.2 7.8-7.8" class="check-mark" />
      </svg>
    </div>
  </article>
</template>

<style scoped>
.card {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;
  align-items: center;

  border: 1px solid var(--color-bg-border, #e9ecef);
  border-radius: 12px;
  background: var(--color-bg, #fff);
  padding: 12px;
  /* 부드러운 인터랙션 */
  transition: border 0.2s ease, box-shadow 0.2s ease, background 0.2s ease,
    transform 0.08s ease;
}

.card:not(.disabled):active {
  transform: translateY(1px);
}

/* 선택 시 테두리/배경 강조 */
.card.selected {
  border: 1.5px solid var(--color-main, #6b7cff);
  background: color-mix(in oklab, var(--color-main, #6b7cff) 6%, #ffffff);
  box-shadow: 0 0 0 2px
    color-mix(in oklab, var(--color-main, #6b7cff) 22%, transparent);
}

/* 비활성(선택 3개 찼을 때 나머지) */
.card.disabled {
  opacity: 0.55;
  filter: grayscale(10%);
}

/* 좌측 */
.left .title {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 6px;
}
.name {
  font-weight: 700;
  font-size: 15px;
}
.code {
  font-size: 12px;
  color: #8a8f98;
}
.meta {
  display: flex;
  gap: 6px;
}
.market-chip {
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 999px;
  border: 1px solid #e9ecef;
  background: #f8f9fa;
  color: #667085;
}

/* 우측 */
.right {
  text-align: right;
}
.price {
  font-weight: 700;
  font-size: 15px;
  line-height: 1.05;
}
.change {
  margin-top: 4px;
  font-size: 12px;
  font-weight: 600;
}
.change.up {
  color: #e03131;
} /* 빨강 상승 */
.change.down {
  color: #1864ab;
} /* 파랑 하락 */
.change.flat {
  color: #8a8f98;
} /* 보합 */

/* 체크 아이콘 (선택 시 오른쪽 상단에 뜸) */
.check {
  position: absolute;
  top: -6px;
  right: -6px;
}
.card {
  position: relative; /* 체크 포지셔닝용 */
}
.check-icon {
  width: 22px;
  height: 22px;
}
.check-bg {
  fill: var(--color-main, #6b7cff);
}
.check-mark {
  fill: none;
  stroke: #fff;
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
