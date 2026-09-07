# PROJECT_STATUS.md

> 최종 갱신: 2026-09-07 (V2 리디자인 진행 중 — Landing rhythm 재조정 + `/portfolio` 실 데이터 이식 + `/portfolio/:idx` 상세 페이지 + asset 최적화 파이프라인, §25~§27)
> 이 문서는 새 세션에서 작업을 이어가기 위한 현재 상태 스냅샷이다.
> **코드가 이 문서와 다르면 코드가 정답이다.** 수정 후 이 문서도 갱신할 것.
> 기준 파일: `src/App.tsx` (단일 파일, 약 3,350줄) · `src/index.css` · `src/data/calendarPortfolio.ts`(자동 생성) · 현재 branch `v2-redesign`.

---

## 0. V1 → V2 무엇이 바뀌었나 (요약)

- **섹션 순서**: `Header → Hero → Portfolio → Estimator → Clients → FAQ` (아래 §3). Landing 밖에는 `/portfolio`
  (실제 Touchgraphic Calendar 17개, §26) · `/portfolio/:idx`(상세, §26) · `/inquiry`(§24) 라우트가 있다
- **Service 섹션 제거** — 컴포넌트 정의는 파일에 남아있으나 렌더하지 않음
- **Contact 섹션 제거** — 마찬가지로 정의만 남고 미렌더. 하단 마무리는 FAQ 가 이어받음
- **FAQ 가 사이트 마지막 섹션** — full-width **black** 배경, 흰 텍스트, 4문항. 구 Contact 의 몰입/마무리 역할 대체
- **Portfolio(Landing 캐러셀)** — 구 4:5 세로 썸네일 세트 → **가로형(4:3) 원본 제작사진 1장 + 아래 텍스트(카테고리/업체명/한 줄 설명)** editorial 카드. "정지 → 카드 1장 slide → 정지" 스텝 모션 + 무한 루프. **임시 대표 7개** — 실제 17개는 `/portfolio`(§26)에 별도로 있음
- **Estimator** — 제목 `달력 견적 계산기`. 제작 등급 표시명 `베이직 (실속형)` / `커스텀 (맞춤형)` / `하이앤드 (기획형)`. 공통 단계 `01 제작 등급 → 02 사이즈 → 03 내지 레이아웃`. **작가 협업(addon) 옵션 완전 제거**. 하단 CTA `이 견적으로 상담 신청하기 →` 1개
- **Landing rhythm 2차 조정(§25)** — Hero headline line-height 1.3→1.14, Hero↔Portfolio·Portfolio↔Estimator spacing 축소, FAQ 내부 밀도 강화. 문구/데이터/가격 로직 무변경
- **Git/배포**: V2는 이미 `a92ada6`(V2 포트폴리오·클라이언트·견적 UI 업데이트)까지 GitHub `origin/v2-redesign`
  으로 push 완료됐고, 의사결정권자 검토용 Netlify 사이트(`gleaming-naiad-0686ac.netlify.app`)도 이미
  존재한다. **오늘(2026-09-07) 진행한 §24~§27 작업분은 그 이후의 미커밋 working tree 변경사항**이라
  아직 새 commit·push·재배포 전이다(§16·§17). V1 공개본(Netlify + 아임웹)은 그대로 유지 중

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
- `#contact` → **대상 섹션 없음** (Contact 제거됨). Header 의 `제작 문의`(모바일 전용) 버튼이 여기를 가리켜 **현재 스크롤이 동작하지 않음** — 미해결. 데스크톱 `상담 문의` 버튼은 2026-09-07 `/inquiry` 로 연결 완료(§24)
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
  - (이전 값 `scale(1.06) translateY(-3px)` + `0 14px 32px/0.14` 에서 축소 조정됨 — `a92ada6` 커밋에 포함된 값)
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

## 21. Portfolio 전체보기 페이지 (`/portfolio`) — 2026-09-05 신설

> **⚠️ 2026-09-07 업데이트**: 아래 §21-21-3 에 설명된 "임시 7개(Landing과 동일 `PORTFOLIO` 데이터
> 재사용)" 구조는 §26 에서 **실제 Touchgraphic Calendar 17개**로 완전히 교체됐다. 이 섹션(§21)은
> wide breakout/4-column/hover 등 **디자인 구조가 여전히 유효**하므로 히스토리로 남겨두지만, "데이터"에
> 관한 서술(7개, `PORTFOLIO`, `filterType` 등)은 전부 최신 상태가 아니다 — 데이터/라우팅(`/portfolio/:idx`
> 상세 포함)은 반드시 §26 을 source of truth로 본다.

- 라우터 라이브러리 없이 `App()` 이 `window.location.pathname` 을 `route` state 로 들고 있다가
  `/portfolio` 면 `PortfolioPage`, 그 외엔 기존 landing/consult 트리를 렌더(`src/App.tsx` `App()`).
  `navigate(path, { scrollTo? })` 함수가 `history.pushState` + `setRoute` + (필요 시) 도착 후
  `scrollToCenter` 예약(`pendingScrollRef`)을 담당. `popstate` 리스너로 뒤로가기/앞으로가기 대응.
- Netlify SPA fallback: `public/_redirects` = `/*    /index.html   200` (신규 파일, 빌드 시 `dist/_redirects` 로 복사됨 확인)
- **Header** — 기존 컴포넌트 그대로 재사용, `page`(`'landing' | 'portfolio'`) + `navigate` prop 추가:
  - landing 에서 `제작 사례` 클릭 → `/portfolio` 이동. portfolio 에서 클릭 → 현재 페이지 맨 위로 스크롤
  - landing 에서 `견적 계산하기` 클릭 → 기존처럼 `#estimator-scroll-target` 로 센터 스크롤(변경 없음)
  - portfolio 에서 `견적 계산하기` 클릭 → `/` 로 이동 후 estimator 로 자동 스크롤(`navigate('/', { scrollTo: 'estimator-scroll-target' })`)
  - `scrollToCenter` 를 Header 내부에서 모듈 스코프 함수로 추출(App 의 pending-scroll 이펙트와 공유)
- **Landing Portfolio** — `포트폴리오 전체보기 ›` 를 `<span>` → `<button onClick={() => navigate('/portfolio')}>` 로 변경한 것 외 캐러셀/화살표/모션은 그대로
- **데이터** — 새 이미지 없이 기존 `PORTFOLIO` 배열을 그대로 재사용. 표시용 `category` 는 손대지 않고
  `filterType?: '기업' | '기관'` 필드만 각 항목에 추가(대한상공회의소·한국수목정원관리원·함평군농업기술센터 = 기관,
  아이디어두잇·동아쏘시오그룹·세종스포츠정형외과·IMAGINE SEOUL = 기업)
- **PortfolioPage 구조** (`src/App.tsx` `PortfolioPage`): Header → hero(`PORTFOLIO` 라벨 + 대형 headline, 이미지 없음) →
  필터 pill 3개(전체/기업/기관, `useState` 즉시 전환, 그리드 재배열 애니메이션 없이 `.pf-feed-item` 짧은 opacity fade만) →
  세로 feed(작품 1개 = section 1개, index/category → title → 큰 이미지(object-cover, 카드별 `objectPosition`/`mediaScale` 재사용) → 한 줄 설명, hairline `border-t` 구분)
  - 이미지 비율은 최초 16:9 → 4:3(rail과 동일 크롭) 을 거쳐, 2026-09-05 밀도 조정에서 **16:10 + max-width 1200px** 로 최종 조정(아래 참고)
  - 클릭 시 상세 페이지 등은 이번 범위에 없음(목록/갤러리까지만)
- **2026-09-05 밀도 조정**(구조는 그대로, spacing/media scale만): 1작품=1섹션 구조·필터 로직·데이터는 변경하지 않고
  desktop 화면에서 이미지가 과도하게 압도적으로 보이던 문제만 조정
  - hero/filter → 첫 작품: filter 컨테이너 `pb-[64px] lg:pb-[96px]` → `pb-[20px] lg:pb-[28px]`,
    첫 article만 `pt-[40px] lg:pt-[64px]`(다른 article은 `pt-[56px] lg:pt-[80px]`)로 분리 →
    desktop 체감 간격 약 200px → 약 92px
  - 이미지: `w-full`(shell 거의 전체 폭) → `w-full max-w-[1200px]`(왼쪽 정렬 유지, title과 동일 축),
    비율 `4:3` → `16:10`(제품이 심하게 잘리지 않는 선에서 더 가로로 넓고 덜 압도적인 프레임).
    `objectPosition`/`mediaScale` 등 `PORTFOLIO` 데이터 자체는 이번에도 변경하지 않음
  - article 상하 padding `pt/pb-[64px] lg:pt/pb-[104px]` → `pt/pb-[56px] lg:pt/pb-[80px]`
    (아이템 간 간격 desktop 약 208px → 약 160px, 목표 범위 110~160px 상단에 맞춤)
  - 대한상공회의소는 16:10에서 검은 여백이 거의 사라짐. 한국수목정원관리원(mediaScale 1.5)은 여전히 좌우
    검은 여백이 일부 남아있음 — Landing rail 에서도 동일하게 나타나는 현상(§6)이라 데이터 미변경 원칙상 그대로 둠
  - localhost 검수: 1~7번 항목 스크롤하며 간격/이미지 크기 확인, hero→첫 항목 간격 확연히 축소, 이미지가
    화면을 덜 압도하면서도 존재감 유지 확인. 모바일은 이번에도 `resize_window` 도구 미응답으로 실측 스킵 —
    `max-w-[1200px]`은 좁은 뷰포트에서 바인딩되지 않아(w-full 우선) mobile 폭 축소 없음
  - `npm run build` 성공

### 21-2. `max-w-[1200px]` 단일 컬럼 → LEFT INFO + RIGHT IMAGE 2-column editorial (2026-09-05, 최신)

- §21-1 에서 이미지에 `max-w-[1200px]` 를 걸었더니, 넓은 desktop 화면에서 이미지가 shell 안에서 왼쪽에
  붙고 오른쪽에 큰 white space 가 남는 문제 발생(특히 `기업/기관` category 가 shell 우측 끝에 따로 떠서
  title/image 와 한 composition 처럼 안 보임). **2 projects per row / masonry / thumbnail grid 로 바꾸지
  않고**, "1 project = 1 section" 구조를 유지한 채 각 section 내부를 좌우 2단으로 재구성해 이 공백을
  info 영역으로 흡수
- 각 `<article>` 내부에 새 wrapper `div.max-w-[1440px] grid grid-cols-1
  lg:grid-cols-[minmax(280px,0.28fr)_minmax(0,1fr)] gap-8 lg:gap-[88px] items-start` 추가
  (computed: 데스크톱 첫 컬럼 ≈296px, 둘째 컬럼 ≈1056px — 요청 범위 260~320px/70~100px gap 안에 들어옴)
  - **left info**(DOM 순서상 첫번째, mobile 1열일 때 자연히 위로 감): index → `기업/기관`(우측에 따로 떠
    있던 걸 이 안으로 이동) → title → description, 전부 세로 stack. `items-start` 로 image 상단과
    수직 정렬(중앙 정렬 아님)
  - **right image**: `max-w-[1200px]` 제거, 컬럼 100% 사용(`w-full`, object-cover, 비율은 §21-1의
    16:10 그대로 유지, `objectPosition`/`mediaScale` 등 `PORTFOLIO` 데이터는 여전히 미변경)
  - description 의 `max-w-[560px]` 도 제거(컬럼 자체가 이미 좁아 불필요)
  - article 상하 padding·hairline divider·hero→첫 항목 간격(§21-1 값 그대로) 은 이번엔 건드리지 않음 —
    이미 90~110/110~160 목표 범위 안이라 재조정 불필요했음
- **filter 유지**: `전체/기업/기관` 클릭 시 남은 항목들이 동일한 2-column 구조로 그대로 재배치, filter
  로직 자체는 무변경
- **localhost 검수**: 대한상공회의소→아이디어두잇→한국수목정원관리원 연속 스크롤, 오른쪽 white space
  완전히 사라짐, info/image 가 하나의 composition 처럼 보임, category 가 더 이상 우측에 안 뜸,
  `기업` 필터 클릭 후에도 레이아웃 정상 유지 확인. 긴 title(`한국수목정원관리원`)은 좁아진 info 컬럼에서
  자연스럽게 2줄로 줄바꿈됨(허용 범위). 모바일은 이번에도 `resize_window` 도구 미응답으로 실측 스킵 —
  `grid-cols-1 lg:grid-cols-[...]` 구조상 `lg` 미만에서는 DOM 순서(정보→이미지) 그대로 1열 stack 되고
  이미지에 폭 제한이 없어 좁아질 위험 없음
- `npm run build` 성공
- **localhost 검수 완료**(Claude in Chrome): Header `제작 사례` → `/portfolio` 이동, hero/필터 확인, `기업`/`기관`/`전체` 필터 정상 전환,
  전체 7개 항목 끝까지 스크롤 확인, `/portfolio` 직접 URL 진입 정상, portfolio → `견적 계산하기` → `/` 이동 후 estimator 스크롤 정상,
  landing `포트폴리오 전체보기` → `/portfolio` 이동 정상

### 21-3. LEFT INFO + RIGHT IMAGE editorial → 원본 터치어그래픽 hover gallery 재해석 (2026-09-05, 최신)

- 사용자가 기존 터치어그래픽 Portfolio(`touchagraphic.com/portfolio`)의 실제 hover 동작을 프레임 단위로
  검토한 뒤, §21-2 의 "1 project = 1 큰 section(좌 info / 우 이미지)" 구조를 통째로 폐기하고 원본
  갤러리의 interaction 언어(검정 타일 + hover 시 accent color panel 이 bottom→top 으로 슬라이드)를
  V2 사례 수(7개)에 맞게 2열로 재해석하기로 결정. Hero/필터 영역은 이번에도 그대로 유지
  - (참고: 이 작업 전 영상 파일(`references/portfolio-motion/touchagraphic-portfolio-reference.webm`)을
    이 세션에서 직접 재생/ffmpeg 프레임 추출을 시도했으나 둘 다 실패 — ffmpeg 미설치, Chrome 자동화
    환경에서 `<video>` 가 소스를 아예 fetch 하지 않아 재생 불가. 결국 사용자가 별도로(ChatGPT 쪽에서)
    프레임 분석한 결과를 텍스트 명세로 전달받아 그것을 source of truth 로 구현)
- **grid**: `grid-cols-1 lg:grid-cols-2`, gap 은 모바일 `gap-y-8`(일반 여백) / desktop `lg:gap-[1px]` +
  `lg:bg-black/15`(카드 사이 1px 틈으로 divider color 가 비치는 "검정 보드" 효과 — 카드 자체가
  edge-to-edge 라 grid 배경색이 hairline 처럼 보임). 홀수 마지막 항목(`세종스포츠정형외과`)은 CSS grid
  auto-placement 로 자동으로 왼쪽 칸만 차지(별도 코드 불필요)
- **card**: `aspect-ratio: 16/10`, `bg-black`, radius/border/shadow 없음. 이미지는 `absolute inset-0
  object-cover` + 기존 `objectPosition`/`mediaScale` 그대로 재사용(`PORTFOLIO` 데이터 자체는 무변경)
- **hover panel**(desktop 전용, `hidden lg:flex` + `lg:group-hover:translate-y-0`): 기본
  `translate-y-full`(카드 아래로 완전히 숨음) → hover 시 `translate-y-0`. `transition-transform
  duration-[260ms] ease-[cubic-bezier(0.22,1,0.36,1)]`(요청 240~300ms 범위 중간값), `motion-reduce:
  transition-none` 으로 reduced-motion 대응. 패널 배경은 `rgba(accent, 0.9)`(완전 불투명 아님 — 이미지가
  은은하게 비침, blur 없음)
  - **accent**: `PORTFOLIO` 배열은 손대지 않고 `PF_ACCENTS = ['#16B8E6'(cyan), '#ECA900'(mustard),
    '#F50076'(magenta), '#2A2A2A'(charcoal)]` 를 별도로 두고 원본 index 로 순환 배정(`index %
    PF_ACCENTS.length`) — filter 로 보이는 순서가 바뀌어도 항목별 accent 는 고정
  - **overlay text**: title(white, semibold, `clamp(20px,1.8vw,27px)`) → 작은 decorative `+`(white/50)
    → `category · description`(white/80, 13px), 전부 중앙 정렬. 긴 설명 새로 작성하지 않고 기존
    `item.description` 그대로 사용
- **mobile**(`lg:hidden`): hover 없음 — 이미지 타일 아래에 category + title 만 기본 텍스트로 노출
  (overlay 패널은 `hidden lg:flex` 라 모바일 DOM 에 아예 안 그려짐 → tap 오작동 위험 없음)
- **hero→grid 간격**: 새 gallery 섹션 `pt-[64px] lg:pt-[88px]`(§21-2 의 좌우 2단 giant section 구조를
  제거하면서 기존 spacing 로직도 함께 정리)
- **localhost 검수**(Claude in Chrome, 실제 마우스 hover 테스트): 대한상공회의소(cyan) hover → 패널이
  아래→위로 슬라이드, 이미지(말+캘린더 텍스트)가 패널 뒤로 은은하게 비침, `+` 표시 확인 → mouse leave 시
  아래로 슬라이드 아웃(중간 프레임 캡처로 확인) → 아이디어두잇(mustard) hover 로 다른 accent 확인 →
  동아쏘시오그룹(charcoal, index 3) hover 로 4번째 accent 확인 → row2/row3 스크롤, 마지막 항목이 왼쪽
  칸만 차지하는 것 확인 → `기관` 필터 클릭 시 기관 3개만 남아 2열로 정상 reflow(전환 순간 이미지 잠깐
  깜빡였다가 바로 로드 — lazy loading 특성, 문제 아님) → `전체` 복귀 확인. 모바일은 이번에도
  `resize_window` 도구가 세션에서 응답하지 않아 실측은 스킵(코드는 `lg:hidden`/`hidden lg:flex` 로 모바일
  분기 처리, 고정 폭 없음)
- `npm run build` 성공
  - 모바일 뷰포트 실측은 이번 세션에서 `resize_window` 도구가 응답하지 않아(브라우저 창이 리사이즈되지 않음) 스킵 —
    코드는 다른 섹션과 동일한 `SHELL`/`clamp()` 타이포/단일 컬럼 패턴만 사용해 가로 overflow 위험 요소 없음
- `npm run build` 성공(오류 없음)

---

## 22. Clients — 로고 wall → 텍스트 block archive 로 재설계 (2026-09-05, 최신)

- 2026-09-05 오전에 만든 실제 로고 12종 logo wall(위 이력, `CLIENTS: ClientLogo[]` + `client-logos/*` import)을
  다시 완전히 걷어내고 **텍스트 전용 block grid**로 교체. `src/imports/client-logos/` 파일 자체는 삭제하지
  않고 그대로 두되(요청대로), `App.tsx`의 import/타입/데이터/렌더는 로고를 전혀 참조하지 않음
  (`npm run build` 결과 dist에 client-logos 에셋 미포함 확인 — 실제 번들에서도 빠짐)
- **데이터**: `CLIENT_NAMES: string[]` 12개, 텍스트만. 표기 확정: `한국수목원정원관리원`(구 표기
  `한국수목정원관리원` 아님 — 공식 명칭으로 수정)
- **Clients heading**: 기존 `t-display`(Noto Serif KR) → Header/Portfolio 와 동일한 Noto Sans KR 700
  인라인 스타일로 교체(장식 serif 제거, 사이트 전역 고딕 계열과 통일). 옆 카피
  `약 5,300여 개의 기업과 함께해왔습니다.`는 문구 그대로 유지
- **grid**: `grid-cols-2 lg:grid-cols-4`(모바일·태블릿 2열, desktop 4×3), `gap-3 lg:gap-4`(로고 wall 때보다
  훨씬 촘촘 — reference 처럼 block 사이가 붕 뜨지 않게). 셀은 `h-[112px] lg:h-[152px] rounded-[8px]
  bg-black/[0.035]`(subtle gray, border/shadow/gradient/아이콘 없음), 브랜드명은 Noto Sans KR 600
  `clamp(18px, 1.6vw, 22px)` 중앙 정렬(가로/세로 모두, 모든 카드 동일 규칙)
  - 순서(요청 프롬프트의 ASCII 예시 그대로): 1행 동아제약·세종스포츠정형외과·한국수목원정원관리원·
    대한상공회의소 / 2행 이글루코퍼레이션·경기도중독관리통합지원센터·함평군 농업기술센터·한국가스기술공사 /
    3행 한국환경산업기술원·아이디어두잇·설빙·대구오페라하우스
- **인터랙션 없음**: marquee/auto-scroll/hover 모션 전부 배제, 완전 정적 composition
- **localhost 검수**: 12개 전부 표시, 정확히 4×3, 긴 기관명도 desktop 4열 폭에서 한 줄로 들어감,
  Estimator↔Clients / Clients↔black FAQ 전환 여백 자연스러움 확인. 모바일 실측은 이번에도
  `resize_window` 도구가 이 세션에서 응답하지 않아 스킵 — 코드는 고정 px 폭 없이 `grid-cols-2` 기반이라
  가로 overflow 위험 없음
- `npm run build` 성공. JS 번들이 이전(로고 wall, 260.77KB)보다 작아짐(245.90KB) — client-logos 에셋들이
  더 이상 참조되지 않아 빌드에서 빠졌기 때문(§15 이미지 용량 이슈와는 무관, 원본 파일은 그대로 보존됨)

### 22-1. 텍스트 block → 실제 로고 + monochrome block 로 재재설계 (2026-09-05, 최신)

- 위 텍스트 전용 block(`CLIENT_NAMES: string[]`)을 다시 걷어내고 `src/imports/client-logos/*` 실제 로고
  12종을 재사용하는 `CLIENTS: ClientLogo[]`(§21-2026-09-05 첫 로고 wall 시도와 같은 타입 모양,
  `{ name, src, scale?, blend? }` 또는 아이디어두잇만 `{ name, ideaSrc, doitSrc }`)로 교체. 원본 로고 파일은
  이번에도 전혀 수정하지 않음(recolor/crop 없음) — **화면에서만** CSS로 monochrome 처리
- **monochrome 처리** (`index.css` `.cl-logo`): `filter: url(#cl-mono-alpha-cut) brightness(0); opacity: 0.8`.
  `brightness(0)`은 원본 hue/명도와 무관하게 모든 로고를 동일한 짙은 톤으로 만들어 "브랜드별로 다른 gray
  tone" 문제를 원천 차단(grayscale+brightness+contrast 조합보다 훨씬 안정적)
  - `#cl-mono-alpha-cut`은 `Clients` 컴포넌트 안에 넣은 숨김 `<svg><filter>`(`feComponentTransfer`/
    `feFuncA type="discrete"`)로, alpha 0.5 미만 픽셀을 완전히 지운다. 일부 로고 PNG(특히 `korcham.png`)에
    디자인 캔버스의 옅은 반투명 그리드가 실수로 함께 export 돼 있어, `brightness(0)`만 쓰면 그 그리드까지
    검게 보여 지저분해지는 문제가 있었음 — 이 필터로 실제 로고 획(거의 불투명)만 남기고 그리드(저투명도)는
    제거
  - **`igloo.svg`/`daegu-opera.png`는 예외**(`blend: true` → `.cl-logo-blend`, `filter: grayscale(1)
    contrast(9); opacity: 0.85; mix-blend-mode: multiply`): 두 파일은 alpha 자체가 100%인 **불투명 흰
    배경**이 내장돼 있어(`brightness(0)`을 쓰면 배경까지 완전히 검게 칠해져 로고가 안 보이는 결함 발견 →
    localhost 확인 중 igloo가 완전 검은 사각형으로 렌더되는 걸 보고 원인 파악) alpha-cut 필터가 통하지
    않는다. 대신 `mix-blend-mode: multiply`로 흰 배경을 카드 배경에 녹여 지우고, `grayscale(1)
    contrast(9)`로 로고 자체(특히 daegu-opera의 옅은 "Daegu" 서브텍스트)를 다른 로고와 비슷한 짙기까지
    끌어올림(대구오페라하우스 원본에 "Daegu"/"Opera house" 두 글자가 서로 다른 밝기로 그려져 있어 contrast를
    2.2 → 5 → 9 로 3차례 재조정)
  - hover 시 `opacity: 1`(원색 복원/scale/translate/shadow 없음, 요청 범위 내 유일한 motion)
- **size normalization**: `scale`(표시 전용 `transform: scale()`, 기본 1) — 로고 대부분은 원본 캔버스에
  실제 내용이 이미 꽉 차 있어 `scale: 1` 그대로 두고, 캔버스 여백이 큰 로고만 확대: 대한상공회의소 1.7,
  이글루코퍼레이션 1.8, 한국수목원정원관리원 1.15(얇은 파스텔 라인이라 살짝 보정). 셀은
  `h-[112px] lg:h-[152px]`(§22 로고 wall 때의 `h-[46px]/[60px]`보다 훨씬 큼) + `overflow-hidden`이라
  `scale`이 지나치면 워드마크 끝이 crop될 위험이 있어, 이번엔 대부분 1로 유지하는 쪽으로 보수적으로 접근
- **아이디어두잇**: 기존과 동일하게 `ideaSrc`/`doitSrc` 두 이미지를 한 셀에서 `gap-2 lg:gap-2.5` +
  각 `maxWidth: 46%`로 나란히 배치
- **heading**: 옆 카피 `약 5,300여 개의 기업과 함께해왔습니다.` → `기업과 기관의 달력 제작을
  함께해왔습니다.`로 교체(성과 숫자 제거). heading↔grid 간격은 `u-head-gap` → `mt-8 lg:mt-10`(더 조밀하게)
- **localhost 검수**: 12개 전부 정상 렌더, 톤 통일 확인(zoom으로 대한상공회의소/이글루/설빙/대구오페라
  근접 비교), 4×3 grid, IGLOO·대구오페라 불투명 배경 결함 발견 후 수정 완료, korcham 그리드 아티팩트 발견
  후 alpha-cut 필터로 해결(완전히는 아니고 아주 옅은 라인 1px 정도 잔존 — 육안상 거의 인지 불가 수준),
  Clients↔FAQ 전환 확인. 모바일은 이번에도 `resize_window` 도구 미응답으로 실측 스킵(§21/§22 동일 제약,
  코드는 `grid-cols-2` 고정 폭 없이 구성)
- `npm run build` 성공(client-logos 에셋 재포함으로 JS 번들 245.90KB → 261.39KB)

## 23. Header 로고 → Home 링크 (2026-09-05)

- Header 좌측 `터치어그래픽` 텍스트 로고를 `<a href="/">`로 유지하되 `onClick`에서 `preventDefault` 후
  현재 위치에 따라 분기: landing(`page==='landing'`)이면 맨 위로 스크롤, `/portfolio`면
  `navigate('/')`로 이동(§21의 `navigate` prop 재사용, 새 상태/로직 추가 없음)
  - `handleLogoClick`을 Header 내부에 추가한 것 외 디자인(className/style)은 완전히 그대로 —
    underline·버튼화 없음, 위치/크기 변경 없음
- **localhost 검수**: `/`에서 로고 클릭 → 상단으로 스크롤, `/portfolio`에서 로고 클릭 → `/`로 이동 후
  Hero/제작 사례 정상 렌더 확인
- `npm run build` 성공

---

## 24. `/inquiry` 문의 페이지 신설 + Header CTA 연결 (2026-09-07)

- **Header CTA**: 데스크톱 우측 `빠른상담`(`#1E50E0`, `#contact` 대상 없어 클릭 무반응이던 버튼, §12-1)을
  워딩만 `상담 문의`로 변경하고 `/inquiry`로 라우팅. 스타일/색/크기는 그대로.
  `Header`의 `page` prop 타입에 `'inquiry'` 추가, `handleInquiryClick`(로고/nav 클릭과 동일 패턴:
  이미 `/inquiry`면 상단 스크롤, 아니면 `navigate('/inquiry')`) 추가. **모바일 전용 `제작 문의` 버튼
  (`scrollToContact` → `#contact`, 대상 없음)은 이번 범위가 아니라 그대로 둠** — 여전히 미해결(§12-1 갱신).
- **라우팅**: `App()`의 `route` state를 `pathToRoute(pathname)` 헬퍼로 `'/' | '/portfolio' | '/inquiry'`
  3갈래로 확장(§21의 `navigate`/`popstate` 로직 재사용, 새 로직 추가 없음). `public/_redirects`(SPA
  fallback)가 이미 모든 경로를 커버해 `/inquiry` 직접 진입도 별도 설정 없이 동작.
- **`InquiryPage` 컴포넌트**(`src/App.tsx`, `PortfolioPage` 바로 다음): 기존 Touchgraphic 문의 페이지
  (`touchagraphic.com/page/inquiry.html`, Claude in Chrome으로 실측)의 layout/spacing/form architecture를
  재현. V2 `Header`(`page="inquiry"`) 그대로 재사용, `SHELL` 안에 `max-w-[1200px] mx-auto`로 폭 절충.
  - **intro**: eyebrow `Inquiry`(Portfolio 페이지와 동일한 Courier New 라벨 스타일) + 헤드라인
    `프로젝트를 알려주세요.` + 안내 카피 1줄. reference의 감성 마케팅 카피("소장하고 싶은 심미적인
    결과물을...")는 그대로 옮기지 않고 절제된 안내문으로 대체(AGENTS §9 — 새 감성 카피 임의 작성 금지
    원칙에 따라 최소 문구만 새로 작성)
  - **필수 표시**: 우측 상단 `필수 입력 사항` + `RequiredDot`(`#DB438F`, Estimator 마스트헤드 CMYK 도트에
    이미 쓰인 magenta 재사용 — 새 색 추가 없음)
  - **01. 원하는 플랜을 선택해주세요.** (하나만 선택 가능): 기존 reference의 다중 프로젝트 타입 버튼 대신
    현재 Estimator `TIER_DATA`의 표시명 3개(`베이직 (실속형)` / `커스텀 (맞춤형)` / `하이앤드 (기획형)`)를
    그대로 재사용(새 카피 없음). `type="radio" name="plan" required` + `sr-only`로 네이티브 single-select·
    필수 검증 확보, 시각은 rectangular box(선택 시 `#1A1A1A` 배경/흰 글자, reference와 동일 톤).
    **Estimator(`EstimatorInline`)의 가격 데이터·계산 로직은 전혀 참조/변경하지 않음** — 이름 문자열만 재사용
  - **02. 프로젝트 정보를 입력해주세요.**: `프로젝트명` 자리를 `제작 수량`(text, placeholder만) 으로 대체.
    `사용예정일`은 기존 `DEADLINE_OPTS`, `프로젝트 예산`은 기존 `BUDGET_OPTS`(둘 다 `ConsultForm`에서도
    쓰는 기존 옵션, 새 카피 없이 재사용)를 넣은 `<select>`. `첨부파일`은 숨김 `<input type="file">` +
    `파일업로드` 버튼(선택한 파일명만 표시, 업로드 전송 없음). `상세 문의내용`은 `<textarea rows={6}>`
  - **03. 기본정보를 입력해주세요.**: `회사명* / 담당자명* / 연락처* / 이메일* / 유입경로* / 웹사이트`
    2-column. `유입경로` 옵션(`REFERRAL_OPTS`)은 기존에 없어 새로 추가(검색/SNS/지인·업체 소개/기존 고객/기타)
  - **04(기존 reference의 accordion) 없음**: 03 다음 바로 privacy + submit — 요청대로 만들지 않음
  - **privacy + submit**: `개인정보처리방침에 동의합니다.` 체크박스(`required`) + `내용보기` 토글(임시
    안내문 노출, `TODO` 주석으로 실제 정책 전문 필요 표시) + outline 화살표 버튼 `프로젝트 의뢰하기 →`
    (reference의 아이콘+사각 outline 버튼을 사이트 기존 화살표 모티프로 재해석)
  - **submit 동작 — 백엔드 없음, fake success 없음**: `handleSubmit`은 `e.preventDefault()` 후
    `console.log('[InquiryPage] submit — 백엔드 미연결...', {...formState})` 만 수행하고, 화면에는
    `입력하신 내용 확인했습니다. 실제 접수 연동(이메일 전송 등)은 아직 준비 중입니다.` 문구를 노출.
    **`TODO` 주석으로 실제 접수 API/이메일 전송 연동 필요함을 명시. touchagraphic.com의 실제 backend
    endpoint를 추측해서 연결하지 않았다.** required validation은 전부 네이티브 HTML5 속성(`required`)에
    위임(커스텀 검증 로직 없음)
  - **반응형**: `grid-cols-1 sm:grid-cols-2`(02·03 필드), `grid-cols-1 sm:grid-cols-3`(01 플랜 박스).
    고정 px 폭 없이 `max-w-[1200px]`/`flex-1 min-w-0`/`truncate` 위주라 가로 overflow 위험 요소 없음
- **localhost 검수**(Claude in Chrome, 실제 reference와 나란히 비교): Header `상담 문의` 클릭 → `/inquiry`
  이동, intro/01/02/03/privacy/submit 전체 구조가 reference와 유사한 밀도로 확인, 01에서 플랜 3개 중
  하나 클릭 시 다른 선택 자동 해제(단일 선택) 확인, 02에 `프로젝트명` 없고 `제작 수량` 있음 확인, 03 기본정보
  정상, 04 없음 확인, 빈 폼 제출 시 네이티브 required validation으로 첫 미입력 필드까지 스크롤됨 확인,
  전체 필드 채운 뒤 제출 → 콘솔에 `[InquiryPage] submit` 로그 + 화면에 "준비 중" 안내문 노출(가짜 성공
  없음) 확인, `/portfolio` 재방문해 기존 화면 영향 없음 확인. **모바일 실측은 이번에도 `resize_window`
  도구가 이 세션에서 실제 뷰포트를 바꾸지 못해(§21 이후 반복된 동일 제약) 스크린샷으로 확인하지 못했고,
  고정 폭 요소가 없는 코드 리뷰로 overflow 위험 없음만 확인함**
- `npm run build` 성공
- **다음 필요 작업(§19 참고)**: 실제 문의 접수 backend(이메일 전송/스프레드시트/CRM 등) 연동, 개인정보처리방침
  전문 확정, 모바일 실기기 검수, Header 모바일 `제작 문의` 버튼(`#contact`, 대상 없음)도 `/inquiry`로
  연결할지 여부 결정

---

## 25. Landing visual refinement — rhythm/typography 2차 조정 (2026-09-07)

§21 이후 "잘 만든 섹션을 이어 붙인 느낌"이라는 피드백에 따라 Hero/Portfolio/Estimator/FAQ 사이의
vertical rhythm과 Hero 내부 typography를 다시 조정. **문구·가격·계산 로직·데이터는 변경 없음**,
spacing/line-height/일부 width 구조만 조정.

### Hero (`function Hero`, `src/App.tsx`)
- headline(`기업 / 기관` / `달력 제작 회사`) `line-height`: **1.3 → 1.14** (Noto Sans KR 특유의 느슨한
  내부 leading을 압축해 "단단하고 응집력 있게"), `fontSize` clamp 상한: **66px → 80px**(wide desktop
  존재감 강화)
- Hero 하단 padding: **`pb-[44px] lg:pb-[80px]` → `pb-[36px] lg:pb-[56px]`**(Hero→Portfolio 전환을
  더 빠르게 이어지도록 축소, Portfolio 쪽 조정과 함께 적용)
- **`u-content-max`(신규 CSS class, `index.css`, `max-width:1600px`, margin 없이 우측만 캡)**: wide
  desktop(1600px+)에서 좌측 headline과 우측 supporting copy(`전문 디자이너가` / `기획부터 — 제작까지
  함께합니다`) 사이 gutter가 실측 **1199px**까지 벌어져 두 블록이 "떠 있는" 것처럼 보이던 문제를 해결.
  적용 후 gutter **168px**로 축소, Hero badge+headline+우측 copy 전체를 이 클래스로 감쌈(좌측 시작선은
  `.u-shell` 그대로 유지 — margin-inline 없음)
- 이 gutter 문제는 Hero에만 적용(Portfolio 제목 행의 화살표/전체보기 컨트롤, FAQ 아코디언의 +/− 아이콘은
  "보조 유틸리티"라 넓은 여백이 정상 패턴으로 판단 — `u-content-max` 미적용, 의도적 결정)

### Portfolio → Hero/Estimator 전환 (`function Portfolio`)
- section padding: **`pt-[52px] pb-[76px] md:pb-[96px] lg:pt-[124px] lg:pb-[160px]`
  → `pt-[44px] pb-[64px] md:pb-[84px] lg:pt-[92px] lg:pb-[132px]`**
- 데스크톱 합산 간격: Hero→Portfolio **204px → 148px**(빠르게 이어짐), Portfolio→Estimator
  (Portfolio `pb-132` + Estimator `u-section-sm` 상단 clamp 최대 96) **≈256px → ≈228px**로,
  Hero→Portfolio(148px)보다는 여전히 크게 유지해 "큰 시각 콘텐츠 뒤에는 한 번 더 숨쉬기" 위계 보존
- Estimator(`EstimatorInline` 마스트헤드) 내부는 이미 조밀해 이번에 변경하지 않음(가격 로직 인접 코드라
  리스크 최소화 목적도 있음)

### FAQ (`function FaqSection`, `FaqRow`)
- section 상단 padding: **`pt-[80px] lg:pt-[140px]` → `pt-[64px] lg:pt-[112px]`**(하단 `pb-[100px]
  lg:pb-[160px]`은 페이지 종료 무게감 유지 위해 그대로)
- heading → 첫 질문: **`mt-9 lg:mt-12` → `mt-8 lg:mt-10`**
- 각 질문 row: **`py-6 lg:py-7` → `py-5 lg:py-6`**, 답변 하단 padding **`pb-6 lg:pb-7` → `pb-5 lg:pb-6`**
- CTA(`터치 본 홈페이지 바로가기 →`): **`mt-10 lg:mt-14` → `mt-8 lg:mt-12`**
- copyright: **`mt-10 lg:mt-14` → `mt-8 lg:mt-10`**
- 목표: 질문·CTA·copyright가 하나의 조밀한 "마무리 블록"으로 보이게(question row 높이 축소로 밀도 ↑)

### localhost 검수
- media-palette.co.kr(REFERENCE)과 실측 비교(getBoundingClientRect/computedStyle) 후 적용, 적용 후
  재확인: Hero headline이 눈에 띄게 단단해짐, Hero→"제작 사례" 전환이 즉시 이어지는 느낌, FAQ 질문/CTA/
  copyright가 하나의 조밀한 마무리 블록으로 보임 확인. 가로 스크롤/overflow 없음(px 조정 + `u-content-max`
  뿐, 새 고정폭 요소 없음)
- `npm run build` 성공

---

## 26. `/portfolio` 실제 데이터 이식 + 상세 페이지(`/portfolio/:idx`) 신설 (2026-09-07)

§21 의 임시 7개(Landing과 동일한 `PORTFOLIO` 재사용)를 걷어내고, 기존 Touchgraphic Calendar
Portfolio(`touchagraphic.com/portfolio/pf.html?part_idx=21`)의 **실제 17개 프로젝트**로 교체하고
프로젝트 클릭 시 실제 상세 이미지를 보여주는 `/portfolio/:idx` 페이지를 신설했다.
**Landing의 `Portfolio`(가로 캐러셀, 임시 7개 `PORTFOLIO` 데이터)는 이번에도 전혀 건드리지 않음** —
Landing = 대표 7개, `/portfolio` = 실제 17개 전부, 로 완전히 분리된 상태.

### Production data
- **`src/data/calendarPortfolio.ts`**(자동 생성 파일 — 상단에 "수정하지 말 것" 주석) — `CALENDAR_PORTFOLIO`
  (17개 project 배열) + `getCalendarProjectByIdx(idx)` export
  - source: `references/touch-portfolio-source/manifest.json`(title/company/category/date) +
    `references/touch-portfolio-original/manifest-web.json`(webPath/width/height)를 order 기준 병합
  - 생성 스크립트: `references/touch-portfolio-source/generate-data-file.mjs`(1회성, 재실행 가능)
  - **17 project 전부, detail image 186장 전부** 포함(생성 시 개수 불일치 시 throw 하도록 만들어둠)
  - `category` 필드는 원본 사이트의 실제 필터값(Editorial/Graphic/Calendar)이며 **"기업/기관" 분류가
    아니다** — 원본에 기업/기관 metadata가 없어 임의로 만들지 않음(§12 참고)
- 이미지 경로는 전부 `/portfolio/calendar/...` (public web asset, §27) — runtime에서
  `references/touch-portfolio-original/`(425MB 원본) 참조 없음

### `/portfolio` 목록 페이지 (`function PortfolioPage`)
- Hero(`PORTFOLIO` eyebrow + `달력으로 완성한 브랜드의 장면들.`), 4열(desktop)/2열(tablet)/1열(mobile)
  wide wall 구조, black tile, `object-fit:contain`, hover bottom→top 패널, `.u-gallery-wide` 폭 —
  **전부 §21-3 이후 구조 그대로 유지**, 타일 콘텐츠만 `CALENDAR_PORTFOLIO`(17개)로 교체
  - `PORTFOLIO_FILTERS`(전체/기업/기관) 버튼 UI는 그대로 두되, 원본에 기업/기관 분류가 없어 **filter
    로직을 실질적으로 비활성화**(항상 17개 전부 노출) — 파괴적 UI 변경 금지 + 콘텐츠 정확성 우선 원칙에 따른
    임시 조치, 분류 데이터가 정해지면 `filter` 조건을 다시 연결해야 함(§12)
  - 각 타일 전체가 `<button onClick={() => navigate(`/portfolio/${item.idx}`)}>`로 클릭 가능
  - hover/모바일 캡션 텍스트: `title` + (`company` ?? `category`)만 사용, 없는 description 임의 작성 안 함

### 상세 페이지 (`function PortfolioDetailPage`, route `/portfolio/:idx`)
- **routing**: `App()`의 `pathToRoute()`에 `/^\/portfolio\/\d+$/` 패턴 추가(새 라우팅 라이브러리 없음,
  기존 pushState/popstate 방식 그대로 확장). 잘못된 idx(`/portfolio/999999`)는 크래시 없이 "프로젝트를
  찾을 수 없습니다 + ‹ 목록으로" 표시(리다이렉트 아님, 정적 안내)
  - `Header`의 `page` prop에 `'portfolio-detail'` 추가(로고/nav 클릭 시 `'portfolio'`가 아닌 경로이므로
    자동으로 `navigate('/')` / `navigate('/portfolio')`로 떨어짐 — 별도 분기 로직 추가 불필요)
- **body 구성**: 원본 detail page(idx 1878/974/827 3개 실측) 핵심만 이식 — 검은 배경 위 이미지가
  edge-to-edge full-bleed로 순서대로 쌓이는 구조(hairline divider, crop/stretch 없음, `width:100%
  height:auto`), 상단에 `‹ 목록으로` + `category · date` + title + company(있으면). **원본의 세로 텍스트
  사이드바(About/Works/Contact 등 global nav 포함)는 그대로 복제하지 않고** V2 Header + 가로형 정보
  블록으로 재해석(반응형·작업 시간 고려한 의도적 단순화 — 필요시 나중에 더 정교화 가능)
  - 이미지 wrapper: `.u-gallery-wide`(Portfolio 목록과 동일한 wide breakout 축 재사용, 새 width 시스템
    추가 없음)
- **이전/다음/목록 navigation**: `CALENDAR_PORTFOLIO`의 `order` 기준으로 계산. 첫 프로젝트(order 1,
  idx 1878)는 "이전" 없음, 마지막(order 17, idx 827)은 "다음" 없음 — 둘 다 확인됨. 텍스트 링크 수준(새
  카드/CTA 없음)
- **image loading**: 프로젝트당 처음 2장만 `loading="eager"`, 나머지 `lazy`. 네트워크 로그로 확인:
  목록 페이지는 17 thumbnail만 요청, 상세 페이지는 선택된 프로젝트의 eager 2장만 초기 요청되고 다른
  프로젝트의 이미지는 전혀 요청되지 않음(§17 성능 요구사항 충족)
- **scroll-to-top 버그와 수정**: `App()`의 `navigate()`가 쓰는 legacy 2-인자 `window.scrollTo(0,0)`이
  전역 CSS `scroll-behavior: smooth`(`index.css` `html`)를 따르는 애니메이션 스크롤이라, 상세→상세
  이동(예: idx 1878 뒤로 매우 긴 스크롤 상태에서 idx 1870으로 "다음" 클릭) 시 React가 옛 DOM을
  치환하면서 스크롤 애니메이션이 중간에 끊겨 `scrollY`가 이전 위치(9000px+)에 그대로 남는 문제 발견.
  `PortfolioDetailPage`에 `useEffect(() => window.scrollTo({top:0,left:0,behavior:'auto'}), [idx])`
  추가해 해결(옵션 객체의 `behavior:'auto'`는 CSS smooth-scroll을 무시하고 즉시 이동 — 공유
  `navigate()` 함수 자체는 다른 페이지 영향 없도록 건드리지 않음, `PortfolioDetailPage` 국소 수정)
- **browser back/forward 테스트**: 목록→클릭→상세(direct)/뒤로→목록/앞으로→상세/직접 URL 진입
  (`/portfolio/827`) 전부 정상 확인

### localhost 검수 (Claude in Chrome, touchagraphic.com과 실측 비교)
- `/portfolio` 첫 4개 순서·thumbnail·title이 원본과 정확히 일치 확인(썸네일 안의 "AI" 배지는 원본
  이미지 파일 자체에 포함된 것이라 그대로 재현됨도 확인 — UI에서 새로 추가한 것 아님)
- 상세 4개 테스트: order1(idx1878, 10장) / order2(idx1870, 12장, prev/next) / order13(idx974, 23장,
  touchagraphic.com+creativedoit.com 혼합 호스트+gif+png 포함) / order17(idx827, 3장, 가장 오래된
  creativedoit.com 전용 프로젝트) — 전부 이미지 개수·순서 정상
- Landing(`/`) Hero/캐러셀/Estimator(견적 계산 정상, 900,000원 표시 확인), `/inquiry` 회귀 테스트 정상
- `npm run build` 성공, `dist/portfolio/calendar/`에 203개 webp 정상 복사 확인

---

## 27. Touchgraphic Calendar Portfolio — 원본 확보 + 웹 최적화 asset 파이프라인 (2026-09-07)

§26 의 production data가 참조하는 실제 asset을 만든 작업. **원본 파일도, 실제 application code도
이번 파이프라인 자체에서는 수정하지 않음** — 전부 `references/` 아래 1회성 스크립트로 처리.

### 1) Source 조사 — `references/touch-portfolio-source/`
- `manifest.json` — touchagraphic.com에서 Claude in Chrome으로 직접 DOM 분석해 수집한 17개 프로젝트
  원본 메타(order/idx/title/category/company/date/description/thumbnailUrl/detailUrl/detailImages
  원본 URL). **source of truth** — 이 파일은 이후 어떤 단계에서도 덮어쓰지 않음
- `SOURCE_REPORT.md` — 조사 과정 요약
- 결과: 17 project, thumbnail 17개, detail image 186개, 전부 URL 확보 성공(막힌 곳 없음)

### 2) 원본 다운로드 — `references/touch-portfolio-original/` (**약 426MB, runtime 사용 금지**)
- `download-assets.mjs`(Node, 1회성) 로 203개(썸네일 17 + 상세 186) 전부 다운로드
- 폴더 구조: `NNN-slug/`(예 `001-donga-diary/`) 안에 `thumbnail.<ext>` + `01.<ext>`…`NN.<ext>`,
  원본 파일명/확장자(.jpg/.JPG/.gif/.png 등) 그대로 보존, resize/압축/포맷변환 없음
- `manifest-local.json` — 각 asset의 원본 URL ↔ local path 매핑(§26 데이터 생성의 입력 중 하나)
- 검증: 203/203 다운로드 성공, 실패 0, 중복 URL 0(`download-summary.json`)

### 3) 웹 최적화 — `public/portfolio/calendar/` (**약 22MB, 실제 웹에서 쓰는 유일한 경로**)
- `optimize-assets.mjs`(Node + `sharp`, 1회성) 로 203개 전부 WebP 변환
  - **quality 84**(80/84/88 실측 비교 후 결정 — 캘린더 그리드 미세 숫자/한글/얇은 선/그라데이션 등
    6종 크롭 확대 비교에서 세 값 사이 육안 차이 없음 확인, 안전마진 있는 84 선택)
  - **thumbnail max-width 1200px**, **detail max-width 2000px**(2200px도 테스트했으나 초소형
    인쇄용 라벨 텍스트 개선폭이 미미해 2000px 유지 — 실제 날짜 숫자/월 라벨은 2000px에서 이미 선명)
  - upscale 없음(원본이 target보다 작으면 원본 크기 그대로), crop/stretch 없음, aspect ratio 유지,
    auto-rotate(EXIF) 적용
  - `sharp`는 `npm install sharp --no-save --no-package-lock`로 **임시 설치**(package.json/lock
    파일 변경 없음 — `git status`로 확인됨). node_modules는 gitignore 대상이라 그대로 둬도 안전
- `manifest-web.json`(`references/touch-portfolio-original/` 안) — 각 asset의 원본 local path ↔
  `/portfolio/calendar/...` webPath + width/height 매핑(§26 데이터 생성의 또 다른 입력)
- 검증(자체 + 독립 스크립트 `validate-optimized.mjs` 이중 확인): **203/203 valid**, 0 failed,
  WebP magic bytes/upscale 없음/aspect ratio 일치 전부 통과
- 용량: 원본 약 425,982,539 bytes(426MB) → 최적화 23,030,622 bytes(약 22MB), **감소율 94.8%**
- 육안 검수: 밝은 배경/어두운 스튜디오 사진/작은 한글+이모지/GIF·PNG 소스/일러스트 그라데이션 등 6종
  실제 파일을 원본과 확대 비교, 밴딩·블록 아티팩트·텍스트 뭉개짐 없음 확인

### 파일 경로 요약
| 경로 | 용량 | 용도 |
|------|------|------|
| `references/touch-portfolio-source/manifest.json` | - | 원본 메타데이터 source of truth |
| `references/touch-portfolio-original/` | ≈426MB | 원본 archive, **runtime 사용 금지** |
| `references/touch-portfolio-original/manifest-local.json` | - | 원본 URL↔local path |
| `references/touch-portfolio-original/manifest-web.json` | - | local path↔webPath+크기 |
| `public/portfolio/calendar/` | ≈22MB | **실제 웹에서 쓰는 유일한 asset 경로** |
| `src/data/calendarPortfolio.ts` | - | application이 실제로 import하는 production data |

---

## 12. 아직 해결해야 할 문제

| # | 위치 | 문제 |
|---|------|------|
| 1 | Header | ~~`빠른상담`(데스크톱) 버튼이 `#contact` 를 가리키나 대상 섹션 없음~~ → 2026-09-07 해결(§24). `제작 문의`(모바일 전용) 버튼은 여전히 `#contact` 를 가리켜 클릭 시 스크롤 안 됨 — 미해결 |
| 2 | Header | `상담 문의`(구 `빠른상담`) 배경 `#1E50E0` 임시색 — 브랜드색 확정 후 교체 필요 |
| 3 | Portfolio | ~~`포트폴리오 전체보기 ›` 링크 미연결~~ → 2026-09-05 해결. `/portfolio` 전체보기 페이지 신설(§21) |
| 4 | Portfolio | ~~7개 대표컷 최종 선정 미확정~~ → 2026-09-07 해결. `/portfolio`는 실제 17개 전부로 교체됨(§26). Landing 캐러셀의 임시 7개(`PORTFOLIO`, `objectPosition`/`mediaScale`)는 여전히 별개로 남아있고 미변경 |
| 5 | Clients | ~~실제 로고 이미지 없음~~ → 2026-09-05 해결. 실제 12개 클라이언트 로고 wall 로 교체(§22) |
| 6 | consult 뷰 | `sels` 가 항상 빈 값 → 요약 6개가 전부 `—`. 폼 실제 전송 없음 |
| 7 | 전역 | Service / Contact / Consultation / 구 FAQ / Footer / EstimatorPage 등 미렌더 레거시 다량 잔존 — 정리 여지(요청 시에만) |
| 8 | 전역 | accent 색 불일치(`#FF2D16` / `#1E50E0` / `#1A1A1A` / `#D65A34` 계열) — 브랜드색 확정 후 정리 |
| 9 | 빌드 | 미사용 이미지(구 4:5 png 세트 등)가 `void` 참조로 번들에 포함 — 용량 과다(§15) |
| 10 | SEO | `.figma/make/site.json` `robots.index: false` → 빌드 결과 `noindex` + `robots.txt Disallow: /`. `<title>` 기본값, description 영문 자동 생성, GA 미설정 |
| 11 | 구조 | 색상·폰트 인라인 하드코딩 산재 — 토큰화 여지(요청 시에만) |
| 12 | `/portfolio` | **기업/기관 filter 분류 미확정** — 원본 Touchgraphic에 기업/기관 metadata가 없어(category는 Editorial/Graphic/Calendar만 존재) filter 버튼 UI는 있지만 실제로는 항상 전체 17개 노출. 17개 각각을 기업/기관으로 분류할 기준을 사용자가 정해야 `PortfolioPage`의 filter 조건을 다시 연결할 수 있음(§26) |
| 13 | `/portfolio/:idx` | 상세 페이지 상단 정보 블록은 원본의 세로 텍스트 사이드바를 그대로 복제하지 않고 V2 톤 가로 블록으로 재해석함(§26) — 필요하면 더 원본에 가깝게 다듬는 디자인 디테일 검수 여지 있음 |
| 14 | `/inquiry` | 실제 문의 접수 backend(이메일 전송/스프레드시트/CRM 등) 미연결 — 현재는 `console.log` + "준비 중" 안내만 표시(§24) |
| 15 | 전역 | 모바일 실기기 검수 미실시 — 이번 세션들에서 Claude in Chrome의 `resize_window` 도구가 실제 뷰포트를 바꾸지 못해 코드 리뷰(고정 폭 요소 없음)로만 안전성 확인, 실기기/실제 좁은 뷰포트 스크린샷 검증은 아직 없음 |
| 16 | Git | `references/touch-portfolio-original/`(≈426MB) · `references/touch-portfolio-source/`(≈46MB, quality-test 크롭 포함) · `public/portfolio/calendar/`(≈22MB) 가 전부 untracked 상태 — 무엇을 커밋할지 결정 필요(§16 참고) |

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

- **성공** (2026-09-07 최종 재확인, §25/§26/§27 반영 후). `vite v8.x` → `✓ built in ~1.2s`. 빌드 오류 없음
- 산출물: `dist/assets/index-*.js` ≈ 296KB (gzip 92.6KB), `index-*.css` ≈ 50KB (gzip 9.5KB), `dist/index.html`, `dist/robots.txt`, `dist/portfolio/calendar/`(203개 webp, `public/`에서 그대로 복사됨, 확인 완료)
- `npm run build` 는 `tsc` 타입 체크를 돌리지 않으므로, 타입 오류가 있어도 빌드는 통과할 수 있음
- 경고성 사실(오류 아님):
  - **이미지 용량 과다** — 레거시 `EXHIBITIONS` 가 파일 끝 `void EXHIBITIONS` 로 참조돼 있어, rail 에 안 쓰는 `pf01~pf15` 대형 png 까지 전부 번들에 포함. 최대: `일러스트_한국수목정원관리원.png` ≈10.4MB, `기업_설빙.png` ≈10.3MB, `기업_동아제약.png` ≈9.6MB. rail 실제 사용분은 원본 사진 8장(7 카드 + 1 secondary). **`/portfolio` 실제 17개 asset(§26/§27)은 이 문제와 무관** — `public/portfolio/calendar/`는 Vite 모듈 번들이 아니라 static copy라 최적화된 22MB만 그대로 `dist/`로 복사됨
  - `dist/robots.txt` = `User-agent: *\nDisallow: /` (site.json `robots.index: false`). 공개 인덱싱 원하면 §12-10 참고

---

## 16. Git / branch 상태

- 현재 branch: **`v2-redesign`** (HEAD, `origin/v2-redesign` 을 tracking)
- **GitHub remote**: `origin` = `https://github.com/Taesaje/touchagraphic-calendar-v2.git`
- **commit 이력**(`git log --oneline --decorate`, 2026-09-07 확인, 오래된 것부터):
  1. `7f9fae0` `V1 회의 전 기준점` — tag `v1-pre-meeting`, `main`/`origin/main` 이 가리키는 커밋(V1 기준점, `main` 은 이미 `origin/main` 으로 push 완료)
  2. `2da8448` `V2 의사결정권자 검토본 1차`
  3. `a92ada6` `V2 포트폴리오·클라이언트·견적 UI 업데이트` — **`v2-redesign` 의 현재 HEAD, 이미 `origin/v2-redesign` 으로 push 완료**(tracking branch 설정됨)
- **즉 "V2 작업이 전부 미커밋"이라는 이전 서술은 틀렸다.** `a92ada6` 까지는 이미 GitHub에 push된 상태다.
  **미커밋인 것은 `a92ada6` 이후, 오늘(2026-09-07) 세션들에서 진행한 작업분뿐이다**:
  Landing rhythm 재조정(§25) · `/portfolio` 실 데이터 이식·상세 페이지(§26) · asset 확보/최적화
  파이프라인(§27) · `/inquiry`(§24, 이 커밋 이전 작업일 가능성도 있으나 working tree 기준으로는 현재
  미커밋 변경분에 포함) — 이 working tree 변경사항은 아직 새 commit 으로 만들어지지 않았다
- 현재 `git status --short`(오늘 작업 시작 시점 기준):
  - `M PROJECT_STATUS.md` / `M src/App.tsx`(§24~§26 반영분 포함) / `M src/index.css`(§25 `u-content-max` 등 포함)
  - untracked: `night-portfolio.ps1`, `src/data/`(§26, `calendarPortfolio.ts`), `public/portfolio/`(§27, ≈22MB, **웹 asset — 커밋 후보**), `references/touch-portfolio-original/`(§27, **≈426MB — 절대 커밋 금지**), `references/touch-portfolio-source/`(§27, ≈46MB, 조사/스크립트/quality-test 크롭 — 대부분 archive 성격, 커밋 여부 판단 필요)
- 커밋 메시지만으로는 `a92ada6` 시점에 정확히 어디까지 반영됐는지(예: `.pf-card:hover` scale 값 등 세부
  조정 하나하나) 완전히 구분하기 어려운 부분이 있을 수 있음 — 다만 **commit 자체와 GitHub push 여부는
  위 3개 커밋 + 두 브랜치 모두 확정된 사실**이다
- **⚠️ 다음 세션에서 커밋할 때 반드시 주의**:
  - **`git add .` / `git add -A` 사용 금지 권고** — `references/touch-portfolio-original/`(426MB)이 함께 staging될 위험이 매우 큼. 파일을 개별 지정해서 add 할 것
  - `references/touch-portfolio-original/` 은 archive 원본이라 **repo에 커밋하지 않는 것을 권장**(용량 문제) — 필요하면 `.gitignore` 추가를 사용자에게 먼저 확인
  - `public/portfolio/calendar/`(22MB, 실제 웹 asset)는 정상적인 커밋 후보이지만 저장소 용량이 커지므로 커밋 여부는 사용자 판단 필요
  - `night-portfolio.ps1` — 용도 불명 untracked 스크립트, 이번에도 그대로 두고 건드리지 않음(§AGENTS: 낯선 파일 임의 삭제 금지)
  - 오늘 작업분을 커밋하면 `a92ada6` 이후의 **새 commit**이 되어야 한다(기존 커밋을 amend하지 않는다).
    커밋 후 `origin/v2-redesign` 으로 push 할지, 그리고 §17 의 V2 검토용 Netlify 사이트에 재배포할지는
    반드시 사용자 지시를 받은 뒤 진행한다

---

## 17. 배포 상태 — V1 공개본 유지, V2 검토용 사이트 이미 존재(오늘 작업분 재배포 전)

### V1 (현재 공개본 — 그대로 유지, 건드리지 않음)
- Netlify 운영본: `https://dancing-twilight-d43fb2.netlify.app/`
- 아임웹(Imweb): 코드 위젯에 위 Netlify 사이트를 `<iframe>`(고정 height) 로 임베드해 실게시 상태. 아임웹 기본 Header 숨김 처리됨
- 개인(커스텀) 도메인은 아직 미연결

### V2 (현재 branch `v2-redesign`)
- **의사결정권자 검토용 Netlify 사이트가 이미 존재한다**: `https://gleaming-naiad-0686ac.netlify.app/`
  (V1 운영 URL·아임웹 게시본과는 완전히 별개, V1은 그대로 유지)
- **2026-09-07 이전 작업분(commit `a92ada6` 기준)까지가 이 사이트에 배포된 상태로 추정된다.**
  오늘(2026-09-07) 세션들에서 진행한 Landing rhythm 재조정(§25) · `/portfolio` 실 데이터 이식·상세
  페이지(§26) · asset 최적화(§27) · `/inquiry`(§24) 등은 전부 **아직 이 커밋 이후의 미커밋 working
  tree 변경사항**이라 **아직 이 Netlify 사이트에 재배포되지 않았다**(§16 참고)
- 재배포(및 그 전 단계인 새 commit/push)는 사용자가 명시적으로 지시한 뒤 진행한다. 그 전까지 Netlify
  재배포·공개본 업데이트 작업 금지

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

1. **`/portfolio` 기업/기관 filter 분류 확정**(§12-12) — 17개 프로젝트를 기업/기관으로 분류할 기준을
   사용자에게 받아 `PortfolioPage`의 filter 조건을 다시 연결. 원본 사이트에 metadata가 없어 지금은
   filter 버튼이 시각적으로만 존재(항상 전체 17개 노출)
2. **`/portfolio/:idx` 상세 디자인 디테일 검수**(§12-13) — 지금은 원본 detail page의 핵심(검은 배경
   full-bleed 이미지 스택)만 이식하고 상단 정보 블록은 V2 톤으로 재해석한 상태. 원본과 더 가깝게
   다듬을지, 지금 상태로 확정할지 결정
3. **`/inquiry` backend 연결**(§12-14, §24) — 이메일 전송/스프레드시트/CRM 등 실제 접수 수단 확정 후
   `InquiryPage`의 `handleSubmit` TODO 구현. 개인정보처리방침 전문도 아직 임시 안내문
4. **모바일 실기기 검수**(§12-15) — 이번 세션들 전부 `resize_window` 도구가 실제 뷰포트를 바꾸지
   못해 코드 리뷰로만 안전성 확인. 실제 좁은 화면/실기기에서 Hero·Portfolio wall·상세 이미지 스택·
   Inquiry 폼·Estimator 전부 육안 검수 필요
5. **Git 커밋 범위 정리 후 새 commit**(§16) — `references/touch-portfolio-original/`(426MB) 제외
   여부(`.gitignore`), `public/portfolio/calendar/`(22MB) 커밋 여부, `references/touch-portfolio-source/`
   (46MB, 조사 스크립트+quality-test 크롭) 커밋 여부를 사용자와 확정한 뒤, `a92ada6` 이후 오늘 작업분을
   **새 commit**으로 만들고 `origin/v2-redesign` 으로 push
6. **V2 검토용 Netlify 사이트 재배포**(§17) — 사이트는 이미 존재(`gleaming-naiad-0686ac.netlify.app`,
   `a92ada6` 기준으로 추정), 위 새 commit/push 이후 최신 `dist` 를 그 사이트에 재배포 → 검토 링크 공유
   (V1 은 불변). `/portfolio/:idx` 딥링크·SPA fallback(`public/_redirects`)이 배포 환경에서도 동작하는지
   확인 필요
7. **Header 앵커 정리** — 모바일 전용 `제작 문의` 버튼의 `#contact` 대상 없음 문제(데스크톱 `상담 문의`는
   `/inquiry`로 이미 해결됨), `#1E50E0` 브랜드색 확정
8. **Landing 캐러셀 대표 7개 재검토(선택)** — `/portfolio`가 실제 17개로 교체된 지금, Landing의 임시
   7개(`PORTFOLIO`)도 실제 17개 중 대표 7개로 교체할지 여부는 별도 결정 필요(이번 세션들에서는 의도적으로
   손대지 않음)
9. **consult 뷰 정비** — 실제 폼 전송(메일/시트/스팸 방지), `sels` 연동 또는 요약 블록 제거
10. **레거시 정리** — Service / Contact / Consultation / 구 FAQ / Footer / EstimatorPage / 미사용
    이미지 import 제거로 번들 축소 (요청 시)
11. **공개 전 SEO / analytics** — `.figma/make/site.json` `robots.index` / `title` / `description`, GA ID

> 공통 원칙(AGENTS.md): 한 번에 한 섹션만, 수정 전 해당 코드 먼저 읽기, 기존 기능·상태·링크·데이터 임의 변경 금지,
> 견적 계산기 가격·계산 로직 동결, 새 badge/eyebrow/gradient 임의 추가 금지, 모바일 반응형·가로 overflow 확인, 수정 후 `npm run build`,
> 작업 완료 후 이 문서의 해당 항목 갱신. `references/touch-portfolio-original/` 은 runtime에서 절대 참조하지 않는다(§27).

---

## 20. 다음 세션 첫 프롬프트 예시

```
이 캘린더 랜딩페이지(V2)의 작업을 이어간다. branch 는 v2-redesign 이어야 한다.

먼저 프로젝트 루트의 AGENTS.md 와 PROJECT_STATUS.md 를 처음부터 끝까지 읽어라(특히 §25~§27,
§12, §16, §19 — 2026-09-07 에 추가된 최신 내용). 그 다음 src/App.tsx 의 App() 컴포넌트에서
실제 라우팅/렌더 로직을 확인해라.

현재 route 구조: '/' (Header→Hero→Portfolio→EstimatorSection→Clients→FaqSection),
'/portfolio' (PortfolioPage, 실제 Touchgraphic Calendar 17개), '/portfolio/:idx'
(PortfolioDetailPage, 상세 이미지 186개 중 선택된 프로젝트), '/inquiry' (InquiryPage).
view==='consult' 이면 ConsultForm(레거시 상담 폼, 견적 계산기 CTA로 진입).

현재 상태 요약(2026-09-07 세션들 종료 시점):
- Landing(Hero/Portfolio 캐러셀 7개/Estimator/Clients/FAQ)은 §25 에서 spacing/line-height 리듬만
  재조정, 문구·데이터·가격 로직은 무변경.
- `/portfolio`는 임시 7개(Landing과 동일 PORTFOLIO)에서 실제 Touchgraphic Calendar 17개로 완전히
  교체됨(§26). 클릭하면 `/portfolio/:idx` 상세 페이지에서 실제 상세 이미지(총 186장)를 원본 순서
  그대로 볼 수 있다. asset은 원본 아카이브(references/touch-portfolio-original/, 426MB, runtime
  미사용) → 웹 최적화(public/portfolio/calendar/, 22MB, WebP quality 84) 2단계로 준비됐다(§27).
  production data는 src/data/calendarPortfolio.ts(자동 생성, 직접 수정 금지).
- `/inquiry`는 UI/폼 상태/validation까지 구현 완료, 실제 backend 미연결(§24).
- 빌드 성공. **Git: `v2-redesign` 은 이미 `a92ada6` 커밋까지 `origin/v2-redesign` 으로 push 완료돼
  있다. 오늘(§24~§27) 작업분만 그 이후의 미커밋 working tree 변경사항** — 새 commit·push 전(§16).
  V2 검토용 Netlify 사이트(`gleaming-naiad-0686ac.netlify.app`)도 이미 존재하며, 오늘 작업분은 아직
  거기 재배포되지 않았다(§17). V1 공개본(Netlify + 아임웹)은 그대로 유지.
- 미완성(§12 전체 참고): `/portfolio` 기업/기관 filter 분류 미확정, 상세 페이지 디자인 디테일 검수,
  Header 모바일 `제작 문의` #contact 앵커 깨짐, consult 뷰 폼 전송, 레거시 컴포넌트 잔존,
  SEO(noindex/title/GA), 모바일 실기기 검수 전무.

이번 작업: 사용자가 지정하는 하나만 진행한다. (지정 없으면 §19 다음 작업 후보를 보여주고 무엇을
할지 물어라.)
작업 규칙:
- 지정된 한 섹션/한 종류의 문제만 수정한다. 다른 섹션·컴포넌트·레거시는 건드리지 않는다.
- EstimatorInline 의 가격 데이터(TIER_DATA)와 계산 로직은 절대 수정하지 않는다. addon 을 다시 넣지 않는다.
- src/data/calendarPortfolio.ts 는 자동 생성 파일이다 — 직접 손으로 편집하지 말고, 데이터를
  바꿔야 하면 references/touch-portfolio-source/generate-data-file.mjs 를 다시 실행하거나
  source manifest 자체를 먼저 검토한다.
- references/touch-portfolio-original/ 은 runtime에서 참조하지 않는다. 웹은 무조건
  public/portfolio/calendar/ 만 사용한다.
- editorial / print-studio 톤, 타이포·여백 중심 레이아웃 유지. 새 badge/eyebrow/gradient/감성 카피 임의 추가 금지.
- 데스크톱·모바일 반응형 모두 확인, 가로 overflow·잘림 없는지 확인.
- 수정 후 npm run build 로 빌드 오류 확인.
- git add . / git add -A 사용 금지 — 대용량 원본 폴더가 함께 staging될 수 있다. 파일을 개별 지정한다.
- 작업 완료 후 PROJECT_STATUS.md 의 해당 항목을 갱신한다.

먼저 대상 섹션의 현재 코드를 읽고, 바꿀 내용을 제안한 뒤 승인받고 수정에 들어가라.
```
