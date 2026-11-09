/**
 * @file ItemDetailPage.jsx
 * @description 단일 아이템의 상세 내용 조회, 수정 페이지 이동, 삭제 모달 처리를 담당하는 상세 뷰 페이지
 */

import { useState } from 'react'	// 로컬 상태 훅
import { useParams, Link, useNavigate } from 'react-router-dom'	// 라우터 파라미터 및 네비게이션
import { useItem } from '../hooks/useItem'	// 단일 아이템 훅
import StateView from '../components/StateView'	// 4상태 뷰
import ConfirmDialog from '../components/ConfirmDialog'	// 삭제 모달
import ErrorBanner from '../components/ErrorBanner'	// 에러 배너
import { useAuth } from '../hooks/useAuth'	// 인증 훅
import { isLocalMode } from '../lib/supabaseClient'	// 로컬 모드 플래그
import { canWriteItems } from '../lib/permissions'	// 쓰기 권한 판별 유틸

export default function ItemDetailPage() {
  const { id } = useParams()	// URL 파라미터 ID 추출
  const navigate = useNavigate()	// 페이지 이동 객체
  const { user } = useAuth()	// 현재 유저
  const canWrite = canWriteItems(user, isLocalMode)	// 쓰기 권한 여부
  const {
    item,
    loading,
    error,
    mutationError,
    refetch,
    deleteItem,
    clearMutationError,
  } = useItem(id)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const openDeleteDialog = () => {
    clearMutationError()
    setConfirmOpen(true)
  }

  const handleDelete = async () => {
    setDeleting(true)
    const ok = await deleteItem()
    setDeleting(false)
    if (ok) navigate('/items')
  }

  return (
    <div>
      {/* 목록 복귀 링크 */}
      <div style={{ marginBottom: 16 }}><Link to="/items" style={{ color: '#3b82f6', textDecoration: 'none', fontSize: 14 }}>← 목록으로</Link></div>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>아이템 상세</h1>
      {mutationError && <div style={{ marginBottom: 16 }}><ErrorBanner message={mutationError} /></div>}

      {/* 비동기 4상태 처리 뷰 */}
      <StateView loading={loading} error={error} data={item} emptyMessage="존재하지 않는 항목입니다." onRetry={refetch}>
        {(data) => (
          /* 상세 정보 카드 박스 */
          <div style={{ border: '1px solid #e0e0e0', borderRadius: 8, padding: 24, background: '#fff' }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 0, marginBottom: 8 }}>{data.title}</h2>
            {/* 카테고리 및 생성일시 메타데이터 */}
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
              <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 4, fontSize: 12, fontWeight: 500, background: '#f3f4f6', color: '#374151' }}>{data.category || '일반'}</span>
              <span style={{ color: '#aaa', fontSize: 13 }}>{data.created_at ? new Date(data.created_at).toLocaleString('ko-KR') : ''}</span>
            </div>
            {/* 본문 내용 */}
            <p style={{ fontSize: 15, lineHeight: 1.7, color: '#444', whiteSpace: 'pre-wrap' }}>{data.content}</p>
            {/* 권한에 따른 수정/삭제 버튼 또는 로그인 유도 안내 */}
            {canWrite ? (
              <div style={{ display: 'flex', gap: 10, marginTop: 24, paddingTop: 16, borderTop: '1px solid #f0f0f0' }}>
                <Link to={`/items/${data.id}/edit`} style={{ padding: '6px 16px', border: '1px solid #d1d5db', borderRadius: 5, background: '#fff', color: '#555', textDecoration: 'none', fontSize: 13 }}>수정</Link>
                <button onClick={openDeleteDialog} style={{ padding: '6px 16px', border: '1px solid #fecaca', borderRadius: 5, background: '#fff', color: '#dc2626', cursor: 'pointer', fontSize: 13 }}>삭제</button>
              </div>
            ) : (
              <p style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #f0f0f0', color: '#666', fontSize: 14 }}>
                <Link to={`/login?redirect=${encodeURIComponent(`/items/${data.id}`)}`} style={{ color: '#2563eb' }}>로그인</Link>하면 수정과 삭제를 사용할 수 있습니다.
              </p>
            )}
          </div>
        )}
      </StateView>

      {/* 삭제 확인 모달 */}
      <ConfirmDialog
        open={confirmOpen}
        message="정말 삭제하시겠습니까?"
        busy={deleting}
        error={mutationError}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  )
}
