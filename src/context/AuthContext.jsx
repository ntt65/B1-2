/**
 * @file AuthContext.jsx
 * @description Supabase Auth와 연동하여 사용자 세션(로그인/로그아웃/가입) 상태를 앱 전체 트리에 전파하는 전역 Provider
 */

import { createContext, useEffect, useMemo, useState } from 'react'	// 리액트 컨텍스트 및 상태 관리 훅 임포트
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient'	// Supabase 클라이언트 및 설정 여부 임포트
import { buildAuthRedirectURL } from '../lib/authRedirect'	// 회원가입 이메일 확인 후 복귀할 안전한 URL 생성 유틸 임포트

export const AuthContext = createContext(null)	// 컴포넌트들이 구독할 인증 컨텍스트 객체 생성

export function AuthProvider({ children }) {	// 애플리케이션 최상위를 감싸는 인증 프로바이더 컴포넌트
  const [user, setUser] = useState(null)	// 현재 로그인한 사용자 객체 상태 (미로그인 시 null)
  const [loading, setLoading] = useState(isSupabaseConfigured)	// 초기 세션 확인 중 여부 상태
  const [sessionError, setSessionError] = useState(null)	// 세션 확인 오류 메시지

  useEffect(() => {	// 마운트 시 기존 로그인 세션 자동 확인 및 리스너 등록
    if (!isSupabaseConfigured) {	// Supabase 설정이 없는 로컬 모드인 경우
      setLoading(false)	// 세션 대기 즉시 종료
      return undefined	// 리스너 등록 생략
    }

    let active = true	// 언마운트 후 상태 갱신 방지를 위한 플래그
    supabase.auth.getSession()	// 브라우저 저장소의 세션 토큰 확인
      .then(({ data, error }) => {	// 세션 응답 처리
        if (!active) return	// 언마운트된 경우 무시
        if (error) setSessionError(error.message)	// 에러 저장
        setUser(data.session?.user || null)	// 로그인 사용자 상태 반영
        setLoading(false)	// 로딩 완료
      })
      .catch((requestError) => {	// 네트워크 오류 처리
        if (!active) return	// 무시
        setSessionError(requestError.message || '로그인 상태를 확인하지 못했습니다.')	// 에러 문구
        setLoading(false)	// 로딩 완료
      })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {	// 로그인/로그아웃 이벤트 감지 리스너
      if (active) setUser(session?.user || null)	// 세션 변경 시 유저 상태 즉시 동기화
    })

    return () => {	// 컴포넌트 언마운트 시 클린업
      active = false	// 비활성화
      listener.subscription.unsubscribe()	// 인증 이벤트 구독 해제
    }
  }, [])

  const signIn = async ({ email, password }) => {	// 이메일/비밀번호 로그인 함수
    if (!supabase) return { error: new Error('Supabase 인증 설정이 없습니다.') }	// 클라이언트 부재 시 에러
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })	// Supabase 로그인 API 호출
    if (data.user) setUser(data.user)	// 성공 시 전역 유저 상태 즉시 갱신
    return { data, error }	// 결과 반환
  }

  const signUp = async ({ email, password, displayName }) => {	// 회원가입 함수
    if (!supabase) return { error: new Error('Supabase 인증 설정이 없습니다.') }	// 부재 시 에러
    const emailRedirectTo = buildAuthRedirectURL(	// 이메일 인증 링크 클릭 시 복귀할 URL 계산
      import.meta.env.VITE_APP_URL,	// 배포된 앱 환경변수 URL
      globalThis.location?.origin,	// 브라우저 현재 Origin
    )
    const { data, error } = await supabase.auth.signUp({	// Supabase 가입 API 호출
      email,	// 이메일 전달
      password,	// 비밀번호 전달
      options: {	// 추가 옵션
        data: { display_name: displayName },	// 메타데이터에 표시 이름 저장
        emailRedirectTo,	// 인증 메일 복귀 주소 지정
      },
    })
    if (data.user && data.session) setUser(data.user)	// 세션이 바로 발급된 경우 유저 상태 갱신
    return { data, error }	// 결과 반환
  }

  const signOut = async () => {	// 로그아웃 함수
    if (!supabase) return { error: new Error('Supabase 인증 설정이 없습니다.') }	// 부재 시 에러
    const { error } = await supabase.auth.signOut()	// Supabase 세션 만료 호출
    if (!error) setUser(null)	// 성공 시 유저 상태 초기화(null)
    return { error }	// 결과 반환
  }

  const value = useMemo(() => ({	// 하위 컴포넌트 리렌더링 최적화를 위한 value 메모이제이션
    user,	// 현재 사용자
    loading,	// 세션 확인 중 여부
    sessionError,	// 세션 에러
    authAvailable: isSupabaseConfigured,	// 인증 기능 사용 가능 여부
    signIn,	// 로그인 함수
    signUp,	// 회원가입 함수
    signOut,	// 로그아웃 함수
  }), [loading, sessionError, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>	// 하위 트리에 Context 주입
}
