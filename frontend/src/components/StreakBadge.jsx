export default function StreakBadge({ streak, todayDone, badges }) {
  return (
    <section style={{ marginBottom: 16 }}>
      <h2>연속 {streak}일</h2>
      {todayDone && <p>오늘 달성!</p>}
      {badges.length > 0 && (
        <ul>
          {badges.map((b) => (
            <li key={b}>🏅 {b}일 달성</li>
          ))}
        </ul>
      )}
    </section>
  )
}
