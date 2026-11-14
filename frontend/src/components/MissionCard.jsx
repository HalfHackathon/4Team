export default function MissionCard({ title, sec, done, onComplete }) {
  return (
    <li style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
      <h3>{title}</h3>
      <p>약 {Math.max(1, Math.round(sec / 60))}분</p>
      <button
        type="button"
        onClick={onComplete}
        disabled={done}
        style={{ border: '1px solid #333', padding: '2px 8px' }}
      >
        {done ? '완료됨 ✓' : '완료 체크'}
      </button>
    </li>
  )
}
