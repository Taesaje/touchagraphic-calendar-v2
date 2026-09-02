import { useState, useEffect, useRef, useLayoutEffect } from 'react'

import calendarCover  from '@/imports/1.jpg'
import calendarSpread from '@/imports/6.jpg'
import calendarHeld   from '@/imports/5.jpg'
import calendarDates  from '@/imports/2.jpg'
import calendarFeb    from '@/imports/7.jpg'
import calendar8      from '@/imports/8.jpg'
import calendar9      from '@/imports/9.jpg'
import calendar10     from '@/imports/10.jpg'
import portfolio12    from '@/imports/12.jpg'
import portfolioA     from '@/imports/20241209222752_ibououed.jpg'
import portfolioB     from '@/imports/20241209222752_vxknsquw.jpg'
import portfolioC     from '@/imports/20241209222753_mwqpqwnm.jpg'
import portfolioD     from '@/imports/20241209222753_qfpmdqbp.jpg'
import portfolioE     from '@/imports/ff71cbd676cbde2bd14dae7b02563671.jpg'

// ── 공통 레이아웃 셸 ─────────────────────────────────────────────────────────
// index.css의 .u-shell / .u-rail-pad 로 정의 (fluid 좌우 padding + max-width 1920px).
// 모든 일반 섹션이 이 셸을 공유해 좌측 시작선을 일치시킨다.
const SHELL = 'u-shell'

// ── 공통 장식 ────────────────────────────────────────────────────────────────
function CropMarks({ size = 10, gap = 3, color = 'currentColor' }: { size?: number; gap?: number; color?: string }) {
  const s = size, g = gap, t = s * 2 + g * 2
  return (
    <svg width={t} height={t} viewBox={`0 0 ${t} ${t}`} fill="none" aria-hidden>
      <line x1="0" y1={g} x2={s} y2={g} stroke={color} strokeWidth="0.6" />
      <line x1={g} y1="0" x2={g} y2={s} stroke={color} strokeWidth="0.6" />
      <line x1={s+g} y1={g} x2={t} y2={g} stroke={color} strokeWidth="0.6" />
      <line x1={s+g} y1="0" x2={s+g} y2={s} stroke={color} strokeWidth="0.6" />
      <line x1="0" y1={s+g} x2={s} y2={s+g} stroke={color} strokeWidth="0.6" />
      <line x1={g} y1={s+g} x2={g} y2={t} stroke={color} strokeWidth="0.6" />
      <line x1={s+g} y1={s+g} x2={t} y2={s+g} stroke={color} strokeWidth="0.6" />
      <line x1={s+g} y1={s+g} x2={s+g} y2={t} stroke={color} strokeWidth="0.6" />
    </svg>
  )
}
function RegMark({ size = 14, color = 'currentColor' }: { size?: number; color?: string }) {
  const cx = size / 2
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" aria-hidden>
      <circle cx={cx} cy={cx} r={cx * 0.65} stroke={color} strokeWidth="0.5" />
      <line x1={cx} y1="0" x2={cx} y2={size} stroke={color} strokeWidth="0.5" />
      <line x1="0" y1={cx} x2={size} y2={cx} stroke={color} strokeWidth="0.5" />
    </svg>
  )
}
function SLabel({ children, light = false }: { children: string; light?: boolean }) {
  return <span className={`text-[10px] tracking-[0.18em] uppercase font-mono ${light ? 'text-ivory/45' : 'text-ink-light/55'}`}>{children}</span>
}

// ── 앱 상태 타입 ─────────────────────────────────────────────────────────────
type AppView = 'landing' | 'consult'

type Sels = {
  quantity: number
  material: string
  level: string
  budget: string
  deadline: string
  delivery: string
  deliveryLocations: number
  needsPackaging: string
}

const DEFAULT_SELS: Sels = {
  quantity: 0, material: '', level: '', budget: '',
  deadline: '', delivery: '', deliveryLocations: 2, needsPackaging: '',
}

// ── 옵션 데이터 ──────────────────────────────────────────────────────────────
const MATERIAL_OPTS = [
  { value: 'file-ready',    label: '완성된 인쇄 파일이 있어요',         sub: '파일 검수 후 제작·배송',   img: calendarDates  },
  { value: 'content-ready', label: '사진과 원고는 준비되어 있어요',      sub: '디자인·편집 후 제작',      img: calendarSpread },
  { value: 'from-scratch',  label: '무엇을 넣을지부터 함께 정해야 해요', sub: '12개월 기획부터 제작',     img: calendarHeld   },
]
const LEVEL_OPTS = [
  { value: 'standard',    label: '표준 제작',     sub: '기본 조건 · 비용 효율 우선', img: calendarCover,  recommended: false },
  { value: 'recommended', label: '추천 제작',     sub: '가격과 완성도의 균형',       img: calendarFeb,    recommended: true  },
  { value: 'premium',     label: '프리미엄 제작', sub: '재질·포장 완성도 우선',      img: calendar9,      recommended: false },
  { value: 'custom',      label: '별도 사양',     sub: '비규격 · 복합 조건',         img: calendar8,      recommended: false },
]
const BUDGET_OPTS = [
  { value: 'undecided', label: '아직 정해지지 않았어요' },
  { value: 'under200',  label: '200만 원 미만' },
  { value: '200to300',  label: '200 – 300만 원' },
  { value: '300to500',  label: '300 – 500만 원' },
  { value: '500to800',  label: '500 – 800만 원' },
  { value: 'over800',   label: '800만 원 이상' },
]
const DEADLINE_OPTS = [
  { value: 'under4',    label: '4주 이내' },
  { value: '5to8',      label: '5 – 8주' },
  { value: '9to12',     label: '9 – 12주' },
  { value: 'flexible',  label: '일정 협의 가능' },
]
const DELIVERY_OPTS = [
  { value: 'single',    label: '한 장소 배송' },
  { value: 'split',     label: '여러 장소 분할 배송' },
  { value: 'undecided', label: '아직 정해지지 않음' },
]
const PACKAGING_OPTS = [
  { value: 'yes', label: '개별 포장 필요' },
  { value: 'no',  label: '박스 단위 포장' },
]

// ── 견적 계산기 티어 데이터 ──────────────────────────────────────────────────
type BreakdownItem = { label: string; value: number }
type AddonDef = {
  name: string; note: string; cuts: number
  min: number; max: number; defaultCut: number; required: boolean
}
type TierDef = {
  name: string; subtitle: string
  breakdown: BreakdownItem[]
  options?: Record<string, string[]>
  addon?: AddonDef
  rules: string[]
}
type TierId = 'template' | 'custom_basic' | 'custom_highend'

const TIER_DATA: Record<TierId, TierDef> = {
  template: {
    name: 'Template Plan',
    subtitle: '실속형 브랜드 캘린더 (소상공인·스타트업)',
    breakdown: [
      { label: '템플릿 이용료', value: 100000 },
      { label: '표지 디자인',   value: 300000 },
      { label: '내지 세팅',     value: 500000 },
    ],
    options: {
      '사이즈':       ['A · 가로형', 'B · 세로형', 'C · 정사각', 'D · 와이드'],
      '표지 스타일':  ['불꽃양 그래픽', '2027 타이포그래피'],
      '내지 레이아웃':['2분할', '4분할', '5분할', '미니 달력형'],
    },
    rules: [
      '표지 수정 2회 한정',
      '내지 12p, 사진/텍스트 단순 치환 (레이아웃 변경 불가)',
      '인쇄/배송 실비 별도',
    ],
  },
  custom_basic: {
    name: 'Custom Basic',
    subtitle: '맞춤 기획 및 전용 비주얼 (중견기업·일반 브랜드)',
    breakdown: [
      { label: '기획 PT',           value: 1000000 },
      { label: '표지 디자인',        value: 1000000 },
      { label: '내지 디자인 (24p)',  value: 2400000 },
      { label: 'AI 비주얼 애드온',   value:  400000 },
    ],
    addon: {
      name: '외부 작가 일러스트 협업',
      note: '컷당 50만~100만원 · 12컷 기준',
      cuts: 12, min: 500000, max: 1000000, defaultCut: 750000, required: false,
    },
    rules: ['기획안 3종 제안', '인쇄 실비 별도'],
  },
  custom_highend: {
    name: 'Custom High-End',
    subtitle: '풀 커스텀 하이엔드 솔루션 (대기업·공공기관)',
    breakdown: [
      { label: '기획 PT',          value: 3000000 },
      { label: '키비주얼 표지',     value: 2000000 },
      { label: '내지 디자인 (24p)', value: 4800000 },
    ],
    addon: {
      name: '작가 협업 (필수 항목)',
      note: '컷당 50만~100만원 · 13컷 기준',
      cuts: 13, min: 500000, max: 1000000, defaultCut: 500000, required: true,
    },
    rules: [
      '인터뷰/만남 기반 전용 기획, 작가 섭외·디렉팅 총괄',
      '지류/특수 후가공 맞춤 견적',
    ],
  },
}

const TIER_ORDER: TierId[] = ['template', 'custom_basic', 'custom_highend']

function tierBaseTotal(id: TierId) {
  const d = TIER_DATA[id]
  let sum = d.breakdown.reduce((a, b) => a + b.value, 0)
  if (d.addon?.required) sum += d.addon.cuts * d.addon.min
  return sum
}

function wonFmt(n: number) {
  return Math.round(n).toLocaleString('ko-KR')
}

function getLabelFor(key: keyof Sels, sels: Sels): string {
  if (key === 'quantity') return sels.quantity > 0 ? `${sels.quantity.toLocaleString()}개` : ''
  if (key === 'material') return MATERIAL_OPTS.find(o => o.value === sels.material)?.label ?? ''
  if (key === 'level')    return LEVEL_OPTS.find(o => o.value === sels.level)?.label ?? ''
  if (key === 'budget')   return BUDGET_OPTS.find(o => o.value === sels.budget)?.label ?? ''
  if (key === 'deadline') return DEADLINE_OPTS.find(o => o.value === sels.deadline)?.label ?? ''
  if (key === 'delivery') return DELIVERY_OPTS.find(o => o.value === sels.delivery)?.label ?? ''
  return ''
}

function getRecommendedPath(material: string): { label: string; steps: string[] } {
  if (material === 'file-ready')    return { label: '인쇄·제작 중심', steps: ['파일 검수', '제작', '포장·배송'] }
  if (material === 'content-ready') return { label: '디자인 포함 제작', steps: ['디자인·편집', '파일 확정', '제작·배송'] }
  if (material === 'from-scratch')  return { label: '12개월 콘텐츠 기획형', steps: ['자료 검토·기획', '전체 디자인', '제작·배송'] }
  return { label: '—', steps: [] }
}

function getHeroImage(material: string, level: string) {
  if (level === 'premium')  return calendar9
  if (level === 'custom')   return calendar8
  if (material === 'file-ready')    return calendarDates
  if (material === 'content-ready') return calendarSpread
  if (material === 'from-scratch')  return calendarHeld
  return calendarCover
}

function getSubThumbs(material: string, level: string): { img: string; label: string }[] {
  if (level === 'premium') return [
    { img: calendarSpread, label: '내지 구성' },
    { img: calendar9,      label: '디테일 컷' },
    { img: calendarFeb,    label: '날짜판' },
  ]
  if (level === 'custom') return [
    { img: calendar8,     label: '특수 구성' },
    { img: calendar10,    label: '복합 품목' },
    { img: calendarDates, label: '날짜판' },
  ]
  if (material === 'file-ready') return [
    { img: calendarDates,  label: '날짜판' },
    { img: calendarFeb,    label: '내지 예시' },
    { img: calendarCover,  label: '표지' },
  ]
  if (material === 'content-ready') return [
    { img: calendarSpread, label: '펼친 구성' },
    { img: calendarFeb,    label: '날짜판' },
    { img: calendar9,      label: '디테일' },
  ]
  if (material === 'from-scratch') return [
    { img: calendarHeld,   label: '완성 예시' },
    { img: calendarSpread, label: '내지 구성' },
    { img: calendarFeb,    label: '날짜판' },
  ]
  return [
    { img: calendarFeb,    label: '날짜판' },
    { img: calendarSpread, label: '내지 구성' },
    { img: calendar10,     label: '표지·구성' },
  ]
}

// legacy alias (kept for portfolio section)
function getImageFor(material: string) { return getHeroImage(material, '') }

const SECTION_KEYS: (keyof Sels)[] = ['quantity','material','level','budget','deadline','delivery']
const SECTION_LABELS: Record<string, string> = {
  quantity: '제작 수량', material: '자료 준비 상태', level: '제작 수준',
  budget: '현재 생각하는 예산', deadline: '희망 납기', delivery: '배송 조건',
}
const RESULT_LABELS: Record<string, string> = {
  quantity: '제작 수량', material: '자료 준비 상태', level: '제작 수준',
  budget: '입력한 예산', deadline: '희망 납기', delivery: '배송 조건',
}

// ── 헤더 ─────────────────────────────────────────────────────────────────────
// media-palette.co.kr desktop 헤더 구조 재현:
//   [좌: 텍스트 로고]  [중앙: 밝은 gray rounded nav + 얇은 세로 구분선]  [우: 액션 버튼 2개]
//   · 빠른상담 = reference blue(임시, 브랜드색은 추후 교체)  · 회사소개서 = white + black border
//   · lg 미만 → 로고 + '제작 문의' 최소 구조 (모바일 헤더는 새로 디자인하지 않음)
// 좌우 시작선은 Hero(.u-shell)와 동일하게 맞춘다. 수치는 reference 1440px 화면 기준 근사값.
const HEADER_NAV = [
  { label: '제작 사례',     href: '#portfolio', targetId: 'portfolio-scroll-target' },
  { label: '견적 계산하기', href: '#estimator', targetId: 'estimator-scroll-target' },
]

function Header() {
  function scrollToContact() {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  // nav 클릭 시 target(섹션 제목 블록)이 viewport 세로 중앙에 오도록 스크롤.
  // fixed 헤더 때문에 scroll-margin-top 만으로는 중앙 정렬이 안 되므로 rect 로 직접 계산한다.
  function scrollToCenter(id: string) {
    const target = document.getElementById(id)
    if (!target) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const rect = target.getBoundingClientRect()
    const targetY = window.scrollY + rect.top - (window.innerHeight - rect.height) / 2
    window.scrollTo({ top: Math.max(0, targetY), behavior: reduce ? 'auto' : 'smooth' })
  }
  const fontKr = { fontFamily: 'Noto Sans KR, sans-serif' }
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-black/[0.07]">
      <div className={`${SHELL} h-[64px] lg:h-[96px] grid grid-cols-[1fr_auto_1fr] items-center gap-6`}>
        {/* 좌: 텍스트 로고 */}
        <a href="#" className="justify-self-start text-[17px] lg:text-[22px] font-extrabold tracking-[-0.02em] text-black leading-none" style={fontKr}>
          터치어그래픽
        </a>

        {/* 중앙: rounded gray nav container (desktop 전용) */}
        <nav className="hidden lg:flex items-center h-[56px] rounded-[11px] bg-black/[0.05] px-3">
          {HEADER_NAV.map((item, i) => (
            <span key={item.label} className="flex items-center">
              {i > 0 && <span className="mx-1 h-3 w-px bg-black/[0.16]" aria-hidden />}
              <a
                href={item.href}
                onClick={e => { e.preventDefault(); scrollToCenter(item.targetId) }}
                className="px-[30px] py-2 text-[17px] font-semibold text-black/90 hover:text-black transition-colors leading-none"
                style={fontKr}
              >
                {item.label}
              </a>
            </span>
          ))}
        </nav>

        {/* 우: 액션 버튼 */}
        <div className="justify-self-end flex items-center gap-2">
          <div className="hidden lg:flex items-center gap-2">
            <a href="#contact"
              className="inline-flex items-center justify-center h-[54px] lg:min-w-[148px] px-[30px] rounded-[10px] text-[16px] font-bold text-white leading-none transition-opacity hover:opacity-90"
              style={{ ...fontKr, background: '#1E50E0' }}>
              빠른상담
            </a>
            <a href="#"
              className="inline-flex items-center justify-center h-[54px] lg:min-w-[148px] px-[30px] rounded-[10px] text-[16px] font-bold text-black leading-none bg-white border border-black/25 hover:bg-black hover:text-white transition-colors"
              style={fontKr}>
              회사소개서
            </a>
          </div>
          <button onClick={scrollToContact}
            className="lg:hidden text-[10px] tracking-[0.14em] uppercase border border-black px-4 py-2 hover:bg-black hover:text-white transition-colors font-mono">
            제작 문의
          </button>
        </div>
      </div>
    </header>
  )
}

// ── 히어로 ────────────────────────────────────────────────────────────────────
// layout-master.png 최상단 구도:
// · 아주 작은 descriptor가 좌측 최상단에 먼저
// · 그 아래 왼쪽 초대형 2줄 headline
// · 오른쪽에 큰 supporting message (문장 사이에 짧은 horizontal line 삽입)
// · 넓은 whitespace, 흰 바탕, 강한 black typography, 이미지 없음
// 카피는 layout-master.png 문구를 임시로 그대로 사용 (추후 교체 예정).
function Hero() {
  const fontKr = { fontFamily: 'Noto Sans KR, sans-serif' }
  return (
    <section className="bg-white">
      <div className={SHELL}>
        {/* 상단 pt = 고정 헤더 높이 + reference의 헤더→descriptor 간격.
            하단 pb는 Portfolio 섹션과의 시각적 공백을 줄이기 위해 축소 (Hero 내부 배치는 불변). */}
        <div className="pt-[112px] lg:pt-[200px] pb-[44px] lg:pb-[80px]">
          {/* descriptor + headline 을 하나의 title group 으로 — 간격 좁게, descriptor 는 작은 heading 톤 */}
          <p className="mb-3 lg:mb-[10px] text-[13px] lg:text-[16px] font-normal text-black/80" style={fontKr}>
            기업·기관 맞춤 달력 기획·디자인·제작
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 lg:gap-x-8">
            {/* 좌: 큰 2줄 headline — 줄 간격은 line-height로만 (flex gap 미사용) */}
            <h1
              className="lg:col-span-7 min-w-0 text-black"
              style={{ ...fontKr, fontWeight: 700, fontSize: 'clamp(36px, 4.6vw, 66px)', lineHeight: 1.3, letterSpacing: '-0.025em' }}
            >
              기업 / 기관<br />달력 제작 회사
            </h1>

            {/* 우: supporting — headline 2번째 줄 기준선에 맞춰 하단 정렬. 위계: 1줄 medium(500) / 2줄 bold(700) */}
            <div className="lg:col-span-4 lg:col-start-9 min-w-0 flex lg:items-end lg:justify-end">
              <div className="max-w-[540px] text-black lg:text-right" style={fontKr}>
                <span
                  className="block"
                  style={{ fontWeight: 500, fontSize: 'clamp(18px, 2.1vw, 32px)', lineHeight: 1.35, letterSpacing: '-0.015em' }}
                >
                  달력 잘 만드는 전문 디자이너가
                </span>
                <span
                  className="mt-2 flex items-center gap-3.5 flex-wrap lg:justify-end"
                  style={{ fontWeight: 700, fontSize: 'clamp(18px, 2.1vw, 32px)', lineHeight: 1.35, letterSpacing: '-0.02em' }}
                >
                  기획부터
                  <span aria-hidden className="inline-block h-px w-16 shrink-0 bg-black/35" />
                  제작까지 함께합니다
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Trust Strip ───────────────────────────────────────────────────────────────
function TrustStrip() {
  const items = [
    { num: '01', title: '기획부터 제작까지', desc: '기획 · 편집디자인 · 인쇄 · 후가공' },
    { num: '02', title: '기업·기관 맞춤 제작', desc: '목적과 수량에 맞는 제작 방식 제안' },
    { num: '03', title: '복잡한 제작도 상담 가능', desc: '특수 사양 · 포장 · 분할 배송' },
  ]
  return (
    <div className="bg-ivory border-y border-ink/8">
      <div className="max-w-[1200px] mx-auto px-8 md:px-12 py-7 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-ink/8">
          {items.map(item => (
            <div key={item.num} className="flex items-start gap-4 py-5 md:py-0 md:px-8 first:md:pl-0 last:md:pr-0">
              {/* accent 번호 */}
              <span className="font-mono text-[11px] font-semibold shrink-0 mt-0.5" style={{ color: '#D65A34' }}>
                {item.num}
              </span>
              <div>
                <p className="text-[13px] font-medium text-ink mb-0.5" style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>
                  {item.title}
                </p>
                <p className="text-[11px] text-ink-light/60 tracking-[0.04em]" style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Event & Exhibitions (구 포트폴리오) ──────────────────────────────────────
// layout-master.png: 큰 섹션 타이틀 아래로 화면 좌우를 꽉 채우는 대형 세로형
// 이미지가 가로로 흐르는 배열. 작은 카드가 아니라 이미지가 페이지의 주요 시각 요소.
// 캡션(행사명·일정)은 layout-master 문구를 임시 사용, 이후 실제 사례 이미지로 교체.
// isText 항목은 layout-master 중앙의 텍스트-only 편집 블록을 재현.
const EXHIBITIONS: { src?: string; title: string; meta: string; isText?: boolean }[] = [
  { src: calendarCover,  title: '프리즈 서울',          meta: '9.2 – 9.6 · 코엑스 홀 C·D' },
  { src: calendarSpread, title: '경기도자비엔날레',      meta: '9.18 – 11.1 · 이천·광주·여주' },
  { isText: true,        title: '너는 네 삶을 바꿔야 한다', meta: '9.5 – 11.15, 2026 · You Must Change Your Life' },
  { src: calendarHeld,   title: '제16회 광주비엔날레',   meta: '9.5 – 11.15 · 광주비엔날레 전시관' },
  { src: calendarFeb,    title: '부산비엔날레 2026',     meta: '8.29 – 11.1 · 부산현대미술관 등' },
  { src: calendar9,      title: '제주비엔날레',          meta: '8.25 – 11.15 · 제주도립미술관 등' },
  { src: calendar8,      title: '행사·전시 아카이브',    meta: '이미지 교체 예정' },
  { src: calendar10,     title: '행사·전시 아카이브',    meta: '이미지 교체 예정' },
  { src: portfolio12,    title: '행사·전시 아카이브',    meta: '이미지 교체 예정' },
  { src: portfolioA,     title: '행사·전시 아카이브',    meta: '이미지 교체 예정' },
  { src: portfolioB,     title: '행사·전시 아카이브',    meta: '이미지 교체 예정' },
  { src: portfolioC,     title: '행사·전시 아카이브',    meta: '이미지 교체 예정' },
  { src: portfolioD,     title: '행사·전시 아카이브',    meta: '이미지 교체 예정' },
  { src: portfolioE,     title: '행사·전시 아카이브',    meta: '이미지 교체 예정' },
]

const RAIL_PAD = 'u-rail-pad'

function Portfolio() {
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  // 가격 계산과 무관한 UI 전용 ref — 마우스 드래그 상태 (라이브러리 없이 native scrollLeft)
  const drag = useRef({ active: false, startX: 0, startScroll: 0 })
  // 자동 가로 이동 + hover 상태 — 전부 rAF + ref 로만 관리 (프레임마다 React rerender 없음).
  const auto = useRef({
    raf: 0, last: 0, pos: 0,
    speed: 0, from: 0, to: 0, tStart: 0, dur: 0,   // delta-time 속도 보간
    dragging: false, touching: false, cardHover: false, kbFocus: false,
    resumeTimer: 0,
    onDragStart: () => {}, onDragEnd: () => {},
  })

  // reference 처럼 "가만히 있어도 흐르는" 전시 레일.
  //  · 속도는 delta-time 기반(초당 px 고정), currentSpeed 는 목표값으로 부드럽게 보간
  //  · 실제 카드 이미지 hover / drag / touch / 수동 wheel 에서 감속 정지 → 잠시 후 가속 재개
  //  · duplicated track 으로 seamless infinite loop (원본 데이터는 불변, render layer 만 반복)
  useEffect(() => {
    const el = viewportRef.current
    const track = trackRef.current
    if (!el || !track) return

    const a = auto.current
    a.pos = el.scrollLeft
    a.speed = a.from = a.to = 0
    a.dur = 0

    // 스냅 완전 제거 — auto motion·수동 조작 모두 "자유롭게 멈춤" 이 우선
    el.style.scrollSnapType = 'none'

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return // auto motion 없음. drag / swipe / trackpad 는 그대로 동작.

    const hoverCapable = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const TARGET_SPEED = 60 // px per second (desktop)

    let loopAt = 0
    const measure = () => {
      const kids = track.children
      const n = EXHIBITIONS.length
      loopAt = kids.length > n
        ? (kids[n] as HTMLElement).offsetLeft - (kids[0] as HTMLElement).offsetLeft
        : 0
    }
    measure()
    window.addEventListener('resize', measure)

    const easeInOut = (p: number) => p * p * (3 - 2 * p) // smoothstep — 양끝 부드럽게, bounce 없음
    const glide = (to: number, durMs: number) => {
      a.from = a.speed
      a.to = to
      a.tStart = performance.now()
      a.dur = Math.max(1, durMs)
    }
    const stopNow = () => { a.speed = a.from = a.to = 0; a.dur = 0 }

    const clearResume = () => { if (a.resumeTimer) { clearTimeout(a.resumeTimer); a.resumeTimer = 0 } }
    const blocked = () => a.dragging || a.touching || a.cardHover || a.kbFocus
    const scheduleResume = (delayMs: number, rampMs: number) => {
      clearResume()
      a.resumeTimer = window.setTimeout(() => {
        a.resumeTimer = 0
        if (blocked()) return
        glide(TARGET_SPEED, rampMs)
      }, delayMs)
    }

    const tick = (now: number) => {
      if (!a.last) a.last = now
      let dt = (now - a.last) / 1000
      a.last = now
      if (dt > 0.05) dt = 0.05 // frame drop 이후 갑자기 튐 방지

      if (a.dur > 0) {
        const p = Math.min(1, (now - a.tStart) / a.dur)
        a.speed = a.from + (a.to - a.from) * easeInOut(p)
        if (p >= 1) { a.speed = a.to; a.dur = 0 }
      }

      if (a.dragging) {
        // 유저가 scrollLeft 를 직접 조작 중. loop 경계만 보정하고 startScroll 도 같이 이동 → 무한 드래그.
        if (loopAt > 0) {
          if (el.scrollLeft >= loopAt) { el.scrollLeft -= loopAt; drag.current.startScroll -= loopAt }
          else if (el.scrollLeft < 0) { el.scrollLeft += loopAt; drag.current.startScroll += loopAt }
        }
        a.pos = el.scrollLeft
      } else if (a.speed > 0.02) {
        a.pos += a.speed * dt
        if (loopAt > 0) {
          while (a.pos >= loopAt) a.pos -= loopAt
          while (a.pos < 0) a.pos += loopAt
        }
        el.scrollLeft = a.pos
      } else {
        // 정지 상태: 수동 wheel / trackpad 를 방해하지 않는다. pos 는 따라만 가고 loop 경계만 보정.
        a.pos = el.scrollLeft
        if (loopAt > 0) {
          if (a.pos >= loopAt) { a.pos -= loopAt; el.scrollLeft = a.pos }
          else if (a.pos < 0) { a.pos += loopAt; el.scrollLeft = a.pos }
        }
      }
      a.raf = requestAnimationFrame(tick)
    }
    a.raf = requestAnimationFrame(tick)

    // ── 실제 카드 이미지 hover (빈 레일 공간은 제외) ──
    const onOver = (e: PointerEvent) => {
      if (!(e.target as Element)?.closest?.('[data-card-img]')) return
      a.cardHover = true
      clearResume()
      if (a.to !== 0) glide(0, 320) // 60 → 0, ~320ms 감속 (스르륵 정지)
    }
    const onOut = (e: PointerEvent) => {
      if (!(e.target as Element)?.closest?.('[data-card-img]')) return
      if ((e.relatedTarget as Element | null)?.closest?.('[data-card-img]')) return // 옆 카드로 이동 — 계속 pause
      a.cardHover = false
      scheduleResume(650, 520) // leave 후 ~650ms 대기 → ~520ms 가속 재개
    }
    if (hoverCapable) {
      track.addEventListener('pointerover', onOver)
      track.addEventListener('pointerout', onOut)
    }

    // ── 수동 wheel / 트랙패드 : manual 우선 ──
    const onWheel = () => {
      if (a.dragging || a.touching) return
      if (a.to !== 0) glide(0, 200)
      scheduleResume(650, 520)
    }
    el.addEventListener('wheel', onWheel, { passive: true })

    // ── touch : 손대는 동안 정지, 떼면 재개 ──
    const onTouchStart = () => { a.touching = true; clearResume(); stopNow() }
    const onTouchEnd = () => { a.touching = false; scheduleResume(750, 520) }
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchend', onTouchEnd, { passive: true })
    el.addEventListener('touchcancel', onTouchEnd, { passive: true })

    // ── 키보드 focus 가 레일 안에 있을 때 ──
    const onFocusIn = () => { a.kbFocus = true; clearResume(); if (a.to !== 0) glide(0, 320) }
    const onFocusOut = () => { a.kbFocus = false; scheduleResume(650, 520) }
    el.addEventListener('focusin', onFocusIn)
    el.addEventListener('focusout', onFocusOut)

    // ── drag (뷰포트 pointer 드래그) : 최우선. hover 무시하고 즉시 정지 ──
    a.onDragStart = () => { a.dragging = true; clearResume(); stopNow() }
    a.onDragEnd = () => { a.dragging = false; scheduleResume(850, 520) } // release 후 ~850ms → ~520ms 회복

    // 최초 진입 : 살짝 뒤 부드럽게 출발
    scheduleResume(400, 700)

    return () => {
      cancelAnimationFrame(a.raf)
      clearResume()
      a.onDragStart = () => {}
      a.onDragEnd = () => {}
      window.removeEventListener('resize', measure)
      track.removeEventListener('pointerover', onOver)
      track.removeEventListener('pointerout', onOut)
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchend', onTouchEnd)
      el.removeEventListener('touchcancel', onTouchEnd)
      el.removeEventListener('focusin', onFocusIn)
      el.removeEventListener('focusout', onFocusOut)
    }
  }, [])

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType === 'touch') return // 터치 스와이프는 네이티브 스크롤에 맡긴다
    const el = viewportRef.current
    if (!el) return
    drag.current = { active: true, startX: e.clientX, startScroll: el.scrollLeft }
    el.setPointerCapture?.(e.pointerId)
    el.style.cursor = 'grabbing'
    el.style.userSelect = 'none'
    auto.current.onDragStart() // auto motion 즉시 정지 (hover 보다 우선)
  }
  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = viewportRef.current
    if (!el || !drag.current.active) return
    el.scrollLeft = drag.current.startScroll - (e.clientX - drag.current.startX)
  }
  function endDrag(e: React.PointerEvent<HTMLDivElement>) {
    const el = viewportRef.current
    if (!el || !drag.current.active) return
    drag.current.active = false
    el.releasePointerCapture?.(e.pointerId)
    el.style.cursor = 'grab'
    el.style.userSelect = ''
    auto.current.onDragEnd() // 잠시 뒤 auto motion 부드럽게 회복
  }

  return (
    <section id="portfolio" className="bg-white pt-[44px] pb-[32px] md:pb-[56px] lg:pt-[72px] lg:pb-[84px]">
      {/* 헤더: 일반 content shell — 좌측 시작선이 첫 카드 시작선과 연결됨. 제목 ↔ 전체보기 같은 라인 */}
      <div className={SHELL}>
        <div id="portfolio-scroll-target" className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 min-w-0">
            <h2
              className="text-black"
              style={{ fontFamily: 'Noto Sans KR, sans-serif', fontWeight: 700, fontSize: 'clamp(24px, 3.8vw, 60px)', lineHeight: 1.15, letterSpacing: '-0.025em' }}
            >
              제작 사례
            </h2>
            <span className="t-caption text-black/45">Portfolio</span>
          </div>
          <span className="t-caption text-black/45 shrink-0">포트폴리오 전체보기 ›</span>
        </div>
      </div>

      {/*
        풀-width 가로 레일. overflow는 이 요소 안에서만 발생 → page 가로 밀림 없음.
        트랙 좌우 padding = u-shell 값이라 첫 카드가 제목 시작선과 연결된다.
        조작: 네이티브 가로 스크롤(트랙패드) · 터치 스와이프 · 마우스 드래그.
        + delta-time 기반 continuous auto-scroll(rAF, 60px/s). 실제 카드 이미지 hover / drag /
          touch / 수동 wheel 에서 부드럽게 감속 정지 → 잠시 뒤 부드럽게 가속 재개.
          prefers-reduced-motion 에서는 auto-scroll·hover scale 모두 비활성.
        scroll-snap 은 제거(자유 정지 우선). 카드 상단·그림자가 잘리지 않도록 트랙에
          상·하 padding(mt/pb 에서 그만큼 상쇄) → 섹션 전체 spacing 은 그대로.
      */}
      <div
        ref={viewportRef}
        role="region"
        aria-label="포트폴리오 작품 가로 목록 — 드래그하거나 좌우로 스크롤하세요"
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onPointerCancel={endDrag}
        style={{
          overflowX: 'auto',
          overflowY: 'hidden',
          scrollbarWidth: 'none',
          cursor: 'grab',
        }}
        className="mt-0 lg:mt-[8px] [&::-webkit-scrollbar]:hidden">
        <div
          ref={trackRef}
          className={`flex ${RAIL_PAD}`}
          style={{ gap: 'clamp(16px, 1.5vw, 26px)', paddingTop: '40px', paddingBottom: '28px' }}
        >
          {/* 원본 데이터는 그대로. seamless loop 를 위해 render layer 에서만 한 번 더 그리고,
              복제 세트(clone)는 스크린리더 중복 방지를 위해 aria-hidden 처리. */}
          {[...EXHIBITIONS, ...EXHIBITIONS].map((item, i) => (
            <figure
              key={i}
              data-card=""
              aria-hidden={i >= EXHIBITIONS.length ? true : undefined}
              className="shrink-0 m-0"
              style={{ width: 'clamp(300px, 22vw, 360px)' }}
            >
              {/* 이미지만 살짝 라운드. caption은 박스로 묶지 않음. 시각 초점은 image.
                  hover 시 image wrapper 만 transform(scale/translateY) + shadow 로 앞으로 떠오름.
                  layout(width/height/margin) 은 불변 → 옆 카드 밀림 없음. caption 은 scale 안 함.
                  motion-safe: → prefers-reduced-motion 에서는 hover scale 비활성. */}
              <div
                data-card-img=""
                className="pf-card overflow-hidden rounded-[12px] bg-black/[0.04]"
                style={{ aspectRatio: '3 / 4' }}
              >
                {item.isText ? (
                  <div className="w-full h-full flex flex-col justify-center gap-4 p-6 md:p-8 border border-black/10 rounded-[12px]">
                    <span className="t-meta text-black/45">{item.meta}</span>
                    <span className="text-black" style={{ fontFamily: 'Noto Serif KR, serif', fontWeight: 700, fontSize: 'clamp(17px, 1.6vw, 26px)', lineHeight: 1.3, letterSpacing: '-0.01em' }}>
                      {item.title}
                    </span>
                  </div>
                ) : (
                  <img src={item.src} alt={item.title} draggable={false} className="w-full h-full object-cover select-none pointer-events-none" />
                )}
              </div>
              {!item.isText && (
                <figcaption className="mt-3.5">
                  <p className="t-body font-semibold text-black">{item.title}</p>
                  <p className="mt-0.5 t-caption text-black/45">{item.meta}</p>
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Visual thumbnail helpers ──────────────────────────────────────────────────
const SIZE_THUMBS: Record<string, { w: number; h: number }> = {
  'A · 가로형': { w: 68, h: 50 },
  'B · 세로형': { w: 48, h: 66 },
  'C · 정사각': { w: 58, h: 58 },
  'D · 와이드':  { w: 80, h: 44 },
}
function SizeSvg({ opt }: { opt: string }) {
  const cfg = SIZE_THUMBS[opt] ?? { w: 64, h: 52 }
  const bx = (80 - cfg.w) / 2, by = (80 - cfg.h) / 2
  const dots = Math.min(6, Math.floor(cfg.w / 14))
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <rect x={bx} y={by} width={cfg.w} height={cfg.h} rx="1" stroke="rgba(26,26,26,0.45)" strokeWidth="1" fill="rgba(245,242,234,0.9)" />
      {Array.from({ length: dots }).map((_, i) => (
        <circle key={i} cx={bx + 8 + i * ((cfg.w - 16) / Math.max(dots - 1, 1))} cy={by + 5} r="1.5" fill="rgba(26,26,26,0.3)" />
      ))}
      <line x1={bx + 6} y1={by + cfg.h * 0.42} x2={bx + cfg.w - 6} y2={by + cfg.h * 0.42} stroke="rgba(26,26,26,0.12)" strokeWidth="0.8" />
      <line x1={bx + 6} y1={by + cfg.h * 0.6} x2={bx + cfg.w - 6} y2={by + cfg.h * 0.6} stroke="rgba(26,26,26,0.12)" strokeWidth="0.8" />
    </svg>
  )
}

const LAYOUT_THUMBS: Record<string, () => React.ReactNode> = {
  '2분할': () => (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <rect x="8" y="10" width="64" height="60" rx="1" stroke="rgba(26,26,26,0.4)" strokeWidth="0.8" fill="rgba(245,242,234,0.9)" />
      <line x1="8" y1="40" x2="72" y2="40" stroke="rgba(26,26,26,0.3)" strokeWidth="0.8" />
    </svg>
  ),
  '4분할': () => (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <rect x="8" y="10" width="64" height="60" rx="1" stroke="rgba(26,26,26,0.4)" strokeWidth="0.8" fill="rgba(245,242,234,0.9)" />
      <line x1="8" y1="40" x2="72" y2="40" stroke="rgba(26,26,26,0.3)" strokeWidth="0.8" />
      <line x1="40" y1="10" x2="40" y2="70" stroke="rgba(26,26,26,0.3)" strokeWidth="0.8" />
    </svg>
  ),
  '5분할': () => (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <rect x="8" y="10" width="64" height="60" rx="1" stroke="rgba(26,26,26,0.4)" strokeWidth="0.8" fill="rgba(245,242,234,0.9)" />
      <line x1="8" y1="28" x2="72" y2="28" stroke="rgba(26,26,26,0.3)" strokeWidth="0.8" />
      <line x1="8" y1="46" x2="72" y2="46" stroke="rgba(26,26,26,0.3)" strokeWidth="0.8" />
      <line x1="8" y1="58" x2="72" y2="58" stroke="rgba(26,26,26,0.3)" strokeWidth="0.8" />
      <line x1="40" y1="46" x2="40" y2="70" stroke="rgba(26,26,26,0.3)" strokeWidth="0.8" />
    </svg>
  ),
  '미니 달력형': () => (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <rect x="8" y="10" width="64" height="60" rx="1" stroke="rgba(26,26,26,0.4)" strokeWidth="0.8" fill="rgba(245,242,234,0.9)" />
      <rect x="14" y="16" width="52" height="30" rx="0.5" stroke="rgba(26,26,26,0.2)" strokeWidth="0.7" fill="rgba(26,26,26,0.04)" />
      <rect x="14" y="52" width="22" height="14" rx="0.5" stroke="rgba(26,26,26,0.25)" strokeWidth="0.7" fill="none" />
      {[0,1,2].map(r => [0,1,2].map(c => (
        <rect key={`${r}${c}`} x={15 + c * 7} y={53 + r * 4} width="5" height="2.5" rx="0.3" fill="rgba(26,26,26,0.15)" />
      )))}
    </svg>
  ),
}

function NeutralTile({ label }: { label: string }) {
  const letters = label.slice(0, 2)
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <rect x="4" y="4" width="72" height="72" rx="1" stroke="rgba(26,26,26,0.2)" strokeWidth="0.8" fill="rgba(26,26,26,0.04)" />
      <text x="40" y="46" textAnchor="middle" fontSize="18" fontFamily="monospace" fill="rgba(26,26,26,0.25)">{letters}</text>
    </svg>
  )
}

function OptionThumbnail({ groupLabel, opt }: { groupLabel: string; opt: string }) {
  if (groupLabel === '사이즈') return <SizeSvg opt={opt} />
  if (groupLabel === '내지 레이아웃') {
    const Fn = LAYOUT_THUMBS[opt]
    return Fn ? <>{Fn()}</> : <NeutralTile label={opt} />
  }
  return <NeutralTile label={opt} />
}

// ── Configurator 공통 요소 ────────────────────────────────────────────────────
// UX = Sincerely progressive-accordion. Visual = touchagraphic.com 실측 기준:
//   · 타이포 gothic (Instrument Sans / Pretendard → 프로젝트엔 없어 Noto Sans KR로 대체)
//   · action/selection 색 = black (#1A1A1A), 브랜드에 orange-red 근거 없음
//   · CMYK(#4CACE9/#DB438F/#FDF251/#000)는 masthead 도트로만 (그래픽 모티프)
//   · radius 는 pill 이거나 0, letter-spacing 은 살짝 tight
const CFG_EASE = 'cubic-bezier(0.4, 0, 0.2, 1)'
const CFG_INK = '#1A1A1A'
const CFG_REST_BORDER = '1px solid rgba(26,26,26,0.18)'
const CFG_HOVER_BORDER = 'rgba(26,26,26,0.42)'
const CFG_SEL_BORDER = `1.5px solid ${CFG_INK}`
const CFG_SEL_BG = 'rgba(26,26,26,0.045)'
const CFG_KR = { fontFamily: 'Noto Sans KR, sans-serif', letterSpacing: '-0.01em' }

function CheckDisc({ on }: { on: boolean }) {
  return (
    <span className="shrink-0" style={{ opacity: on ? 1 : 0, transition: `opacity 160ms ${CFG_EASE}` }}>
      <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden>
        <circle cx="8" cy="8" r="7.25" stroke={CFG_INK} />
        <path d="M4.5 8l2.6 2.6L11.5 5.5" stroke={CFG_INK} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}

// 접히는 단계 셸 — 헤더(라벨 · 선택값 · 상태 · 화살표) + 애니메이션 본문.
function AccordionRow({
  index, label, open, onToggle, done, selectedLabel, hint, count, rowRef, children,
}: {
  index: string
  label: string
  open: boolean
  onToggle: () => void
  done: boolean
  selectedLabel: string | null
  hint: string
  count: string
  rowRef?: (el: HTMLDivElement | null) => void
  children: React.ReactNode
}) {
  return (
    <div ref={rowRef} className="border-t border-ink/20" style={{ scrollMarginTop: '96px' }}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="w-full flex items-center gap-4 py-5 text-left"
      >
        <span className="text-[11px] text-ink-light/45 shrink-0 w-6 tabular-nums" style={CFG_KR}>{index}</span>
        <span className="flex-1 min-w-0 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-[15px] font-bold text-ink" style={CFG_KR}>{label}</span>
          {done && selectedLabel && !open && (
            <span className="text-[13px] font-medium" style={{ ...CFG_KR, color: CFG_INK }}>{selectedLabel}</span>
          )}
        </span>
        <span className="shrink-0 flex items-center gap-3">
          {done ? (
            <span className="hidden sm:inline text-[12px] font-semibold" style={{ ...CFG_KR, color: CFG_INK }}>✓ 선택 완료</span>
          ) : (
            <span className="hidden sm:inline text-[12px] text-ink-light/45" style={CFG_KR}>{hint}</span>
          )}
          <span className="text-[11px] text-ink-light/40 tabular-nums" style={CFG_KR}>{count}</span>
          <svg
            width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden
            style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: `transform 200ms ${CFG_EASE}` }}
          >
            <path d="M2.5 4.5L6 8l3.5-3.5" stroke="rgba(26,26,26,0.55)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>

      <div style={{ display: 'grid', gridTemplateRows: open ? '1fr' : '0fr', transition: `grid-template-rows 220ms ${CFG_EASE}` }}>
        <div style={{ overflow: 'hidden' }}>
          <div
            className="pb-6 pt-1"
            style={{
              opacity: open ? 1 : 0,
              transform: open ? 'translateY(0)' : 'translateY(-4px)',
              transition: `opacity 200ms ${CFG_EASE}, transform 220ms ${CFG_EASE}`,
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

// 열린 단계 안의 선택 가능한 가로 옵션 행 (썸네일 · 라벨 · 체크).
function OptionRow({ groupLabel, opt, selected, onSelect }: {
  groupLabel: string; opt: string; selected: boolean; onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="w-full flex items-center gap-4 text-left"
      style={{
        minHeight: '84px',
        padding: '12px 14px',
        borderRadius: '0px',
        border: selected ? CFG_SEL_BORDER : CFG_REST_BORDER,
        background: selected ? CFG_SEL_BG : '#ffffff',
        transition: `border-color 160ms ${CFG_EASE}, background 160ms ${CFG_EASE}`,
      }}
      onMouseEnter={e => { if (!selected) (e.currentTarget as HTMLButtonElement).style.borderColor = CFG_HOVER_BORDER }}
      onMouseLeave={e => { if (!selected) (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(26,26,26,0.18)' }}
    >
      <span
        className="shrink-0 w-[60px] h-[60px] flex items-center justify-center"
        style={{ background: '#FBFCF8', border: '1px solid rgba(26,26,26,0.12)' }}
      >
        <OptionThumbnail groupLabel={groupLabel} opt={opt} />
      </span>
      <span className="flex-1 min-w-0 text-[14px] font-medium text-ink break-keep" style={CFG_KR}>
        {opt}
      </span>
      <CheckDisc on={selected} />
    </button>
  )
}

// 제작 등급 행 (플랜명 · 설명 · 기본 예상가). 가격은 tierBaseTotal()에서만 가져온다.
function TierRow({ id, selected, onSelect }: { id: TierId; selected: boolean; onSelect: () => void }) {
  const t = TIER_DATA[id]
  return (
    <button
      type="button"
      onClick={onSelect}
      className="w-full flex items-center gap-4 text-left"
      style={{
        padding: '14px',
        borderRadius: '0px',
        border: selected ? CFG_SEL_BORDER : CFG_REST_BORDER,
        background: selected ? CFG_SEL_BG : '#ffffff',
        transition: `border-color 160ms ${CFG_EASE}, background 160ms ${CFG_EASE}`,
      }}
      onMouseEnter={e => { if (!selected) (e.currentTarget as HTMLButtonElement).style.borderColor = CFG_HOVER_BORDER }}
      onMouseLeave={e => { if (!selected) (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(26,26,26,0.18)' }}
    >
      <span className="flex-1 min-w-0">
        <span className="block text-[14px] font-bold text-ink" style={CFG_KR}>{t.name}</span>
        <span className="block text-[12px] text-ink-light/60 mt-0.5 break-keep" style={CFG_KR}>{t.subtitle}</span>
      </span>
      <span className="shrink-0 flex items-center gap-3">
        <span className="text-[12px] font-semibold tabular-nums" style={{ ...CFG_KR, color: selected ? CFG_INK : 'rgba(26,26,26,0.55)' }}>
          {wonFmt(tierBaseTotal(id))}원~
        </span>
        <CheckDisc on={selected} />
      </span>
    </button>
  )
}

// 선택된 사이즈 옵션 → 대표 캘린더 미리보기 비율. (계산 state 아님, 표시 전용)
const SIZE_RATIO: Record<string, [number, number]> = {
  'A · 가로형': [4, 3],
  'B · 세로형': [3, 4],
  'C · 정사각': [1, 1],
  'D · 와이드': [16, 9],
}

function CalendarPreview({ ratio }: { ratio: [number, number] }) {
  const [rw, rh] = ratio
  const base = 300
  const w = rw >= rh ? base : Math.round((base * rw) / rh)
  const h = rh >= rw ? base : Math.round((base * rh) / rw)
  const spiral = Math.max(6, Math.round(w / 22))
  const landscape = rw >= rh
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label="선택한 사이즈 기준 캘린더 미리보기"
      style={{
        width: landscape ? 'min(100%, 440px)' : 'auto',
        height: landscape ? 'auto' : 'min(56vh, 400px)',
        maxWidth: '100%',
        maxHeight: '100%',
        overflow: 'visible',
      }}
    >
      <rect x={8} y={12} width={w - 16} height={h - 24} fill="#ffffff" stroke="rgba(26,26,26,0.42)" strokeWidth="1" />
      {Array.from({ length: spiral }).map((_, i) => (
        <circle
          key={i}
          cx={8 + ((w - 16) * (i + 0.5)) / spiral}
          cy={12}
          r={3}
          fill="none"
          stroke="rgba(26,26,26,0.4)"
          strokeWidth="1"
        />
      ))}
      <rect
        x={w * 0.16} y={h * 0.2} width={w * 0.68} height={h * 0.4}
        fill="rgba(26,26,26,0.03)" stroke="rgba(26,26,26,0.16)" strokeWidth="0.8"
      />
      {[1, 2, 3].map(r => (
        <line
          key={r}
          x1={w * 0.16} y1={h * (0.2 + 0.1 * r)}
          x2={w * 0.84} y2={h * (0.2 + 0.1 * r)}
          stroke="rgba(26,26,26,0.12)" strokeWidth="0.7"
        />
      ))}
      <line x1={w * 0.28} y1={h - 10} x2={w * 0.72} y2={h - 10} stroke="rgba(26,26,26,0.3)" strokeWidth="1.2" />
    </svg>
  )
}

// ── 인라인 견적 계산기 (랜딩 내장용) ────────────────────────────────────────
// UX: Sincerely configurator (좌 preview / 우 progressive accordion / 하단 요약).
// Visual: Touchgraphic (white·black 중심, hairline rule, 최소 radius, 제한적 accent).
// 가격 데이터·계산식은 TIER_DATA / tierBaseTotal / wonFmt / total 계산 그대로 사용.
function EstimatorInline({ onConsult }: { onConsult: () => void }) {
  // ── 가격 계산 state (동결) ──
  const [tier, setTier] = useState<TierId>('template')
  const [optIdx, setOptIdx] = useState<Record<string, Record<string, number | null>>>({})
  const [addonOn, setAddonOn] = useState<Record<string, boolean>>({ custom_basic: false, custom_highend: true })
  const [addonPerCut, setAddonPerCut] = useState<Record<string, number>>({ custom_basic: 750000, custom_highend: 500000 })
  const [copyStatus, setCopyStatus] = useState('')

  // ── configurator UI state (표시 전용, 계산과 분리) ──
  const [openStep, setOpenStep] = useState<string | null>('tier')
  const stepRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const d = TIER_DATA[tier]
  const addon = d.addon ?? null
  const addonActive = addon ? (addon.required || (addonOn[tier] ?? false)) : false
  const addonCost = addonActive && addon ? (addonPerCut[tier] ?? addon.defaultCut) * addon.cuts : 0

  let total = d.breakdown.reduce((a, b) => a + b.value, 0)
  if (addonActive) total += addonCost
  const animatedTotal = useAnimatedNumber(total)

  // Returns null when user has not yet selected this option
  function getOptIdx(label: string): number | null {
    const tierOpts = optIdx[tier] ?? {}
    return label in tierOpts ? (tierOpts[label] ?? null) : null
  }

  async function copyText() {
    const lines = [`[견적서] ${d.name} · ${d.subtitle}`, '']
    d.breakdown.forEach(item => lines.push(`${item.label} : ${wonFmt(item.value)}원`))
    if (addon && addonActive) {
      const perCut = addonPerCut[tier] ?? addon.defaultCut
      lines.push(`${addon.name} : ${wonFmt(perCut * addon.cuts)}원 (컷당 ${wonFmt(perCut)}원 × ${addon.cuts}컷)`)
    }
    lines.push('')
    lines.push(`합계(부가세·인쇄비 별도) : ${wonFmt(total)}원`)
    try {
      await navigator.clipboard.writeText(lines.join('\n'))
      setCopyStatus('복사 완료')
      setTimeout(() => setCopyStatus(''), 1800)
    } catch {
      setCopyStatus('복사 실패 — 직접 선택해 주세요')
    }
  }

  const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '.')

  // ── 단계 목록 (현재 tier의 실제 데이터만; 없는 옵션은 만들지 않는다) ──
  type StepKind = 'tier' | 'option' | 'addon'
  type StepDef = { key: string; label: string; kind: StepKind; group?: string }
  const optionGroups = d.options ? Object.keys(d.options) : []
  const steps: StepDef[] = [
    { key: 'tier', label: '제작 등급', kind: 'tier' },
    ...optionGroups.map(g => ({ key: `option:${g}`, label: g, kind: 'option' as StepKind, group: g })),
    ...(addon ? [{ key: 'addon', label: addon.name, kind: 'addon' as StepKind }] : []),
  ]

  function openAndScroll(key: string | null) {
    setOpenStep(key)
    if (key) {
      window.setTimeout(() => {
        stepRefs.current[key]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }, 90)
    }
  }

  // 현재 단계에서 유효 선택 후 → 현재 닫고 → 다음 단계 열기
  function advanceFrom(key: string) {
    const i = steps.findIndex(s => s.key === key)
    const next = i >= 0 ? steps[i + 1] : undefined
    openAndScroll(next ? next.key : null)
  }

  function handleTier(id: TierId) {
    if (id === tier) { advanceFrom('tier'); return }
    setTier(id)
    const nd = TIER_DATA[id]
    const firstGroup = nd.options ? Object.keys(nd.options)[0] : null
    const nextKey = firstGroup ? `option:${firstGroup}` : nd.addon ? 'addon' : null
    openAndScroll(nextKey)
  }

  function handleOption(group: string, i: number) {
    setOptIdx(prev => ({ ...prev, [tier]: { ...(prev[tier] ?? {}), [group]: i } }))
    advanceFrom(`option:${group}`)
  }

  function handleAddonToggle() {
    const next = !(addonOn[tier] ?? false)
    setAddonOn(prev => ({ ...prev, [tier]: next }))
    if (next) advanceFrom('addon')
  }

  function stepState(s: StepDef): { done: boolean; selectedLabel: string | null; hint: string; count: string } {
    if (s.kind === 'tier') return { done: true, selectedLabel: d.name, hint: '', count: '1/1' }
    if (s.kind === 'option') {
      const ix = getOptIdx(s.group!)
      const sel = ix !== null && d.options ? d.options[s.group!][ix] : null
      return { done: sel !== null, selectedLabel: sel, hint: '옵션을 선택해주세요', count: sel !== null ? '1/1' : '0/1' }
    }
    if (addon!.required) return { done: true, selectedLabel: '포함 · 필수', hint: '', count: '1/1' }
    return { done: addonActive, selectedLabel: addonActive ? '포함' : null, hint: '선택하지 않아도 됩니다', count: addonActive ? '1/1' : '0/1' }
  }

  // ── preview / summary 표시값 (기존 state에서만 파생) ──
  const sizeIdx = d.options && d.options['사이즈'] ? getOptIdx('사이즈') : null
  const sizeLabel = sizeIdx !== null && d.options ? d.options['사이즈'][sizeIdx] : null
  const previewRatio: [number, number] = (sizeLabel && SIZE_RATIO[sizeLabel]) || [4, 3]

  const summaryChips: string[] = []
  if (d.options) {
    for (const g of Object.keys(d.options)) {
      const ix = getOptIdx(g)
      if (ix !== null) summaryChips.push(d.options[g][ix])
    }
  }
  if (addonActive && addon) summaryChips.push(addon.name)

  const fontKr = CFG_KR

  return (
    <div className="bg-white">
      {/* ── 마스트헤드 ── (브랜드: 큰 gothic 타이틀 + 옆에 얇은 라운드 라벨 + CMYK 도트) */}
      <div id="estimator-scroll-target" className="border-b border-ink pb-6 mb-9">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
          <div className="min-w-0">
            <span
              className="inline-flex items-center gap-2 rounded-full mb-4 text-[11px] font-semibold text-ink"
              style={{ ...CFG_KR, border: '0.8px solid #1A1A1A', padding: '3px 12px' }}
            >
              <span className="flex gap-[3px]" aria-hidden>
                <span className="w-[6px] h-[6px] rounded-full" style={{ background: '#4CACE9' }} />
                <span className="w-[6px] h-[6px] rounded-full" style={{ background: '#DB438F' }} />
                <span className="w-[6px] h-[6px] rounded-full" style={{ background: '#FDF251' }} />
                <span className="w-[6px] h-[6px] rounded-full" style={{ background: '#1A1A1A' }} />
              </span>
              PRINT ESTIMATE / 견적
            </span>
            <h2
              className="text-black"
              style={{ fontFamily: 'Noto Sans KR, sans-serif', fontWeight: 700, fontSize: 'clamp(24px, 3.2vw, 42px)', lineHeight: 1.12, letterSpacing: '-0.025em' }}
            >
              2027 브랜드 캘린더<br />견적 계산기
            </h2>
          </div>
          <p className="max-w-[360px] text-[13px] text-ink-light/70 leading-[1.7]" style={fontKr}>
            제작 등급과 옵션을 순서대로 선택하면 아래 견적 요약에 예상 금액이 바로 반영됩니다. 표시 금액은 부가세·인쇄·배송 실비 별도입니다.
          </p>
        </div>
      </div>

      {/* ── 2열: 좌 preview / 우 configurator ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start pb-4">
        {/* 좌: 캘린더 미리보기 */}
        <div className="lg:sticky lg:top-[104px]">
          <div
            className="relative flex items-center justify-center overflow-hidden"
            style={{
              background: '#FBFCF8',
              border: '1px solid rgba(26,26,26,0.12)',
              minHeight: 'clamp(260px, 40vh, 520px)',
              padding: 'clamp(24px, 5vw, 56px)',
            }}
          >
            <div className="absolute top-3 left-3" style={{ opacity: 0.14 }}><RegMark size={15} color="#1A1A1A" /></div>
            <div className="absolute bottom-3 right-3" style={{ opacity: 0.14 }}><RegMark size={15} color="#1A1A1A" /></div>
            <CalendarPreview ratio={previewRatio} />
          </div>
          <div className="mt-3 flex items-baseline justify-between gap-3 border-t border-ink/20 pt-3">
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-ink-light/55" style={fontKr}>{d.name}</p>
              <p className="mt-0.5 text-[13px] text-ink truncate" style={fontKr}>
                {sizeLabel ?? (d.options ? '사이즈 미선택' : d.subtitle)}
              </p>
            </div>
            {addonActive && (
              <span className="shrink-0 text-[11px] font-medium" style={{ ...fontKr, color: CFG_INK }}>작가 협업 포함</span>
            )}
          </div>
        </div>

        {/* 우: progressive accordion */}
        <div>
          <div className="border-b border-ink/15">
            {steps.map((s, i) => {
              const st = stepState(s)
              return (
                <AccordionRow
                  key={s.key}
                  rowRef={el => { stepRefs.current[s.key] = el }}
                  index={String(i + 1).padStart(2, '0')}
                  label={s.label}
                  open={openStep === s.key}
                  onToggle={() => setOpenStep(openStep === s.key ? null : s.key)}
                  done={st.done}
                  selectedLabel={st.selectedLabel}
                  hint={st.hint}
                  count={st.count}
                >
                  {s.kind === 'tier' && (
                    <div className="flex flex-col gap-2">
                      {TIER_ORDER.map(id => (
                        <TierRow key={id} id={id} selected={tier === id} onSelect={() => handleTier(id)} />
                      ))}
                      <p className="mt-1 text-[12px] text-ink-light/55 leading-[1.6] break-keep" style={fontKr}>{d.subtitle}</p>
                    </div>
                  )}

                  {s.kind === 'option' && d.options && (
                    <div className="flex flex-col gap-2">
                      {d.options[s.group!].map((opt, oi) => (
                        <OptionRow
                          key={opt}
                          groupLabel={s.group!}
                          opt={opt}
                          selected={getOptIdx(s.group!) === oi}
                          onSelect={() => handleOption(s.group!, oi)}
                        />
                      ))}
                    </div>
                  )}

                  {s.kind === 'addon' && addon && (
                    <div className="flex flex-col gap-3">
                      <p className="text-[12px] text-ink-light/65 leading-[1.6] break-keep" style={fontKr}>{addon.note}</p>
                      {addon.required ? (
                        <div className="flex items-center gap-2 text-[13px] text-ink" style={fontKr}>
                          <span className="text-[11px] font-semibold" style={{ color: CFG_INK }}>✓</span>
                          이 등급의 필수 구성입니다.
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={handleAddonToggle}
                          className="w-full flex items-center justify-between text-left"
                          style={{
                            minHeight: '56px',
                            padding: '12px 14px',
                            borderRadius: '0px',
                            border: addonActive ? CFG_SEL_BORDER : CFG_REST_BORDER,
                            background: addonActive ? CFG_SEL_BG : '#ffffff',
                            transition: `border-color 160ms ${CFG_EASE}, background 160ms ${CFG_EASE}`,
                          }}
                        >
                          <span className="text-[13px] font-medium text-ink" style={fontKr}>
                            {addonActive ? '포함' : '포함하지 않음'}
                          </span>
                          <CheckDisc on={addonActive} />
                        </button>
                      )}
                      {addonActive && (
                        <div>
                          <div className="flex justify-between items-baseline text-[12px] mb-1.5">
                            <span className="text-ink-light/60" style={fontKr}>컷당 단가</span>
                            <span className="font-bold tabular-nums" style={{ ...fontKr, color: CFG_INK }}>
                              {wonFmt(addonPerCut[tier] ?? addon.defaultCut)}원
                            </span>
                          </div>
                          <input
                            type="range"
                            min={addon.min}
                            max={addon.max}
                            step={50000}
                            value={addonPerCut[tier] ?? addon.defaultCut}
                            onChange={e => setAddonPerCut(prev => ({ ...prev, [tier]: parseInt(e.target.value) }))}
                            className="w-full h-1"
                            style={{ accentColor: CFG_INK }}
                          />
                          <div className="flex justify-between items-baseline text-[12px] text-ink-light/60 mt-1.5" style={fontKr}>
                            <span>총 {addon.cuts}컷</span>
                            <span className="tabular-nums">{wonFmt((addonPerCut[tier] ?? addon.defaultCut) * addon.cuts)}원</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </AccordionRow>
              )
            })}
          </div>

          {/* 진행 조건 */}
          <div className="mt-6">
            <span className="text-[11px] font-bold text-ink-light/55 block mb-2" style={fontKr}>진행 조건</span>
            <ul className="flex flex-col gap-1">
              {d.rules.map((rule, i) => (
                <li key={i} className="text-[12px] text-ink-light/60 leading-[1.7] pl-4 relative break-keep" style={fontKr}>
                  <span className="absolute left-0 text-ink/30">—</span>
                  {rule}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── 하단 요약 (섹션 내부 sticky) ── */}
      <div className="lg:sticky lg:bottom-0 z-20 mt-10 bg-white border-t border-ink pt-5 pb-1">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className="text-[11px] font-medium text-ink-light/50" style={fontKr}>선택 플랜</span>
            <span className="text-[14px] font-bold text-ink" style={fontKr}>{d.name}</span>
            {summaryChips.length > 0 && (
              <span className="text-[12px] text-ink-light/55 break-keep" style={fontKr}>{summaryChips.join(' · ')}</span>
            )}
          </div>

          <div className="shrink-0 flex items-baseline gap-2">
            <span className="text-[11px] font-medium text-ink-light/50" style={fontKr}>현재 예상 견적</span>
            <span className="font-bold tabular-nums text-ink" style={{ ...fontKr, fontSize: 'clamp(20px, 3.4vw, 26px)' }}>
              {wonFmt(animatedTotal)}<small className="text-[13px] font-semibold ml-0.5">원</small>
            </span>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-2">
            <button
              onClick={copyText}
              className="px-5 py-3 text-[12.5px] font-semibold text-ink hover:bg-ink hover:text-ivory transition-colors"
              style={{ borderRadius: '999px', border: '0.8px solid #1A1A1A', ...fontKr }}
            >
              견적 텍스트 복사
            </button>
            <button
              onClick={onConsult}
              className="px-6 py-3 text-[12.5px] font-bold text-white transition-opacity hover:opacity-90"
              style={{ borderRadius: '999px', background: '#1A1A1A', ...fontKr }}
            >
              상담 신청하기 →
            </button>
          </div>
        </div>

        <div className="mt-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <p className="text-[10.5px] text-ink-light/50" style={fontKr}>
            부가세·인쇄·배송 실비 별도 · 최종 견적은 상담 후 확정됩니다.
          </p>
          <p className="text-[10.5px] text-ink-light/40 shrink-0 tabular-nums" style={fontKr}>기준일 {todayStr}</p>
        </div>
        {copyStatus && (
          <p className="mt-1 text-[11.5px] text-ink-light/60" style={fontKr}>{copyStatus}</p>
        )}
      </div>
    </div>
  )
}

// ── SERVICE ──────────────────────────────────────────────────────────────────
// 작은 서비스 label → 큰 2줄 headline → 넓은 whitespace →
// 01~04 가로 row (number / title / description / orange arrow) + hairline divider.
// 카드 UI 아님. 또렷한 typography + 얇은 선 + whitespace 중심.
const SERVICE_ROWS = [
  { no: '01', name: '달력 제작 기획',  desc: '템플릿 선택부터 브랜드 맞춤 기획까지.' },
  { no: '02', name: '맞춤 디자인',     desc: '로고 적용부터 표지·내지 맞춤 디자인까지.' },
  { no: '03', name: '제작 및 후가공',  desc: '제본부터 박·형압 등 다양한 후가공까지.' },
  { no: '04', name: '인쇄 & 납품',     desc: '최종 인쇄·검수·포장 후 일정에 맞춰 납품.' },
]

function Service() {
  const fontKr = { fontFamily: 'Noto Sans KR, sans-serif' }
  return (
    <section id="service" className="bg-white u-section scroll-mt-24">
      <div className={SHELL}>
        {/* Service 내부 전용 nested container — BTY+ Service block 비율(≈1184px)에 맞춰 좁힘.
            .u-shell(전역)은 건드리지 않고 이 섹션 안에서만 폭을 제한 → row 가 하나의 horizontal unit 으로 읽힘. */}
        <div className="max-w-[1200px] mx-auto">
          {/* 작은 서비스 label — orange dot + orange text (BTY+ 실측색 #FF2D16) */}
          <div className="flex items-center gap-2.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#FF2D16' }} aria-hidden />
            <span style={{ ...fontKr, fontWeight: 700, fontSize: '14px', letterSpacing: '-0.01em', color: '#FF2D16' }}>서비스</span>
          </div>

          {/* 큰 2줄 headline — Hero 보다 한 단계 아래, BTY+ 실측(56/800/lh1.22) 기준 */}
          <h2
            className="text-black"
            style={{ ...fontKr, fontWeight: 800, fontSize: 'clamp(30px, 3.6vw, 56px)', lineHeight: 1.2, letterSpacing: '-0.035em' }}
          >
            기획부터 제작,<br />납품까지 한 번에.
          </h2>

          {/* 01~04 rows — 첫 줄 위에도 divider 를 둬서 전체가 하나의 block 으로 */}
          <div className="mt-11 lg:mt-16 border-t border-black/35">
            {SERVICE_ROWS.map(r => (
              <div
                key={r.no}
                className="svc-row border-b border-black/35 py-8 lg:py-11
                           grid grid-cols-[1fr_auto] gap-x-5 gap-y-2
                           lg:grid-cols-[70px_34%_minmax(0,1fr)_30px] lg:gap-x-9 lg:gap-y-0 lg:items-center"
              >
                {/* A. number — 순서 표시 (BTY+ 15/700/#BBB 계열) */}
                <span
                  className="col-start-1 lg:col-start-1 lg:row-start-1 text-[13px] lg:text-[15px] tabular-nums leading-none"
                  style={{ ...fontKr, fontWeight: 700, color: '#B5B5B5' }}
                >
                  {r.no}
                </span>

                {/* B. service title — row 에서 가장 먼저 읽히는 요소 */}
                <span
                  className="col-start-1 lg:col-start-2 lg:row-start-1 min-w-0 text-black"
                  style={{ ...fontKr, fontWeight: 800, fontSize: 'clamp(24px, 2vw, 34px)', lineHeight: 1.2, letterSpacing: '-0.03em' }}
                >
                  {r.name}
                </span>

                {/* C. description — 한 줄로 바로 읽히는 실제 제공 서비스 (BTY+ 16/500/#666) */}
                <span
                  className="col-start-1 lg:col-start-3 lg:row-start-1 min-w-0"
                  style={{ ...fontKr, fontWeight: 500, fontSize: 'clamp(15px, 1vw, 16px)', lineHeight: 1.5, color: '#666666' }}
                >
                  {r.desc}
                </span>

                {/* D. orange arrow — hover 시 svc-arrow(래퍼) 만 이동 (row layout 불변) */}
                <span className="svc-arrow col-start-2 row-start-1 row-span-3 self-end lg:col-start-4 lg:row-span-1 lg:self-center flex justify-end">
                  <svg
                    className="block shrink-0"
                    width="28" height="16" viewBox="0 0 30 16" fill="none" aria-hidden="true"
                    style={{ color: '#FF2D16' }}
                  >
                    <path d="M1 8h27M20.5 2 27 8l-6.5 6" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ── CLIENTS ──────────────────────────────────────────────────────────────────
// layout-master.png: 큰 Clients 타이틀 + 짧은 설명 + 로고가 넓게 배열되는 그리드.
// 실제 로고 asset이 없으므로 기관명 텍스트 placeholder로 구성 (추후 실제 로고 교체).
const CLIENT_NAMES = [
  'LG', '화성시', '경기도', 'KAIST', '세종대학교', '단국대학교', '국민대학교',
  '신한금융그룹', '광주과학기술원', '근로복지공단', '국민연금공단', '한국가스공사', '서울특별시교육청', '식품의약품안전처',
]

function Clients() {
  return (
    <section className="bg-white u-section">
      <div className={SHELL}>
        <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
          <h2 className="t-display text-black">Clients</h2>
          <p className="t-body text-black/50">
            약 5,300여 개의<br className="hidden sm:block" /> 기업과 함께해왔습니다.
          </p>
        </div>

        {/* -mt-px / -ml-px 로 인접 셀 border를 겹쳐, 마지막 줄이 덜 차도 각 셀이 완결된 박스로 보임 */}
        <div className="u-head-gap grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
          {CLIENT_NAMES.map((name, i) => (
            <div key={i} className="-mt-px -ml-px border border-black/12 flex items-center justify-center p-4" style={{ aspectRatio: '3 / 2' }}>
              <span className="t-caption text-center text-black/35">{name}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 t-caption text-black/30">
          * 로고 자리 — 실제 로고 이미지로 교체 예정
        </p>
      </div>
    </section>
  )
}

// ── 견적 섹션 (랜딩 내장) ────────────────────────────────────────────────────
// layout-master.png처럼 페이지에서 크게 차지하는 넓은 가로 밴드.
// 계산 UI 자체(EstimatorInline)와 가격 데이터/계산식은 그대로 두고,
// 바깥 wrapper의 폭·여백·배경만 조정한다.
function EstimatorSection({ onConsult }: { onConsult: () => void }) {
  return (
    <section id="estimator" className="bg-white u-section-sm" style={{ scrollMarginTop: '56px' }}>
      <div className={SHELL}>
        <EstimatorInline onConsult={onConsult} />
      </div>
    </section>
  )
}

// ── 상담 문의 ─────────────────────────────────────────────────────────────────
function Consultation() {
  function scrollToEstimator() {
    document.getElementById('estimator')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  return (
    <section id="contact" className="bg-ivory-dark" style={{ scrollMarginTop: '52px' }}>
      <div className="max-w-[1360px] mx-auto px-8 md:px-12 py-14 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div>
            <SLabel>Consultation</SLabel>
            <h2 className="mt-1.5 text-[22px] md:text-[28px] font-light text-ink" style={{ fontFamily: 'Noto Serif KR, serif' }}>상담 문의</h2>
            <p className="mt-5 text-[13px] text-ink-light leading-[1.85]" style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>현재 자료 상태와 수량, 납기를 알려주시면 제작 가능한 방향을 먼저 안내해 드립니다. 확정 전 탐색 단계의 상담도 환영합니다.</p>
            <div className="mt-8 flex flex-col gap-4">
              {[{ label: 'E-mail', value: '이메일로 문의', note: '운영 중 안내 예정' }, { label: 'Instagram', value: '@touchgraphic', note: '포트폴리오 및 DM 문의' }, { label: 'Blog', value: '블로그', note: '제작 과정 및 사례 확인' }].map(c => (
                <div key={c.label} className="flex items-start gap-5 border-b border-ink/8 pb-4">
                  <span className="text-[9px] font-mono text-ink-light/38 tracking-widest w-16 pt-0.5 shrink-0">{c.label}</span>
                  <div><p className="text-[13px] text-ink" style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>{c.value}</p><p className="text-[11px] text-ink-light/48 mt-0.5">{c.note}</p></div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2.5">
            <div className="border border-ink/15 p-6">
              <p className="text-[9px] font-mono tracking-widest text-ink-light/35 mb-3">01 — 예상 견적 상담</p>
              <h3 className="text-[16px] font-medium text-ink mb-2" style={{ fontFamily: 'Noto Serif KR, serif' }}>예상 견적 상담 신청</h3>
              <p className="text-[12px] text-ink-light leading-[1.75] mb-5" style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>수량과 자료 상태를 선택하면 더 빠르게 안내해 드릴 수 있습니다.</p>
              <button onClick={scrollToEstimator}
                className="inline-flex items-center text-ivory px-5 py-2.5 text-[12px] transition-colors"
                style={{ fontFamily: 'Noto Sans KR, sans-serif', background: '#D65A34' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#B84A28')}
                onMouseLeave={e => (e.currentTarget.style.background = '#D65A34')}>
                견적 계산기로 이동
              </button>
            </div>
            <div className="border border-ink/15 p-6 bg-ivory">
              <p className="text-[9px] font-mono tracking-widest text-ink-light/35 mb-3">02 — 별도 프로젝트 문의</p>
              <h3 className="text-[16px] font-medium text-ink mb-2" style={{ fontFamily: 'Noto Serif KR, serif' }}>별도 프로젝트 문의</h3>
              <p className="text-[12px] text-ink-light leading-[1.75] mb-5" style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>비규격, 복합 품목, 특수 포장, 대량·분할 배송 등 자동 견적으로 파악하기 어려운 프로젝트는 직접 문의해 주세요.</p>
              <a href="mailto:hello@touchgraphic.kr" className="inline-flex items-center border border-ink px-5 py-2.5 text-[12px] hover:bg-ink hover:text-ivory transition-colors" style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>이메일로 문의하기</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── CONTACT (레이아웃-마스터 최하단 black 섹션) ─────────────────────────────
// layout-master.png: 전체 폭 black 섹션. 왼쪽 = 작은 label + 큰 headline + 강조
// 텍스트 + 연락정보 / 오른쪽 = 상담 폼 (dark UI).
// 기존 ConsultForm(견적 첨부 상담 플로우)은 그대로 두고, 이 섹션은 layout-master의
// 필드 구성(관심 서비스 pill, 내용 등)에 맞춘 자체 폼을 같은 useState 패턴으로 구성.
// 카피는 layout-master 문구를 임시 사용 (추후 교체).
const CONTACT_SERVICES = ['템플릿 제작', '맞춤 제작', '제작·후가공', '인쇄·납품', '전체 제작 상담']

function ContactForm() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [interests, setInterests] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)

  function toggleInterest(s: string) {
    setInterests(prev => (prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]))
  }

  if (submitted) {
    return (
      <div className="border border-white/15 p-8">
        <p className="text-[20px] font-medium text-white" style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>문의가 접수되었습니다.</p>
        <p className="mt-3 text-[13px] text-white/55" style={{ fontFamily: 'Noto Sans KR, sans-serif', lineHeight: 1.8 }}>
          내용을 확인한 뒤 연락드리겠습니다.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-6 text-[12px] border border-white/40 px-5 py-2.5 hover:bg-white hover:text-black transition-colors"
          style={{ fontFamily: 'Noto Sans KR, sans-serif' }}
        >
          다시 작성
        </button>
      </div>
    )
  }

  const inputCls =
    'w-full bg-transparent border border-white/20 px-3.5 py-3 text-[14px] text-white placeholder:text-white/30 focus:outline-none focus:border-white/60 transition-colors'
  const labelCls = 'text-[11px] tracking-[0.1em] text-white/40'
  const fontKr = { fontFamily: 'Noto Sans KR, sans-serif' }

  return (
    <form onSubmit={e => { e.preventDefault(); setSubmitted(true) }} className="flex flex-col gap-5">
      <p className="text-[12px] text-white/45 font-mono tracking-[0.03em]">기업·기관 맞춤 달력 · 템플릿부터 풀커스텀까지</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className={labelCls} style={fontKr}>이름 *</label>
          <input required value={name} onChange={e => setName(e.target.value)} placeholder="홍길동" className={inputCls} style={fontKr} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelCls} style={fontKr}>전화번호</label>
          <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="010-0000-0000" className={inputCls} style={fontKr} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelCls} style={fontKr}>이메일</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" className={inputCls} style={fontKr} />
        <span className="text-[11px] text-white/30" style={fontKr}>연락처와 이메일 중 편한 방법 하나만 남겨주세요.</span>
      </div>

      <div className="flex flex-col gap-2.5">
        <label className={labelCls} style={fontKr}>관심 서비스 (복수 선택)</label>
        <div className="flex flex-wrap gap-2">
          {CONTACT_SERVICES.map(s => {
            const on = interests.includes(s)
            return (
              <button
                type="button"
                key={s}
                onClick={() => toggleInterest(s)}
                className="px-3.5 py-2 text-[12.5px] border transition-colors"
                style={{
                  ...fontKr,
                  borderColor: on ? '#D65A34' : 'rgba(255,255,255,0.25)',
                  background: on ? 'rgba(214,90,52,0.16)' : 'transparent',
                  color: on ? '#ffffff' : 'rgba(255,255,255,0.7)',
                }}
              >
                {s}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelCls} style={fontKr}>내용</label>
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          rows={4}
          placeholder="제작 수량, 원하는 납품일, 디자인 범위 등 알고 계신 내용을 자유롭게 적어주세요."
          className={`${inputCls} resize-none`}
          style={fontKr}
        />
      </div>

      <button
        type="submit"
        className="w-full py-4 text-[14px] font-semibold text-white rounded-full transition-opacity hover:opacity-90"
        style={{ ...fontKr, background: '#D65A34' }}
      >
        달력 제작 상담 신청하기 →
      </button>
      <p className="text-[11px] text-white/30 text-center" style={fontKr}>문의 내용을 확인한 뒤 담당자가 연락드립니다.</p>
    </form>
  )
}

function Contact() {
  return (
    <section id="contact" className="bg-black text-white" style={{ scrollMarginTop: '56px' }}>
      <div className={`${SHELL} u-section`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-12 lg:gap-x-16">
          {/* 왼쪽 */}
          <div className="lg:col-span-5 min-w-0">
            <div className="flex items-center gap-2.5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#D65A34' }} aria-hidden />
              <span className="t-label text-white/60">제작 문의</span>
            </div>
            <h2 className="t-section text-white">
              만들고 싶은 달력을<br />
              <span style={{ color: '#D65A34' }}>들려주세요.</span>
            </h2>
            <p className="mt-6 t-lead text-white/70">
              템플릿 제작부터 브랜드 맞춤 제작까지.<br />
              기획·디자인·제작·납품 전 과정을 필요한 범위에 맞춰 함께합니다.
            </p>
            <a
              href="mailto:tag@touchagraphic.com"
              className="mt-4 inline-block t-body"
              style={{ color: '#D65A34' }}
            >
              tag@touchagraphic.com
            </a>
          </div>

          {/* 오른쪽: 폼 */}
          <div className="lg:col-span-6 lg:col-start-7 min-w-0">
            <ContactForm />
          </div>
        </div>

        <div className="mt-16 pt-6 border-t border-white/10 text-[11px] text-white/30 font-mono">
          © 2026 터치어그래픽 · TOUCHGRAPHIC
        </div>
      </div>
    </section>
  )
}

// ── FAQ ───────────────────────────────────────────────────────────────────────
const FAQ_ITEMS = [
  { q: '견적 문의 시 어떤 정보를 준비해야 하나요?', a: '제작 수량, 현재 자료 상태, 희망 납기, 배송 장소 수를 알려주시면 기본 방향을 안내해 드릴 수 있습니다.' },
  { q: '최소 제작 수량이 있나요?', a: '제작 조건과 사양에 따라 달라집니다. 소량일수록 단가가 높아지는 구조입니다. 정확한 조건은 상담을 통해 확인해 주세요.' },
  { q: '납기는 얼마나 걸리나요?', a: '자료 준비 상태와 제작 수준에 따라 다릅니다. 콘텐츠 기획부터 시작하는 경우 더 긴 일정이 필요합니다.' },
  { q: '샘플 또는 교정을 먼저 확인할 수 있나요?', a: '제작 수준과 사양에 따라 디지털 교정(PDF)과 출력 샘플 확인이 가능합니다. 자세한 방식은 상담 시 안내해 드립니다.' },
  { q: '전년도 디자인을 연도만 바꿔 재사용할 수 있나요?', a: '가능합니다. 이전 파일을 보내주시면 수정 가능 여부를 검토 후 안내해 드립니다.' },
  { q: '여러 장소로 나눠서 배송할 수 있나요?', a: '분할 배송이 가능합니다. 배송지 수와 수량에 따라 포장·배송 조건이 달라집니다.' },
]
function FAQ() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <section className="bg-ivory">
      <div className="max-w-[960px] mx-auto px-8 md:px-12 py-14 md:py-20">
        <div className="mb-8"><SLabel>FAQ</SLabel><h2 className="mt-1.5 text-[22px] md:text-[28px] font-light text-ink" style={{ fontFamily: 'Noto Serif KR, serif' }}>자주 묻는 질문</h2></div>
        <div className="divide-y divide-ink/8 border-t border-ink/8">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i}>
              <button className="w-full flex items-start justify-between gap-8 py-4 text-left hover:bg-ink/[0.015] transition-colors" onClick={() => setOpen(open === i ? null : i)}>
                <span className="text-[13px] font-medium text-ink leading-snug" style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>{item.q}</span>
                <span className={`text-[16px] text-ink-light shrink-0 transition-transform leading-none mt-0.5 ${open === i ? 'rotate-45' : ''}`}>+</span>
              </button>
              {open === i && <div className="pb-4"><p className="text-[13px] text-ink-light leading-[1.8] border-l border-ink/12 pl-4" style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>{item.a}</p></div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Q&A / FAQ (EstimatorSection ↓ / Contact ↑) ──────────────────────────────
// Service 섹션의 visual language 계승: orange accent(#FF2D16) · Noto Sans KR gothic ·
// thin rule · 넓은 whitespace · black / neutral gray. narrow centered reading column.
const FAQ_QA = [
  {
    q: '터치어그래픽은 어떤 회사인가요?',
    a: '터치어그래픽은 기업·기관을 위한 달력을 기획하고 디자인·제작하는 전문 스튜디오입니다. 간단한 템플릿형 제작부터 브랜드에 맞춰 처음부터 설계하는 맞춤형 달력까지, 기획·디자인·제작·납품 전 과정을 함께 진행합니다.',
  },
  {
    q: '다른 회사와 달력 서비스의 차이가 있나요?',
    a: '단순히 정해진 달력을 인쇄하는 데 그치지 않고, 브랜드의 목적과 분위기에 맞춰 기획과 디자인부터 함께할 수 있다는 점이 가장 큰 차이입니다. 예산을 낮춘 템플릿형부터 표지·내지·그래픽·후가공까지 새롭게 설계하는 풀커스텀 제작까지 폭넓게 대응합니다.',
  },
  {
    q: '원하는 수량과 예산에 맞춰 제작할 수 있나요?',
    a: '네. 수량과 예산에 따라 템플릿형 또는 맞춤 제작 방식으로 진행할 수 있습니다. 용지·제본·후가공 등의 사양도 조정할 수 있어, 필요한 범위에 맞춰 제작 방향과 견적을 함께 정리해드립니다.',
  },
  {
    q: '달력 제작 기간은 얼마나 걸리나요?',
    a: '제작 기간은 디자인 범위와 수량, 인쇄·후가공 사양에 따라 달라집니다. 템플릿형은 비교적 빠르게 진행할 수 있고, 맞춤형은 기획과 디자인 과정이 포함되므로 여유 있는 일정이 필요합니다. 원하는 납품일을 알려주시면 가능한 일정을 먼저 확인해드립니다.',
  },
]

const FAQ_KR = { fontFamily: 'Noto Sans KR, sans-serif' }

// 한 번에 하나만 open. 답변 패널 height 를 명시적으로 애니메이트(0 ↔ scrollHeight)한 뒤
// 열림이 끝나면 height:auto 로 되돌려, 모바일에서 답변이 재줄바꿈돼도 잘리지 않도록 한다.
function FaqRow({ item, index, isOpen, onToggle }: { item: { q: string; a: string }; index: number; isOpen: boolean; onToggle: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const mounted = useRef(false)

  useLayoutEffect(() => {
    const panel = panelRef.current
    const inner = innerRef.current
    if (!panel || !inner) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // 최초 렌더: 애니메이션 없이 상태만 반영
    if (!mounted.current) {
      mounted.current = true
      panel.style.height = isOpen ? 'auto' : '0px'
      panel.style.opacity = isOpen ? '1' : '0'
      return
    }

    let onEnd: (() => void) | undefined
    if (isOpen) {
      panel.style.opacity = '1'
      if (reduce) { panel.style.height = 'auto' } else {
        panel.style.height = '0px'
        void panel.offsetHeight
        panel.style.height = `${inner.scrollHeight}px`
        onEnd = () => { panel.style.height = 'auto'; panel.removeEventListener('transitionend', onEnd!) }
        panel.addEventListener('transitionend', onEnd)
      }
    } else {
      panel.style.opacity = '0'
      if (reduce) { panel.style.height = '0px' } else {
        panel.style.height = `${inner.scrollHeight}px`
        void panel.offsetHeight
        panel.style.height = '0px'
      }
    }
    return () => { if (onEnd) panel.removeEventListener('transitionend', onEnd) }
  }, [isOpen])

  return (
    <div className="border-b border-black/30">
      <button
        type="button"
        id={`faq-btn-${index}`}
        aria-expanded={isOpen}
        aria-controls={`faq-panel-${index}`}
        onClick={onToggle}
        className="faq-q group w-full flex items-start justify-between gap-6 py-6 lg:py-7 text-left cursor-pointer"
      >
        <span
          className="min-w-0 text-black"
          style={{ ...FAQ_KR, fontWeight: 700, fontSize: 'clamp(17px, 1.3vw, 21px)', lineHeight: 1.5, letterSpacing: '-0.02em' }}
        >
          {item.q}
        </span>
        <span
          className="shrink-0 mt-1 transition-opacity group-hover:opacity-60"
          style={{ color: '#FF2D16' }}
          aria-hidden="true"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="block">
            <line x1="3" y1="9" x2="15" y2="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            {!isOpen && <line x1="9" y1="3" x2="9" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
          </svg>
        </span>
      </button>
      <div
        ref={panelRef}
        id={`faq-panel-${index}`}
        role="region"
        aria-labelledby={`faq-btn-${index}`}
        className="faq-panel"
      >
        <div ref={innerRef}>
          <p
            className="max-w-[820px] pb-6 lg:pb-7"
            style={{ ...FAQ_KR, fontWeight: 400, fontSize: 'clamp(15px, 1vw, 16px)', lineHeight: 1.8, color: '#555555' }}
          >
            {item.a}
          </p>
        </div>
      </div>
    </div>
  )
}

function FaqSection() {
  const [open, setOpen] = useState<number | null>(0) // 01 = OPEN, 나머지 CLOSED

  // u-section 대신 FAQ 전용 세로 padding — 위는 밀도 있게(Estimator 와 연결), 아래는 Contact 와 충분한 여백
  return (
    <section id="faq" className="bg-white pt-[64px] lg:pt-[80px] pb-[80px] lg:pb-[112px] scroll-mt-24">
      {/* wide layout — 위 Estimator 와 동일한 SHELL 폭을 그대로 사용 (질문/divider/아이콘 = wide) */}
      <div className={SHELL}>
        {/* 상단 label — Service 와 동일한 orange dot + text (#FF2D16) */}
        <div className="flex items-center gap-2.5 mb-5">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#FF2D16' }} aria-hidden />
          <span style={{ ...FAQ_KR, fontWeight: 700, fontSize: '14px', letterSpacing: '-0.01em', color: '#FF2D16' }}>자주 묻는 질문</span>
        </div>

        {/* headline — Service headline 과 유사 hierarchy (Hero 보다 작게) */}
        <h2
          className="text-black"
          style={{ ...FAQ_KR, fontWeight: 800, fontSize: 'clamp(30px, 3.6vw, 56px)', lineHeight: 1.15, letterSpacing: '-0.035em' }}
        >
          궁금한 점.
        </h2>

        {/* accordion — 첫 줄 위에도 hairline. 답변 <p> 만 readable width 로 제한 */}
        <div className="mt-9 lg:mt-12 border-t border-black/30">
          {FAQ_QA.map((item, i) => (
            <FaqRow
              key={i}
              item={item}
              index={i}
              isOpen={open === i}
              onToggle={() => setOpen(open === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

// ── 푸터 ─────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-ink text-ivory">
      <div className="max-w-[1080px] mx-auto px-8 md:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-ivory/8 pb-10 mb-6">
          <div><p className="text-[15px] font-bold" style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>터치어그래픽</p><p className="mt-1 text-[10px] text-ivory/28 font-mono tracking-widest">TOUCHGRAPHIC</p><p className="mt-4 text-[11px] text-ivory/38 leading-[1.85]" style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>기업·기관의 자료를<br />12개월 콘텐츠와 디자인으로 완성하는<br />편집디자인 스튜디오</p></div>
          <div><p className="text-[9px] font-mono tracking-widest text-ivory/22 mb-4">CONTACT</p><div className="flex flex-col gap-2 text-[12px] text-ivory/45" style={{ fontFamily: 'Noto Sans KR, sans-serif' }}><span>이메일 문의</span><span>Instagram @touchgraphic</span></div></div>
          <div><p className="text-[9px] font-mono tracking-widest text-ivory/22 mb-4">LINKS</p><div className="flex flex-col gap-2 text-[12px] text-ivory/45" style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>{['About','Works','Instagram','Blog'].map(l => <a key={l} href="#" className="hover:text-ivory transition-colors">{l}</a>)}</div></div>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-[10px] text-ivory/18 font-mono">© 2026 Touchgraphic. All rights reserved.</p>
          <div className="flex items-center gap-3 opacity-15"><CropMarks size={7} gap={2} color="#F5F2EA" /><RegMark size={10} color="#F5F2EA" /><span className="text-[8px] font-mono tracking-widest text-ivory">C M Y K</span></div>
        </div>
      </div>
    </footer>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// 집중형 견적 계산기 화면
// ══════════════════════════════════════════════════════════════════════════════

// ── 상담 신청 폼 ─────────────────────────────────────────────────────────────
function ConsultForm({ sels, onBack, onReset }: { sels: Sels; onBack: () => void; onReset: () => void }) {
  const [name,  setName]  = useState('')
  const [org,   setOrg]   = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const selRows = [
    { k: 'quantity', v: sels.quantity > 0 ? `${sels.quantity.toLocaleString()}개` : '—' },
    { k: 'material', v: MATERIAL_OPTS.find(o => o.value === sels.material)?.label ?? '—' },
    { k: 'level',    v: LEVEL_OPTS.find(o => o.value === sels.level)?.label ?? '—' },
    { k: 'budget',   v: BUDGET_OPTS.find(o => o.value === sels.budget)?.label ?? '—' },
    { k: 'deadline', v: DEADLINE_OPTS.find(o => o.value === sels.deadline)?.label ?? '—' },
    { k: 'delivery', v: DELIVERY_OPTS.find(o => o.value === sels.delivery)?.label ?? '—' },
  ]
  const labelOf: Record<string, string> = { quantity: '제작 수량', material: '자료 준비 상태', level: '제작 수준', budget: '입력한 예산', deadline: '희망 납기', delivery: '배송 조건' }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center px-6">
        <div className="max-w-[520px] w-full">
          <SLabel>Submitted</SLabel>
          <p className="mt-3 text-[26px] font-light text-ink" style={{ fontFamily: 'Noto Serif KR, serif' }}>상담 신청이 접수되었습니다.</p>
          <p className="mt-3 text-[13px] text-ink-light leading-[1.8]" style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>선택하신 조건과 함께 담당자에게 전달됩니다. 검토 후 연락드리겠습니다.</p>
          <div className="mt-6 border border-ink/10 p-5">
            <p className="text-[9px] font-mono text-ink-light/38 tracking-widest mb-4">전달된 선택 조건</p>
            <div className="grid grid-cols-2 gap-3">
              {selRows.map(r => (
                <div key={r.k}><p className="text-[9px] font-mono text-ink-light/38 tracking-widest mb-0.5">{labelOf[r.k]}</p><p className="text-[13px] text-ink" style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>{r.v}</p></div>
              ))}
            </div>
          </div>
          <button onClick={onReset} className="mt-6 text-[12px] border border-ink px-5 py-2.5 hover:bg-ink hover:text-ivory transition-colors" style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>처음으로</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* 헤더 */}
      <div className="border-b border-ink/8 bg-[#FAFAF8] sticky top-0 z-10">
        <div className="max-w-[1180px] mx-auto px-6 md:px-10 h-13 flex items-center gap-4">
          <button onClick={onBack} className="text-[11px] font-mono text-ink-light/55 hover:text-ink transition-colors flex items-center gap-1.5">
            ← 견적 계산기로
          </button>
          <span className="text-ink-light/20 text-[12px]">|</span>
          <span className="text-[12px] text-ink-light/55 font-mono">예상 견적 상담 신청</span>
        </div>
      </div>

      <div className="max-w-[680px] mx-auto px-6 md:px-10 py-12">
        <SLabel>Consultation request</SLabel>
        <h2 className="mt-2 text-[22px] md:text-[28px] font-light text-ink" style={{ fontFamily: 'Noto Serif KR, serif' }}>예상 견적 상담 신청</h2>

        {/* 선택 조건 요약 */}
        <div className="mt-7 border border-ink/12 p-5 bg-white">
          <p className="text-[9px] font-mono text-ink-light/38 tracking-widest mb-4">선택 조건 — 상담 신청 시 함께 전달됩니다</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {selRows.map(r => (
              <div key={r.k}>
                <p className="text-[9px] font-mono text-ink-light/38 tracking-widest mb-0.5">{labelOf[r.k]}</p>
                <p className="text-[12px] font-medium text-ink" style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>{r.v}</p>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={e => { e.preventDefault(); setSubmitted(true) }} className="mt-7 flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[{ label: '담당자 성함', val: name, set: setName, ph: '홍길동', type: 'text' }, { label: '기관·기업명', val: org, set: setOrg, ph: '주식회사 ○○○', type: 'text' }].map(f => (
              <div key={f.label} className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono text-ink-light/42 tracking-widest">{f.label}</label>
                <input type={f.type} value={f.val} onChange={e => f.set(e.target.value)} required placeholder={f.ph}
                  className="border border-ink/15 bg-white px-3 py-2.5 text-[13px] text-ink placeholder:text-ink-light/25 focus:outline-none focus:border-ink/40 transition-colors"
                  style={{ fontFamily: 'Noto Sans KR, sans-serif' }} />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[{ label: '연락처', val: phone, set: setPhone, ph: '010-0000-0000', type: 'tel' }, { label: '이메일', val: email, set: setEmail, ph: 'example@company.kr', type: 'email' }].map(f => (
              <div key={f.label} className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono text-ink-light/42 tracking-widest">{f.label}</label>
                <input type={f.type} value={f.val} onChange={e => f.set(e.target.value)} required placeholder={f.ph}
                  className="border border-ink/15 bg-white px-3 py-2.5 text-[13px] text-ink placeholder:text-ink-light/25 focus:outline-none focus:border-ink/40 transition-colors"
                  style={{ fontFamily: 'Noto Sans KR, sans-serif' }} />
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 pt-2">
            <button type="submit"
            className="text-ivory px-7 py-3 text-[13px] transition-colors"
            style={{ fontFamily: 'Noto Sans KR, sans-serif', background: '#D65A34' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#B84A28')}
            onMouseLeave={e => (e.currentTarget.style.background = '#D65A34')}>
            상담 신청하기
          </button>
            <p className="text-[11px] text-ink-light/38" style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>선택 조건 6개가 함께 전달됩니다.</p>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── 숫자 애니메이션 훅 ───────────────────────────────────────────────────────
function useAnimatedNumber(target: number) {
  const [display, setDisplay] = useState(target)
  const fromRef = useRef(target)

  useEffect(() => {
    const from = fromRef.current
    fromRef.current = target
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion || from === target) { setDisplay(target); return }
    const dur = 420
    const start = performance.now()
    let rafId: number
    function step(now: number) {
      const p = Math.min(1, (now - start) / dur)
      const eased = 1 - Math.pow(1 - p, 3)
      setDisplay(Math.round(from + (target - from) * eased))
      if (p < 1) rafId = requestAnimationFrame(step)
    }
    rafId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafId)
  }, [target])

  return display
}

// ── 견적 계산기 전용 화면 ────────────────────────────────────────────────────
function EstimatorPage({ onBack, onConsult }: {
  sels: Sels; setSels: (s: Sels) => void
  onBack: () => void; onConsult: () => void
}) {
  const [tier, setTier] = useState<TierId>('template')
  const [optIdx, setOptIdx] = useState<Record<string, Record<string, number>>>({})
  const [addonOn, setAddonOn] = useState<Record<string, boolean>>({ custom_basic: false, custom_highend: true })
  const [addonPerCut, setAddonPerCut] = useState<Record<string, number>>({ custom_basic: 750000, custom_highend: 500000 })
  const [copyStatus, setCopyStatus] = useState('')

  const d = TIER_DATA[tier]
  const addon = d.addon ?? null
  const addonActive = addon ? (addon.required || (addonOn[tier] ?? false)) : false
  const addonCost = addonActive && addon ? (addonPerCut[tier] ?? addon.defaultCut) * addon.cuts : 0

  let total = d.breakdown.reduce((a, b) => a + b.value, 0)
  if (addonActive) total += addonCost
  const animatedTotal = useAnimatedNumber(total)

  function getOptIdx(label: string) {
    return (optIdx[tier] ?? {})[label] ?? 0
  }

  async function copyText() {
    const lines = [`[견적서] ${d.name} · ${d.subtitle}`, '']
    d.breakdown.forEach(item => lines.push(`${item.label} : ${wonFmt(item.value)}원`))
    if (addon && addonActive) {
      const perCut = addonPerCut[tier] ?? addon.defaultCut
      lines.push(`${addon.name} : ${wonFmt(perCut * addon.cuts)}원 (컷당 ${wonFmt(perCut)}원 × ${addon.cuts}컷)`)
    }
    lines.push('')
    lines.push(`합계(부가세·인쇄비 별도) : ${wonFmt(total)}원`)
    try {
      await navigator.clipboard.writeText(lines.join('\n'))
      setCopyStatus('복사 완료')
      setTimeout(() => setCopyStatus(''), 1800)
    } catch {
      setCopyStatus('복사 실패 — 직접 선택해 주세요')
    }
  }

  const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '.')

  return (
    <div
      className="min-h-screen pb-10"
      style={{
        background: '#dbd7c8',
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(28,28,30,0.05) 1px, transparent 0)',
        backgroundSize: '22px 22px',
      }}
    >
      {/* 상단 헤더 */}
      <div className="border-b border-ink/10 bg-[#dbd7c8]/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-[1080px] mx-auto px-5 md:px-8 h-12 flex items-center gap-4">
          <button onClick={onBack}
            className="text-[11px] font-mono text-ink-light/55 hover:text-ink transition-colors flex items-center gap-1.5">
            ← 이전 화면
          </button>
          <span className="text-ink-light/20 text-[12px]">|</span>
          <span className="text-[11px] font-mono tracking-[0.1em] text-ink-light/45">PRINT ESTIMATE</span>
        </div>
      </div>

      <div className="max-w-[1080px] mx-auto px-5 md:px-8 pt-7 pb-12">

        {/* 마스트헤드 */}
        <div className="flex items-end justify-between gap-4 flex-wrap border-b-2 border-ink pb-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex gap-1">
                <span className="w-[6px] h-[6px] rounded-full" style={{ background: '#00aeef' }} />
                <span className="w-[6px] h-[6px] rounded-full" style={{ background: '#ec008c' }} />
                <span className="w-[6px] h-[6px] rounded-full" style={{ background: '#e0b400' }} />
                <span className="w-[6px] h-[6px] rounded-full bg-ink" />
              </div>
              <span className="text-[11px] font-mono tracking-[0.14em] text-ink-light/55">PRINT ESTIMATE / 인쇄 견적</span>
            </div>
            <h1 className="text-[clamp(22px,3.4vw,34px)] font-semibold text-ink leading-[1.2] tracking-[-0.01em]"
              style={{ fontFamily: 'Noto Serif KR, serif' }}>
              2027 브랜드 캘린더<br />견적 계산기
            </h1>
          </div>
          <p className="max-w-[320px] text-[13px] text-ink-light/65 leading-[1.6]"
            style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>
            등급을 고르고 옵션을 조정하면 오른쪽 견적서 금액이 바로 바뀝니다. 표시 금액은 부가세 및 인쇄·배송 실비 별도입니다.
          </p>
        </div>

        {/* 2열 레이아웃 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7 items-start">

          {/* ── 왼쪽: 컨트롤 패널 ── */}
          <div>

            {/* 01 등급 선택 */}
            <div className="mb-7">
              <div className="flex items-baseline gap-2 mb-2.5">
                <span className="text-[12px] font-mono font-bold text-ink">01</span>
                <span className="text-[11px] font-mono tracking-[0.1em] text-ink-light/55">등급 선택</span>
              </div>
              <div className="flex border-b border-ink/40">
                {TIER_ORDER.map(id => (
                  <button key={id}
                    onClick={() => setTier(id)}
                    className={`flex-1 text-left px-2 py-3 border-b-[3px] transition-colors ${
                      tier === id ? 'border-[#d6392c]' : 'border-transparent hover:border-ink/15'
                    }`}>
                    <span className="block text-[13px] font-semibold text-ink mb-0.5"
                      style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>
                      {TIER_DATA[id].name}
                    </span>
                    <span className={`block text-[11px] font-mono ${tier === id ? 'text-[#d6392c]' : 'text-ink-light/50'}`}>
                      {wonFmt(tierBaseTotal(id))}원~
                    </span>
                  </button>
                ))}
              </div>
              <p className="text-[12px] text-ink-light/60 mt-3 leading-[1.6]"
                style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>
                {d.subtitle}
              </p>
            </div>

            {/* 02 옵션 (template only) */}
            {d.options && (
              <div className="mb-7">
                <div className="flex items-baseline gap-2 mb-2.5">
                  <span className="text-[12px] font-mono font-bold text-ink">02</span>
                  <span className="text-[11px] font-mono tracking-[0.1em] text-ink-light/55">옵션</span>
                </div>
                {Object.entries(d.options).map(([label, list]) => (
                  <div key={label} className="mb-3.5">
                    <label className="block text-[12.5px] font-semibold text-ink mb-1.5"
                      style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>
                      {label}
                    </label>
                    <div className="relative">
                      <select
                        value={getOptIdx(label)}
                        onChange={e => {
                          const newIdx = parseInt(e.target.value)
                          setOptIdx(prev => ({
                            ...prev,
                            [tier]: { ...(prev[tier] ?? {}), [label]: newIdx },
                          }))
                        }}
                        className="w-full appearance-none bg-[#faf9f4] border border-ink/30 px-3 py-2.5 text-[13.5px] text-ink pr-8 focus:outline-none focus:border-ink/60 transition-colors"
                        style={{ fontFamily: 'Noto Sans KR, sans-serif', borderRadius: '2px' }}>
                        {list.map((opt, i) => (
                          <option key={i} value={i}>{opt}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-ink-light/45">▼</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 03 애드온 */}
            {addon && (
              <div className="mb-7">
                <div className="flex items-baseline gap-2 mb-2.5">
                  <span className="text-[12px] font-mono font-bold text-ink">03</span>
                  <span className="text-[11px] font-mono tracking-[0.1em] text-ink-light/55">애드온</span>
                </div>
                <div className="border border-dashed border-ink/30 p-3.5" style={{ borderRadius: '2px' }}>
                  {addon.required ? (
                    <div>
                      <span className="block text-[13.5px] font-semibold text-ink"
                        style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>{addon.name}</span>
                      <span className="block text-[11.5px] text-ink-light/60 mt-0.5"
                        style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>{addon.note}</span>
                    </div>
                  ) : (
                    <label className="flex items-start gap-2.5 cursor-pointer select-none">
                      <input type="checkbox"
                        checked={addonOn[tier] ?? false}
                        onChange={e => setAddonOn(prev => ({ ...prev, [tier]: e.target.checked }))}
                        className="w-4 h-4 mt-0.5 shrink-0 accent-[#d6392c]" />
                      <span>
                        <span className="block text-[13.5px] font-semibold text-ink"
                          style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>{addon.name}</span>
                        <span className="block text-[11.5px] text-ink-light/60 mt-0.5"
                          style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>{addon.note}</span>
                      </span>
                    </label>
                  )}

                  {addonActive && (
                    <div className="mt-3.5">
                      <div className="flex justify-between items-baseline text-[12px] mb-1.5">
                        <span className="text-ink-light/60">컷당 단가</span>
                        <span className="font-mono font-semibold text-[#d6392c]">
                          {wonFmt(addonPerCut[tier] ?? addon.defaultCut)}원
                        </span>
                      </div>
                      <input type="range"
                        min={addon.min} max={addon.max} step={50000}
                        value={addonPerCut[tier] ?? addon.defaultCut}
                        onChange={e => setAddonPerCut(prev => ({ ...prev, [tier]: parseInt(e.target.value) }))}
                        className="w-full h-1 accent-[#d6392c]" />
                      <div className="flex justify-between items-baseline text-[12px] text-ink-light/60 mt-1.5">
                        <span>총 {addon.cuts}컷</span>
                        <span className="font-mono">{wonFmt((addonPerCut[tier] ?? addon.defaultCut) * addon.cuts)}원</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 진행 조건 */}
            <div className="border-t border-ink/15 pt-4 mt-1">
              <span className="text-[11px] font-mono font-bold text-ink-light/55 tracking-[0.08em] block mb-2">진행 조건</span>
              <ul className="flex flex-col gap-1">
                {d.rules.map((rule, i) => (
                  <li key={i} className="text-[12px] text-ink-light/60 leading-[1.7] pl-4 relative"
                    style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>
                    <span className="absolute left-0 text-ink/25 font-mono">—</span>
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── 오른쪽: 견적서 슬립 ── */}
          <div className="md:sticky md:top-[49px] pt-3">
            <div
              className="slip-perf relative bg-[#faf9f4] border border-ink/20 px-6 md:px-7 pb-6 pt-7"
              style={{ borderRadius: '2px', boxShadow: '0 18px 34px -20px rgba(28,28,30,0.35)' }}>
              {/* 레지스트레이션 마크 */}
              <div className="absolute top-3.5 left-3.5 opacity-50"><RegMark size={16} color="#1c1c1e" /></div>
              <div className="absolute top-3.5 right-3.5 opacity-50"><RegMark size={16} color="#1c1c1e" /></div>

              {/* 슬립 헤더 */}
              <div className="flex justify-between items-start pb-3.5 mb-3.5 border-b-2 border-ink">
                <div>
                  <div className="text-[16px] font-bold text-ink tracking-[0.04em]">견 적 서</div>
                  <div className="text-[11px] text-ink-light/55 mt-1" style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>
                    {d.name} · {d.subtitle}
                  </div>
                </div>
                <div className="text-right font-mono text-[11px] text-ink-light/55">
                  EST. NO.<br />{todayStr}
                </div>
              </div>

              {/* 스펙 (template 옵션 요약) */}
              {d.options && (
                <div className="mb-4">
                  <div className="text-[10.5px] font-mono tracking-[0.1em] text-ink-light/50 mb-1.5">SPEC / 선택 사양</div>
                  {Object.entries(d.options).map(([label, list]) => (
                    <div key={label} className="flex justify-between items-baseline py-1.5 border-b border-dotted border-ink/18">
                      <span className="text-[12px] text-ink-light/60" style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>{label}</span>
                      <span className="text-[12px] font-mono text-ink-light/60">{list[getOptIdx(label)]}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* 구성 항목 */}
              <div className="mb-1">
                <div className="text-[10.5px] font-mono tracking-[0.1em] text-ink-light/50 mb-1.5">BREAKDOWN / 구성 항목</div>
                {d.breakdown.map((item, i) => (
                  <div key={i} className="flex justify-between items-baseline py-1.5 border-b border-dotted border-ink/18">
                    <span className="text-[13px] text-ink" style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>{item.label}</span>
                    <span className="text-[13px] font-mono text-ink">{wonFmt(item.value)}원</span>
                  </div>
                ))}
                {addon && addonActive && (
                  <div className="flex justify-between items-baseline py-1.5 border-b border-dotted border-ink/18">
                    <span className="text-[13px] text-[#d6392c]" style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>{addon.name}</span>
                    <span className="text-[13px] font-mono text-[#d6392c]">{wonFmt(addonCost)}원</span>
                  </div>
                )}
              </div>

              {/* 합계 */}
              <div className="flex justify-between items-baseline mt-4 pt-3.5 border-t-2 border-ink">
                <div>
                  <span className="text-[13px] font-bold text-ink">합계</span>
                  <span className="block text-[10.5px] text-ink-light/50 mt-0.5" style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>부가세·인쇄비 별도</span>
                </div>
                <div className="text-right">
                  <div className="font-mono font-semibold text-[#d6392c]" style={{ fontSize: '24px' }}>
                    {wonFmt(animatedTotal)}<small className="text-[13px] font-medium ml-0.5">원</small>
                  </div>
                  {addon && (
                    <div className="text-[11px] font-mono text-ink-light/50 mt-0.5">
                      {addon.required ? '협업 단가 범위 ' : '선택 시 추가 '}
                      {wonFmt(addon.cuts * addon.min)}~{wonFmt(addon.cuts * addon.max)}원
                    </div>
                  )}
                </div>
              </div>

              {/* 하단 버튼 */}
              <div className="mt-5 flex gap-2 items-center flex-wrap">
                <button onClick={copyText}
                  className="bg-ink text-ivory px-4 py-2.5 text-[12.5px] font-semibold hover:bg-ink-mid transition-colors"
                  style={{ borderRadius: '2px', fontFamily: 'Noto Sans KR, sans-serif' }}>
                  견적서 텍스트 복사
                </button>
                <button onClick={onConsult}
                  className="text-ivory px-4 py-2.5 text-[12.5px] font-semibold transition-colors hover:opacity-90"
                  style={{ background: '#d6392c', borderRadius: '2px', fontFamily: 'Noto Sans KR, sans-serif' }}>
                  상담 신청하기 →
                </button>
                {copyStatus && (
                  <span className="text-[11.5px] text-ink-light/55" style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>
                    {copyStatus}
                  </span>
                )}
              </div>
              <p className="text-[10.5px] text-ink-light/50 mt-3" style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>
                본 견적은 예상 금액이며, 최종 견적은 상담 후 확정됩니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


// ══════════════════════════════════════════════════════════════════════════════
// App 루트
// ══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [view, setView] = useState<AppView>('landing')
  const [sels] = useState<Sels>({ ...DEFAULT_SELS })

  useEffect(() => { if (view === 'landing') return; window.scrollTo(0, 0) }, [view])

  function reset() { setView('landing') }

  if (view === 'consult') {
    return <ConsultForm sels={sels} onBack={() => setView('landing')} onReset={reset} />
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Portfolio />
      <Service />
      <Clients />
      <EstimatorSection onConsult={() => setView('consult')} />
      <FaqSection />
      <Contact />
    </div>
  )
}

// 레거시(현재 미사용): TrustStrip · Consultation · FAQ · Footer.
// 기존 정의는 남겨두되 1차 리디자인에서는 렌더하지 않는다.
void TrustStrip; void Consultation; void FAQ; void Footer;
