/**
 * @file DataSourceBadge.jsx
 * @description 현재 앱이 데이터를 읽고 쓰는 위치(Supabase 원격 DB vs LocalStorage 학습 모드)를 시각적으로 표시하는 상태 배지
 */

import { dataSource } from '../lib/supabaseClient'	// 현재 감지된 데이터 소스 모드 가져오기

const BADGES = {	// 모드별 레이블 및 테마 색상 정의 상수
  supabase: { label: 'Supabase 원격', color: '#166534', background: '#dcfce7' },	// 원격 클라우드 DB 모드 (초록색)
  local: { label: 'LocalStorage 학습', color: '#92400e', background: '#fef3c7' },	// 로컬 브라우저 저장소 모드 (노란색)
  missing: { label: '데이터 설정 필요', color: '#991b1b', background: '#fee2e2' },	// 환경변수 누락 오류 모드 (빨간색)
}

export default function DataSourceBadge({ source = dataSource }) {	// 현재 소스 모드 수신
  const badge = BADGES[source] || BADGES.missing	// 모드에 맞는 배지 스타일 선택

  return (
    <span	// 둥근 알약 모양 뱃지 요소
      title="현재 데이터를 저장하는 위치"	// 툴팁 설명
      style={{
        padding: '4px 8px',	// 내부 여백
        borderRadius: 999,	// 완전한 둥근 모서리
        color: badge.color,	// 글자 색상
        background: badge.background,	// 배경 색상
        fontSize: 12,	// 작은 글꼴 크기
        fontWeight: 600,	// 굵은 글씨체
        whiteSpace: 'nowrap',	// 줄바꿈 방지
      }}
    >
      {badge.label}	// 배지 텍스트 출력
    </span>
  )
}
