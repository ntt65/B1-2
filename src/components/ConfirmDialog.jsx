/**
 * @file ConfirmDialog.jsx
 * @description 삭제 등 중요 작업 전 사용자 확인을 받는 모달 대화상자. ESC 키 닫기 및 포커스 트랩 접근성 지원
 */

import { useEffect, useId, useRef } from 'react'	// 생명주기, 고유 ID, DOM 참조 제어 훅 임포트

export default function ConfirmDialog({	// 모달 컴포넌트 정의
  open,	// 모달 열림 여부 boolean
  message,	// 안내 메시지 문자열
  onConfirm,	// 확인(삭제) 실행 콜백
  onCancel,	// 취소 콜백
  busy = false,	// 처리 중 여부 (중복 클릭 방지)
  error = null,	// 삭제 실패 시 에러 메시지
}) {
  const messageId = useId()	// 접근성 라벨 연결용 고유 ID 생성
  const cancelButtonRef = useRef(null)	// 취소 버튼 포커스 제어용 ref

  useEffect(() => {	// 모달이 열릴 때 자동 포커스 처리
    if (open) cancelButtonRef.current?.focus()	// 안전을 위해 기본 포커스를 취소 버튼으로 이동
  }, [open])	// open 상태 변경 시 실행

  useEffect(() => {	// 키보드 이벤트(ESC) 감지 훅
    if (!open) return undefined	// 닫혀있을 때는 리스너 등록 안 함

    const closeWithEscape = (event) => {	// ESC 키 입력 핸들러
      if (event.key === 'Escape' && !busy) onCancel()	// 처리 중이 아닐 때 ESC 누르면 닫기
    }
    document.addEventListener('keydown', closeWithEscape)	// 전역 키다운 이벤트 등록
    return () => document.removeEventListener('keydown', closeWithEscape)	// 모달 언마운트/닫힐 때 이벤트 해제
  }, [busy, onCancel, open])	// 의존성 배열

  if (!open) return null	// open이 false면 렌더링하지 않음

  const cancel = () => {	// 취소 핸들러
    if (!busy) onCancel()	// 작업 진행 중이 아닐 때만 취소 실행
  }

  return (
    <div	// 모달 뒷배경 오버레이 (딤드 처리)
      role="presentation"	// 보조 기술에 단순 프레젠테이션 요소로 전달
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
      onMouseDown={(event) => {	// 배경 클릭 시 닫기
        if (event.target === event.currentTarget) cancel()	// 오버레이 직접 클릭 시 취소
      }}
    >
      <div	// 모달 본체 대화상자
        role="alertdialog"	// 스크린 리더용 경고 대화상자 역할 명시
        aria-modal="true"	// 모달 배경과 분리된 모달 상태임을 선언
        aria-labelledby={messageId}	// 메시지 내용과 제목 연결
        aria-busy={busy}	// 작업 진행 중 상태 알림
        style={{ background: '#fff', borderRadius: 10, padding: '24px 28px', minWidth: 320, maxWidth: 400, boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}
      >
        <p id={messageId} style={{ fontSize: 15, color: '#333', margin: '0 0 20px 0' }}>{message}</p>	// 확인 질문 문구
        {error && <p role="alert" style={{ color: '#b91c1c', fontSize: 13, margin: '0 0 16px 0' }}>{error}</p>}	// 에러 발생 시 안내
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>	// 하단 액션 버튼 그룹
          <button	// 취소 버튼
            ref={cancelButtonRef}	// 모달 열림 시 포커스 대상
            type="button"	// 버튼 타입
            disabled={busy}	// 처리 중 비활성화
            onClick={cancel}	// 취소 실행
            style={{ padding: '8px 18px', border: '1px solid #d1d5db', borderRadius: 6, background: '#fff', color: '#555', cursor: busy ? 'not-allowed' : 'pointer', fontSize: 14 }}
          >
            취소	// 버튼 라벨
          </button>
          <button	// 확인/삭제 버튼
            type="button"	// 버튼 타입
            disabled={busy}	// 처리 중 비활성화
            onClick={onConfirm}	// 삭제 확정 실행
            style={{ padding: '8px 18px', border: 'none', borderRadius: 6, background: '#dc2626', color: '#fff', cursor: busy ? 'not-allowed' : 'pointer', fontSize: 14, fontWeight: 600, opacity: busy ? 0.65 : 1 }}
          >
            {busy ? '삭제 중…' : '삭제'}	// 진행 상태 텍스트 분기
          </button>
        </div>
      </div>
    </div>
  )
}
