import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import RequireOnboarded from './components/RequireOnboarded'
import TabLayout from './layouts/TabLayout'
import DietPage from './pages/DietPage'
import HomePage from './pages/HomePage'
import ItemDetail from './pages/ItemDetail'
import ItemList from './pages/ItemList'
import MyPage from './pages/MyPage'
import NotFoundPage from './pages/NotFoundPage'
import OnboardingPage from './pages/OnboardingPage'
import RoutinePage from './pages/RoutinePage'

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
      { path: '/home', element: <HomePage /> },
      { path: '/routine', element: <RoutinePage /> },
      { path: '/diet', element: <DietPage /> },
      { path: '/me', element: <MyPage /> },
    ],
  },
  // 기존 API 샘플 화면 (유지)
  { path: '/items', element: <ItemList /> },
  { path: '/items/:id', element: <ItemDetail /> },
  { path: '*', element: <NotFoundPage /> },
])

export default function App() {
  return <RouterProvider router={router} />
}
