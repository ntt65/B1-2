# 02. 우리 프로젝트 지도와 실행 흐름 투어 (Project Tour)

> **목표**: 복잡해 보이는 수많은 파일 중 **어디서부터 시작해서 어떤 순서로 코드가 실행되는지** 한눈에 파악한다.

---

## 1. 애플리케이션 시작 지점 (진입 경로)

사용자가 브라우저 주소창에 우리 사이트 주소를 치고 들어왔을 때, 컴퓨터가 코드를 읽는 순서입니다:

```
1. index.html (유일한 HTML 뼈대 파일, <div id="root">가 있음)
      ↓
2. src/main.jsx (자바스크립트의 시작점! root에 React를 꽂아 넣음)
      ↓
3. src/App.jsx (주소별로 어떤 페이지를 보여줄지 결정하는 라우터)
      ↓
4. src/components/Layout.jsx (헤더 + 네비게이션 바 + 푸터 틀)
      ↓
5. src/pages/ItemListPage.jsx (처음 메인 화면에 뜨는 아이템 목록 페이지)
```

---

## 2. 폴더별 역할 분담 (부서별 업무 소개)

`src/` 폴더 안을 들여다보면 여러 폴더가 나뉘어 있습니다. 왜 이렇게 나눴을까요?

| 폴더명 | 비유 | 하는 일 | 대표 파일 |
| :--- | :--- | :--- | :--- |
| **`pages/`** | **완성된 방 (Room)** | 주소창 URL 하나당 매핑되는 **전체 화면**입니다. 부품들을 조립해 하나의 완전한 페이지를 만듭니다. | `ItemListPage.jsx` (목록 방)<br>`LoginPage.jsx` (로그인 방) |
| **`components/`** | **가구/소품 (Furniture)** | 여러 방에서 공통으로 가져다 쓸 수 있는 **작은 UI 부품**들입니다. | `ItemCard.jsx` (아이템 카드)<br>`ConfirmDialog.jsx` (삭제 팝업) |
| **`hooks/`** | **비즈니스 두뇌 (Brain)** | UI와 상관없이 "데이터를 가져오고, 계산하고, 상태를 관리하는 로직"만 쏙 빼놓은 곳입니다. | `useItems.js` (목록 가져오기 훅)<br>`useAuth.js` (로그인 정보 훅) |
| **`context/`** | **사내 공지판 (Broadcaster)** | 모든 컴포넌트가 다 같이 알아야 하는 **전역 정보**(예: "지금 로그인한 사람은 철수다")를 전파합니다. | `AuthContext.jsx` |
| **`lib/`** | **외부 연결선 (Cable/Tool)** | 데이터베이스(Supabase)나 브라우저 저장소(LocalStorage)와 직접 통신하는 도구 모음입니다. | `supabaseClient.js`<br>`localDB.js` |

---

## 3. 실제 동작 흐름 추적: "새 글 등록"을 눌렀을 때

사용자가 글을 등록할 때 우리 프로젝트 내부에서 어떤 일이 일어나는지 단계별로 추적해 봅시다:

```
[사용자]
   │
   ▼ 1. "새 아이템 등록" 버튼 클릭
[src/pages/ItemListPage.jsx]
   │
   ▼ 2. URL이 "/items/new"로 변경됨
[src/App.jsx] (라우터가 주소 감지)
   │
   ▼ 3. ProtectedRoute 통과 검사 (로그인되어 있나?)
[src/components/ProtectedRoute.jsx]
   │  ├─ 로그인 안 됨 ──▶ [src/pages/LoginPage.jsx]로 강제 이동
   │  └─ 로그인 완료  ──▶ 다음 단계 진행
   ▼
[src/pages/ItemNewPage.jsx]
   │
   ▼ 4. 입력 폼 렌더링
[src/components/ItemForm.jsx]
   │  사용자가 제목과 내용 입력 후 "저장" 클릭!
   │
   ▼ 5. useItems 커스텀 훅 호출
[src/hooks/useItems.js] (createItem 함수 실행)
   │
   ▼ 6. 데이터베이스로 전송
[src/lib/api.js] ──▶ [src/lib/supabaseClient.js] (Supabase 클라우드 DB에 INSERT)
   │
   ▼ 7. 성공 응답 도착!
[src/pages/ItemListPage.jsx]로 자동 이동 및 목록 재조회 ──▶ 화면에 새 글이 짠!
```

---

## 4. 왜 이렇게 역할을 쪼개서 만들었을까요?

만약 `ItemNewPage.jsx` 파일 하나에 화면 디자인, 로그인 검사, Supabase 통신 코드, 에러 처리를 1,000줄짜리로 다 때려 박았다면:
- 코드를 고치다가 어디가 고장 났는지 찾기 불가능합니다.
- 로그인 검사 코드를 다른 페이지에서도 똑같이 복사/붙여넣기 해야 합니다.

그래서 **"화면은 `pages`와 `components`에", "데이터 통신은 `lib`에", "중간 계산과 상태는 `hooks`에"** 깔끔하게 분리해 둔 것입니다.
