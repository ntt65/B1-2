/**
 * @file main.jsx
 * @description 애플리케이션 진입점(Entry Point). 전역 AuthProvider 및 React 루트 렌더링 설정
 */

import { StrictMode } from 'react'	// 개발 중 잠재적 문제를 감지하기 위한 엄격 모드 임포트
import { createRoot } from 'react-dom/client'	// React 18 루트 렌더링 API 임포트
import App from './App.jsx'	// 최상위 App 컴포넌트 임포트
import { AuthProvider } from './context/AuthContext.jsx'	// 전역 인증 상태 제공자 임포트
import './index.css'	// 전역 스타일시트 임포트

// 최상위 DOM root에 React 앱 마운트 및 StrictMode, AuthProvider 주입
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
)
