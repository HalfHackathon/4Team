# Frontend

Vite + React + TypeScript + Tailwind CSS v4. 배포하지 않고 로컬(`npm run dev`)에서 시연한다.

## 받은 직후 실행

- 필요한 Node 버전: **24 (LTS)** — `.nvmrc` 참고. nvm 사용 시 `nvm use`.

```sh
cd frontend && npm install && npm run dev
```

터미널에 표시된 로컬 주소(기본 http://localhost:5173)를 연다.
**백엔드가 없어도 자동으로 목데이터로 동작한다.** 화면 우측 상단 배지로 현재 모드를 확인한다.

| 배지                 | 의미                                                  |
| -------------------- | ----------------------------------------------------- |
| `REAL`               | 실서버(백엔드) 호출 중                                |
| `MOCK`               | 목데이터 고정 (`?mock=1` 또는 `VITE_USE_MOCK=true`)   |
| `MOCK·백엔드 미연결` | 자동 모드에서 백엔드 헬스 체크 실패 → 목데이터로 전환 |

## 기술 스택

| 구분        | 사용 기술                                                     |
| ----------- | ------------------------------------------------------------- |
| 런타임      | Node 24 LTS (`.nvmrc`, `engines.node`)                        |
| 빌드        | Vite 8                                                        |
| UI          | React 19, TypeScript 7                                        |
| 라우팅      | react-router-dom 7                                            |
| 스타일      | Tailwind CSS v4 (`@tailwindcss/vite`, 외부 CDN 없음)          |
| 린트        | oxlint (`.oxlintrc.json`, style 규칙 끔)                      |
| 포맷        | Prettier 3 + prettier-plugin-tailwindcss (`.prettierrc.json`) |
| 백엔드 연결 | Vite 프록시 `/api` → `VITE_BACKEND_URL` (dev·preview 공통)    |
| 목데이터    | `src/mocks/` + 모드 자동 전환 (아래 참고)                     |

정확한 버전은 `package.json`과 `package-lock.json`을 따른다.

## 모드 전환

우선순위 순서:

1. **URL 파라미터** — 주소 끝에 붙인다. 같은 탭에서 페이지를 이동해도 유지된다(sessionStorage).
   - `?mock=1` 목데이터 고정
   - `?mock=0` 실서버 고정 (백엔드가 없으면 실패 배너가 뜬다)
   - `?mock=auto` 기억한 값 해제 (탭을 닫아도 해제된다)
2. **환경 변수 `VITE_USE_MOCK`** (`.env.local`)
   - `true` 목, `false` 실서버, `auto`(기본) 자동
3. **auto** — `/api/v1/health`를 1초 제한으로 호출해 성공하면 실서버, 실패하면 목.

## 백엔드 주소 바꾸기

`.env.example`을 `.env.local`로 복사해서 고친다. `.env.local`은 커밋되지 않는다.

```sh
cp .env.example .env.local
```

```
VITE_BACKEND_URL=http://localhost:8080
VITE_USE_MOCK=auto
```

변경 후에는 `npm run dev`를 다시 실행한다.

프론트 코드는 항상 상대 경로 `/api/v1/...`로만 호출한다. 개발 서버(`vite.config.ts`의 `server.proxy`, `preview.proxy`)가 `/api` 요청을 `VITE_BACKEND_URL`로 전달하므로 브라우저 입장에서는 같은 출처 요청이 되어 **백엔드에 CORS 설정이 필요 없다.** 백엔드 주소를 코드에 직접 쓰지 않는다.

## 시연 방법

1. 백엔드 실행 (루트 README의 "로컬 실행" 참고, 기본 http://localhost:8080)
2. `cd frontend && npm run dev`
3. 표시된 로컬 주소를 열고 배지가 `REAL`인지 확인

빌드 결과물로 시연하려면 `npm run build && npm run preview` (같은 프록시가 적용된다).

> 8080 포트를 다른 프로그램(예: Homebrew로 설치한 Apache httpd)이 쓰고 있으면 백엔드가 뜨지 않고, 자동 모드는 목으로 전환된다. `lsof -iTCP:8080 -sTCP:LISTEN`으로 확인한다.

## 스크립트

| 명령              | 설명                                           |
| ----------------- | ---------------------------------------------- |
| `npm run dev`     | 개발 서버                                      |
| `npm run build`   | 타입 검사 + 빌드                               |
| `npm run lint`    | oxlint 검사                                    |
| `npm run format`  | Prettier로 전체 정렬 (`format:check`는 검사만) |
| `npm run preview` | 빌드 결과 미리보기                             |

VS Code는 `frontend/` 폴더를 열면 `.vscode/` 설정(저장 시 Prettier 포맷)과 권장 확장(oxc, Prettier, Tailwind CSS IntelliSense)이 적용된다.

## 폴더 구조

```
src/
  api/client.ts      # fetch 래퍼: ApiResponse 해석, 목/실서버 분기, 모드 결정  ※ 수정 전 공유
  api/items.ts       # 엔드포인트별 함수 (자원마다 파일 하나)
  types/api.ts       # ApiResponse<T>, ApiError                              ※ 수정 전 공유
  types/item.ts      # 자원별 타입
  mocks/items.ts     # docs/api.md 예시와 같은 ApiResponse 형식 목데이터
  components/        # 공통 컴포넌트 (ModeBadge, Banner)
  pages/             # 화면 단위. 팀원별로 pages 파일 단위로 분담한다.
  utils/             # 날짜 포맷 등 순수 함수
  App.tsx            # 라우터
```

## 화면 추가 규칙

- 화면은 `pages/` 파일 단위로 분담한다. 라우트는 `App.tsx`에 한 줄 추가한다.
- `api/client.ts`와 `types/api.ts`는 모든 화면이 쓰므로 **수정 전에 팀에 공유**한다.
- 화면 코드는 api 함수가 돌려준 `data`만 다룬다. 모드(목/실서버)를 직접 확인하지 않는다.
- 호출 실패는 `catch`해서 `toErrorMessage(e)`를 `Banner`로 표시한다. 성공 여부는 `isSuccess`로만 판단하며 `code` 문자열로 분기하지 않는다.
- 외부 CDN 폰트·스크립트는 쓰지 않는다(오프라인 시연 대비).
- `pages/ItemList.tsx`, `pages/ItemDetail.tsx`는 "화면 → api → 목데이터" 경로 확인용 샘플이다. 실제 기능은 이 패턴을 복제해서 만든다.

## 새 API를 붙이는 순서

1. `docs/api.md`에 메서드·경로, 성공·실패 예시 추가
2. `src/types/`에 응답 `data` 타입 추가
3. `src/mocks/`에 docs 예시와 같은 ApiResponse 목데이터 추가
4. `src/api/`에 함수 추가: `request<T>(path, { method, body, mock })`
5. `src/pages/`에서 화면 구현

## 참고

- API 명세 초안: [docs/api.md](../docs/api.md) (원본은 팀 노션)
- 백엔드 응답 규격: [backend/API_RESPONSE.md](../backend/API_RESPONSE.md)
- Swagger UI(백엔드 실행 시): http://localhost:8080/swagger-ui.html
