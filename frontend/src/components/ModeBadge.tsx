import { useEffect, useState } from 'react'
import { getApiMode, type ApiMode } from '../api/client'

const LABELS: Record<ApiMode, { text: string; className: string }> = {
  real: { text: 'REAL', className: 'bg-emerald-100 text-emerald-800' },
  mock: { text: 'MOCK', className: 'bg-amber-100 text-amber-800' },
  'mock-fallback': { text: 'MOCK·백엔드 미연결', className: 'bg-gray-200 text-gray-700' },
}

/** 현재 API 모드 표시 (REAL / MOCK / MOCK·백엔드 미연결) */
export default function ModeBadge() {
  const [mode, setMode] = useState<ApiMode | null>(null)

  useEffect(() => {
    let ignore = false
    getApiMode().then((m) => {
      if (!ignore) setMode(m)
    })
    return () => {
      ignore = true
    }
  }, [])

  const label = mode
    ? LABELS[mode]
    : { text: '연결 확인 중…', className: 'bg-gray-100 text-gray-500' }

  return (
    <span
      data-testid="mode-badge"
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${label.className}`}
    >
      {label.text}
    </span>
  )
}
