/** ISO 8601 문자열을 화면용 날짜로 바꾼다. */
export function formatDate(iso: string): string {
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? iso : date.toLocaleDateString('ko-KR')
}
