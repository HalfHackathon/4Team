import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <main style={{ padding: 16 }}>
      <h1>404</h1>
      <p>페이지를 찾을 수 없습니다.</p>
      <Link to="/home">홈으로</Link>
    </main>
  )
}
