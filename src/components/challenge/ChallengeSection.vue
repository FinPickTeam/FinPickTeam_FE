<template>
  <section class="challenge-section">
    <div class="section-title">
      <div class="title-left">
        <i :class="iconClass"></i>
        <span>{{ title }}</span>
        <span v-if="showCount" class="count">
          ({{ challenges.length }}<template v-if="maxCount">/{{ maxCount }}</template>)
        </span>
      </div>

      <!-- 제목 우측 삽입 슬롯 -->
      <div class="title-right">
        <slot name="right"></slot>
      </div>
    </div>

    <!-- 섹션 내부 공지 -->
    <div v-if="notice" class="section-notice">
      {{ notice }}
    </div>

    <div v-if="challenges.length === 0" class="empty">
      {{ emptyMessage || '표시할 항목이 없습니다.' }}
    </div>

    <div v-else class="challenge-cards">
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
  title: { type: String, required: true },
  challenges: { type: Array, required: true, default: () => [] },
  type: {
    type: String,
    required: true,
    validator: (v) => ['common', 'personal', 'group'].includes(v),
  },
  iconClass: { type: String, required: true },
  maxCount: { type: Number, default: null },
  showCount: { type: Boolean, default: false },
  isRecruitingPage: { type: Boolean, default: false },
  emptyMessage: { type: String, default: '' },
  notice: { type: String, default: '' },                 // ✅ 섹션 내부 공지
});

const emit = defineEmits(['cardClick']);
const handleCardClick = (data) => emit('cardClick', { ...data, type: props.type });
</script>

<style scoped>
.challenge-section{margin-bottom:30px}
.section-title{
  display:flex; justify-content:space-between; align-items:center;
  margin:0 16px 12px;
}
.title-left{display:flex; align-items:center; gap:8px; font-weight:700; color:#333; font-size:18px}
.title-left i{font-size:16px;color:#666}
.title-right{display:flex; align-items:center}
.count{font-size:14px;color:#666;font-weight:400;margin-left:8px}

.section-notice{
  margin:0 16px 12px;
  padding:10px 12px;
  font-size:13px;
  color:#555;
  background:#f5f7fa;       /* 밝은 회색 톤 */
  border:1px solid #e5e7eb;  /* 연한 경계선 */
  border-radius:10px;
}

.challenge-cards{padding:0 16px}
.empty{padding:12px 16px;color:#888;font-size:14px}
</style>
