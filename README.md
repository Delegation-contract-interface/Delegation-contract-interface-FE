# Delegation Contract Interface — Frontend

AI에게 위임할 작업 범위를 정의하고, 경계를 초과할 때 운영자가 승인/거절하는 **Human-in-the-Loop** 인터페이스입니다.

> "이 업무는 AI가 알아서 해, 근데 이런 상황이면 나한테 물어봐"

## 주요 기능

- **위임 계약 생성** — AI에게 허용할 툴(파일 읽기, 웹 검색 등)을 선택해 계약을 저장한다.
- **에이전트 실행** — 계약을 선택하고 메시지를 입력하면 AI가 허용된 범위 내에서 작업한다.
- **경계 확인 요청** — AI가 허용되지 않은 작업을 시도하면 SSE로 실시간 알림을 받고 승인/거절한다.

## 기술 스택

| 영역 | 기술 |
|------|------|
| 프레임워크 | Next.js 15 (App Router) |
| 언어 | TypeScript |
| 스타일 | Tailwind CSS |
| 실시간 통신 | SSE (Server-Sent Events) |
| 상태 관리 | React useState / custom hook |

## 화면 구성

```
/               홈 — 계약 만들기 / 에이전트 실행 진입
/contracts      위임 계약 목록
/contracts/new  위임 계약 생성 폼
/run            에이전트 실행 + 경계 확인 요청 UI
```

## 로컬 실행

```bash
# 1. 의존성 설치
npm install

# 2. 환경변수 설정
cp .env.example .env.local
# NEXT_PUBLIC_API_URL=http://localhost:8000

# 3. 개발 서버 시작
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

## 관련 레포지토리

- [Delegation-contract-interface-BE](https://github.com/Delegation-contract-interface/Delegation-contract-interface-BE) — FastAPI 백엔드
