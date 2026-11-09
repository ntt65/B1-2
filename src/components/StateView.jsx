import LoadingSpinner from './LoadingSpinner'
import ErrorBanner from './ErrorBanner'
import EmptyState from './EmptyState'

/**
 * @file StateView.jsx
 * @description 비동기 데이터 통신의 4가지 상태(로딩, 에러, 빈 상태, 데이터 성공)를 통합하여 분기 렌더링하는 컨테이너 컴포넌트
 */
export default function StateView({ loading, error, data, emptyMessage, emptyActionLabel, emptyActionTo, onRetry, children }) {
  if (loading) return <LoadingSpinner />
  if (error) return <ErrorBanner message={error} onRetry={onRetry} />
  if (!data || (Array.isArray(data) && data.length === 0)) return <EmptyState message={emptyMessage} actionLabel={emptyActionLabel} actionTo={emptyActionTo} />
  return <>{children(data)}</>
}
