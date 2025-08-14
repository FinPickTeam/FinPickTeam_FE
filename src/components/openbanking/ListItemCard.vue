<template>
  <div class="item" :class="[{ selected, disabled }]">
    <div class="top">
      <div class="bank">
        <img v-if="logo" :src="logo" alt="" class="logo" />
        <div class="names">
          <div class="bank-name">
            {{ bank }}
            <span v-if="badge" class="badge" :class="badgeClass">{{
              badge
            }}</span>
          </div>
        </div>
      </div>
      <div class="right-amount" :class="{ negative: isNegative }">
        <slot name="amount">{{ amount?.toLocaleString() }}원</slot>
      </div>
    </div>
    <div class="bottom">
      <div class="name">{{ name }}</div>
      <div class="sub">{{ sub }}</div>
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
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  transition: 0.15s;
  cursor: pointer;
}
.item.selected {
  border-color: #dc2626;
  background: #fef2f2;
}
.item.disabled {
  opacity: 0.5;
  pointer-events: none;
}
.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.bank {
  display: flex;
  align-items: center;
  gap: 12px;
}
.logo {
  width: 32px;
  height: 32px;
  object-fit: contain;
  border-radius: 4px;
}
.bank-name {
  font-weight: 600;
}
.badge {
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 0.7rem;
  color: #fff;
  margin-left: 8px;
}
.right-amount {
  font-weight: 700;
  color: #4318d1;
}
.right-amount.negative {
  color: #e11d48;
}
.bottom {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.name {
  color: #666;
}
.sub {
  color: #888;
  font-size: 0.9rem;
}
</style>
