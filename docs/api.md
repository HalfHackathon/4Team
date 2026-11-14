# API 명세 초안 (FE 작성, BE 확인 전)

> 원본은 팀 노션의 API 응답 규격 문서이며, 충돌하면 노션을 따른다.
> 이 문서는 FE가 목데이터와 타입을 맞추기 위해 작성한 초안이다. `BE 확인 필요` 표시 항목은 BE 개발자 확인 후 갱신한다.
> 참고: [backend/API_RESPONSE.md](../backend/API_RESPONSE.md)

## 공통 규칙

- 필드명은 camelCase를 사용한다.
- 날짜·시간은 ISO 8601 문자열을 사용한다. 예: `2026-11-14T09:30:00+09:00`
- 경로는 `/api/v1/{자원명}` 형식을 사용한다.
- 모든 응답은 아래 ApiResponse 형식이다.

```json
{ "isSuccess": boolean, "code": string, "message": string, "data": object | null }
```

- 성공 여부는 `isSuccess`로만 판단한다. FE는 `code` 문자열로 분기하지 않는다.
- 실패 응답의 `data`는 일반적으로 `null`이다. 입력값 검증 실패(`COMMON_400_2`) 등 일부 오류는 `data`에 상세 정보가 담길 수 있으며, FE는 모양을 해석하지 않고 원본을 보관만 한다. (BE 확인 필요)

## 엔드포인트 목록

| 메서드 | 경로                             | 설명                                           |
| ------ | -------------------------------- | ---------------------------------------------- |
| GET    | `/api/v1/health`                 | 서버 상태 확인 (FE 목/실서버 자동 전환에 사용) |
| GET    | `/api/v1/items`                  | 샘플 항목 목록 조회                            |
| GET    | `/api/v1/items/{id}`             | 샘플 항목 상세 조회                            |
| GET    | `/api/v1/missions/today`         | 오늘 받은 미션 목록 조회 (홈 "오늘의 미션")    |
| POST   | `/api/v1/missions/{id}/complete` | 미션 수행 완료 처리                            |

`items`는 화면 → api → 목데이터 경로를 검증하기 위한 샘플 자원이다. 실제 기능 자원이 정해지면 같은 형식으로 추가한다.

---

### GET /api/v1/health

서버 상태를 확인한다. FE는 `VITE_USE_MOCK=auto`일 때 이 경로를 1초 제한으로 호출해 실서버 연결 여부를 판단한다.

성공 예시 (HTTP 200) — `code` BE 확인 필요

```json
{
  "isSuccess": true,
  "code": "SUCCESS_200",
  "message": "호출에 성공했습니다.",
  "data": { "status": "UP" }
}
```

실패 예시 (HTTP 500)

```json
{
  "isSuccess": false,
  "code": "GLOBAL_500",
  "message": "서버 내부 오류가 발생했습니다.",
  "data": null
}
```

---

### GET /api/v1/items

샘플 항목 목록을 조회한다.

- 응답 `data`는 배열이다. 페이지네이션 여부와 형식은 BE 확인 필요.

성공 예시 (HTTP 200) — `code` BE 확인 필요

```json
{
  "isSuccess": true,
  "code": "SUCCESS_200",
  "message": "호출에 성공했습니다.",
  "data": [
    {
      "id": 1,
      "title": "사무직 거북목 스트레칭 후기",
      "summary": "점심시간 10분 스트레칭으로 목 통증이 줄었어요.",
      "createdAt": "2026-11-10T12:30:00+09:00"
    },
    {
      "id": 2,
      "title": "교대 근무자 수면 루틴 공유",
      "summary": "야간 근무 후 암막 커튼과 고정 취침 시간을 지켜요.",
      "createdAt": "2026-11-11T08:15:00+09:00"
    }
  ]
}
```

실패 예시 (HTTP 500)

```json
{
  "isSuccess": false,
  "code": "GLOBAL_500",
  "message": "서버 내부 오류가 발생했습니다.",
  "data": null
}
```

---

### GET /api/v1/items/{id}

샘플 항목 하나를 상세 조회한다.

| 경로 변수 | 타입   | 설명    |
| --------- | ------ | ------- |
| `id`      | number | 항목 ID |

성공 예시 (HTTP 200) — `code` BE 확인 필요

```json
{
  "isSuccess": true,
  "code": "SUCCESS_200",
  "message": "호출에 성공했습니다.",
  "data": {
    "id": 1,
    "title": "사무직 거북목 스트레칭 후기",
    "summary": "점심시간 10분 스트레칭으로 목 통증이 줄었어요.",
    "content": "모니터 높이를 눈높이에 맞추고, 점심시간마다 10분씩 목·어깨 스트레칭을 했습니다. 2주 정도 지나니 오후 두통이 확실히 줄었어요.",
    "createdAt": "2026-11-10T12:30:00+09:00"
  }
}
```

실패 예시 (HTTP 404) — `code` BE 확인 필요

```json
{
  "isSuccess": false,
  "code": "ITEM_404_1",
  "message": "해당 항목을 찾을 수 없습니다.",
  "data": null
}
```

---

### GET /api/v1/missions/today

오늘 사용자에게 전달된 미션 목록을 조회한다. 미션은 AI가 생성해 보낸 것으로 가정한다. (실제 AI 연동 여부·방식 BE 확인 필요)

- 사용자 식별 방식(로그인 / 데모 사용자 고정) BE 확인 필요.
- `status`: `ASSIGNED`(받음) | `COMPLETED`(완료). 그 외 상태 BE 확인 필요.

성공 예시 (HTTP 200) — `code` BE 확인 필요

```json
{
  "isSuccess": true,
  "code": "SUCCESS_200",
  "message": "호출에 성공했습니다.",
  "data": [
    {
      "id": 1,
      "title": "식사시 채소 먼저 먹기",
      "description": "점심 식사 때 채소 반찬부터 먼저 먹어 보세요.",
      "reason": "앉아서 일하는 시간이 길면 식후 혈당이 빠르게 오를 수 있어요.",
      "status": "ASSIGNED",
      "assignedAt": "2026-11-14T08:00:00+09:00",
      "completedAt": null
    },
    {
      "id": 2,
      "title": "점심 후 10분 걷기",
      "description": "점심 식사 후 10분 동안 가볍게 걸어 보세요.",
      "reason": "오후 졸음과 허리 긴장을 줄이는 데 도움이 돼요.",
      "status": "ASSIGNED",
      "assignedAt": "2026-11-14T08:00:00+09:00",
      "completedAt": null
    }
  ]
}
```

실패 예시 (HTTP 500)

```json
{
  "isSuccess": false,
  "code": "GLOBAL_500",
  "message": "서버 내부 오류가 발생했습니다.",
  "data": null
}
```

---

### POST /api/v1/missions/{id}/complete

미션을 수행 완료로 처리하고, 변경된 미션을 반환한다. 요청 본문 없음 (인증 사진·수행 시간 등 추가 여부 BE 확인 필요)

| 경로 변수 | 타입   | 설명    |
| --------- | ------ | ------- |
| `id`      | number | 미션 ID |

성공 예시 (HTTP 200) — `code` BE 확인 필요

```json
{
  "isSuccess": true,
  "code": "SUCCESS_200",
  "message": "호출에 성공했습니다.",
  "data": {
    "id": 1,
    "title": "식사시 채소 먼저 먹기",
    "description": "점심 식사 때 채소 반찬부터 먼저 먹어 보세요.",
    "reason": "앉아서 일하는 시간이 길면 식후 혈당이 빠르게 오를 수 있어요.",
    "status": "COMPLETED",
    "assignedAt": "2026-11-14T08:00:00+09:00",
    "completedAt": "2026-11-14T12:40:00+09:00"
  }
}
```

실패 예시 (HTTP 409, 이미 완료한 미션) — `code` BE 확인 필요

```json
{
  "isSuccess": false,
  "code": "MISSION_409_1",
  "message": "이미 완료한 미션입니다.",
  "data": null
}
```

---

## BE 확인 필요 항목

- [ ] 성공 응답 `code` 값 (`SUCCESS_200` / 생성 시 `SUCCESS_201`?)
- [ ] `/api/v1/health` 경로 유지 여부와 로컬 포트(기본 8080)
- [ ] 목록 응답의 페이지네이션 여부와 형식
- [ ] 도메인 오류 `code` 형식 (예: `ITEM_404_1`)
- [ ] 입력값 검증 실패 시 `data` 모양
- [ ] 미션: 필드 구성, `status` 값 목록, 사용자 식별 방식, 완료 요청 본문 유무, 오류 `code`
- [ ] 직종 리스크 카드: 엔드포인트와 응답 형식 (현재 화면 자리만 있음)
