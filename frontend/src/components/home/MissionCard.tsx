import { Link } from 'react-router-dom'
import type { Mission } from '../../types/mission'

interface MissionCardProps {
  mission: Mission
}

/** 오늘의 미션 카드 한 장: 제목, 일러스트, 인증 버튼 */
export default function MissionCard({ mission }: MissionCardProps) {
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
        <Link
          to={`/missions/${mission.id}`}
          className="absolute inset-x-[23px] bottom-6 flex h-11 items-center justify-center rounded-lg bg-gray-800 text-sm font-semibold text-white active:opacity-90"
        >
          미션 인증하러 가기
        </Link>
      )}
    </article>
  )
}
