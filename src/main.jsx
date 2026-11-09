/**
 * @file main.jsx
 * @description 애플리케이션 진입점(Entry Point). 전역 AuthProvider 및 React 루트 렌더링 설정
 */

import { StrictMode } from 'react'	// 개발 중 잠재적 문제를 감지하기 위한 엄격 모드 임포트
import { createRoot } from 'react-dom/client'	// React 18 루트 렌더링 API 임포트
import App from './App.jsx'	// 최상위 App 컴포넌트 임포트
import { AuthProvider } from './context/AuthContext.jsx'	// 전역 인증 상태 제공자 임포트
import './index.css'	// 전역 스타일시트 임포트

createRoot(document.getElementById('root')).render(	// DOM의 root 요소에 React 애플리케이션 마운트
  <StrictMode>	// React 엄격 모드 활성화
    <AuthProvider>	// 애플리케이션 전체에 인증 컨텍스트 주입
      <App />	// 라우터 및 메인 뷰 렌더링
    </AuthProvider>	// AuthProvider 종료
  </StrictMode>	// StrictMode 종료
)	// render 호출 종료
