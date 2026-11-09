import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import LoadingSpinner from './LoadingSpinner'
import { isLocalMode } from '../lib/supabaseClient'

/**
 * @file ProtectedRoute.jsx
 * @description 비로그인 사용자의 보호된 경로 접근을 차단하고 로그인 화면으로 리다이렉트하는 가드 컴포넌트
 */
export default function ProtectedRoute({ children, allowLocalMode = false }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (allowLocalMode && isLocalMode) return children
  if (loading) return <LoadingSpinner message="로그인 상태를 확인하는 중…" />
  if (!user) {
    const redirect = encodeURIComponent(`${location.pathname}${location.search}`)
    return <Navigate to={`/login?redirect=${redirect}`} replace />
  }

  return children
}
