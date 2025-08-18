<template>
  <div class="metric-content">
    <div class="metric-stock-name metric-label">
      <span class="label-wrap">
        <span class="label">{{ label }}</span>
        <span v-if="unit" class="unit">( {{ unit }} )</span>
      </span>
    </div>

    <div
      v-for="(v, i) in values"
      :key="i"
      class="metric-stock-name"
      :class="colorize ? valueClass(v) : ''"
    >
      {{ format(v) }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  label: { type: String, required: true },
  unit: { type: String, default: '' },
  values: { type: Array, default: () => [] },
  colorize: { type: Boolean, default: false },
  suffix: { type: String, default: '' },
  locale: { type: String, default: 'ko-KR' },
  thousand: { type: Boolean, default: false },
});

const format = (v) => {
  if (v === null || v === undefined || v === '') return '-';
  const n = Number(v);
  // '현재가'일 때만 원 단위 붙임
  if (props.label === '현재가') {
    return (isNaN(n) ? v : n.toLocaleString(props.locale)) + '원';
  }
  if (!isNaN(n) && props.thousand)
    return n.toLocaleString(props.locale) + props.suffix;
  return (isNaN(n) ? v : n) + props.suffix;
};

const valueClass = (v) => {
  const n = Number(v);
  if (isNaN(n)) return '';
  if (n > 0) return 'positive';
  if (n < 0) return 'negative';
  return '';
};
</script>

<style scoped>
* {
  font-family: var(--font-main);
}
.metric-content {
  display: flex;
  width: 100%;
  height: 50px;
  border-bottom: 2px solid #f3f4f6;
  justify-content: space-between;
  align-items: center;
}
.metric-stock-name {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: var(--font-size-body);
  flex-direction: row;
  word-break: keep-all;
}
.metric-content > .metric-stock-name.metric-label {
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  color: #666666;
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-regular);
  width: 100px;
  min-width: 60px;
  max-width: 100px;
}
.metric-label .label-wrap {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.metric-label .unit {
  font-size: 12px;
  color: #999;
  align-self: center;
  margin-top: 2px;
}
.positive {
  color: red;
}
.negative {
  color: blue;
}
</style>
