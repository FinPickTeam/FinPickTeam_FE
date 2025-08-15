<template>
  <div class="wrap">
    <form class="card" @submit.prevent="onSubmit">
      <h2>공통 챌린지 생성</h2>

      <div class="row">
        <label>제목</label>
        <input v-model.trim="form.title" required placeholder="예) 9월 소비 절약 챌린지" />
      </div>

      <div class="row two">
        <div>
          <label>카테고리</label>
          <!-- ✅ 이름 선택 → id 저장 -->
          <select v-model.number="form.categoryId" required>
            <option v-for="c in categories" :key="c.id" :value="c.id">
              {{ c.name }}
            </option>
          </select>
        </div>
        <div>
          <label>목표 유형</label>
          <input v-model.trim="form.goalType" placeholder="소비" />
        </div>
      </div>

      <div class="row two">
        <div>
          <label>시작일</label>
          <input type="date" v-model="form.startDate" required />
        </div>
        <div>
          <label>종료일</label>
          <input type="date" v-model="form.endDate" required />
        </div>
      </div>

      <div class="row">
        <label>목표 금액</label>
        <input type="number" v-model.number="form.goalValue" min="1000" step="100" required />
      </div>

      <div class="row">
        <label>설명</label>
        <textarea v-model.trim="form.description" rows="4" placeholder="설명을 입력하세요"></textarea>
      </div>

      <div class="action">
        <button type="submit" :disabled="loading">{{ loading ? '생성 중...' : '생성하기' }}</button>
      </div>
    </form>

    <div v-if="result" class="result card">
      <h3>생성 완료</h3>
      <p>챌린지 ID: <strong>{{ result?.challengeId }}</strong></p>
      <p>개설자: {{ result?.creatorNickname }}</p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { createCommonChallenge } from '@/api/admin';

const loading = ref(false);
const result = ref(null);

// ✅ 카테고리 이름 ↔️ id 매핑
const categories = Object.freeze([
  { id: 1, name: '전체 소비 줄이기' },
  { id: 2, name: '식비 줄이기' },
  { id: 3, name: '카페·간식 줄이기' },
  { id: 4, name: '교통비 줄이기' },
  { id: 5, name: '미용·쇼핑 줄이기' },
]);

const todayISO = () => new Date().toISOString().slice(0, 10);
const endOfMonthISO = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = d.getMonth();
  const last = new Date(y, m + 1, 0);
  return last.toISOString().slice(0, 10);
};

const form = reactive({
  title: '',
  categoryId: 1, // ✅ 기본값: '전체 소비 줄이기'
  startDate: todayISO(),
  endDate: endOfMonthISO(),
  description: '',
  goalType: '소비',
  goalValue: 100000,
});

onMounted(() => { /* 초기값 세팅됨 */ });

function validate() {
  if (!form.title?.trim()) return '제목을 입력해주세요.';
  if (!form.startDate || !form.endDate) return '기간을 입력해주세요.';
  if (new Date(form.startDate) > new Date(form.endDate)) return '시작일이 종료일보다 늦습니다.';
  if (form.goalValue < 1000) return '목표 금액은 1,000 이상이어야 합니다.';
  return null;
}

async function onSubmit() {
  const err = validate();
  if (err) return alert(err);

  loading.value = true;
  result.value = null;
  try {
    const payload = { ...form, type: 'COMMON', usePassword: false, password: null };
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
.wrap { display:grid; gap:12px; }
.card { background:#fff; border:1px solid #eee; border-radius:12px; padding:14px; }
h2 { margin:0 0 10px; font-size:18px; }
.row { display:flex; flex-direction:column; gap:6px; margin-bottom:10px; }
.row.two { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
label { font-size:12px; color:#666; }
input, textarea, select { /* ✅ select도 동일 스타일 */
  padding:12px; border:1px solid #ddd; border-radius:10px; font-size:14px; background:#fff;
}
.action { position:sticky; bottom:76px; padding-top:4px; }
.action button {
  width:100%; padding:12px; border:none; border-radius:12px; color:#fff;
  background:linear-gradient(135deg, var(--color-main, #6b46c1), var(--color-main-dark, #4c2ea6));
  font-weight:700;
}
.result h3 { margin:0 0 6px; }
</style>
