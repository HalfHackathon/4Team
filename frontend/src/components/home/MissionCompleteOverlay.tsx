import { useEffect } from 'react'

interface MissionCompleteOverlayProps {
  /** 오버레이를 닫을 때 호출 (화면 탭 또는 자동 닫힘) */
  onClose: () => void
}

/** 이 시간(ms)이 지나면 자동으로 닫는다. */
const AUTO_CLOSE_MS = 2000

/**
 * 미션 완료 축하 오버레이 (Figma 9:834)
 * - 화면 전체를 50% 검정으로 덮고, 별 3개 이미지와 "미션 완료!!"를 띄운다.
 * - PhoneFrame 안에서는 `fixed`가 휴대폰 화면 기준이라 탭 바까지 덮는다.
 */
export default function MissionCompleteOverlay({ onClose }: MissionCompleteOverlayProps) {
  useEffect(() => {
    const timer = window.setTimeout(onClose, AUTO_CLOSE_MS)
    return () => window.clearTimeout(timer)
  }, [onClose])

  return (
    <div
      role="status"
      aria-live="polite"
      onClick={onClose}
      className="fixed inset-0 z-[60] cursor-pointer bg-black/50"
    >
      {/* 시안 기준: 별 이미지 위에서 329px, 문구는 바로 아래(444px) */}
      <img
        src="/images/missions/complete-stars.png"
        alt=""
        className="pointer-events-none absolute top-[329px] left-1/2 h-[104px] w-[310px] -translate-x-1/2"
      />
      <p className="absolute top-[444px] left-1/2 -translate-x-1/2 font-display text-[35px] font-semibold whitespace-nowrap text-white">
        미션 완료!!
      </p>
    </div>
  )
}
