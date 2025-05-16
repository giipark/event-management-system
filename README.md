# event-management-system

## Git Commit Message Convention Guide
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
