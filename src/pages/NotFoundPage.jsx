/**
 * @file NotFoundPage.jsx
 * @description 존재하지 않거나 유효하지 않은 URL 접근 시 404 안내 문구와 목록 복귀 버튼을 제공하는 예외 화면
 */

import { Link } from 'react-router-dom'	// 라우터 링크 임포트

export default function NotFoundPage() {	// 404 페이지 컴포넌트 정의
  return (
    <div style={{ textAlign: 'center', padding: '80px 24px' }}>
      {/* 대형 404 에러 코드 */}
      <h1 style={{ fontSize: 64, fontWeight: 800, color: '#d1d5db', margin: '0 0 8px 0' }}>404</h1>
      {/* 안내 문구 */}
      <p style={{ fontSize: 18, color: '#666', marginBottom: 24 }}>페이지를 찾을 수 없습니다</p>
      {/* 메인 목록 복귀 버튼 */}
      <Link to="/items" style={{ display: 'inline-block', padding: '10px 24px', background: '#3b82f6', color: '#fff', borderRadius: 6, textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>목록으로 돌아가기</Link>
    </div>
  )
}
