# UI 개선 기능 구현 계획

## 📋 Overview

4가지 UI 개선 기능 구현 계획

---

## 🎯 구현 목록

### 1. 이미지 크롭 에디터
**위치:** 콘텐츠 등록/수정, 공지사항 등록/수정
- 이미지 업로드 시 크롭 모달 표시
- 드래그로 영역 선택
- 자유 비율 또는 고정 비율 선택

### 2. 다중 국가 선택
**위치:** 콘텐츠 등록/수정
- 기존: 단일 국가 선택 (`value: string`)
- 변경: 복수 국가 선택 (`value: string[]`)
- 체크박스 스타일로 변경

### 3. 상세 페이지 이미지 900px 확장
**위치:** LocationDetailView.tsx
- 현재: `w-full md:w-[375px]`
- 변경: `w-full max-w-[900px]`
- 이미지 비율 유지하면서 확대

### 4. 네비게이션 맵 반응형 수정
**위치:** MapView.tsx
- 현재 상태: 맵이 고정되어 있음
- 변경: 실시간 위치 추적 및 드래그/줌 반응

---

## 📁 파일 변경

### Feature 1: 이미지 크롭 에디터

```
Off_sol/src/admin/components/
├── ImageCropper.tsx             # [NEW] 이미지 크롭 모달
└── ImageUploader.tsx            # [MODIFY] 크롭 기능 통합
```

**의존성:** `react-image-crop` 라이브러리

### Feature 2: 다중 국가 선택

```
Off_sol/src/admin/components/
└── CountrySelector.tsx          # [MODIFY] 다중 선택 지원
```

**변경 사항:**
```typescript
// Before
interface CountrySelectorProps {
    value: string;
    onChange: (value: string) => void;
}

// After
interface CountrySelectorProps {
    value: string[];
    onChange: (value: string[]) => void;
    multiple?: boolean;
}
```

### Feature 3: 상세 페이지 이미지 확장

```
Off_sol/src/app/components/
└── LocationDetailView.tsx       # [MODIFY] 이미지 영역 900px
```

**변경 라인:** 135-140

### Feature 4: 맵 반응형 수정

```
Off_sol/src/app/components/
└── MapView.tsx                  # [MODIFY] 실시간 반응 추가
```

**변경 사항:**
- watchPosition 사용 (getCurrentPosition → watchPosition)
- 맵 드래그/줌 이벤트 핸들러 추가

---

## 🔧 구현 순서

### Phase 1: 다중 국가 선택 (빠름)
- [ ] CountrySelector.tsx 수정 (다중 선택)
- [ ] ContentCreate.tsx, ContentEdit.tsx 업데이트
- [ ] 백엔드 country 필드 타입 확인

### Phase 2: 상세 페이지 이미지 확장 (빠름)
- [ ] Frame29 컴포넌트 수정
- [ ] 이미지 컨테이너 max-width: 900px

### Phase 3: 맵 반응형 수정 (중간)
- [ ] watchPosition으로 변경
- [ ] 맵 이벤트 리스너 추가
- [ ] 부드러운 이동 애니메이션

### Phase 4: 이미지 크롭 에디터 (시간 소요)
- [ ] react-image-crop 설치
- [ ] ImageCropper 컴포넌트 생성
- [ ] ImageUploader에 통합

---

## ⏱️ 예상 소요 시간

| Feature | 예상 시간 |
|---------|-----------|
| 다중 국가 선택 | 20분 |
| 상세 페이지 이미지 | 10분 |
| 맵 반응형 | 30분 |
| 이미지 크롭 에디터 | 1시간 |
| **Total** | **~2시간** |

---

## ⚠️ 고려사항

> [!NOTE]
> 이미지 크롭 에디터는 react-image-crop 라이브러리 설치가 필요합니다.

> [!IMPORTANT]
> 다중 국가 선택 시 백엔드 country 필드가 배열을 지원하도록 수정 필요 (현재 string)
