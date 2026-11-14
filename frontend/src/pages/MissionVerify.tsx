import { Link, useParams } from 'react-router-dom'

/** 미션 인증(사진 업로드) 화면 자리. 디자인 확정 후 구현한다. */
export default function MissionVerify() {
  const { id } = useParams()

  return (
    <div className="space-y-4 px-[22px] pt-[22px]">
      <Link to="/" className="text-sm text-brand">
        ← 홈으로
      </Link>
      <p className="text-sm text-label">미션 {id}번 사진 인증 화면 (디자인 확정 후 구현)</p>
    </div>
  )
}
