import { useCallback, useEffect, useState } from 'react'
import { toErrorMessage } from '../api/client'
import { completeMission, getTodayMissions, missionDoneKey } from '../api/missions'
import Banner from '../components/Banner'
import MissionCarousel from '../components/home/MissionCarousel'
import MissionCompleteOverlay from '../components/home/MissionCompleteOverlay'
import RiskCardPlaceholder from '../components/home/RiskCardPlaceholder'
import { getOccupation, MOCK_USER_NAME } from '../data/mock'
import { useAppStore } from '../store/useAppStore'
import type { Mission } from '../types/mission'

/** 홈: 오늘의 미션(가로 스와이프) + 직종 리스크 카드 */
export default function Home() {
  const [fetched, setFetched] = useState<Mission[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [completeError, setCompleteError] = useState<string | null>(null)
  const [pendingId, setPendingId] = useState<number | null>(null)
  const [showCompleted, setShowCompleted] = useState(false)
  const closeCompleted = useCallback(() => setShowCompleted(false), [])
  const occupationId = useAppStore((s) => s.profile?.occupationId)
  const complete = useAppStore((s) => s.complete)
  const occupation = getOccupation(occupationId)

  // 인증 버튼을 누르면 바로 완료 처리하고, 스트릭 기록(localStorage)에도 남긴다.
  // 카드 완료 상태는 화면에만 반영하므로 새로고침하면 다시 누를 수 있다 (시연용).
  const handleComplete = async (mission: Mission) => {
    setPendingId(mission.id)
    setCompleteError(null)
    try {
      const updated = await completeMission(mission.id)
      setFetched((prev) => prev?.map((m) => (m.id === updated.id ? updated : m)) ?? prev)
      complete(missionDoneKey(mission.id))
      setShowCompleted(true)
    } catch (e: unknown) {
      setCompleteError(toErrorMessage(e))
    } finally {
      setPendingId(null)
    }
  }

  const missions = fetched

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

      <section className="mt-[22px] space-y-3.5">
        <h2 className="font-display text-[15px] font-semibold text-label">직종 리스크 카드</h2>
        <RiskCardPlaceholder greeting={`${MOCK_USER_NAME}님!`} message={occupation?.riskMessage} />
      </section>

      {showCompleted && <MissionCompleteOverlay onClose={closeCompleted} />}
    </div>
  )
}
