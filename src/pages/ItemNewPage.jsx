/**
 * @file ItemNewPage.jsx
 * @description 새로운 아이템 등록 입력을 처리하고 성공 시 상세 페이지로 리다이렉트하는 페이지 컴포넌트
 */

import { useState } from 'react'	// 로컬 전송 중 상태 관리 훅 임포트
import { Link, useNavigate } from 'react-router-dom'	// 목록 이동 링크 및 페이지 전환 네비게이트 함수 임포트
import { useItems } from '../hooks/useItems'	// 아이템 생성 함수를 제공하는 목록 커스텀 훅 임포트
import ItemForm from '../components/ItemForm'	// 공통 아이템 입력 폼 컴포넌트 임포트

export default function ItemNewPage() {	// 아이템 등록 페이지 컴포넌트 정의
  const navigate = useNavigate()	// 페이지 이동 객체
  const { addItem, mutationError } = useItems()	// 아이템 추가 함수 및 에러 상태 추출
  const [submitting, setSubmitting] = useState(false)	// 폼 제출 진행 중 여부

  const handleSubmit = async (formData) => {	// 폼 제출 시 비동기 등록 실행 함수
    setSubmitting(true)	// 전송 진행 중 활성화
    const created = await addItem(formData)	// 백엔드/로컬DB에 새 아이템 추가 요청
    setSubmitting(false)	// 전송 완료 후 상태 해제
    if (created) navigate(`/items/${created.id}`)	// 등록 성공 시 생성된 아이템의 상세 페이지로 이동
  }

  return (
    <div>	// 페이지 전체 컨테이너
      <div style={{ marginBottom: 16 }}><Link to="/items" style={{ color: '#3b82f6', textDecoration: 'none', fontSize: 14 }}>← 목록으로</Link></div>	// 목록 복귀 링크
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>새 아이템 등록</h1>	// 페이지 제목
      <div style={{ border: '1px solid #e0e0e0', borderRadius: 8, padding: 24, background: '#fff' }}>	// 폼 외곽 박스
        <ItemForm onSubmit={handleSubmit} submitting={submitting} submitError={mutationError} />	// 입력 폼 컴포넌트 렌더링
      </div>
    </div>
  )
}
