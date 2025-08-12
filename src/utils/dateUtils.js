/**
 * 날짜 포맷팅 유틸 함수들
 */

/**
 * 월 포맷팅: 'YYYY년 M월'
 * @param {Date|string} date - 날짜 객체 또는 'YYYY-MM' 문자열
 * @returns {string} 포맷된 월 문자열
 */
export const formatMonth = (date) => {
  let year, month;

  if (typeof date === 'string') {
    const parts = date.split('-');
    if (parts.length === 2) {
      [year, month] = parts;
    } else {
      // 잘못된 형식이면 현재 날짜 사용
      const now = new Date();
      year = now.getFullYear();
      month = now.getMonth() + 1;
    }
  } else if (date instanceof Date) {
    year = date.getFullYear();
    month = date.getMonth() + 1;
  } else {
    // 잘못된 타입이면 현재 날짜 사용
    const now = new Date();
    year = now.getFullYear();
    month = now.getMonth() + 1;
  }

  return `${year}년 ${parseInt(month)}월`;
};

/**
 * 날짜 포맷팅: 'M월 D일 요일'
 * @param {Date} date - 날짜 객체
 * @returns {string} 포맷된 날짜 문자열
 */
export const formatDay = (date) => {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
  const weekDay = weekDays[date.getDay()];
  return `${month}월 ${day}일 ${weekDay}요일`;
};

/**
 * 날짜를 'YYYY-MM-DD' 형식으로 변환
 * @param {Date} date - 날짜 객체
 * @returns {string} 'YYYY-MM-DD' 형식 문자열
 */
export const formatDateKey = (date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

/**
 * 거래 내역을 날짜별로 그룹핑
 * @param {Array} transactions - 거래 내역 배열
 * @returns {Object} 날짜별로 그룹핑된 거래 내역
 */
export const groupByDate = (transactions) => {
  const groups = {};

  transactions.forEach((transaction) => {
    const dateKey = formatDateKey(new Date(transaction.date));

    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }

    groups[dateKey].push(transaction);
  });

  return groups;
};

/**
 * 일별 지출 합계 계산 (EXPENSE 타입만)
 * @param {Array} transactions - 거래 내역 배열
 * @returns {Map} 날짜별 지출 합계 Map
 */
export const calculateDailyExpenses = (transactions) => {
  const expenses = new Map();

  transactions.forEach((transaction) => {
    if (transaction.type === 'EXPENSE') {
      const dateKey = formatDateKey(new Date(transaction.date));
      const current = expenses.get(dateKey) || 0;
      expenses.set(dateKey, current + transaction.amount);
    }
  });

  return expenses;
};

/**
 * 월의 첫날과 마지막날 계산
 * @param {number} year - 년도
 * @param {number} month - 월 (1-12)
 * @returns {Object} { firstDay, lastDay }
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
 * @param {Date} date - 확인할 날짜
 * @returns {boolean} 오늘 날짜 여부
 */
export const isToday = (date) => {
  const today = new Date();
  return formatDateKey(date) === formatDateKey(today);
};

/**
 * 선택된 날짜인지 확인
 * @param {Date} date - 확인할 날짜
 * @param {Date} selectedDate - 선택된 날짜
 * @returns {boolean} 선택된 날짜 여부
 */
export const isSelectedDate = (date, selectedDate) => {
  return formatDateKey(date) === formatDateKey(selectedDate);
};
