interface RiskCardPlaceholderProps {
  /** 첫 줄 인사 (예: "용훈님!") */
  greeting?: string
  /** 둘째 줄 직종 리스크 문구. 없으면 빈 카드 */
  message?: string
}

/** 직종 리스크 카드 (Figma 9:904): 연파랑 카드 + 오른쪽 흐린 일러스트 */
export default function RiskCardPlaceholder({ greeting, message }: RiskCardPlaceholderProps) {
  return (
    <div className="relative h-20 w-full overflow-hidden rounded-[10px] border border-risk-border bg-risk-card">
      {/* 시안 기준 카드 위에서 3px, 오른쪽으로 8px 넘침. 넘친 부분은 잘린다 */}
      <img
        src="/images/risk/wrist.png"
        alt=""
        className="pointer-events-none absolute top-[3px] -right-2 h-[92px] w-[122px] -scale-x-100 object-cover opacity-45"
      />
      {message && (
        <p className="relative pt-[19px] pl-[19px] text-sm leading-5 font-bold whitespace-nowrap text-brand">
          {greeting}
          <br />
          {message}
        </p>
      )}
    </div>
  )
}
