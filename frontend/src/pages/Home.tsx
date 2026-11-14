import { useEffect, useState } from 'react'
import { toErrorMessage } from '../api/client'
import { completeMission, getTodayMissions, missionDoneKey } from '../api/missions'
import Banner from '../components/Banner'
import MissionCarousel from '../components/home/MissionCarousel'
import RiskCardPlaceholder from '../components/home/RiskCardPlaceholder'
import { getOccupation } from '../data/mock'
import { useAppStore } from '../store/useAppStore'
import type { Mission } from '../types/mission'
import { toDateKey } from '../utils/date'

const EMPTY: string[] = []

/** 홈: 오늘의 미션(가로 스와이프) + 직종 리스크 카드 */
export default function Home() {
  const [fetched, setFetched] = useState<Mission[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [completeError, setCompleteError] = useState<string | null>(null)
  const [pendingId, setPendingId] = useState<number | null>(null)
  const occupationId = useAppStore((s) => s.profile?.occupationId)
  const doneToday = useAppStore((s) => s.done[toDateKey()] ?? EMPTY)
  const complete = useAppStore((s) => s.complete)
  const occupation = getOccupation(occupationId)

  // 인증 버튼을 누르면 바로 완료 처리하고, 스트릭 기록(localStorage)에도 남긴다.
  const handleComplete = async (mission: Mission) => {
    setPendingId(mission.id)
    setCompleteError(null)
    try {
      await completeMission(mission.id)
      complete(missionDoneKey(mission.id))
    } catch (e: unknown) {
      setCompleteError(toErrorMessage(e))
    } finally {
      setPendingId(null)
    }
  }

  // 목 데이터는 새로고침하면 초기화되므로, 오늘 완료 기록(localStorage)으로 완료 상태를 덮어쓴다.
  const missions =
    fetched?.map((m) =>
      doneToday.includes(missionDoneKey(m.id)) ? { ...m, status: 'COMPLETED' as const } : m,
    ) ?? null

  useEffect(() => {
    let ignore = false
    getTodayMissions()
      .then((data) => {
        if (!ignore) setFetched(data)
      })
      .catch((e: unknown) => {
        if (!ignore) setError(toErrorMessage(e))
      })
    return () => {
      ignore = true
    }
  }, [])

  return (
    // -m-4: TabLayout main의 padding(16px) 상쇄. 레이아웃 정리 시 제거
    <div className="-mx-4 -mt-4 px-[22px] pt-[22px] pb-10">
      <h1 className="font-display text-2xl font-semibold text-brand">직장체질</h1>

      <section className="mt-8 space-y-3.5">
        <h2 className="font-display text-[15px] font-semibold text-label">오늘의 미션</h2>
        {error && <Banner message={error} />}
        {completeError && <Banner message={completeError} />}
        {!error && missions === null && (
          <div className="h-[310px] w-full animate-pulse rounded-[10px] bg-mission-card" />
        )}
        {missions?.length === 0 && (
          <p className="rounded-[10px] bg-mission-card px-6 py-10 text-center text-sm text-label">
            오늘 받은 미션이 없어요.
          </p>
        )}
        {missions && missions.length > 0 && (
          <MissionCarousel missions={missions} onComplete={handleComplete} pendingId={pendingId} />
        )}
      </section>

      <section className="mt-[45px] space-y-3.5">
        <h2 className="font-display text-[15px] font-semibold text-black">직종 리스크 카드</h2>
        <RiskCardPlaceholder label={occupation?.label} risks={occupation?.risks} />
      </section>
    </div>
  )
}
