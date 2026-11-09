/**
 * @file ItemCard.jsx
 * @description 개별 아이템의 제목, 본문, 카테고리, 작성일을 표시하고 수정/삭제 버튼을 제공하는 카드 컴포넌트
 */

import { memo } from 'react'	// props가 바뀌지 않으면 리렌더링을 방지하는 React 최적화 함수 임포트
import { Link } from 'react-router-dom'	// 상세 페이지 및 수정 페이지 이동을 위한 라우터 링크 임포트

function ItemCard({ item, onDelete, canWrite = false }) {	// 아이템 데이터, 삭제 핸들러, 쓰기 권한 props 수신
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, border: '1px solid #e0e0e0', borderRadius: 8, padding: '16px 20px', background: '#fff' }}>	// 카드 전체 외곽 컨테이너
      <div style={{ flex: 1 }}>	// 왼쪽 텍스트 정보 영역 (제목, 본문, 메타데이터)
        <Link to={`/items/${item.id}`} style={{ fontSize: 16, fontWeight: 600, color: '#1a1a1a', textDecoration: 'none', display: 'block', marginBottom: 6 }}>{item.title}</Link>	// 상세 페이지 이동 제목 링크
        <p style={{ fontSize: 14, color: '#666', margin: '0 0 10px 0', lineHeight: 1.5 }}>{item.content}</p>	// 본문 미리보기 텍스트
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>	// 메타데이터 가로 배치 컨테이너
          <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 4, fontSize: 12, fontWeight: 500, background: '#f3f4f6', color: '#374151' }}>{item.category || '일반'}</span>	// 카테고리 뱃지 태그
          <span style={{ color: '#aaa', fontSize: 12 }}>{item.created_at ? new Date(item.created_at).toLocaleDateString('ko-KR') : ''}</span>	// 한국식 날짜 포맷팅 출력
        </div>	// 메타데이터 컨테이너 종료
      </div>	// 왼쪽 텍스트 영역 종료
      {canWrite && (	// 로그인하여 수정/삭제 권한이 있는 경우에만 버튼 노출
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>	// 우측 액션 버튼 그룹
          <Link to={`/items/${item.id}/edit`} style={{ padding: '5px 12px', border: '1px solid #d1d5db', borderRadius: 5, background: '#fff', color: '#555', textDecoration: 'none', fontSize: 13 }}>수정</Link>	// 수정 페이지 이동 버튼
          <button onClick={() => onDelete(item.id)} style={{ padding: '5px 12px', border: '1px solid #fecaca', borderRadius: 5, background: '#fff', color: '#dc2626', cursor: 'pointer', fontSize: 13 }}>삭제</button>	// 삭제 모달 호출 버튼
        </div>	// 액션 버튼 그룹 종료
      )}
    </div>	// 카드 외곽 컨테이너 종료
  )
}

export default memo(ItemCard)	// 동일한 props 전달 시 불필요한 리렌더링을 차단하도록 메모이제이션 내보내기
