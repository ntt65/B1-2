/**
 * @file App.jsx
 * @description 애플리케이션의 최상위 라우터 설정 및 페이지 경로 매핑
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom'	// 브라우저 라우팅 컴포넌트 임포트
import Layout from './components/Layout'	// 공통 레이아웃 컴포넌트 임포트
import ItemListPage from './pages/ItemListPage'	// 아이템 목록 페이지 임포트
import ItemDetailPage from './pages/ItemDetailPage'	// 아이템 상세 페이지 임포트
import ItemNewPage from './pages/ItemNewPage'	// 새 아이템 등록 페이지 임포트
import ItemEditPage from './pages/ItemEditPage'	// 아이템 수정 페이지 임포트
import NotFoundPage from './pages/NotFoundPage'	// 404 예외 페이지 임포트
import LoginPage from './pages/LoginPage'	// 로그인 페이지 임포트
import ProfilePage from './pages/ProfilePage'	// 마이페이지 프로필 임포트
import ProtectedRoute from './components/ProtectedRoute'	// 로그인/인증 보호 라우트 임포트

export default function App() {	// 애플리케이션 루트 컴포넌트
  return (
    <BrowserRouter>
      {/* 라우트 분기 컨테이너 */}
      <Routes>
        {/* 공통 Layout 중첩 라우트 */}
        <Route path="/" element={<Layout />}>
          {/* 기본 루트 경로: 아이템 목록 */}
          <Route index element={<ItemListPage />} />
          {/* /items 경로: 아이템 목록 */}
          <Route path="items" element={<ItemListPage />} />
          {/* /items/new: 새 아이템 등록 (로그인 보호 라우트) */}
          <Route path="items/new" element={<ProtectedRoute allowLocalMode><ItemNewPage /></ProtectedRoute>} />
          {/* /items/:id: 아이템 상세 화면 */}
          <Route path="items/:id" element={<ItemDetailPage />} />
          {/* /items/:id/edit: 아이템 수정 화면 (로그인 보호 라우트) */}
          <Route path="items/:id/edit" element={<ProtectedRoute allowLocalMode><ItemEditPage /></ProtectedRoute>} />
          {/* /login: 로그인 및 회원가입 화면 */}
          <Route path="login" element={<LoginPage />} />
          {/* /profile: 마이페이지 (로그인 필수) */}
          <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          {/* 등록되지 않은 모든 경로는 404 처리 */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
