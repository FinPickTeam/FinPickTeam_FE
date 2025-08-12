<template>
  <div class="monthly-report-container" ref="reportContainer">
    <!-- 월 선택 네비게이션 -->
    <div class="report-header">
      <button class="nav-arrow" @click="goPrevMonth">◀</button>
      <span class="report-title">{{ currentYear }}년 {{ currentMonth }}월</span>
      <button class="nav-arrow" @click="goNextMonth">▶</button>
    </div>

    <!-- 총 소비 -->
    <section class="report-section consumption-section">
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
          <span class="accent-gray">지난달보다 같은 금액을 썼어요!</span>
        </template>
      </div>
    </section>

    <!-- 지난달 비교 -->
    <section class="report-section compare-section">
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

    <!-- 이번 달은 식비에 가장 많이 썼어요 -->
    <section class="report-section category-section">
      <div class="category-title">
        이번 달은 <span class="accent-blue">식비</span>에 가장 많이 썼어요.
      </div>
      <div class="category-bar">
        <div
          class="category-bar-item food"
          :style="{ width: (categoryPercents?.['식비'] ?? 0) + '%' }"
        ></div>
        <div
          class="category-bar-item online"
          :style="{
            width: (categoryPercents?.['온라인쇼핑'] ?? 0) + '%',
          }"
        ></div>
        <div
          class="category-bar-item cafe"
          :style="{ width: (categoryPercents?.['카페/간식'] ?? 0) + '%' }"
        ></div>
        <div
          class="category-bar-item etc"
          :style="{ width: (categoryPercents?.['그 외'] ?? 0) + '%' }"
        ></div>
      </div>
      <div class="category-legend">
        <span
          ><span class="dot food"></span>식비
          {{ (categoryPercents?.['식비'] ?? 0).toFixed(1) }}%</span
        >
        <span
          ><span class="dot cafe"></span>카페/간식
          {{ (categoryPercents?.['카페/간식'] ?? 0).toFixed(1) }}%</span
        >
        <span
          ><span class="dot online"></span>온라인쇼핑
          {{ (categoryPercents?.['온라인쇼핑'] ?? 0).toFixed(1) }}%</span
        >
        <span
          ><span class="dot etc"></span>그 외
          {{ (categoryPercents?.['그 외'] ?? 0).toFixed(1) }}%</span
        >
      </div>
    </section>

    <!-- 이번 달 지출 TOP 3 -->
    <section class="report-section top3-section">
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
    <section class="report-section tendency-section">
      <div class="tendency-row">
        <span class="tendency-icon">🔍</span>
        <span
          >나의 소비 성향은
          <span class="accent-blue">감정적 소비형 + 외식 과다형</span
          >이에요.</span
        >
      </div>
      <div class="tendency-desc">
        다음 달엔 식비와 카페 지출을 약 <span class="accent">15%</span> 줄여보는
        걸 추천드려요.
      </div>
    </section>

    <!-- 다음 달 추천 챌린지 -->
    <section class="report-section challenge-section">
      <div class="challenge-title">다음 달 추천 챌린지</div>
      <div class="challenge-item">
        <div class="challenge-icon">
          <i class="fas fa-coins"></i>
        </div>
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
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
  getMonthReport,
  createMonthReport,
  initMonthReport,
  exportMonthReportPdf,
} from '@/api/openbanking/monthReportApi';

const reportContainer = ref(null);

const router = useRouter();

const goToChallengeCreate = () => {
  router.push('/challenge/create');
};

// PDF 다운로드 이벤트 리스너
const handleDownloadPdf = () => {
  captureAndDownloadPDF();
};

onMounted(() => {
  fetchReport();
  window.addEventListener('download-monthly-pdf', handleDownloadPdf);
});

onUnmounted(() => {
  window.removeEventListener('download-monthly-pdf', handleDownloadPdf);
});

// 월 상태 - 현재 날짜로 초기화
const currentYear = ref(new Date().getFullYear());
const currentMonth = ref(new Date().getMonth() + 1);

// 월 이동 함수
const goPrevMonth = () => {
  if (currentMonth.value === 1) {
    currentYear.value--;
    currentMonth.value = 12;
  } else {
    currentMonth.value--;
  }
};
const goNextMonth = () => {
  if (currentMonth.value === 12) {
    currentYear.value++;
    currentMonth.value = 1;
  } else {
    currentMonth.value++;
  }
};

// YYYY-MM
const monthStr = computed(
  () => `${currentYear.value}-${String(currentMonth.value).padStart(2, '0')}`
);

// 서버 월간 리포트 데이터 상태
const serverReport = ref(null);
const loading = ref(false);
const error = ref(null);

const fetchReport = async () => {
  try {
    loading.value = true;
    error.value = null;
    const { data } = await getMonthReport(monthStr.value);
    if (data.status === 200) {
      serverReport.value = data.data || null;
    } else {
      error.value = data.message || '리포트 조회 실패';
    }
  } catch (e) {
    error.value = e?.response?.data?.message || e.message;
  } finally {
    loading.value = false;
  }
};

// 총 소비: 서버 리포트 기반
const totalConsumption = computed(() =>
  Number(serverReport.value?.totalConsumption ?? 0)
);

// 이전달 총 소비 (서버 제공 값 활용 예상; 없으면 0)
const prevMonthConsumption = computed(() =>
  Number(serverReport.value?.prevMonthConsumption ?? 0)
);

// 지난달 대비 증감 - computed로 변경하여 동적 계산
const lastMonthDiff = computed(() => {
  return totalConsumption.value - prevMonthConsumption.value;
});

// 지난달보다 덜 쓴 금액 (양수일 때만)
const lastMonthLess = computed(() => {
  return lastMonthDiff.value < 0 ? Math.abs(lastMonthDiff.value) : 0;
});

// 카테고리 집계(서버 값을 그대로 사용하도록 설계)
const categorySums = computed(
  () =>
    serverReport.value?.categorySums ?? {
      식비: 0,
      '카페/간식': 0,
      온라인쇼핑: 0,
      '그 외': 0,
    }
);
const totalOut = computed(() =>
  Object.values(categorySums.value).reduce((a, b) => a + b, 0)
);
const categoryPercents = computed(() => {
  const total = totalOut.value || 0;
  return Object.fromEntries(
    Object.entries(categorySums.value).map(([k, v]) => [
      k,
      total ? (v / total) * 100 : 0,
    ])
  );
});

// TOP3 카테고리
const top3 = computed(() => {
  return Object.entries(categorySums.value)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([label, amount]) => ({
      label,
      amount,
      percent: categoryPercents.value[label],
    }));
});

// 월별 소비 막대그래프: 서버에서 last7Months 같은 배열을 준다고 가정
// [{ ym: '2025-03', sum: 123000 }, ... 7개]
const monthBarHeights = computed(() => {
  const bars = Array.isArray(serverReport.value?.last7Months)
    ? serverReport.value.last7Months
    : [];
  if (bars.length === 0) return [];
  const max = Math.max(...bars.map((b) => b.sum), 1);
  return bars.map((b, idx) => ({
    height: Math.round((Number(b.sum || 0) / max) * 100),
    colorClass:
      Number(b.sum || 0) > 1000000
        ? 'bar-red'
        : Number(b.sum || 0) < 500000
        ? 'bar-green'
        : 'bar-purple',
    isCurrent: idx === Math.floor(bars.length / 2),
  }));
});

// 월 라벨 생성 함수
const getMonthLabel = (idx) => {
  const now = new Date(currentYear.value, currentMonth.value - 1, 1);
  const d = new Date(now.getFullYear(), now.getMonth() + (idx - 3), 1);
  return `${d.getMonth() + 1}월`;
};

// spending_logo 매핑 함수
const getSpendingLogo = (label) => {
  const logoMap = {
    식비: '식비.png',
    '카페/간식': '카페, 간식.png',
    온라인쇼핑: '쇼핑, 미용.png',
    '그 외': '기타.png',
  };

  const logoFileName = logoMap[label] || '기타.png';

  try {
    return new URL(`/src/assets/spending_logo/${logoFileName}`, import.meta.url)
      .href;
  } catch (error) {
    // 로고 파일을 찾을 수 없는 경우 기본 로고 반환
    return new URL('/src/assets/spending_logo/기타.png', import.meta.url).href;
  }
};

// PDF 캡처 및 다운로드 함수
const captureAndDownloadPDF = async () => {
  if (!reportContainer.value) return;

  try {
    // 로딩 상태 표시 (선택사항)
    console.log('PDF 생성 중...');

    const canvas = await html2canvas(reportContainer.value, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      width: reportContainer.value.scrollWidth,
      height: reportContainer.value.scrollHeight,
    });

    const imgData = canvas.toDataURL('image/png', 1.0);

    // 이미지 크기에 맞춰 PDF 크기 계산
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    // PDF 크기를 이미지 비율에 맞춰 설정 (가로 기준)
    const pdfWidth = 210; // A4 가로 크기 (mm)
    const pdfHeight = (imgHeight * pdfWidth) / imgWidth;

    // PDF 생성 (크기를 이미지에 맞춤)
    const pdf = new jsPDF('p', 'mm', [pdfWidth, pdfHeight]);

    // 이미지를 PDF에 맞춰 추가 (한 페이지에 전체 내용)
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

    // 파일명 생성
    const fileName = `${currentYear.value}-${String(
      currentMonth.value
    ).padStart(2, '0')}-월보고서.pdf`;
    pdf.save(fileName);

    console.log('PDF 다운로드 완료:', fileName);
  } catch (error) {
    console.error('PDF 생성 중 오류 발생:', error);
    alert('PDF 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
  }
};
</script>

<style scoped>
.monthly-report-container {
  padding: 16px;
  background: #f7f8fa;
  height: calc(
    100dvh - 160px
  ); /* 헤더(80px) + 네비게이션(80px) 높이만큼 빼기 */
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: max(16px, env(safe-area-inset-bottom));
  min-height: 0;
}

/* 월 선택 네비게이션 */
.report-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 16px 0 8px 0;
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
  margin: 0 0 16px 0;
  padding: 18px 18px 16px 18px;
  box-shadow: 0 2px 8px rgba(67, 24, 209, 0.07);
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #222;
  margin-bottom: 8px;
}

/* 총 소비 */
.consumption-section {
  margin-top: 0;
  margin-bottom: 14px;
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

.accent {
  color: #4318d1;
  font-weight: 700;
}

/* 지난달보다 덜 썼어요 */
.compare-title {
  font-size: 18px;
  font-weight: 600;
  color: #222;
  margin-bottom: 12px;
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

/* 월 라벨 스타일 */
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
  transition: all 0.3s ease;
}

.month-label-current {
  background: #4318d1;
  color: white;
  font-weight: 700;
}

/* 카테고리 바 */
.category-title {
  font-size: 16px;
  font-weight: 600;
  color: #222;
  margin-bottom: 10px;
}

.category-bar {
  display: flex;
  height: 16px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 8px;
  background: #f3f4f6;
}

.category-bar-item {
  height: 100%;
}

.category-bar-item.food {
  background: #4318d1;
}

.category-bar-item.online {
  background: #6366f1;
}

.category-bar-item.cafe {
  background: #e6c1b6;
}

.category-bar-item.etc {
  background: #e5e7eb;
}

.category-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 18px;
  font-size: 13px;
  margin-top: 4px;
  color: #666;
}

.dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 4px;
}

.dot.food {
  background: #4318d1;
}

.dot.online {
  background: #6366f1;
}

.dot.cafe {
  background: #e6c1b6;
}

.dot.etc {
  background: #e5e7eb;
}

/* TOP3 */
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

/* 소비 성향 */
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

/* 챌린지 */
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

.challenge-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
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

.challenge-edit {
  margin-left: auto;
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
