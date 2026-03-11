# Admin Dashboard & Content Registration Implementation Plan

## 📋 Overview

Off The Screen 관리자 대시보드 및 콘텐츠 등록 시스템 구현 계획

### 참조 디자인

````carousel
![Admin Login](file:///Users/sanghyunyoun/.gemini/antigravity/brain/185c6770-ed1c-46ad-a991-8522089e4929/uploaded_image_0_1768961936736.png)
<!-- slide -->
![Admin Dashboard - Content List](file:///Users/sanghyunyoun/.gemini/antigravity/brain/185c6770-ed1c-46ad-a991-8522089e4929/uploaded_image_1_1768961936736.png)
<!-- slide -->
![Content Create Page](file:///Users/sanghyunyoun/.gemini/antigravity/brain/185c6770-ed1c-46ad-a991-8522089e4929/uploaded_image_0_1768962308698.png)
<!-- slide -->
![Content Edit Page](file:///Users/sanghyunyoun/.gemini/antigravity/brain/185c6770-ed1c-46ad-a991-8522089e4929/uploaded_image_1_1768962308698.png)
````

---

## 🎯 주요 기능

> [!IMPORTANT]
> **1차 구현 범위:**
> - ✅ 콘텐츠 등록 (CRUD 풀 기능)
> - 🔲 통계, 콘텐츠 상세 페이지 등록, 공지사항, 문의내역 → **UI만**

### 1. Admin 로그인 페이지 (`/admin`)
- OFF THE SCREEN 로고
- ID / Password 입력 필드
- 비밀번호 표시/숨김 토글
- Sign in 버튼
- 관리자 전용 인증

### 2. Admin 대시보드 Layout
- **좌측 사이드바 메뉴:**
  - 📊 통계 *(UI만)*
  - 📁 **콘텐츠 등록** *(풀 기능)*
  - 📄 콘텐츠 상세 페이지 등록 *(UI만)*
  - 📢 공지사항 및 알림관리 *(UI만)*
  - 💬 문의내역 관리 *(UI만)*
- **우측 상단:** 사용자 ID + 로그아웃 버튼

### 3. 콘텐츠 등록 목록 (`/admin/contents`)
- 검색바 + 찾기 버튼
- **추가하기** 버튼 → `/admin/contents/create`
- 콘텐츠 카드 그리드 (4열)
  - 날짜 표시 (26.04.02)
  - **수정하기** 버튼 → `/admin/contents/:id/edit`
  - 썸네일 이미지
  - 콘텐츠 제목
- 페이지네이션 (1~10)

### 4. 콘텐츠 추가하기 (`/admin/contents/create`)
- 헤더: `< 콘텐츠 추가하기` + 저장하기 버튼
- **Country 선택:** ALL, 🇰🇷 한국, 🇺🇸 미국, 🇨🇳 중국, 🇯🇵 일본
- **Content Type 선택:** 
  - 🎬 Drama & Film
  - 📺 Reality & Show
  - 🎥 Documentary
  - ✈️ Travel & Lifestyle
- **Experience 선택:**
  - 🍽 Food, 🎨 Culture, 🌿 Nature, 🎭 Culture, 🚶 Street, 🏙 Landmark
- **Picture 섹션:** 사진첨부 버튼으로 이미지 업로드

### 5. 콘텐츠 수정하기 (`/admin/contents/:id/edit`)
- 헤더: `< [콘텐츠명] 수정하기` + 저장하기 버튼
- 기존 데이터 프리필
- 추가하기와 동일한 폼 구조

---

## �️ 백엔드 구현

### 현재 Prisma Schema (Content 모델) ✅
```prisma
model Content {
  id           String   @id @default(uuid())
  title        String                    # 콘텐츠 제목
  description  String?                   # 설명
  type         String                    # Drama, Reality, Documentary, Travel
  country      String                    # KR, US, CN, JP, ALL
  category     String   @default("[]")   # Experience 배열 JSON
  thumbnailUrl String?                   # 썸네일 이미지
  trending     String?                   # Hot, Popular, New
  viewCount    Int      @default(0)
  isActive     Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  locations    Location[]
}
```

> [!NOTE]
> 현재 스키마로 충분합니다. `category` 필드는 JSON 문자열로 Experience 배열을 저장합니다.

### 백엔드 파일 구조

```
off-service/src/
├── admin/                          # [NEW] Admin 모듈
│   ├── admin.module.ts
│   ├── admin.controller.ts         # Admin 전용 API
│   ├── admin.service.ts
│   └── dto/
│       ├── admin-login.dto.ts
│       └── create-content.dto.ts
├── auth/
│   └── guards/
│       └── admin.guard.ts          # [NEW] Admin 권한 체크
└── upload/                         # [NEW] 이미지 업로드
    ├── upload.module.ts
    ├── upload.controller.ts
    └── upload.service.ts
```

### 백엔드 API 엔드포인트

| Method | Endpoint | 설명 | 권한 |
|--------|----------|------|------|
| POST | `/api/admin/login` | Admin 로그인 | Public |
| GET | `/api/admin/contents` | 콘텐츠 목록 (페이지네이션) | Admin |
| GET | `/api/admin/contents/:id` | 콘텐츠 상세 | Admin |
| POST | `/api/admin/contents` | 콘텐츠 생성 | Admin |
| PUT | `/api/admin/contents/:id` | 콘텐츠 수정 | Admin |
| DELETE | `/api/admin/contents/:id` | 콘텐츠 삭제 | Admin |
| POST | `/api/upload/image` | 이미지 업로드 | Admin |

### Admin Guard 구현
```typescript
// Admin Guard - role: 'ADMIN' 체크
@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    return request.user?.role === 'ADMIN';
  }
}
```

### 📁 파일 업로드 (Phase 2 - 배포 후 연동)

> [!IMPORTANT]
> **1차 구현**: 사진첨부 버튼 UI만 구현 (파일 선택 → 미리보기 표시)
> **2차 구현 (배포 후)**: `래퍼런스/file-service` 연동

#### 1차 구현 (현재)
```typescript
// ImageUploader.tsx - UI만 구현
const [preview, setPreview] = useState<string | null>(null);

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    setPreview(URL.createObjectURL(file));
    // TODO: 배포 후 file-service 연동
  }
};
```

#### 2차 구현 (배포 후)
- `래퍼런스/file-service` 사용 (포트 3002)
- `POST /files/upload` → 파일 업로드
- `thumbnailUrl`에 반환된 URL 저장

---

## �📁 프론트엔드 파일 구조

```
Off_sol/src/
├── admin/                          # [NEW] Admin 전용 폴더
│   ├── AdminApp.tsx                # Admin 라우터
│   ├── components/
│   │   ├── AdminLayout.tsx         # 사이드바 + 헤더 레이아웃
│   │   ├── AdminSidebar.tsx        # 좌측 사이드바
│   │   ├── AdminHeader.tsx         # 상단 헤더
│   │   ├── ContentCard.tsx         # 콘텐츠 카드 컴포넌트
│   │   ├── ContentForm.tsx         # 콘텐츠 추가/수정 폼 (공통)
│   │   ├── CountrySelector.tsx     # 국가 선택 컴포넌트
│   │   ├── ChipSelector.tsx        # Content Type/Experience 칩 선택
│   │   ├── ImageUploader.tsx       # 이미지 업로드 컴포넌트
│   │   └── Pagination.tsx          # 페이지네이션
│   └── pages/
│       ├── AdminLogin.tsx          # 로그인 페이지
│       ├── ContentList.tsx         # 콘텐츠 등록 목록
│       ├── ContentCreate.tsx       # 콘텐츠 추가
│       ├── ContentEdit.tsx         # 콘텐츠 수정
│       └── Statistics.tsx          # 통계 페이지
├── services/
│   └── admin.ts                    # [NEW] Admin API 서비스
```

---

## 🔧 구현 단계

### Phase 0: 백엔드 세팅 🔥
- [ ] Admin 모듈 생성 (`admin.module.ts`, `admin.controller.ts`, `admin.service.ts`)
- [ ] AdminGuard 생성 (role === 'ADMIN' 체크)
- [ ] Admin 로그인 API (`POST /api/admin/login`)
- [ ] 콘텐츠 CRUD API (GET/POST/PUT/DELETE)
- [ ] 이미지 업로드 API (`POST /api/upload/image`)
- [ ] 환경변수에 Admin 비밀번호 추가

### Phase 1: 프론트엔드 기본 구조 세팅
- [ ] Admin 폴더 구조 생성
- [ ] `/admin` 라우트 설정 (main.tsx 수정)
- [ ] AdminLayout 컴포넌트 생성
- [ ] Admin API 서비스 생성

### Phase 2: 로그인 페이지
- [ ] AdminLogin.tsx 생성
- [ ] 로그인 폼 UI 구현
- [ ] 관리자 인증 로직 연동

### Phase 3: 대시보드 레이아웃
- [ ] AdminSidebar.tsx 생성 (메뉴 5개)
- [ ] AdminHeader.tsx 생성 (사용자 정보, 로그아웃)
- [ ] AdminLayout.tsx 완성

### Phase 4: 콘텐츠 등록 목록 페이지
- [ ] ContentList.tsx 생성
- [ ] ContentCard.tsx 생성
- [ ] 검색 기능 구현
- [ ] Pagination.tsx 생성
- [ ] 추가하기/수정하기 버튼 라우팅

### Phase 5: 콘텐츠 추가/수정 폼
- [ ] CountrySelector.tsx - 국가 선택 (국기 아이콘)
- [ ] ChipSelector.tsx - Content Type / Experience 칩
- [ ] ImageUploader.tsx - 사진첨부 기능
- [ ] ContentForm.tsx - 폼 통합 컴포넌트
- [ ] ContentCreate.tsx - 추가 페이지
- [ ] ContentEdit.tsx - 수정 페이지
- [ ] API 연동 (contents 서비스 CRUD)

---

## 🎨 디자인 스펙

### 색상
| 용도 | 색상 |
|------|------|
| Primary Purple | `#5a3d8b` |
| Light Purple BG | `#f3f0ff` |
| Active Menu | `#5a3d8b` 배경, 흰색 텍스트 |
| Text Dark | `#1e1e1e` |
| Text Gray | `#555e67` |
| Border | `#ecedf0` |
| Card BG | 그라데이션 오버레이 |

### 사이드바
- Width: `200px`
- Logo: "OFF THE SCREEN" + "Admin Dashboard"

### 콘텐츠 폼 (추가/수정)
- Country: 원형 국기 버튼 (40x40), 선택시 보라색 테두리
- Content Type / Experience: 칩 버튼, 선택시 보라색 테두리
- Picture: 점선 테두리 박스 + "사진첨부" 버튼

---

## 🔐 인증

### Admin 계정
- ID: `eekky_off_the_screen`
- 비밀번호: 환경변수 `ADMIN_PASSWORD`로 관리

### Guard
- Admin 페이지 접근 시 로그인 여부 확인
- 미로그인 시 `/admin` 로그인 페이지로 리다이렉트
- User 테이블의 `role` 컬럼 사용 (`ADMIN` / `USER`)

---

## ⏱️ 예상 소요 시간

| Phase | 예상 시간 |
|-------|-----------|
| Phase 0 (Backend) | 2시간 |
| Phase 1 | 30분 |
| Phase 2 | 1시간 |
| Phase 3 | 1시간 |
| Phase 4 | 1.5시간 |
| Phase 5 | 2.5시간 |
| **Total** | **~8.5시간** |

---

## 🚀 다음 단계

1. 이 계획 승인 후 **Phase 0 (백엔드)** 부터 순차 구현
2. 각 Phase 완료 시 테스트 진행
3. 프론트/백 동시 개발 가능 (API Mock 활용)


