/**
 * @file dataSource.js
 * @description 환경변수(URL, KEY, ALLOW_LOCAL_DB) 상태를 분석하여 앱의 데이터 소스 모드를 결정하는 순수 함수
 */

export function resolveDataSource({ url, key, allowLocalDB }) {	// 환경변수 객체 수신
  if (url && key) return 'supabase'	// Supabase URL과 키가 둘 다 있으면 원격 모드
  if (allowLocalDB === 'true') return 'local'	// 로컬 학습 모드 허용 플래그가 true면 로컬 모드
  return 'missing'	// 둘 다 충족되지 않으면 설정 누락 에러 모드
}
