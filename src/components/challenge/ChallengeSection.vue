<template>
  <section class="challenge-section">
    <h2 class="section-title">
      <i :class="iconClass"></i>
      {{ title }}
      <span v-if="showCount" class="count"
        >({{ challenges.length }}/{{ maxCount }})</span
      >
    </h2>
    <div class="challenge-cards">
      <ChallengeCard
        v-for="challenge in challenges"
        :key="challenge.id"
        :challenge="challenge"
        :isRecruitingPage="isRecruitingPage"
        @cardClick="handleCardClick"
      />
    </div>
  </section>
</template>

<script setup>
import ChallengeCard from './ChallengeCard.vue';

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  challenges: {
    type: Array,
    required: true,
  },
  type: {
    type: String,
    required: true,
    validator: (value) => ['common', 'personal', 'group'].includes(value),
  },
  iconClass: {
    type: String,
    required: true,
  },
  maxCount: {
    type: Number,
    default: null,
  },
  showCount: {
    type: Boolean,
    default: false,
  },
  isRecruitingPage: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['cardClick']);

const handleCardClick = (data) => {
  emit('cardClick', data);
};
</script>

<style scoped>
.challenge-section {
  margin-bottom: 30px;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin: 0 16px 16px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-title i {
  font-size: 16px;
  color: #666;
}

.count {
  font-size: 14px;
  color: #666;
  font-weight: normal;
  margin-left: 8px;
}

.challenge-cards {
  padding: 0 16px;
}
</style>
