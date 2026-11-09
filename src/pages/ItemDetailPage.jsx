/**
 * @file ItemDetailPage.jsx
 * @description 단일 아이템의 상세 내용 조회, 수정 페이지 이동, 삭제 모달 처리를 담당하는 상세 뷰 페이지
 */

import { useState } from 'react'	// 로컬 상태 관리 훅 임포트
import { useParams, Link, useNavigate } from 'react-router-dom'	// URL 파라미터 조회, 링크, 페이지 이동 훅 임포트
import { useItem } from '../hooks/useItem'	// 단일 아이템 비즈니스 로직 커스텀 훅 임포트
import StateView from '../components/StateView'	// 4상태 렌더링 컨테이너 컴포넌트 임포트
import ConfirmDialog from '../components/ConfirmDialog'	// 삭제 확인 모달 컴포넌트 임포트
import ErrorBanner from '../components/ErrorBanner'	// 에러 배너 컴포넌트 임포트
import { useAuth } from '../hooks/useAuth'	// 사용자 인증 상태 조회 훅 임포트
import { isLocalMode } from '../lib/supabaseClient'	// 로컬 학습 모드 플래그 임포트
import { canWriteItems } from '../lib/permissions'	// 아이템 쓰기 권한 판별 함수 임포트

export default function ItemDetailPage() {	// 아이템 상세 페이지 컴포넌트 정의
  const { id } = useParams()	// URL 경로의 :id 파라미터 값 추출
  const navigate = useNavigate()	// 페이지 이동 명령을 위한 함수
  const { user } = useAuth()	// 현재 로그인한 사용자 정보 추출
  const canWrite = canWriteItems(user, isLocalMode)	// 사용자 쓰기 권한 여부 판별
  const {	// 커스텀 훅에서 단일 아이템 상태 및 함수 추출
    item,	// 조회된 단일 아이템 객체
    loading,	// 조회 로딩 중 여부
    error,	// 조회 실패 에러
    mutationError,	// 삭제 실패 에러
    refetch,	// 다시 조회 함수
    deleteItem,	// 단일 아이템 삭제 함수
    clearMutationError,	// 에러 초기화 함수
  } = useItem(id)	// ID를 인자로 넘겨 해당 아이템 조회
  const [confirmOpen, setConfirmOpen] = useState(false)	// 삭제 모달 열림 여부
  const [deleting, setDeleting] = useState(false)	// 삭제 진행 중 상태

  const openDeleteDialog = () => {	// 삭제 모달 열기 함수
    clearMutationError()	// 이전 에러 제거
    setConfirmOpen(true)	// 모달 열기
  }

  const handleDelete = async () => {	// 삭제 확인 클릭 시 비동기 실행 함수
    setDeleting(true)	// 삭제 진행 시작
    const ok = await deleteItem()	// 삭제 요청
    setDeleting(false)	// 삭제 진행 종료
    if (ok) navigate('/items')	// 삭제 성공 시 목록 페이지로 이동
  }

  return (
    <div>	// 페이지 컨테이너
      <div style={{ marginBottom: 16 }}><Link to="/items" style={{ color: '#3b82f6', textDecoration: 'none', fontSize: 14 }}>← 목록으로</Link></div>	// 뒤로가기 링크
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>아이템 상세</h1>	// 페이지 제목
      {mutationError && <div style={{ marginBottom: 16 }}><ErrorBanner message={mutationError} /></div>}	// 삭제 오류 배너
      <StateView loading={loading} error={error} data={item} emptyMessage="존재하지 않는 항목입니다." onRetry={refetch}>	// 4상태 뷰
        {(data) => (	// 데이터 로드 성공 시 렌더링 함수
          <div style={{ border: '1px solid #e0e0e0', borderRadius: 8, padding: 24, background: '#fff' }}>	// 상세 카드 박스
            <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 0, marginBottom: 8 }}>{data.title}</h2>	// 아이템 제목
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>	// 메타정보 행
              <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 4, fontSize: 12, fontWeight: 500, background: '#f3f4f6', color: '#374151' }}>{data.category || '일반'}</span>	// 카테고리 태그
              <span style={{ color: '#aaa', fontSize: 13 }}>{data.created_at ? new Date(data.created_at).toLocaleString('ko-KR') : ''}</span>	// 생성일시 문자열
            </div>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: '#444', whiteSpace: 'pre-wrap' }}>{data.content}</p>	// 줄바꿈이 보존되는 본문 텍스트
            {canWrite ? (	// 쓰기 권한이 있을 경우
              <div style={{ display: 'flex', gap: 10, marginTop: 24, paddingTop: 16, borderTop: '1px solid #f0f0f0' }}>	// 하단 수정/삭제 버튼 그룹
                <Link to={`/items/${data.id}/edit`} style={{ padding: '6px 16px', border: '1px solid #d1d5db', borderRadius: 5, background: '#fff', color: '#555', textDecoration: 'none', fontSize: 13 }}>수정</Link>	// 수정 이동 링크
                <button onClick={openDeleteDialog} style={{ padding: '6px 16px', border: '1px solid #fecaca', borderRadius: 5, background: '#fff', color: '#dc2626', cursor: 'pointer', fontSize: 13 }}>삭제</button>	// 삭제 모달 호출
              </div>
            ) : (	// 비로그인 사용자일 경우
              <p style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #f0f0f0', color: '#666', fontSize: 14 }}>	// 로그인 유도 안내 문구
                <Link to={`/login?redirect=${encodeURIComponent(`/items/${data.id}`)}`} style={{ color: '#2563eb' }}>로그인</Link>하면 수정과 삭제를 사용할 수 있습니다.	// 현재 경로 복귀 링크가 포함된 로그인 안내
              </p>
            )}
          </div>
        )}
      </StateView>
      <ConfirmDialog	// 삭제 확인 모달 컴포넌트
        open={confirmOpen}	// 열림 상태
        message="정말 삭제하시겠습니까?"	// 확인 질문
        busy={deleting}	// 삭제 중 상태
        error={mutationError}	// 에러 메시지
        onConfirm={handleDelete}	// 확인 시 삭제 실행
        onCancel={() => setConfirmOpen(false)}	// 취소 시 닫기
      />
    </div>
  )
}
