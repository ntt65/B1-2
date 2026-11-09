/**
 * @file useAuth.js
 * @description AuthContext의 전역 인증 상태(user, session, signIn, signOut 등)에 손쉽게 접근할 수 있도록 래핑한 커스텀 훅
 */

import { useContext } from 'react'	// 리액트 컨텍스트 구독 훅 임포트
import { AuthContext } from '../context/AuthContext'	// 인증 컨텍스트 객체 임포트

export function useAuth() {	// 인증 훅 함수 정의
  const auth = useContext(AuthContext)	// 현재 트리 상위의 AuthContext 값 조회
  if (!auth) throw new Error('useAuth는 AuthProvider 안에서 사용해야 합니다.')	// Provider 외부에서 호출 시 예외 발생
  return auth	// 인증 상태 및 액션 객체 반환
}
