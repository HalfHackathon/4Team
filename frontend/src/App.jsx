import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import ModeBadge from './components/ModeBadge'
import PhoneFrame from './components/PhoneFrame'
import RequireOnboarded from './components/RequireOnboarded'
import TabLayout from './layouts/TabLayout'
import Home from './pages/Home'
import ItemDetail from './pages/ItemDetail'
import ItemList from './pages/ItemList'
import MyPage from './pages/MyPage'
import NotFoundPage from './pages/NotFoundPage'
import OnboardingPage from './pages/OnboardingPage'
import RankingPage from './pages/RankingPage'

const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/home" replace /> },
  { path: '/onboarding', element: <OnboardingPage /> },
  {
    element: (
      <RequireOnboarded>
        <TabLayout />
      </RequireOnboarded>
    ),
    children: [
      // Figma 시안 홈. 기존 pages/HomePage.jsx(스트릭·직종 리스크)는 통합 논의 전까지 파일만 유지
      { path: '/home', element: <Home /> },
      { path: '/ranking', element: <RankingPage /> },
      { path: '/me', element: <MyPage /> },
    ],
  },
  // 기존 API 샘플 화면 (유지)
  { path: '/items', element: <ItemList /> },
  { path: '/items/:id', element: <ItemDetail /> },
  { path: '*', element: <NotFoundPage /> },
])

export default function App() {
  return (
    <PhoneFrame
      overlay={
        // 개발·시연용 API 모드 표시. 화면 레이아웃에 영향 없도록 떠 있게 둔다.
        <div className="pointer-events-none absolute top-2 right-2 z-50 opacity-80 sm:top-3 sm:right-5">
          <ModeBadge />
        </div>
      }
    >
      <RouterProvider router={router} />
    </PhoneFrame>
  )
}
