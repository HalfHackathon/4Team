import { ApiError, type ApiResponse } from '../types/api'

/**
 * fetch 래퍼.
 * - 모드 결정: URL ?mock=1|0 → VITE_USE_MOCK(true|false) → auto(/api/v1/health 1초 확인)
 * - 응답 해석: isSuccess가 true면 data만 반환, false면 ApiError를 던진다.
 * - 목 모드도 300ms 지연 후 같은 해석 경로(unwrap)를 지난다.
 * 화면 코드는 모드와 무관하게 data만 다룬다. 이 파일은 수정 전 팀에 공유한다.
 */

export type ApiMode = 'real' | 'mock' | 'mock-fallback'

const MOCK_OVERRIDE_KEY = 'apiMockOverride'
const HEALTH_PATH = '/api/v1/health'
const HEALTH_TIMEOUT_MS = 1000
const MOCK_DELAY_MS = 300

let modePromise: Promise<ApiMode> | null = null

/** 현재 API 모드. 처음 한 번만 결정하고 이후에는 같은 결과를 쓴다. */
export function getApiMode(): Promise<ApiMode> {
  modePromise ??= resolveMode()
  return modePromise
}

export function isMockMode(mode: ApiMode): boolean {
  return mode !== 'real'
}

async function resolveMode(): Promise<ApiMode> {
  // 1) URL ?mock=1 | ?mock=0 (sessionStorage에 기억), ?mock=auto는 기억한 값 해제
  const override = readUrlOverride()
  if (override === 'mock') return 'mock'
  if (override === 'real') return 'real'

  // 2) 환경 변수
  const envValue = (import.meta.env.VITE_USE_MOCK ?? 'auto').trim().toLowerCase()
  if (envValue === 'true') return 'mock'
  if (envValue === 'false') return 'real'

  // 3) auto: 헬스 체크 성공 시 실서버, 실패 시 목
  return (await isBackendAlive()) ? 'real' : 'mock-fallback'
}

function readUrlOverride(): 'mock' | 'real' | null {
  const param = new URLSearchParams(window.location.search).get('mock')
  try {
    if (param === '1') sessionStorage.setItem(MOCK_OVERRIDE_KEY, 'mock')
    else if (param === '0') sessionStorage.setItem(MOCK_OVERRIDE_KEY, 'real')
    else if (param === 'auto') sessionStorage.removeItem(MOCK_OVERRIDE_KEY)
    const saved = sessionStorage.getItem(MOCK_OVERRIDE_KEY)
    return saved === 'mock' || saved === 'real' ? saved : null
  } catch {
    // sessionStorage를 쓸 수 없는 환경이면 URL 값만 반영한다.
    if (param === '1') return 'mock'
    if (param === '0') return 'real'
    return null
  }
}

async function isBackendAlive(): Promise<boolean> {
  try {
    const res = await fetch(HEALTH_PATH, { signal: AbortSignal.timeout(HEALTH_TIMEOUT_MS) })
    const body: unknown = await res.json()
    return isApiResponse(body) && body.isSuccess
  } catch {
    return false
  }
}

// ---------------------------------------------------------------------------

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface RequestOptions<T> {
  method?: HttpMethod
  /** JSON으로 직렬화해 보낸다. */
  body?: unknown
  /** 목 모드에서 돌려줄 ApiResponse. mocks/ 폴더의 함수를 넘긴다. */
  mock?: () => ApiResponse<T>
}

/** 모든 API 호출의 진입점. 성공 시 data만 반환하고, 실패 시 ApiError를 던진다. */
export async function request<T>(path: string, options: RequestOptions<T> = {}): Promise<T> {
  const { method = 'GET', body, mock } = options
  const mode = await getApiMode()

  if (isMockMode(mode)) {
    await delay(MOCK_DELAY_MS)
    if (!mock) {
      throw new ApiError({
        code: 'FE_MOCK_MISSING',
        message: `목데이터가 없습니다: ${method} ${path}`,
      })
    }
    return unwrap<T>(structuredClone(mock()))
  }

  const { payload, status } = await fetchPayload(path, method, body)
  return unwrap<T>(payload, status)
}

async function fetchPayload(
  path: string,
  method: HttpMethod,
  body: unknown,
): Promise<{ payload: unknown; status: number }> {
  let res: Response
  try {
    res = await fetch(path, {
      method,
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    throw new ApiError({ code: 'FE_NETWORK_ERROR', message: '서버에 연결할 수 없습니다.' })
  }

  // HTTP 상태와 무관하게 본문을 먼저 파싱한다.
  const text = await res.text()
  try {
    return { payload: JSON.parse(text), status: res.status }
  } catch {
    throw new ApiError({
      code: 'FE_INVALID_RESPONSE',
      message: `서버 응답을 해석할 수 없습니다. (HTTP ${res.status})`,
      data: text,
      status: res.status,
    })
  }
}

/** 성공 여부는 isSuccess로만 판단한다. code 문자열로 분기하지 않는다. */
function unwrap<T>(payload: unknown, status?: number): T {
  if (!isApiResponse(payload)) {
    throw new ApiError({
      code: 'FE_INVALID_RESPONSE',
      message: 'ApiResponse 형식이 아닌 응답입니다.',
      data: payload,
      status,
    })
  }
  if (payload.isSuccess) return payload.data as T
  throw new ApiError({ code: payload.code, message: payload.message, data: payload.data, status })
}

function isApiResponse(value: unknown): value is ApiResponse<unknown> {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  return (
    typeof v.isSuccess === 'boolean' && typeof v.code === 'string' && typeof v.message === 'string'
  )
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** 화면에서 catch한 오류를 사용자 문구로 바꾼다. */
export function toErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message
  return '알 수 없는 오류가 발생했습니다.'
}
