/**
 * @file useItems.js
 * @description 아이템 전체 목록 조회, 새 아이템 생성, 목록 내 아이템 삭제 로직과 비동기 상태를 총괄 관리하는 커스텀 훅
 */

import { useState, useEffect, useCallback } from 'react'	// 상태 관리 및 생명주기 훅 임포트
import { db } from '../lib/api'	// 데이터베이스 통합 API 클라이언트 임포트

export function useItems() {	// 아이템 목록 관리 훅 정의
  const [items, setItems] = useState(null)	// 아이템 배열 데이터 상태
  const [loading, setLoading] = useState(true)	// 목록 로딩 중 여부
  const [error, setError] = useState(null)	// 목록 조회 에러 메시지
  const [mutationError, setMutationError] = useState(null)	// 추가/삭제 시 발생한 에러

  const fetchItems = useCallback(async () => {	// 전체 목록 조회 비동기 함수
    setLoading(true)	// 로딩 시작
    setError(null)	// 에러 초기화
    try {
      setItems(await db.selectAll())	// DB에서 전체 목록 조회하여 상태에 저장
    } catch (requestError) {
      setError(requestError.message || '데이터를 불러오지 못했습니다')	// 실패 처리
    } finally {
      setLoading(false)	// 로딩 종료
    }
  }, [])	// 컴포넌트 마운트 시 한 번만 생성

  const addItem = useCallback(async (formData) => {	// 새 아이템 등록 함수
    setMutationError(null)	// 에러 초기화
    try {
      const created = await db.insert(formData)	// DB에 삽입 요청
      setItems((previous) => previous ? [created, ...previous] : [created])	// 목록 맨 앞에 새 아이템 즉시 추가 (낙관적/로컬 반영)
      return created	// 생성된 객체 반환
    } catch (requestError) {
      setMutationError(requestError.message || '등록에 실패했습니다')	// 에러 메시지 설정
      return null	// 실패 반환
    }
  }, [])

  const deleteItem = useCallback(async (id) => {	// 아이템 삭제 함수
    setMutationError(null)	// 에러 초기화
    try {
      await db.remove(id)	// DB에서 해당 ID 제거 요청
      setItems((previous) => previous	// 로컬 목록 상태에서 삭제된 항목 필터링 제거
        ? previous.filter((item) => String(item.id) !== String(id))	// ID 불일치 항목만 유지
        : previous)
      return true	// 성공 반환
    } catch (requestError) {
      setMutationError(requestError.message || '삭제에 실패했습니다')	// 실패 메시지 설정
      return false	// 실패 반환
    }
  }, [])

  const clearMutationError = useCallback(() => setMutationError(null), [])	// 변경 에러 수동 초기화

  useEffect(() => {	// 훅 마운트 시 자동으로 첫 목록 불러오기
    fetchItems()	// 목록 조회 실행
  }, [fetchItems])	// 의존성 배열

  return {	// 훅의 반환 객체
    items,	// 아이템 배열
    loading,	// 로딩 상태
    error,	// 조회 에러
    mutationError,	// 추가/삭제 에러
    refetch: fetchItems,	// 목록 재조회 함수
    addItem,	// 등록 함수
    deleteItem,	// 삭제 함수
    clearMutationError,	// 에러 클리어 함수
  }
}
