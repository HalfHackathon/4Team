import type { Mission } from '../../types/mission'

interface MissionCardProps {
  mission: Mission
  /** 인증 버튼을 누르면 호출. 누르는 즉시 완료 처리한다. */
  onComplete: (mission: Mission) => void
  /** 완료 요청 중이면 버튼을 잠근다. */
  pending?: boolean
}

/** 오늘의 미션 카드 한 장: 제목, 일러스트, 인증 버튼 */
export default function MissionCard({ mission, onComplete, pending = false }: MissionCardProps) {
  const completed = mission.status === 'COMPLETED'

  return (
    <article className="relative flex h-[310px] w-full flex-col items-center rounded-[10px] bg-mission-card pt-8">
      <h3 className="text-center text-xl font-bold text-title">{mission.title}</h3>
      {mission.imageUrl && (
        <img
          src={mission.imageUrl}
          alt=""
          className="pointer-events-none -mt-1.5 h-[197px] w-[262px] object-contain"
        />
      )}
      {completed ? (
        <span className="absolute inset-x-[23px] bottom-6 flex h-11 items-center justify-center rounded-lg bg-gray-400 text-sm font-semibold text-white">
          인증 완료
        </span>
      ) : (
        <button
          type="button"
          onClick={() => onComplete(mission)}
          disabled={pending}
          className="absolute inset-x-[23px] bottom-6 flex h-11 items-center justify-center rounded-lg bg-gray-800 text-sm font-semibold text-white active:opacity-90 disabled:opacity-60"
        >
          {pending ? '처리 중…' : '미션 인증하러 가기'}
        </button>
      )}
    </article>
  )
}
