# PROJECT NOW

> 이 문서는 히스토리가 아니라 "지금 상태"만 담는다. 업데이트할 때는 append하지 말고 덮어쓴다.
> 상세 이력은 `PROJECT_STATUS.md`의 섹션 번호로만 연결한다.
> commit SHA / working tree 상태는 빠르게 변하므로 이 문서에 고정하지 않는다.
> 세션 시작 시 반드시 Git에서 직접 확인한다.

## 1. 현재 기준점

- 날짜: 2026-09-08
- branch: `v2-redesign` (origin에 tracking됨)
- latest commit: 세션 시작 시 `git log -1 --oneline`으로 실제 Git에서 확인 (이 문서에 SHA를 고정하지 않음 — 실제 Git이 source of truth)
- GitHub remote: `https://github.com/Taesaje/touchagraphic-calendar-v2.git`
- V2 검토용 Netlify URL: `https://gleaming-naiad-0686ac.netlify.app/` (origin/v2-redesign push 시 git 연동 자동 재배포 확인됨)
- build 상태: `npm run build` 성공 (오류 없음, 최신 확인 기준)

## 2. 현재 사이트 구조

Landing 실제 렌더 순서 (`src/App.tsx` `App()`):

```
Header → Hero → Portfolio → EstimatorSection → CertificationSection → Clients → FaqSection
```

- `CertificationSection`은 이번 세션에서 신규 추가된 상태로, Estimator와 Clients 사이에 실제로 들어가 있음(§14 참고)

실제 route (`App()`의 `route` state 기준):

- `/` — landing (`view` state로 `landing` / `consult` 전환)
- `/portfolio` — `PortfolioPage`
- `/portfolio/:idx` — `PortfolioDetailPage`
- `/inquiry` — `InquiryPage`

## 3. 현재 완료된 핵심 기능

- Landing: Header/Hero/Portfolio(캐러셀)/Estimator/Clients/FAQ 정상 렌더
- Portfolio 전체보기(`/portfolio`) — 실제 Touchgraphic Calendar 17개 프로젝트
- Portfolio 상세(`/portfolio/:idx`) — 프로젝트별 detail image 186장(웹 최적화 asset, §26·§27)
- Estimator(`EstimatorInline`) — 가격/계산 로직 동결 상태로 정상 동작
- Clients — 실제 로고 asset 그리드
- `/inquiry` 문의 페이지 UI (§24)
- Git → Netlify 자동 deploy (origin/v2-redesign push 시 재배포, 실측 확인 완료)
- `npm run publish:v2` — build → safe staging → commit → push 자동화, 실제 여러 차례 실행해 정상 동작 검증 완료
- 인증/직접생산 신뢰 섹션(`CertificationSection`) — 구현 완료, build 성공, GitHub commit·push 완료, Netlify Git 연동 자동배포 완료, 기존 V2 URL(`gleaming-naiad-0686ac.netlify.app`)에서 인증서 카드 5장 정상 표시 확인 완료
- `AGENTS.md` / `BUILDING_PROFILE.md` / `PROJECT_NOW.md` — 모두 GitHub에 commit·push 반영 완료

## 4. 현재 진행 중인 작업

working tree 상태는 세션 시작 시 `git status --short`로 직접 확인한다.
PROJECT_NOW.md에는 파일별 modified/untracked 상태를 저장하지 않는다.

## 5. 다음 우선순위

1. `PROJECT_STATUS.md`에 인증 섹션(`CertificationSection`) 작업을 새 섹션 번호(§28)로 기록해 상세 이력 동기화
2. Portfolio 랜딩 카드 최종 7개 선정 확정 여부 점검(§6, 미확정 상태로 남아있음)

## 6. 보호해야 하는 것

- Estimator 가격/계산 로직 (`TIER_DATA`, `tierBaseTotal`, `total` 계산식)
- V1 공개본 (Netlify + 아임웹, main 브랜치 `7f9fae0` 기준) — V2 작업과 분리 유지
- 실제 Portfolio 데이터(`CALENDAR_PORTFOLIO`, 17개 프로젝트) 및 이미지 asset 경로
- 기존 routing 목적지 (`/`, `/portfolio`, `/portfolio/:idx`, `/inquiry`)
- 확정된 핵심 카피/이미지 (요청 없는 임의 변경 금지)

상세 작업 방식/판단 기준은 `BUILDING_PROFILE.md`를 따른다.

## 7. 핵심 파일

- `BUILDING_PROFILE.md`
- `AGENTS.md`
- `PROJECT_NOW.md`
- `PROJECT_STATUS.md`
- `src/App.tsx`
- `src/index.css`
- `src/data/calendarPortfolio.ts`
- `public/portfolio/calendar/`
- `scripts/publish-v2.mjs`
- `package.json`

## 8. 작업 시작 방법

새 Claude/AI 세션:

```
BUILDING_PROFILE.md → PROJECT_NOW.md → (필요 시) PROJECT_STATUS.md 관련 섹션 → 실제 코드/Git 확인
```

개발 서버:

```
npm run dev
```

작업 종료/검토본 업데이트:

```
npm run publish:v2
```

`publish:v2`는 build → safe staging → commit → push까지 자동화되어 있고 실제 여러 차례 실행해 정상 동작을 확인한 상태다(§3 참고).

## 9. Source of truth

1. 실제 코드 / Git
2. `PROJECT_NOW.md`
3. `PROJECT_STATUS.md`
4. 과거 채팅/로그

문서와 코드가 다르면 실제 코드/Git이 정답이다.
