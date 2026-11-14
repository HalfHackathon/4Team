import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ModeBadge from './components/ModeBadge'
import Home from './pages/Home'
import ItemDetail from './pages/ItemDetail'
import ItemList from './pages/ItemList'
import MissionVerify from './pages/MissionVerify'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-svh bg-surface text-gray-900">
        {/* 개발·시연용 API 모드 표시. 화면 레이아웃에 영향 없도록 떠 있게 둔다. */}
        <div className="pointer-events-none fixed top-2 right-2 z-50 opacity-80">
          <ModeBadge />
        </div>
        <main className="mx-auto max-w-md">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/missions/:id" element={<MissionVerify />} />
            {/* 샘플: 화면 → api → 목데이터 경로 참고용 */}
            <Route path="/items" element={<ItemList />} />
            <Route path="/items/:id" element={<ItemDetail />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
