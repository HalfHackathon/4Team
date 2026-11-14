import type { ReactNode } from 'react'

interface PhoneFrameProps {
  /** 화면 안에 겹쳐 띄울 요소 (모드 배지 등). 스크롤과 무관하게 제자리에 있다. */
  overlay?: ReactNode
  children: ReactNode
}

/**
 * 앱 화면 틀.
 * - 휴대폰(640px 미만): 전체 화면
 * - 노트북·데스크톱: 가운데에 휴대폰 테두리(화면 402×874, iPhone 16 Pro 기준)를 그린다. 시연용.
 * translateZ(0)으로 `position: fixed` 요소도 브라우저 창이 아니라 이 틀 기준으로 붙는다.
 */
export default function PhoneFrame({ overlay, children }: PhoneFrameProps) {
  return (
    <div className="min-h-svh sm:flex sm:items-center sm:justify-center sm:bg-gray-200 sm:p-8">
      <div className="relative flex h-svh w-full transform-[translateZ(0)] flex-col overflow-hidden bg-surface text-gray-900 sm:h-[894px] sm:max-h-[calc(100svh-4rem)] sm:w-[422px] sm:rounded-[44px] sm:border-[10px] sm:border-black sm:shadow-2xl">
        {overlay}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}
