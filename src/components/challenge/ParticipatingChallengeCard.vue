<template>
  <div class="challenge-card">
    <h4 class="challenge-title">{{ challenge.title }}</h4>
    <div class="challenge-date">{{ challenge.date }}</div>
    <div class="challenge-progress">진행률 {{ challenge.progress }}%</div>
  </div>
</template>

<script setup>
const props = defineProps({
  challenge: {
    type: Object,
    required: true,
    default: () => ({
      title: "",
      date: "",
      progress: 0,
    }),
  },
});
</script>

<style scoped>
.challenge-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  min-width: 280px;
}

.challenge-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.challenge-date {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.challenge-progress {
  font-size: 14px;
  font-weight: 600;
  background: linear-gradient(
    135deg,
    var(--color-main-dark) 0%,
    var(--color-main-light) 100%
  );
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  display: inline-block;
  font-size: 12px;
}
</style>
