/**
 * @file Layout.jsx
 * @description 모든 페이지에 공통 적용되는 상단 헤더, 네비게이션, 본문 영역(Outlet), 푸터 레이아웃
 */

import { Link, Outlet } from 'react-router-dom'	// 라우터 링크 및 중첩 렌더링 헬퍼 임포트
import DataSourceBadge from './DataSourceBadge'	// 데이터 저장소 상태 뱃지 컴포넌트 임포트
import { useAuth } from '../hooks/useAuth'	// 사용자 인증 상태 훅 임포트

export default function Layout() {	// 공통 레이아웃 컴포넌트 정의
  const { user, loading } = useAuth()	// 현재 로그인한 사용자 정보 및 세션 로딩 상태 추출

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 상단 헤더 네비게이션 바 */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid #e0e0e0', background: '#fff' }}>
        {/* 홈/목록 이동 로고 링크 */}
        <Link to="/items" style={{ fontSize: 20, fontWeight: 700, color: '#1a1a1a', textDecoration: 'none' }}>
          📝 Item Manager
        </Link>
        {/* 우측 메뉴 그룹 */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* 현재 데이터 저장 위치 뱃지 (Supabase 원격 vs LocalStorage 학습) */}
          <DataSourceBadge />
          {/* 목록 페이지 링크 */}
          <Link to="/items" style={{ color: '#555', textDecoration: 'none', fontSize: 14, fontWeight: 500, padding: '6px 12px', borderRadius: 6 }}>
            목록
          </Link>
          {/* 로그인 상태에 따라 프로필 또는 로그인 버튼으로 분기 */}
          <Link to={user ? '/profile' : '/login'} style={{ color: '#555', textDecoration: 'none', fontSize: 14, fontWeight: 500, padding: '6px 12px', borderRadius: 6 }}>
            {loading ? '확인 중…' : user ? '프로필' : '로그인'}
          </Link>
        </nav>
      </header>

      {/* 중앙 본문 영역 (URL에 매칭되는 각 페이지 컴포넌트가 Outlet 위치에 렌더링됨) */}
      <main style={{ flex: 1, padding: '24px', maxWidth: 960, margin: '0 auto', width: '100%' }}>
        <Outlet />
      </main>

      {/* 하단 푸터 영역 */}
      <footer style={{ padding: '12px 24px', textAlign: 'center', color: '#999', fontSize: 13, borderTop: '1px solid #e0e0e0' }}>
        B1-2 React CRUD · Codyssey
      </footer>
    </div>
  )
}
