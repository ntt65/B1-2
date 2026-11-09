/**
 * @file ErrorBanner.jsx
 * @description API 통신 실패나 폼 오류 등 에러 메시지를 눈에 띄게 표시하고 재시도 옵션을 제공하는 배너 컴포넌트
 */

export default function ErrorBanner({ message = '요청에 실패했습니다. 다시 시도하세요.', onRetry }) {	// 메시지 및 재시도 콜백 props
  return (
    <div role="alert" aria-live="polite" style={{ border: '1px solid #fecaca', background: '#fef2f2', borderRadius: 8, padding: '20px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>	// 접근성 alert 역할 컨테이너
      <span style={{ fontSize: 28 }}>⚠️</span>	// 경고 아이콘
      <p style={{ color: '#b91c1c', fontSize: 14, fontWeight: 500, margin: 0 }}>{message}</p>	// 빨간색 에러 텍스트
      {onRetry && <button onClick={onRetry} style={{ padding: '6px 16px', border: '1px solid #b91c1c', borderRadius: 6, background: '#fff', color: '#b91c1c', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>다시 시도</button>}	// 재시도 버튼 (콜백 존재 시에만 표시)
    </div>
  )
}
