const DAY = 86400000

// 'YYYY-MM-DD' (KST)
export const toDateKey = (d = new Date()) =>
  new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Seoul' }).format(d)

export const addDays = (key, days) =>
  toDateKey(new Date(new Date(`${key}T00:00:00+09:00`).getTime() + days * DAY))

// 하루 1개 이상 완료하면 인정. 오늘 미완료면 어제까지의 연속을 보여줌
export function calcStreak(done, today = toDateKey()) {
  const has = (k) => (done[k]?.length ?? 0) >= 1
  let cursor = has(today) ? today : addDays(today, -1)
  let n = 0
  while (has(cursor)) {
    n++
    cursor = addDays(cursor, -1)
  }
  return n
}

// [시연용] 어제부터 days일 연속 완료 기록 생성
export function seedDemoDone(days, today = toDateKey()) {
  const done = {}
  for (let i = 1; i <= days; i++) done[addDays(today, -i)] = ['demo-seed']
  return done
}
