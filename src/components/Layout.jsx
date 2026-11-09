/**
 * @file Layout.jsx
 * @description 모든 페이지에 공통 적용되는 상단 헤더, 네비게이션, 본문 영역(Outlet), 푸터 레이아웃
 */

import { Link, Outlet } from 'react-router-dom'	// 라우터 링크 및 중첩 컴포넌트 렌더링 헬퍼 임포트
import DataSourceBadge from './DataSourceBadge'	// 현재 데이터 저장소(Local/Remote) 배지 컴포넌트 임포트
import { useAuth } from '../hooks/useAuth'	// 전역 사용자 인증 상태 훅 임포트

export default function Layout() {	// 공통 레이아웃 컴포넌트 정의
  const { user, loading } = useAuth()	// 현재 로그인 유저 및 세션 확인 중 여부 가져오기

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>	// 화면 전체 높이를 차지하는 플렉스 컨테이너
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid #e0e0e0', background: '#fff' }}>	// 상단 헤더 네비게이션 바
        <Link to="/items" style={{ fontSize: 20, fontWeight: 700, color: '#1a1a1a', textDecoration: 'none' }}>📝 Item Manager</Link>	// 홈/목록 이동 로고 링크
        <nav style={{ display: 'flex', alignItems: 'center', gap: 16 }}>	// 우측 네비게이션 메뉴 그룹
          <DataSourceBadge />	// 로컬/원격 데이터 모드 상태 표시 배지
          <Link to="/items" style={{ color: '#555', textDecoration: 'none', fontSize: 14, fontWeight: 500, padding: '6px 12px', borderRadius: 6 }}>목록</Link>	// 아이템 목록 링크
          <Link to={user ? '/profile' : '/login'} style={{ color: '#555', textDecoration: 'none', fontSize: 14, fontWeight: 500, padding: '6px 12px', borderRadius: 6 }}>	// 로그인 여부에 따른 프로필/로그인 링크
            {loading ? '확인 중…' : user ? '프로필' : '로그인'}	// 세션 로딩 중 처리 및 텍스트 분기
          </Link>	// 네비게이션 링크 종료
        </nav>	// 네비게이션 영역 종료
      </header>	// 헤더 영역 종료
      <main style={{ flex: 1, padding: '24px', maxWidth: 960, margin: '0 auto', width: '100%' }}>	// 중앙 본문 컨텐츠 영역
        <Outlet />	// 중첩된 자식 라우트 컴포넌트 렌더링
      </main>	// 본문 영역 종료
      <footer style={{ padding: '12px 24px', textAlign: 'center', color: '#999', fontSize: 13, borderTop: '1px solid #e0e0e0' }}>B4-2 React CRUD · Codyssey</footer>	// 하단 푸터 영역
    </div>	// 전체 레이아웃 컨테이너 종료
  )
}
