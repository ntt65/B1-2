/**
 * @file LoginPage.jsx
 * @description 이메일/비밀번호 기반 로그인 및 회원가입 처리 화면. 인증 성공 시 이전 요청 경로로 리다이렉트
 */

import { useState } from 'react'	// 로컬 입력 폼 상태 관리 훅 임포트
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'	// 라우터 이동 및 쿼리스트링 파싱 훅 임포트
import ErrorBanner from '../components/ErrorBanner'	// 에러 메시지 배너 컴포넌트 임포트
import { useAuth } from '../hooks/useAuth'	// 전역 사용자 인증 상태 및 로그인/가입 함수 임포트

export default function LoginPage() {	// 로그인/회원가입 페이지 컴포넌트 정의
  const { user, authAvailable, sessionError, signIn, signUp } = useAuth()	// 인증 컨텍스트 속성 추출
  const navigate = useNavigate()	// 페이지 이동 명령 객체
  const [searchParams] = useSearchParams()	// URL 쿼리 파라미터 객체 (?redirect=...)
  const requestedRedirect = searchParams.get('redirect') || '/profile'	// 복귀할 경로 추출 (기본값: 프로필)
  const redirect = requestedRedirect.startsWith('/') && !requestedRedirect.startsWith('//')	// 안전한 내부 경로인지 검증 (오픈 리다이렉트 보안 취약점 방지)
    ? requestedRedirect	// 안전한 경로일 때 사용
    : '/profile'	// 안전하지 않으면 기본 프로필로 이동

  const [mode, setMode] = useState('signin')	// 폼 모드 상태 ('signin': 로그인, 'signup': 회원가입)
  const [displayName, setDisplayName] = useState('')	// 회원가입 시 표시 이름 입력값
  const [email, setEmail] = useState('')	// 이메일 입력값
  const [password, setPassword] = useState('')	// 비밀번호 입력값
  const [formError, setFormError] = useState(null)	// 입력 검증 오류 메시지
  const [successMessage, setSuccessMessage] = useState(null)	// 성공 안내 메시지
  const [submitting, setSubmitting] = useState(false)	// 전송 진행 중 상태

  if (user) return <Navigate to={redirect} replace />	// 이미 로그인된 사용자는 로그인 화면 접근 차단하고 원래 경로로 이동

  const changeMode = () => {	// 로그인 ↔ 회원가입 모드 전환 핸들러
    setMode((previous) => previous === 'signin' ? 'signup' : 'signin')	// 모드 토글
    setFormError(null)	// 에러 초기화
    setSuccessMessage(null)	// 성공 메시지 초기화
  }

  const handleSubmit = async (event) => {	// 폼 제출 비동기 핸들러
    event.preventDefault()	// 기본 새로고침 방지
    setFormError(null)	// 에러 초기화
    setSuccessMessage(null)	// 메시지 초기화

    if (mode === 'signup' && !displayName.trim()) {	// 회원가입 모드일 때 이름 필수 검증
      setFormError('표시 이름을 입력하세요.')	// 에러 설정
      return
    }
    if (!email.includes('@')) {	// 이메일 형식 기본 검증
      setFormError('올바른 이메일 주소를 입력하세요.')	// 에러 설정
      return
    }
    if (password.length < 6) {	// 비밀번호 최소 길이 검증
      setFormError('비밀번호는 6자 이상이어야 합니다.')	// 에러 설정
      return
    }

    setSubmitting(true)	// 전송 중 플래그 활성화
    let result
    try {
      result = mode === 'signin'	// 모드에 따라 로그인 또는 회원가입 호출
        ? await signIn({ email: email.trim(), password })	// Supabase 로그인 API
        : await signUp({ email: email.trim(), password, displayName: displayName.trim() })	// Supabase 가입 API
    } catch (requestError) {
      setFormError(requestError.message || '인증 요청에 실패했습니다.')	// 예외 처리
      return
    } finally {
      setSubmitting(false)	// 전송 종료
    }

    if (result.error) {	// Supabase 응답 에러 확인
      setFormError(result.error.message || '인증 요청에 실패했습니다.')	// 에러 출력
      return
    }

    if (mode === 'signup' && !result.data?.session) {	// 이메일 인증이 필요한 회원가입 완료 처리
      setSuccessMessage('가입 요청이 완료되었습니다. 이메일 확인 뒤 로그인하세요.')	// 안내 메시지
      setMode('signin')	// 로그인 모드로 전환
      setPassword('')	// 비밀번호 초기화
      return
    }

    navigate(redirect, { replace: true })	// 로그인 완료 시 목표 경로로 이동
  }

  if (!authAvailable) {	// Supabase 키가 없어 인증을 사용할 수 없는 상태일 때
    return (
      <div>
        {/* Supabase 인증 미설정 안내 화면 */}
        <h1 style={{ fontSize: 22, marginBottom: 20 }}>로그인</h1>
        <ErrorBanner message="Supabase 인증 설정이 없습니다. 환경변수를 확인하세요." />
        <Link to="/items" style={{ display: 'inline-block', marginTop: 16, color: '#2563eb' }}>목록으로 돌아가기</Link>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 480, margin: '0 auto' }}>
      {/* 모드별 타이틀 (로그인 / 회원가입) */}
      <h1 style={{ fontSize: 22, marginBottom: 8 }}>{mode === 'signin' ? '로그인' : '회원가입'}</h1>
      {/* 인증 안내 문구 */}
      <p style={{ color: '#666', fontSize: 14, marginBottom: 20 }}>
        Supabase Auth로 사용자 상태를 확인합니다.
      </p>
      {/* 입력 폼 */}
      <form noValidate onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 24, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8 }}>
        {/* 에러 배너 */}
        {(formError || sessionError) && <ErrorBanner message={formError || sessionError} />}
        {/* 성공 메시지 */}
        {successMessage && <p role="status" style={{ padding: 12, color: '#166534', background: '#dcfce7', borderRadius: 6 }}>{successMessage}</p>}
        {/* 회원가입 모드일 때만 표시되는 이름 입력창 */}
        {mode === 'signup' && (
          <div>
            <label htmlFor="display-name" style={{ display: 'block', fontWeight: 600, fontSize: 14, marginBottom: 6 }}>표시 이름</label>
            <input id="display-name" value={displayName} onChange={(event) => setDisplayName(event.target.value)} autoComplete="name" style={{ width: '100%', padding: 10, border: '1px solid #d1d5db', borderRadius: 6 }} />
          </div>
        )}
        {/* 이메일 입력 그룹 */}
        <div>
          <label htmlFor="auth-email" style={{ display: 'block', fontWeight: 600, fontSize: 14, marginBottom: 6 }}>이메일</label>
          <input id="auth-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" style={{ width: '100%', padding: 10, border: '1px solid #d1d5db', borderRadius: 6 }} />
        </div>
        {/* 비밀번호 입력 그룹 */}
        <div>
          <label htmlFor="auth-password" style={{ display: 'block', fontWeight: 600, fontSize: 14, marginBottom: 6 }}>비밀번호</label>
          <input id="auth-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} style={{ width: '100%', padding: 10, border: '1px solid #d1d5db', borderRadius: 6 }} />
        </div>
        {/* 전송 버튼 */}
        <button type="submit" disabled={submitting} style={{ padding: 10, border: 0, borderRadius: 6, color: '#fff', background: '#2563eb', fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.65 : 1 }}>
          {submitting ? '처리 중…' : mode === 'signin' ? '로그인' : '가입하기'}
        </button>
      </form>
      {/* 모드 전환 링크 버튼 */}
      <button type="button" onClick={changeMode} style={{ marginTop: 16, border: 0, background: 'transparent', color: '#2563eb', cursor: 'pointer' }}>
        {mode === 'signin' ? '계정이 없나요? 회원가입' : '이미 계정이 있나요? 로그인'}
      </button>
    </div>
  )
}
