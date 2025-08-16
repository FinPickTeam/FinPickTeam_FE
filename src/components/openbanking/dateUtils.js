/**
 * 날짜 포맷팅 유틸 함수들 (KST 로컬 파싱 안정화 버전)
 * - 문자열 'YYYY-MM' / 'YYYY-MM-DD'는 로컬 자정으로 안전 파싱
 * - Date 객체는 일자 단위 비교를 위해 시분초 제거(로컬 자정)로 정규화
 */

/** 내부: YYYY-MM-DD 형식 여부 */
const isYMD = (s) => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s);
/** 내부: YYYY-MM 형식 여부 */
const isYM = (s) => typeof s === 'string' && /^\d{4}-\d{2}$/.test(s);

/**
 * 내부: 입력을 로컬 타임존 기준 Date(자정)로 안전 파싱
 * @param {Date|string} input
 * @returns {Date}
 */
export const parseLocalDate = (input) => {
  if (input instanceof Date) {
    // 일자 비교 안정화를 위해 시분초 제거(로컬 자정)
    return new Date(input.getFullYear(), input.getMonth(), input.getDate());
  }
  if (typeof input === 'string') {
    if (isYMD(input)) {
      const [y, m, d] = input.split('-').map(Number);
      return new Date(y, m - 1, d);
    }
    if (isYM(input)) {
      const [y, m] = input.split('-').map(Number);
      return new Date(y, m - 1, 1);
    }
    // 그 외 문자열(ISO 등)은 브라우저 파서에 맡기되, 실패 시 now
    const dt = new Date(input);
    if (!Number.isNaN(dt.getTime())) {
      return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
    }
  }
  // 타입 이상/파싱 실패 → 오늘
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

/**
 * 월 포맷팅: 'YYYY년 M월'
 * @param {Date|string} date - Date 또는 'YYYY-MM'
 * @returns {string}
 */
export const formatMonth = (date) => {
  const dt = parseLocalDate(date);
  const year = dt.getFullYear();
  const month = dt.getMonth() + 1;
  return `${year}년 ${month}월`;
};

/**
 * 날짜 포맷팅: 'M월 D일 요일'
 * @param {Date|string} date - Date 또는 'YYYY-MM-DD'
 * @returns {string}
 */
export const formatDay = (date) => {
  const dt = parseLocalDate(date);
  const month = dt.getMonth() + 1;
  const day = dt.getDate();
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
  const weekDay = weekDays[dt.getDay()];
  return `${month}월 ${day}일 ${weekDay}요일`;
};

/**
 * 날짜를 'YYYY-MM-DD' 형식으로 변환
 * @param {Date|string} date - Date 또는 'YYYY-MM-DD'
 * @returns {string}
 */
export const formatDateKey = (date) => {
  const dt = parseLocalDate(date);
  const yyyy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, '0');
  const dd = String(dt.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

/**
 * 거래 내역을 날짜별로 그룹핑
 * @param {Array} transactions - [{ date: Date|string, ... }]
 * @returns {Object<string, Array>} 날짜별 그룹
 */
export const groupByDate = (transactions) => {
  const groups = {};
  transactions.forEach((tx) => {
    const dateKey = formatDateKey(tx.date);
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(tx);
  });
  return groups;
};

/**
 * 일별 지출 합계 계산 (EXPENSE 타입만)
 * @param {Array} transactions - [{ type:'EXPENSE'|'INCOME', amount:number|string, date:... }]
 * @returns {Map<string, number>} YYYY-MM-DD → 지출 합
 */
export const calculateDailyExpenses = (transactions) => {
  const expenses = new Map();
  transactions.forEach((tx) => {
    if (tx?.type === 'EXPENSE') {
      const dateKey = formatDateKey(tx.date);
      const amt = Math.abs(Number(tx.amount) || 0);
      const cur = expenses.get(dateKey) || 0;
      expenses.set(dateKey, cur + amt);
    }
  });
  return expenses;
};

/**
 * 월의 첫날과 마지막날 계산
 * @param {number} year
 * @param {number} month - 1~12
 * @returns {{ firstDay: Date, lastDay: Date, firstDayStr: string, lastDayStr: string }}
 */
export const getMonthRange = (year, month) => {
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  return {
    firstDay,
    lastDay,
    firstDayStr: formatDateKey(firstDay),
    lastDayStr: formatDateKey(lastDay),
  };
};

/**
 * 오늘 날짜인지 확인
 * @param {Date|string} date
 * @returns {boolean}
 */
export const isToday = (date) => {
  const today = new Date();
  return formatDateKey(date) === formatDateKey(today);
};

/**
 * 선택된 날짜인지 확인
 * @param {Date|string} date
 * @param {Date|string} selectedDate
 * @returns {boolean}
 */
export const isSelectedDate = (date, selectedDate) => {
  if (!date || !selectedDate) return false;
  return formatDateKey(date) === formatDateKey(selectedDate);
};
