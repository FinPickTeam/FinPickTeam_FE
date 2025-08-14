export function usePeriodFilter(periodRef, startRef, endRef) {
  const getRange = () => {
    const period = periodRef.value;
    const now = new Date();
    let s, e;

    if (period === 'thisMonth') {
      s = new Date(now.getFullYear(), now.getMonth(), 1);
      e = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    } else if (period === 'lastMonth') {
      s = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      e = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
    } else if (period === 'custom' && startRef.value && endRef.value) {
      s = new Date(startRef.value);
      e = new Date(endRef.value);
      e.setHours(23, 59, 59, 999);
    } else {
      s = new Date(0);
      e = new Date(8640000000000000); // all
    }
    return { start: s, end: e };
  };

  const filterByRange = (items, getDate = (it) => new Date(it.date)) => {
    const { start, end } = getRange();
    return items.filter((it) => {
      const d = getDate(it);
      return d >= start && d <= end;
    });
  };

  const getPeriodLabel = () => {
    switch (periodRef.value) {
      case 'thisMonth':
        return '이번달';
      case 'lastMonth':
        return '지난달';
      case 'all':
        return '전체';
      case 'custom':
        return '직접 선택';
      default:
        return '전체';
    }
  };

  return { getRange, filterByRange, getPeriodLabel };
}
