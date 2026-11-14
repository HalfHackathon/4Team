import { useRef, useState, type MouseEvent, type PointerEvent } from 'react'
import type { Mission } from '../../types/mission'
import MissionCard from './MissionCard'

interface MissionCarouselProps {
  missions: Mission[]
  onComplete: (mission: Mission) => void
  /** 완료 요청 중인 미션 id */
  pendingId?: number | null
}

/** 이 거리(px) 이상 끌면 다음/이전 카드로 넘긴다. */
const SWIPE_THRESHOLD = 50
/** 이 거리(px) 이상 움직이면 클릭이 아니라 드래그로 본다. */
const DRAG_START = 5

/**
 * 미션 카드 가로 스와이프 + 페이지 점 표시
 * - 터치·트랙패드: 브라우저 기본 가로 스크롤 + scroll-snap
 * - 마우스: 끌어서 넘기기를 직접 처리 (데스크톱 시연용)
 */
export default function MissionCarousel({
  missions,
  onComplete,
  pendingId = null,
}: MissionCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ startX: number; startIndex: number; moved: boolean } | null>(null)
  const suppressClickRef = useRef(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [dragging, setDragging] = useState(false)

  const handleScroll = () => {
    const track = trackRef.current
    if (!track || track.clientWidth === 0) return
    setActiveIndex(Math.round(track.scrollLeft / track.clientWidth))
  }

  const scrollTo = (index: number) => {
    const track = trackRef.current
    if (!track) return
    const clamped = Math.max(0, Math.min(missions.length - 1, index))
    track.scrollTo({ left: clamped * track.clientWidth, behavior: 'smooth' })
  }

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current
    if (e.pointerType !== 'mouse' || e.button !== 0 || !track) return
    dragRef.current = {
      startX: e.clientX,
      startIndex: Math.round(track.scrollLeft / track.clientWidth),
      moved: false,
    }
  }

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    const track = trackRef.current
    if (!drag || !track) return
    const dx = e.clientX - drag.startX
    if (!drag.moved) {
      if (Math.abs(dx) < DRAG_START) return
      drag.moved = true
      setDragging(true)
      track.setPointerCapture(e.pointerId)
    }
    track.scrollLeft = drag.startIndex * track.clientWidth - dx
  }

  const endDrag = (e: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    dragRef.current = null
    if (!drag?.moved) return
    setDragging(false)
    suppressClickRef.current = true
    const dx = e.clientX - drag.startX
    const step = dx <= -SWIPE_THRESHOLD ? 1 : dx >= SWIPE_THRESHOLD ? -1 : 0
    scrollTo(drag.startIndex + step)
  }

  // 드래그 직후의 클릭이 카드 안 버튼(링크)으로 전달되지 않게 막는다.
  const handleClickCapture = (e: MouseEvent<HTMLDivElement>) => {
    if (!suppressClickRef.current) return
    suppressClickRef.current = false
    e.preventDefault()
    e.stopPropagation()
  }

  return (
    <div>
      <div
        ref={trackRef}
        onScroll={handleScroll}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={handleClickCapture}
        onDragStart={(e) => e.preventDefault()}
        className={`scrollbar-none flex overflow-x-auto select-none ${
          dragging ? 'cursor-grabbing' : 'cursor-grab snap-x snap-mandatory'
        }`}
      >
        {missions.map((mission) => (
          <div key={mission.id} className="w-full shrink-0 snap-center">
            <MissionCard
              mission={mission}
              onComplete={onComplete}
              pending={pendingId === mission.id}
            />
          </div>
        ))}
      </div>

      {missions.length > 1 && (
        <div className="mt-3.5 flex justify-center gap-1" role="tablist" aria-label="미션 페이지">
          {missions.map((mission, index) => (
            <button
              key={mission.id}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={`${index + 1}번째 미션`}
              onClick={() => scrollTo(index)}
              className={`h-2 rounded-full transition-all ${
                index === activeIndex ? 'w-[37px] bg-dot-active' : 'w-2 bg-dot-inactive'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
