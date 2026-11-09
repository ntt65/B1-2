/**
 * @file ProtectedRoute.jsx
 * @description 비로그인 사용자의 보호된 경로 접근을 차단하고 로그인 화면으로 리다이렉트하는 가드 컴포넌트
 */

import { Navigate, useLocation } from 'react-router-dom'	// 라우터 이동 및 현재 경로 조회 훅 임포트
import { useAuth } from '../hooks/useAuth'	// 인증 상태 조회 훅 임포트
import LoadingSpinner from './LoadingSpinner'	// 로딩 상태 표시 컴포넌트 임포트
import { isLocalMode } from '../lib/supabaseClient'	// 로컬 모드 여부 확인 플래그 임포트

export default function ProtectedRoute({ children, allowLocalMode = false }) {	// 보호 라우트 가드 컴포넌트 정의
  const { user, loading } = useAuth()	// 로그인 사용자 객체 및 세션 로딩 상태 추출
  const location = useLocation()	// 현재 접근을 시도한 URL 경로 정보 추출

  if (allowLocalMode && isLocalMode) return children	// 로컬 모드 허용 옵션이 켜져 있고 로컬 모드라면 접근 허용
  if (loading) return <LoadingSpinner message="로그인 상태를 확인하는 중…" />	// 인증 세션 확인 중일 때는 로딩 스피너 표시
  if (!user) {	// 로그인하지 않은 비인증 사용자인 경우
    const redirect = encodeURIComponent(`${location.pathname}${location.search}`)	// 로그인 후 복귀할 현재 경로 인코딩
    return <Navigate to={`/login?redirect=${redirect}`} replace />	// 로그인 페이지로 히스토리 대체 이동
  }	// 비인증 분기 종료

  return children	// 인증 완료 시 원래 보여줄 자식 컴포넌트 렌더링
}
