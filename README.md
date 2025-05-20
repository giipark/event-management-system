# event-management-system
## 🎯 MSA 기반 이벤트 관리 시스템

이 프로젝트는 NestJS, MongoDB, Docker 기반으로 구축된 **이벤트 관리 플랫폼**입니다.  
이벤트 유형에 따라 다양한 참여 방식과 자동 보상 시스템을 지원하며,  
마이크로서비스 아키텍처(MSA) 구조로 서비스 간 독립성과 확장성을 고려해 설계되었습니다.

## 🚀 주요 기능

### ✅ 공통
- NestJS 기반 MSA 구조 (`auth`, `event`, `gateway` 서비스 분리)
- Docker Compose 기반 멀티 컨테이너 구성
- Swagger(OpenAPI) 자동 문서화
- JWT 인증 + 마이크로서비스 간 프록시 연동

---

### 🔐 Auth 서비스
- 회원가입 및 로그인
- 추천 코드 기반 친구 초대
- 유저 인벤토리 (포인트, 쿠폰, 아이템 보유 내역)

---

### 📦 Event 서비스
- 다양한 이벤트 유형 지원  
  (`안내형`, `참여형`, `출석체크형`, `뽑기형`, `친구초대형`)
- 보상 자동 지급 로직 (포인트, 쿠폰, 아이템)
- 당첨자 발표 및 참여 내역 확인
- 이벤트 조건 필터링 (status, type, 기간 등)
- 관리자 전용 기능 (이벤트 등록, 수정, 지급 상태 변경 등)

---

### 🧾 주요 기술 스택

| 기술                  | 설명                                     |
|---------------------|----------------------------------------|
| **NestJS**          | 백엔드 프레임워크                              |
| **MongoDB**         | NoSQL 데이터베이스, replica set 설정으로 트랜잭션 지원 |
| **Docker**          | 서비스 단위 컨테이너화                           |
| **Swagger**         | REST API 문서화                           |
| **JWT**             | 사용자 인증 및 권한 처리                         |
| **Mongoose**        | ODM(Object Document Mapper)            |
| **Package Manager** | pnpm                                   |

---

### 📁 프로젝트 구조
```yaml
/auth
└─ user, inventory 관련 기능
/event
└─ 이벤트 등록, 참여, 보상 등 전반 기능
/gateway
└─ 서비스 요청 프록시 및 보안 필터링
```

### 📌 현재 진행사항
- `참여형`, `출석체크형`, `뽑기형` 추가 예정
- 보상관련 스키마를 구체화 하여 보상 정보도 직접 등록관리 하도록 추가예정
- 간단한 관리자 대시보드 프론트엔드 추가 예정 
- 이벤트 분석 리포트 및 통계 시각화

## 🐳 프로젝트 실행 방법 (Docker Compose)

1. 이 repogitory를 clone하기:
```bash
git clone https://github.com/giipark/event-management-system.git
cd event-management-system
```
2. Docker Desktop이 설치 및 실행 중인지 확인하기.
3. 아래 명령어를 실행해 모든 서비스(gateway, auth, event, mongoDB)를 한 번에 실행하기:
```bash
# 클론 후 첫 실행시 --build 해주기
docker compose up --build

# 이전에 --build를 했었다면 재 실행시 --build 하지 않아도 됨
docker compose up
```
4. 브라우저 각각의 서비스 swagger 접속주소:
* gateway: http://localhost:3000/swagger
* auth: http://localhost:3001/swagger
* event: http://localhost:3002/swagger

5. ./auth/.env 와 ./event/.env를 만들어서 아래 내용 붙여넣기. (app이 사용하는 DB 이름)
```bash
MONGO_DB=mongodb://mongo:27017/app

JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=1h
```

✅ 어떤 서비스가 켜져 있는지 상태 확인 가능
```bash
docker compose ps
```

## 🐳 프로젝트 중지 방법 (Docker compose)
```bash
# 모든 컨테이너 완전히 중지
# 네트워크, 볼륨도 제거 (데이터는 유지됨)
# 로그도 정리됨
docker compose down

# 단순 일시정지(중지)
docker compose stop
```

## ✅ 프로젝트 참고
### 📙정리 Notion 페이지 (API 정의서, 이슈 등)
https://www.notion.so/gipark181/1f92289ab9b08086ad76f7d0ab5855ae?pvs=4

- 아래와 같이 내부 컨테이너끼리만 소통할 수 있도록 할 수 있고, swagger를 통해 볼 수 있도록 외부포트를 열어두었습니다.
```yaml
services:
  auth:
    build: ./auth
    ports: [] # ← 외부 포트 열지 않음
    expose:
      - "3001" # 내부 컨테이너끼리만 통신 가능
```

## ☑️ Git Commit Message Convention Guide
### 규칙
- `FEAT` - 새로운 기능 추가
- `FIX` - 버그 수정
- `DOCS` - 문서 수정(README, Swagger 등)
- `STYLE` - 코드 포맷팅, 세미콜론 누락 등 (논리 변경 x)
- `REFACTOR` - 리팩토링 (기능 변화 x, 코드 구조 개선)
- `TEST` - 테스트 추가 / 수정
- `CHORE` - 빌드 설정, 패키지 업데이트 등 잡다한 변경
- `PERF` - 성능 개선
- `BUILD` - 빌드 관련 파일 수정 (Dockerfile, tsconfig 등)
- `ci` - CI 설정 (Jenkins, GitHub Actions 등)
```plaintext 
💡 <type>(scope) 메시지
   예: [FEAT](auth) JWT 인증 AutoGuard 추가
```
### 추가 규칙
- 본문이 필요할 땐 한 줄 띄고 상세 내용 작성
- `“."` 마침표는 붙이지 않기.
