<template>
  <div class="item" :class="[{ selected, disabled }]">
    <div class="left">
      <img v-if="logo" :src="logo" alt="" class="logo" />
      <div class="text">
        <div class="name">{{ name }}</div>
        <div v-if="sub" class="sub">{{ sub }}</div>
      </div>
    </div>
    <div class="right-amount" :class="{ negative: isNegative }">
      <slot name="amount">{{ amount?.toLocaleString() }}원</slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  logo: String,
  bank: String,
  badge: String,
  badgeClass: String,
  amount: Number,
  isNegative: Boolean,
  name: String,
  sub: String,
  selected: Boolean,
  disabled: Boolean,
});
</script>

<style scoped>
.item {
  background: var(--color-bg);
  border-radius: 12px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: background 0.15s;
  cursor: pointer;
}
.item.selected {
  background: #eef2ff;
  border: 1px solid #c7d2fe;
}
.item.disabled {
  opacity: 0.6;
  pointer-events: none;
}
.left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1 1 auto;
  min-width: 0;
}
.logo {
  width: 32px;
  height: 32px;
  object-fit: contain;
  border-radius: 4px;
}
.text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.name {
  font-size: 0.95rem;
  font-weight: 500;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.sub {
  font-size: 0.75rem;
  color: #888;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.right-amount {
  font-weight: 700;
  color: var(--color-main);
  white-space: nowrap;
}
.right-amount.negative {
  color: var(--color-accent);
}
</style>
