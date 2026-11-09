/**
 * @file localDB.js
 * @description 브라우저의 localStorage를 활용하여 오프라인에서도 CRUD 기능을 온전히 학습할 수 있도록 지원하는 모의(Mock) 데이터베이스 모듈
 */

const KEY = 'b4-2-items'	// 로컬스토리지 저장 키 이름

function load() {	// 로컬스토리지에서 아이템 배열 읽어오기
  const raw = localStorage.getItem(KEY)	// 문자열 조회
  if (raw) try { return JSON.parse(raw) } catch {}	// JSON 파싱 성공 시 반환
  const seed = [	// 첫 실행 시 초기 시드 데이터 3건
    { id: '1', title: 'React 학습 노트', content: 'useState와 useEffect의 핵심 개념을 정리했습니다.', category: '학습', created_at: new Date(Date.now()-86400000*3).toISOString() },	// 3일 전 데이터
    { id: '2', title: 'Vite로 빠른 개발 환경 만들기', content: 'Vite는 번들링 없이 ESM을 사용해 매우 빠른 HMR을 제공합니다.', category: '도구', created_at: new Date(Date.now()-86400000*2).toISOString() },	// 2일 전 데이터
    { id: '3', title: 'Supabase 입문', content: 'Supabase는 오픈소스 Firebase 대안으로 PostgreSQL 기반의 BaaS입니다.', category: '백엔드', created_at: new Date(Date.now()-86400000).toISOString() },	// 1일 전 데이터
  ]
  localStorage.setItem(KEY, JSON.stringify(seed))	// 시드 데이터를 스토리지에 저장
  return seed	// 시드 데이터 반환
}

function save(items) { localStorage.setItem(KEY, JSON.stringify(items)) }	// 아이템 배열을 JSON 문자열로 저장
function delay(ms=300) { return new Promise(r => setTimeout(r, ms)) }	// 실제 서버 통신 느낌을 재현하기 위한 인위적 지연(300ms)

export const localDB = {	// 로컬스토리지 비동기 CRUD 인터페이스
  async selectAll() { await delay(); return load() },	// 0.3초 대기 후 전체 목록 반환
  async selectById(id) { await delay(); return load().find(i => String(i.id) === String(id)) || null },	// ID로 항목 검색
  async insert(data) {	// 새 아이템 등록
    await delay()	// 비동기 지연
    const items = load()	// 기존 목록 로드
    const newItem = { id: crypto.randomUUID(), ...data, created_at: new Date().toISOString() }	// 고유 UUID 및 생성일시 부여
    items.unshift(newItem); save(items); return newItem	// 목록 맨 앞에 추가 후 저장 및 반환
  },
  async update(id, data) {	// 아이템 수정
    await delay()	// 지연
    const items = load()	// 목록 로드
    const idx = items.findIndex(i => String(i.id) === String(id))	// 수정 대상 인덱스 찾기
    if (idx === -1) throw new Error('항목을 찾을 수 없습니다')	// 없으면 에러
    items[idx] = { ...items[idx], ...data }; save(items); return items[idx]	// 갱신 및 저장
  },
  async remove(id) {	// 아이템 삭제
    await delay()	// 지연
    const items = load()	// 목록 로드
    const filtered = items.filter(i => String(i.id) !== String(id))	// 대상 ID 제외 필터링
    if (filtered.length === items.length) throw new Error('항목을 찾을 수 없습니다')	// 삭제 대상이 없었으면 에러
    save(filtered); return true	// 저장 후 성공 반환
  },
}
