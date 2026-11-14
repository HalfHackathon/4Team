/** 모든 API 응답의 공통 형식. docs/api.md 참고 */
export interface ApiResponse<T> {
  isSuccess: boolean
  code: string
  message: string
  data: T | null
}

/**
 * isSuccess가 false인 응답(또는 통신 실패)을 나타낸다.
 * - 화면은 message만 표시한다. code 문자열로 분기하지 않는다.
 * - data는 서버가 보낸 원본 그대로 보관한다. (Validation 오류 모양은 BE 확인 전이라 해석하지 않음)
 */
export class ApiError extends Error {
  readonly code: string
  readonly data: unknown
  /** HTTP 상태. 목 모드·네트워크 실패면 undefined */
  readonly status?: number

  constructor(params: { code: string; message: string; data?: unknown; status?: number }) {
    super(params.message)
    this.name = 'ApiError'
    this.code = params.code
    this.data = params.data ?? null
    this.status = params.status
  }
}
