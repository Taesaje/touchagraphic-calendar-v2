# PROJECT NOW

> 이 문서는 히스토리가 아니라 "지금 상태"만 담는다. 업데이트할 때는 append하지 말고 덮어쓴다.
> 상세 이력은 `PROJECT_STATUS.md`의 섹션 번호로만 연결한다.
> commit SHA / working tree 상태는 빠르게 변하므로 이 문서에 고정하지 않는다.
> 세션 시작 시 반드시 Git에서 직접 확인한다.

## 1. 현재 기준점

- 날짜: 2026-09-15
- branch: `v2-redesign` (origin에 tracking됨)
- latest commit: 세션 시작 시 `git log -1 --oneline`으로 실제 Git에서 확인 (이 문서에 SHA를 고정하지 않음 — 실제 Git이 source of truth)
- 이번 세션 작업분은 `origin/v2-redesign`에 push 완료 + `checkpoint/2026-09-15` 브랜치로도 같은 지점에 안전 저장됨(§4). 지난 `checkpoint/2026-09-14`와 달리 이번엔 checkpoint가 `v2-redesign`과 같은 지점이라 별도 SHA를 고정 기록하지 않는다 — 필요하면 `git rev-parse checkpoint/2026-09-15`로 확인.
- GitHub remote: `https://github.com/Taesaje/touchagraphic-calendar-v2.git`
- V2 검토용 Netlify URL: `https://gleaming-naiad-0686ac.netlify.app/` (origin/v2-redesign push 시 git 연동 자동 재배포)
- build 상태: `npm run build` / `npx tsc --noEmit` 성공 (2026-09-15 기준)

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

- Landing: Header / Hero / Portfolio(캐러셀) / EstimatorSection / CertificationSection / Clients / FAQ 정상 렌더
- Portfolio 전체보기(`/portfolio`)·상세(`/portfolio/:idx`) — 실제 프로젝트 데이터, detail image 웹 최적화 asset
- Estimator(`EstimatorInline`) — 가격 계산식(`TIER_DATA`/`tierBaseTotal`)은 동결 유지, 변경 없음.
- **베이직(실속형) 표지/내지 시안 — 실제 이미지 연결 완료(2026-09-15).**
  - 표지 "2027 그래픽" 6개, 내지 디자인 6개 모두 실제 asset 연결됨(§6 경로 참고). "붉은양 일러스트"는
    아직 asset 미준비 상태로 `image: null` → "이미지 준비중" placeholder 유지.
  - 시안 비교 thumbnail: 4:3 프레임 + `object-cover` + `DesignOption.previewScale/previewX/previewY`
    metadata로 각 사진의 검은 스튜디오 배경을 크롭하고 "달력 디자인 면"을 크게 보여준다
    (`makeDesignSlots`의 `framing` 인자, `src/App.tsx` `COVER_DESIGN_FAMILIES`/`INNER_DESIGNS`).
    현재 값: 표지 2027 그래픽 `scale 1.62 / y 4`, 내지 `scale 1.72 / y 3`(6개 전부 공통값 — 실측상
    12장이 거의 동일한 카메라 세팅으로 촬영되어 개별 보정이 필요 없었음).
  - desktop 2열 / mobile 1열 그리드 유지. 각 시안 카드 우상단에 "크게 보기" 버튼 → `DesignZoomOverlay`
    (createPortal로 body에 직접 렌더링, 원본 전체를 object-contain으로 표시, ESC/바깥 클릭/닫기 버튼
    지원, 불투명 dark backdrop — 반투명 배경은 Header의 backdrop-blur와 겹칠 때 알파 블렌딩이 깨지는
    실제 Chromium 렌더링 버그가 있어 불투명으로 처리함, 코드 주석 참고).
  - "표지 스타일" / "내지 디자인" 아코디언 제목 옆 "6개 중 1개 선택" 안내 문구는 제목보다 작고 옅은
    보조 텍스트로 위계 분리(`AccordionRow`의 `sublabel` prop).
  - 이미지 파일이 없거나 404여도 `onError`로 감지해 placeholder로 자동 대체 — 깨진 이미지 아이콘 노출 없음.
  - `/inquiry?type=estimate`(InquiryPage)도 같은 `COVER_DESIGN_FAMILIES`/`INNER_DESIGNS`/`DesignGrid`를
    공유하므로 이미지·framing이 자동으로 동일하게 반영됨(중복 데이터 없음). 단 "6개 중 1개 선택"
    sublabel 위계 변경은 InquiryPage에는 적용 안 됨(원래 그 문구 자체가 없었음).
- Landing Clients/Partner 섹션(`src/App.tsx` `Clients`/`ClientsRow`/`ClientLogoCell`,
  `src/index.css` `.cl-logo`/`.cl-logo-blend`/`.cl-logo-denoise`/`.clients-marquee`/
  `.clients-row-pill`) — touchagraphic.com about-us `.about-sec03`의 구조적 DNA(OUR PARTNER
  naming, Institution/Brand grouping, horizontal logo flow, thin divider)만 가져오고 exact
  수치는 V2 전체 hierarchy에 맞춰 다시 잡음(2026-09-17).
  - "OUR PARTNER."만 유일한 main title(`clamp(40px,6.5vw,80px)`/600, Hero h1 최대 80px을
    넘지 않음, pill 없음). Institution/Brand는 secondary label(`clamp(24px,2.8vw,36px)`/700)
    + 절제된 outline capsule(`.clients-row-pill`, "TAG와 함께한 기관들/브랜드들 입니다",
    text `rgba(0,0,0,.78)`) — 각자 marquee + 옅은 divider(`border-black/20`).
    `INSTITUTION_CLIENTS`/`BRAND_CLIENTS`(`CLIENTS` 원본 배열에서 실제 기관/기업 성격 기준
    필터링, 7/5).
  - 로고는 고정 slot(`CLIENT_SLOT`, 데스크톱 260×74px, 화면당 5~7개) + 실제 max-height/
    max-width(`CLIENT_LOGO_BASE`/`logoBoxStyle`, 데스크톱 38×190px 기준, `sizeBoost`
    0.85~1.15로 실치수 보정)로 optical normalization. 개별 로고의 CSS `transform:scale()`은
    제거(대한상공회의소의 1px 테두리 crop용 `scale(1.04)`만 예외) — continuous marquee 중
    track transform과 겹쳐 불안정해지는 것을 방지. marquee 속도 52s/58s, `will-change:
    transform` + `translate3d`, 좌우 28px edge fade. 원본 브랜드 컬러 그대로 표시.
  - asset audit(canvas 픽셀 샘플링) 결과 12개 중 실제 캔버스 노이즈/테두리가 있는 건
    대한상공회의소·대구오페라하우스·이글루코퍼레이션뿐이라 나머지 로고에서 `.cl-logo`의
    alpha-cut SVG filter를 제거함(불필요한 filter는 애니메이션 중 GPU 합성 부담과 anti-aliasing
    손상 위험이 있어 "정상 asset → runtime filter 없음" 원칙 적용).
  - 알려진 과제: `설빙`(`sulbing.png`, 원본 163×31px)은 다른 로고 대비 저해상도라 확대 시 흐림
    — reference(touchagraphic.com about-us)의 현재 노출 클라이언트 로고 세트는 우리 12개와
    대부분 다른 회사라(한국수목원정원관리원만 일치 추정) 직접 대체할 clean source를 못 찾음,
    고해상도 원본/SVG 확보 시 교체 권장(§5 참고).
- `AGENTS.md`에 Engineering Guardrails 추가(작업 위험도별 대응, 기술부채 보고, Architecture Audit 기준 등)
- Git → Netlify 자동 deploy (origin/v2-redesign push 시 재배포)
- `npm run publish:v2` — build → safe staging → commit → push 자동화(기존 검증 완료)

## 4. 현재 진행 중인 작업

2026-09-15 작업(베이직 표지/내지 실제 이미지 연결, 시안 비교 thumbnail framing 개선, 확대보기
overlay 추가, "6개 중 1개 선택" 문구 위계 분리)은 로컬 검수·build/tsc 통과 후 `origin/v2-redesign`에
push 완료. 같은 지점에 `checkpoint/2026-09-15` 브랜치도 origin에 생성해 안전 저장.

working tree의 세부 modified/untracked 상태는 세션 시작 시 `git status --short`로 직접 확인한다.
PROJECT_NOW.md에는 파일별 modified/untracked 상태를 저장하지 않는다.

## 5. 다음 우선순위

1. 내지 thumbnail framing(`INNER_DESIGNS`의 `scale 1.72 / y 3`)을 사용자가 실제 화면에서 다시 보고
   조금 더 여유 있게(또는 반대로 더 타이트하게) 조정하고 싶어할 가능성이 있음 — 다음 세션에서 실제
   화면을 보고 필요 시 `previewScale`/`previewY`만 미세 조정한다. 표지 framing·4:3 비율·확대보기
   overlay·카드 선택 UX는 이미 확정되어 유지 중이므로 별다른 요청 없이는 재조정하지 않는다.
2. "붉은양 일러스트" 표지 계열 실제 시안 6장 이미지 asset 확보 및 연결(현재 "이미지 준비중"
   placeholder 상태) — 경로 규칙은 §6 참고, 확보되면 2027 그래픽과 동일한 방식으로 연결.
3. Portfolio 랜딩 카드 최종 7개 선정 확정 여부 점검(미확정 상태로 남아있음)
4. Clients 로고 중 `설빙`(`src/imports/client-logos/sulbing.png`, 원본 163×31px raster)은 확대 표시
   시 다른 로고보다 해상도가 낮아 상대적으로 흐리게 보일 수 있음 — 공식 SVG 또는 고해상도 원본
   확보되면 교체 권장(현재 CSS로 억지 확대하지 않고 원본 그대로 사용 중, 기능상 문제 없음).

## 6. 보호해야 하는 것

- Estimator 가격/계산 로직 (`TIER_DATA`, `tierBaseTotal`, `total` 계산식) — 이번 세션에서도 변경 없음
- V1 공개본 (Netlify + 아임웹, main 브랜치 기준) — V2 작업과 분리 유지
- 실제 Portfolio 데이터(`CALENDAR_PORTFOLIO`, 17개 프로젝트) 및 이미지 asset 경로
- 기존 routing 목적지 (`/`, `/portfolio`, `/portfolio/:idx`, `/inquiry`, `/inquiry?type=estimate`)
- 확정된 핵심 카피/이미지 (요청 없는 임의 변경 금지)
- 베이직 표지/내지 실제 이미지 asset 경로·파일명 규칙(고정, 실제 파일 존재):
  - 표지 "2027 그래픽": `public/estimator/basic/cover-2027/cover-2027-01.jpg` ~ `06.jpg`
  - 내지 디자인: `public/estimator/basic/interior/interior-01.jpg` ~ `06.jpg`
  - "붉은양 일러스트"는 아직 asset 없음 — 준비되기 전까지 임의의 AI 생성 이미지나 다른 사진으로
    대체하지 않는다.
- DB/API/Admin/Auth는 아직 손대지 않음 — 다음 단계에서 필요해지면 §Engineering Guardrails의
  HIGH RISK 절차(구현 전 architecture/security boundary 검토·보고)를 따른다.

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
- `public/estimator/basic/cover-2027/`, `public/estimator/basic/interior/` (베이직 표지/내지 실제 이미지)
- `scripts/publish-v2.mjs`
- `package.json`

## 8. 작업 시작 방법

새 Claude/AI 세션:

```
BUILDING_PROFILE.md → PROJECT_NOW.md → (필요 시) PROJECT_STATUS.md 관련 섹션 → 실제 코드/Git 확인
```

새 PC로 전환할 때는 먼저:

```
git fetch origin
git status
git pull origin v2-redesign
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
