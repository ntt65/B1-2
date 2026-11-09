/**
 * @file api.js
 * @description 데이터베이스 CRUD 연산의 단일 진입점. 현재 모드(Supabase 원격 vs LocalDB)에 따라 적절한 백엔드로 요청을 위임
 */

import { supabase, isSupabaseConfigured, isLocalMode } from './supabaseClient'	// Supabase 클라이언트 및 모드 확인 변수 임포트
import { localDB } from './localDB'	// 오프라인 브라우저 로컬 저장소 모듈 임포트

const TABLE = 'items'	// Supabase 테이블명 상수

function requireDataSource() {	// 현재 유효한 데이터 소스를 확인하는 헬퍼 함수
  if (isSupabaseConfigured) return 'supabase'	// Supabase 키가 존재하면 원격 모드
  if (isLocalMode) return 'local'	// 로컬 모드 플래그 활성화 시 로컬스토리지 모드
  throw new Error('Supabase 설정이 없습니다. 배포 환경변수를 확인하세요.')	// 둘 다 없으면 에러 발생
}

async function requireWriteAccess() {	// 쓰기/수정/삭제 시 로그인 권한을 확인하는 헬퍼 함수
  const source = requireDataSource()	// 현재 데이터 소스 확인
  if (source === 'local') return source	// 로컬 학습 모드는 비로그인 쓰기 허용

  const { data, error } = await supabase.auth.getSession()	// 원격 모드인 경우 Supabase 세션 조회
  if (error) throw error	// 세션 조회 오류 시 예외 던짐
  if (!data.session?.user) throw new Error('로그인이 필요한 기능입니다.')	// 미로그인 시 쓰기 차단
  return source	// 검증 통과 시 소스 반환
}

export const db = {	// 공통 CRUD API 객체
  async selectAll() {	// 전체 아이템 목록 조회
    if (requireDataSource() === 'supabase') {	// Supabase 모드인 경우
      const { data, error } = await supabase.from(TABLE).select('*').order('created_at', { ascending: false })	// 최신순 조회
      if (error) throw error	// 에러 처리
      return data	// 목록 반환
    }
    return localDB.selectAll()	// LocalDB에서 조회하여 반환
  },

  async selectById(id) {	// 단일 아이템 상세 조회
    if (requireDataSource() === 'supabase') {	// Supabase 모드인 경우
      const { data, error } = await supabase.from(TABLE).select('*').eq('id', id).maybeSingle()	// ID 일치 행 단일 조회
      if (error) throw error	// 에러 처리
      return data	// 아이템 객체 반환
    }
    return localDB.selectById(id)	// LocalDB에서 ID로 조회
  },

  async insert(data) {	// 새 아이템 등록
    if (await requireWriteAccess() === 'supabase') {	// 권한 검사 통과 및 Supabase 모드인 경우
      const { data: row, error } = await supabase.from(TABLE).insert(data).select().single()	// DB에 삽입 후 생성된 레코드 반환
      if (error) throw error	// 에러 처리
      return row	// 생성된 행 반환
    }
    return localDB.insert(data)	// LocalDB에 저장
  },

  async update(id, data) {	// 기존 아이템 수정
    if (await requireWriteAccess() === 'supabase') {	// 권한 검사 통과 및 Supabase 모드인 경우
      const { data: row, error } = await supabase.from(TABLE).update(data).eq('id', id).select().maybeSingle()	// DB 업데이트
      if (error) throw error	// 에러 처리
      if (!row) throw new Error('항목을 찾을 수 없습니다')	// 없는 항목일 때 예외 처리
      return row	// 수정된 행 반환
    }
    return localDB.update(id, data)	// LocalDB에서 업데이트
  },

  async remove(id) {	// 아이템 삭제
    if (await requireWriteAccess() === 'supabase') {	// 권한 검사 통과 및 Supabase 모드인 경우
      const { data: row, error } = await supabase.from(TABLE).delete().eq('id', id).select('id').maybeSingle()	// DB 삭제
      if (error) throw error	// 에러 처리
      if (!row) throw new Error('항목을 찾을 수 없습니다')	// 없는 항목 예외 처리
      return true	// 삭제 성공
    }
    return localDB.remove(id)	// LocalDB에서 삭제
  },
}
