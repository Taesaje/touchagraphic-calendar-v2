# PROJECT_STATUS.md

> 최종 갱신: 2026-09-01
> 이 문서는 새 세션에서 작업을 이어가기 위한 현재 상태 스냅샷이다.
> 코드가 이 문서와 다르면 **코드가 정답**이다. 수정 후 이 문서도 갱신할 것.

---

## 1. 프로젝트 목적

기업·기관 대상 **맞춤 달력(캘린더) 기획·디자인·제작 회사(터치어그래픽)** 의 1페이지 랜딩.
방문자가 회사 → 제작 사례 → 서비스 → 고객사 → 견적 계산 → FAQ → 상담 순으로 훑고,
견적 계산기에서 예상 금액을 확인한 뒤 상담을 신청하도록 유도하는 구조.

editorial / print-studio 톤(대형 타이포그래피, 넓은 여백, 얇은 선, 인쇄 감성의 크롭마크·레지스트레이션 마크).
accent 색상은 행동 지점에만 제한적으로 사용하되, **섹션별로 accent가 갈린다** (아래 참고):
- Service / FAQ = orange-red `#FF2D16` (BTY+ 레퍼런스 실측색)
- Contact = `#D65A34` 계열 (구 디자인 시스템 accent)
- Estimator(EstimatorInline) = 액션/선택색이 **black `#1A1A1A`** (브랜드에 orange 근거 없다는 판단), CMYK 도트만 그래픽 모티프
- Header 빠른상담 버튼 = `#1E50E0` (임시 브랜드색, 확정 후 교체)

---

## 2. 현재 기술 구조

- **React 19 + React DOM 19**, 함수형 컴포넌트 + Hooks (`useState` / `useEffect` / `useRef` / `useLayoutEffect`)
- **Vite 8** 빌드 (`@vitejs/plugin-react`, `@tailwindcss/vite`, Figma Make 플러그인, `@` → `src` alias)
- **Tailwind CSS v4** (config 파일·PostCSS 없음). `src/index.css`에서 `@import 'tailwindcss';` + `@theme` 토큰
- **TypeScript 5.7**, 포매터 **oxfmt**
- 툴체인 버전: `.mise.toml` (Node.js, pnpm) — 단, 로컬 작업은 `npm` 사용
- 상태 관리 라이브러리 없음. 라우터 없음 — `App`의 `view` state(`'landing' | 'consult'`)로 화면 전환
- 전체 페이지가 **`src/App.tsx` 단일 파일**(약 2,400줄)에 모든 섹션 컴포넌트로 존재
- 글로벌 디자인 시스템은 **`src/index.css`**: 폰트 `@import`(Noto Serif KR / Noto Sans KR), `@theme` 토큰,
  `body`(`word-break: keep-all`), `.u-shell` / `.u-rail-pad` / `.u-section*` / `.t-*` 타이포 스케일,
  `.slip-perf` 천공 효과, `.pf-card`(포트폴리오 hover), `.svc-arrow`/`.svc-row`(Service hover), `.faq-panel`(FAQ 아코디언)
- 색상·폰트가 `src/App.tsx`에 **인라인 하드코딩**된 곳이 많음
  (`#FF2D16` / `#D65A34` / `#B84A28` / `#1E50E0` / `#1A1A1A` / `#666666` / `#555555` / CMYK 4색,
   `fontFamily: 'Noto Sans KR' / 'Noto Serif KR'`). 토큰만 바꿔서는 반영 안 됨 — `App.tsx`도 함께 검색
- 공통 좌우 시작선: 일반 섹션 = `SHELL`(`u-shell`, `max-width:1920px`, `padding-inline: clamp(20px,5vw,100px)`).
  일부 섹션은 그 안에서 nested container로 폭을 더 제한:
  Service `max-w-[1200px]`, FAQ `max-w-[1120px]`, 레거시 Consultation/FAQ/Footer는 `max-w-[1360px]/960px/1080px`
- 이미지 assets: `src/imports/*.jpg`(캘린더 사진 `1.jpg`~`12.jpg` 중 일부 + 포트폴리오용 jpg 5개)를 import — **전부 임시 배치, 용량 과다**

---

## 3. 현재 렌더 순서

`App()` → `view === 'landing'` 일 때 (`src/App.tsx` 하단 `App` 컴포넌트):

```
Header → Hero → Portfolio(제작 사례) → Service → Clients → EstimatorSection → FaqSection → Contact
```

- `Header`는 `position: fixed`
- `EstimatorSection`(`id="estimator"`)이 내부에서 `EstimatorInline`을 렌더
- `FaqSection`(`id="faq"`)은 EstimatorSection 아래 / Contact 위 — **신규 섹션**
- `view === 'consult'` 일 때는 랜딩 대신 `ConsultForm` 전체 화면만 렌더
  (`EstimatorInline`의 "상담 신청하기 →" 버튼이 `setView('consult')` 호출)
- 미렌더 레거시(파일에 정의만 남음, `void`): `TrustStrip` · `Consultation` · `FAQ`(구 6문항) · `Footer` · `EstimatorPage`

---

## 4. Header 현재 상태

- `fixed top-0`, `bg-white/95 backdrop-blur-sm`, 하단 얇은 border(`border-black/[0.07]`)
- 높이 `h-[64px]` (lg 이상 `h-[96px]`)
- **media-palette.co.kr 데스크톱 헤더 구조를 기준으로 scale/spacing 조정 완료** — 현재 실측 근사값:
  - 컨테이너 = `SHELL`(Hero와 좌우 시작선 일치), `grid grid-cols-[1fr_auto_1fr]` `gap-6`
  - **좌**: 텍스트 로고 `터치어그래픽` (`Noto Sans KR` extrabold, `text-[17px] lg:text-[22px]`, `tracking-[-0.02em]`)
  - **중앙 (lg 이상 전용)**: rounded gray nav 컨테이너 `h-[56px] rounded-[11px] bg-black/[0.05] px-3`.
    항목 5개 + 항목 사이 세로 구분선(`h-3 w-px bg-black/[0.16]`). 링크 `px-[30px] py-2 text-[17px] font-semibold`
    - `HEADER_NAV = [About(#about), Portfolio(#portfolio), Service(#service), Estimate(#estimator), Contact(#contact)]`
  - **우 (lg 이상)**: 버튼 2개, 각 `h-[54px] lg:min-w-[148px] px-[30px] rounded-[10px] text-[16px] font-bold`
    - `빠른상담`: 배경 `#1E50E0`(**임시색**), `href="#contact"` 연결됨
    - `회사소개서`: 흰 배경 + `border-black/25`, hover 시 black 반전, `href="#"` **미연결**
  - **lg 미만**: 로고 + `제작 문의` 버튼만 (`scrollToContact()` → `#contact`). 모바일 헤더는 별도 재디자인 안 함
- Header ↔ Hero 관계: Hero 상단 padding(`pt-[112px] lg:pt-[200px]`)이 고정 헤더 높이 + 여백을 확보
- Header ↔ CTA 관계: 데스크톱 `빠른상담`, 모바일 `제작 문의` 모두 목적지가 `#contact`(맨 아래 Contact 섹션). Estimate 항목만 `#estimator`

### 앵커 연결 상태
- `#portfolio` → OK (`Portfolio` 섹션)
- `#service` → **OK로 변경됨** (`Service` `<section id="service">` 부여 완료)
- `#estimator` → OK (`EstimatorSection`)
- `#contact` → OK (`Contact` 섹션)
- `#about` → **여전히 대상 섹션 없음** (About 섹션 미존재)

---

## 5. Hero 현재 상태와 카피

- 흰 배경, **이미지 없음**, 강한 black 타이포그래피, 넓은 여백. `Noto Sans KR` 인라인
- 상단 pt `pt-[112px] lg:pt-[200px]`, 하단 pb `pb-[44px] lg:pb-[80px]`
- 구조: 작은 descriptor(위) → `grid lg:grid-cols-12` 로 좌측 대형 2줄 headline + 우측 supporting
- typography 현재값 (layout-master 구도, 카피는 실제 문구 확정):
  - descriptor: `text-[13px] lg:text-[16px]` `font-normal` `text-black/80`
  - headline `h1` (`lg:col-span-7`): `fontWeight: 700`, `fontSize: clamp(36px, 4.6vw, 66px)`, `lineHeight: 1.3`, `letterSpacing: -0.025em`
  - supporting 1줄: `fontWeight: 500`, `clamp(18px, 2.1vw, 32px)`, `lineHeight: 1.35`
  - supporting 2줄: `fontWeight: 700`, 같은 크기, 단어 사이에 `h-px w-16 bg-black/35` 짧은 가로선. lg에서 우측 하단 정렬(`lg:items-end lg:justify-end`, `lg:text-right`)

### 현재 카피 (그대로)
- descriptor: `기업·기관 맞춤 달력 기획·디자인·제작`
- headline (좌): `기업 / 기관` <br> `달력 제작 회사`
- supporting (우):
  - 1줄 (500): `달력 잘 만드는 전문 디자이너가`
  - 2줄 (700): `기획부터` ──(가로선)── `제작까지 함께합니다`

---

## 6. Portfolio (= "제작 사례") 현재 상태

- 워딩 변경 완료: 섹션 제목이 **`제작 사례`**, 그 옆 작은 캡션이 **`Portfolio`**
- `<section id="portfolio" className="bg-white">`, `pt-[44px] pb-[32px] md:pb-[56px] lg:pt-[72px] lg:pb-[84px]`
- 상단: `SHELL` 컨테이너에 제목 `제작 사례` + `Portfolio` 캡션 + 우측 `포트폴리오 전체보기 ›` (**텍스트만, 링크 미연결**)
  - 제목 `h2`: `Noto Sans KR` `700` `clamp(24px, 3.8vw, 60px)` `letterSpacing -0.025em`

### 가로 auto-scroll 레일
- 본문: **풀-width 가로 스크롤 레일**. `viewportRef` div가 `overflow-x: auto` → 페이지 가로 밀림 없음
- 트랙 좌우 padding = `u-rail-pad`(`clamp(20px,5vw,100px)`) → 첫 카드가 제목 시작선과 정렬
- 트랙 `paddingTop: 40px / paddingBottom: 28px`(카드 상단·그림자 잘림 방지), `gap: clamp(16px, 1.5vw, 26px)`
- **continuous auto-scroll**: `requestAnimationFrame` + delta-time, `TARGET_SPEED = 60px/s`(desktop).
  `[...EXHIBITIONS, ...EXHIBITIONS]` 복제 트랙으로 seamless infinite loop(복제분은 `aria-hidden`).
  속도는 `glide()` 로 목표값까지 smoothstep 보간, `scroll-snap` 은 제거(`scrollSnapType='none'`)
- **감속/재개 트리거**: 실제 카드 이미지(`[data-card-img]`) hover / pointer 드래그 / touch / 수동 wheel(트랙패드) / 키보드 focusin
  → 부드럽게 감속 정지 → 일정 시간(650~850ms) 뒤 부드럽게(≈520ms) 가속 재개
- **조작 방식**: 네이티브 가로 스크롤(트랙패드) · 터치 스와이프(네이티브에 위임) · 마우스 드래그(pointer 이벤트, `pointerType==='touch'` 는 제외)
- `prefers-reduced-motion: reduce` → auto-scroll 없음, `.pf-card` hover scale 없음 (드래그/스와이프/트랙패드는 그대로)

### 카드 layout / hover
- 카드 `<figure>` 폭 `clamp(300px, 22vw, 360px)`
- 이미지 wrapper `.pf-card`: `aspect-ratio: 3 / 4`, `rounded-[12px]`, `bg-black/[0.04]`
- hover(hover-capable 기기만): `.pf-card:hover { transform: scale(1.06) translateY(-3px); box-shadow: 0 14px 32px rgba(0,0,0,0.14); z-index: 10 }` — width/height/margin 불변이라 옆 카드 안 밀림, caption 은 scale 안 함
- caption(이미지 아래, 박스 없음): 제목 `t-body font-semibold text-black`, meta `t-caption text-black/45`
- `isText` 카드 1개: border 박스 안에 `Noto Serif KR` 큰 문구 (`너는 네 삶을 바꿔야 한다 …`)

### 알려진 문제 (내용 임시)
- `EXHIBITIONS` 14개(이미지 13 + isText 1)가 **전시·행사명 임시** (`프리즈 서울`, `경기도자비엔날레`, `제16회 광주비엔날레`, `부산비엔날레 2026`, `제주비엔날레` …) — 나머지는 `title: '행사·전시 아카이브'`, `meta: '이미지 교체 예정'`
- 이미지도 캘린더 사진 임시 배치 → **실제 제작 결과물 이미지로 교체 필요**
- `포트폴리오 전체보기 ›` 링크 미연결

---

## 7. Service 현재 상태

- `<section id="service" className="bg-white u-section scroll-mt-24">` — **`id="service"` 부여 완료** (Header `#service` 앵커 연결됨)
- 내부 nested container `max-w-[1200px] mx-auto` (BTY+ 서비스 블록 비율 ≈1184px 기준으로 좁힘. 전역 `.u-shell` 은 안 건드림)
- **btyplus.co.kr(BTY+) 레퍼런스 기반 layout** — 카드 UI 아님. 또렷한 typography + 얇은 선 + 여백 중심
- 구조:
  - 작은 label: `w-1.5 h-1.5 rounded-full` orange dot(`#FF2D16`) + `서비스` 텍스트(`Noto Sans KR` `700` `14px` `#FF2D16`)
  - headline `h2` (`Noto Sans KR` `800` `clamp(30px, 3.6vw, 56px)` `lineHeight 1.2` `letterSpacing -0.035em`):

    ```
    기획부터 제작,
    납품까지 한 번에.
    ```

  - `SERVICE_ROWS` 4행: `mt-11 lg:mt-16 border-t border-black/35`, 각 행 `svc-row border-b border-black/35 py-8 lg:py-11`
    - 모바일 grid `grid-cols-[1fr_auto]`, lg grid `grid-cols-[70px_34%_minmax(0,1fr)_30px] gap-x-9 items-center`
    - A. number: `Noto Sans KR` `700` `#B5B5B5` `13/15px`
    - B. service title: `Noto Sans KR` `800` `clamp(24px, 2vw, 34px)` black
    - C. description: `Noto Sans KR` `500` `clamp(15px, 1vw, 16px)` `#666666`
    - D. **orange arrow** SVG(`#FF2D16`). hover 시 `.svc-row:hover .svc-arrow { transform: translateX(6px) }` + divider 색이 아주 미세하게 진해짐(`border-bottom-color rgba(0,0,0,0.5)`). 실제 링크 아님(cursor pointer/underline/background 없음). `prefers-reduced-motion` 에서 transition 없음

### 현재 카피 (그대로 — 실제 사업 내용)
- headline: `기획부터 제작,` <br> `납품까지 한 번에.`
- 01 `달력 제작 기획` — 템플릿 선택부터 브랜드 맞춤 기획까지.
- 02 `맞춤 디자인` — 로고 적용부터 표지·내지 맞춤 디자인까지.
- 03 `제작 및 후가공` — 제본부터 박·형압 등 다양한 후가공까지.
- 04 `인쇄 & 납품` — 최종 인쇄·검수·포장 후 일정에 맞춰 납품.

---

## 8. Clients 현재 상태 (placeholder)

- `<section className="bg-white u-section">` (id 없음). 렌더 순서상 Service 다음, EstimatorSection 앞
- 제목 `Clients`(`t-display`) + 카피 `약 5,300여 개의 기업과 함께해왔습니다.`
- `CLIENT_NAMES` 14개(`LG`, `화성시`, `경기도`, `KAIST`, `세종대학교`, `단국대학교`, `국민대학교`, `신한금융그룹`, `광주과학기술원`, `근로복지공단`, `국민연금공단`, `한국가스공사`, `서울특별시교육청`, `식품의약품안전처`)
- 그리드 `grid-cols-2 md:grid-cols-4 lg:grid-cols-7`, 셀 `aspectRatio: 3/2`, 인접 border 겹침(`-mt-px -ml-px`)
- **실제 로고 이미지 없음** — 텍스트만(`t-caption text-black/35`). 안내 문구 존재: `* 로고 자리 — 실제 로고 이미지로 교체 예정`
- 고객사 명단 확정 여부 미확인

---

## 9. Estimator (EstimatorSection → EstimatorInline) 현재 상태

**현재 실제 사용 중인 견적 계산기.** 구 `#dbd7c8` 도트 배경 + 좌 컨트롤/우 견적서 슬립 버전은
이제 **미렌더 레거시 `EstimatorPage`** 이며 손대지 않는다(§13, AGENTS.md 규칙 6).

- Wrapper `EstimatorSection`: `<section id="estimator" className="bg-white u-section-sm" style={{ scrollMarginTop: '56px' }}>`, 내부 `SHELL`
- **Sincerely UX 기반 configurator로 리디자인 완료** — 좌 preview / 우 progressive accordion / 하단 sticky 요약
- **Touchgraphic visual tone 적용**: 흰 배경 + hairline rule 중심, radius 는 pill 또는 0,
  액션/선택색 = **black `#1A1A1A`(`CFG_INK`)**. CMYK 도트(`#4CACE9`/`#DB438F`/`#FDF251`/`#1A1A1A`)는 masthead 라벨 장식으로만
- 폰트: `Noto Sans KR`, `letterSpacing: -0.01em` (`CFG_KR`)

### 마스트헤드
- 얇은 라운드 라벨(border 0.8px) 안에 CMYK 도트 4개 + `PRINT ESTIMATE / 견적`
- `h2` (`Noto Sans KR` `700` `clamp(24px, 3.2vw, 42px)`): `2027 브랜드 캘린더` <br> `견적 계산기`
- 우측 안내 문구: "제작 등급과 옵션을 순서대로 선택하면 아래 견적 요약에 예상 금액이 바로 반영됩니다. 표시 금액은 부가세·인쇄·배송 실비 별도입니다."
- 하단 `border-b border-ink`

### 2열 (`grid lg:grid-cols-2 gap-8 lg:gap-12 items-start`)
- **좌: 캘린더 미리보기 (`lg:sticky lg:top-[104px]`)**
  - `CalendarPreview` — 스파이럴 제본 캘린더를 그리는 SVG. 비율은 선택된 `사이즈` 옵션 → `SIZE_RATIO`(A 4:3 / B 3:4 / C 1:1 / D 16:9), 미선택 시 4:3
  - 배경 `#FBFCF8` + border, 모서리에 `RegMark` 2개
  - 아래 캡션: 현재 tier 이름 + `사이즈` 라벨(또는 `사이즈 미선택` / `d.subtitle`), addon 활성 시 `작가 협업 포함` 표기
- **우: progressive accordion**
  - `steps` = 현재 tier의 실제 데이터만으로 구성: `제작 등급`(tier) + (template 한정) 옵션 그룹 `사이즈` / `표지 스타일` / `내지 레이아웃` + (custom_basic·custom_highend 한정) `addon`
  - `AccordionRow`: 헤더(번호 `NN` · 라벨 · 선택값 · `✓ 선택 완료`/hint · `count` · chevron) + 본문 애니메이션(`grid-template-rows 0fr↔1fr`, 220ms)
  - `TierRow`: 플랜명 + subtitle + `{wonFmt(tierBaseTotal(id))}원~` + `CheckDisc`. 선택 시 `border 1.5px solid #1A1A1A` + `bg rgba(26,26,26,0.045)`
  - `OptionRow`: 60px SVG 썸네일(`SizeSvg` / `LAYOUT_THUMBS` / `NeutralTile`) + 라벨 + `CheckDisc`
  - `addon` 단계: 안내 문구 + (필수면) "이 등급의 필수 구성입니다." / (선택형이면) 포함·포함하지 않음 토글.
    활성 시 `컷당 단가` range 슬라이더(`step={50000}`, min/max = addon 값) + `총 N컷` 금액
  - **progressive 동작**: 한 단계에서 유효 선택 → 현재 단계 닫고 → 다음 단계 자동 open + `scrollIntoView`
  - `진행 조건`: `d.rules` 목록(`—` 불릿)
- **하단 요약 (`lg:sticky lg:bottom-0`, `bg-white border-t border-ink`)**
  - 좌: `선택 플랜` + tier 이름 + `summaryChips`(선택 옵션들 ` · ` 결합)
  - 중: `현재 예상 견적` + `{wonFmt(animatedTotal)}원` (`clamp(20px, 3.4vw, 26px)`, `useAnimatedNumber` 롤링)
  - 우: 버튼 2개 — `견적 텍스트 복사`(pill outline, `navigator.clipboard`) / `상담 신청하기 →`(pill, `bg #1A1A1A`, `onConsult` → `consult` 뷰)
  - 고지: `부가세·인쇄·배송 실비 별도 · 최종 견적은 상담 후 확정됩니다.` + `기준일 {오늘날짜}` + `copyStatus`

### 동결 유지
- 가격 데이터(`TIER_DATA`)·계산 로직(`tierBaseTotal` / `wonFmt` / `total` / `addon*` / `useAnimatedNumber`)은 **그대로**. §13 참조

---

## 10. FAQ (FaqSection) 현재 상태 — 신규 섹션

- `<section id="faq" className="bg-white pt-[64px] lg:pt-[80px] pb-[80px] lg:pb-[112px] scroll-mt-24">`, 내부 `SHELL`
- 위치: **EstimatorSection 아래 / Contact 위** 에 신규 추가
- Service 의 visual language 계승: orange accent(`#FF2D16`) · `Noto Sans KR` gothic · thin rule · 넓은 whitespace
- **FAQ width / spacing 최근 수정 상태**: 내부 reading column `max-w-[1120px] mx-auto` (Service `1200px` 보다 약간 좁게).
  상단 label `mb-5`, headline 아래 accordion `mt-9 lg:mt-12 border-t border-black/30`
- 상단 label: orange dot(`#FF2D16`) + `자주 묻는 질문` (`Noto Sans KR` `700` `14px`)
- headline `h2` (`Noto Sans KR` `800` `clamp(30px, 3.6vw, 56px)` `lineHeight 1.15` `letterSpacing -0.035em`): `궁금한 점.`
- **accordion**: `FAQ_QA` 4문항. `FaqRow` 컴포넌트, **한 번에 하나만 open** (`open` state = `number | null`)
  - **첫 질문(index 0) 기본 open** (`useState<number | null>(0)`)
  - 질문 `700` `clamp(17px, 1.3vw, 21px)`, 우측 `+ / −` 아이콘(`#FF2D16`, 열리면 세로선 사라짐)
  - 답변 패널: `useLayoutEffect` 로 height `0 ↔ scrollHeight ↔ auto` 애니메이트(`.faq-panel`, 280ms). 모바일 재줄바꿈에도 안 잘림. `prefers-reduced-motion` → 즉시
  - 답변 스타일: `max-w-[680px]` `Noto Sans KR` `400` `clamp(15px, 1vw, 16px)` `lineHeight 1.8` `#555555`

### 현재 질문 4개와 답변 (그대로)
1. **터치어그래픽은 어떤 회사인가요?** — "터치어그래픽은 기업·기관을 위한 달력을 기획하고 디자인·제작하는 전문 스튜디오입니다. 간단한 템플릿형 제작부터 브랜드에 맞춰 처음부터 설계하는 맞춤형 달력까지, 기획·디자인·제작·납품 전 과정을 함께 진행합니다."
2. **다른 회사와 달력 서비스의 차이가 있나요?** — "단순히 정해진 달력을 인쇄하는 데 그치지 않고, 브랜드의 목적과 분위기에 맞춰 기획과 디자인부터 함께할 수 있다는 점이 가장 큰 차이입니다. 예산을 낮춘 템플릿형부터 표지·내지·그래픽·후가공까지 새롭게 설계하는 풀커스텀 제작까지 폭넓게 대응합니다."
3. **원하는 수량과 예산에 맞춰 제작할 수 있나요?** — "네. 수량과 예산에 따라 템플릿형 또는 맞춤 제작 방식으로 진행할 수 있습니다. 용지·제본·후가공 등의 사양도 조정할 수 있어, 필요한 범위에 맞춰 제작 방향과 견적을 함께 정리해드립니다."
4. **달력 제작 기간은 얼마나 걸리나요?** — "제작 기간은 디자인 범위와 수량, 인쇄·후가공 사양에 따라 달라집니다. 템플릿형은 비교적 빠르게 진행할 수 있고, 맞춤형은 기획과 디자인 과정이 포함되므로 여유 있는 일정이 필요합니다. 원하는 납품일을 알려주시면 가능한 일정을 먼저 확인해드립니다."

> 파일에는 구 `FAQ` 컴포넌트(`FAQ_ITEMS` 6문항, ivory 배경)도 남아 있으나 **미렌더 레거시**다. 현재 사용은 `FaqSection` + `FAQ_QA`.

---

## 11. Contact 현재 상태와 아직 정리 필요한 부분

- `<section id="contact" className="bg-black text-white" style={{ scrollMarginTop: '56px' }}>` — 페이지 최하단, 풀-width 검정. 내부 `${SHELL} u-section`
- 좌측(`lg:col-span-5`): orange dot(`#D65A34`) + `상담 문의`(`t-label`) → `h2 t-section` `제품 이야기를` <br> `들려주세요.`(`color #D65A34`) → `30분 무료 상담. 영업일 1일 이내 회신드립니다.` → 이메일 링크
- 우측(`lg:col-span-6`): `ContactForm`
  - 이름* / 전화번호 / 이메일(+ "전화·이메일 중 편한 곳 하나만 주셔도 됩니다.") / 관심 서비스 pill(복수 선택) / 내용 textarea / 제출 버튼 `무료 상담 신청하기`(`bg #D65A34`)
  - 제출 시 `submitted` state → 완료 화면(`상담 신청이 접수되었습니다.` / `영업일 1일 이내에 회신드리겠습니다.`). **실제 전송 로직 없음**
- 하단: `© 2026 터치어그래픽 · TOUCHGRAPHIC`

### 아직 placeholder / 정리 필요
- 좌측 이메일 `junghwan.park@btyplus.co.kr` — **레퍼런스(BTY+) 주소, 교체 필요**
- `ContactForm` 상단 실적 문구 `13년 1,000건+ · 누적 펀딩 200억+ · 크몽 ★4.8 (297건)` — **타 업종 실적**
- `CONTACT_SERVICES` pill `['브랜드 런칭 파트너십', '와디즈 상세페이지', '이커머스 상세페이지', '촬영', '영상', '광고소재']` — **타 업종**
- 내용 placeholder `제품, 목표, 일정 등 자유롭게 적어주세요.` — 캘린더 맥락으로 손볼 여지
- 폼 제출 = 프런트 `submitted` 토글만. 실제 메일/시트 전송·스팸 방지 없음
- accent 가 이 섹션만 `#D65A34` 계열(Estimator black, Service/FAQ `#FF2D16` 와 불일치) — 브랜드색 확정 시 통일 검토
- 미렌더 레거시 `Consultation` 도 `id="contact"` 를 중복 보유(현재 렌더 안 되므로 충돌 없음)

---

## 12. 아직 해결해야 할 문제

| # | 위치 | 문제 |
|---|------|------|
| 1 | Header | `#about` 대상 섹션 없음 (About 섹션 미존재) — nav 항목 유지/삭제 결정 필요 |
| 2 | Header | `회사소개서` 버튼 `href="#"` 미연결, `빠른상담` 배경 `#1E50E0` 임시색 |
| 3 | Portfolio | `EXHIBITIONS` 캡션이 전시·행사명 임시. 다수 항목 `이미지 교체 예정` |
| 4 | Portfolio | 카드 이미지가 캘린더 사진 임시 — 실제 제작 사례 이미지 필요 |
| 5 | Portfolio | `포트폴리오 전체보기 ›` 링크 미연결 |
| 6 | Clients | 실제 로고 이미지 없음 — 텍스트 placeholder 그리드. 명단 확정 여부 미확인 |
| 7 | Contact | 좌측 이메일 `junghwan.park@btyplus.co.kr` 임시(레퍼런스 주소) |
| 8 | Contact | 실적 문구 `13년 1,000건+ …`, `CONTACT_SERVICES` pill 타 업종 |
| 9 | Contact | 폼 실제 전송 로직 없음 (submitted 토글만) |
| 10 | 전역 | accent 색 섹션별 불일치(`#FF2D16` / `#D65A34` / `#1A1A1A` / `#1E50E0`) — 브랜드색 확정 후 정리 |
| 11 | 전역 | 이미지 assets 원본 용량 과다(최대 `12.jpg` ≈ 11MB). 실데이터 교체 시 최적화 필요 |
| 12 | SEO | `.figma/make/site.json` `robots.index: false` → 빌드 결과에 `noindex` meta + `robots.txt Disallow: /`. `<title>` 기본값("Figma Make App"), description 은 영문 자동 생성문, GA 미설정 |
| 13 | 구조 | 색상·폰트 인라인 하드코딩 산재 — 토큰화 여지(요청 시에만) |

---

## 13. 견적 계산기에서 절대 변경하면 안 되는 데이터와 로직

> AGENTS.md 규칙 5·6. **명시적으로 요청받지 않는 한 아래는 절대 수정 금지.**
> 수정 대상은 `EstimatorInline`(현재 사용) 이며, `EstimatorPage`(레거시)는 건드리지 않는다.

### 동결 대상 — 데이터 (`src/App.tsx` `TIER_DATA`)

- **`template` (Template Plan)** `breakdown`
  - 템플릿 이용료 `100000`
  - 표지 디자인 `300000`
  - 내지 세팅 `500000`
  - `options`: `사이즈` 4종(`A · 가로형`/`B · 세로형`/`C · 정사각`/`D · 와이드`) / `표지 스타일` 2종(`불꽃양 그래픽`/`2027 타이포그래피`) / `내지 레이아웃` 4종(`2분할`/`4분할`/`5분할`/`미니 달력형`)
- **`custom_basic` (Custom Basic)** `breakdown`
  - 기획 PT `1000000`
  - 표지 디자인 `1000000`
  - 내지 디자인 (24p) `2400000`
  - AI 비주얼 애드온 `400000`
  - `addon`: `외부 작가 일러스트 협업`, `cuts: 12`, `min: 500000`, `max: 1000000`, `defaultCut: 750000`, `required: false`
- **`custom_highend` (Custom High-End)** `breakdown`
  - 기획 PT `3000000`
  - 키비주얼 표지 `2000000`
  - 내지 디자인 (24p) `4800000`
  - `addon`: `작가 협업 (필수 항목)`, `cuts: 13`, `min: 500000`, `max: 1000000`, `defaultCut: 500000`, `required: true`
- 각 등급의 `rules`(진행 조건) 문구
- `TIER_ORDER = ['template', 'custom_basic', 'custom_highend']`

### 동결 대상 — 로직

- `tierBaseTotal(id)` — `breakdown` 합 + (`addon.required`이면 `cuts * min` 가산)
- `wonFmt(n)` — `Math.round` 후 `toLocaleString('ko-KR')`
- `EstimatorInline` 합계 계산:
  - `total = d.breakdown.reduce(합) + (addonActive ? addonCost : 0)`
  - `addonActive = addon.required || (addonOn[tier] ?? false)`
  - `addonCost = (addonPerCut[tier] ?? addon.defaultCut) * addon.cuts`
- 초기 state: `addonOn = { custom_basic: false, custom_highend: true }`, `addonPerCut = { custom_basic: 750000, custom_highend: 500000 }`
- 슬라이더 `step={50000}`, `min`/`max`는 `addon` 값
- `useAnimatedNumber` — 표시용 숫자 애니메이션(계산 결과에 연결됨, 임의 변경 금지)
- `copyText()` 견적 텍스트 출력 포맷

### 변경 가능 (요청 시, 최소 범위)

- `EstimatorSection` wrapper의 폭·여백·배경
- 계산기 내부의 순수 시각 요소(타이포·색·간격·썸네일 SVG 스타일·accordion 인터랙션)
- 마스트헤드/안내 문구 등 **금액과 무관한** 카피

---

## 14. 주요 디자인 레퍼런스

| URL | 참고 포인트 |
|-----|-------------|
| https://media-palette.co.kr/ | Header scale/spacing (좌 로고 / 중앙 rounded gray nav / 우 액션 버튼 2개) |
| https://btyplus.co.kr/ | Service 블록 layout(number/title/desc/arrow row), 섹션 구성 |
| Sincerely (configurator) | Estimator UX — 좌 preview / 우 progressive accordion / 하단 요약 |
| https://www.touchagraphic.com/ | Estimator visual tone (white·black, hairline, 최소 radius, CMYK 도트 모티프) |
| `references/layout-master.png` | Hero / Portfolio / Clients / Contact 1차 리디자인 레이아웃 시안 |

> AGENTS.md 규칙 12: 레퍼런스는 **구조·정보 위계·인터랙션 원리만** 참고. 색상·폰트·장식은 복제하지 않는다.

---

## 15. 현재 `npm run build` 상태

- **성공** (2026-09-01 확인). `vite v8.2.2` → `✓ 30 modules transformed` → `✓ built in ~0.45s`
- 빌드 오류 없음
- 산출물: `dist/assets/index-*.js` ≈ 245KB (gzip 76KB), `index-*.css` ≈ 44KB (gzip 8.4KB), `dist/index.html` ≈ 1.1KB, `dist/robots.txt`
- 경고성 사실(오류 아님):
  - 이미지 assets 원본 용량 과다 — `12.jpg` ≈ 11MB, `5.jpg` ≈ 6MB, `1·2.jpg` ≈ 4MB 등. 실데이터 교체 시 최적화 권장
  - `dist/robots.txt` = `User-agent: *\nDisallow: /` (site.json `robots.index: false` 때문). 공개 인덱싱 원하면 §12-12 참고

---

## 16. 배포 상태 (Netlify)

- `npm run build` 성공 → 최신 `dist/` 를 **Netlify production 에 배포 완료**
- 운영 URL: **https://dancing-twilight-d43fb2.netlify.app/**
- 모바일 외부(셀룰러) 접속 확인 완료
- 개인(커스텀) 도메인 구매·연결은 **아직 안 함** — 다음 작업
- Netlify 설정 파일(`netlify.toml`) 은 repo 에 없음. 빌드/배포는 Netlify UI 또는 수동 `dist` 업로드 기준

---

## 17. 아임웹(Imweb) 임베드 상태

- 아임웹 페이지에 **코드 위젯(커스텀 HTML)** 을 넣고, 그 안에서 Netlify 사이트를 `<iframe>` 으로 삽입 완료
- iframe 렌더·스크롤·견적 계산기·FAQ 아코디언 등 **기능 정상 작동** 확인
- 아임웹 자체 상단 Header(기본 내비게이션) **숨김 처리 완료**
- 아임웹 미리보기 + **실제 게시(공개) 완료**, 외부 접속 확인 완료
- 개인 도메인 구매/연결은 아직 다음 작업 (현재는 아임웹 기본 도메인으로 노출)

### 현재 아임웹 코드 위젯에 넣은 iframe 코드

> 아래는 현재 삽입해 둔 임베드의 형태다. `height` 등 세부 수치는 아임웹 코드 위젯에 실제로 붙여넣은 값과 대조해 확정할 것.

```html
<iframe
  src="https://dancing-twilight-d43fb2.netlify.app/"
  title="터치어그래픽 캘린더 랜딩페이지"
  style="width:100%; border:0; display:block; overflow:hidden;"
  height="7200"
  loading="lazy"
  referrerpolicy="no-referrer-when-downgrade"
></iframe>
```

- 현재는 **고정 height** 방식(랜딩 전체 높이를 넉넉히 잡음). 콘텐츠 높이가 바뀌면 잘리거나 빈 공간이 생길 수 있음
- 개선 여지: `postMessage` 로 자식(Netlify) → 부모(아임웹) 에 실제 문서 높이를 전달해 iframe height 를 자동 맞추는 스크립트. 단, 아임웹 코드 위젯에서 부모 측 스크립트 삽입이 가능한지 먼저 확인 필요

---

## 18. 로컬 실행 / Claude Code 실행

```bash
npm run dev      # Vite dev 서버, 기본 포트 8443 ($PORT 로 변경). 출력 URL 을 브라우저로 확인
npm run build    # 프로덕션 빌드 확인 (수정 후 필수)
npm run preview  # 빌드 결과 미리보기
```

- 개발 서버는 항상 떠 있을 필요 없음 — 브라우저 확인이 필요할 때만 실행하고 끝나면 종료
- Claude Code: 프로젝트 루트에서 `claude` 실행 → `AGENTS.md` 와 이 `PROJECT_STATUS.md` 를 먼저 읽히고 작업 지시
- 사용자가 직접 실행해야 하는 명령(로그인 등)은 프롬프트에 `! <command>` 형태로 입력

---

## 19. 다음 작업 후보

1. **개인(커스텀) 도메인 구매 및 연결** — 도메인 구입 → Netlify 커스텀 도메인 등록 + DNS → 아임웹 iframe `src` 를 새 도메인으로 교체
2. **Clients 실제 로고/내용** — 텍스트 placeholder 그리드를 실제 로고 이미지로 교체(명단 확정 후), 안내 문구 제거
3. **Contact 실제 카피/폼 전송** — 이메일 주소 실주소로, 실적 문구·`CONTACT_SERVICES` pill 캘린더용으로, 폼 실제 전송(메일/시트/스팸 방지) 연결
4. **Portfolio 실 사례화** — `EXHIBITIONS` 캡션·이미지를 실제 캘린더 제작 사례로 교체(이미지 최적화 포함), `전체보기 ›` 링크 처리
5. **Header 마무리** — `#about` 항목 유지/삭제 결정, `회사소개서` 버튼 링크, `빠른상담` 임시색(`#1E50E0`) 브랜드색 확정
6. **전체 디자인 세부 polish** — 섹션 간 리듬, accent 색 통일(`#FF2D16` / `#D65A34` / `#1A1A1A`), 타이포 정리
7. **모바일 실제 검수** — 실기기에서 가로 overflow / 잘림 / 터치 스크롤(특히 Portfolio 레일) / 아임웹 iframe 높이
8. **최종 공개 전 SEO / analytics / form 처리** — `.figma/make/site.json` 의 `robots.index`, `title`, `description` 설정 → `noindex` 해제 + `robots.txt`/OG 정비, GA 등 analytics ID, 폼 전송 엔드포인트

> 공통 원칙(AGENTS.md): 한 번에 한 섹션만, 수정 전 해당 코드 먼저 읽기, 기존 기능·상태·링크·데이터 임의 변경 금지,
> 견적 계산기 가격·계산 로직 동결, 새 badge/eyebrow/gradient 임의 추가 금지, 모바일 반응형·가로 overflow 확인, 수정 후 `npm run build`.

---

## 20. 내일 Claude Code에서 시작할 첫 프롬프트

```
이 캘린더 랜딩페이지 프로젝트의 작업을 이어간다.

먼저 프로젝트 루트의 AGENTS.md 와 PROJECT_STATUS.md 를 읽어라.
그리고 src/App.tsx 와 src/index.css 에서 실제 렌더되는 구조를 확인해라.
현재 렌더 순서는 Header → Hero → Portfolio(제작 사례) → Service → Clients →
EstimatorSection → FaqSection → Contact 이다.

현재 상태 요약:
- Header / Hero / Portfolio(제작 사례) / Service / Estimator(Sincerely 기반 configurator) /
  FAQ(신규, 4문항) 는 디자인·구조·카피가 정리된 상태다.
- 빌드 성공. Netlify(https://dancing-twilight-d43fb2.netlify.app/) 에 최신 dist 배포 완료.
- 아임웹 코드 위젯에 위 Netlify 사이트를 iframe 으로 삽입해 게시까지 완료(고정 height).
- 아직 임시/미완성: 개인 도메인 미연결, Clients 로고, Contact 임시 정보·폼 전송,
  Portfolio 사례 이미지, Header #about 처리, SEO(robots noindex / title 기본값 / GA 없음).

이번 작업: 아래 중 사용자가 지정하는 하나만 진행한다. (지정 없으면 먼저 무엇을 할지 물어라.)
  (A) 개인 도메인 구매·연결 절차 정리 및 아임웹 iframe src 교체
  (B) Contact 섹션 임시 정보 정리 (이메일 / 실적 문구 / CONTACT_SERVICES pill / placeholder)
  (C) Clients 섹션 실제 로고 반영
  (D) Portfolio(제작 사례) EXHIBITIONS 캡션·이미지 실 사례화
  (E) SEO/analytics 정비 (.figma/make/site.json 의 robots.index / title / description, GA ID)

작업 규칙:
- 지정된 한 섹션/한 종류의 문제만 수정한다. 다른 섹션·컴포넌트는 건드리지 않는다.
- 견적 계산기(EstimatorInline)의 가격 데이터(TIER_DATA)와 계산 로직은 절대 수정하지 않는다.
  미사용 레거시(EstimatorPage, Consultation, 구 FAQ, Footer, TrustStrip)도 건드리지 않는다.
- 기존 editorial / print-studio 톤, 타이포·여백 중심 레이아웃을 유지한다.
- 새 badge / eyebrow / gradient / rounded-card, 요청하지 않은 감성 카피를 임의로 추가하지 않는다.
- 데스크톱과 모바일 반응형을 모두 확인하고, 가로 overflow·잘림이 없는지 확인한다.
- 수정 후 npm run build 로 빌드 오류가 없는지 확인한다.
- 작업 완료 후 PROJECT_STATUS.md 의 해당 항목을 최신 상태로 갱신한다.

먼저 대상 섹션의 현재 코드를 읽고, 바꿀 내용을 제안한 뒤 승인받고 수정에 들어가라.
```
