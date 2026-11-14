import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ModeBadge from './components/ModeBadge'
import ItemDetail from './pages/ItemDetail'
import ItemList from './pages/ItemList'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-svh bg-gray-50 text-gray-900">
        <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/90 backdrop-blur">
          <div className="mx-auto flex max-w-md items-center justify-between px-4 py-3">
            <h1 className="text-base font-bold">4Team</h1>
            <ModeBadge />
          </div>
        </header>
        <main className="mx-auto max-w-md px-4 py-4">
          <Routes>
            <Route path="/" element={<ItemList />} />
            <Route path="/items/:id" element={<ItemDetail />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
