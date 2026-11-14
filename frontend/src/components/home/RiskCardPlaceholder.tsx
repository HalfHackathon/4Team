interface RiskCardPlaceholderProps {
  /** 직종 이름. 없으면 빈 카드 */
  label?: string
  risks?: string[]
}

/** 직종 리스크 카드 자리. 디자인 확정 전까지 직종 리스크 목록만 표시한다. */
export default function RiskCardPlaceholder({ label, risks = [] }: RiskCardPlaceholderProps) {
  return (
    <div className="min-h-[170px] w-full rounded-[10px] border border-risk-border bg-white p-5">
      {label && (
        <>
          <p className="text-sm font-semibold text-title">{label}</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-label">
            {risks.map((risk) => (
              <li key={risk}>{risk}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
