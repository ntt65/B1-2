/**
 * @file ItemListPage.jsx
 * @description 아이템 목록 조회, 카테고리 필터링(메모이제이션), 삭제 모달 호출을 담당하는 메인 목록 페이지
 */

import { useCallback, useMemo, useState } from 'react'	// 최적화 훅 및 로컬 상태 관리 훅 임포트
import { Link } from 'react-router-dom'	// 라우터 링크 이동 컴포넌트 임포트
import { useItems } from '../hooks/useItems'	// 아이템 목록 비즈니스 로직 커스텀 훅 임포트
import StateView from '../components/StateView'	// 4상태(로딩/에러/빈값/성공) 제어 래퍼 컴포넌트 임포트
import ItemCard from '../components/ItemCard'	// 단일 아이템 카드 렌더링 컴포넌트 임포트
import ConfirmDialog from '../components/ConfirmDialog'	// 삭제 확인 모달 컴포넌트 임포트
import ErrorBanner from '../components/ErrorBanner'	// 에러 안내 배너 임포트
import CategoryFilter from '../components/CategoryFilter'	// 카테고리 필터 셀렉트박스 컴포넌트 임포트
import { useAuth } from '../hooks/useAuth'	// 사용자 인증 상태 조회 훅 임포트
import { isLocalMode } from '../lib/supabaseClient'	// 로컬 학습 모드 플래그 임포트
import { canWriteItems } from '../lib/permissions'	// 아이템 쓰기/수정/삭제 권한 확인 유틸 임포트

export default function ItemListPage() {	// 아이템 목록 페이지 컴포넌트 정의
  const {	// 커스텀 훅에서 필요한 상태와 함수 비구조화 할당
    items,	// 아이템 배열 데이터
    loading,	// 데이터 로딩 중 여부
    error,	// 조회 실패 에러 메시지
    mutationError,	// 등록/삭제 등 변경 실패 에러 메시지
    refetch,	// 목록 다시 불러오기 함수
    deleteItem,	// 아이템 삭제 함수
    clearMutationError,	// 에러 메시지 초기화 함수
  } = useItems()
  const { user } = useAuth()	// 현재 로그인한 사용자 정보 추출
  const canWrite = canWriteItems(user, isLocalMode)	// 사용자 쓰기 권한 여부 판별 (로컬 모드이거나 로그인된 경우)
  const [category, setCategory] = useState('전체')	// 선택된 카테고리 상태 (기본값: 전체)
  const [confirmId, setConfirmId] = useState(null)	// 삭제 대상 아이템 ID 상태 (null이면 모달 닫힘)
  const [deleting, setDeleting] = useState(false)	// 삭제 통신 진행 중 상태

  const categoryCounts = useMemo(() => {	// 각 카테고리별 아이템 개수를 계산하는 메모이제이션 함수
    if (!items) return { 전체: 0 }	// 데이터가 없으면 0 반환
    return items.reduce((counts, item) => {	// 카테고리별 개수 누적 계산
      const itemCategory = item.category || '일반'	// 카테고리 없으면 일반으로 분류
      counts[itemCategory] = (counts[itemCategory] || 0) + 1	// 해당 카테고리 카운트 1 증가
      return counts	// 누적 객체 반환
    }, { 전체: items.length })	// 전체 개수 기본 포함
  }, [items])	// items 변경 시에만 재계산

  const filteredItems = useMemo(() => {	// 선택된 카테고리에 맞게 목록을 필터링하는 메모이제이션 함수
    if (!items || category === '전체') return items	// '전체' 선택 시 모든 아이템 반환
    return items.filter((item) => (item.category || '일반') === category)	// 선택된 카테고리 일치 항목만 추출
  }, [category, items])	// 카테고리나 목록 변경 시에만 재계산

  const openDeleteDialog = useCallback((id) => {	// 삭제 확인 모달 열기 핸들러 (참조 고정)
    clearMutationError()	// 이전 에러 초기화
    setConfirmId(id)	// 삭제할 아이템 ID 설정하여 모달 오픈
  }, [clearMutationError])

  const handleDelete = async () => {	// 삭제 확정 비동기 실행 함수
    setDeleting(true)	// 삭제 진행 중 플래그 활성화
    const ok = await deleteItem(confirmId)	// 서버/로컬 스토리지에 삭제 요청
    setDeleting(false)	// 진행 플래그 비활성화
    if (ok) setConfirmId(null)	// 삭제 성공 시 모달 닫기
  }

  const emptyMessage = category === '전체'	// 카테고리 선택에 따른 빈 화면 안내 문구 생성
    ? '표시할 데이터가 없습니다.'	// 전체 선택 시
    : `${category} 카테고리에 표시할 데이터가 없습니다.`	// 특정 카테고리 선택 시

  return (
    <div>	// 페이지 루트 컨테이너
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>	// 상단 제목 및 등록 버튼 행
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>아이템 목록</h1>	// 페이지 타이틀
        <Link to="/items/new" style={{ padding: '8px 16px', background: '#3b82f6', color: '#fff', borderRadius: 6, textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>	// 등록 페이지 이동 링크
          {canWrite ? '+ 새 아이템 등록' : '로그인 후 등록'}	// 권한 여부에 따른 버튼 텍스트 분기
        </Link>
      </div>
      <CategoryFilter value={category} onChange={setCategory} counts={categoryCounts} />	// 카테고리 필터 UI
      {mutationError && <div style={{ marginBottom: 16 }}><ErrorBanner message={mutationError} /></div>}	// 삭제 등 변경 실패 시 에러 표시
      <StateView	// 4가지 비동기 상태를 통합 처리하는 뷰
        loading={loading}	// 로딩 상태 전달
        error={error}	// 에러 상태 전달
        data={filteredItems}	// 필터링된 데이터 전달
        emptyMessage={emptyMessage}	// 빈 화면 문구 전달
        onRetry={refetch}	// 재시도 함수 전달
      >
        {(data) => (	// 데이터가 성공적으로 존재할 때 렌더링되는 자식 함수
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>	// 카드 리스트 수직 배열 컨테이너
            {data.map((item) => (	// 아이템 배열 순회
              <ItemCard	// 단일 아이템 카드 컴포넌트
                key={item.id}	// React 리스트 렌더링 고유 키
                item={item}	// 아이템 데이터
                canWrite={canWrite}	// 쓰기 권한 여부
                onDelete={openDeleteDialog}	// 삭제 클릭 시 모달 열기 핸들러
              />
            ))}
          </div>
        )}
      </StateView>
      <ConfirmDialog	// 삭제 확인 모달
        open={confirmId !== null}	// 열림 상태 바인딩
        message="정말 삭제하시겠습니까?"	// 확인 질문
        busy={deleting}	// 삭제 중 여부
        error={mutationError}	// 삭제 오류 메시지
        onConfirm={handleDelete}	// 확인 클릭 시 실행
        onCancel={() => setConfirmId(null)}	// 취소 클릭 시 닫기
      />
    </div>
  )
}
