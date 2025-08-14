<template>
  <div class="wrap">
    <form class="form" @submit.prevent="onSubmit">
      <div class="row">
        <label>제목</label>
        <input v-model.trim="form.title" required placeholder="예) 9월 소비 절약 공통 챌린지" />
      </div>
      <div class="row">
        <label>카테고리ID</label>
        <input type="number" v-model.number="form.categoryId" min="1" required />
      </div>
      <div class="row">
        <label>시작일</label>
        <input type="date" v-model="form.startDate" required />
      </div>
      <div class="row">
        <label>종료일</label>
        <input type="date" v-model="form.endDate" required />
      </div>
      <div class="row">
        <label>목표 유형</label>
        <input v-model.trim="form.goalType" placeholder="소비 / 지출 등" />
      </div>
      <div class="row">
        <label>목표 금액</label>
        <input type="number" v-model.number="form.goalValue" min="1000" step="100" required />
      </div>
      <div class="row">
        <label>설명</label>
        <textarea v-model.trim="form.description" rows="4" placeholder="설명을 입력하세요"></textarea>
      </div>

      <div class="actions">
        <button type="submit" :disabled="loading">{{ loading ? '생성 중...' : '공통 챌린지 생성' }}</button>
      </div>
    </form>

    <div v-if="result" class="result">
      <h4>생성 결과</h4>
      <pre>{{ result }}</pre>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { createCommonChallenge } from '@/api/admin';

const loading = ref(false);
const result = ref(null);

const form = reactive({
  title: '',
  categoryId: 1,
  startDate: '',
  endDate: '',
  description: '',
  goalType: '소비',
  goalValue: 100000,
});

async function onSubmit() {
  loading.value = true;
  result.value = null;
  try {
    const payload = {
      ...form,
      type: 'COMMON',
      usePassword: false,
      password: null,
    };
    const res = await createCommonChallenge(payload);
    result.value = res;
    alert('공통 챌린지가 생성되었습니다.');
  } catch (e) {
    console.error(e);
    alert('생성 중 오류가 발생했습니다.');
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.wrap { display:grid; grid-template-columns: 1fr; gap:16px; max-width:720px; }
.form { background:#fff; border:1px solid #eee; border-radius:12px; padding:16px; }
.row { display:flex; flex-direction:column; gap:6px; margin-bottom:12px; }
label { font-size:12px; color:#666; }
input, textarea { padding:10px; border:1px solid #ddd; border-radius:8px; }
.actions { display:flex; justify-content:flex-end; }
button { background:#111; color:#fff; border:none; padding:10px 14px; border-radius:8px; cursor:pointer; }
.result { background:#fafafa; border:1px dashed #ddd; border-radius:12px; padding:16px; white-space:pre-wrap; }
</style>
