# Toss 데이터 수집 및 분석 플랜 (성별/연령/국적 기반)

이 문서는 Toss로부터 제공받는 사용자 정보(성별, 생년월일, 내/외국인)를 수집하여 우리 서비스의 카테고리 추천 및 데이터 분석에 활용하기 위한 계획입니다. **현재 코드는 수정하지 않고**, 향후 구현을 위한 아키텍처 및 데이터 흐름을 설계합니다.

## 1. 데이터 수집 목표
Toss 인증/결제 시 제공되는 데이터를 우리 서비스의 `User` 정보와 연동하여 다음 통계를 산출하는 것을 목표로 합니다.
- **성별 선호도:** 남성/여성이 선호하는 촬영지/콘텐츠 카테고리
- **연령별 트렌드:** 20대, 30대 등 연령대별 인기 콘텐츠
- **국적별 관심사:** 내국인 vs 외국인(관광객)의 방문 및 선호 차이

## 2. 데이터베이스 스키마 설계 (User 확장)
현재 `User` 테이블에는 해당 필드가 없으므로, 향후 칼럼 추가가 필요합니다.

```prisma
// Future Schema Update Plan
model User {
  // ... 기존 필드
  
  // Toss 제공 데이터
  gender        String?   // "M" | "F"
  birthYear     String?   // "1995"
  nationality   String?   // "LOCAL" | "FOREIGN" (내국인/외국인)
  
  // 분석용 메타데이터
  ageRange      String?   // "20s", "30s" (birthYear 기반 자동 계산 권장)
}
```

## 3. 데이터 흐름 (Data Flow)

### 3.1. 수집 시점 (Toss Integration)
1.  **회원가입/로그인 시:** Toss Login callback에서 넘어오는 `userInfo` 파싱
2.  **본인인증 시:** Toss Identity Verification 완료 후 데이터 수신

### 3.2. 데이터 매핑 로직 (Backend Service)
Toss 데이터를 받아서 우리 DB에 저장할 때의 처리 로직입니다.

- **성별 (Gender):** Toss `male` / `female` -> DB `M` / `F` 매핑
- **연령대 (Age Range):** 
  - `currentYear - birthYear` 로 만 나이 계산
  - `20~29` -> `20s`, `30~39` -> `30s` 로 그룹화하여 저장 (분석 용이성)
- **국적 (Nationality):** Toss `KOR` / 그 외 -> `LOCAL` / `FOREIGN` 구분

## 4. 데이터 활용 및 카테고리 매칭 전략

수집된 데이터를 바탕으로 콘텐츠/촬영지마다 "누가 좋아하는지" 태깅합니다.

### 4. 세부 행동 데이터 통계화 전략 (User Behavior Metrics)

단순히 합산하는 것이 아니라, 각 **행동 유형(Action Type)** 별로 데이터를 분리하여 저장하고 통계화합니다.

#### 4.1. 수집할 핵심 지표 (Key Metrics)

| 지표 (Metric) | 정의 | 가중치(예시) | 의미 |
|---|---|---|---|
| **PV (Page View)** | 상세 페이지 진입 횟수 | 1점 | 단순 관심 |
| **DT (Dwell Time)** | 상세 페이지 체류 시간 (초 단위) | 10초당 1점 | 콘텐츠 몰입도 (실수 클릭 배제) |
| **RV (Re-Visit)** | 동일 장소/콘텐츠 2회 이상 방문 | 5점 | **높은 관심** (갈까 말까 고민 중) |
| **Favorite** | 찜하기 버튼 클릭 | 10점 | 잠재적 방문 의사 |

#### 4.2. 데이터베이스 모델링 (UserActionLog)
행동 데이터를 쌓을 로그 테이블을 별도로 설계하여 이력을 관리합니다.

```prisma
model UserActionLog {
  id        String   @id @default(uuid())
  userId    String
  targetId  String   // LocationId or ContentId
  type      String   // "VIEW", "FAVORITE", "SHARE"
  dwellTime Int?     // VIEW일 경우 체류 시간(초)
  createdAt DateTime @default(now())
  
  // 메타데이터 (당시 유저 상태 스냅샷) - 나중에 유저 스펙이 바뀌어도 과거 기록 유지용
  userAgeGroup String? // "20s"
  userGender   String? // "F"
}
```

#### 4.3. 통계 처리 (Aggregation Pipeline)
실시간으로 계산하면 느리므로, **일일 배치(Daily Batch)**로 통계를 생성합니다.

1.  **일일 집계:** 어제 하루 동안 쌓인 `UserActionLog`를 분석.
2.  **카테고리 매핑:**
    *   20대 여성이 **"카페"** 카테고리에서 **체류시간**이 전주 대비 20% 증가함.
    *   30대 남성이 **"액션"** 장르에서 **재방문율**이 높음.
3.  **트렌드 반영:** 이 통계를 `CategoryTrend` 테이블에 저장하여 추천 시스템에 반영.

**결과 활용 예시:**
> "요즘 **30대 남성** 분들은 한 번 보면 **평균 3분 이상** 머무르는 **숨은 명소**예요!" (체류시간 기반 추천 멘트)

### 4.2. 추천 알고리즘 반영
- **"20대 여성이 좋아하는"** 카테고리 랭킹 산출
- 메인 화면에 **"회원님과 비슷한 또래가 많이 찾은 곳"** 섹션 추가 가능

## 5. 단계별 실행 계획 (Action Plan)

| 단계 | 작업 내용 | 예상 소요 시간 |
|---|---|---|
| **Phase 1** | DB 스키마 마이그레이션 (`gender`, `birthYear` 등 추가) | 1~2시간 |
| **Phase 2** | `AuthService` 수정 (Toss UserInfo 저장 로직 추가) | 3~4시간 |
| **Phase 3** | 통계 배치(Batch) 구현 (카테고리별 선호도 집계) | 1~2일 |
| **Phase 4** | 어드민 대시보드 시각화 (유저 분포 차트) | 2~3일 |
