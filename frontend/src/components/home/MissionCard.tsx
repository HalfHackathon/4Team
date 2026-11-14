import type { Mission } from '../../types/mission'

interface MissionCardProps {
  mission: Mission
}

/** 오늘의 미션 카드 한 장. 카드 안 세부 구성은 디자인 확정 후 채운다. */
export default function MissionCard({ mission }: MissionCardProps) {
  return (
    <article className="flex aspect-[358/310] w-full flex-col items-center rounded-2xl bg-mission-card px-6 pt-8">
      <h3 className="text-center text-xl font-semibold text-gray-700">{mission.title}</h3>
    </article>
  )
}
