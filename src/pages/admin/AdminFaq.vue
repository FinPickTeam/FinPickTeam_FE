<template>
  <div class="wrap">
    <form class="card" @submit.prevent="addFaq">
      <h2>Q&A 등록</h2>

      <div class="row">
        <label>카테고리</label>
        <div class="two">
          <select v-model="form.category">
            <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
          </select>
          <input v-model.trim="newCat" placeholder="새 카테고리 추가" />
          <button type="button" class="add" @click="addCategory">추가</button>
        </div>
      </div>

      <div class="row">
        <label>질문</label>
        <input v-model.trim="form.q" required placeholder="예) 포인트는 언제 적립되나요?" />
      </div>

      <div class="row">
        <label>답변</label>
        <textarea v-model.trim="form.a" rows="5" required placeholder="예) 결과 확인 후 익일 오전 9시에 적립됩니다."></textarea>
      </div>

      <div class="action">
        <button type="submit">{{ loading ? '저장 중...' : '등록' }}</button>
      </div>
    </form>

    <section class="card">
      <h3>등록된 Q&A</h3>
      <div class="list" v-if="faqs.length">
        <div class="item" v-for="f in faqs" :key="f.id">
          <div class="meta">
            <span class="cat">{{ f.category }}</span>
            <button class="del" @click="remove(f.id)">삭제</button>
          </div>
          <div class="q">Q. {{ f.q }}</div>
          <div class="a">A. {{ f.a }}</div>
        </div>
      </div>
      <div v-else class="empty">아직 등록된 Q&A가 없습니다.</div>
    </section>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { listFaqs, createFaq, deleteFaq, listFaqCategories, createFaqCategory } from '@/api/admin';

const categories = ref(['일반', '챌린지', '포인트']);
const faqs = ref([]);
const loading = ref(false);
const form = reactive({ category: '일반', q: '', a: '' });
const newCat = ref('');

onMounted(async () => {
  try {
    const cats = await listFaqCategories();
    if (Array.isArray(cats) && cats.length) categories.value = cats;
  } catch {}
  faqs.value = await listFaqs();
});

async function addCategory() {
  const name = newCat.value.trim();
  if (!name) return;
  await createFaqCategory(name);
  if (!categories.value.includes(name)) categories.value.push(name);
  form.category = name;
  newCat.value = '';
}

async function addFaq() {
  if (!form.q?.trim() || !form.a?.trim()) return;
  loading.value = true;
  try {
    const saved = await createFaq({ ...form });
    faqs.value.unshift(saved);
    form.q = ''; form.a = '';
  } finally { loading.value = false; }
}

async function remove(id) {
  const ok = confirm('삭제하시겠어요?');
  if (!ok) return;
  await deleteFaq(id);
  faqs.value = faqs.value.filter((x) => x.id !== id);
}
</script>

<style scoped>
.wrap { display:grid; gap:12px; }
.card { background:#fff; border:1px solid #eee; border-radius:12px; padding:14px; }
h2 { margin:0 0 10px; font-size:18px; }
h3 { margin:0 0 8px; font-size:16px; }
.row { display:flex; flex-direction:column; gap:6px; margin-bottom:10px; }
.two { display:grid; grid-template-columns: 1fr 1fr auto; gap:8px; }
label { font-size:12px; color:#666; }
input, textarea, select { padding:12px; border:1px solid #ddd; border-radius:10px; font-size:14px; }
.add { border:1px solid #ddd; background:#fff; border-radius:10px; padding:8px 12px; }
.action { position: sticky; bottom: 76px; }
.action button {
  width:100%; padding:12px; border:none; border-radius:12px; color:#fff;
  background: linear-gradient(135deg, var(--color-main,#6b46c1), var(--color-main-dark,#4c2ea6));
  font-weight:700;
}
.list { display:grid; gap:10px; }
.item { border:1px solid #f0f0f0; border-radius:10px; padding:10px; }
.meta { display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; }
.cat { font-size:12px; color:#555; background:#f5f6ff; padding:4px 8px; border-radius:999px; }
.del { border:1px solid #ddd; background:#fff; border-radius:999px; padding:6px 10px; font-size:12px; }
.q { font-weight:700; margin-bottom:4px; }
.a { color:#444; white-space:pre-wrap; }
.empty { color:#888; }
</style>
