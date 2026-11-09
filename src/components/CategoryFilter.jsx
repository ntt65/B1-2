/**
 * @file CategoryFilter.jsx
 * @description 아이템 목록을 분류별(전체, 일반, 학습, 도구, 백엔드)로 필터링하는 드롭다운 셀렉트 컴포넌트
 */

const CATEGORIES = ['전체', '일반', '학습', '도구', '백엔드']	// 지원하는 고정 카테고리 목록 상수

export default function CategoryFilter({ value, onChange, counts = {} }) {	// 현재값, 변경핸들러, 카테고리별 개수 props
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>	// 필터 가로 배치 컨테이너
      <label htmlFor="category-filter" style={{ fontSize: 14, fontWeight: 600 }}>카테고리</label>	// 접근성 라벨
      <select	// 카테고리 선택 드롭다운
        id="category-filter"	// 라벨 htmlFor와 매핑되는 ID
        value={value}	// 현재 선택된 카테고리 값 바인딩
        onChange={(event) => onChange(event.target.value)}	// 선택 변경 시 부모 컴포넌트에 통보
        style={{ padding: '7px 10px', border: '1px solid #d1d5db', borderRadius: 6, background: '#fff' }}
      >
        {CATEGORIES.map((category) => (	// 카테고리 배열 순회 렌더링
          <option key={category} value={category}>	// 각 카테고리 옵션 항목
            {category} ({counts[category] || 0})	// 카테고리명과 해당 아이템 건수 표시
          </option>
        ))}
      </select>
    </div>
  )
}
