import { useRef, useState } from 'react'
import type { Mission } from '../../types/mission'
import MissionCard from './MissionCard'

interface MissionCarouselProps {
  missions: Mission[]
}

/** 미션 카드 가로 스와이프 + 페이지 점 표시 */
export default function MissionCarousel({ missions }: MissionCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const handleScroll = () => {
    const track = trackRef.current
    if (!track || track.clientWidth === 0) return
    setActiveIndex(Math.round(track.scrollLeft / track.clientWidth))
  }

  const scrollTo = (index: number) => {
    const track = trackRef.current
    track?.scrollTo({ left: index * track.clientWidth, behavior: 'smooth' })
  }

  return (
    <div>
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="scrollbar-none flex snap-x snap-mandatory overflow-x-auto"
      >
        {missions.map((mission) => (
          <div key={mission.id} className="w-full shrink-0 snap-center">
            <MissionCard mission={mission} />
          </div>
        ))}
      </div>

      {missions.length > 1 && (
        <div className="mt-4 flex justify-center gap-1.5" role="tablist" aria-label="미션 페이지">
          {missions.map((mission, index) => (
            <button
              key={mission.id}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={`${index + 1}번째 미션`}
              onClick={() => scrollTo(index)}
              className={`h-2 rounded-full transition-all ${
                index === activeIndex ? 'w-12 bg-mission-dot' : 'w-2 bg-gray-200'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
