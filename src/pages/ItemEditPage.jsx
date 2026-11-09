/**
 * @file ItemEditPage.jsx
 * @description 기존 아이템 데이터를 불러와 폼에 채우고, 수정한 내용을 저장하는 편집 페이지 컴포넌트
 */

import { useState } from 'react'	// 로컬 전송 중 상태 관리 훅 임포트
import { Link, useNavigate, useParams } from 'react-router-dom'	// 경로 파라미터 및 네비게이션 훅 임포트
import { useItem } from '../hooks/useItem'	// 단일 아이템 조회 및 수정 훅 임포트
import ItemForm from '../components/ItemForm'	// 재사용 가능한 입력 폼 컴포넌트 임포트
import StateView from '../components/StateView'	// 4상태 렌더링 컨테이너 컴포넌트 임포트

export default function ItemEditPage() {	// 아이템 수정 페이지 컴포넌트 정의
  const { id } = useParams()	// URL에서 수정할 아이템 ID 추출
  const navigate = useNavigate()	// 페이지 이동 객체
  const { item, loading, error, mutationError, updateItem, refetch } = useItem(id)	// 단일 아이템 조회 및 업데이트 함수 추출
  const [submitting, setSubmitting] = useState(false)	// 폼 제출 진행 중 여부

  const handleSubmit = async (formData) => {	// 수정 폼 제출 핸들러
    setSubmitting(true)	// 수정 진행 중 플래그 활성화
    const updated = await updateItem(formData)	// 백엔드/로컬DB에 변경 데이터 업데이트 요청
    setSubmitting(false)	// 진행 플래그 비활성화
    if (updated) navigate(`/items/${id}`)	// 수정 완료 시 해당 아이템 상세 화면으로 복귀
  }

  return (
    <div>	// 페이지 전체 컨테이너
      <div style={{ marginBottom: 16 }}><Link to={`/items/${id}`} style={{ color: '#3b82f6', textDecoration: 'none', fontSize: 14 }}>← 상세로</Link></div>	// 상세 페이지 복귀 링크
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>아이템 수정</h1>	// 페이지 제목
      <StateView loading={loading} error={error} data={item} emptyMessage="존재하지 않는 항목입니다." onRetry={refetch}>	// 기존 데이터 로딩 상태 처리
        {(data) => (	// 데이터 로드 성공 시 기존 데이터를 폼의 initialData로 전달하여 렌더링
          <div style={{ border: '1px solid #e0e0e0', borderRadius: 8, padding: 24, background: '#fff' }}>	// 폼 박스 컨테이너
            <ItemForm initialData={data} onSubmit={handleSubmit} submitting={submitting} submitError={mutationError} />	// 수정 폼 컴포넌트
          </div>
        )}
      </StateView>
    </div>
  )
}
