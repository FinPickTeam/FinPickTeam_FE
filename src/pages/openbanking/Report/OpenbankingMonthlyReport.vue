<template>
  <div class="monthly-report-container" ref="reportContainer">
    <!-- 월 선택 네비게이션 -->
    <div class="report-header">
      <button
        class="nav-arrow"
        type="button"
        @click="goPrevMonth"
        aria-label="이전 달"
      >
        <i class="fa-solid fa-chevron-left"></i>
      </button>

      <span class="report-title">{{ currentYear }}년 {{ currentMonth }}월</span>

      <button
        class="nav-arrow"
        type="button"
        @click="goNextMonth"
        :disabled="isNextDisabled"
        aria-label="다음 달"
      >
        <i class="fa-solid fa-chevron-right"></i>
      </button>
    </div>

    <!-- 리포트가 없을 때 안내 -->
    <div v-if="!hasReport" class="no-report-msg">{{ noReportMessage }}</div>

    <!-- 총 소비 -->
    <section v-if="hasReport" class="report-section consumption-section">
      <div class="section-title">총 소비</div>
      <div class="consumption-amount">
        {{ totalConsumption.toLocaleString() }}원
      </div>

      <div class="consumption-diff">
        <template v-if="lastMonthDiff > 0">
          <span class="accent-red"
            >지난달보다 {{ Math.abs(lastMonthDiff).toLocaleString() }}원 더
            썼어요!</span
          >
        </template>
        <template v-else-if="lastMonthDiff < 0">
          <span class="accent-blue"
            >지난달보다 {{ Math.abs(lastMonthDiff).toLocaleString() }}원 덜
            썼어요!</span
          >
        </template>
        <template v-else>
          <span class="accent-gray">지난달과 동일해요.</span>
        </template>
      </div>
    </section>

    <!-- 지난 6개월 소비 -->
    <section v-if="hasReport" class="report-section compare-section">
      <div class="compare-title">지난 6개월 소비</div>
      <div class="compare-bar-graph">
        <div
          v-for="b in monthBars"
          :key="b.ym"
          :class="['bar', b.colorClass]"
          :style="{ height: b.height + 'px' }"
        />
      </div>
      <div class="month-labels">
        <span
          v-for="b in monthBars"
          :key="b.ym + '-label'"
          :class="[
            'month-label',
            b.ym === reportMonthStr ? 'month-label-current' : '',
          ]"
        >
          {{ monthNum(b.ym) }}월
        </span>
      </div>
    </section>

    <!-- 카테고리 요약 -->
    <section v-if="hasReport" class="report-section category-section">
      <div class="category-title">
        이번 달은 <span class="accent-main">{{ topCategoryName || '—' }}</span
        >에 가장 많이 썼어요.
      </div>

      <div class="category-bar">
        <div
          class="seg seg-1"
          :style="{ width: (top3[0]?.percent ?? 0) + '%' }"
        ></div>
        <div
          class="seg seg-2"
          :style="{ width: (top3[1]?.percent ?? 0) + '%' }"
        ></div>
        <div
          class="seg seg-3"
          :style="{ width: (top3[2]?.percent ?? 0) + '%' }"
        ></div>
        <div class="seg seg-etc" :style="{ width: etcPercent + '%' }"></div>
      </div>

      <div class="category-legend">
        <span v-for="(it, idx) in top3" :key="it.label">
          <span :class="['dot', `dot-${idx + 1}`]"></span>
          {{ it.label }} {{ (it.percent ?? 0).toFixed(1) }}%
        </span>
        <span
          ><span class="dot dot-etc"></span>그 외
          {{ etcPercent.toFixed(1) }}%</span
        >
      </div>
    </section>

    <!-- 이번 달 지출 TOP 3 -->
    <section v-if="hasReport" class="report-section top3-section">
      <div class="section-title">
        이번 달 지출 <span class="accent-main">TOP 3</span>
      </div>
      <div class="top3-list">
        <div
          class="top3-item"
          v-for="(item, idx) in top3"
          :key="item.label + '-' + idx"
        >
          <div class="top3-rank">{{ idx + 1 }}위</div>
          <div class="top3-icon">
            <img
              :src="categoryToLogo(item.label)"
              :alt="item.label + ' 로고'"
            />
          </div>
          <div class="top3-info">
            <div class="top3-label">{{ item.label }}</div>
            <div class="top3-percent">
              {{ (item.percent ?? 0).toFixed(1) }}%
            </div>
          </div>
          <div class="top3-amount">
            {{ (item.amount ?? 0).toLocaleString() }}원
          </div>
        </div>
      </div>
    </section>

    <!-- 소비 성향 (심플 버전) -->
    <section v-if="hasReport" class="report-section tendency-section">
      <!-- 🔹 아이콘 + '소비 성향 : 감정소비형' 한 줄 -->
      <div class="t-inline-head">
        <i :class="['t-head-icon', patternIcon]"></i>
        <span class="t-head-label">소비 성향</span>
        <span class="t-head-colon">:</span>
        <strong class="t-head-value">{{ patternPrimary || '—' }}</strong>
      </div>

      <!-- 2) 빨간 태그 1줄(가로, 넘치면 가로 스크롤) -->
      <div v-if="metrics.length" class="t-badges-row">
        <span class="badge alert" v-for="(m, i) in metrics" :key="m.label + i">
          <i :class="m.icon"></i>
          <span class="label">{{ m.label }}</span>
          <span class="value">{{ m.valueText }}</span>
        </span>
      </div>

      <!-- 3) 문장 줄바꿈 -->
      <div v-if="feedbackLines.length" class="t-plain-lines">
        <i class="fa-solid fa-comment-dots"></i>
        <div class="lines">
          <p v-for="(line, i) in feedbackLines" :key="'ln-' + i">{{ line }}</p>
        </div>
      </div>
    </section>

    <!-- 추천 챌린지 (그리드 카드) -->
    <section
      v-if="hasReport && computedChallenges.length"
      class="report-section challenge-section"
    >
      <div class="challenge-title">다음 달 추천 챌린지</div>

      <div class="challenge-grid">
        <div
          class="challenge-card"
          v-for="(ch, i) in computedChallenges"
          :key="ch.title + '-' + i"
        >
          <div class="challenge-left">
            <div class="challenge-icon">
              <!-- 로고 추측 금지: 공용 아이콘 하나로 고정 -->
              <i :class="getChallengeIcon()"></i>
            </div>
            <div class="challenge-content">
              <div class="challenge-text">{{ ch.title }}</div>
              <div class="challenge-goal">{{ ch.description }}</div>
            </div>
          </div>
          <div class="challenge-actions">
            <button
              class="challenge-edit-btn"
              @click="goToChallengeCreate"
              aria-label="챌린지 편집"
            >
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { downloadElementAsPDF } from '@/components/openbanking/pdfDownload';
import { categoryToLogo } from '@/components/openbanking/categoryLogo';
import { getMonthReport } from '@/api/openbanking/monthReportApi.js';

const reportContainer = ref(null);
const router = useRouter();
const goToChallengeCreate = () => router.push('/challenge/create');

// ── 기본 월: 오늘 기준 '지난달' ──
const today = new Date();
const defaultYear =
  today.getMonth() === 0 ? today.getFullYear() - 1 : today.getFullYear();
const defaultMonth = today.getMonth() === 0 ? 12 : today.getMonth(); // 1~12
const currentYear = ref(defaultYear);
const currentMonth = ref(defaultMonth);
const monthStr = computed(
  () => `${currentYear.value}-${String(currentMonth.value).padStart(2, '0')}`
);

// 네비 제한
const isMaxMonth = computed(
  () => currentYear.value === defaultYear && currentMonth.value === defaultMonth
);
const goPrevMonth = () => {
  if (currentMonth.value === 1) {
    currentYear.value--;
    currentMonth.value = 12;
  } else currentMonth.value--;
};
const goNextMonth = () => {
  if (isMaxMonth.value) return;
  if (currentMonth.value === 12) {
    currentYear.value++;
    currentMonth.value = 1;
  } else currentMonth.value++;
};
const isNextDisabled = computed(() => isMaxMonth.value);

// ── 서버 리포트 상태 ──
const serverReport = ref(null);
const loading = ref(false);
const error = ref(null);

const isCurrentMonth = computed(() => {
  const now = new Date();
  return (
    now.getFullYear() === currentYear.value &&
    now.getMonth() + 1 === currentMonth.value
  );
});
const hasReport = computed(() => !!serverReport.value && !isCurrentMonth.value);
const noReportMessage = computed(() =>
  isCurrentMonth.value
    ? `${monthStr.value} 월간 리포트는 아직 제공되지 않습니다.`
    : `${monthStr.value} 월간 리포트가 존재하지 않습니다.`
);

async function fetchReport() {
  try {
    loading.value = true;
    error.value = null;
    const r = await getMonthReport(monthStr.value);
    if (r?.status === 200) serverReport.value = r.data || null;
    else {
      serverReport.value = null;
      error.value = r?.message || '리포트 조회 실패';
    }
  } catch (e) {
    serverReport.value = null;
    if (e?.response?.status !== 404)
      error.value = e?.response?.data?.message || e.message;
  } finally {
    loading.value = false;
  }
}

// 이벤트 연결 + 월 변경시 재조회
onMounted(() => {
  window.addEventListener('download-monthly-pdf', handleDownloadPdf);
  fetchReport();
});
onUnmounted(() => {
  window.removeEventListener('download-monthly-pdf', handleDownloadPdf);
});
watch(monthStr, fetchReport);

// ── 헬퍼 ──
const monthNum = (ym) => Number(String(ym).split('-')[1] || 0);
const byMonth = computed(() => {
  const list = Array.isArray(serverReport.value?.sixMonthChart)
    ? serverReport.value.sixMonthChart
    : [];
  return new Map(list.map((x) => [String(x.month), Number(x.amount || 0)]));
});
const reportMonthStr = computed(
  () => serverReport.value?.month || monthStr.value
);
const prevOf = (ym) => {
  const [y, m] = ym.split('-').map(Number);
  const d = new Date(y, m - 2, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

// ── 합계/증감 ──
const totalConsumption = computed(() =>
  Number(serverReport.value?.totalExpense ?? 0)
);
const lastMonthDiff = computed(() => {
  const cur = byMonth.value.get(reportMonthStr.value) || 0;
  const prev = byMonth.value.get(prevOf(reportMonthStr.value)) || 0;
  return cur - prev;
});

// 평균/비교 코멘트
const avgComment = computed(() => {
  const c = serverReport.value?.averageComparison?.comment;
  if (typeof c === 'string' && c.trim()) return c.trim();
  const pct = Number(serverReport.value?.averageComparison?.totalDiffPct);
  if (!Number.isNaN(pct) && pct !== 0) {
    return pct > 0
      ? `동일 연령대 평균보다 ${pct}% 더 썼어요.`
      : `동일 연령대 평균보다 ${Math.abs(pct)}% 덜 썼어요.`;
  }
  const sp = serverReport.value?.spendingPatternFeedback;
  if (typeof sp === 'string' && sp.trim()) return sp.trim();
  return '';
});

// ── 6개월 막대 ──
const monthBars = computed(() => {
  const raw = Array.isArray(serverReport.value?.sixMonthChart)
    ? serverReport.value.sixMonthChart.map((b) => ({
        ym: String(b.month),
        sum: Number(b.amount || 0),
      }))
    : [];
  if (!raw.length) return [];

  const max = Math.max(...raw.map((b) => b.sum), 1);
  const avg = raw.reduce((s, b) => s + b.sum, 0) / raw.length; // 직전 6개월 평균
  const EPS = 0.03; // ±5% 데드존

  return raw.map((b) => {
    const isCurrent = b.ym === reportMonthStr.value;
    let colorClass = '';
    if (b.sum > avg * (1 + EPS)) colorClass = 'bar-red';
    else if (b.sum < avg * (1 - EPS)) colorClass = 'bar-green';

    return {
      ym: b.ym,
      height: Math.round((b.sum / max) * 100),
      colorClass,
    };
  });
});

// ── TOP3(서버 우선) ──
const top3 = computed(() => {
  if (
    Array.isArray(serverReport.value?.top3Spending) &&
    serverReport.value.top3Spending.length
  ) {
    return serverReport.value.top3Spending
      .map(({ category, amount, ratio }) => ({
        label: category,
        amount: Number(amount || 0),
        percent: typeof ratio === 'number' ? ratio : 0,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 3);
  }
  const list = Array.isArray(serverReport.value?.categoryChart)
    ? serverReport.value.categoryChart
    : [];
  if (!list.length) return [];
  const total = list.reduce((s, v) => s + Number(v.amount || 0), 0);
  return [...list]
    .sort((a, b) => Number(b.amount || 0) - Number(a.amount || 0))
    .slice(0, 3)
    .map((it) => ({
      label: it.category,
      amount: Number(it.amount || 0),
      percent: total ? (Number(it.amount || 0) / total) * 100 : 0,
    }));
});
const topCategoryName = computed(() => top3.value?.[0]?.label || '');
const etcPercent = computed(() => {
  const p1 = top3.value?.[0]?.percent ?? 0;
  const p2 = top3.value?.[1]?.percent ?? 0;
  const p3 = top3.value?.[2]?.percent ?? 0;
  return Math.max(0, Math.round((100 - (p1 + p2 + p3)) * 10) / 10);
});

// ── 소비 성향(★ label 무시, desc만 사용) ──
const patternPrimary = computed(() => {
  const p = Array.isArray(serverReport.value?.spendingPatterns)
    ? serverReport.value.spendingPatterns[0]
    : null;
  return (p?.desc || '').toString();
});
// 칩: patterns 배열 매핑
const PATTERN_MAP = {
  IMPULSE: '충동/감정소비',
  FRUGAL: '절약형',
  STABLE: '안정형',
  OVERSPENDER: '과소비',
  VOLATILE: '변동성 큼',
};
const patternChips = computed(() => {
  const p = Array.isArray(serverReport.value?.spendingPatterns)
    ? serverReport.value.spendingPatterns[0]
    : null;
  const arr = Array.isArray(p?.patterns) ? p.patterns : [];
  return arr.map((k) => PATTERN_MAP[k] || k);
});

// 피드백(JSON/문자열 모두 대응)
const feedbackArray = computed(() => {
  const raw = serverReport.value?.spendingPatternFeedback;
  if (!raw || typeof raw !== 'string') return [];
  try {
    const arr = JSON.parse(raw);
    return Array.isArray(arr)
      ? arr.filter((x) => x?.title || x?.description)
      : [];
  } catch {
    return [];
  }
});
const feedbackText = computed(() => {
  if (feedbackArray.value.length) return '';
  const raw = serverReport.value?.spendingPatternFeedback;
  return typeof raw === 'string' ? raw.trim() : '';
});

const feedbackLines = computed(() => {
  const raw = (feedbackText.value || avgComment.value || '').toString().trim();
  if (!raw) return [];
  // 문장 단위로 깔끔히 쪼개기 (영문 구두점 + 흔한 한글 문장 끝)
  const parts = raw
    .split(/(?<=[.!?]|요\.|요!|요\?|니다\.|습니다\.)\s+/u)
    .map((s) => s.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
  return parts;
});

// 추천 챌린지(배열 우선, 없으면 nextGoal(JSON 문자열))
const computedChallenges = computed(() => {
  if (
    Array.isArray(serverReport.value?.recommendedChallenges) &&
    serverReport.value.recommendedChallenges.length
  ) {
    return serverReport.value.recommendedChallenges;
  }
  const raw = serverReport.value?.nextGoal;
  if (!raw || typeof raw !== 'string') return [];
  try {
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter((x) => x?.title) : [];
  } catch {
    return [];
  }
});

// 소비 성향 아이콘 (desc 기준)
const patternIcon = computed(() => {
  const d = (patternPrimary.value || '').toString();
  let name = 'fa-face-meh';
  if (d.includes('감정') || d.includes('충동')) name = 'fa-bolt';
  else if (d.includes('절약') || d.includes('검소')) name = 'fa-piggy-bank';
  else if (d.includes('안정')) name = 'fa-scale-balanced';
  else if (d.includes('과소비') || d.includes('낭비')) name = 'fa-sack-dollar';
  else if (d.includes('변동') || d.includes('불안정')) name = 'fa-wave-square';
  return `fa-solid ${name}`;
});

// 지표 뽑기
const peerPct = computed(() =>
  Number(serverReport.value?.averageComparison?.totalDiffPct ?? 0)
);
const trendPct = computed(() => {
  const raw = (serverReport.value?.spendingPatternFeedback || '').toString();
  const m = raw.match(/최근\s*3개월\s*평균\s*대비\s*([+-]?\d+)%/);
  return m ? Number(m[1]) : null;
});
const metrics = computed(() => {
  const arr = [];
  if (trendPct.value !== null) {
    arr.push({
      label: '최근 3개월 대비',
      valueNum: trendPct.value,
      valueText: (trendPct.value > 0 ? '+' : '') + trendPct.value + '%',
      icon:
        trendPct.value > 0
          ? 'fa-solid fa-arrow-trend-up'
          : trendPct.value < 0
          ? 'fa-solid fa-arrow-trend-down'
          : 'fa-solid fa-minus',
    });
  }
  if (!Number.isNaN(peerPct.value) && peerPct.value !== 0) {
    arr.push({
      label: '또래 평균 대비',
      valueNum: peerPct.value,
      valueText: (peerPct.value > 0 ? '+' : '') + peerPct.value + '%',
      icon: 'fa-solid fa-user-group',
    });
  }
  return arr;
});

// 챌린지 아이콘(추측 금지: 고정)
const getChallengeIcon = () => 'fa-solid fa-list-check';

// ===== PDF 다운로드 핸들러 =====
const isDownloading = ref(false);
async function handleDownloadPdf() {
  if (isDownloading.value || !reportContainer.value) return;
  if (!hasReport.value) {
    alert('이 달은 리포트가 없어서 PDF를 만들 수 없어요.');
    return;
  }

  isDownloading.value = true;
  const el = reportContainer.value;
  el.classList.add('capturing');
  await nextTick();
  setTimeout(async () => {
    try {
      await downloadElementAsPDF({
        element: el,
        filename: `${monthStr.value}-월보고서.pdf`,
        format: 'a4',
        marginMm: 10,
        scale: Math.min(2, window.devicePixelRatio || 1),
        imageType: 'JPEG',
        imageQuality: 0.92,
        slicePx: 4096,
        mode: 'auto',
      });
    } finally {
      el.classList.remove('capturing');
      isDownloading.value = false;
    }
  }, 60);
}
</script>

<style scoped>
/* ===== 공통 레이아웃 ===== */
.monthly-report-container {
  padding: 0 16px 16px 16px;
  background: var(--color-bg-light);
  height: calc(100dvh - 160px);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: max(16px, env(safe-area-inset-bottom));
  min-height: 0;
}
.report-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 16px;
}
.report-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #222;
}
.nav-arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  color: var(--color-main);
  border-radius: 999px;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, transform 0.05s;
}
.nav-arrow:hover {
  background: #f3f3f3;
}

.report-section {
  background: #fff;
  border-radius: 18px;
  margin: 0 0 16px;
  padding: 18px;
}
.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #222;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.t-title-icon {
  color: var(--color-main);
}

/* ===== 총 소비 ===== */
.consumption-amount {
  font-size: 24px;
  font-weight: 700;
  color: #222;
  margin-bottom: 4px;
}
.consumption-diff {
  color: #666;
  font-size: 14px;
}
.avg-compare {
  margin-top: 6px;
  font-size: 13px;
  color: #444;
}

.accent-blue {
  color: var(--color-accent-2);
  font-weight: 700;
}

.accent-main {
  color: var(--color-main);
  font-weight: 700;
}

.accent-red {
  color: var(--color-accent);
  font-weight: 700;
}
.accent-gray {
  color: #666;
  font-weight: 700;
}

/* ===== 6개월 비교 ===== */
.compare-title {
  font-size: 18px;
  font-weight: 600;
  color: #222;
  margin-bottom: 12px;
}
.compare-bar-graph {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  height: 110px;
  margin-bottom: 2px;
  justify-content: center;
}
.bar {
  width: 34px;
  background: var(--color-main-light-2);
  border-radius: 8px 8px 0 0;
  transition: height 0.3s, background 0.3s;
}
.bar-red {
  background: var(--color-main-dark);
}
.bar-green {
  background: var(--color-main-light);
}
.bar-purple {
  background: var(--color-main);
}
.month-labels {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
}
.month-label {
  width: 34px;
  height: 20px;
  text-align: center;
  font-size: 12px;
  color: #666;
  font-weight: 500;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.3s;
}
.month-label-current {
  color: #222;
  font-weight: 600;
}

/* ===== 카테고리 ===== */
.category-title {
  font-size: 16px;
  font-weight: 600;
  color: #222;
  margin-bottom: 10px;
}
.category-bar {
  display: flex;
  height: 16px;
  border-radius: 10px;
  overflow: hidden;
  background: #eef0f4;
}
.seg {
  height: 100%;
  display: block;
}
.seg-1 {
  background: var(--color-main);
}
.seg-2 {
  background: var(--color-main-light);
}
.seg-3 {
  background: var(--color-main-light-2);
}
.seg-etc {
  background: var(--color-bg-accent);
}
.category-legend {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 24px;
  row-gap: 8px;
  font-size: 13px;
  color: #666;
  margin-top: 8px;
}
.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 6px;
}
.dot-1 {
  background: var(--color-main);
}
.dot-2 {
  background: var(--color-main-light);
}
.dot-3 {
  background: var(--color-main-light-2);
}
.dot-etc {
  background: var(--color-bg-accent);
}

/* ===== TOP3 ===== */
.top3-section {
  margin-bottom: 18px;
}
.top3-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.top3-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;
}
.top3-item:last-child {
  border-bottom: none;
}
.top3-rank {
  width: 32px;
  text-align: center;
  font-weight: 700;
  color: var(--color-main);
}
.top3-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}
.top3-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 50%;
}
.top3-info {
  flex: 1;
}
.top3-label {
  font-size: 15px;
  font-weight: 600;
  color: #222;
}
.top3-percent {
  font-size: 12px;
  color: #666;
}
.top3-amount {
  font-size: 16px;
  font-weight: 700;
  color: #222;
}

/* ===== 소비 성향 (정리본) ===== */
.tendency-section {
  padding: 22px 20px;
}

/* 1줄 헤더: 아이콘 + '소비 성향 : 감정소비형' */
.t-inline-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.t-head-icon {
  color: var(--color-main);
  font-size: 18px;
}
.t-head-label {
  font-size: 16px;
  font-weight: 600;
  color: #222;
}
.t-head-colon {
  opacity: 0.5;
}
.t-head-value {
  font-size: 16px;
  font-weight: 800;
  color: #1f1e37;
}

/* 🔴 빨간 배지: 1줄, 넘치면 각 배지 내부에서 말줄임 */
.t-badges-row {
  display: flex;
  gap: 8px;
  flex-wrap: nowrap;
  margin: 6px 0 10px;
}
.t-badges-row .badge.alert {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1 1 0; /* 두 배지 균등 분배 */
  min-width: 0; /* 축소 허용 */
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid #fecaca;
  background: #fee2e2;
  color: #b91c1c;
  font-size: 12.5px;
}
.t-badges-row .badge.alert i {
  flex: 0 0 auto;
}
.t-badges-row .badge.alert .label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  opacity: 0.9;
}
.t-badges-row .badge.alert .value {
  flex: 0 0 auto; /* 수치는 항상 보이게 */
  font-weight: 800;
  margin-left: 4px;
  white-space: nowrap;
}

/* 말풍선 문장 블럭 */
.t-plain-lines {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  color: #555;
  margin-top: 12px;
}
.t-plain-lines i {
  margin-top: 2px;
  opacity: 0.85;
}
.t-plain-lines .lines {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.t-plain-lines p {
  margin: 0;
  line-height: 1.55;
}

/* ===== 챌린지 ===== */
.challenge-section {
  margin-bottom: 18px;
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  border-top: 1px solid #e0e7ff;
}
.challenge-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #222;
  margin-bottom: 12px;
}
.challenge-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}
@media (min-width: 420px) {
  .challenge-grid {
    grid-template-columns: 1fr 1fr;
  }
}
.challenge-card {
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  gap: 10px;
  padding: 12px;
  border-radius: 14px;
  background: linear-gradient(0deg, #ffffff, #ffffff), #fafaff;
}
.challenge-left {
  display: flex;
  gap: 10px;
  align-items: center;
}
.challenge-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f4ff;
  border-radius: 10px;
  color: #4f46e5;
  font-size: 16px;
}
.challenge-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.challenge-text {
  font-size: 0.95rem;
  font-weight: 700;
  color: #1f1e37;
}
.challenge-goal {
  font-size: 0.82rem;
  color: #5f5c80;
  line-height: 1.2;
}
.challenge-actions {
  display: flex;
  align-items: center;
  margin-left: auto;
}
.challenge-edit-btn {
  background: #f6f7ff;
  border: 1px solid #ebe9ff;
  color: #4f46e5;
  font-size: 16px;
  cursor: pointer;
  padding: 8px 10px;
  border-radius: 10px;
  transition: 0.15s;
}
.challenge-edit-btn:hover {
  background: #eef2ff;
}

/* ===== 캡처 안정화 ===== */
.monthly-report-container.capturing {
  height: auto !important;
  overflow: visible !important;
}
.monthly-report-container.capturing,
.monthly-report-container.capturing * {
  animation: none !important;
  transition: none !important;
  box-shadow: none !important;
}
</style>
