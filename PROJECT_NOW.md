# PROJECT NOW

> 이 문서는 히스토리가 아니라 "지금 상태"만 담는다. 업데이트할 때는 append하지 말고 덮어쓴다.
> 상세 이력은 `PROJECT_STATUS.md`의 섹션 번호로만 연결한다.
> commit SHA / working tree 상태는 빠르게 변하므로 이 문서에 고정하지 않는다.
> 세션 시작 시 반드시 Git에서 직접 확인한다.

## 1. 현재 기준점

- 날짜: 2026-09-14
- branch: `v2-redesign` (origin에 tracking됨)
- latest commit: 세션 시작 시 `git log -1 --oneline`으로 실제 Git에서 확인 (이 문서에 SHA를 고정하지 않음 — 실제 Git이 source of truth)
- 안전 checkpoint: `checkpoint/2026-09-14` 브랜치로 origin에 push 완료(커밋 `c117d2e`, local `v2-redesign`과 동일 지점). `origin/v2-redesign`에는 아직 반영되지 않았다(§4 참고) — 이 SHA는 "현재 최신 상태"가 아니라 그 시점의 고정된 복원 지점이라 예외적으로 기록한다(§V1 `7f9fae0` 표기와 동일한 성격, §6 참고).
- GitHub remote: `https://github.com/Taesaje/touchagraphic-calendar-v2.git`
- V2 검토용 Netlify URL: `https://gleaming-naiad-0686ac.netlify.app/` (origin/v2-redesign push 시 git 연동 자동 재배포 확인됨 — 이번 checkpoint는 이 브랜치에 push하지 않았으므로 재배포 없음)
- build 상태: `npm run build` / `npx tsc --noEmit` 성공 (2026-09-14 checkpoint 기준)

## 2. 현재 사이트 구조

Landing 실제 렌더 순서 (`src/App.tsx` `App()`):

```
Header → Hero → Portfolio → EstimatorSection → CertificationSection → Clients → FaqSection
```

실제 route (`App()`의 `route` state 기준):

- `/` — landing (예전 `view`='consult' 내부 전환 방식은 제거됨 — 견적 상담은 이제 `/inquiry?type=estimate`로 이동한다)
- `/inquiry` — `InquiryPage`. 쿼리 없음 = 일반 상담(Header "상담 문의"), `?type=estimate` = Estimator "이 견적으로 상담 신청하기"에서 넘어온 상담(견적 snapshot을 App state + sessionStorage로 전달)
- `/portfolio` — `PortfolioPage`
- `/portfolio/:idx` — `PortfolioDetailPage`. Landing Portfolio 캐러셀 카드도 각 프로젝트의 실제 idx로 바로 연결됨(전부 `/portfolio`로만 가지 않음)

## 3. 현재 완료된 핵심 기능

- Landing: Header(브랜드 심볼 `public/brand/touchagraphic-symbol.png` + "터치어그래픽" 워드마크 lock-up)
  / Hero(eyebrow="터치어그래픽", Header→Hero 여백 축소, 헤드라인 line-height 1.14→1.28)
  / Portfolio(캐러셀, 카드가 각 프로젝트 실제 상세페이지로 연결) / EstimatorSection / CertificationSection
  / Clients / FAQ 정상 렌더
- Portfolio 전체보기(`/portfolio`)·상세(`/portfolio/:idx`) — 실제 프로젝트 데이터, detail image 웹 최적화 asset
- Estimator(`EstimatorInline`) — 가격 계산식(`TIER_DATA`/`tierBaseTotal`)은 동결 유지. BASIC은
  표지 계열(붉은양 일러스트/2027 그래픽) → 실제 시안 6개, 내지 디자인 실제 시안 6개를 가로형 이미지
  grid에서 선택하는 구조로 개편. 사이즈는 실제 규격(mm) 기반으로 BASIC은 기성 4종만, 커스텀/하이앤드는
  기성 4종 + 별도 사이즈. "수량"은 "예상 수량"으로 통일, 300개 이하 제한 사이즈는 초과 입력 시 자동 disable
- `/inquiry` — 일반 상담과 Estimator "이 견적으로 상담 신청하기"가 하나의 페이지·하나의 데이터 모델
  (`InquiryPayload`)을 공유. 견적 선택값은 App state + sessionStorage로 유지(새로고침에도 복원).
  실제 접수 API는 아직 미연결 — `submitInquiry()` 어댑터만 존재(콘솔 로그로만 확인)
- 표지/내지 실제 시안 이미지 asset은 아직 미준비 — 현재 "이미지 준비중" placeholder 표시 중(§6)
- `AGENTS.md`에 Engineering Guardrails 추가(작업 위험도별 대응, 기술부채 보고, Architecture Audit 기준 등)
- Git → Netlify 자동 deploy (origin/v2-redesign push 시 재배포, 기존 확인 완료 — 이번 세션 변경분은
  `checkpoint/2026-09-14`에만 있고 `origin/v2-redesign`에는 아직 미반영이라 재배포되지 않았다)
- `npm run publish:v2` — build → safe staging → commit → push 자동화(기존 검증 완료, 이번 세션에는 미실행)

## 4. 현재 진행 중인 작업

2026-09-14 작업(Portfolio 카드 routing, Estimator 개편, Contact 통합, Hero/Header 브랜드 정비,
AGENTS Guardrails)은 로컬에서 완료·검수되어 `checkpoint/2026-09-14` 브랜치로 origin에 안전 저장된
상태다. `origin/v2-redesign`(Netlify production 연동 브랜치)에는 아직 push하지 않았다 — 사용자
최종 검토 후 반영 여부를 결정한다.

working tree의 세부 modified/untracked 상태는 세션 시작 시 `git status --short`로 직접 확인한다.
PROJECT_NOW.md에는 파일별 modified/untracked 상태를 저장하지 않는다.

## 5. 다음 우선순위

1. Estimator / Hero / Header 최신 localhost 상태부터 시각 검수 후 다음 수정 작업 진행
2. 표지 시안(붉은양 일러스트·2027 그래픽 각 6장) / 내지 디자인 시안(6장) 실제 이미지 asset 확보 및 적용(§6)
3. 준비되면 `checkpoint/2026-09-14`를 `origin/v2-redesign`으로 반영할지 결정
4. Portfolio 랜딩 카드 최종 7개 선정 확정 여부 점검(미확정 상태로 남아있음)

## 6. 보호해야 하는 것

- Estimator 가격/계산 로직 (`TIER_DATA`, `tierBaseTotal`, `total` 계산식)
- V1 공개본 (Netlify + 아임웹, main 브랜치 `7f9fae0` 기준) — V2 작업과 분리 유지
- 실제 Portfolio 데이터(`CALENDAR_PORTFOLIO`, 17개 프로젝트) 및 이미지 asset 경로
- 기존 routing 목적지 (`/`, `/portfolio`, `/portfolio/:idx`, `/inquiry`, `/inquiry?type=estimate`)
- 확정된 핵심 카피/이미지 (요청 없는 임의 변경 금지)
- 표지/내지 시안 이미지가 아직 없다고 임의의 AI 생성 이미지나 다른 사진으로 대체하지 않는다 — 실제
  asset 확보 전까지는 "이미지 준비중" placeholder 상태를 그대로 유지한다(§3·§5)

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
