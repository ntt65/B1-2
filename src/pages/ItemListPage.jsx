/**
 * @file ItemListPage.jsx
 * @description 아이템 목록 조회, 카테고리 필터링(메모이제이션), 삭제 모달 호출을 담당하는 메인 목록 페이지
 */

import { useCallback, useMemo, useState } from 'react'	// 최적화 훅 및 상태 훅
import { Link } from 'react-router-dom'	// 라우터 링크
import { useItems } from '../hooks/useItems'	// 아이템 비즈니스 로직 훅
import StateView from '../components/StateView'	// 4상태 제어 뷰
import ItemCard from '../components/ItemCard'	// 아이템 카드 컴포넌트
import ConfirmDialog from '../components/ConfirmDialog'	// 삭제 모달 컴포넌트
import ErrorBanner from '../components/ErrorBanner'	// 에러 배너 컴포넌트
import CategoryFilter from '../components/CategoryFilter'	// 카테고리 필터 컴포넌트
import { useAuth } from '../hooks/useAuth'	// 인증 훅
import { isLocalMode } from '../lib/supabaseClient'	// 로컬 모드 확인
import { canWriteItems } from '../lib/permissions'	// 쓰기 권한 확인 유틸

export default function ItemListPage() {
  const {
    items,
    loading,
    error,
    mutationError,
    refetch,
    deleteItem,
    clearMutationError,
  } = useItems()
  const { user } = useAuth()
  const canWrite = canWriteItems(user, isLocalMode)
  const [category, setCategory] = useState('전체')
  const [confirmId, setConfirmId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const categoryCounts = useMemo(() => {	// 카테고리별 개수 계산 (메모이제이션)
    if (!items) return { 전체: 0 }
    return items.reduce((counts, item) => {
      const itemCategory = item.category || '일반'
      counts[itemCategory] = (counts[itemCategory] || 0) + 1
      return counts
    }, { 전체: items.length })
  }, [items])

  const filteredItems = useMemo(() => {	// 선택된 카테고리에 맞게 필터링 (메모이제이션)
    if (!items || category === '전체') return items
    return items.filter((item) => (item.category || '일반') === category)
  }, [category, items])

  const openDeleteDialog = useCallback((id) => {	// 삭제 확인 모달 열기 핸들러
    clearMutationError()
    setConfirmId(id)
  }, [clearMutationError])

  const handleDelete = async () => {	// 삭제 실행 핸들러
    setDeleting(true)
    const ok = await deleteItem(confirmId)
    setDeleting(false)
    if (ok) setConfirmId(null)
  }

  const emptyMessage = category === '전체'
    ? '표시할 데이터가 없습니다.'
    : `${category} 카테고리에 표시할 데이터가 없습니다.`

  return (
    <div>
      {/* 상단 제목 및 새 아이템 등록 버튼 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>아이템 목록</h1>
        <Link to="/items/new" style={{ padding: '8px 16px', background: '#3b82f6', color: '#fff', borderRadius: 6, textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>
          {canWrite ? '+ 새 아이템 등록' : '로그인 후 등록'}
        </Link>
      </div>

      {/* 카테고리 필터 UI */}
      <CategoryFilter value={category} onChange={setCategory} counts={categoryCounts} />

      {/* 삭제 실패 등 에러 발생 시 출력 */}
      {mutationError && <div style={{ marginBottom: 16 }}><ErrorBanner message={mutationError} /></div>}

      {/* 비동기 4상태(로딩, 에러, 빈값, 데이터) 렌더링 컨테이너 */}
      <StateView
        loading={loading}
        error={error}
        data={filteredItems}
        emptyMessage={emptyMessage}
        onRetry={refetch}
      >
        {(data) => (
          /* 아이템 카드 리스트 */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {data.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                canWrite={canWrite}
                onDelete={openDeleteDialog}
              />
            ))}
          </div>
        )}
      </StateView>

      {/* 삭제 확인 모달 대화상자 */}
      <ConfirmDialog
        open={confirmId !== null}
        message="정말 삭제하시겠습니까?"
        busy={deleting}
        error={mutationError}
        onConfirm={handleDelete}
        onCancel={() => setConfirmId(null)}
      />
    </div>
  )
}
