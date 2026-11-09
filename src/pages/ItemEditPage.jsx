/**
 * @file ItemEditPage.jsx
 * @description 기존 아이템 데이터를 불러와 폼에 채우고, 수정한 내용을 저장하는 편집 페이지 컴포넌트
 */

import { useState } from 'react'	// 전송 중 상태 훅
import { Link, useNavigate, useParams } from 'react-router-dom'	// 라우터 파라미터 및 이동
import { useItem } from '../hooks/useItem'	// 단일 아이템 훅
import ItemForm from '../components/ItemForm'	// 재사용 폼 컴포넌트
import StateView from '../components/StateView'	// 4상태 뷰

export default function ItemEditPage() {
  const { id } = useParams()	// 수정할 아이템 ID
  const navigate = useNavigate()
  const { item, loading, error, mutationError, updateItem, refetch } = useItem(id)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (formData) => {	// 수정 제출 비동기 핸들러
    setSubmitting(true)
    const updated = await updateItem(formData)
    setSubmitting(false)
    if (updated) navigate(`/items/${id}`)
  }

  return (
    <div>
      {/* 상세 화면 복귀 링크 */}
      <div style={{ marginBottom: 16 }}><Link to={`/items/${id}`} style={{ color: '#3b82f6', textDecoration: 'none', fontSize: 14 }}>← 상세로</Link></div>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>아이템 수정</h1>
      {/* 데이터 조회 상태 뷰 */}
      <StateView loading={loading} error={error} data={item} emptyMessage="존재하지 않는 항목입니다." onRetry={refetch}>
        {(data) => (
          /* 기존 데이터가 initialData로 주입된 폼 */
          <div style={{ border: '1px solid #e0e0e0', borderRadius: 8, padding: 24, background: '#fff' }}>
            <ItemForm initialData={data} onSubmit={handleSubmit} submitting={submitting} submitError={mutationError} />
          </div>
        )}
      </StateView>
    </div>
  )
}
