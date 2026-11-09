/**
 * @file EmptyState.jsx
 * @description 조회된 데이터가 없을 때 사용자에게 상황을 알리고 액션 버튼(예: 등록하러 가기)을 안내하는 컴포넌트
 */

import { Link } from 'react-router-dom'	// 이동 링크를 위한 라우터 컴포넌트 임포트

export default function EmptyState({ message = '표시할 데이터가 없습니다.', actionLabel, actionTo }) {	// 메시지 및 유도 버튼 props
  return (
    <div style={{ border: '1px dashed #d1d5db', borderRadius: 8, padding: '48px 24px', textAlign: 'center' }}>	// 점선 테두리 안내 박스
      <span style={{ fontSize: 32 }}>📭</span>	// 우체통 빈 상태 아이콘
      <p style={{ color: '#888', fontSize: 15, marginTop: 12, marginBottom: 0 }}>{message}</p>	// 빈 상태 안내 문구
      {actionLabel && actionTo && <Link to={actionTo} style={{ display: 'inline-block', marginTop: 16, padding: '8px 20px', background: '#3b82f6', color: '#fff', borderRadius: 6, textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>{actionLabel}</Link>}	// 유도 액션 버튼
    </div>
  )
}
