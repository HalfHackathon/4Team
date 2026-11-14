import { useEffect, useState, type ReactNode } from 'react'

interface PhoneFrameProps {
  /** 화면 안에 겹쳐 띄울 요소 (모드 배지 등). 스크롤과 무관하게 제자리에 있다. */
  overlay?: ReactNode
  children: ReactNode
}

/** 틀 바깥 크기: 화면 402×874 + 테두리 10px×2 */
const FRAME_HEIGHT = 894
/** 바깥 여백 sm:p-8 (위아래 합 64px) */
const PAGE_PADDING = 64
const DESKTOP_QUERY = '(min-width: 640px)'

/** 데스크톱에서 창 높이에 맞춘 축소 비율. 휴대폰 화면이면 1 */
const calcScale = () =>
  window.matchMedia(DESKTOP_QUERY).matches
    ? Math.min(1, (window.innerHeight - PAGE_PADDING) / FRAME_HEIGHT)
    : 1

function useFrameScale() {
  const [scale, setScale] = useState(calcScale)

  useEffect(() => {
    const update = () => setScale(calcScale())
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return scale
}

/**
 * 앱 화면 틀.
 * - 휴대폰(640px 미만): 전체 화면
 * - 노트북·데스크톱: 가운데에 휴대폰 테두리(화면 402×874, iPhone 16 Pro 기준)를 그린다. 시연용.
 *   창 높이가 부족하면 레이아웃은 402×874 그대로 두고 틀 전체를 같은 비율로 축소(zoom)한다.
 * translateZ(0)으로 `position: fixed` 요소도 브라우저 창이 아니라 이 틀 기준으로 붙는다.
 */
export default function PhoneFrame({ overlay, children }: PhoneFrameProps) {
  const scale = useFrameScale()

  return (
    <div className="min-h-svh sm:flex sm:items-center sm:justify-center sm:bg-gray-200 sm:p-8">
      <div
        style={{ zoom: scale }}
        className="relative flex h-svh w-full transform-[translateZ(0)] flex-col overflow-hidden bg-surface text-gray-900 sm:h-[894px] sm:w-[422px] sm:rounded-[44px] sm:border-[10px] sm:border-black sm:shadow-2xl"
      >
        {overlay}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}
