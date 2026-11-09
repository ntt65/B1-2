# 04. 백엔드(서버) 없이 DB와 로그인이 되는 원리 (BaaS & Supabase)

> **목표**: 별도의 Node.js나 Java 서버를 만들지 않았는데도, 어떻게 브라우저에서 회원가입이 되고 데이터가 영구 저장되는지 원리를 이해한다.

---

## 1. BaaS (Backend as a Service)란 뭔가요?

원래 웹 서비스를 만들려면 다음 3가지가 모두 필요합니다:
1. **프론트엔드 (React)**: 사용자가 보는 화면
2. **백엔드 서버 (Node.js/Spring)**: 로그인 검사, API 처리
3. **데이터베이스 (MySQL/PostgreSQL)**: 실제 데이터 저장소

하지만 **Supabase** 같은 **BaaS(서비스형 백엔드)**를 쓰면:
- 백엔드 서버를 직접 코딩하지 않아도, 클라우드 회사가 미리 만들어 둔 안전한 API를 프론트엔드(React)에서 직접 호출해서 쓸 수 있습니다.
- 우리 프로젝트는 React에서 바로 `supabaseClient.js`를 통해 Supabase 클라우드 데이터베이스에 직접 접근합니다.

---

## 2. 우리 프로젝트의 '이중 모드 (Dual Mode)' 설계

우리 프로젝트는 **인터넷 연결이 없거나 Supabase 키가 없어도 혼자서 동작**할 수 있도록 똑똑한 이중 모드로 만들어졌습니다:

```
                  ┌──────────────────────┐
                  │   src/lib/api.js     │
                  └──────────┬───────────┘
                             │
            [isLocalMode 여부 확인 (dataSource.js)]
                             │
            ┌────────────────┴────────────────┐
            ▼                                 ▼
   [오프라인 / 로컬 학습 모드]          [온라인 / 프로덕션 모드]
       src/lib/localDB.js               src/lib/supabaseClient.js
            │                                 │
     브라우저 내부 저장소               Supabase 클라우드 DB
      (LocalStorage)                     (PostgreSQL 서버)
```

- **상단 배지(`DataSourceBadge.jsx`)**: 현재 웹 화면 우측 상단에 `[로컬 학습 모드]`인지 `[Supabase 원격 모드]`인지 실시간으로 배지를 띄워줍니다.

---

## 3. 로그인과 권한 검사 (Auth & ProtectedRoute)

### ① 로그인 상태는 어디에 저장되나요?
- 사용자가 이메일/비밀번호로 로그인하면 Supabase가 안전한 인증 증명서(Access Token)를 발급합니다.
- `src/context/AuthContext.jsx`가 이 증명서를 받아서 **"지금 로그인된 유저는 누구인가?"**를 전역 상태로 보관합니다.

### ② 로그인 안 한 사람이 글쓰기 URL(`/items/new`)로 쳐들어오면?
`src/components/ProtectedRoute.jsx`가 문지기 역할을 합니다:

```jsx
// 1. 로그인되어 있나 확인
if (!user) {
  // 2. 아니네? 로그인 페이지로 쫓아내고, 로그인 성공 시 다시 여기로 돌아오도록 메모 남김!
  return <Navigate to="/login?redirect=/items/new" replace />;
}

// 3. 정상이면 글쓰기 화면 통과!
return children;
```

---

## 4. 데이터베이스 보안: RLS (Row Level Security)

"프론트엔드에서 데이터베이스에 직접 접속하면, 해커가 남의 글을 막 지울 수 있는 것 아닌가요?"

맞습니다! 그래서 데이터베이스 자체에 **경비 규칙(RLS)**을 걸어둡니다.  
우리 프로젝트의 `supabase/policies-authenticated-writes.sql` 파일에 적힌 규칙:

1. **조회(SELECT)**: 세상 모든 사람(로그인 안 한 사람도)이 볼 수 있음.
2. **등록/수정/삭제(INSERT, UPDATE, DELETE)**: 오직 **로그인된 회원(authenticated)**만 실행할 수 있음.

이렇게 데이터베이스 레벨에서 강력하게 막아두기 때문에 안전합니다.
