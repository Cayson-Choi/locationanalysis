/**
 * Format number in Korean style (만/억)
 */
export function formatKoreanNumber(num: number): string {
  if (num >= 100000000) {
    const eok = Math.floor(num / 100000000);
    const remainder = num % 100000000;
    if (remainder >= 10000) {
      return `${eok}억 ${Math.floor(remainder / 10000)}만`;
    }
    return `${eok}억`;
  }
  if (num >= 10000) {
    const man = Math.floor(num / 10000);
    const remainder = num % 10000;
    if (remainder > 0) {
      return `${man}만 ${remainder.toLocaleString()}`;
    }
    return `${man}만`;
  }
  return num.toLocaleString();
}

/**
 * Format currency in Korean Won
 */
export function formatWon(amount: number): string {
  return `${formatKoreanNumber(amount)}원`;
}

/**
 * Format distance (meters to readable)
 */
export function formatDistance(meters: number): string {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)}km`;
  }
  return `${Math.round(meters)}m`;
}

/**
 * Format relative date in Korean
 */
export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return '방금 전';
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHour < 24) return `${diffHour}시간 전`;
  if (diffDay < 7) return `${diffDay}일 전`;
  if (diffDay < 30) return `${Math.floor(diffDay / 7)}주 전`;
  if (diffDay < 365) return `${Math.floor(diffDay / 30)}개월 전`;
  return `${Math.floor(diffDay / 365)}년 전`;
}

/**
 * Format percentage
 */
export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format area (square meters)
 */
export function formatArea(sqm: number): string {
  const pyeong = sqm * 0.3025;
  return `${sqm.toFixed(1)}㎡ (${pyeong.toFixed(1)}평)`;
}
