import { Navigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'

export default function RequireOnboarded({ children }) {
  const profile = useAppStore((s) => s.profile)
  if (!profile) return <Navigate to="/onboarding" replace />
  return children
}
