/**
 * @file ProfilePage.jsx
 * @description 현재 로그인한 사용자의 프로필 정보(이메일, 표시 이름, 가입일)를 조회하고 로그아웃을 수행하는 마이페이지
 */

import { useState } from 'react'	// 로그아웃 진행 상태 관리 훅 임포트
import { useNavigate } from 'react-router-dom'	// 로그아웃 후 페이지 이동을 위한 훅 임포트
import ErrorBanner from '../components/ErrorBanner'	// 에러 표시 배너 임포트
import { useAuth } from '../hooks/useAuth'	// 사용자 세션 및 로그아웃 함수 훅 임포트

export default function ProfilePage() {	// 프로필 페이지 컴포넌트 정의
  const { user, signOut } = useAuth()	// 로그인 유저 정보 및 로그아웃 실행 함수 추출
  const navigate = useNavigate()	// 페이지 이동 객체
  const [submitting, setSubmitting] = useState(false)	// 로그아웃 요청 진행 중 상태
  const [error, setError] = useState(null)	// 에러 상태

  const handleSignOut = async () => {	// 로그아웃 실행 핸들러
    setSubmitting(true)	// 진행 상태 활성화
    setError(null)	// 에러 초기화
    let result
    try {
      result = await signOut()	// Supabase 세션 종료 호출
    } catch (requestError) {
      setError(requestError.message || '로그아웃에 실패했습니다.')	// 오류 처리
      return
    } finally {
      setSubmitting(false)	// 상태 해제
    }

    if (result.error) {	// 응답 에러 확인
      setError(result.error.message || '로그아웃에 실패했습니다.')	// 에러 메시지 반영
      return
    }
    navigate('/items', { replace: true })	// 로그아웃 성공 시 아이템 목록 화면으로 리다이렉트
  }

  return (
    <div style={{ maxWidth: 560, margin: '0 auto' }}>	// 중앙 정렬 박스 컨테이너
      <h1 style={{ fontSize: 22, marginBottom: 20 }}>내 프로필</h1>	// 페이지 제목
      {error && <div style={{ marginBottom: 16 }}><ErrorBanner message={error} /></div>}	// 에러 배너
      <section style={{ padding: 24, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8 }}>	// 프로필 카드 영역
        <dl style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 12, margin: 0 }}>	// 설명 목록 그리드
          <dt style={{ fontWeight: 700 }}>표시 이름</dt>	// 항목명
          <dd style={{ margin: 0 }}>{user.user_metadata?.display_name || '설정 안 함'}</dd>	// 사용자 메타데이터 이름
          <dt style={{ fontWeight: 700 }}>이메일</dt>	// 항목명
          <dd style={{ margin: 0 }}>{user.email}</dd>	// 이메일 주소
          <dt style={{ fontWeight: 700 }}>가입일</dt>	// 항목명
          <dd style={{ margin: 0 }}>{user.created_at ? new Date(user.created_at).toLocaleString('ko-KR') : '-'}</dd>	// 포맷팅된 가입 일시
        </dl>
        <button type="button" onClick={handleSignOut} disabled={submitting} style={{ marginTop: 24, padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: 6, background: '#fff', cursor: submitting ? 'not-allowed' : 'pointer' }}>	// 로그아웃 버튼
          {submitting ? '로그아웃 중…' : '로그아웃'}	// 진행 중 텍스트 분기
        </button>
      </section>
    </div>
  )
}
