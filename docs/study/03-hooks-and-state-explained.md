# 03. 훅(Hooks)과 비동기 화면 처리 — 왜 화면이 안 멈추고 부드러울까?

> **목표**: 리액트 코드에서 가장 많이 보이는 `use...`로 시작하는 함수들이 무엇이고, 인터넷 통신 중에도 화면이 왜 안 멈추는지 이해한다.

---

## 1. 훅(Hook)이 대체 뭔가요?

리액트에서 이름이 `use`로 시작하는 특별한 함수들을 **훅(Hook)**이라고 부릅니다.
- **비유**: 낚싯바늘(Hook)을 리액트 내부 핵심 기능에 걸어서 **"필요한 특수 능력(기억력, 자동 감시 등)을 빌려오는 도구"**입니다.

---

## 2. 우리 프로젝트에서 쓰이는 3대 내장 훅

### ① `useState` (기억 상자)
컴포넌트가 기억해야 할 데이터가 있을 때 씁니다.

```jsx
// [현재 기억된 값, 값을 바꾸는 전용 리모컨] = useState(초깃값);
const [count, setCount] = useState(0);

// 버튼을 누를 때마다 setCount(1), setCount(2)... 로 값을 바꿉니다.
// 중요한 점: setCount로 값을 바꾸면 리액트가 화면을 자동으로 새로 고쳐 그립니다!
```

---

### ② `useEffect` (화면이 켜질 때 자동으로 일하는 알바생)
"화면이 처음 딱 떴을 때 서버에서 데이터를 한 번 가져와줘!" 할 때 씁니다.

```jsx
useEffect(() => {
  // 컴포넌트가 화면에 나타날 때 딱 1번 실행되는 코드
  console.log("화면이 열렸습니다! 서버에서 아이템 목록을 가져옵니다.");
  fetchItemsFromServer();
}, []); // <- 뒤에 빈 배열 []을 붙이면 "처음 켜질 때 1번만 실행"이라는 뜻!
```

---

### ③ `useMemo` (암기왕, 똑똑한 계산기)
데이터가 1,000개 있을 때, 사용자가 글자를 하나 칠 때마다 1,000개를 매번 처음부터 다시 세면 컴퓨터가 버벅거립니다.

```jsx
// 아이템 목록(items)이나 선택된 카테고리(category)가 바뀔 때만 다시 계산하고,
// 평소에는 지난번에 계산해 둔 결과를 그대로 재사용(메모이제이션)합니다.
const filteredItems = useMemo(() => {
  return items.filter(item => item.category === selectedCategory);
}, [items, selectedCategory]);
```

---

## 3. 커스텀 훅 (Custom Hook): 개발자가 직접 만든 특수 훅

우리 프로젝트의 `src/hooks/` 폴더를 보면 `useItems.js`, `useItem.js`, `useAuth.js` 같은 파일이 있습니다.

- **왜 만들었을까요?**  
  컴포넌트 안에 `useState`와 `useEffect`, Supabase 호출 코드를 길게 늘어놓으면 화면 디자인 코드가 가려집니다.
- **해결책**:  
  "데이터 가져오는 로직만 묶어서 `useItems()`라는 나만의 마법 주문으로 만들자!"

```jsx
// ItemListPage.jsx (화면 컴포넌트)
export default function ItemListPage() {
  // 복잡한 비동기 통신과 상태 관리가 단 한 줄로 끝납니다!
  const { items, loading, error, deleteItem } = useItems();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorBanner message={error} />;

  return (
    <div>
      {items.map(item => <ItemCard key={item.id} item={item} onDelete={deleteItem} />)}
    </div>
  );
}
```

---

## 4. 비동기 4대 상태와 StateView (사용자 경험의 핵심)

인터넷으로 서버와 데이터를 주고받을 때는 0.5초~2초의 딜레이가 발생합니다.  
이때 사용자가 답답해하지 않도록 화면은 반드시 **4가지 상태**를 순서대로 보여주어야 합니다:

```
[1. 로딩 상태 (Loading)]
  "서버에서 데이터를 긁어오는 중..." ──▶ <LoadingSpinner /> (빙글빙글 도는 바퀴)
         │
         ├──▶ 성공했는데 데이터가 0개임 ──▶ [2. 빈 상태 (Empty)] <EmptyState message="등록된 글이 없습니다" />
         │
         ├──▶ 성공했고 데이터가 5개 있음 ──▶ [3. 성공 상태 (Success)] <ItemCard> 5개 나열
         │
         └──▶ 인터넷 끊김 or 서버 오류  ──▶ [4. 에러 상태 (Error)] <ErrorBanner message="서버 통신 실패" />
```

우리 프로젝트의 `src/components/StateView.jsx`는 바로 이 4가지 상태 전환을 한곳에서 안전하게 처리해 주는 부품입니다.
