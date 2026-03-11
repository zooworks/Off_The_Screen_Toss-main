# 사용자 선호도 분석 및 통계화 기획안 (Toss Login 연동)

## 1. 개요 (Overview)
**토스 로그인(Toss Login)**을 통해 검증된 **생년월일(Birthday)** 및 **성별(Gender)** 정보를 수집하여, 신뢰도 높은 사용자 통계를 산출하고 개인화된 경험을 제공하기 위한 기획안입니다.

## 2. 데이터 수집 전략 (Data Collection)

### 2.1 토스 로그인 연동 (Toss Login Integration)
토스 로그인 API는 사용자 동의 시 `user_birthday`와 `user_gender` 정보를 제공합니다. 별도의 추가 입력 과정 없이 가입 단계에서 데이터를 확보할 수 있습니다.

*   **필수 Scope 설정**:
    *   `user_birthday`: 생년월일 (yyyyMMdd)
    *   `user_gender`: 성별 (MALE / FEMALE)
    *   (*기존 필수*): `user_ci`, `user_phone`, `user_name` 등.

### 2.2 데이터 복호화 및 저장 (Decryption & Storage)
Toss Login의 개인정보는 **AES-256-GCM** 알고리즘으로 암호화되어 전달됩니다. 서버에서 이를 복호화하여 저장해야 합니다.

*   **복호화 프로세스**:
    1.  `/oauth2/login-me` API 응답에서 `birthday`, `gender` (암호문) 수신.
    2.  콘솔에서 발급받은 **AES Key**와 이메일로 수신한 **AAD**를 사용하여 복호화.
        *   Algorithm: `AES/GCM/NoPadding`
        *   Key Length: 256 bits
        *   IV: 암호문의 앞 12바이트 추출
*   **데이터 가공**:
    *   `birthday` (“19950101”) → `birthYear` (1995)만 추출하여 저장 (연령대 분석용).
    *   `gender` (“MALE”/“FEMALE”) → DB 포맷(`M`/`F` 등)에 맞춰 저장.
    *   *보안 권고*: 정확한 생년월일 전체 저장이 불필요하다면, 연령대 정보만 저장하여 개인정보 부담 최소화.

## 3. 통계 분석 모델 (Analysis Model)

### 3.1 사용자 세그먼트 (Segments)
토스 로그인 데이터로 정확한 세그먼트 분류가 가능합니다.
*   **Segment Key**: `Gender_AgeGroup` (예: `F_20s`)
    *   10대: ~19
    *   20대: 20~29
    *   30대: 30~39
    *   ...

### 3.2 분석 매트릭스 (Preferences)
| 카테고리 | 분석 지표 | 예시 인사이트 |
| :--- | :--- | :--- |
| **콘텐츠(Content)** | 조회수, 찜(Favorite) | "30대 남성은 `누아르` 장르를 선호함" |
| **장소(Location)** | 길찾기 시도(Navigation) | "20대 여성은 `카페` 카테고리의 `성수동` 지역 방문율이 높음" |
| **검색(Search)** | 키워드 빈도 | "40대는 `주차 가능` 키워드를 많이 검색함" |

## 4. 데이터베이스 설계 제안 (Database Schema)

### Update User Table
토스 로그인 복호화 데이터를 저장할 컬럼을 추가합니다.
```sql
ALTER TABLE "User" ADD COLUMN "birthYear" INTEGER; -- e.g., 1995
ALTER TABLE "User" ADD COLUMN "gender" VARCHAR(10); -- 'MALE', 'FEMALE'
```

### Analytics Event Table (Optional)
사용자 행동 추적을 위한 로그 테이블입니다.
```sql
CREATE TABLE "AnalyticsEvent" (
  "id" UUID PRIMARY KEY,
  "userId" UUID REFERENCES "User"("id"),
  "userSegment" VARCHAR(20), -- 'M_30s' (Denormalized for fast query)
  "action" VARCHAR(20), -- 'VIEW_DETAIL', 'NAVIGATE', 'FAVORITE'
  "targetId" UUID,
  "timestamp" TIMESTAMP DEFAULT NOW()
);
```

## 5. 활용 방안 (Utilization)

### 5.1 개인화 추천 (Personalization)
*   **홈 화면**: "지금 **20대**가 주목하는 핫플레이스 🔥" 섹션 추가.
*   **검색 결과**: 동일 성별/연령대가 선호하는 장소를 상단에 노출.

### 5.2 마케팅 & 제휴 (Insights)
*   특정 타겟(예: 30대 여성)에게 인기 있는 장소 데이터를 기반으로, 관련 브랜드와 제휴 프로모션 기획.
*   관리자 대시보드에서 실시간 트렌드 파악.

---
**[참고]**
*   Toss Login 개발 가이드 (`toss/login/develop.md`)를 준수하여 구현합니다.
*   정보 제공 동의를 받지 않은 기존 회원은 로그인 시 추가 동의를 받거나(재로그인), '내 정보'에서 연동을 유도할 수 있습니다.
