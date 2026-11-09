/**
 * @file authRedirect.js
 * @description 회원가입/인증 이메일 발송 시 사용자가 인증 링크를 클릭했을 때 되돌아올 안전한 애플리케이션 Origin URL 생성 함수
 */

export function buildAuthRedirectURL(configuredURL, browserOrigin) {	// 설정된 URL과 현재 브라우저 Origin을 인자로 받음
  const candidate = configuredURL?.trim() || browserOrigin?.trim()	// 환경변수 우선 적용, 없으면 브라우저 Origin 사용
  if (!candidate) throw new Error('인증 이메일이 돌아올 앱 주소가 없습니다.')	// 주소가 없으면 예외 발생

  const url = new URL(candidate)	// URL 유효성 파싱
  if (!['http:', 'https:'].includes(url.protocol)) {	// 프로토콜 검증 (http 또는 https만 허용)
    throw new Error('인증 이메일 리다이렉트는 http 또는 https 주소여야 합니다.')	// 비정상 프로토콜 차단
  }

  // Supabase가 인증 토큰을 URL hash에 붙일 수 있으므로 HashRouter→BrowserRouter 전환으로 경로 관련 문제 없음.
  return url.origin	// 안전한 Origin(예: https://my-app.vercel.app)만 반환
}
