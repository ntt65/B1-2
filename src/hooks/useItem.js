/**
 * @file useItem.js
 * @description 특정 ID의 단일 아이템 조회, 수정, 삭제 비즈니스 로직과 비동기 상태(loading, error, mutationError)를 관리하는 커스텀 훅
 */

import { useState, useEffect, useCallback } from 'react'	// 상태 관리 및 함수 메모이제이션 훅 임포트
import { db } from '../lib/api'	// 온/오프라인 통합 데이터베이스 API 클라이언트 임포트

export function useItem(id) {	// 대상 아이템 ID를 인자로 받는 훅 정의
  const [item, setItem] = useState(null)	// 단일 아이템 데이터 상태
  const [loading, setLoading] = useState(true)	// 조회 로딩 중 상태
  const [error, setError] = useState(null)	// 조회 오류 메시지
  const [mutationError, setMutationError] = useState(null)	// 수정/삭제 시 발생한 오류 메시지

  const fetchItem = useCallback(async () => {	// 단일 아이템 조회 비동기 함수
    setLoading(true)	// 로딩 시작
    setError(null)	// 이전 에러 초기화
    try {
      setItem(await db.selectById(id))	// DB에서 ID로 단일 행 조회
    } catch (requestError) {
      setError(requestError.message || '데이터를 불러오지 못했습니다')	// 실패 시 에러 설정
    } finally {
      setLoading(false)	// 로딩 종료
    }
  }, [id])	// ID 변경 시에만 함수 재생성

  const updateItem = useCallback(async (formData) => {	// 아이템 정보 수정 함수
    setMutationError(null)	// 변경 에러 초기화
    try {
      const updated = await db.update(id, formData)	// DB에 수정 요청
      setItem(updated)	// 로컬 아이템 상태 즉시 갱신
      return updated	// 수정된 객체 반환
    } catch (requestError) {
      setMutationError(requestError.message || '수정에 실패했습니다')	// 실패 시 에러 저장
      return null	// 실패 반환
    }
  }, [id])	// ID 바뀔 때만 재생성

  const deleteItem = useCallback(async () => {	// 아이템 삭제 함수
    setMutationError(null)	// 에러 초기화
    try {
      await db.remove(id)	// DB에 삭제 요청
      return true	// 삭제 성공
    } catch (requestError) {
      setMutationError(requestError.message || '삭제에 실패했습니다')	// 에러 메시지 설정
      return false	// 삭제 실패
    }
  }, [id])

  const clearMutationError = useCallback(() => setMutationError(null), [])	// 에러 메시지 수동 초기화 함수

  useEffect(() => {	// ID 존재 시 데이터 자동 패칭
    if (id) fetchItem()	// 아이템 조회 실행
  }, [id, fetchItem])	// ID나 패칭 함수 변경 시 실행

  return {	// 컴포넌트에 노출할 상태와 제어 함수 묶음 반환
    item,	// 현재 아이템 데이터
    loading,	// 조회 진행 중 여부
    error,	// 조회 실패 에러
    mutationError,	// 수정/삭제 실패 에러
    refetch: fetchItem,	// 수동 다시 불러오기 함수
    updateItem,	// 수정 함수
    deleteItem,	// 삭제 함수
    clearMutationError,	// 에러 제거 함수
  }
}
