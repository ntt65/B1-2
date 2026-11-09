/**
 * @file ItemNewPage.jsx
 * @description 새로운 아이템 등록 입력을 처리하고 성공 시 상세 페이지로 리다이렉트하는 페이지 컴포넌트
 */

import { useState } from 'react'	// 전송 중 로컬 상태 훅
import { Link, useNavigate } from 'react-router-dom'	// 라우터 링크 및 네비게이트
import { useItems } from '../hooks/useItems'	// 아이템 비즈니스 로직 훅
import ItemForm from '../components/ItemForm'	// 공통 폼 컴포넌트

export default function ItemNewPage() {
  const navigate = useNavigate()
  const { addItem, mutationError } = useItems()
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (formData) => {	// 폼 제출 비동기 핸들러
    setSubmitting(true)
    const created = await addItem(formData)
    setSubmitting(false)
    if (created) navigate(`/items/${created.id}`)
  }

  return (
    <div>
      {/* 목록 복귀 링크 */}
      <div style={{ marginBottom: 16 }}><Link to="/items" style={{ color: '#3b82f6', textDecoration: 'none', fontSize: 14 }}>← 목록으로</Link></div>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>새 아이템 등록</h1>
      {/* 폼 박스 컨테이너 */}
      <div style={{ border: '1px solid #e0e0e0', borderRadius: 8, padding: 24, background: '#fff' }}>
        <ItemForm onSubmit={handleSubmit} submitting={submitting} submitError={mutationError} />
      </div>
    </div>
  )
}
