/**
 * @file supabaseClient.js
 * @description Supabase SDK 초기화 및 현재 앱의 데이터 소스 모드(supabase vs local vs missing) 상태 플래그 내보내기
 */

import { createClient } from '@supabase/supabase-js'	// Supabase 공식 JavaScript SDK 임포트
import { resolveDataSource } from './dataSource'	// 데이터 소스 모드 결정 함수 임포트

const url = import.meta.env.VITE_SUPABASE_URL	// Vite 환경변수에서 Supabase 프로젝트 URL 추출
const key = import.meta.env.VITE_SUPABASE_ANON_KEY	// Vite 환경변수에서 Supabase 공개 Anon Key 추출

export const dataSource = resolveDataSource({	// 현재 환경변수에 따른 데이터 소스 판별
  url,	// 프로젝트 URL 전달
  key,	// 공개 키 전달
  allowLocalDB: import.meta.env.VITE_ALLOW_LOCAL_DB,	// 로컬DB 허용 환경변수 전달
})

export const isSupabaseConfigured = dataSource === 'supabase'	// Supabase 정상 연결 모드 플래그
export const isLocalMode = dataSource === 'local'	// 오프라인 로컬스토리지 모드 플래그
export const supabase = isSupabaseConfigured ? createClient(url, key) : null	// 설정 완료 시 클라이언트 생성, 미설정 시 null
