/**
 * @file StateView.jsx
 * @description 비동기 데이터 통신의 4가지 상태(로딩, 에러, 빈 상태, 데이터 성공)를 통합하여 분기 렌더링하는 컨테이너 컴포넌트
 */

import LoadingSpinner from './LoadingSpinner'	// 로딩 상태 표시 스피너 임포트
import ErrorBanner from './ErrorBanner'	// 에러 상태 표시 배너 임포트
import EmptyState from './EmptyState'	// 데이터 부재 안내 컴포넌트 임포트

export default function StateView({ loading, error, data, emptyMessage, emptyActionLabel, emptyActionTo, onRetry, children }) {	// 4상태 제어 props 수신
  if (loading) return <LoadingSpinner />	// 데이터 로딩 중일 때 스피너 반환
  if (error) return <ErrorBanner message={error} onRetry={onRetry} />	// 에러 발생 시 재시도 버튼과 에러 배너 반환
  if (!data || (Array.isArray(data) && data.length === 0)) return <EmptyState message={emptyMessage} actionLabel={emptyActionLabel} actionTo={emptyActionTo} />	// 데이터가 비었을 때 빈 화면 안내 반환
  return <>{children(data)}</>	// 데이터가 정상 존재할 때 함수형 자식 컴포넌트에 데이터 전달하여 렌더링
}
