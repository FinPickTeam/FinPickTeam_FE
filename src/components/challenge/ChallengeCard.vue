<template>
  <div class="challenge-card" @click="handleCardClick">
    <div class="card-header">
      <h3 class="challenge-title">{{ challenge.title }}</h3>
    </div>
    <div class="card-content">
      <p class="challenge-description">{{ challenge.description }}</p>
      <div class="progress-info">
        <div class="progress-bar">
          <div
            class="progress-fill"
            :style="{ width: challenge.progress + '%' }"
          ></div>
        </div>
        <span class="progress-text">{{ challenge.progress }}% 완료</span>
      </div>
      <div class="challenge-stats">
        <span class="stat">D-{{ challenge.remainingDays }}</span>
        <span class="stat">{{ getStatText() }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  challenge: {
    type: Object,
    required: true,
  },
  type: {
    type: String,
    required: true,
    validator: (value) => ['common', 'personal', 'group'].includes(value),
  },
});

const getStatText = () => {
  switch (props.type) {
    case 'common':
      return `${props.challenge.participants}명 참여`;
    case 'personal':
      return `${props.challenge.target}원 목표`;
    case 'group':
      return `${props.challenge.participants}/${props.challenge.maxParticipants}명`;
    default:
      return '';
  }
};

const emit = defineEmits(['cardClick']);

const handleCardClick = () => {
  emit('cardClick', {
    challenge: props.challenge,
    type: props.type,
  });
};
</script>

<style scoped>
.challenge-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.challenge-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.challenge-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.challenge-description {
  font-size: 14px;
  color: #666;
  margin: 0;
  line-height: 1.4;
}

.progress-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(
    to right,
    var(--color-main),
    var(--color-main-light)
  );
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  color: #666;
  min-width: 60px;
}

.challenge-stats {
  display: flex;
  gap: 16px;
}

.stat {
  font-size: 12px;
  color: #999;
  background-color: #f5f5f5;
  padding: 4px 8px;
  border-radius: 8px;
}
</style>
