# API 응답 규격

신규 경로는 `/api/v1/{자원명}`을 사용합니다. 예: `GET /api/v1/health`.

| 필드 | 의미 |
| --- | --- |
| isSuccess | 성공 여부(boolean) |
| code | enum 이름이 아닌 getCode() 값 |
| message | 사용자에게 표시할 안내 문구 |
| data | 응답 데이터. 반환값이 없거나 일반 오류이면 null |

조회와 삭제는 SUCCESS_OK(HTTP 200), 생성은 SUCCESS_CREATED(HTTP 201)를 사용합니다. 컨트롤러에서 `return ApiResponse.success(SuccessResponseCode.SUCCESS_CREATED, dto);`처럼 반환하면 실제 HTTP 상태도 함께 설정됩니다. 데이터가 없으면 두 번째 인수를 생략합니다.

```json
{"isSuccess":true,"code":"SUCCESS_200","message":"호출에 성공했습니다.","data":{"status":"UP"}}
```

공통 오류는 KEEPIT-BE의 ErrorResponseCode 값을 따릅니다. JSON 본문을 읽을 수 없으면 GLOBAL_400_2, 파라미터 타입 변환 실패는 GLOBAL_400_3입니다. 신규 도메인 오류는 BaseResponseCode를 구현하고 DOMAIN_HTTP상태_순번 형식으로 정의합니다.

```json
{"isSuccess":false,"code":"GLOBAL_500","message":"서버 내부 오류가 발생했습니다.","data":null}
```

입력값 검증 실패는 HTTP 400과 COMMON_400_2로 통일합니다. data는 필드명을 키로 한 객체가 아니라 오류 배열이며, 같은 필드가 여러 번 등장할 수 있습니다.

```json
{"isSuccess":false,"code":"COMMON_400_2","message":"입력값이 올바르지 않습니다.","data":[{"field":"semester","message":"학기 정보는 필수입니다."},{"field":"departmentId","message":"학과 정보는 필수입니다."}]}
```
