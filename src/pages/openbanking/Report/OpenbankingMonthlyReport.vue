<template>
  <div class="monthly-report-container" ref="reportContainer">
    <!-- 월 선택 네비게이션 -->
    <div class="report-header">
      <button class="nav-arrow" @click="goPrevMonth">◀</button>
      <span class="report-title">{{ currentYear }}년 {{ currentMonth }}월</span>
      <button class="nav-arrow" @click="goNextMonth" :disabled="isNextDisabled">
        ▶
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
          <span class="accent-red">
            지난달보다 {{ Math.abs(lastMonthDiff).toLocaleString() }}원 더
            썼어요!
          </span>
        </template>
        <template v-else-if="lastMonthDiff < 0">
          <span class="accent-blue">
            지난달보다 {{ Math.abs(lastMonthDiff).toLocaleString() }}원 덜
            썼어요!
          </span>
        </template>
        <template v-else>
          <span class="accent-gray">지난달보다 같은 금액을 썼어요!</span>
        </template>
      </div>
    </section>

    <!-- 지난달 비교 -->
    <section v-if="hasReport" class="report-section compare-section">
      <div class="compare-title">
        지난달보다
        <span class="accent-blue" v-if="lastMonthDiff < 0">
          {{ Math.round(Math.abs(lastMonthDiff) / 10000) }}만원 덜
        </span>
        <span class="accent-red" v-else-if="lastMonthDiff > 0">
          {{ Math.round(lastMonthDiff / 10000) }}만원 더
        </span>
        <span class="accent-gray" v-else> 같은 금액을 </span>
        썼어요.
      </div>
      <div class="compare-bar-graph">
        <div
          v-for="(bar, idx) in monthBarHeights"
          :key="idx"
          :class="['bar', bar.isCurrent ? 'bar-accent' : '', bar.colorClass]"
          :style="{ height: bar.height + 'px' }"
        ></div>
      </div>
      <div class="month-labels">
        <span
          v-for="(bar, idx) in monthBarHeights"
          :key="idx"
          :class="['month-label', bar.isCurrent ? 'month-label-current' : '']"
        >
          {{ getMonthLabel(idx) }}
        </span>
      </div>
    </section>

    <!-- 카테고리 요약 (TOP3 기준) -->
    <section v-if="hasReport" class="report-section category-section">
      <div class="category-title">
        이번 달은
        <span class="accent-blue">{{ topCategoryName || '식비' }}</span
        >에 가장 많이 썼어요.
      </div>

      <!-- TOP1/2/3 + 그 외 -->
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
        이번 달 지출 <span class="accent-blue">TOP 3</span>
      </div>
      <div class="top3-list">
        <div class="top3-item" v-for="(item, idx) in top3" :key="item.label">
          <div class="top3-rank">{{ idx + 1 }}위</div>
          <div class="top3-icon">
            <img
              :src="getSpendingLogo(item.label)"
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

    <!-- 소비 성향 -->
    <section v-if="hasReport" class="report-section tendency-section">
      <div class="tendency-row">
        <span class="tendency-icon">🔍</span>
        <span>
          나의 소비 성향은
          <span class="accent-blue">{{ spendingPatternLabels }}</span
          >이에요.
        </span>
      </div>
      <div class="tendency-desc">
        {{ spendingPatternFeedbackText }}
      </div>
    </section>

    <!-- 다음 달 추천 챌린지 -->
    <section v-if="hasReport" class="report-section challenge-section">
      <div class="challenge-title">다음 달 추천 챌린지</div>
      <div class="challenge-item">
        <div class="challenge-icon"><i class="fas fa-coins"></i></div>
        <div class="challenge-content">
          <div class="challenge-text">저축률 회복하기</div>
          <div class="challenge-goal">최소 450,000원 저축해보아요.</div>
        </div>
        <div class="challenge-edit">
          <button class="challenge-edit-btn" @click="goToChallengeCreate">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// r = { status, message, data } 형태
import {
  getMonthReport,
  exportMonthReportPdf,
} from '@/api/openbanking/monthReportApi.js';

const reportContainer = ref(null);
const router = useRouter();
const goToChallengeCreate = () => router.push('/challenge/create');

// ── 월 상태: 오늘 기준 '지난달'을 기본값 ─────────────────────────────
const today = new Date();
const defaultYear =
  today.getMonth() === 0 ? today.getFullYear() - 1 : today.getFullYear();
const defaultMonth = today.getMonth() === 0 ? 12 : today.getMonth(); // 1~12

const currentYear = ref(defaultYear);
const currentMonth = ref(defaultMonth);
const monthStr = computed(
  () => `${currentYear.value}-${String(currentMonth.value).padStart(2, '0')}`
);

// 네비게이션 제한
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

// ── 서버 리포트 상태 ────────────────────────────────────────────────
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

// ✅ 먼저 선언(hoist 안되는 const 회피)
const fetchReport = async () => {
  try {
    loading.value = true;
    error.value = null;
    const r = await getMonthReport(monthStr.value); // {status, message, data}
    if (r?.status === 200) serverReport.value = r.data || null;
    else {
      serverReport.value = null;
      error.value = r?.message || '리포트 조회 실패';
    }
  } catch (e) {
    serverReport.value = null;
    if (e?.response?.status === 404) error.value = null; // 리포트 없음
    else error.value = e?.response?.data?.message || e.message;
  } finally {
    loading.value = false;
  }
};

// 이벤트 리스너에서 쓸 핸들러는 함수 선언문으로(호이스팅)
function handleDownloadPdf() {
  captureAndDownloadPDF();
}

// mount & 월 변경 시 재조회
onMounted(() => {
  fetchReport();
  window.addEventListener('download-monthly-pdf', handleDownloadPdf);
});
onUnmounted(() =>
  window.removeEventListener('download-monthly-pdf', handleDownloadPdf)
);
watch(monthStr, fetchReport);

// ── “리포트 기준 월”로 정확 비교 ─────────────────────────────────────
// 서버 리포트의 기준 월 (YYYY-MM). 없으면 현재 선택 월로 폴백
const reportMonthStr = computed(() => {
  const m = serverReport.value?.month;
  return typeof m === 'string' && /^\d{4}-\d{2}$/.test(m) ? m : monthStr.value;
});

// reportMonthStr의 "지난달" (YYYY-MM)
const reportPrevMonthStr = computed(() => {
  const [y, m] = reportMonthStr.value.split('-').map(Number);
  const d = new Date(y, m - 2, 1); // m-1(지난달), JS 월은 0부터라 -2
  const yy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${yy}-${mm}`;
});

// last7Months / sixMonthChart를 (ym, sum) 쌍으로 통일
const seriesPairs = computed(() => {
  const pairs = [];
  if (Array.isArray(serverReport.value?.last7Months)) {
    for (const b of serverReport.value.last7Months) {
      const ym = b.ym || b.month;
      const sum = b.sum ?? b.amount ?? 0;
      if (ym) pairs.push([String(ym), Number(sum)]);
    }
  }
  if (Array.isArray(serverReport.value?.sixMonthChart)) {
    for (const b of serverReport.value.sixMonthChart) {
      const ym = b.month;
      const sum = b.amount ?? 0;
      if (ym) pairs.push([String(ym), Number(sum)]);
    }
  }
  return pairs;
});
const getAmountByMonth = (ym) => {
  const hit = seriesPairs.value.find(([k]) => k === ym);
  return hit ? hit[1] : 0;
};

// ── 합계/증감 ───────────────────────────────────────────────────────
// 이번 달(= 서버 리포트 month)의 총 지출
const totalConsumption = computed(() =>
  Number(
    serverReport.value?.totalExpense ??
      serverReport.value?.totalConsumption ??
      getAmountByMonth(reportMonthStr.value) ??
      0
  )
);

// 지난달(= reportMonthStr의 직전 월) 총 지출
const prevMonthConsumption = computed(() => {
  const cmp = serverReport.value?.compareExpense;
  if (cmp && typeof cmp.prevExpense === 'number')
    return Number(cmp.prevExpense);
  if (cmp && typeof cmp.prevAssetTotal === 'number')
    return Number(cmp.prevAssetTotal);
  return getAmountByMonth(reportPrevMonthStr.value);
});

// 지난달 대비 증감
const lastMonthDiff = computed(
  () => totalConsumption.value - prevMonthConsumption.value
);

// ── 보조 함수 ───────────────────────────────────────────────────────
const normalize = (s = '') =>
  String(s).trim().replace(/\s+/g, '').replace(/,/g, '/');

// 로고
const getSpendingLogo = (label = '') => {
  const n = normalize(label);
  const file = n.includes('식비')
    ? '식비.png'
    : n.includes('카페') || n.includes('간식')
    ? '카페, 간식.png'
    : n.includes('쇼핑') ||
      n.includes('미용') ||
      n.includes('편의점') ||
      n.includes('마트') ||
      n.includes('잡화')
    ? '쇼핑, 미용.png'
    : '기타.png';
  try {
    return new URL(`/src/assets/spending_logo/${file}`, import.meta.url).href;
  } catch {
    return new URL('/src/assets/spending_logo/기타.png', import.meta.url).href;
  }
};

// ── TOP3: 서버 우선, 없으면 categoryChart로 계산 ────────────────────
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

// TOP1 이름(타이틀)
const topCategoryName = computed(
  () =>
    top3.value?.[0]?.label ||
    (serverReport.value?.mainCategory?.name ??
      serverReport.value?.mainCategory ??
      '')
);

// 범례용 '그 외' 퍼센트 (소수 1자리 반올림)
const etcPercent = computed(() => {
  const p1 = top3.value?.[0]?.percent ?? 0;
  const p2 = top3.value?.[1]?.percent ?? 0;
  const p3 = top3.value?.[2]?.percent ?? 0;
  return Math.max(0, Math.round((100 - (p1 + p2 + p3)) * 10) / 10);
});

// ── 월별 막대 (sixMonthChart/last7Months 모두 지원) ─────────────────
const monthBarHeights = computed(() => {
  const raw = Array.isArray(serverReport.value?.last7Months)
    ? serverReport.value.last7Months.map((b) => ({
        ym: String(b.ym || b.month),
        sum: Number(b.sum ?? b.amount ?? 0),
      }))
    : Array.isArray(serverReport.value?.sixMonthChart)
    ? serverReport.value.sixMonthChart.map((b) => ({
        ym: String(b.month),
        sum: Number(b.amount ?? 0),
      }))
    : [];
  if (!raw.length) return [];
  const max = Math.max(...raw.map((b) => b.sum), 1);
  return raw.map((b) => ({
    ym: b.ym,
    height: Math.round((b.sum / max) * 100),
    colorClass:
      b.sum > 1_000_000
        ? 'bar-red'
        : b.sum < 500_000
        ? 'bar-green'
        : 'bar-purple',
    // ✅ 서버 리포트 월과 동일하면 강조
    isCurrent: b.ym === reportMonthStr.value,
  }));
});
const getMonthLabel = (idx) => {
  const bars = monthBarHeights.value;
  const b = bars[idx];
  if (b?.ym) {
    const m = Number(String(b.ym).split('-')[1] || 0);
    return `${m}월`;
  }
  const center = Math.floor(bars.length / 2);
  const base = new Date(currentYear.value, currentMonth.value - 1, 1);
  const d = new Date(base.getFullYear(), base.getMonth() + (idx - center), 1);
  return `${d.getMonth() + 1}월`;
};

// 소비 성향 라벨 (null-safe, 배열/문자열 모두 대응)
const spendingPatternLabels = computed(() => {
  const p = serverReport.value?.spendingPatterns;

  // 배열 형태: [{ label: '...' }, ...]
  if (Array.isArray(p) && p.length) {
    const labels = p.map((x) => x?.label).filter(Boolean);
    return labels.length ? labels.join(' + ') : '일반형';
  }

  // 문자열 형태로 오는 경우
  if (typeof p === 'string' && p.trim()) return p.trim();

  // 아무 것도 없으면 기본값
  return '일반형';
});

// 소비 성향 피드백 (키 변화/누락 대비, 기본 안내 문구 제공)
const spendingPatternFeedbackText = computed(() => {
  const fb =
    (typeof serverReport.value?.spendingPatternFeedback === 'string'
      ? serverReport.value.spendingPatternFeedback
      : '') ||
    (typeof serverReport.value?.feedback === 'string'
      ? serverReport.value.feedback
      : '');

  return fb || '안정적인 소비를 유지해보세요.';
});

// ── PDF(클라 캡처) ─────────────────────────────────────────────────
const captureAndDownloadPDF = async () => {
  if (!reportContainer.value) return;
  const canvas = await html2canvas(reportContainer.value, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    width: reportContainer.value.scrollWidth,
    height: reportContainer.value.scrollHeight,
  });
  const img = canvas.toDataURL('image/png', 1.0);
  const pdfW = 210;
  const pdfH = (canvas.height * pdfW) / canvas.width;
  const pdf = new jsPDF('p', 'mm', [pdfW, pdfH]);
  pdf.addImage(img, 'PNG', 0, 0, pdfW, pdfH);
  pdf.save(`${monthStr.value}-월보고서.pdf`);
};

// (선택) 서버 PDF 다운로드
const downloadServerPdf = async () => {
  try {
    const res = await exportMonthReportPdf({
      month: monthStr.value,
      format: 'pdf',
    });
    const blob = new Blob([res.data], {
      type: res.headers['content-type'] || 'application/pdf',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${monthStr.value}-월보고서.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  } catch (e) {
    console.error('서버 PDF 다운로드 실패:', e);
  }
};
</script>

<style scoped>
.monthly-report-container {
  padding: 16px;
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
  padding: 16px 0 8px;
  margin-bottom: 16px;
}
.report-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #222;
}
.nav-arrow {
  background: none;
  border: none;
  color: #4318d1;
  font-size: 22px;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background 0.15s;
}
.nav-arrow:hover {
  background: #f3f3f3;
}

.report-section {
  background: #fff;
  border-radius: 18px;
  margin: 0 0 16px;
  padding: 18px;
  box-shadow: 0 2px 8px rgba(67, 24, 209, 0.07);
}
.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #222;
  margin-bottom: 8px;
}
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
.accent-blue {
  color: #4318d1;
  font-weight: 700;
}
.accent-red {
  color: #e74c3c;
  font-weight: 700;
}
.accent-gray {
  color: #666;
  font-weight: 700;
}

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
  width: 28px;
  background: #e0e7ff;
  border-radius: 8px 8px 0 0;
  transition: height 0.3s, background 0.3s;
}
.bar-accent {
  background: #4318d1;
}
.bar-red {
  background: #e74c3c !important;
}
.bar-green {
  background: #27ae60 !important;
}
.bar-purple {
  background: #8e44ad !important;
}
.month-labels {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
}
.month-label {
  width: 28px;
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
  background: #4318d1;
  color: #fff;
  font-weight: 700;
}

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

/* 색상 톤 단계 (1위 짙게 → 3위 옅게, 그 외 회색) */
.seg-1 {
  background: #574cff;
} /* 진보라 */
.seg-2 {
  background: #7c6afd;
} /* 중보라 */
.seg-3 {
  background: #b7a9ff;
} /* 연보라 */
.seg-etc {
  background: #d9dbe1;
} /* 회색 */
.category-bar-item {
  height: 100%;
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
  background: #574cff;
}
.dot-2 {
  background: #7c6afd;
}
.dot-3 {
  background: #b7a9ff;
}
.dot-etc {
  background: #d9dbe1;
}
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

.tendency-section {
  margin-bottom: 18px;
}
.tendency-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  margin-bottom: 4px;
  color: #222;
}
.tendency-icon {
  color: #4318d1;
  font-size: 18px;
}
.tendency-desc {
  font-size: 13px;
  color: #666;
}

.challenge-section {
  margin-bottom: 18px;
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(67, 24, 209, 0.07);
  border-top: 1px solid #e0e7ff;
}
.challenge-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #222;
  margin-bottom: 16px;
}
.challenge-item {
  display: flex;
  align-items: center;
  gap: 12px;
}
.challenge-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fef3c7;
  border-radius: 8px;
  color: #d97706;
  font-size: 16px;
}
.challenge-text {
  font-size: 0.9rem;
  font-weight: 600;
  color: #4318d1;
}
.challenge-goal {
  font-size: 0.8rem;
  color: #666;
}
.challenge-edit-btn {
  background: none;
  border: none;
  color: #4318d1;
  font-size: 18px;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.challenge-edit-btn:hover {
  background: #f3f4f6;
}
</style>
