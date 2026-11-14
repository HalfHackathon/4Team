import MissionCard from '../components/MissionCard'
import RiskCard from '../components/RiskCard'
import StreakBadge from '../components/StreakBadge'
import { BADGE_MILESTONES, getOccupation } from '../data/mock'
import { useAppStore } from '../store/useAppStore'
import { calcStreak, toDateKey } from '../utils/date'

export default function HomePage() {
  const profile = useAppStore((s) => s.profile)
  const done = useAppStore((s) => s.done)
  const complete = useAppStore((s) => s.complete)

  const occupation = getOccupation(profile?.occupationId)
  if (!occupation) return <p>직종 정보를 찾을 수 없습니다.</p>

  const todayDone = done[toDateKey()] ?? []
  const streak = calcStreak(done)
  const badges = BADGE_MILESTONES.filter((m) => streak >= m)

  return (
    <div>
      <h1>오늘의 미션</h1>
      <StreakBadge streak={streak} todayDone={todayDone.length >= 1} badges={badges} />
      <RiskCard label={occupation.label} risks={occupation.risks} />
      <ul>
        {occupation.missions.map((m) => (
          <MissionCard
            key={m.id}
            title={m.title}
            sec={m.sec}
            done={todayDone.includes(m.id)}
            onComplete={() => complete(m.id)}
          />
        ))}
      </ul>
    </div>
  )
}
