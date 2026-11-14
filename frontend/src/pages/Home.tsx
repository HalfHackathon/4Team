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
    <div className="space-y-10 px-6 pt-6 pb-10">
      <h1 className="text-2xl font-bold text-brand">직장체질</h1>

      <section className="space-y-4">
        <h2 className="text-base font-semibold text-gray-900">오늘의 미션</h2>
        {error && <Banner message={error} />}
        {!error && missions === null && (
          <div className="aspect-[358/310] w-full animate-pulse rounded-2xl bg-mission-card" />
        )}
        {missions?.length === 0 && (
          <p className="rounded-2xl bg-mission-card px-6 py-10 text-center text-sm text-gray-500">
            오늘 받은 미션이 없어요.
          </p>
        )}
        {missions && missions.length > 0 && <MissionCarousel missions={missions} />}
      </section>

      <section className="space-y-4">
        <h2 className="text-base font-semibold text-gray-900">직종 리스크 카드</h2>
        <RiskCardPlaceholder />
      </section>
    </div>
  )
}
