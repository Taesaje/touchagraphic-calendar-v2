import { useState, useEffect, useRef, useLayoutEffect } from 'react'

import { CALENDAR_PORTFOLIO, getCalendarProjectByIdx } from '@/data/calendarPortfolio'

import calendarCover  from '@/imports/1.jpg'
import calendarSpread from '@/imports/6.jpg'
import calendarHeld   from '@/imports/5.jpg'
import calendarDates  from '@/imports/2.jpg'
import calendarFeb    from '@/imports/7.jpg'
import calendar8      from '@/imports/8.jpg'
import calendar9      from '@/imports/9.jpg'
import calendar10     from '@/imports/10.jpg'
// 실제 터치어그래픽 제작 사례 썸네일 15종 (모두 4:5, 이미지에 카테고리·프로젝트명 타이포 내장)
import pf01 from '@/imports/portfolio-v2/기관_한국환경산업기술원.png'
import pf02 from '@/imports/portfolio-v2/기업_아이디어두잇.png'
import pf03 from '@/imports/portfolio-v2/일러스트_이매진 서울.png'
import pf04 from '@/imports/portfolio-v2/기관_한국가스기술공사.png'
import pf05 from '@/imports/portfolio-v2/기업_동아제약.png'
import pf06 from '@/imports/portfolio-v2/일러스트_한국수목정원관리원.png'
import pf07 from '@/imports/portfolio-v2/기관_대구오페라하우스.png'
import pf08 from '@/imports/portfolio-v2/기업_세종 스포츠.png'
import pf09 from '@/imports/portfolio-v2/일러스트_2026 일상 캘린더.png'
import pf10 from '@/imports/portfolio-v2/기관_상공회의소.png'
import pf11 from '@/imports/portfolio-v2/기업_이글루코퍼레이션.png'
import pf12 from '@/imports/portfolio-v2/일러스트_2026 미니 캘린더.png'
import pf13 from '@/imports/portfolio-v2/기관_경기도중독관리.png'
import pf14 from '@/imports/portfolio-v2/기업_설빙.png'
import pf15 from '@/imports/portfolio-v2/기관_함평군.png'

// 실제 가로형(≈4:3) 제작 사례 원본 사진 — 브랜드별 후보를 비교해 rail 대표컷 1장씩 선택.
// (같은 브랜드의 다른 촬영컷은 src/imports/portfolio-originals/ 에 그대로 보존)
import hpSanggong   from '@/imports/portfolio-v2/대한 상공회의소.jpg'            // = 상공회의소 1 (표지, crop 안정적)
import hpIdeadoit   from '@/imports/portfolio-originals/아이디어두잇 5.jpg'      // 12월 그리드에 스티커 붙이는 손 컷
import hpImagine    from '@/imports/portfolio-v2/이매진서울.jpg'
import hpDongaDesk  from '@/imports/portfolio-originals/동아그룹 5.jpg'          // 손에 든 회전목마 일러스트 내지 (베이스 각인 "동아쏘시오그룹")
import hpDongaDiary from '@/imports/portfolio-v2/동아쏘시오 그룹.jpg'            // 다이어리 (DONG-A SOCIO GROUP) — 동일 업체 secondary
import hpSejong     from '@/imports/portfolio-v2/세종스포츠.jpg'
import hpSumok      from '@/imports/portfolio-originals/한국수목정원관리원 6.jpg' // 사계절전시온실 단일 일러스트 (백조·꽃·정원) — rail 밀도 우선
import hpHampyeong  from '@/imports/portfolio-originals/함평군 2.jpg'            // 1·2월 그리드 펼침 + 국화분재 사진

// 실제 클라이언트 로고 12종(아이디어두잇은 idea/doit 2개 asset 조합) — Clients 섹션 monochrome block 전용.
// 원본 파일은 절대 수정하지 않고, 화면에서는 CSS filter(.cl-logo, index.css)로만 monochrome 처리한다.
import clDongaPharm    from '@/imports/client-logos/donga-pharm.svg'
import clSejongSports  from '@/imports/client-logos/sejong-sports.svg'
import clKoagi         from '@/imports/client-logos/koagi.png'
import clKorcham       from '@/imports/client-logos/korcham.png'
import clIgloo         from '@/imports/client-logos/igloo.svg'
import clGcamc         from '@/imports/client-logos/gcamc.png'
import clHampyeong     from '@/imports/client-logos/hampyeong.png'
import clKogasTech     from '@/imports/client-logos/kogas-tech.png'
import clKeiti         from '@/imports/client-logos/keiti.png'
import clIdeadoitIdea  from '@/imports/client-logos/ideadoit-idea.png'
import clIdeadoitDoit  from '@/imports/client-logos/ideadoit-doit.png'
import clSulbing       from '@/imports/client-logos/sulbing.png'
import clDaeguOpera    from '@/imports/client-logos/daegu-opera.png'

import certCalendar   from '@/imports/certifications/direct-production-calendar.jpg'
import certIndustrial from '@/imports/certifications/industrial-design-company.png'
import certWomenOwned from '@/imports/certifications/women-owned-business.jpg'
import certPublishing from '@/imports/certifications/direct-production-publishing.jpg'
import certDesignSvc  from '@/imports/certifications/direct-production-design-service.jpg'

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

// 베이직 전용 보조 옵션 — 종이 사양. 가격 데이터가 없어 계산에는 연결하지 않고
// consultation 전달용 선택 정보로만 사용한다 (표지 스타일과 동일한 위계).
type PaperType = 'undecided' | 'snow' | 'rendezvous'
const PAPER_TYPE_OPTIONS: { id: PaperType; label: string }[] = [
  { id: 'snow', label: '스노우지' },
  { id: 'rendezvous', label: '랑데뷰지' },
  { id: 'undecided', label: '미정' },
]

// 베이직 전용 '표지 스타일' 선택("불꽃양 그래픽" / "2027 타이포그래피")과 연동되는
// 실물 제작 예시 사진 슬롯. 라벨 → key 매핑을 거치는 이유는 옵션 배열 순서가 아니라
// 실제 표시 문구를 기준으로 안전하게 연결하기 위함이다.
// 사진이 준비되면 import 해서 아래 배열의 null 자리에 넣기만 하면 preview 가
// placeholder 대신 실제 이미지로 자동 교체된다. (가격 계산과 무관, 표시 전용)
type CoverStyleKey = 'graphic' | 'typography'
const COVER_STYLE_TO_KEY: Record<string, CoverStyleKey> = {
  '불꽃양 그래픽': 'graphic',
  '2027 타이포그래피': 'typography',
}
const COVER_STYLE_PREVIEWS: Record<CoverStyleKey, (string | null)[]> = {
  graphic: [null, null],
  typography: [null, null],
}

// 옵션 값·개수는 기존 template 기준 그대로. 모든 tier가 동일한 사이즈 / 내지 레이아웃
// step 을 갖도록 세 등급에 같은 배열을 공유한다. (옵션은 total 계산에 반영되지 않는 표시 전용)
const TIER_DATA: Record<TierId, TierDef> = {
  template: {
    name: '베이직 (실속형)',
    subtitle: '기본 디자인을 활용해 예산은 줄이고 필요한 내용만 맞춰 제작합니다.',
    breakdown: [
      { label: '템플릿 이용료', value: 100000 },
      { label: '표지 디자인',   value: 300000 },
      { label: '내지 세팅',     value: 500000 },
    ],
    options: {
      '사이즈':       ['A · 가로형', 'B · 세로형', 'C · 정사각', 'D · 와이드'],
      '내지 레이아웃':['2분할', '4분할', '5분할', '미니 달력형'],
      '표지 스타일':  ['불꽃양 그래픽', '2027 타이포그래피'],
    },
    rules: [
      '표지 수정 2회 한정',
      '내지 12p, 사진/텍스트 단순 치환 (레이아웃 변경 불가)',
      '인쇄/배송 실비 별도',
    ],
  },
  custom_basic: {
    name: '커스텀 (맞춤형)',
    subtitle: '브랜드의 목적과 분위기에 맞춰 표지와 내지를 맞춤 디자인합니다.',
    breakdown: [
      { label: '기획 PT',           value: 1000000 },
      { label: '표지 디자인',        value: 1000000 },
      { label: '내지 디자인 (24p)',  value: 2400000 },
      { label: 'AI 비주얼 애드온',   value:  400000 },
    ],
    options: {
      '사이즈':       ['A · 가로형', 'B · 세로형', 'C · 정사각', 'D · 와이드'],
      '내지 레이아웃':['2분할', '4분할', '5분할', '미니 달력형'],
    },
    rules: ['기획안 3종 제안', '인쇄 실비 별도'],
  },
  custom_highend: {
    name: '하이앤드 (기획형)',
    subtitle: '기획부터 비주얼 콘셉트와 내지 구성까지 새롭게 설계합니다.',
    breakdown: [
      { label: '기획 PT',          value: 3000000 },
      { label: '키비주얼 표지',     value: 2000000 },
      { label: '내지 디자인 (24p)', value: 4800000 },
    ],
    options: {
      '사이즈':       ['A · 가로형', 'B · 세로형', 'C · 정사각', 'D · 와이드'],
      '내지 레이아웃':['2분할', '4분할', '5분할', '미니 달력형'],
    },
    rules: [
      '인터뷰/만남 기반 전용 기획, 디렉팅 총괄',
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
//   [좌: 텍스트 로고]  [중앙: 밝은 gray rounded nav + 얇은 세로 구분선]  [우: 액션 버튼]
//   · 빠른상담 = reference blue(임시, 브랜드색은 추후 교체)
//   · lg 미만 → 로고 + '제작 문의' 최소 구조 (모바일 헤더는 새로 디자인하지 않음)
// 좌우 시작선은 Hero(.u-shell)와 동일하게 맞춘다. 수치는 reference 1440px 화면 기준 근사값.
const HEADER_NAV = [
  { label: '제작 사례',     href: '#portfolio', targetId: 'portfolio-scroll-target' },
  { label: '견적 계산하기', href: '#estimator', targetId: 'estimator-scroll-target' },
]

// nav 클릭 시 target(섹션 제목 블록)이 viewport 세로 중앙에 오도록 스크롤.
// fixed 헤더 때문에 scroll-margin-top 만으로는 중앙 정렬이 안 되므로 rect 로 직접 계산한다.
// App 의 route 전환 후 pending scroll 처리에서도 재사용하기 위해 모듈 스코프로 둔다.
function scrollToCenter(id: string) {
  const target = document.getElementById(id)
  if (!target) return
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const rect = target.getBoundingClientRect()
  const targetY = window.scrollY + rect.top - (window.innerHeight - rect.height) / 2
  window.scrollTo({ top: Math.max(0, targetY), behavior: reduce ? 'auto' : 'smooth' })
}

// page: 현재 어느 화면에서 렌더되는지('landing' | 'portfolio'). navigate: App 이 소유한 route 전환 함수.
// '제작 사례' / '견적 계산하기' 는 landing 에서는 기존처럼 같은 페이지 내 스크롤, /portfolio 에서는
// 서로의 페이지로 이동(+ 필요 시 이동 후 스크롤 위치 예약)하도록 분기한다.
function Header({ page = 'landing', navigate }: { page?: 'landing' | 'portfolio' | 'portfolio-detail' | 'inquiry'; navigate: (path: string, opts?: { scrollTo?: string }) => void }) {
  function scrollToContact() {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  function handleLogoClick(e: React.MouseEvent) {
    e.preventDefault()
    if (page === 'landing') {
      window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
      return
    }
    navigate('/')
  }
  function handleInquiryClick(e: React.MouseEvent) {
    e.preventDefault()
    if (page === 'inquiry') {
      window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
      return
    }
    navigate('/inquiry')
  }
  function handleNavClick(e: React.MouseEvent, targetId: string) {
    e.preventDefault()
    if (targetId === 'portfolio-scroll-target') {
      if (page === 'portfolio') { window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); return }
      navigate('/portfolio')
      return
    }
    // estimator
    if (page === 'landing') { scrollToCenter(targetId); return }
    navigate('/', { scrollTo: targetId })
  }
  const fontKr = { fontFamily: 'Noto Sans KR, sans-serif' }
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-black/[0.07]">
      <div className={`${SHELL} h-[64px] lg:h-[96px] grid grid-cols-[1fr_auto_1fr] items-center gap-6`}>
        {/* 좌: 텍스트 로고 */}
        <a href="/" onClick={handleLogoClick} className="justify-self-start text-[17px] lg:text-[22px] font-extrabold tracking-[-0.02em] text-black leading-none" style={fontKr}>
          터치어그래픽
        </a>

        {/* 중앙: rounded gray nav container (desktop 전용) */}
        <nav className="hidden lg:flex items-center h-[56px] rounded-[11px] bg-black/[0.05] px-3">
          {HEADER_NAV.map((item, i) => (
            <span key={item.label} className="flex items-center">
              {i > 0 && <span className="mx-1 h-3 w-px bg-black/[0.16]" aria-hidden />}
              <a
                href={item.href}
                onClick={e => handleNavClick(e, item.targetId)}
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
          <div className="hidden lg:flex items-center">
            <a href="/inquiry" onClick={handleInquiryClick}
              className="inline-flex items-center justify-center h-[54px] lg:min-w-[148px] px-[30px] rounded-[10px] text-[16px] font-bold text-white leading-none transition-opacity hover:opacity-90"
              style={{ ...fontKr, background: '#1E50E0' }}>
              상담 문의
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
            하단 pb: 2026-09-07 refinement — Hero→Portfolio 전환을 좀 더 빠르게 이어지도록 축소
            (80→56 / 44→36, Portfolio 쪽 pt 축소와 함께 적용. Hero 내부 배치는 불변). */}
        <div className="pt-[112px] lg:pt-[200px] pb-[36px] lg:pb-[56px]">
          {/* 2026-09-07 refinement — wide desktop(1600px+)에서 좌측 headline과 우측 supporting
              copy 사이 gutter가 실측 1000px+ 로 벌어져 두 블록이 "떠 있는" 것처럼 보이던 문제를
              u-content-max(1600px 캡)로 해결. 좌측 시작선(.u-shell)은 그대로 유지. */}
          <div className="u-content-max">
            {/* descriptor + headline 을 하나의 title group 으로 — 간격 좁게, descriptor 는 작은 heading 톤 */}
            <span
              className="inline-flex items-center gap-2 rounded-full mb-4 lg:mb-[18px] text-[11px] lg:text-[12px] font-semibold text-black/80"
              style={{ ...fontKr, letterSpacing: '-0.01em', border: '0.8px solid rgba(0,0,0,0.35)', padding: '3px 12px' }}
            >
              <span className="flex gap-[3px]" aria-hidden>
                <span className="w-[5px] h-[5px] rounded-full" style={{ background: '#4CACE9' }} />
                <span className="w-[5px] h-[5px] rounded-full" style={{ background: '#DB438F' }} />
                <span className="w-[5px] h-[5px] rounded-full" style={{ background: '#FDF251' }} />
                <span className="w-[5px] h-[5px] rounded-full bg-black/80" />
              </span>
              기업·기관 맞춤형 달력 제작 회사
            </span>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 lg:gap-x-8">
              {/* 좌: 큰 2줄 headline — 줄 간격은 line-height로만 (flex gap 미사용). 2026-09-07: wide
                  desktop에서 존재감을 키우기 위해 clamp 상한 66px→80px */}
              <h1
                className="lg:col-span-7 min-w-0 text-black"
                style={{ ...fontKr, fontWeight: 700, fontSize: 'clamp(36px, 5.2vw, 80px)', lineHeight: 1.14, letterSpacing: '-0.025em' }}
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
                    전문 디자이너가
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

// ── 제작 사례 (Portfolio) ────────────────────────────────────────────────────
// [레거시] 이미지에 카테고리 컬러바·업체명이 인쇄된 4:5 썸네일 세트. 현재 렌더에서 제외.
// 데이터 구조 보존용으로만 남겨둔다(§22). 실제 rail 은 아래 PORTFOLIO 를 사용한다.
const EXHIBITIONS: { src: string; name: string; category: '기관' | '기업' | '일러스트' }[] = [
  { src: pf01, name: '한국환경산업기술원',         category: '기관' },
  { src: pf02, name: '아이디어두잇',               category: '기업' },
  { src: pf03, name: 'IMAGINE SEOUL',             category: '일러스트' },
  { src: pf04, name: '한국가스기술공사',           category: '기관' },
  { src: pf05, name: '동아제약',                   category: '기업' },
  { src: pf06, name: '한국수목정원관리원',         category: '일러스트' },
  { src: pf07, name: '대구오페라하우스',           category: '기관' },
  { src: pf08, name: '세종 스포츠',                category: '기업' },
  { src: pf09, name: '2026 일상 캘린더',           category: '일러스트' },
  { src: pf10, name: '상공회의소',                 category: '기관' },
  { src: pf11, name: '이글루코퍼레이션',           category: '기업' },
  { src: pf12, name: '2026 미니 캘린더',           category: '일러스트' },
  { src: pf13, name: '경기도중독관리통합지원센터',  category: '기관' },
  { src: pf14, name: '설빙',                       category: '기업' },
  { src: pf15, name: '함평군농업기술센터',         category: '기관' },
]

// ── 실제 렌더에 쓰는 Portfolio 데이터 ──
// 가로형 원본 사진 1장 + 그 아래 텍스트(카테고리 / 업체명 / 한 줄 설명)로 구성되는 editorial item.
// objectPosition: 사진마다 달력 제품이 잘리지 않는 crop 위치. secondaryImages: 동일 프로젝트의
// 여분 사진(데이터 보존용, 이번 단계 rail 에는 노출하지 않음).
// 순서: 같은 카테고리·같은 업체가 연달아 나오지 않도록 배치(무한 루프 이음새 포함).
type PortfolioItem = {
  src: string
  category: '공공기관' | '기업' | '일러스트'
  title: string
  description: string
  objectPosition?: string
  mediaScale?: number      // 이미지만 확대(검은 여백 축소). hover scale 과 별개 element 라 충돌 없음. 기본 1
  secondaryImages?: string[]
  // Portfolio 전체보기 페이지(/portfolio) 전용 필터 분류. 위 표시용 category 와는 별개 개념 —
  // Landing 카드의 category 는 그대로 두고 이 필드만 추가로 사용한다.
  filterType?: '기업' | '기관'
}
const PORTFOLIO: PortfolioItem[] = [
  { src: hpSanggong, category: '공공기관', title: '대한상공회의소',
    description: '상징 비주얼을 활용한 데스크 캘린더', objectPosition: 'center 50%', mediaScale: 1.55, filterType: '기관' },
  { src: hpIdeadoit, category: '기업', title: '아이디어두잇',
    description: '브랜드 메시지를 담은 오브제형 캘린더', objectPosition: 'center center', filterType: '기업' },
  { src: hpSumok, category: '일러스트', title: '한국수목정원관리원',
    description: '자연의 이미지를 담은 일러스트 캘린더', objectPosition: 'center 51%', mediaScale: 1.5, filterType: '기관' },
  { src: hpDongaDesk, category: '기업', title: '동아쏘시오그룹',
    description: '따뜻한 일러스트로 완성한 데스크 캘린더', objectPosition: 'center center',
    secondaryImages: [hpDongaDiary], filterType: '기업' },
  { src: hpHampyeong, category: '공공기관', title: '함평군농업기술센터',
    description: '전시 작품을 활용한 벽걸이 캘린더', objectPosition: 'center 48%', mediaScale: 1.38, filterType: '기관' },
  { src: hpImagine, category: '일러스트', title: 'IMAGINE SEOUL',
    description: '아트워크 중심의 일러스트 캘린더', objectPosition: 'center center', mediaScale: 1.4, filterType: '기업' },
  { src: hpSejong, category: '기업', title: '세종스포츠정형외과',
    description: '스포츠 테마를 활용한 맞춤형 캘린더', objectPosition: 'center center', filterType: '기업' },
]

const RAIL_PAD = 'u-rail-pad'

function Portfolio({ navigate }: { navigate: (path: string) => void }) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  // 가격 계산과 무관한 UI 전용 ref — 마우스 드래그 상태 (라이브러리 없이 native scrollLeft)
  const drag = useRef({ active: false, startX: 0, startScroll: 0 })
  // 자동 이동 상태 — 전부 rAF + setTimeout + ref 로만 관리 (프레임마다 React rerender 없음).
  const auto = useRef({
    raf: 0, holdTimer: 0, resumeTimer: 0,
    step: 0, loopAt: 0,   // 카드 1장(width+gap) / 원본 세트 1바퀴 거리
    dragging: false, touching: false, cardHover: false, kbFocus: false,
    onDragStart: () => {}, onDragEnd: () => {},
    slideBy: (_dir: 1 | -1) => {},   // prev/next 화살표 → 정확히 카드 1장 이동 (effect 에서 채움)
  })

  // k-artfestival Event&Exhibitions 처럼 "머물렀다가 한 칸씩 넘어가는" editorial 레일.
  //  · continuous marquee 아님 — HOLD(≈1200ms) → SLIDE 정확히 카드 1장(width+gap, ≈700ms, easeOut) → HOLD 반복
  //  · scrollLeft 를 rAF 로 직접 tween → 별도 CSS transition 없음 → 복제 세트 경계에서 loopAt 만큼 즉시 빼서
  //    무한 루프(리셋이 눈에 안 보임)
  //  · drag / touch / trackpad wheel / 카드 hover / 키보드 focus 중에는 정지, 조작 종료 후 딜레이를 두고 재개
  //  · drag·조작 종료 시 가장 가까운 카드로 부드럽게 snap 한 뒤 hold 진입
  //  · prefers-reduced-motion 에서는 자동 이동 없음 (수동 조작만)
  useEffect(() => {
    const el = viewportRef.current
    const track = trackRef.current
    if (!el || !track) return

    const a = auto.current
    // 스냅 완전 제거 — 자동/수동 모두 스크립트가 위치를 관리한다
    el.style.scrollSnapType = 'none'

    const measure = () => {
      const kids = track.children
      const n = PORTFOLIO.length
      if (kids.length < 2) { a.step = 0; a.loopAt = 0; return }
      a.step = (kids[1] as HTMLElement).offsetLeft - (kids[0] as HTMLElement).offsetLeft
      a.loopAt = kids.length > n
        ? (kids[n] as HTMLElement).offsetLeft - (kids[0] as HTMLElement).offsetLeft
        : 0
    }
    measure()

    // transition 없이 정수 scrollLeft 만 이동하므로 loop 경계 보정이 눈에 보이지 않는다.
    const normalize = () => {
      if (a.loopAt <= 0) return
      if (el.scrollLeft >= a.loopAt) el.scrollLeft -= a.loopAt
      else if (el.scrollLeft < 0) el.scrollLeft += a.loopAt
    }
    // 트랙패드/네이티브 스크롤이 멈췄을 때만 경계 보정 (tween·drag 중에는 건드리지 않음)
    const onScroll = () => { if (!a.raf && !a.dragging) normalize() }

    window.addEventListener('resize', measure)
    el.addEventListener('scroll', onScroll, { passive: true })

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      // 자동 이동 없음. 화살표는 즉시 한 칸 이동(애니메이션 없음).
      a.slideBy = (dir: 1 | -1) => {
        measure()
        if (a.step <= 0) return
        const idx = Math.round(el.scrollLeft / a.step)
        el.scrollLeft = (idx + dir) * a.step
        normalize()
      }
      return () => {
        a.slideBy = () => {}
        window.removeEventListener('resize', measure)
        el.removeEventListener('scroll', onScroll)
      }
    }

    const hoverCapable = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const HOLD_MS = 1200
    const SLIDE_MS = 700
    // easeOutCubic — 시작은 빠르고 끝에서 부드럽게 감속, bounce 없음 (≈ cubic-bezier(0.22, 1, 0.36, 1))
    const ease = (p: number) => 1 - Math.pow(1 - p, 3)

    const blocked = () => a.dragging || a.touching || a.cardHover || a.kbFocus
    const clearTimers = () => {
      if (a.holdTimer) { clearTimeout(a.holdTimer); a.holdTimer = 0 }
      if (a.raf) { cancelAnimationFrame(a.raf); a.raf = 0 }
    }
    const clearResume = () => { if (a.resumeTimer) { clearTimeout(a.resumeTimer); a.resumeTimer = 0 } }

    const tween = (to: number, durMs: number, done: () => void) => {
      const from = el.scrollLeft
      if (Math.abs(to - from) < 1) { el.scrollLeft = to; normalize(); done(); return }
      const start = performance.now()
      const frame = (now: number) => {
        if (blocked()) { a.raf = 0; return }
        const p = Math.min(1, (now - start) / durMs)
        el.scrollLeft = from + (to - from) * ease(p)
        if (p < 1) { a.raf = requestAnimationFrame(frame) }
        else { a.raf = 0; normalize(); done() }
      }
      a.raf = requestAnimationFrame(frame)
    }

    const scheduleHold = () => {
      clearTimers()
      if (blocked()) return
      a.holdTimer = window.setTimeout(() => { a.holdTimer = 0; slideOne() }, HOLD_MS)
    }
    const slideOne = () => {
      measure()
      if (blocked() || a.step <= 0) { scheduleHold(); return }
      normalize()
      // 누적 오차 방지: 현재 위치를 카드 격자에 맞춘 다음 정확히 한 칸(step)만 이동
      const idx = Math.round(el.scrollLeft / a.step)
      tween((idx + 1) * a.step, SLIDE_MS, scheduleHold)
    }
    const snapToNearest = (done: () => void) => {
      measure()
      if (a.step <= 0) { done(); return }
      normalize()
      tween(Math.round(el.scrollLeft / a.step) * a.step, 340, done)
    }
    const scheduleResume = (delayMs: number) => {
      clearTimers()
      clearResume()
      a.resumeTimer = window.setTimeout(() => {
        a.resumeTimer = 0
        if (blocked()) return
        snapToNearest(scheduleHold)
      }, delayMs)
    }

    // prev/next 화살표 — 자동 슬라이드와 완전히 같은 rAF easeOut tween 을 정확히 한 칸에 대해 실행.
    a.slideBy = (dir: 1 | -1) => {
      measure()
      if (a.step <= 0) return
      clearTimers()
      clearResume()
      normalize()
      const idx = Math.round(el.scrollLeft / a.step)
      tween((idx + dir) * a.step, SLIDE_MS, () => scheduleResume(1400))
    }

    // ── 카드 이미지 hover ── (hover 중 정지, leave 후 ~1000ms 뒤 재개)
    const onOver = (e: PointerEvent) => {
      if (!(e.target as Element)?.closest?.('[data-card-img]')) return
      a.cardHover = true
      clearTimers(); clearResume()
    }
    const onOut = (e: PointerEvent) => {
      if (!(e.target as Element)?.closest?.('[data-card-img]')) return
      if ((e.relatedTarget as Element | null)?.closest?.('[data-card-img]')) return // 옆 카드로 이동 — 계속 pause
      a.cardHover = false
      scheduleResume(1100)
    }
    if (hoverCapable) {
      track.addEventListener('pointerover', onOver)
      track.addEventListener('pointerout', onOut)
    }

    // ── 수동 wheel / 트랙패드 : manual 우선 ──
    const onWheel = () => {
      if (a.dragging || a.touching) return
      clearTimers()
      scheduleResume(1000)
    }
    el.addEventListener('wheel', onWheel, { passive: true })

    // ── touch : 손대는 동안 정지, 떼면 (desktop 보다 조금 길게) 재개 ──
    const onTouchStart = () => { a.touching = true; clearTimers(); clearResume() }
    const onTouchEnd = () => { a.touching = false; scheduleResume(1500) }
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchend', onTouchEnd, { passive: true })
    el.addEventListener('touchcancel', onTouchEnd, { passive: true })

    // ── 키보드 focus 가 레일 안에 있을 때 ──
    const onFocusIn = () => { a.kbFocus = true; clearTimers(); clearResume() }
    const onFocusOut = () => { a.kbFocus = false; scheduleResume(1000) }
    el.addEventListener('focusin', onFocusIn)
    el.addEventListener('focusout', onFocusOut)

    // ── drag (뷰포트 pointer 드래그) : 최우선. 즉시 정지, 종료 후 ~1400ms 뒤 재개 ──
    a.onDragStart = () => { a.dragging = true; clearTimers(); clearResume() }
    a.onDragEnd = () => { a.dragging = false; scheduleResume(1400) }

    // 최초 진입 : 잠깐 뒤 첫 hold 시작
    a.resumeTimer = window.setTimeout(() => { a.resumeTimer = 0; scheduleHold() }, 600)

    return () => {
      clearTimers()
      clearResume()
      a.onDragStart = () => {}
      a.onDragEnd = () => {}
      a.slideBy = () => {}
      window.removeEventListener('resize', measure)
      el.removeEventListener('scroll', onScroll)
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
    // loop 경계 보정 — startScroll 도 같이 이동시켜 무한 드래그 (auto tick 제거에 따라 여기서 처리)
    const la = auto.current.loopAt
    if (la > 0) {
      if (el.scrollLeft >= la) { el.scrollLeft -= la; drag.current.startScroll -= la }
      else if (el.scrollLeft < 0) { el.scrollLeft += la; drag.current.startScroll += la }
    }
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

  // 절제된 prev/next 컨트롤 — auto 슬라이드와 동일한 tween 으로 정확히 카드 1장 이동.
  // (effect 내부에서 채워지는 auto.slideBy 가 pause/resume·loop 보정까지 처리)
  function nudge(dir: 1 | -1) {
    auto.current.slideBy(dir)
  }

  const fontKr = { fontFamily: 'Noto Sans KR, sans-serif' }

  return (
    <section id="portfolio" className="bg-white pt-[44px] pb-[64px] md:pb-[84px] lg:pt-[92px] lg:pb-[132px]">
      {/* 헤더: 일반 content shell — 좌측 시작선이 첫 카드 시작선과 연결됨. 제목 ↔ 전체보기 같은 라인 */}
      <div className={SHELL}>
        <div id="portfolio-scroll-target" className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 min-w-0">
            <h2
              className="text-black"
              style={{ fontFamily: 'Noto Sans KR, sans-serif', fontWeight: 700, fontSize: 'clamp(26px, 4.1vw, 66px)', lineHeight: 1.15, letterSpacing: '-0.025em' }}
            >
              제작 사례
            </h2>
            <span className="t-caption text-black/45">Portfolio</span>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            {/* prev/next — 데스크톱 전용, hairline circle. 모바일은 스와이프에 위임 */}
            <div className="hidden lg:flex items-center gap-2">
              <button
                type="button" onClick={() => nudge(-1)} aria-label="이전 제작 사례"
                className="w-9 h-9 rounded-full border border-black/20 flex items-center justify-center text-black/55 hover:text-black hover:border-black/45 transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden><path d="M7.5 2.5 4 6l3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <button
                type="button" onClick={() => nudge(1)} aria-label="다음 제작 사례"
                className="w-9 h-9 rounded-full border border-black/20 flex items-center justify-center text-black/55 hover:text-black hover:border-black/45 transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden><path d="M4.5 2.5 8 6l-3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            </div>
            <button
              type="button"
              onClick={() => navigate('/portfolio')}
              className="t-caption text-black/45 hover:text-black transition-colors"
            >
              포트폴리오 전체보기 ›
            </button>
          </div>
        </div>
      </div>

      {/*
        풀-width 가로 레일. overflow는 이 요소 안에서만 발생 → page 가로 밀림 없음.
        트랙 좌우 padding = u-shell 값이라 첫 카드가 제목 시작선과 연결된다.
        조작: 네이티브 가로 스크롤(트랙패드) · 터치 스와이프 · 마우스 드래그.
        + step carousel: HOLD(≈1200ms) → 카드 1장 SLIDE(≈700ms, easeOut) → HOLD 반복 (continuous 아님).
          카드 hover / drag / touch / 수동 wheel / 키보드 focus 중 정지 → 조작 종료 후 딜레이 뒤 재개.
          복제 세트 기반 무한 루프(경계에서 scrollLeft 즉시 보정 → 리셋 비가시).
          prefers-reduced-motion 에서는 자동 이동 없음(수동 조작만), hover scale 도 비활성.
        scroll-snap 은 제거. 카드 상단·그림자가 잘리지 않도록 트랙에 상·하 padding.
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
        className="mt-1 lg:mt-[20px] [&::-webkit-scrollbar]:hidden">
        <div
          ref={trackRef}
          className={`flex ${RAIL_PAD}`}
          style={{ gap: 'clamp(20px, 2.4vw, 34px)', paddingTop: '44px', paddingBottom: '32px' }}
        >
          {/* PORTFOLIO(7개)를 그대로. seamless loop 를 위해 render layer 에서만 한 번 더 그리고,
              복제 세트(clone)는 스크린리더 중복 방지를 위해 aria-hidden 처리. */}
          {[...PORTFOLIO, ...PORTFOLIO].map((item, i) => (
            <figure
              key={i}
              data-card=""
              aria-hidden={i >= PORTFOLIO.length ? true : undefined}
              className="shrink-0 m-0"
              style={{ width: 'clamp(330px, 40vw, 600px)' }}
            >
              {/* 큰 가로 이미지가 hero. hover transform 은 .pf-card(wrapper) 에, mediaScale 은 <img> 에
                  걸어 서로 다른 element 에서 처리 → 충돌 없음(hover 시 두 scale 이 자연히 곱해짐).
                  아래 텍스트 영역은 wrapper 밖이라 움직이지 않는다. 무거운 카드 박스/보더 없음. */}
              <div
                data-card-img=""
                className="pf-card overflow-hidden rounded-[10px] bg-black/[0.04]"
                style={{ aspectRatio: '4 / 3' }}
              >
                <img
                  src={item.src}
                  alt={`${item.title} · ${item.category} 캘린더 제작 사례`}
                  draggable={false}
                  loading={i < 3 ? 'eager' : 'lazy'}
                  decoding="async"
                  className="w-full h-full object-cover select-none pointer-events-none"
                  style={{
                    objectPosition: item.objectPosition ?? 'center center',
                    transform: item.mediaScale && item.mediaScale !== 1 ? `scale(${item.mediaScale})` : undefined,
                  }}
                />
              </div>
              <figcaption className="mt-4 lg:mt-5">
                <p className="text-[13px] font-medium tracking-[0.02em] text-black/45" style={fontKr}>{item.category}</p>
                <h3
                  className="mt-1.5 text-black"
                  style={{ ...fontKr, fontWeight: 700, fontSize: 'clamp(19px, 1.6vw, 24px)', lineHeight: 1.25, letterSpacing: '-0.02em' }}
                >
                  {item.title}
                </h3>
                <p
                  className="mt-2 text-black/55 break-keep"
                  style={{ ...fontKr, fontWeight: 400, fontSize: 'clamp(14px, 1.05vw, 16px)', lineHeight: 1.6 }}
                >
                  {item.description}
                </p>
              </figcaption>
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
        <span className="block text-[13.5px] text-ink-light/70 mt-1 leading-[1.55] break-keep" style={CFG_KR}>{t.subtitle}</span>
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

// 베이직 전용 '표지 스타일' 선택과 연동되는 예시 사진 2장 preview.
// styleKey 가 바뀌면 짧게 fade-out 한 뒤, 새 이미지 2장이 아래에서 살짝 올라오며
// fade-in 한다(두 번째 이미지가 첫 번째보다 살짝 늦게 등장). prefers-reduced-motion 이면
// 애니메이션 없이 즉시 전환한다. 사진이 없는 슬롯은 중립 placeholder 로 대체된다.
function CoverStylePreview({ styleKey }: { styleKey: CoverStyleKey | null }) {
  const [displayKey, setDisplayKey] = useState<CoverStyleKey | null>(styleKey)
  const [phase, setPhase] = useState<'in' | 'out'>('in')
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    if (styleKey === displayKey) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setDisplayKey(styleKey)
      setPhase('in')
      return
    }
    setPhase('out')
    if (timerRef.current) window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => {
      setDisplayKey(styleKey)
      setPhase('in')
    }, 110)
    return () => { if (timerRef.current) window.clearTimeout(timerRef.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [styleKey])

  const fontKr = { fontFamily: 'Noto Sans KR, sans-serif' }
  const images = displayKey ? COVER_STYLE_PREVIEWS[displayKey] : null

  return (
    <div className="mt-4">
      <p className="mb-2.5 text-[11px] font-medium text-ink-light/50" style={fontKr}>표지 스타일 예시</p>
      {!images ? (
        <div
          className="flex items-center justify-center text-center"
          style={{
            aspectRatio: '16 / 7',
            background: '#FAFAF8',
            border: '1px solid rgba(26,26,26,0.10)',
          }}
        >
          <span className="text-[12px] text-ink-light/40 px-4 break-keep" style={fontKr}>
            표지 스타일을 선택하면 예시 이미지가 표시됩니다
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {images.map((src, i) => (
            <div
              key={i}
              className="overflow-hidden"
              style={{
                aspectRatio: '4 / 5',
                background: '#FAFAF8',
                border: '1px solid rgba(26,26,26,0.10)',
                opacity: phase === 'in' ? 1 : 0,
                transform: phase === 'in' ? 'translateY(0)' : 'translateY(8px)',
                transition: phase === 'in'
                  ? `opacity 260ms ${CFG_EASE} ${i * 60}ms, transform 260ms ${CFG_EASE} ${i * 60}ms`
                  : `opacity 110ms ${CFG_EASE}, transform 110ms ${CFG_EASE}`,
              }}
            >
              {src ? (
                <img src={src} alt="" className="w-full h-full object-cover" draggable={false} />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-[11.5px] text-ink-light/40" style={fontKr}>
                    예시 이미지 {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
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

  // ── configurator UI state (표시 전용, 계산과 분리) ──
  const [openStep, setOpenStep] = useState<string | null>('tier')
  const stepRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const d = TIER_DATA[tier]

  // 견적 합계 = 등급 breakdown 합 (옵션·보조 선택은 금액에 반영되지 않는다).
  const total = d.breakdown.reduce((a, b) => a + b.value, 0)
  const animatedTotal = useAnimatedNumber(total)

  // Returns null when user has not yet selected this option
  function getOptIdx(label: string): number | null {
    const tierOpts = optIdx[tier] ?? {}
    return label in tierOpts ? (tierOpts[label] ?? null) : null
  }

  const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '.')

  // ── 공통 numbered step: 01 제작 등급 → 02 사이즈 → 03 내지 레이아웃 (모든 tier 동일) ──
  // 표지 스타일은 numbered step 이 아닌 베이직 전용 보조 옵션으로만 노출한다.
  const SUPPLEMENTARY_GROUPS = ['표지 스타일']
  type StepKind = 'tier' | 'option'
  type StepDef = { key: string; label: string; kind: StepKind; group?: string }
  const optionGroups = d.options ? Object.keys(d.options).filter(g => !SUPPLEMENTARY_GROUPS.includes(g)) : []
  const steps: StepDef[] = [
    { key: 'tier', label: '제작 등급', kind: 'tier' },
    ...optionGroups.map(g => ({ key: `option:${g}`, label: g, kind: 'option' as StepKind, group: g })),
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
    const firstGroup = nd.options
      ? Object.keys(nd.options).filter(g => !SUPPLEMENTARY_GROUPS.includes(g))[0]
      : null
    openAndScroll(firstGroup ? `option:${firstGroup}` : null)
  }

  function handleOption(group: string, i: number) {
    setOptIdx(prev => ({ ...prev, [tier]: { ...(prev[tier] ?? {}), [group]: i } }))
    advanceFrom(`option:${group}`)
  }

  // 베이직 전용 보조 옵션 — 표지 스타일. numbered step 이 아니므로 다음 단계로 자동 이동하지 않는다.
  const coverStyles = d.options?.['표지 스타일'] ?? null
  function handleCoverStyle(i: number) {
    setOptIdx(prev => ({ ...prev, [tier]: { ...(prev[tier] ?? {}), ['표지 스타일']: i } }))
  }
  // 왼쪽 preview 영역과 연동되는 key. 별도 state 없이 기존 '표지 스타일' 선택값에서만 파생한다.
  const coverStyleSelectedLabel = (() => {
    if (!coverStyles) return null
    const ix = getOptIdx('표지 스타일')
    return ix !== null ? coverStyles[ix] : null
  })()
  const coverStyleKey: CoverStyleKey | null = coverStyleSelectedLabel
    ? (COVER_STYLE_TO_KEY[coverStyleSelectedLabel] ?? null)
    : null

  // 베이직 전용 보조 옵션 — 종이 사양. 표지 스타일과 동일하게 numbered step 이 아니며,
  // 가격에는 반영되지 않는 consultation 전달용 선택값이다.
  const [paperType, setPaperType] = useState<PaperType>('undecided')

  function stepState(s: StepDef): { done: boolean; selectedLabel: string | null; hint: string; count: string } {
    if (s.kind === 'tier') return { done: true, selectedLabel: d.name, hint: '', count: '1/1' }
    const ix = getOptIdx(s.group!)
    const sel = ix !== null && d.options ? d.options[s.group!][ix] : null
    return { done: sel !== null, selectedLabel: sel, hint: '옵션을 선택해주세요', count: sel !== null ? '1/1' : '0/1' }
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
              style={{ fontFamily: 'Noto Sans KR, sans-serif', fontWeight: 700, fontSize: 'clamp(28px, 3.7vw, 48px)', lineHeight: 1.1, letterSpacing: '-0.025em' }}
            >
              달력 견적 계산기
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
          </div>

          {coverStyles && <CoverStylePreview styleKey={coverStyleKey} />}
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
                </AccordionRow>
              )
            })}
          </div>

          {/* 베이직 전용 보조 옵션 — 표지 스타일 / 종이 사양. numbered step(01·02·03)보다 한 단계 낮은 위계.
              커스텀 / 하이앤드에는 '표지 스타일' 옵션이 없으므로 이 블록 자체가 렌더되지 않는다.
              데스크톱에서는 두 그룹을 좌우로, 좁은 화면에서는 세로로 쌓는다. */}
          {coverStyles && (
            <div className="mt-8 pt-8 border-t border-ink/15 flex flex-col lg:flex-row gap-8 lg:gap-16">
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-5">
                  <span className="text-[11px] font-bold text-ink" style={fontKr}>추가 선택 · 표지 스타일</span>
                  <span className="text-[10.5px] text-ink-light/45" style={fontKr}>베이직 전용</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {coverStyles.map((opt, oi) => {
                    const on = getOptIdx('표지 스타일') === oi
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleCoverStyle(oi)}
                        className="flex items-center gap-2.5 text-left"
                        style={{
                          padding: '15px 20px',
                          borderRadius: '0px',
                          border: on ? CFG_SEL_BORDER : CFG_REST_BORDER,
                          background: on ? CFG_SEL_BG : '#ffffff',
                          transition: `border-color 160ms ${CFG_EASE}, background 160ms ${CFG_EASE}`,
                        }}
                        onMouseEnter={e => { if (!on) (e.currentTarget as HTMLButtonElement).style.borderColor = CFG_HOVER_BORDER }}
                        onMouseLeave={e => { if (!on) (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(26,26,26,0.18)' }}
                      >
                        <span className="text-[13px] font-medium text-ink break-keep" style={fontKr}>{opt}</span>
                        <CheckDisc on={on} />
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-5">
                  <span className="text-[11px] font-bold text-ink" style={fontKr}>추가 선택 · 종이 사양</span>
                  <span className="text-[10.5px] text-ink-light/45" style={fontKr}>베이직 전용</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {PAPER_TYPE_OPTIONS.map(({ id, label }) => {
                    const on = paperType === id
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setPaperType(id)}
                        className="flex items-center gap-2.5 text-left"
                        style={{
                          padding: '15px 20px',
                          borderRadius: '0px',
                          border: on ? CFG_SEL_BORDER : CFG_REST_BORDER,
                          background: on ? CFG_SEL_BG : '#ffffff',
                          transition: `border-color 160ms ${CFG_EASE}, background 160ms ${CFG_EASE}`,
                        }}
                        onMouseEnter={e => { if (!on) (e.currentTarget as HTMLButtonElement).style.borderColor = CFG_HOVER_BORDER }}
                        onMouseLeave={e => { if (!on) (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(26,26,26,0.18)' }}
                      >
                        <span className="text-[13px] font-medium text-ink break-keep" style={fontKr}>{label}</span>
                        <CheckDisc on={on} />
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 진행 조건 — numbered row + divider 로 정돈된 정보 영역 (문구 변경 없음) */}
          <div className="mt-10 pt-8 border-t border-ink/15">
            <span className="text-[11px] font-bold text-ink-light/55 block mb-2" style={fontKr}>진행 조건</span>
            <ul className="flex flex-col">
              {d.rules.map((rule, i) => (
                <li key={i} className="flex items-start gap-5 py-5 border-t border-ink/10 first:border-t-0">
                  <span className="text-[11px] text-ink-light/40 tabular-nums shrink-0 pt-0.5" style={fontKr}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-[13.5px] text-ink-light/70 leading-[1.85] break-keep" style={fontKr}>{rule}</span>
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
            <span className="text-[11px] font-medium text-ink-light/50" style={fontKr}>선택 등급</span>
            <span className="text-[14px] font-bold text-ink" style={fontKr}>{d.name}</span>
            {summaryChips.length > 0 && (
              <span className="text-[12px] text-ink-light/55 break-keep" style={fontKr}>{summaryChips.join(' · ')}</span>
            )}
          </div>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-6 lg:shrink-0">
            <div className="flex items-baseline gap-2">
              <span className="text-[11px] font-medium text-ink-light/50" style={fontKr}>현재 예상 견적</span>
              <span className="font-bold tabular-nums text-ink" style={{ ...fontKr, fontSize: 'clamp(20px, 3.4vw, 26px)' }}>
                {wonFmt(animatedTotal)}<small className="text-[13px] font-semibold ml-0.5">원</small>
              </span>
            </div>

            <button
              onClick={onConsult}
              className="w-full lg:w-auto inline-flex items-center justify-center px-8 lg:px-10 py-4 lg:py-[17px] text-white transition-opacity hover:opacity-90"
              style={{ borderRadius: '999px', background: '#1A1A1A', fontSize: 'clamp(15px, 1.4vw, 18px)', fontWeight: 700, ...fontKr }}
            >
              이 견적으로 상담 신청하기 →
            </button>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <p className="text-[10.5px] text-ink-light/50" style={fontKr}>
            부가세.인쇄.배송비 별도<br />
            최종 견적은 상담 후 확정됩니다.
          </p>
          <p className="text-[10.5px] text-ink-light/40 shrink-0 tabular-nums" style={fontKr}>기준일 {todayStr}</p>
        </div>
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
// 실제 공식 로고 asset + 통일된 monochrome block system. 원본 파일/색상은 그대로 두고,
// 화면에서만 CSS filter(.cl-logo, index.css: brightness(0) + opacity)로 모든 로고를 같은
// 짙은 gray 톤으로 통일한다 — brightness(0)은 원본 hue/명도와 무관하게 모든 로고를 동일한
// "검정 실루엣"으로 만들어, 브랜드별로 톤이 갈리는 문제를 원천적으로 막는다.
// scale: 로고마다 원본 캔버스 여백이 달라 동일 height로 맞춰도 체감 크기가 다르기 때문에 두는
// 표시 전용 보정값(기본 1). 실제 내용이 캔버스 대부분을 차지하는 로고는 1, 캔버스에 여백이 큰
// 로고(대한상공회의소·이글루코퍼레이션)만 확대해 시각 밀도를 맞춘다.
type ClientLogo = {
  name: string
  src?: string
  scale?: number
  // 이글루코퍼레이션 전용 — 원본 SVG에 불투명 흰 배경 사각형이 내장돼 있어 brightness(0) 대신
  // blend-mode 로 흰 배경만 지운다(위 .cl-logo-blend 참고)
  blend?: boolean
  // 아이디어두잇 전용 — 공식 사이트가 idea/doit 두 asset으로 나눠 쓰는 로고를 한 셀에서 조합
  ideaSrc?: string
  doitSrc?: string
}
const CLIENTS: ClientLogo[] = [
  // 1행 = 기관, 2행 = 기업, 3행 = 나머지(순서 요청대로)
  { name: '함평군 농업기술센터',       src: clHampyeong,    scale: 1 },
  { name: '한국수목원정원관리원',       src: clKoagi,        scale: 1.15 },
  { name: '대한상공회의소',           src: clKorcham,      scale: 1.7 },
  { name: '경기도중독관리통합지원센터', src: clGcamc,        scale: 1 },
  { name: '아이디어두잇',             ideaSrc: clIdeadoitIdea, doitSrc: clIdeadoitDoit },
  { name: '설빙',                   src: clSulbing,      scale: 1 },
  { name: '동아제약',                src: clDongaPharm,   scale: 1 },
  { name: '이글루코퍼레이션',          src: clIgloo,        scale: 1.8, blend: true },
  { name: '한국가스기술공사',          src: clKogasTech,    scale: 1 },
  { name: '한국환경산업기술원',        src: clKeiti,        scale: 1 },
  { name: '세종스포츠정형외과',        src: clSejongSports, scale: 1 },
  { name: '대구오페라하우스',          src: clDaeguOpera,   scale: 1, blend: true },
]

// ── CERTIFICATIONS ────────────────────────────────────────────────────────────
// 원본 확인: 산업디자인 전문분야 종합(시각·제품·포장), 여성기업, 직접생산 3종.
// 출판물은 원본의 대분류명이며, 뒷면에 있는 세부품명·유효기간은 여기서 추정하지 않는다.
const CORE_CERTIFICATIONS = [
  { src: certIndustrial, label: '산업디자인전문회사', scope: '(종합)', alt: '산업디자인전문회사 신고확인증 — 전문분야 종합', description: '시각·제품·포장디자인', note: '' },
  { src: certWomenOwned, label: '여성기업확인서', scope: '', alt: '여성기업 확인서', description: '추정가격 5천만원 이하\n1인 견적 수의계약 가능 범위', note: '관련 법령 및 계약 조건에 따름' },
]
const PRODUCTION_CERTIFICATIONS = [
  { src: certCalendar, label: '달력' },
  { src: certPublishing, label: '출판물' },
  { src: certDesignSvc, label: '디자인서비스' },
]
function CertificationSection() {
  const fontKr = { fontFamily: 'Noto Sans KR, sans-serif' }
  return (
    <section className="bg-white u-section-sm">
      <div className={SHELL}>
        <div className="max-w-[680px] mx-auto text-center flex flex-col items-center gap-3">
          <span
            className="inline-flex items-center gap-2 rounded-full text-[11px] font-semibold text-black uppercase"
            style={{ ...fontKr, border: '0.8px solid #1A1A1A', padding: '3px 12px', letterSpacing: '0.08em' }}
          >
            <span className="flex gap-[3px]" aria-hidden>
              <span className="w-[6px] h-[6px] rounded-full" style={{ background: '#4CACE9' }} />
              <span className="w-[6px] h-[6px] rounded-full" style={{ background: '#DB438F' }} />
              <span className="w-[6px] h-[6px] rounded-full" style={{ background: '#FDF251' }} />
              <span className="w-[6px] h-[6px] rounded-full" style={{ background: '#1A1A1A' }} />
            </span>
            CERTIFIED
          </span>
          <h2
            className="text-black lg:whitespace-nowrap break-keep"
            style={{ ...fontKr, fontWeight: 700, fontSize: 'clamp(24px, 3.2vw, 40px)', lineHeight: 1.3, letterSpacing: '-0.025em' }}
          >
            검증된 자격으로 달력을 제작합니다
          </h2>
          <p className="t-body text-black/55 lg:whitespace-nowrap break-keep">
            공공기관과 기업 협업에 필요한 인증을 바탕으로 서비스를 제공합니다
          </p>
        </div>

        <div className="mt-8 lg:mt-12 grid gap-8 lg:grid-cols-[2fr_3fr] lg:gap-10" style={fontKr}>
          <div className="min-w-0">
            <h3 className="text-[18px] lg:text-[22px] font-bold text-black mb-5">주요 인증 및 자격</h3>
            <div className="grid grid-cols-2 gap-3 lg:gap-5">
              {CORE_CERTIFICATIONS.map(c => (
                <figure key={c.label} className="min-w-0">
                  <div className="bg-[#FAFAF7] border border-black/[0.06] p-2 lg:p-4">
                    <img src={c.src} alt={c.alt} className="w-full h-[180px] sm:h-[220px] lg:h-[260px] object-contain" loading="lazy" />
                  </div>
                  <figcaption className="mt-3">
                    <h4 className="flex items-baseline gap-1 whitespace-nowrap overflow-hidden text-ellipsis text-[13.5px] lg:text-[18px] leading-[1.4] font-bold text-black tracking-[-0.01em]">
                      <span>{c.label}</span>
                      {c.scope && <span className="font-semibold text-black/50">{c.scope}</span>}
                    </h4>
                    <p className="mt-2 text-[12px] lg:text-[13px] leading-[1.65] text-black/70 break-keep whitespace-pre-line">{c.description}</p>
                    {c.note && <p className="mt-1 text-[11px] leading-[1.6] text-black/55 break-keep">{c.note}</p>}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
          <div className="min-w-0 border-t border-black/15 pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
            <h3 className="text-[18px] lg:text-[22px] font-bold text-black mb-5">직접생산확인증명서</h3>
            <div className="grid grid-cols-3 gap-3 lg:gap-5">
              {PRODUCTION_CERTIFICATIONS.map(c => (
                <figure key={c.label} className="min-w-0">
                  <div className="bg-[#FAFAF7] border border-black/[0.06] p-1 lg:p-4">
                    <img src={c.src} alt={`직접생산확인증명서 (${c.label})`} className="w-full h-[128px] sm:h-[200px] lg:h-[260px] object-contain" loading="lazy" />
                  </div>
                  <figcaption className="mt-3">
                    <h4 className="font-bold text-black text-[14px] lg:text-[18px] leading-[1.5] break-keep">{c.label}</h4>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Clients() {
  const fontKr = { fontFamily: 'Noto Sans KR, sans-serif' }
  return (
    <section className="bg-white u-section">
      {/* .cl-logo(index.css)가 참조하는 alpha threshold filter — 화면에 그려지지 않는 정의 전용 SVG */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden>
        <filter id="cl-mono-alpha-cut">
          <feComponentTransfer>
            <feFuncA type="discrete" tableValues="0 0 0 0 0 1 1 1 1 1" />
          </feComponentTransfer>
        </filter>
      </svg>
      <div className={SHELL}>
        <div className="flex flex-col gap-2">
          <h2
            className="text-black"
            style={{ ...fontKr, fontWeight: 700, fontSize: 'clamp(26px, 4.1vw, 66px)', lineHeight: 1.15, letterSpacing: '-0.025em' }}
          >
            Clients
          </h2>
          <p className="t-body text-black/50">기업과 기관의 달력 제작을 함께해왔습니다.</p>
        </div>

        <div className="mt-8 lg:mt-10 grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {CLIENTS.map(c => (
            <div
              key={c.name}
              className="h-[112px] lg:h-[152px] rounded-[8px] bg-black/[0.035] flex items-center justify-center overflow-hidden px-6 lg:px-8"
            >
              {c.ideaSrc && c.doitSrc ? (
                <div className="flex items-center gap-2 lg:gap-2.5 h-full w-full justify-center">
                  <img src={c.ideaSrc} alt={c.name} className="cl-logo h-full w-auto object-contain" style={{ maxWidth: '46%' }} />
                  <img src={c.doitSrc} alt="" className="cl-logo h-full w-auto object-contain" style={{ maxWidth: '46%' }} />
                </div>
              ) : (
                <img
                  src={c.src}
                  alt={c.name}
                  className={`${c.blend ? 'cl-logo-blend' : 'cl-logo'} max-w-full max-h-full w-auto h-auto object-contain`}
                  style={c.scale && c.scale !== 1 ? { transform: `scale(${c.scale})` } : undefined}
                />
              )}
            </div>
          ))}
        </div>
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
    q: '터치어그래픽만의 차별점이 있나요?',
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
    <div className="border-b border-white/20">
      <button
        type="button"
        id={`faq-btn-${index}`}
        aria-expanded={isOpen}
        aria-controls={`faq-panel-${index}`}
        onClick={onToggle}
        className="faq-q group w-full flex items-start justify-between gap-6 py-5 lg:py-6 text-left cursor-pointer"
      >
        <span
          className="min-w-0 text-white"
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
            className="max-w-[820px] pb-5 lg:pb-6"
            style={{ ...FAQ_KR, fontWeight: 400, fontSize: 'clamp(15px, 1vw, 16px)', lineHeight: 1.8, color: 'rgba(255,255,255,0.7)' }}
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

  // 사이트의 마지막 섹션 — 제거된 Contact 의 full-width black 몰입/마무리 역할을 이어받는다.
  // 배경은 Contact 와 동일한 bg-black. 상·하 padding 을 늘려 "마지막 장면" 여백을 확보한다.
  return (
    <section id="faq" className="bg-black text-white pt-[64px] lg:pt-[112px] pb-[100px] lg:pb-[160px] scroll-mt-24">
      {/* wide layout — 위 Estimator 와 동일한 SHELL 폭을 그대로 사용 (질문/divider/아이콘 = wide) */}
      <div className={SHELL}>
        {/* 상단 label — orange dot + text (#FF2D16) 유지 */}
        <div className="flex items-center gap-2.5 mb-5">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#FF2D16' }} aria-hidden />
          <span style={{ ...FAQ_KR, fontWeight: 700, fontSize: '14px', letterSpacing: '-0.01em', color: '#FF2D16' }}>자주 묻는 질문</span>
        </div>

        {/* headline — 검정 배경 대비 white */}
        <h2
          className="text-white"
          style={{ ...FAQ_KR, fontWeight: 800, fontSize: 'clamp(30px, 3.6vw, 56px)', lineHeight: 1.15, letterSpacing: '-0.035em' }}
        >
          궁금한 점.
        </h2>

        {/* accordion — 첫 줄 위에도 hairline. 답변 <p> 만 readable width 로 제한 */}
        <div className="mt-8 lg:mt-10 border-t border-white/20">
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

        {/* FAQ → copyright 전환용 secondary CTA. 빠른상담(Header)보다 낮은 위계로 outline 스타일만 사용 */}
        <a
          href="https://www.touchagraphic.com/main/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 lg:mt-12 inline-flex w-full sm:w-auto items-center justify-center gap-2 border border-white/40 px-7 py-4 text-[14px] font-medium text-white hover:bg-white hover:text-black transition-colors"
          style={FAQ_KR}
        >
          터치 본 홈페이지 바로가기 →
        </a>

        {/* 사이트 최하단 — 제거된 Contact 에 있던 copyright 를 절제된 형태로만 유지 (새 정보 추가 없음) */}
        <p className="mt-8 lg:mt-10 text-[11px] text-white/30 font-mono">
          © 2026 터치어그래픽 · TOUCHGRAPHIC
        </p>
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


// ── Portfolio 전체보기 페이지 (/portfolio) ──────────────────────────────────────
// 사례가 많지 않으므로 3열 썸네일 grid 대신 "작품 1개 = 큰 section 1개" 세로형
// editorial feed 로 구성한다. 데이터는 Landing Portfolio 와 같은 PORTFOLIO 를 그대로 재사용하고,
// 표시 순서만 filterType 기준으로 걸러낸다(원본 데이터·이미지·category 는 변경하지 않음).
const PORTFOLIO_FILTERS = ['전체', '기업', '기관'] as const
type PortfolioFilter = (typeof PORTFOLIO_FILTERS)[number]

// Gallery hover panel accent — 표시 전용, PORTFOLIO 데이터/타입은 건드리지 않고 index 로 순환 배정.
// 원본 터치어그래픽 영상에서 확인된 cyan / mustard / magenta / charcoal 4색을 반복 사용한다.
const PF_ACCENTS = ['#16B8E6', '#ECA900', '#F50076', '#2A2A2A']
function pfRgba(hex: string, alpha: number) {
  const n = parseInt(hex.slice(1), 16)
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function PortfolioPage({ navigate }: { navigate: (path: string, opts?: { scrollTo?: string }) => void }) {
  const [filter, setFilter] = useState<PortfolioFilter>('전체')
  const fontKr = { fontFamily: 'Noto Sans KR, sans-serif' }

  // 2026-09-07: 임시 7개 랜딩용 PORTFOLIO 대신 기존 Touchgraphic Calendar Portfolio 실제 17개
  // (CALENDAR_PORTFOLIO)로 교체. 원본에 기업/기관 분류 metadata가 없어 필터를 임의로 적용하지
  // 않는다 — 버튼 UI는 그대로 두되(파괴적 변경 금지) "전체" 기준으로 17개가 항상 노출된다.
  // 실제 기업/기관 분류가 필요하면 별도 데이터 결정이 필요하다(최종 보고 참고).
  const items = CALENDAR_PORTFOLIO
    .map((item, i) => ({ item, index: i }))

  return (
    <div className="min-h-screen bg-white">
      <Header page="portfolio" navigate={navigate} />

      {/* Hero — 이미지·장식 없이 넓은 whitespace 와 타이포그래피만으로 구성 */}
      <section className="bg-white">
        <div className={SHELL}>
          <div className="pt-[140px] lg:pt-[236px] pb-[40px] lg:pb-[56px]">
            <p
              className="mb-4 lg:mb-6 text-[11px] lg:text-[12px] font-semibold tracking-[0.22em] uppercase text-black/45"
              style={{ fontFamily: 'Courier New, monospace' }}
            >
              Portfolio
            </p>
            <h1
              className="text-black"
              style={{ ...fontKr, fontWeight: 700, fontSize: 'clamp(34px, 6vw, 84px)', lineHeight: 1.18, letterSpacing: '-0.03em' }}
            >
              달력으로 완성한<br />브랜드의 장면들.
            </h1>
          </div>

          {/* Category filter — 정확히 3개, 즉시 client-side 필터(새로고침 없음) */}
          <div className="pb-[20px] lg:pb-[28px] flex items-center gap-2.5">
            {PORTFOLIO_FILTERS.map(f => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className="h-[42px] px-6 rounded-full text-[14px] font-semibold transition-colors leading-none"
                style={{
                  ...fontKr,
                  background: filter === f ? '#1A1A1A' : '#FFFFFF',
                  color: filter === f ? '#FFFFFF' : '#1A1A1A',
                  border: filter === f ? '1px solid #1A1A1A' : '1px solid rgba(0,0,0,0.16)',
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery — 기존 터치어그래픽 Portfolio(touchagraphic.com/portfolio) 의 촘촘한 4열 wall presentation을
          직접 재현. 각 tile 은 검은 studio 배경 그대로 두고 object-fit: contain 으로 작품 전체를 보여준다
          (landing rail 전용 objectPosition/mediaScale/cover crop 은 이 페이지에서 override 하여 쓰지 않는다 —
          PORTFOLIO 데이터 자체는 건드리지 않는다). hairline 은 grid wrapper 배경이 아니라 각 tile 자체의 얇은
          border로 만든다 — wrapper에 배경을 두면 (7개라 비는) 마지막 빈 셀까지 회색으로 칠해지기 때문에 쓰지
          않는다. wrapper 자체는 항상 투명(=페이지 white)이라 빈 셀은 그냥 흰 배경으로 보인다.
          폭: Hero/filter는 .u-shell(contained) 그대로 두고, gallery만 .u-gallery-wide로 breakout —
          같은 width system을 강제로 맞추지 않고 "contained intro → wide wall" 위계를 준다. */}
      <section className="bg-white pb-[100px] lg:pb-[160px]">
        <div className="u-gallery-wide">
          <div className="pt-[44px] lg:pt-[48px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-8 lg:gap-y-0 gap-x-0 pf-feed-item">
            {items.map(({ item, index }) => {
              const accent = PF_ACCENTS[index % PF_ACCENTS.length]
              const meta = item.company ?? item.category
              return (
                <button
                  key={item.idx}
                  type="button"
                  onClick={() => navigate(`/portfolio/${item.idx}`)}
                  className="block w-full text-left cursor-pointer"
                >
                  <div className="group relative overflow-hidden bg-black border border-white/[0.22]" style={{ aspectRatio: '3 / 2' }}>
                    <img
                      src={item.thumbnail.src}
                      alt={item.title}
                      width={item.thumbnail.width}
                      height={item.thumbnail.height}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-contain object-center"
                    />
                    {/* hover panel — 기본은 카드 아래로 완전히 내려가 있다가(translate-y-full) hover 시 위로 슬라이드.
                        데스크톱 전용(lg:group-hover) — 터치 tap 에는 반응하지 않아 모바일에서 어색하게 붙잡히지 않는다.
                        4열로 tile 이 작아진 만큼 typography/padding 도 축소했다. */}
                    <div
                      className="absolute inset-0 hidden lg:flex flex-col items-center justify-center text-center px-4
                                 translate-y-full lg:group-hover:translate-y-0
                                 transition-transform duration-[260ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
                      style={{ backgroundColor: pfRgba(accent, 0.9) }}
                    >
                      <span
                        className="text-white"
                        style={{ fontFamily: 'Noto Sans KR, sans-serif', fontWeight: 600, fontSize: 'clamp(15px, 1.3vw, 19px)', letterSpacing: '-0.02em' }}
                      >
                        {item.title}
                      </span>
                      <span className="text-white/50 my-1.5 leading-none text-[12px]" aria-hidden>+</span>
                      <span
                        className="text-white/80"
                        style={{ fontFamily: 'Noto Sans KR, sans-serif', fontWeight: 400, fontSize: '11px', letterSpacing: '0.01em' }}
                      >
                        {meta}
                      </span>
                    </div>
                  </div>

                  {/* mobile/tablet 전용 — hover 가 없으므로 tile 아래 기본 텍스트를 노출 */}
                  <div className="lg:hidden pt-3">
                    <span className="t-caption text-black/45">{meta}</span>
                    <h3
                      className="text-black mt-0.5"
                      style={{ fontFamily: 'Noto Sans KR, sans-serif', fontWeight: 700, fontSize: '19px', letterSpacing: '-0.02em' }}
                    >
                      {item.title}
                    </h3>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}

// ── Portfolio 상세 페이지 (/portfolio/:idx) ──────────────────────────────────────
// 기존 Touchgraphic 상세페이지(pf_detail.html)의 핵심 presentation을 이식:
//   - 검은 배경 위에 이미지가 순서대로 edge-to-edge full-bleed로 쌓이는 구조(가로 여백 없음,
//     crop/stretch 없음, width 100% / height auto, 이미지 사이 얇은 hairline)
//   - 상단에 프로젝트 제목 + category/date/company 정보(원본에 있는 정보만 사용, 새 카피 없음)
//   - 원본의 세로 텍스트 사이드바(About/Works/Contact 등 global nav 포함)는 그대로 복제하지
//     않는다 — site 전체 Header는 V2 것을 그대로 쓰고, 그 아래 detail body만 이식한다(§AGENTS
//     레퍼런스는 구조·정보 위계만 참고, 장식 그대로 복제 금지와 동일 원칙)
//   - 원본에 존재하는 이전/다음/목록 네비게이션을 V2 톤의 절제된 텍스트 링크로 재구성
// 이미지 source는 전부 public/portfolio/calendar/ 최적화 WebP만 사용, references/ 425MB
// 원본은 참조하지 않는다. 다른 프로젝트의 detailImages는 선택 전까지 렌더/preload되지 않는다.
function PortfolioDetailPage({ idx, navigate }: { idx: number; navigate: (path: string, opts?: { scrollTo?: string }) => void }) {
  const fontKr = { fontFamily: 'Noto Sans KR, sans-serif' }
  const project = getCalendarProjectByIdx(idx)

  // App() 의 navigate() 가 부르는 legacy 2-인자 window.scrollTo(0,0) 은 전역 CSS
  // `scroll-behavior: smooth`(index.css) 를 따르는 애니메이션 스크롤이라, 이전 상세 페이지가
  // 매우 길 때(이미지 10~20장) React가 옛 DOM을 언마운트하면서 애니메이션이 중간에 멈춰
  // scrollY가 이전 위치에 그대로 남는 문제가 있었다. behavior:'auto' 를 명시하면 CSS smooth를
  // 무시하고 즉시 이동하므로, idx 가 바뀔 때(첫 진입·이전/다음·뒤로가기 전부 포함)마다 확실히
  // 맨 위에서 시작하도록 보정한다.
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [idx])

  if (!project) {
    return (
      <div className="min-h-screen bg-white">
        <Header page="portfolio-detail" navigate={navigate} />
        <div className={`${SHELL} pt-[160px] pb-[160px]`}>
          <p className="text-black" style={fontKr}>프로젝트를 찾을 수 없습니다.</p>
          <button
            type="button"
            onClick={() => navigate('/portfolio')}
            className="mt-4 t-caption text-black/55 hover:text-black transition-colors"
          >
            ‹ 목록으로
          </button>
        </div>
      </div>
    )
  }

  const listIndex = project.order - 1
  const prev = listIndex > 0 ? CALENDAR_PORTFOLIO[listIndex - 1] : null
  const next = listIndex < CALENDAR_PORTFOLIO.length - 1 ? CALENDAR_PORTFOLIO[listIndex + 1] : null

  return (
    <div className="min-h-screen bg-white">
      <Header page="portfolio-detail" navigate={navigate} />

      {/* 상단 정보 — contained(.u-shell), 원본에서 확인된 정보(title/category/date/company)만 사용 */}
      <section className="bg-white">
        <div className={SHELL}>
          <div className="pt-[112px] lg:pt-[160px] pb-[28px] lg:pb-[36px]">
            <button
              type="button"
              onClick={() => navigate('/portfolio')}
              className="t-caption text-black/45 hover:text-black transition-colors mb-4 lg:mb-6 inline-block"
            >
              ‹ 목록으로
            </button>
            <p
              className="mb-2 text-[11px] lg:text-[12px] font-semibold tracking-[0.22em] uppercase text-black/45"
              style={{ fontFamily: 'Courier New, monospace' }}
            >
              {project.category}{project.date ? ` · ${project.date}` : ''}
            </p>
            <h1
              className="text-black"
              style={{ ...fontKr, fontWeight: 700, fontSize: 'clamp(26px, 4.2vw, 52px)', lineHeight: 1.2, letterSpacing: '-0.02em' }}
            >
              {project.title}
            </h1>
            {project.company && (
              <p className="mt-2 text-[14px] text-black/55" style={fontKr}>{project.company}</p>
            )}
          </div>
        </div>
      </section>

      {/* 이미지 스택 — 검은 배경, edge-to-edge, 원본 순서 그대로. 처음 2장만 eager, 나머지 lazy.
          .u-gallery-wide 로 Portfolio 목록과 동일한 wide breakout 축 재사용(새 width 시스템 추가 없음) */}
      <section className="bg-black">
        <div className="u-gallery-wide flex flex-col">
          {project.detailImages.map((img, i) => (
            <div key={img.order} className="border-b border-white/[0.12] last:border-b-0">
              <img
                src={img.src}
                alt={`${project.title} ${img.order}`}
                width={img.width}
                height={img.height}
                loading={i < 2 ? 'eager' : 'lazy'}
                style={{ aspectRatio: `${img.width} / ${img.height}` }}
                className="block w-full h-auto"
              />
            </div>
          ))}
        </div>
      </section>

      {/* 이전/다음/목록 — 원본에 있던 nav를 V2 톤의 절제된 텍스트 링크로 재구성. 거대한 카드/CTA 없음 */}
      <section className="bg-white">
        <div className={SHELL}>
          <div className="py-[40px] lg:py-[56px] flex items-start justify-between gap-4 flex-wrap">
            {prev ? (
              <button
                type="button"
                onClick={() => navigate(`/portfolio/${prev.idx}`)}
                className="text-left max-w-[45%]"
              >
                <span className="t-caption text-black/45 block mb-1">‹ 이전</span>
                <span className="text-black text-[13px]" style={fontKr}>{prev.title}</span>
              </button>
            ) : <span />}
            <button
              type="button"
              onClick={() => navigate('/portfolio')}
              className="t-caption text-black/45 hover:text-black transition-colors"
            >
              목록으로
            </button>
            {next ? (
              <button
                type="button"
                onClick={() => navigate(`/portfolio/${next.idx}`)}
                className="text-right max-w-[45%]"
              >
                <span className="t-caption text-black/45 block mb-1">다음 ›</span>
                <span className="text-black text-[13px]" style={fontKr}>{next.title}</span>
              </button>
            ) : <span />}
          </div>
        </div>
      </section>
    </div>
  )
}

// ── 문의 페이지 (/inquiry) ───────────────────────────────────────────────────────
// 기존 Touchgraphic 문의 페이지(touchagraphic.com/page/inquiry.html)의 layout·spacing·
// form architecture를 재현: 큰 introduction + 얇은 divider, 번호 붙은 section, 사각형
// selectable box(01), gray 배경 input/select(02·03), 라벨 옆 magenta dot(필수 표시),
// 개인정보 동의 체크박스 + outline 화살표 submit 버튼. V2 Header는 그대로 재사용.
// 기존 Touchgraphic 문의 페이지의 04(프로젝트 상세 타입 accordion)는 이 페이지에 만들지 않는다.
// 실제 전송 백엔드는 아직 없음 — handleSubmit 의 TODO 참고(touchagraphic.com의 endpoint를 추측해
// 연결하지 않는다). 여기서는 plan 선택 state만 새로 만들고 Estimator 가격 데이터/로직은 참조하지 않는다.
type InquiryPlanId = 'basic' | 'custom' | 'highend'
const INQUIRY_PLANS: { id: InquiryPlanId; name: string }[] = [
  { id: 'basic',   name: '베이직 (실속형)' },
  { id: 'custom',  name: '커스텀 (맞춤형)' },
  { id: 'highend', name: '하이앤드 (기획형)' },
]
// 유입경로는 기존에 정의된 옵션이 없어 새로 추가. 사용예정일/프로젝트 예산은 기존 DEADLINE_OPTS/
// BUDGET_OPTS(§ConsultForm 에서도 사용) 를 그대로 재사용해 새 카피를 만들지 않는다.
const REFERRAL_OPTS = ['검색 (네이버·구글 등)', 'SNS', '지인·업체 소개', '기존 고객', '기타']

// 기존 Touchgraphic inquiry 의 작은 magenta dot(필수 표시)을 재해석 — Estimator 마스트헤드
// CMYK 도트에 이미 쓰인 '#DB438F' 를 그대로 재사용(§Portfolio PF_ACCENTS 의 magenta 와도 계열 일치).
function RequiredDot() {
  return <span className="inline-block w-[5px] h-[5px] rounded-full align-middle ml-1" style={{ background: '#DB438F' }} aria-hidden />
}

function InquiryPage({ navigate }: { navigate: (path: string, opts?: { scrollTo?: string }) => void }) {
  const fontKr = { fontFamily: 'Noto Sans KR, sans-serif' }

  const [plan, setPlan] = useState<InquiryPlanId | ''>('')
  const [quantity, setQuantity] = useState('')
  const [deadline, setDeadline] = useState('')
  const [budget, setBudget] = useState('')
  const [fileName, setFileName] = useState('')
  const [detail, setDetail] = useState('')
  const [company, setCompany] = useState('')
  const [contactName, setContactName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [referral, setReferral] = useState('')
  const [website, setWebsite] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [devNotice, setDevNotice] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!plan) return
    // TODO: 실제 문의 접수 연동 필요(이메일 전송 / 스프레드시트 / CRM 등 실제 backend endpoint 확정 후 연결).
    // touchagraphic.com 의 실제 endpoint를 추측해서 연결하지 않는다 — 지금은 폼 검증까지만 확인한다.
    console.log('[InquiryPage] submit — 백엔드 미연결, 폼 상태만 로그로 확인', {
      plan, quantity, deadline, budget, fileName, detail, company, contactName, phone, email, referral, website,
    })
    setDevNotice(true)
  }

  const inputCls = "w-full bg-black/[0.035] px-4 py-3 text-[14px] text-black placeholder:text-black/35 focus:outline-none focus:bg-black/[0.06] transition-colors"
  const labelCls = "flex items-center text-[13px] font-medium text-black mb-2"

  return (
    <div className="min-h-screen bg-white">
      <Header page="inquiry" navigate={navigate} />

      <section className="bg-white">
        {/* 폭: 예전엔 .u-shell 안에 max-w-[1200px] 가 이중으로 들어가 있어 desktop에서 과하게
            좁았다(§AGENTS-비교 참고). intro/form이 하나의 .u-inquiry-wide(wide sheet) 를 공유해
            같은 좌우 축에 정렬되도록 SHELL·개별 max-w-[1200px] 를 제거했다. CONTENT/폼 디자인은
            변경하지 않음 — 폭 구조만 수정. */}
        <div className="u-inquiry-wide">
          {/* introduction — reference의 큰 2줄 카피 대신, 새 감성 마케팅 카피를 임의로 짓지 않고
              문의 페이지 목적에 맞는 절제된 안내 문구만 사용(AGENTS §9) */}
          <div className="pt-[140px] lg:pt-[200px] pb-[40px] lg:pb-[56px]">
            <p className="mb-4 lg:mb-6 text-[11px] lg:text-[12px] font-semibold tracking-[0.22em] uppercase text-black/45" style={{ fontFamily: 'Courier New, monospace' }}>
              Inquiry
            </p>
            <h1 className="text-black" style={{ ...fontKr, fontWeight: 700, fontSize: 'clamp(28px, 4.2vw, 52px)', lineHeight: 1.25, letterSpacing: '-0.02em' }}>
              프로젝트를 알려주세요.
            </h1>
            <p className="mt-4 text-[14px] lg:text-[15px] text-black/55" style={fontKr}>
              필요한 내용을 남겨주시면 담당자가 확인 후 빠르게 연락드리겠습니다.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="pb-[120px] lg:pb-[160px]">
            <div className="border-t-2 border-black pt-3 flex items-center justify-end gap-1.5">
              <span className="text-[12px] text-black/45" style={fontKr}>필수 입력 사항</span>
              <RequiredDot />
            </div>

            {/* 01 — 플랜 선택 (single select) */}
            <div className="mt-[56px] lg:mt-[72px]">
              <div className="flex items-baseline flex-wrap gap-2 mb-5 lg:mb-7">
                <h2 className="text-black" style={{ ...fontKr, fontWeight: 700, fontSize: 'clamp(18px, 1.6vw, 22px)' }}>
                  01. 원하는 플랜을 선택해주세요.
                </h2>
                <RequiredDot />
                <span className="text-[12px] text-black/40" style={fontKr}>(하나만 선택 가능)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {INQUIRY_PLANS.map(p => (
                  <label key={p.id}
                    className="cursor-pointer text-center px-4 py-5 border text-[14px] font-medium transition-colors"
                    style={{
                      ...fontKr,
                      borderColor: plan === p.id ? '#1A1A1A' : 'rgba(0,0,0,0.16)',
                      background: plan === p.id ? '#1A1A1A' : '#FFFFFF',
                      color: plan === p.id ? '#FFFFFF' : '#1A1A1A',
                    }}
                  >
                    <input type="radio" name="plan" value={p.id} required
                      checked={plan === p.id} onChange={() => setPlan(p.id)} className="sr-only" />
                    {p.name}
                  </label>
                ))}
              </div>
            </div>

            {/* 02 — 프로젝트 정보 */}
            <div className="mt-[56px] lg:mt-[72px]">
              <h2 className="text-black mb-5 lg:mb-7" style={{ ...fontKr, fontWeight: 700, fontSize: 'clamp(18px, 1.6vw, 22px)' }}>
                02. 프로젝트 정보를 입력해주세요.
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                <div>
                  <label className={labelCls} style={fontKr}>제작 수량<RequiredDot /></label>
                  <input type="text" required value={quantity} onChange={e => setQuantity(e.target.value)}
                    placeholder="제작 수량을 입력해주세요." className={inputCls} style={fontKr} />
                </div>
                <div>
                  <label className={labelCls} style={fontKr}>사용예정일<RequiredDot /></label>
                  <select required value={deadline} onChange={e => setDeadline(e.target.value)} className={inputCls} style={fontKr}>
                    <option value="" disabled>사용예정일을 선택해주세요.</option>
                    {DEADLINE_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls} style={fontKr}>프로젝트 예산<RequiredDot /></label>
                  <select required value={budget} onChange={e => setBudget(e.target.value)} className={inputCls} style={fontKr}>
                    <option value="" disabled>프로젝트 예산을 선택해주세요.</option>
                    {BUDGET_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-black mb-2" style={fontKr}>첨부파일</label>
                  <div className="flex items-stretch">
                    <div className="flex-1 min-w-0 bg-black/[0.035] px-4 py-3 text-[14px] text-black/35 truncate" style={fontKr}>
                      {fileName || '파일을 선택해주세요.'}
                    </div>
                    <button type="button" onClick={() => fileInputRef.current?.click()}
                      className="shrink-0 px-5 text-[13px] font-semibold text-white bg-[#1A1A1A] hover:opacity-90 transition-opacity" style={fontKr}>
                      파일업로드
                    </button>
                    <input ref={fileInputRef} type="file" className="hidden"
                      onChange={e => setFileName(e.target.files?.[0]?.name ?? '')} />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls} style={fontKr}>상세 문의내용<RequiredDot /></label>
                  <textarea required value={detail} onChange={e => setDetail(e.target.value)}
                    placeholder="상세 문의 내용을 입력해주세요." rows={6}
                    className={`${inputCls} resize-none`} style={fontKr} />
                </div>
              </div>
            </div>

            {/* 03 — 기본정보 (기존 reference 의 04 프로젝트 상세 타입 accordion은 만들지 않고 바로 privacy/submit 로 이어진다) */}
            <div className="mt-[56px] lg:mt-[72px]">
              <h2 className="text-black mb-5 lg:mb-7" style={{ ...fontKr, fontWeight: 700, fontSize: 'clamp(18px, 1.6vw, 22px)' }}>
                03. 기본정보를 입력해주세요.
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                <div>
                  <label className={labelCls} style={fontKr}>회사명<RequiredDot /></label>
                  <input type="text" required value={company} onChange={e => setCompany(e.target.value)}
                    placeholder="회사명을 입력해주세요." className={inputCls} style={fontKr} />
                </div>
                <div>
                  <label className={labelCls} style={fontKr}>담당자명<RequiredDot /></label>
                  <input type="text" required value={contactName} onChange={e => setContactName(e.target.value)}
                    placeholder="담당자명을 입력해주세요." className={inputCls} style={fontKr} />
                </div>
                <div>
                  <label className={labelCls} style={fontKr}>연락처<RequiredDot /></label>
                  <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)}
                    placeholder="연락처를 입력해주세요." className={inputCls} style={fontKr} />
                </div>
                <div>
                  <label className={labelCls} style={fontKr}>이메일<RequiredDot /></label>
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="이메일주소를 입력해주세요." className={inputCls} style={fontKr} />
                </div>
                <div>
                  <label className={labelCls} style={fontKr}>유입경로<RequiredDot /></label>
                  <select required value={referral} onChange={e => setReferral(e.target.value)} className={inputCls} style={fontKr}>
                    <option value="" disabled>유입경로를 선택해주세요.</option>
                    {REFERRAL_OPTS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-black mb-2" style={fontKr}>웹사이트</label>
                  <input type="text" value={website} onChange={e => setWebsite(e.target.value)}
                    placeholder="웹사이트를 입력해주세요." className={inputCls} style={fontKr} />
                </div>
              </div>
            </div>

            {/* privacy + submit */}
            <div className="mt-[56px] lg:mt-[72px] pt-8 border-t border-black/10">
              <label className="flex items-center gap-2.5 text-[13px] text-black" style={fontKr}>
                <input type="checkbox" required checked={agreed} onChange={e => setAgreed(e.target.checked)}
                  className="w-4 h-4 accent-black" />
                개인정보처리방침에 동의합니다.
                <button type="button" onClick={() => setShowPrivacy(v => !v)}
                  className="underline underline-offset-2 text-black/60 hover:text-black transition-colors">
                  내용보기
                </button>
              </label>
              {showPrivacy && (
                <p className="mt-3 max-w-[720px] text-[12px] leading-[1.8] text-black/50" style={fontKr}>
                  {/* TODO: 실제 개인정보처리방침 전문/페이지로 교체 필요 — 현재는 임시 안내문 */}
                  문의 답변을 위해 위에 입력하신 회사명·담당자명·연락처·이메일 등 정보를 수집·이용합니다.
                  수집한 정보는 문의 응대 목적으로만 사용하며, 처리 완료 후 파기합니다.
                </p>
              )}

              <div className="mt-8 flex flex-col items-center gap-3">
                <button type="submit"
                  className="inline-flex items-center gap-2.5 border border-black px-10 py-4 text-[15px] font-bold text-black hover:bg-black hover:text-white transition-colors"
                  style={fontKr}>
                  프로젝트 의뢰하기 <span aria-hidden>→</span>
                </button>
                {devNotice && (
                  <p className="text-[12px] text-black/45" style={fontKr}>
                    입력하신 내용 확인했습니다. 실제 접수 연동(이메일 전송 등)은 아직 준비 중입니다.
                  </p>
                )}
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// App 루트
// ══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [view, setView] = useState<AppView>('landing')
  const [sels] = useState<Sels>({ ...DEFAULT_SELS })
  // 라우터 라이브러리 없이 pathname 만으로 '/' ↔ '/portfolio' ↔ '/portfolio/:idx' ↔ '/inquiry' 를
  // 전환한다(§AGENTS: 최소 구조). '/portfolio/:idx' 는 pathname 그대로를 route 로 사용하고
  // App() 렌더링에서 정규식으로 idx 를 다시 뽑아낸다(별도 라우팅 라이브러리 설치 없음).
  function pathToRoute(pathname: string) {
    if (pathname === '/portfolio') return '/portfolio'
    if (/^\/portfolio\/\d+$/.test(pathname)) return pathname
    if (pathname === '/inquiry') return '/inquiry'
    return '/'
  }
  const [route, setRoute] = useState(() => pathToRoute(window.location.pathname))
  // 다른 라우트로 이동하면서 도착 후 특정 섹션으로 스크롤해야 하는 경우(예: /portfolio → '/' → estimator)를 위한 예약값.
  const pendingScrollRef = useRef<string | null>(null)

  useEffect(() => {
    function onPopState() { setRoute(pathToRoute(window.location.pathname)) }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  function navigate(path: string, opts?: { scrollTo?: string }) {
    pendingScrollRef.current = opts?.scrollTo ?? null
    if (window.location.pathname !== path) window.history.pushState({}, '', path)
    window.scrollTo(0, 0)
    setRoute(path)
  }

  useEffect(() => {
    if (route !== '/' || !pendingScrollRef.current) return
    const id = pendingScrollRef.current
    pendingScrollRef.current = null
    requestAnimationFrame(() => scrollToCenter(id))
  }, [route])

  useEffect(() => { if (view === 'landing') return; window.scrollTo(0, 0) }, [view])

  function reset() { setView('landing') }

  if (route === '/portfolio') {
    return <PortfolioPage navigate={navigate} />
  }

  {
    const detailMatch = route.match(/^\/portfolio\/(\d+)$/)
    if (detailMatch) {
      return <PortfolioDetailPage idx={Number(detailMatch[1])} navigate={navigate} />
    }
  }

  if (route === '/inquiry') {
    return <InquiryPage navigate={navigate} />
  }

  if (view === 'consult') {
    return <ConsultForm sels={sels} onBack={() => setView('landing')} onReset={reset} />
  }

  return (
    <div className="min-h-screen bg-white">
      <Header page="landing" navigate={navigate} />
      <Hero />
      <Portfolio navigate={navigate} />
      <EstimatorSection onConsult={() => setView('consult')} />
      <CertificationSection />
      <Clients />
      <FaqSection />
    </div>
  )
}

// 레거시(현재 미사용): TrustStrip · Consultation · FAQ · Footer · Service · Contact.
// EXHIBITIONS = 구 4:5 썸네일 데이터(§22 로 보존, 렌더는 PORTFOLIO 사용).
// 기존 정의는 남겨두되 렌더하지 않는다.
void TrustStrip; void Consultation; void FAQ; void Footer; void Service; void Contact; void EXHIBITIONS;
