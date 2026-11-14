# 4Team

직종별 건강 경험 공유, 맞춤 게시글 추천, 개인 건강 습관 기록 서비스를 위한 프로젝트입니다.

## 프로젝트 구조

- `backend/`: Spring Boot API 서버
- `frontend/`: 프론트엔드 준비 폴더 (스택 미정)

## 백엔드 스택

- Java 17 / Spring Boot 4.1.1
- Gradle 8.14.2 (Wrapper 포함)
- 로컬 MySQL 8.4 LTS / Spring Data JPA
- Flyway + flyway-mysql (스키마 변경 관리)
- springdoc-openapi 3.2.0 / Swagger UI
- Spring RestClient (외부 LLM 제공사 추후 선정)

## 로컬 실행

1. JDK 17 및 MySQL 8.4 LTS를 설치합니다. IDE의 Project SDK와 Gradle JVM은 JDK 17로 지정합니다.
2. MySQL 관리자 계정으로 개발용 DB와 계정을 생성합니다. 아래 비밀번호는 실제 로컬 비밀번호로 바꿉니다.

```sql
CREATE DATABASE fourteam CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
CREATE USER 'fourteam'@'localhost' IDENTIFIED BY 'replace-with-local-password';
GRANT ALL PRIVILEGES ON fourteam.* TO 'fourteam'@'localhost';
```

3. `backend/application-local.yml.example`을 `backend/application-local.yml`로 복사하고 DB 비밀번호를 입력합니다. 이 파일은 Git에서 제외됩니다.
4. `backend/`를 작업 디렉터리로 실행합니다.

Windows PowerShell:

```powershell
cd D:\Project\4Team\backend
$env:JAVA_HOME = 'C:\Program Files\Java\jdk-17' # 설치 경로에 맞게 수정
.\gradlew.bat bootRun
```

macOS / Linux:

```sh
cd backend
sh ./gradlew bootRun
```

IDE에서는 `backend/`를 Gradle 프로젝트로 열고, 작업 디렉터리를 `backend/`로 설정한 뒤 `FourTeamApplication`을 실행합니다.

- [공통 API 응답 규격](backend/API_RESPONSE.md)
- 상태 확인: http://localhost:8080/api/v1/health
- Swagger UI: http://localhost:8080/swagger-ui.html
- OpenAPI JSON: http://localhost:8080/v3/api-docs

## 환경 설정

| 환경 변수 | 기본값 | 용도 |
| --- | --- | --- |
| `DB_URL` | `jdbc:mysql://localhost:3306/fourteam?serverTimezone=Asia/Seoul&characterEncoding=UTF-8` | MySQL 연결 주소 |
| `DB_USERNAME` | `fourteam` | DB 계정 |
| `DB_PASSWORD` | 빈 값 | DB 비밀번호 |
| `SERVER_PORT` | `8080` | API 서버 포트 |
| `UPLOAD_DIR` | `./uploads` | 업로드 저장 경로 |

`application-local.yml` 대신 환경 변수를 사용할 수도 있습니다. `.env` 파일을 자동으로 읽지는 않습니다.
업로드 경로는 설정만 준비되어 있으며, 파일 업로드 API는 기능 개발 시 구현합니다. 업로드 파일은 Git에 포함하지 않습니다.

## 빌드 및 검증

```powershell
cd backend
.\gradlew.bat build
```

테스트에서는 H2를 사용하고 Flyway를 비활성화하므로 로컬 MySQL 없이 실행할 수 있습니다.
서버 기동, 상태 API, OpenAPI JSON, Swagger UI 응답을 확인합니다. 실제 MySQL 8.4 및 Flyway SQL 호환성 검증은 별도로 필요합니다.

## DB 마이그레이션

`backend/src/main/resources/db/migration/`에 `V1__init.sql` 형식의 SQL을 추가합니다.
현재 도메인 스키마는 아직 정의하지 않았습니다. Hibernate는 `ddl-auto: validate`로 스키마를 검증하며 자동으로 변경하지 않습니다.

## AI 연동

제공사 선정 후 `app.ai.base-url`을 설정하면 `llmRestClient` 빈이 활성화됩니다.
연결 제한 시간은 10초, 응답 제한 시간은 60초입니다. 제공사 인증 및 요청·응답 형식은 선정 후 구현합니다.
계획한 기능: 같은 직종의 건강 경험 글 요약, 근무 환경·관심사 기반 게시글 추천, 개인 건강 습관 기록 요약.

## 협업

Gradle Wrapper를 함께 커밋하고, DB 비밀번호·API 키·로컬 설정·업로드 파일은 커밋하지 않습니다.
GitHub 원격 저장소는 `https://github.com/HalfHackathon/4Team.git`로 연결되어 있습니다. 커밋과 push는 별도로 진행합니다.
