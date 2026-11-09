/**
 * @file ItemForm.jsx
 * @description 아이템 등록 및 수정을 위한 입력 폼. 유효성 검사, 접근성(ARIA) 및 제출 처리 제공
 */

import { useId, useState } from 'react'	// 고유 ID 생성 훅 및 폼 입력 상태 관리 훅 임포트
import ErrorBanner from './ErrorBanner'	// 폼 제출 오류 표시용 배너 컴포넌트 임포트

export default function ItemForm({ initialData, onSubmit, submitting, submitError }) {	// 초기값, 제출핸들러, 전송상태 props 수신
  const formId = useId()	// 접근성 라벨 연결을 위한 고유 폼 ID 생성
  const titleId = `${formId}-title`	// 제목 입력 필드 ID
  const titleErrorId = `${titleId}-error`	// 제목 오류 메시지 ID
  const categoryId = `${formId}-category`	// 카테고리 선택 필드 ID
  const contentId = `${formId}-content`	// 내용 입력 필드 ID
  const contentErrorId = `${contentId}-error`	// 내용 오류 메시지 ID

  const [title, setTitle] = useState(initialData?.title || '')	// 제목 입력 상태
  const [content, setContent] = useState(initialData?.content || '')	// 본문 입력 상태
  const [category, setCategory] = useState(initialData?.category || '일반')	// 카테고리 선택 상태 (기본값: 일반)
  const [errors, setErrors] = useState({})	// 유효성 검증 오류 상태 객체

  const validate = () => {	// 폼 입력값 검증 함수
    const nextErrors = {}	// 새로운 에러 객체 초기화
    if (!title.trim()) nextErrors.title = '제목을 입력하세요'	// 제목 필수 입력 검증
    else if (title.trim().length < 2) nextErrors.title = '제목은 최소 2자 이상이어야 합니다'	// 최소 길이 검증
    if (!content.trim()) nextErrors.content = '내용을 입력하세요'	// 본문 필수 입력 검증
    setErrors(nextErrors)	// 에러 상태 갱신
    return Object.keys(nextErrors).length === 0	// 에러가 0개면 통과(true)
  }

  const handleSubmit = (event) => {	// 폼 제출 이벤트 핸들러
    event.preventDefault()	// 브라우저 기본 새로고침 방지
    if (!validate()) return	// 유효성 검사 실패 시 전송 중단
    onSubmit({ title: title.trim(), content: content.trim(), category })	// 공백 제거 후 부모 컴포넌트로 데이터 전송
  }

  return (
    <form noValidate onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>	// 폼 컨테이너
      {submitError && <ErrorBanner message={submitError} />}	// 서버 전송 오류 발생 시 배너 출력
      <div>	// 제목 입력 섹션
        <label htmlFor={titleId} style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6, color: '#333' }}>	// 제목 라벨
          제목 <span aria-hidden="true" style={{ color: '#dc2626' }}>*</span>	// 필수 표시 빨간 별표
        </label>
        <input	// 제목 입력창
          id={titleId}	// 라벨과 연결된 ID
          type="text"	// 텍스트 타입
          value={title}	// 제어 컴포넌트 바인딩
          aria-required="true"	// 스크린 리더 필수 입력 속성
          aria-invalid={Boolean(errors.title)}	// 에러 여부 접근성 알림
          aria-describedby={errors.title ? titleErrorId : undefined}	// 에러 메시지와 연결
          onChange={(event) => {	// 값 변경 핸들러
            setTitle(event.target.value)	// 입력값 반영
            if (errors.title) setErrors((previous) => ({ ...previous, title: null }))	// 입력 시 기존 에러 초기화
          }}
          style={errors.title	// 에러 발생 여부에 따른 테두리 색상 분기
            ? { width: '100%', padding: '10px 12px', border: '1px solid #dc2626', borderRadius: 6, fontSize: 14, boxSizing: 'border-box' }
            : { width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14, boxSizing: 'border-box' }}
          placeholder="제목을 입력하세요"	// 입력 힌트
        />
        {errors.title && <p id={titleErrorId} role="alert" style={{ color: '#dc2626', fontSize: 13, margin: '4px 0 0 0' }}>{errors.title}</p>}	// 에러 메시지 텍스트
      </div>
      <div>	// 카테고리 선택 섹션
        <label htmlFor={categoryId} style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6, color: '#333' }}>카테고리</label>	// 카테고리 라벨
        <select	// 카테고리 드롭다운 셀렉트박스
          id={categoryId}	// 라벨 연결 ID
          value={category}	// 선택된 상태값
          onChange={(event) => setCategory(event.target.value)}	// 카테고리 변경 시 상태 업데이트
          style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14, boxSizing: 'border-box' }}
        >
          <option value="일반">일반</option>	// 옵션 1
          <option value="학습">학습</option>	// 옵션 2
          <option value="도구">도구</option>	// 옵션 3
          <option value="백엔드">백엔드</option>	// 옵션 4
        </select>
      </div>
      <div>	// 내용 입력 섹션
        <label htmlFor={contentId} style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6, color: '#333' }}>	// 내용 라벨
          내용 <span aria-hidden="true" style={{ color: '#dc2626' }}>*</span>	// 필수 표시 별표
        </label>
        <textarea	// 본문 여러 줄 입력창
          id={contentId}	// 라벨 연결 ID
          value={content}	// 제어 컴포넌트 본문 상태
          aria-required="true"	// 접근성 필수 속성
          aria-invalid={Boolean(errors.content)}	// 에러 여부
          aria-describedby={errors.content ? contentErrorId : undefined}	// 에러 텍스트 연결
          onChange={(event) => {	// 본문 입력 핸들러
            setContent(event.target.value)	// 내용 반영
            if (errors.content) setErrors((previous) => ({ ...previous, content: null }))	// 입력 시 에러 해제
          }}
          style={errors.content	// 에러 여부에 따른 스타일 분기
            ? { width: '100%', padding: '10px 12px', border: '1px solid #dc2626', borderRadius: 6, fontSize: 14, boxSizing: 'border-box', height: 120, resize: 'vertical' }
            : { width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14, boxSizing: 'border-box', height: 120, resize: 'vertical' }}
          placeholder="내용을 입력하세요"	// 힌트 텍스트
        />
        {errors.content && <p id={contentErrorId} role="alert" style={{ color: '#dc2626', fontSize: 13, margin: '4px 0 0 0' }}>{errors.content}</p>}	// 본문 에러 메시지
      </div>
      <div>	// 하단 전송 버튼 영역
        <button	// 제출 버튼
          type="submit"	// 폼 전송 타입
          disabled={submitting}	// 전송 중 중복 클릭 방지 비활성화
          style={submitting	// 전송 중 여부에 따른 스타일 분기
            ? { padding: '10px 28px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: 'not-allowed', opacity: 0.6 }
            : { padding: '10px 28px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
        >
          {submitting ? '저장 중…' : '저장'}	// 전송 상태 텍스트 분기
        </button>
      </div>
    </form>
  )
}
