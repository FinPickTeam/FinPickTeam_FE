<template>
  <div class="challenge-card hot" @click="handleCardClick">
    <div class="hot-banner">
      <i class="fas fa-fire"></i>
      <span>HOT</span>
    </div>
    <h4 class="challenge-title">{{ challenge.title }}</h4>
    <div class="challenge-date">{{ challenge.date }}</div>
    <div class="challenge-participants">
      ({{ challenge.currentParticipants }}명 /
      {{ challenge.maxParticipants }}명)
    </div>
    <button class="participate-btn" @click.stop="handleParticipate">
      참여하러 가기
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  challenge: {
    type: Object,
    required: true,
    default: () => ({
      title: '',
      date: '',
      currentParticipants: 0,
      maxParticipants: 0,
    }),
  },
});

const emit = defineEmits(['participate', 'click']);

const handleParticipate = () => {
  emit('participate', props.challenge);
};

const handleCardClick = () => {
  emit('click', props.challenge);
};
</script>

<style scoped>
.challenge-card.hot {
  min-width: 280px;
  position: relative;
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.challenge-card.hot:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.hot-banner {
  background: linear-gradient(
    135deg,
    var(--color-main-dark) 0%,
    var(--color-main-light) 100%
  );
  color: white;
  padding: 8px 12px;
  border-radius: 8px 8px 0 0;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: bold;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}

.hot-banner i {
  font-size: 14px;
  color: #ff9800;
}

.challenge-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin: 40px 0 8px 0;
  line-height: 1.4;
}

.challenge-date {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.challenge-participants {
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
}

.participate-btn {
  background: linear-gradient(
    135deg,
    var(--color-main-dark) 0%,
    var(--color-main-light) 100%
  );
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  width: 100%;
  transition: transform 0.2s ease;
}

.participate-btn:hover {
  transform: translateY(-1px);
}
</style>
