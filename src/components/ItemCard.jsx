/**
 * @file ItemCard.jsx
 * @description 개별 아이템의 제목, 본문, 카테고리, 작성일을 표시하고 수정/삭제 버튼을 제공하는 카드 컴포넌트
 */

import { memo } from 'react'	// props 불변 시 불필요한 리렌더링을 차단하는 최적화 함수
import { Link } from 'react-router-dom'	// 상세 및 수정 페이지 이동 링크

function ItemCard({ item, onDelete, canWrite = false }) {	// 아이템 데이터, 삭제 콜백, 쓰기 권한 props
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, border: '1px solid #e0e0e0', borderRadius: 8, padding: '16px 20px', background: '#fff' }}>
      {/* 좌측 정보 영역 */}
      <div style={{ flex: 1 }}>
        {/* 아이템 제목 링크 (클릭 시 상세 페이지로 이동) */}
        <Link to={`/items/${item.id}`} style={{ fontSize: 16, fontWeight: 600, color: '#1a1a1a', textDecoration: 'none', display: 'block', marginBottom: 6 }}>
          {item.title}
        </Link>
        {/* 아이템 본문 미리보기 */}
        <p style={{ fontSize: 14, color: '#666', margin: '0 0 10px 0', lineHeight: 1.5 }}>
          {item.content}
        </p>
        {/* 카테고리 및 생성일자 메타데이터 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 4, fontSize: 12, fontWeight: 500, background: '#f3f4f6', color: '#374151' }}>
            {item.category || '일반'}
          </span>
          <span style={{ color: '#aaa', fontSize: 12 }}>
            {item.created_at ? new Date(item.created_at).toLocaleDateString('ko-KR') : ''}
          </span>
        </div>
      </div>

      {/* 우측 관리 버튼 (로그인하여 쓰기 권한이 있는 경우에만 표시) */}
      {canWrite && (
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          <Link to={`/items/${item.id}/edit`} style={{ padding: '5px 12px', border: '1px solid #d1d5db', borderRadius: 5, background: '#fff', color: '#555', textDecoration: 'none', fontSize: 13 }}>
            수정
          </Link>
          <button onClick={() => onDelete(item.id)} style={{ padding: '5px 12px', border: '1px solid #fecaca', borderRadius: 5, background: '#fff', color: '#dc2626', cursor: 'pointer', fontSize: 13 }}>
            삭제
          </button>
        </div>
      )}
    </div>
  )
}

export default memo(ItemCard)	// 컴포넌트 메모이제이션
