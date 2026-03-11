# 공지사항 및 알림관리 구현 계획

## 📋 Overview

Off The Screen 관리자 대시보드의 공지사항 및 알림관리 기능 구현 계획

### 참조 디자인

````carousel
![공지사항 목록](file:///Users/sanghyunyoun/.gemini/antigravity/brain/185c6770-ed1c-46ad-a991-8522089e4929/uploaded_image_0_1768972122310.png)
<!-- slide -->
![공지사항 등록 (캘린더)](file:///Users/sanghyunyoun/.gemini/antigravity/brain/185c6770-ed1c-46ad-a991-8522089e4929/uploaded_image_1_1768972122310.png)
<!-- slide -->
![공지사항 등록 폼](file:///Users/sanghyunyoun/.gemini/antigravity/brain/185c6770-ed1c-46ad-a991-8522089e4929/uploaded_image_2_1768972122310.png)
````

---

## 🎯 주요 기능

### 1. 공지사항 목록 (`/admin/notices`)
- 날짜 검색 (YYYY-MM-DD HH:mm 형식)
- **찾기** 버튼
- **새 공지사항 등록하기** 버튼
- 공지사항 리스트 (제목 + 등록날짜 + 수정하기 버튼)
- 페이지네이션 (1~10)

### 2. 공지사항 등록 (`/admin/notices/create`)
- 헤더: `< 새 공지사항 등록` + 저장하기 버튼
- **제목**: 텍스트 입력 (0/25 글자 제한)
- **기간**: 시작일 ~ 종료일 (Date Range Picker)
- **사진**: 사진첨부 버튼 *(UI만, 배포 시 file-service 연동)*
- **내용**: 텍스트 에디터
  - ✨ **임시 저장** 기능 (localStorage 활용)
  - 30초마다 자동 저장
  - 페이지 이탈 시 경고 표시
  - 임시 저장본 복원 가능

### 3. 공지사항 수정 (`/admin/notices/:id/edit`)
- 등록 폼과 동일한 구조
- 기존 데이터 프리필

---

## 🗄️ 백엔드 구현

### Prisma Schema 추가
```prisma
model Notice {
  id          String   @id @default(uuid())
  title       String
  content     String?  @db.Text
  imageUrl    String?
  startDate   DateTime
  endDate     DateTime
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### API 엔드포인트

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/admin/notices` | 공지사항 목록 (페이지네이션) |
| GET | `/api/admin/notices/:id` | 공지사항 상세 |
| POST | `/api/admin/notices` | 공지사항 생성 |
| PUT | `/api/admin/notices/:id` | 공지사항 수정 |
| DELETE | `/api/admin/notices/:id` | 공지사항 삭제 |

---

## 📁 파일 구조

```
Off_sol/src/admin/
├── pages/
│   ├── NoticeList.tsx           # [NEW] 공지사항 목록
│   ├── NoticeCreate.tsx         # [NEW] 공지사항 등록
│   └── NoticeEdit.tsx           # [NEW] 공지사항 수정
├── components/
│   ├── NoticeItem.tsx           # [NEW] 목록 아이템
│   ├── DateRangePicker.tsx      # [NEW] 날짜 범위 선택기
│   └── TextEditor.tsx           # [NEW] 텍스트 에디터 (임시저장 포함)
├── hooks/
│   └── useAutoDraft.ts          # [NEW] 임시 저장 훅

off-service/src/admin/
├── dto/
│   └── notice.dto.ts            # [NEW] 공지사항 DTO
└── admin.service.ts             # [MODIFY] 공지사항 CRUD 추가
```

### useAutoDraft 훅 동작
```typescript
const { draft, saveDraft, clearDraft, hasDraft } = useAutoDraft('notice-create');

// 30초마다 자동 저장
useEffect(() => {
  const interval = setInterval(() => saveDraft(formData), 30000);
  return () => clearInterval(interval);
}, [formData]);

// 페이지 이탈 시 경고
useEffect(() => {
  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    if (isDirty) {
      e.preventDefault();
      saveDraft(formData);
    }
  };
  window.addEventListener('beforeunload', handleBeforeUnload);
  return () => window.removeEventListener('beforeunload', handleBeforeUnload);
}, [isDirty]);
```

---

## 🔧 구현 단계

### Phase 1: 백엔드
- [ ] Prisma Schema에 Notice 모델 추가
- [ ] 마이그레이션 실행
- [ ] notice.dto.ts 생성
- [ ] AdminService에 공지사항 CRUD 메서드 추가
- [ ] AdminController에 공지사항 API 엔드포인트 추가

### Phase 2: 프론트엔드 (공지사항 목록)
- [ ] NoticeList.tsx 생성
- [ ] NoticeItem.tsx 생성 (제목, 날짜, 수정버튼)
- [ ] 날짜 검색 기능 구현
- [ ] 페이지네이션 적용
- [ ] 라우팅 추가 (`/admin/notices`)

### Phase 3: 프론트엔드 (공지사항 등록/수정)
- [ ] DateRangePicker.tsx 생성
- [ ] NoticeCreate.tsx 생성
- [ ] NoticeEdit.tsx 생성
- [ ] API 연동

---

## 🎨 디자인 스펙

### 공지사항 아이템
```
┌─────────────────────────────────────────────────────────────┐
│ 공지내용                                        ┌──────────┐│
│ 등록날짜                                        │ 수정하기 ││
│                                                 └──────────┘│
└─────────────────────────────────────────────────────────────┘
```

### 폼 필드
| 필드 | 타입 | 유효성 검사 |
|------|------|------------|
| 제목 | text | 필수, 최대 25자 |
| 기간 | date range | 필수, 시작일 ≤ 종료일 |
| 사진 | file | 선택 |
| 내용 | textarea | 선택 |

### Date Range Picker
- 캘린더 UI (월간 뷰)
- 시작일/종료일 선택
- 확인 버튼으로 적용

---

## ⏱️ 예상 소요 시간

| Phase | 예상 시간 |
|-------|-----------|
| Phase 1 (Backend) | 1.5시간 |
| Phase 2 (List) | 1시간 |
| Phase 3 (Create/Edit) | 1.5시간 |
| **Total** | **~4시간** |

---

## 🚀 다음 단계

1. 이 계획 승인 후 Phase 1 (백엔드) 시작
2. 각 Phase 완료 시 테스트
3. 사진첨부는 file-service 연동 후 구현 (현재 UI만)
