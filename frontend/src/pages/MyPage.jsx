import { getOccupation } from '../data/mock'
import { useAppStore } from '../store/useAppStore'

const btn = { border: '1px solid #333', padding: '2px 8px', marginRight: 8, marginBottom: 8 }

export default function MyPage() {
  const profile = useAppStore((s) => s.profile)
  const seedDemo = useAppStore((s) => s.seedDemo)
  const reset = useAppStore((s) => s.reset)
  const occupation = getOccupation(profile?.occupationId)

  return (
    <div>
      <h1>내 정보</h1>
      <p>선택한 직종: {occupation?.label ?? '-'}</p>
      <section style={{ marginTop: 16 }}>
        <h2>[시연용]</h2>
        <button type="button" style={btn} onClick={() => seedDemo(3)}>
          스트릭 3일 주입
        </button>
        <button type="button" style={btn} onClick={() => seedDemo(6)}>
          스트릭 6일 주입
        </button>
        <button type="button" style={btn} onClick={reset}>
          전체 초기화
        </button>
      </section>
    </div>
  )
}
