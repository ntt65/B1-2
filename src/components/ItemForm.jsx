/**
 * @file ItemForm.jsx
 * @description 아이템 등록 및 수정을 위한 입력 폼. 유효성 검사, 접근성(ARIA) 및 제출 처리 제공
 */

import { useId, useState } from 'react'	// 고유 ID 생성 훅 및 폼 상태 관리 훅
import ErrorBanner from './ErrorBanner'	// 에러 표시 배너 컴포넌트

export default function ItemForm({ initialData, onSubmit, submitting, submitError }) {
  const formId = useId()	// 접근성 라벨 연결용 고유 폼 ID
  const titleId = `${formId}-title`	// 제목 input ID
  const titleErrorId = `${titleId}-error`	// 제목 에러 메시지 ID
  const categoryId = `${formId}-category`	// 카테고리 select ID
  const contentId = `${formId}-content`	// 내용 textarea ID
  const contentErrorId = `${contentId}-error`	// 내용 에러 메시지 ID

  const [title, setTitle] = useState(initialData?.title || '')	// 제목 입력 상태
  const [content, setContent] = useState(initialData?.content || '')	// 본문 입력 상태
  const [category, setCategory] = useState(initialData?.category || '일반')	// 카테고리 선택 상태
  const [errors, setErrors] = useState({})	// 유효성 검증 에러 상태

  const validate = () => {	// 입력값 유효성 검사 함수
    const nextErrors = {}
    if (!title.trim()) nextErrors.title = '제목을 입력하세요'
    else if (title.trim().length < 2) nextErrors.title = '제목은 최소 2자 이상이어야 합니다'
    if (!content.trim()) nextErrors.content = '내용을 입력하세요'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = (event) => {	// 폼 제출 이벤트 핸들러
    event.preventDefault()	// 브라우저 기본 새로고침 방지
    if (!validate()) return	// 유효성 실패 시 중단
    onSubmit({ title: title.trim(), content: content.trim(), category })	// 부모 컴포넌트로 데이터 전송
  }

  return (
    <form noValidate onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* 서버 전송 에러 발생 시 표시되는 에러 배너 */}
      {submitError && <ErrorBanner message={submitError} />}

      {/* 1. 제목 입력 필드 */}
      <div>
        <label htmlFor={titleId} style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6, color: '#333' }}>
          제목 <span aria-hidden="true" style={{ color: '#dc2626' }}>*</span>
        </label>
        <input
          id={titleId}
          type="text"
          value={title}
          aria-required="true"
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? titleErrorId : undefined}
          onChange={(event) => {
            setTitle(event.target.value)
            if (errors.title) setErrors((previous) => ({ ...previous, title: null }))
          }}
          style={errors.title
            ? { width: '100%', padding: '10px 12px', border: '1px solid #dc2626', borderRadius: 6, fontSize: 14, boxSizing: 'border-box' }
            : { width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14, boxSizing: 'border-box' }}
          placeholder="제목을 입력하세요"
        />
        {errors.title && <p id={titleErrorId} role="alert" style={{ color: '#dc2626', fontSize: 13, margin: '4px 0 0 0' }}>{errors.title}</p>}
      </div>

      {/* 2. 카테고리 선택 드롭다운 */}
      <div>
        <label htmlFor={categoryId} style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6, color: '#333' }}>카테고리</label>
        <select
          id={categoryId}
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14, boxSizing: 'border-box' }}
        >
          <option value="일반">일반</option>
          <option value="학습">학습</option>
          <option value="도구">도구</option>
          <option value="백엔드">백엔드</option>
        </select>
      </div>

      {/* 3. 본문 내용 입력 필드 */}
      <div>
        <label htmlFor={contentId} style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6, color: '#333' }}>
          내용 <span aria-hidden="true" style={{ color: '#dc2626' }}>*</span>
        </label>
        <textarea
          id={contentId}
          value={content}
          aria-required="true"
          aria-invalid={Boolean(errors.content)}
          aria-describedby={errors.content ? contentErrorId : undefined}
          onChange={(event) => {
            setContent(event.target.value)
            if (errors.content) setErrors((previous) => ({ ...previous, content: null }))
          }}
          style={errors.content
            ? { width: '100%', padding: '10px 12px', border: '1px solid #dc2626', borderRadius: 6, fontSize: 14, boxSizing: 'border-box', height: 120, resize: 'vertical' }
            : { width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14, boxSizing: 'border-box', height: 120, resize: 'vertical' }}
          placeholder="내용을 입력하세요"
        />
        {errors.content && <p id={contentErrorId} role="alert" style={{ color: '#dc2626', fontSize: 13, margin: '4px 0 0 0' }}>{errors.content}</p>}
      </div>

      {/* 4. 제출 버튼 */}
      <div>
        <button
          type="submit"
          disabled={submitting}
          style={submitting
            ? { padding: '10px 28px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: 'not-allowed', opacity: 0.6 }
            : { padding: '10px 28px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
        >
          {submitting ? '저장 중…' : '저장'}
        </button>
      </div>
    </form>
  )
}
