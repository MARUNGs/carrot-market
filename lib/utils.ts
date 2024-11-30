/**
 * 원화 포맷으로 변경
 * @param price
 * @returns
 */
export function formatToWon(price: number): string {
  return price.toLocaleString("ko-KR");
}

/**
 * N일 전 날짜 표시
 * @param date
 * @returns
 */
export function formatToTimeAgo(date: string): string {
  const dayInMs = 1000 * 60 * 60 * 24; // 하루는 몇초일까?
  const time = new Date(date).getTime();
  const now = new Date().getTime();
  const diff = Math.round((time - now) / dayInMs);
  const formatter = new Intl.RelativeTimeFormat("ko");

  return formatter.format(diff, "days"); // -3 을 3일 전으로 변경해준다.
}
