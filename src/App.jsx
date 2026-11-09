/**
 * @file App.jsx
 * @description 애플리케이션의 최상위 라우터 설정 및 페이지 경로 매핑
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom'	// 브라우저 라우팅 컴포넌트 임포트
import Layout from './components/Layout'	// 공통 레이아웃 컴포넌트
import ItemListPage from './pages/ItemListPage'	// 아이템 목록 페이지
import ItemDetailPage from './pages/ItemDetailPage'	// 아이템 상세 페이지
import ItemNewPage from './pages/ItemNewPage'	// 새 아이템 등록 페이지
import ItemEditPage from './pages/ItemEditPage'	// 아이템 수정 페이지
import NotFoundPage from './pages/NotFoundPage'	// 404 예외 페이지
import LoginPage from './pages/LoginPage'	// 로그인 페이지
import ProfilePage from './pages/ProfilePage'	// 마이페이지 프로필
import ProtectedRoute from './components/ProtectedRoute'	// 로그인/인증 보호 라우트

export default function App() {	// 애플리케이션 루트 컴포넌트
  return (
    <BrowserRouter>	// HTML5 History API 기반 라우터
      <Routes>	// 라우트 분기 컨테이너
        <Route path="/" element={<Layout />}>	// 기본 레이아웃 중첩 구조
          <Route index element={<ItemListPage />} />	// 루트(/) 접속 시 목록 표시
          <Route path="items" element={<ItemListPage />} />	// /items 경로 목록 표시
          <Route path="items/new" element={<ProtectedRoute allowLocalMode><ItemNewPage /></ProtectedRoute>} />	// 등록 화면 (로그인 보호)
          <Route path="items/:id" element={<ItemDetailPage />} />	// 아이템 상세 화면
          <Route path="items/:id/edit" element={<ProtectedRoute allowLocalMode><ItemEditPage /></ProtectedRoute>} />	// 수정 화면 (로그인 보호)
          <Route path="login" element={<LoginPage />} />	// 로그인 화면
          <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />	// 프로필 화면 (로그인 보호)
          <Route path="*" element={<NotFoundPage />} />	// 404 예외 처리
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
