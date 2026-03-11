# 백엔드 최적화 계획 (목표: 동시 접속자 10,000명 이상)

이 문서는 트래픽이 높은 상황에서 백엔드 성능을 최적화하기 위한 단계별 계획입니다. 리스트 필터링, 검색, 관리자 작업에서 식별된 병목 현상을 해결하는 데 중점을 둡니다.

## 1. 스키마 리팩토링 및 정규화 (우선순위: 높음)
**문제점:** `Content` 테이블이 카테고리를 JSON 문자열(`"['Food', 'Action']"`) 형태로 저장하고 있습니다.
**영향:** 카테고리 필터링을 하려면 불필요하게 많은 데이터(`limit * 3`)를 DB에서 가져온 후, Node.js 메모리에서 CPU로 필터링해야 합니다. 사용자가 몰리면 서버 CPU 과부하로 성능이 급격히 저하됩니다.
**해결 방안:**
- `Category` 테이블을 생성하고 `ContentCategory` 매핑 테이블을 만들어 다대다(N:M) 관계를 맺습니다.
- **이점:** SQL 쿼리(`WHERE c.categoryId = ?`)만으로 필터링이 가능해집니다. 불필요한 데이터 조회가 사라지고 CPU 사용량이 대폭 감소합니다.

```prisma
model Category {
  id      String @id @default(uuid())
  name    String @unique
  contents ContentCategory[]
}

model ContentCategory {
  contentId  String
  categoryId String
  content    Content  @relation(fields: [contentId], references: [id])
  category   Category @relation(fields: [categoryId], references: [id])

  @@id([contentId, categoryId])
}
```

## 2. 데이터베이스 인덱싱 (우선순위: 중간)
**문제점:** `Content` 검색 시 인덱스 없이 `contains`를 사용하므로 Full Table Scan(테이블 전체 조회)이 발생합니다.
**영향:** 데이터 양이 늘어날수록 검색 속도가 느려집니다.
**해결 방안:**
- 자주 검색하거나 정렬하는 필드에 인덱스를 추가합니다.

```prisma
model Content {
  // ... 기존 필드
  @@index([title])      // 제목 검색 최적화
  @@index([createdAt])  // 최신순 정렬 최적화
  @@index([viewCount])  // 인기순 정렬 최적화
}
```

## 3. 캐싱 전략 도입 (우선순위: 중간)
**문제점:** "메인 페이지"나 "인기 순위" 목록은 모든 유저에게 똑같이 보이지만, 접속할 때마다 매번 DB를 조회합니다.
**영향:** DB에 불필요한 부하가 가중됩니다.
**해결 방안:**
- **Redis** 또는 인메모리(LRU) 캐싱을 도입하여 읽기 요청을 분산시킵니다.
  - `GET /contents/trending`: 인기 콘텐츠 (캐시 유지: 5~10분)
  - `GET /contents`: 메인 리스트 (캐시 유지: 1분)

## 4. 관리자 일괄 작업 API (우선순위: 낮음)
**문제점:** N개를 삭제할 때 N번의 HTTP 요청과 N번의 DB 트랜잭션이 발생합니다.
**해결 방안:**
- `DELETE /admin/locations/bulk` API를 구현합니다.
- `prisma.location.deleteMany({ where: { id: { in: ids } } })`를 사용하여 쿼리 한 번으로 처리합니다.

## 요약
| 작업 | 영향도 | 예상 소요 시간 |
|---|---|---|
| **스키마 정규화** | 🚀 높음 | 2~3일 |
| **인덱스 추가** | ⚡️ 중간 | 1시간 이내 |
| **캐싱 도입** | 🛡️ 높음 | 1~2일 |
| **관리자 Bulk API** | 🔧 낮음 | 2~3시간 |
