import { useEffect, useState } from 'react'
import { toErrorMessage } from '../api/client'
import { getTodayMissions } from '../api/missions'
import Banner from '../components/Banner'
import MissionCarousel from '../components/home/MissionCarousel'
import RiskCardPlaceholder from '../components/home/RiskCardPlaceholder'
import type { Mission } from '../types/mission'

/** 홈: 오늘의 미션(가로 스와이프) + 직종 리스크 카드 */
export default function Home() {
  const [missions, setMissions] = useState<Mission[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let ignore = false
    getTodayMissions()
      .then((data) => {
        if (!ignore) setMissions(data)
      })
      .catch((e: unknown) => {
        if (!ignore) setError(toErrorMessage(e))
      })
    return () => {
      ignore = true
    }
  }, [])

  return (
    <div className="px-[22px] pt-[22px] pb-10">
      <h1 className="font-display text-2xl font-semibold text-brand">직장체질</h1>

      <section className="mt-8 space-y-3.5">
        <h2 className="font-display text-[15px] font-semibold text-label">오늘의 미션</h2>
        {error && <Banner message={error} />}
        {!error && missions === null && (
          <div className="h-[310px] w-full animate-pulse rounded-[10px] bg-mission-card" />
        )}
        {missions?.length === 0 && (
          <p className="rounded-[10px] bg-mission-card px-6 py-10 text-center text-sm text-label">
            오늘 받은 미션이 없어요.
          </p>
        )}
        {missions && missions.length > 0 && <MissionCarousel missions={missions} />}
      </section>

      <section className="mt-[45px] space-y-3.5">
        <h2 className="font-display text-[15px] font-semibold text-black">직종 리스크 카드</h2>
        <RiskCardPlaceholder />
      </section>
    </div>
  )
}
