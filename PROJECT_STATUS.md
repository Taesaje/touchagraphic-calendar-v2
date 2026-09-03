# PROJECT_STATUS.md

> 최종 갱신: 2026-09-03 (V2 리디자인 진행 중)
> 이 문서는 새 세션에서 작업을 이어가기 위한 현재 상태 스냅샷이다.
> **코드가 이 문서와 다르면 코드가 정답이다.** 수정 후 이 문서도 갱신할 것.
> 기준 파일: `src/App.tsx` (단일 파일, 약 2,485줄) · `src/index.css` · 현재 branch `v2-redesign`.

---

## 0. V1 → V2 무엇이 바뀌었나 (요약)

- **섹션 순서**: `Header → Hero → Portfolio → Estimator → Clients → FAQ` (아래 §3)
- **Service 섹션 제거** — 컴포넌트 정의는 파일에 남아있으나 렌더하지 않음
- **Contact 섹션 제거** — 마찬가지로 정의만 남고 미렌더. 하단 마무리는 FAQ 가 이어받음
- **FAQ 가 사이트 마지막 섹션** — full-width **black** 배경, 흰 텍스트, 4문항. 구 Contact 의 몰입/마무리 역할 대체
- **Portfolio** — 구 4:5 세로 썸네일 세트 → **가로형(4:3) 원본 제작사진 1장 + 아래 텍스트(카테고리/업체명/한 줄 설명)** editorial 카드. "정지 → 카드 1장 slide → 정지" 스텝 모션 + 무한 루프
- **Estimator** — 제목 `달력 견적 계산기`. 제작 등급 표시명 `베이직 (실속형)` / `커스텀 (맞춤형)` / `하이앤드 (기획형)`. 공통 단계 `01 제작 등급 → 02 사이즈 → 03 내지 레이아웃`. **작가 협업(addon) 옵션 완전 제거**. 하단 CTA `이 견적으로 상담 신청하기 →` 1개
- **배포**: V1 공개본(Netlify + 아임웹)은 **그대로 유지**. V2 는 아직 미배포이며, **의사결정권자 검토용으로 별도 Netlify 사이트에 배포 예정**

---

## 1. 프로젝트 목적

기업·기관 대상 **맞춤 달력(캘린더) 기획·디자인·제작 회사(터치어그래픽)** 의 1페이지 랜딩.
방문자가 회사 소개 → 제작 사례 → 견적 계산 → 고객사 → FAQ 순으로 훑고,
견적 계산기에서 예상 금액을 확인한 뒤 상담(consult 뷰)을 신청하도록 유도하는 구조.

editorial / print-studio 톤(대형 타이포그래피, 넓은 여백, 얇은 선, 인쇄 감성의 크롭마크·레지스트레이션 마크).
accent 색상은 행동 지점에만 제한적으로 사용하되 **섹션별로 accent가 갈린다**:
- FAQ label / 아이콘 = orange-red `#FF2D16` (BTY+ 레퍼런스 실측색)
- Estimator(EstimatorInline) = 액션/선택색이 **black `#1A1A1A`** (`CFG_INK`), CMYK 도트만 그래픽 모티프
- Header 빠른상담 버튼 = `#1E50E0` (임시 브랜드색, 확정 후 교체)
- 구 디자인 시스템 accent `#D65A34` / `#B84A28` 는 현재 렌더 화면에는 ConsultForm(상담 뷰) 제출 버튼 등에만 남음

---

## 2. 현재 기술 구조

- **React 19 + React DOM 19**, 함수형 컴포넌트 + Hooks (`useState` / `useEffect` / `useRef` / `useLayoutEffect`)
- **Vite 8** 빌드 (`@vitejs/plugin-react`, `@tailwindcss/vite`, Figma Make 플러그인, `@` → `src` alias)
- **Tailwind CSS v4** (config 파일·PostCSS 없음). `src/index.css` 에서 `@import 'tailwindcss';` + `@theme` 토큰
- **TypeScript 5.7**, 포매터 **oxfmt**. `npm run build` 는 `vite build` 만 실행(별도 `tsc` 타입 체크 없음)
- 툴체인 버전: `.mise.toml` (Node.js, pnpm) — 단, 로컬 작업은 `npm` 사용
- 상태 관리 라이브러리 없음. 라우터 없음 — `App` 의 `view` state(`'landing' | 'consult'`)로 화면 전환
- 전체 페이지가 **`src/App.tsx` 단일 파일**에 모든 섹션 컴포넌트로 존재
- 글로벌 디자인 시스템은 **`src/index.css`**: 폰트 `@import`(Noto Serif KR / Noto Sans KR), `@theme` 토큰,
  `body`(`word-break: keep-all`), `.u-shell` / `.u-rail-pad` / `.u-section*` / `.t-*` 타이포 스케일,
  `.slip-perf`(레거시 견적서 천공), `.pf-card`(포트폴리오 hover), `.svc-arrow`/`.svc-row`(레거시 Service hover), `.faq-panel`(FAQ 아코디언)
- 색상·폰트가 `src/App.tsx` 에 **인라인 하드코딩**된 곳이 많음
  (`#FF2D16` / `#1E50E0` / `#1A1A1A` / `#D65A34` / `#B84A28` / `#d6392c` / `#666666` / `#B5B5B5` / CMYK 4색,
   `fontFamily: 'Noto Sans KR' / 'Noto Serif KR'`). 토큰만 바꿔서는 반영 안 됨 — `App.tsx` 도 함께 검색
- 공통 좌우 시작선: 일반 섹션 = `SHELL`(`u-shell`, `max-width:1920px`, `padding-inline: clamp(20px,5vw,100px)`).
  Portfolio 레일은 트랙 좌우 padding 을 `u-rail-pad`(같은 값)로 줘서 첫 카드가 셸 시작선과 정렬.
  Service(레거시)만 내부 nested `max-w-[1200px]`
- 이미지 assets: `src/imports/` 아래. 실제 rail 은 `portfolio-v2/*.jpg` + `portfolio-originals/*.jpg` 의 가로형 원본 사진 사용.
  구 4:5 png 세트(`portfolio-v2/기관_*.png` 등, `pf01~pf15`)와 `1~10.jpg` 는 레거시 참조로만 남아 **번들에는 그대로 포함**(용량 과다, §15)

---

## 3. 현재 렌더 순서 (source of truth = `App()`)

`src/App.tsx` 하단 `export default function App()`:

```
view === 'landing':
  Header → Hero → Portfolio → EstimatorSection → Clients → FaqSection

view === 'consult':
  ConsultForm (전체 화면. EstimatorInline 의 CTA 가 setView('consult') 호출)
```

- `Header` 는 `position: fixed`
- `Portfolio`(`id="portfolio"`) — 제작 사례 가로 레일
- `EstimatorSection`(`id="estimator"`)이 내부에서 `EstimatorInline` 렌더
- `Clients`(id 없음) — 고객사 placeholder 그리드
- `FaqSection`(`id="faq"`) — **사이트 마지막 섹션, full-width black**
- **미렌더 레거시**(파일에 정의만 남고 파일 끝에서 `void` 처리):
  `TrustStrip` · `Consultation` · `FAQ`(구 6문항 ivory) · `Footer` · **`Service`** · **`Contact`** · `EXHIBITIONS`(구 4:5 썸네일 데이터) · `EstimatorPage`(구 좌 컨트롤 / 우 견적서 슬립 계산기) · 관련 헬퍼(`getImageFor` / `getHeroImage` / `getSubThumbs` / `MATERIAL_OPTS`…`PACKAGING_OPTS` 등)

### 앵커 상태 (주의)

- `#portfolio` → OK (`Portfolio`)
- `#estimator` → OK (`EstimatorSection`)
- `#faq` → OK (`FaqSection`)
- `#contact` → **대상 섹션 없음** (Contact 제거됨). Header 의 `빠른상담`(데스크톱) / `제작 문의`(모바일) 버튼이 여기를 가리켜 **현재 스크롤이 동작하지 않음** — 미해결
- `#service`, `#about` → 대상 섹션 없음 (단, Header nav 에는 이 항목들이 이미 빠져 있음)

---

## 4. Header 현재 상태

- `fixed top-0`, `bg-white/95 backdrop-blur-sm`, 하단 얇은 border(`border-black/[0.07]`)
- 높이 `h-[64px]` (lg 이상 `h-[96px]`)
- 컨테이너 = `SHELL`(Hero 와 좌우 시작선 일치), `grid grid-cols-[1fr_auto_1fr] items-center gap-6`
- **좌**: 텍스트 로고 `터치어그래픽` (`Noto Sans KR` extrabold, `text-[17px] lg:text-[22px]`, `tracking-[-0.02em]`), `href="#"`
- **중앙 (lg 이상 전용, `hidden lg:flex`)**: rounded gray nav 컨테이너 `h-[56px] rounded-[11px] bg-black/[0.05] px-3`.
  - **항목 2개**, 항목 사이 세로 구분선(`h-3 w-px bg-black/[0.16]`). 링크 `px-[30px] py-2 text-[17px] font-semibold`
  - `HEADER_NAV = [ { '제작 사례', href '#portfolio', targetId 'portfolio-scroll-target' }, { '견적 계산하기', href '#estimator', targetId 'estimator-scroll-target' } ]`
  - 클릭 시 기본동작 막고 `scrollToCenter(targetId)` — 대상 블록(`getBoundingClientRect` 기준)이 viewport **세로 중앙**에 오도록 스크롤 (fixed 헤더 보정). `prefers-reduced-motion` 이면 즉시 이동
  - 스크롤 타깃: `#portfolio-scroll-target` = Portfolio 제목 블록, `#estimator-scroll-target` = Estimator 마스트헤드 블록
- **우 (lg 이상, `hidden lg:flex`)**: 버튼 2개, 각 `h-[54px] lg:min-w-[148px] px-[30px] rounded-[10px] text-[16px] font-bold`
  - `빠른상담`: 배경 `#1E50E0`(**임시색**), `href="#contact"` — **대상 없음(§3)**
  - `회사소개서`: 흰 배경 + `border-black/25`, hover 시 black 반전, `href="#"` **미연결**
- **lg 미만**: 로고 + `제작 문의` 버튼(`lg:hidden`)만. `onClick` → `scrollToContact()` → `#contact` — **대상 없음(§3)**. 모바일 헤더는 별도 재디자인 안 함
- Header ↔ Hero: Hero 상단 padding(`pt-[112px] lg:pt-[200px]`)이 고정 헤더 높이 + 여백 확보

---

## 5. Hero 현재 상태와 카피

- 흰 배경, **이미지 없음**, 강한 black 타이포그래피, 넓은 여백. `Noto Sans KR` 인라인
- `SHELL` 안 `pt-[112px] lg:pt-[200px]` / `pb-[44px] lg:pb-[80px]`
- 구조: 작은 descriptor(위) → `grid lg:grid-cols-12` 로 좌측 대형 2줄 headline(`lg:col-span-7`) + 우측 supporting(`lg:col-span-4 lg:col-start-9`, lg 에서 우하단 정렬)
- typography:
  - descriptor: `text-[13px] lg:text-[16px]` `font-normal` `text-black/80`
  - headline `h1`: `fontWeight 700`, `fontSize clamp(36px, 4.6vw, 66px)`, `lineHeight 1.3`, `letterSpacing -0.025em`
  - supporting 1줄: `fontWeight 500`, `clamp(18px, 2.1vw, 32px)`, `lineHeight 1.35`
  - supporting 2줄: `fontWeight 700`, 같은 크기. 단어 사이 `h-px w-16 bg-black/35` 짧은 가로선

### 현재 카피 (그대로)
- descriptor: `기업·기관 맞춤 달력 기획·디자인·제작`
- headline (좌): `기업 / 기관` <br> `달력 제작 회사`
- supporting (우): 1줄(500) `달력 잘 만드는 전문 디자이너가` / 2줄(700) `기획부터` ──(가로선)── `제작까지 함께합니다`

---

## 6. Portfolio (= "제작 사례") 현재 상태

- `<section id="portfolio" className="bg-white pt-[52px] pb-[76px] md:pb-[96px] lg:pt-[124px] lg:pb-[160px]">`
- 상단 헤더 블록(`SHELL`, id `portfolio-scroll-target`): 제목 `제작 사례` (h2, `Noto Sans KR` `700` `clamp(26px, 4.1vw, 66px)` `letterSpacing -0.025em`) + `Portfolio` 캡션(`t-caption text-black/45`) + 우측:
  - 데스크톱 전용(`hidden lg:flex`) prev/next hairline circle 버튼 2개(`w-9 h-9 rounded-full border border-black/20`, `nudge(-1)` / `nudge(1)`)
  - `포트폴리오 전체보기 ›` 텍스트 (**링크 미연결**)

### 카드 구조 — 가로형 editorial item

- `<figure>` 폭 `clamp(330px, 40vw, 600px)`, `shrink-0`
- 이미지 wrapper `.pf-card` (`data-card-img`): `aspect-ratio: 4 / 3`, `rounded-[10px]`, `bg-black/[0.04]`, `overflow-hidden`
  - `<img>`: `w-full h-full object-cover`, `pointer-events-none`, `draggable=false`, 처음 3장 `loading="eager"` 나머지 `lazy`
  - `objectPosition` = 카드별 값 (기본 `center center`)
  - `transform: scale(mediaScale)` — `mediaScale` 가 있고 1이 아닐 때만. **hover transform 은 wrapper `.pf-card` 에, mediaScale 은 `<img>` 에** → 서로 다른 element, 충돌 없음(hover 시 두 scale 이 곱해짐)
- `<figcaption>` (이미지 아래, 박스/보더 없음): 카테고리(`text-[13px] font-medium text-black/45`) → 업체명 `h3`(`Noto Sans KR` `700` `clamp(19px, 1.6vw, 24px)` `-0.02em`) → 한 줄 설명(`400` `clamp(14px, 1.05vw, 16px)` `lineHeight 1.6` `text-black/55` `break-keep`)
- 트랙: `flex u-rail-pad`, `gap: clamp(20px, 2.4vw, 34px)`, `paddingTop: 44px` / `paddingBottom: 32px` (카드 상단·그림자 잘림 방지)
- 뷰포트 div: `overflowX: auto` / `overflowY: hidden` / `scrollbarWidth: none` / `cursor: grab`, `tabIndex=0`, `role="region"` → **페이지 가로 밀림 없음**

### hover (`.pf-card`, index.css)

- hover-capable 기기만: `transform: scale(1.03) translateY(-2px)`, `box-shadow: 0 12px 28px rgba(0,0,0,0.12)`, `z-index: 10`, enter ~300ms / leave ~220ms
  - (이전 값 `scale(1.06) translateY(-3px)` + `0 14px 32px/0.14` 에서 축소 조정됨 — 현재 `src/index.css` 미커밋 변경분)
- width/height/margin 불변 → 옆 카드 안 밀림, caption scale 안 함
- `prefers-reduced-motion: reduce` → hover transform/shadow 없음

### 모션 — 정지 → 카드 1장 slide → 정지 (continuous marquee 아님)

- **HOLD ≈1200ms → SLIDE 정확히 카드 1장(step = 카드폭+gap), ≈700ms, easeOutCubic → HOLD** 반복
- 전부 `requestAnimationFrame` + `setTimeout` + `ref` 로만 관리 (프레임마다 React rerender 없음). `scrollLeft` 를 직접 tween → 별도 CSS transition 없음
- **무한 루프**: 렌더 레이어에서 `[...PORTFOLIO, ...PORTFOLIO]` 복제 트랙. 경계에서 `scrollLeft -= loopAt` 즉시 보정(리셋 비가시). 복제 세트는 `aria-hidden`
- `scroll-snap` 제거(`scrollSnapType = 'none'`)
- **조작 방식 (모두 유지)** — 조작 중 정지, 종료 후 딜레이 뒤 재개(재개 전 가장 가까운 카드로 ≈340ms snap):
  - **마우스 드래그**: 뷰포트 pointer 이벤트(`pointerType === 'touch'` 제외). 최우선, 즉시 정지, 종료 후 ≈1400ms 뒤 재개. 드래그 중에도 `loopAt` 경계 보정
  - **터치 스와이프**: 네이티브 가로 스크롤에 위임. `touchstart` 정지, `touchend`/`touchcancel` 후 ≈1500ms 뒤 재개
  - **prev/next 화살표**(데스크톱): 자동 슬라이드와 동일한 rAF easeOut tween 으로 정확히 카드 1장, 이후 ≈1400ms 뒤 재개
  - **카드 이미지 hover**: `[data-card-img]` 위에서 정지, leave 후 ≈1100ms 뒤 재개 (옆 카드로 이동 시 계속 정지)
  - **트랙패드 wheel**: manual 우선, ≈1000ms 뒤 재개
  - **키보드 focusin**: 레일 안에 focus 있으면 정지, focusout 후 ≈1000ms 뒤 재개
- `prefers-reduced-motion: reduce` → 자동 이동 없음(수동 조작만), 화살표는 애니메이션 없이 즉시 한 칸

### Portfolio 데이터 (`PORTFOLIO`, 7개, 실제 렌더)

`type PortfolioItem = { src; category: '공공기관' | '기업' | '일러스트'; title; description; objectPosition?; mediaScale?; secondaryImages? }`

| # | 업체명 | 카테고리 | import | 파일 (설명) | objectPosition | mediaScale |
|---|--------|----------|--------|-------------|----------------|------------|
| 0 | 대한상공회의소 | 공공기관 | `hpSanggong` | `portfolio-v2/대한 상공회의소.jpg` (= 상공회의소 1, 표지컷) | `center 48%` | **1.14** |
| 1 | 아이디어두잇 | 기업 | `hpIdeadoit` | `portfolio-originals/아이디어두잇 5.jpg` (12월 그리드에 스티커 붙이는 손) | `center center` | — |
| 2 | 한국수목정원관리원 | 일러스트 | `hpSumok` | `portfolio-originals/한국수목정원관리원 6.jpg` (사계절전시온실 단일 일러스트 — 백조·꽃·정원) | `center 52%` | **1.16** |
| 3 | 동아쏘시오그룹 | 기업 | `hpDongaDesk` | `portfolio-originals/동아그룹 5.jpg` (손에 든 회전목마 일러스트 내지) · `secondaryImages: [portfolio-v2/동아쏘시오 그룹.jpg]` (다이어리컷, rail 미노출) | `center center` | — |
| 4 | 함평군농업기술센터 | 공공기관 | `hpHampyeong` | `portfolio-originals/함평군 2.jpg` (1·2월 그리드 펼침 + 국화분재) | `52% 44%` | **1.4** |
| 5 | IMAGINE SEOUL | 일러스트 | `hpImagine` | `portfolio-v2/이매진서울.jpg` | `center center` | — |
| 6 | 세종스포츠정형외과 | 기업 | `hpSejong` | `portfolio-v2/세종스포츠.jpg` | `center center` | — |

- 한 줄 설명: 0 `상징 비주얼을 활용한 데스크 캘린더` / 1 `브랜드 메시지를 담은 오브제형 캘린더` / 2 `자연의 이미지를 담은 일러스트 캘린더` / 3 `따뜻한 일러스트로 완성한 데스크 캘린더` / 4 `전시 작품을 활용한 벽걸이 캘린더` / 5 `아트워크 중심의 일러스트 캘린더` / 6 `스포츠 테마를 활용한 맞춤형 캘린더`
- 배치 원칙: 같은 카테고리·같은 업체가 연달아 나오지 않도록(무한 루프 이음새 포함)
- **`mediaScale` 목적**: 검은 배경 여백이 많아 제품이 작아 보이는 컷을 이미지만 확대해 시각 밀도 보정.
  밀도 보정이 필요한 카드(**대한상공회의소 / 한국수목정원관리원 / 함평군**)에 적용,
  기준(밀도 양호) 카드(**아이디어두잇 / 동아쏘시오그룹 / IMAGINE SEOUL / 세종스포츠정형외과**)는 scale 없음
- 같은 브랜드의 다른 촬영컷은 `src/imports/portfolio-originals/` 에 보존(13개 파일: 동아그룹 1·2·5·6, 상공회의소 1·2, 아이디어두잇 1·5, 한국수목정원관리원 1·6·8, 함평군 1·2)

### 알려진 미완성

- `포트폴리오 전체보기 ›` 링크 미연결
- 7개 카드가 최종 선정본인지 미확정(브랜드별 후보컷을 `portfolio-v2/` · `portfolio-originals/` 에서 계속 비교 중)
- 대표컷 crop(`objectPosition`) / `mediaScale` 은 계속 미세조정 대상 — git 커밋이 없어 "직전 승인값" 여부는 이력으로 확인 불가

---

## 7. (제거됨) Service 섹션

- `Service` 컴포넌트(`SERVICE_ROWS` 4행, `#FF2D16` accent, BTY+ 레퍼런스 layout)는 **파일에 남아있으나 `App()` 에서 렌더하지 않음** (파일 끝 `void Service`)
- 관련 CSS(`.svc-arrow` / `.svc-row`)도 `src/index.css` 에 남아있으나 미사용
- 되살릴 계획 없으면 정리 대상. 지금은 건드리지 않는다(요청 없는 레거시 삭제 금지)

---

## 8. Clients 현재 상태 (placeholder)

- `<section className="bg-white u-section">` (id 없음). 렌더 순서상 **Estimator 다음 / FAQ 앞**
- 제목 `Clients`(`t-display`) + 카피 `약 5,300여 개의 기업과 함께해왔습니다.`
- `CLIENT_NAMES` 14개(`LG`, `화성시`, `경기도`, `KAIST`, `세종대학교`, `단국대학교`, `국민대학교`, `신한금융그룹`, `광주과학기술원`, `근로복지공단`, `국민연금공단`, `한국가스공사`, `서울특별시교육청`, `식품의약품안전처`)
- 그리드 `grid-cols-2 md:grid-cols-4 lg:grid-cols-7`, 셀 `aspectRatio: 3/2`, 인접 border 겹침(`-mt-px -ml-px`)
- **실제 로고 이미지 없음** — 텍스트만(`t-caption text-black/35`). 안내 문구: `* 로고 자리 — 실제 로고 이미지로 교체 예정`
- 고객사 명단 확정 여부 미확인

---

## 9. Estimator (EstimatorSection → EstimatorInline) 현재 상태

**현재 실제 사용 중인 견적 계산기.** 구 `#dbd7c8` 도트 배경 + 좌 컨트롤 / 우 견적서 슬립 버전은
미렌더 레거시 `EstimatorPage` 이며 손대지 않는다(§13, AGENTS.md 규칙 6).

- Wrapper `EstimatorSection`: `<section id="estimator" className="bg-white u-section-sm" style={{ scrollMarginTop: '56px' }}>`, 내부 `SHELL`
- UX = Sincerely progressive-accordion. Visual = Touchgraphic(white·black 중심, hairline rule, radius 는 pill 또는 0, 액션/선택색 black `#1A1A1A`)
- 폰트 `Noto Sans KR`, `letterSpacing: -0.01em` (`CFG_KR`)

### 마스트헤드 (id `estimator-scroll-target`)

- 얇은 라운드 라벨(border 0.8px) 안에 CMYK 도트 4개(`#4CACE9` / `#DB438F` / `#FDF251` / `#1A1A1A`) + `PRINT ESTIMATE / 견적`
- `h2` (`Noto Sans KR` `700` `clamp(28px, 3.7vw, 48px)` `lineHeight 1.1` `-0.025em`): **`달력 견적 계산기`** (한 줄)
- 우측 안내 문구: "제작 등급과 옵션을 순서대로 선택하면 아래 견적 요약에 예상 금액이 바로 반영됩니다. 표시 금액은 부가세·인쇄·배송 실비 별도입니다."
- 하단 `border-b border-ink`

### 2열 (`grid lg:grid-cols-2 gap-8 lg:gap-12 items-start`)

- **좌: 캘린더 미리보기** (`lg:sticky lg:top-[104px]`)
  - `CalendarPreview` — 스파이럴 제본 캘린더 SVG. 비율 = 선택된 `사이즈` → `SIZE_RATIO`(A 4:3 / B 3:4 / C 1:1 / D 16:9), 미선택 시 4:3
  - 배경 `#FBFCF8` + border, 모서리에 `RegMark` 2개
  - 아래 캡션: 현재 등급 이름 + `사이즈` 라벨(또는 `사이즈 미선택`)
- **우: progressive accordion**
  - `steps` = `제작 등급`(tier) + 옵션 그룹 중 `SUPPLEMENTARY_GROUPS`(`표지 스타일`)를 제외한 것.
    세 등급 모두 옵션 그룹이 `사이즈` / `내지 레이아웃` 이므로 → **numbered step: `01 제작 등급` → `02 사이즈` → `03 내지 레이아웃`** (모든 등급 동일)
  - `AccordionRow`: 헤더(번호 `NN` · 라벨 · 선택값 · `✓ 선택 완료`/hint · `count` · chevron) + 본문 애니메이션(`grid-template-rows 0fr↔1fr`, 220ms)
  - `TierRow`: 등급명 + subtitle + `{wonFmt(tierBaseTotal(id))}원~` + `CheckDisc`. 선택 시 `border 1.5px solid #1A1A1A` + `bg rgba(26,26,26,0.045)`
  - `OptionRow`: 60px SVG 썸네일(`SizeSvg` / `LAYOUT_THUMBS` / `NeutralTile`) + 라벨 + `CheckDisc`
  - **progressive 동작**: 한 단계에서 유효 선택 → 현재 단계 닫고 → 다음 단계 자동 open + `scrollIntoView`. 등급 변경 시 첫 옵션 그룹(`사이즈`)으로 이동
  - **베이직 전용 보조 옵션 — 표지 스타일**: numbered step(01·02·03) 아래에 한 단계 낮은 위계로 렌더.
    "추가 선택 · 표지 스타일" + "베이직 전용" 라벨 + pill 버튼 2종(`불꽃양 그래픽` / `2027 타이포그래피`).
    선택해도 다음 단계로 자동 이동하지 않음. `커스텀` / `하이앤드` 에는 `표지 스타일` 옵션 자체가 없어 이 블록이 렌더되지 않음
  - `진행 조건`: `d.rules` 목록(`—` 불릿)
- **하단 요약** (`lg:sticky lg:bottom-0`, `bg-white border-t border-ink`)
  - 좌: `선택 등급` + 등급 이름 + `summaryChips`(선택 옵션들 ` · ` 결합)
  - 중: `현재 예상 견적` + `{wonFmt(animatedTotal)}원` (`clamp(20px, 3.4vw, 26px)`, `useAnimatedNumber` 롤링)
  - 우: **버튼 1개** — **`이 견적으로 상담 신청하기 →`** (pill, `bg #1A1A1A`, `onConsult` → `consult` 뷰).
    (구 버전에 있던 `견적 텍스트 복사` 버튼은 EstimatorInline 에 없음 — 레거시 `EstimatorPage` 에만 존재)
  - 고지: `부가세·인쇄·배송 실비 별도 · 최종 견적은 상담 후 확정됩니다.` + `기준일 {오늘날짜}`

### 제작 등급 (`TIER_DATA` / `TIER_ORDER`)

`TIER_ORDER = ['template', 'custom_basic', 'custom_highend']`

| id | 표시명 | subtitle | breakdown (동결) |
|----|--------|----------|------------------|
| `template` | **베이직 (실속형)** | 기본 디자인을 활용해 예산은 줄이고 필요한 내용만 맞춰 제작합니다. | 템플릿 이용료 `100,000` / 표지 디자인 `300,000` / 내지 세팅 `500,000` |
| `custom_basic` | **커스텀 (맞춤형)** | 브랜드의 목적과 분위기에 맞춰 표지와 내지를 맞춤 디자인합니다. | 기획 PT `1,000,000` / 표지 디자인 `1,000,000` / 내지 디자인 (24p) `2,400,000` / AI 비주얼 애드온 `400,000` |
| `custom_highend` | **하이앤드 (기획형)** | 기획부터 비주얼 콘셉트와 내지 구성까지 새롭게 설계합니다. | 기획 PT `3,000,000` / 키비주얼 표지 `2,000,000` / 내지 디자인 (24p) `4,800,000` |

- 옵션(표시 전용, 금액에 반영 안 됨):
  - 세 등급 공통 `사이즈` 4종(`A · 가로형` / `B · 세로형` / `C · 정사각` / `D · 와이드`), `내지 레이아웃` 4종(`2분할` / `4분할` / `5분할` / `미니 달력형`)
  - `template` 만 추가로 `표지 스타일` 2종(`불꽃양 그래픽` / `2027 타이포그래피`) — 보조 옵션 블록에서만 노출
- `rules`(진행 조건): template = 표지 수정 2회 한정 / 내지 12p 단순 치환 / 인쇄·배송 실비 별도. custom_basic = 기획안 3종 제안 / 인쇄 실비 별도. custom_highend = 인터뷰·만남 기반 전용 기획, 디렉팅 총괄 / 지류·특수 후가공 맞춤 견적

### 작가 협업(addon) — 제거됨

- `TIER_DATA` 세 등급 모두 `addon` 필드 **없음**. 구 `custom_basic` 의 `외부 작가 일러스트 협업`,
  `custom_highend` 의 `작가 협업 (필수 항목)` 정의와 **컷당 단가 range 슬라이더 UI, "총 N컷" 금액**은 EstimatorInline 에서 완전히 제거
- 타입 `AddonDef`, `tierBaseTotal` 의 `if (d.addon?.required)` 분기, 레거시 `EstimatorPage` 의 addon 렌더 코드는 파일에 남아있으나 현재 데이터에 addon 이 없어 **비활성 / 미렌더**

### 계산 (동결)

- `total = d.breakdown.reduce((a,b) => a + b.value, 0)` — 옵션·표지 스타일 선택은 금액에 반영되지 않음
- `tierBaseTotal(id)` = breakdown 합 (+ addon.required 시 가산이지만 현재 addon 없음)
- `wonFmt(n)` = `Math.round` 후 `toLocaleString('ko-KR')`
- `useAnimatedNumber` — 표시용 숫자 롤링 애니메이션
- **§13 참조: 명시 요청 없이 위 데이터·로직 변경 금지**

---

## 10. FAQ (FaqSection) 현재 상태 — 사이트 마지막 섹션

- `<section id="faq" className="bg-black text-white pt-[80px] lg:pt-[140px] pb-[100px] lg:pb-[160px] scroll-mt-24">`, 내부 `SHELL`(Estimator 와 동일 폭)
- 위치: **Clients 아래 = 페이지 최하단.** 제거된 Contact 의 full-width **black** 몰입/마무리 역할을 이어받는다
- 상단 label: orange dot(`#FF2D16`) + `자주 묻는 질문` (`Noto Sans KR` `700` `14px` `#FF2D16`)
- headline `h2` (`Noto Sans KR` `800` `clamp(30px, 3.6vw, 56px)` `lineHeight 1.15` `-0.035em`): `궁금한 점.` (흰색)
- **accordion**: `FAQ_QA` 4문항. `FaqRow` 컴포넌트, **한 번에 하나만 open** (`open` state = `number | null`), **첫 질문(index 0) 기본 open**
  - 질문 `700` `clamp(17px, 1.3vw, 21px)` 흰색, 우측 `+ / −` 아이콘(`#FF2D16`, 열리면 세로선 사라짐)
  - 답변 패널: `useLayoutEffect` 로 height `0 ↔ scrollHeight ↔ auto` 애니메이트(`.faq-panel`, 280ms). 모바일 재줄바꿈에도 안 잘림. `prefers-reduced-motion` → 즉시
  - 답변 스타일: `max-w-[820px]` `Noto Sans KR` `400` `clamp(15px, 1vw, 16px)` `lineHeight 1.8` `rgba(255,255,255,0.7)`
- 최하단: `© 2026 터치어그래픽 · TOUCHGRAPHIC` (`text-[11px] text-white/30 font-mono`, `mt-20 lg:mt-28`) — 제거된 Contact 의 copyright 를 절제된 형태로만 유지

### 현재 질문 4개와 답변 (그대로)
1. **터치어그래픽은 어떤 회사인가요?** — "터치어그래픽은 기업·기관을 위한 달력을 기획하고 디자인·제작하는 전문 스튜디오입니다. 간단한 템플릿형 제작부터 브랜드에 맞춰 처음부터 설계하는 맞춤형 달력까지, 기획·디자인·제작·납품 전 과정을 함께 진행합니다."
2. **다른 회사와 달력 서비스의 차이가 있나요?** — "단순히 정해진 달력을 인쇄하는 데 그치지 않고, 브랜드의 목적과 분위기에 맞춰 기획과 디자인부터 함께할 수 있다는 점이 가장 큰 차이입니다. 예산을 낮춘 템플릿형부터 표지·내지·그래픽·후가공까지 새롭게 설계하는 풀커스텀 제작까지 폭넓게 대응합니다."
3. **원하는 수량과 예산에 맞춰 제작할 수 있나요?** — "네. 수량과 예산에 따라 템플릿형 또는 맞춤 제작 방식으로 진행할 수 있습니다. 용지·제본·후가공 등의 사양도 조정할 수 있어, 필요한 범위에 맞춰 제작 방향과 견적을 함께 정리해드립니다."
4. **달력 제작 기간은 얼마나 걸리나요?** — "제작 기간은 디자인 범위와 수량, 인쇄·후가공 사양에 따라 달라집니다. 템플릿형은 비교적 빠르게 진행할 수 있고, 맞춤형은 기획과 디자인 과정이 포함되므로 여유 있는 일정이 필요합니다. 원하는 납품일을 알려주시면 가능한 일정을 먼저 확인해드립니다."

> 파일에는 구 `FAQ` 컴포넌트(`FAQ_ITEMS` 6문항, ivory 배경)도 남아 있으나 **미렌더 레거시**다. 현재 사용은 `FaqSection` + `FAQ_QA`.

---

## 11. (제거됨) Contact 섹션 / consult 뷰

### Contact 섹션 — 제거됨
- 검정 full-width `Contact` 컴포넌트(좌 headline + 우 `ContactForm`, `CONTACT_SERVICES` pill, `tag@touchagraphic.com`)와
  구 `Consultation` 컴포넌트 모두 **파일에 남아있으나 `App()` 에서 렌더하지 않음** (파일 끝 `void Contact` / `void Consultation`)
- 두 컴포넌트가 `id="contact"` 를 갖고 있었으나 미렌더이므로 현재 DOM 에 `#contact` 없음 → Header 버튼 앵커 깨짐(§3·§4)

### consult 뷰 (`view === 'consult'`) — 살아있음
- `EstimatorInline` 의 `이 견적으로 상담 신청하기 →` → `onConsult` → `App` 의 `setView('consult')`
- `ConsultForm` 전체 화면: 상단 `← 견적 계산기로` 복귀 바 + 선택 조건 요약 6줄 + 담당자 성함 / 기관·기업명 / 연락처 / 이메일 폼 + 제출 버튼 `상담 신청하기`(`#D65A34`)
- 제출 시 `submitted` state 토글 → 접수 화면. **실제 전송 로직 없음**
- ⚠️ `App` 의 `sels` state 는 `DEFAULT_SELS`(전부 빈 값) 고정이고 setter 가 없음 → ConsultForm 요약의 6개 조건은 항상 `—`. 구 `EstimatorPage` 흐름의 잔재

---

## 12. 아직 해결해야 할 문제

| # | 위치 | 문제 |
|---|------|------|
| 1 | Header | `빠른상담`(데스크톱) / `제작 문의`(모바일) 버튼이 `#contact` 를 가리키나 대상 섹션 없음 → 클릭 시 스크롤 안 됨 |
| 2 | Header | `빠른상담` 배경 `#1E50E0` 임시색, `회사소개서` 버튼 `href="#"` 미연결 |
| 3 | Portfolio | `포트폴리오 전체보기 ›` 링크 미연결 |
| 4 | Portfolio | 7개 대표컷 최종 선정·`objectPosition`·`mediaScale` 미확정 (후보 비교 중) |
| 5 | Clients | 실제 로고 이미지 없음 — 텍스트 placeholder. 명단 확정 여부 미확인 |
| 6 | consult 뷰 | `sels` 가 항상 빈 값 → 요약 6개가 전부 `—`. 폼 실제 전송 없음 |
| 7 | 전역 | Service / Contact / Consultation / 구 FAQ / Footer / EstimatorPage 등 미렌더 레거시 다량 잔존 — 정리 여지(요청 시에만) |
| 8 | 전역 | accent 색 불일치(`#FF2D16` / `#1E50E0` / `#1A1A1A` / `#D65A34` 계열) — 브랜드색 확정 후 정리 |
| 9 | 빌드 | 미사용 이미지(구 4:5 png 세트 등)가 `void` 참조로 번들에 포함 — 용량 과다(§15) |
| 10 | SEO | `.figma/make/site.json` `robots.index: false` → 빌드 결과 `noindex` + `robots.txt Disallow: /`. `<title>` 기본값, description 영문 자동 생성, GA 미설정 |
| 11 | 구조 | 색상·폰트 인라인 하드코딩 산재 — 토큰화 여지(요청 시에만) |

---

## 13. 견적 계산기에서 절대 변경하면 안 되는 데이터와 로직

> AGENTS.md 규칙 5·6. **명시적으로 요청받지 않는 한 아래는 절대 수정 금지.**
> 수정 대상은 `EstimatorInline`(현재 사용) 이며, `EstimatorPage`(레거시)는 건드리지 않는다.

### 동결 — 데이터 (`src/App.tsx` `TIER_DATA`)
- `template` breakdown: 템플릿 이용료 `100000` / 표지 디자인 `300000` / 내지 세팅 `500000`
- `custom_basic` breakdown: 기획 PT `1000000` / 표지 디자인 `1000000` / 내지 디자인 (24p) `2400000` / AI 비주얼 애드온 `400000`
- `custom_highend` breakdown: 기획 PT `3000000` / 키비주얼 표지 `2000000` / 내지 디자인 (24p) `4800000`
- 각 등급의 `options`(사이즈 4종 / 내지 레이아웃 4종 / template 한정 표지 스타일 2종)과 `rules` 문구
- `TIER_ORDER = ['template', 'custom_basic', 'custom_highend']`
- **addon 은 현재 없음** — 다시 넣지 말 것(제거가 의도된 변경)

### 동결 — 로직
- `tierBaseTotal(id)` = breakdown 합
- `wonFmt(n)` = `Math.round` 후 `toLocaleString('ko-KR')`
- `EstimatorInline` 의 `total = d.breakdown.reduce((a,b) => a + b.value, 0)` (옵션 선택은 금액에 반영 안 됨)
- `useAnimatedNumber` — 표시용 숫자 애니메이션
- 레거시 `EstimatorPage` 의 `copyText()` 등도 건드리지 않는다

### 변경 가능 (요청 시, 최소 범위)
- `EstimatorSection` wrapper 의 폭·여백·배경
- 계산기 내부의 순수 시각 요소(타이포·색·간격·썸네일 SVG·accordion 인터랙션)
- 마스트헤드/안내/CTA 등 **금액과 무관한** 카피

---

## 14. 주요 디자인 레퍼런스

| URL | 참고 포인트 |
|-----|-------------|
| https://media-palette.co.kr/ | Header scale/spacing (좌 로고 / 중앙 rounded gray nav / 우 액션 버튼) |
| Sincerely (configurator) | Estimator UX — 좌 preview / 우 progressive accordion / 하단 요약 |
| https://www.touchagraphic.com/ | Estimator visual tone (white·black, hairline, 최소 radius, CMYK 도트 모티프) |
| k-artfestival Event&Exhibitions | Portfolio 레일의 "머물렀다 한 칸씩 넘어가는" 스텝 모션 원리 |
| btyplus.co.kr (BTY+) | (레거시 Service 블록 참고. 현재 섹션은 제거됨) |
| `references/layout-master.png` | Hero / Portfolio / Clients 1차 리디자인 레이아웃 시안 |

> AGENTS.md 규칙 12: 레퍼런스는 **구조·정보 위계·인터랙션 원리만** 참고. 색상·폰트·장식은 복제하지 않는다.

---

## 15. 현재 `npm run build` 상태

- **성공** (2026-09-03 확인). `vite v8.x` → `✓ built in ~1.2s`. 빌드 오류 없음
- 산출물: `dist/assets/index-*.js` ≈ 238KB (gzip 74.5KB), `index-*.css` ≈ 44KB (gzip 8.5KB), `dist/index.html`, `dist/robots.txt`
- `npm run build` 는 `tsc` 타입 체크를 돌리지 않으므로, 타입 오류가 있어도 빌드는 통과할 수 있음
- 경고성 사실(오류 아님):
  - **이미지 용량 과다** — 레거시 `EXHIBITIONS` 가 파일 끝 `void EXHIBITIONS` 로 참조돼 있어, rail 에 안 쓰는 `pf01~pf15` 대형 png 까지 전부 번들에 포함. 최대: `일러스트_한국수목정원관리원.png` ≈10.4MB, `기업_설빙.png` ≈10.3MB, `기업_동아제약.png` ≈9.6MB. rail 실제 사용분은 원본 사진 8장(7 카드 + 1 secondary)
  - `dist/robots.txt` = `User-agent: *\nDisallow: /` (site.json `robots.index: false`). 공개 인덱싱 원하면 §12-10 참고

---

## 16. Git / branch 상태

- 현재 branch: **`v2-redesign`**
- 커밋: `7f9fae0 V1 회의 전 기준점` **1개뿐**. V2 작업 전체가 아직 **미커밋**
  - `src/App.tsx` — modified (V2 리디자인 전반)
  - `src/index.css` — modified (`.pf-card:hover` scale `1.06→1.03` + 그림자 축소, 단 1건)
  - untracked: `night-portfolio.ps1`, `src/imports/portfolio-originals/`, `src/imports/portfolio-v2/`
- 커밋 이력이 없어 "직전 세션에서 승인한 값" 인지 조정 중간값인지 git 으로 구분 불가 — 코드에 있는 값이 현재 상태다

---

## 17. 배포 상태 — V1 공개본 유지, V2 미배포

### V1 (현재 공개본 — 그대로 유지, 건드리지 않음)
- Netlify 운영본: `https://dancing-twilight-d43fb2.netlify.app/`
- 아임웹(Imweb): 코드 위젯에 위 Netlify 사이트를 `<iframe>`(고정 height) 로 임베드해 실게시 상태. 아임웹 기본 Header 숨김 처리됨
- 개인(커스텀) 도메인은 아직 미연결

### V2 (현재 branch `v2-redesign`)
- **아직 어디에도 배포하지 않음**
- 계획: **의사결정권자 검토용으로 별도 Netlify 사이트에 배포 예정** (기존 V1 운영 URL·아임웹 게시본은 그대로 두고, 검토용 링크만 별도 생성)
- 배포 시점·사이트 이름·URL 은 사용자가 명시적으로 지시한 뒤 진행한다. 그 전까지 Netlify 배포·공개본 업데이트 작업 금지

---

## 18. 로컬 실행

```bash
npm run dev      # Vite dev 서버 (기본 포트 8443, $PORT 로 변경). 출력 URL 을 브라우저로 확인
npm run build    # 프로덕션 빌드 확인 (수정 후 필수)
npm run preview  # 빌드 결과 미리보기
```

- 개발 서버는 항상 떠 있을 필요 없음 — 브라우저 확인이 필요할 때만 실행하고 끝나면 종료
- 작업 시작 시 `AGENTS.md` 와 이 `PROJECT_STATUS.md` 를 먼저 읽고, 대상 섹션 코드를 읽은 뒤 변경안을 제안·승인받고 수정

---

## 19. 다음 작업 후보

1. **V2 검토용 Netlify 별도 배포** — 새 사이트 생성 → 최신 `dist` 배포 → 검토 링크 공유 (V1 은 불변)
2. **Header 앵커 정리** — `빠른상담` / `제작 문의` 목적지 재설정(estimator 로 보낼지, contact 재도입할지 결정), `회사소개서` 링크 또는 항목 처리, `#1E50E0` 브랜드색 확정
3. **Portfolio 대표컷 확정** — 7개 카드 최종 이미지 선정, `objectPosition` / `mediaScale` 미세조정 마무리, `전체보기 ›` 링크 처리
4. **Clients 실제 로고/명단** — 텍스트 placeholder 를 실제 로고로, 안내 문구 제거
5. **consult 뷰 정비** — 실제 폼 전송(메일/시트/스팸 방지), `sels` 연동 또는 요약 블록 제거
6. **레거시 정리** — Service / Contact / Consultation / 구 FAQ / Footer / EstimatorPage / 미사용 이미지 import 제거로 번들 축소 (요청 시)
7. **모바일 실기기 검수** — 가로 overflow / 잘림 / Portfolio 레일 터치 스크롤
8. **공개 전 SEO / analytics** — `.figma/make/site.json` `robots.index` / `title` / `description`, GA ID

> 공통 원칙(AGENTS.md): 한 번에 한 섹션만, 수정 전 해당 코드 먼저 읽기, 기존 기능·상태·링크·데이터 임의 변경 금지,
> 견적 계산기 가격·계산 로직 동결, 새 badge/eyebrow/gradient 임의 추가 금지, 모바일 반응형·가로 overflow 확인, 수정 후 `npm run build`,
> 작업 완료 후 이 문서의 해당 항목 갱신.

---

## 20. 다음 세션 첫 프롬프트 예시

```
이 캘린더 랜딩페이지(V2)의 작업을 이어간다. branch 는 v2-redesign 이어야 한다.

먼저 프로젝트 루트의 AGENTS.md 와 PROJECT_STATUS.md 를 읽고,
src/App.tsx 의 App() 컴포넌트에서 실제 렌더 순서를 확인해라.
현재 렌더 순서: Header → Hero → Portfolio → EstimatorSection → Clients → FaqSection.
Service / Contact 섹션은 제거됐고(정의만 남고 void 처리), FAQ 가 마지막 black full-width 섹션이다.

현재 상태 요약:
- Header / Hero / Portfolio(가로형 카드 + 스텝 모션) / Estimator(달력 견적 계산기, 3등급, addon 제거) /
  Clients(placeholder) / FAQ(4문항, black) 로 구조·카피가 대체로 정리된 상태.
- 빌드 성공. V1 공개본(Netlify + 아임웹)은 그대로 유지, V2 는 아직 미배포.
- 미완성: Header #contact 앵커 깨짐, Portfolio 대표컷/전체보기 링크, Clients 로고,
  consult 뷰 폼 전송, 레거시 컴포넌트 잔존, SEO(noindex/title/GA).

이번 작업: 사용자가 지정하는 하나만 진행한다. (지정 없으면 먼저 무엇을 할지 물어라.)
작업 규칙:
- 지정된 한 섹션/한 종류의 문제만 수정한다. 다른 섹션·컴포넌트·레거시는 건드리지 않는다.
- EstimatorInline 의 가격 데이터(TIER_DATA)와 계산 로직은 절대 수정하지 않는다. addon 을 다시 넣지 않는다.
- editorial / print-studio 톤, 타이포·여백 중심 레이아웃 유지. 새 badge/eyebrow/gradient/감성 카피 임의 추가 금지.
- 데스크톱·모바일 반응형 모두 확인, 가로 overflow·잘림 없는지 확인.
- 수정 후 npm run build 로 빌드 오류 확인.
- 작업 완료 후 PROJECT_STATUS.md 의 해당 항목을 갱신한다.

먼저 대상 섹션의 현재 코드를 읽고, 바꿀 내용을 제안한 뒤 승인받고 수정에 들어가라.
```
