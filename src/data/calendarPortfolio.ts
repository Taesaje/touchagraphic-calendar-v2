// 자동 생성 파일 — 수정하지 말 것.
// source: references/touch-portfolio-source/manifest.json (title/company/category/date)
//       + references/touch-portfolio-original/manifest-web.json (webPath/width/height)
// 생성 스크립트: references/touch-portfolio-source/generate-data-file.mjs
// 이 파일은 실제 웹 asset 경로(public/portfolio/calendar/...)만 참조한다.
// references/touch-portfolio-original/ 의 425MB 원본은 runtime에서 절대 참조하지 않는다.
//
// 주의: category 는 원본 사이트의 실제 필터(Editorial/Graphic/Calendar)이며
// "기업/기관" 분류가 아니다. 원본에 기업/기관 메타데이터가 없어 임의로 분류하지 않았다.

export type CalendarPortfolioImage = {
  order: number
  src: string
  width: number
  height: number
}

export type CalendarPortfolioProject = {
  order: number
  idx: number
  title: string
  company: string | null
  category: string
  date: string
  thumbnail: { src: string; width: number; height: number }
  detailImages: CalendarPortfolioImage[]
  sourceDetailUrl: string
}

export const CALENDAR_PORTFOLIO: CalendarPortfolioProject[] = [
  {
    "order": 1,
    "idx": 1878,
    "title": "동아쏘시오그룹 & 동아제약 다이어리",
    "company": "동아쏘시오그룹",
    "category": "Editorial",
    "date": "2026",
    "thumbnail": {
      "src": "/portfolio/calendar/001-donga-diary/thumbnail.webp",
      "width": 1200,
      "height": 803
    },
    "detailImages": [
      {
        "order": 1,
        "src": "/portfolio/calendar/001-donga-diary/01.webp",
        "width": 2000,
        "height": 1448
      },
      {
        "order": 2,
        "src": "/portfolio/calendar/001-donga-diary/02.webp",
        "width": 2000,
        "height": 1448
      },
      {
        "order": 3,
        "src": "/portfolio/calendar/001-donga-diary/03.webp",
        "width": 2000,
        "height": 1448
      },
      {
        "order": 4,
        "src": "/portfolio/calendar/001-donga-diary/04.webp",
        "width": 2000,
        "height": 1333
      },
      {
        "order": 5,
        "src": "/portfolio/calendar/001-donga-diary/05.webp",
        "width": 2000,
        "height": 1333
      },
      {
        "order": 6,
        "src": "/portfolio/calendar/001-donga-diary/06.webp",
        "width": 2000,
        "height": 1333
      },
      {
        "order": 7,
        "src": "/portfolio/calendar/001-donga-diary/07.webp",
        "width": 2000,
        "height": 1333
      },
      {
        "order": 8,
        "src": "/portfolio/calendar/001-donga-diary/08.webp",
        "width": 2000,
        "height": 1333
      },
      {
        "order": 9,
        "src": "/portfolio/calendar/001-donga-diary/09.webp",
        "width": 2000,
        "height": 1333
      },
      {
        "order": 10,
        "src": "/portfolio/calendar/001-donga-diary/10.webp",
        "width": 2000,
        "height": 3378
      }
    ],
    "sourceDetailUrl": "https://www.touchagraphic.com/portfolio/pf_detail.html?idx=1878&part_idx=21"
  },
  {
    "order": 2,
    "idx": 1870,
    "title": "동아쏘시오그룹 & 동아제약 캘린더",
    "company": "동아쏘시오그룹",
    "category": "Calendar",
    "date": "2026",
    "thumbnail": {
      "src": "/portfolio/calendar/002-donga-calendar/thumbnail.webp",
      "width": 1200,
      "height": 803
    },
    "detailImages": [
      {
        "order": 1,
        "src": "/portfolio/calendar/002-donga-calendar/01.webp",
        "width": 2000,
        "height": 1484
      },
      {
        "order": 2,
        "src": "/portfolio/calendar/002-donga-calendar/02.webp",
        "width": 2000,
        "height": 1422
      },
      {
        "order": 3,
        "src": "/portfolio/calendar/002-donga-calendar/03.webp",
        "width": 2000,
        "height": 1333
      },
      {
        "order": 4,
        "src": "/portfolio/calendar/002-donga-calendar/04.webp",
        "width": 2000,
        "height": 1333
      },
      {
        "order": 5,
        "src": "/portfolio/calendar/002-donga-calendar/05.webp",
        "width": 2000,
        "height": 1333
      },
      {
        "order": 6,
        "src": "/portfolio/calendar/002-donga-calendar/06.webp",
        "width": 2000,
        "height": 1333
      },
      {
        "order": 7,
        "src": "/portfolio/calendar/002-donga-calendar/07.webp",
        "width": 2000,
        "height": 1333
      },
      {
        "order": 8,
        "src": "/portfolio/calendar/002-donga-calendar/08.webp",
        "width": 2000,
        "height": 1333
      },
      {
        "order": 9,
        "src": "/portfolio/calendar/002-donga-calendar/09.webp",
        "width": 2000,
        "height": 1333
      },
      {
        "order": 10,
        "src": "/portfolio/calendar/002-donga-calendar/10.webp",
        "width": 2000,
        "height": 1333
      },
      {
        "order": 11,
        "src": "/portfolio/calendar/002-donga-calendar/11.webp",
        "width": 2000,
        "height": 1333
      },
      {
        "order": 12,
        "src": "/portfolio/calendar/002-donga-calendar/12.webp",
        "width": 2000,
        "height": 6023
      }
    ],
    "sourceDetailUrl": "https://www.touchagraphic.com/portfolio/pf_detail.html?idx=1870&part_idx=21"
  },
  {
    "order": 3,
    "idx": 1889,
    "title": "2026 미니캘린더",
    "company": null,
    "category": "Calendar",
    "date": "2026",
    "thumbnail": {
      "src": "/portfolio/calendar/003-mini-calendar-2026/thumbnail.webp",
      "width": 1200,
      "height": 803
    },
    "detailImages": [
      {
        "order": 1,
        "src": "/portfolio/calendar/003-mini-calendar-2026/01.webp",
        "width": 2000,
        "height": 1240
      },
      {
        "order": 2,
        "src": "/portfolio/calendar/003-mini-calendar-2026/02.webp",
        "width": 2000,
        "height": 1240
      },
      {
        "order": 3,
        "src": "/portfolio/calendar/003-mini-calendar-2026/03.webp",
        "width": 2000,
        "height": 1240
      },
      {
        "order": 4,
        "src": "/portfolio/calendar/003-mini-calendar-2026/04.webp",
        "width": 2000,
        "height": 1240
      },
      {
        "order": 5,
        "src": "/portfolio/calendar/003-mini-calendar-2026/05.webp",
        "width": 2000,
        "height": 1240
      },
      {
        "order": 6,
        "src": "/portfolio/calendar/003-mini-calendar-2026/06.webp",
        "width": 2000,
        "height": 1240
      },
      {
        "order": 7,
        "src": "/portfolio/calendar/003-mini-calendar-2026/07.webp",
        "width": 2000,
        "height": 1240
      },
      {
        "order": 8,
        "src": "/portfolio/calendar/003-mini-calendar-2026/08.webp",
        "width": 2000,
        "height": 6143
      }
    ],
    "sourceDetailUrl": "https://www.touchagraphic.com/portfolio/pf_detail.html?idx=1889&part_idx=21"
  },
  {
    "order": 4,
    "idx": 1883,
    "title": "2026 일상캘린더",
    "company": null,
    "category": "Calendar",
    "date": "2026",
    "thumbnail": {
      "src": "/portfolio/calendar/004-daily-calendar-2026/thumbnail.webp",
      "width": 1200,
      "height": 803
    },
    "detailImages": [
      {
        "order": 1,
        "src": "/portfolio/calendar/004-daily-calendar-2026/01.webp",
        "width": 2000,
        "height": 1240
      },
      {
        "order": 2,
        "src": "/portfolio/calendar/004-daily-calendar-2026/02.webp",
        "width": 2000,
        "height": 1240
      },
      {
        "order": 3,
        "src": "/portfolio/calendar/004-daily-calendar-2026/03.webp",
        "width": 2000,
        "height": 1240
      },
      {
        "order": 4,
        "src": "/portfolio/calendar/004-daily-calendar-2026/04.webp",
        "width": 2000,
        "height": 1240
      },
      {
        "order": 5,
        "src": "/portfolio/calendar/004-daily-calendar-2026/05.webp",
        "width": 2000,
        "height": 1240
      },
      {
        "order": 6,
        "src": "/portfolio/calendar/004-daily-calendar-2026/06.webp",
        "width": 2000,
        "height": 1240
      },
      {
        "order": 7,
        "src": "/portfolio/calendar/004-daily-calendar-2026/07.webp",
        "width": 2000,
        "height": 1240
      },
      {
        "order": 8,
        "src": "/portfolio/calendar/004-daily-calendar-2026/08.webp",
        "width": 2000,
        "height": 1055
      },
      {
        "order": 9,
        "src": "/portfolio/calendar/004-daily-calendar-2026/09.webp",
        "width": 2000,
        "height": 4727
      }
    ],
    "sourceDetailUrl": "https://www.touchagraphic.com/portfolio/pf_detail.html?idx=1883&part_idx=21"
  },
  {
    "order": 5,
    "idx": 1881,
    "title": "세종스포츠정형외과 캘린더",
    "company": "세종스포츠정형외과",
    "category": "Calendar",
    "date": "2025",
    "thumbnail": {
      "src": "/portfolio/calendar/005-sejong-sports/thumbnail.webp",
      "width": 1200,
      "height": 804
    },
    "detailImages": [
      {
        "order": 1,
        "src": "/portfolio/calendar/005-sejong-sports/01.webp",
        "width": 2000,
        "height": 1240
      },
      {
        "order": 2,
        "src": "/portfolio/calendar/005-sejong-sports/02.webp",
        "width": 2000,
        "height": 1240
      },
      {
        "order": 3,
        "src": "/portfolio/calendar/005-sejong-sports/03.webp",
        "width": 2000,
        "height": 1240
      },
      {
        "order": 4,
        "src": "/portfolio/calendar/005-sejong-sports/04.webp",
        "width": 2000,
        "height": 1240
      },
      {
        "order": 5,
        "src": "/portfolio/calendar/005-sejong-sports/05.webp",
        "width": 2000,
        "height": 1240
      },
      {
        "order": 6,
        "src": "/portfolio/calendar/005-sejong-sports/06.webp",
        "width": 2000,
        "height": 1240
      },
      {
        "order": 7,
        "src": "/portfolio/calendar/005-sejong-sports/07.webp",
        "width": 2000,
        "height": 1240
      },
      {
        "order": 8,
        "src": "/portfolio/calendar/005-sejong-sports/08.webp",
        "width": 2000,
        "height": 1283
      },
      {
        "order": 9,
        "src": "/portfolio/calendar/005-sejong-sports/09.webp",
        "width": 2000,
        "height": 5109
      }
    ],
    "sourceDetailUrl": "https://www.touchagraphic.com/portfolio/pf_detail.html?idx=1881&part_idx=21"
  },
  {
    "order": 6,
    "idx": 1880,
    "title": "한국수목정원관리원 캘린더",
    "company": "한국수목정원관리원",
    "category": "Calendar",
    "date": "2025",
    "thumbnail": {
      "src": "/portfolio/calendar/006-arboretum/thumbnail.webp",
      "width": 1200,
      "height": 803
    },
    "detailImages": [
      {
        "order": 1,
        "src": "/portfolio/calendar/006-arboretum/01.webp",
        "width": 2000,
        "height": 1333
      },
      {
        "order": 2,
        "src": "/portfolio/calendar/006-arboretum/02.webp",
        "width": 2000,
        "height": 1333
      },
      {
        "order": 3,
        "src": "/portfolio/calendar/006-arboretum/03.webp",
        "width": 2000,
        "height": 1333
      },
      {
        "order": 4,
        "src": "/portfolio/calendar/006-arboretum/04.webp",
        "width": 2000,
        "height": 1333
      },
      {
        "order": 5,
        "src": "/portfolio/calendar/006-arboretum/05.webp",
        "width": 2000,
        "height": 1333
      },
      {
        "order": 6,
        "src": "/portfolio/calendar/006-arboretum/06.webp",
        "width": 2000,
        "height": 1333
      },
      {
        "order": 7,
        "src": "/portfolio/calendar/006-arboretum/07.webp",
        "width": 2000,
        "height": 1333
      },
      {
        "order": 8,
        "src": "/portfolio/calendar/006-arboretum/08.webp",
        "width": 2000,
        "height": 1333
      },
      {
        "order": 9,
        "src": "/portfolio/calendar/006-arboretum/09.webp",
        "width": 2000,
        "height": 1333
      },
      {
        "order": 10,
        "src": "/portfolio/calendar/006-arboretum/10.webp",
        "width": 2000,
        "height": 1333
      },
      {
        "order": 11,
        "src": "/portfolio/calendar/006-arboretum/11.webp",
        "width": 2000,
        "height": 5581
      },
      {
        "order": 12,
        "src": "/portfolio/calendar/006-arboretum/12.webp",
        "width": 2000,
        "height": 1294
      },
      {
        "order": 13,
        "src": "/portfolio/calendar/006-arboretum/13.webp",
        "width": 2000,
        "height": 1294
      },
      {
        "order": 14,
        "src": "/portfolio/calendar/006-arboretum/14.webp",
        "width": 2000,
        "height": 1018
      },
      {
        "order": 15,
        "src": "/portfolio/calendar/006-arboretum/15.webp",
        "width": 2000,
        "height": 1189
      }
    ],
    "sourceDetailUrl": "https://www.touchagraphic.com/portfolio/pf_detail.html?idx=1880&part_idx=21"
  },
  {
    "order": 7,
    "idx": 1879,
    "title": "대한상공회의소 달력",
    "company": "대한상공회의소",
    "category": "Calendar",
    "date": "2025",
    "thumbnail": {
      "src": "/portfolio/calendar/007-kcci/thumbnail.webp",
      "width": 1200,
      "height": 803
    },
    "detailImages": [
      {
        "order": 1,
        "src": "/portfolio/calendar/007-kcci/01.webp",
        "width": 2000,
        "height": 1484
      },
      {
        "order": 2,
        "src": "/portfolio/calendar/007-kcci/02.webp",
        "width": 2000,
        "height": 1202
      },
      {
        "order": 3,
        "src": "/portfolio/calendar/007-kcci/03.webp",
        "width": 2000,
        "height": 1333
      },
      {
        "order": 4,
        "src": "/portfolio/calendar/007-kcci/04.webp",
        "width": 2000,
        "height": 1333
      },
      {
        "order": 5,
        "src": "/portfolio/calendar/007-kcci/05.webp",
        "width": 2000,
        "height": 1333
      },
      {
        "order": 6,
        "src": "/portfolio/calendar/007-kcci/06.webp",
        "width": 2000,
        "height": 1333
      },
      {
        "order": 7,
        "src": "/portfolio/calendar/007-kcci/07.webp",
        "width": 2000,
        "height": 1333
      },
      {
        "order": 8,
        "src": "/portfolio/calendar/007-kcci/08.webp",
        "width": 2000,
        "height": 1333
      },
      {
        "order": 9,
        "src": "/portfolio/calendar/007-kcci/09.webp",
        "width": 2000,
        "height": 1333
      },
      {
        "order": 10,
        "src": "/portfolio/calendar/007-kcci/10.webp",
        "width": 2000,
        "height": 1333
      },
      {
        "order": 11,
        "src": "/portfolio/calendar/007-kcci/11.webp",
        "width": 2000,
        "height": 1333
      },
      {
        "order": 12,
        "src": "/portfolio/calendar/007-kcci/12.webp",
        "width": 2000,
        "height": 1333
      },
      {
        "order": 13,
        "src": "/portfolio/calendar/007-kcci/13.webp",
        "width": 2000,
        "height": 5540
      }
    ],
    "sourceDetailUrl": "https://www.touchagraphic.com/portfolio/pf_detail.html?idx=1879&part_idx=21"
  },
  {
    "order": 8,
    "idx": 1863,
    "title": "IGLOO 캘린더 디자인",
    "company": null,
    "category": "Calendar",
    "date": "2025",
    "thumbnail": {
      "src": "/portfolio/calendar/008-igloo/thumbnail.webp",
      "width": 890,
      "height": 596
    },
    "detailImages": [
      {
        "order": 1,
        "src": "/portfolio/calendar/008-igloo/01.webp",
        "width": 2000,
        "height": 1334
      },
      {
        "order": 2,
        "src": "/portfolio/calendar/008-igloo/02.webp",
        "width": 2000,
        "height": 1340
      },
      {
        "order": 3,
        "src": "/portfolio/calendar/008-igloo/03.webp",
        "width": 2000,
        "height": 1334
      },
      {
        "order": 4,
        "src": "/portfolio/calendar/008-igloo/04.webp",
        "width": 2000,
        "height": 1334
      },
      {
        "order": 5,
        "src": "/portfolio/calendar/008-igloo/05.webp",
        "width": 2000,
        "height": 1334
      },
      {
        "order": 6,
        "src": "/portfolio/calendar/008-igloo/06.webp",
        "width": 2000,
        "height": 1240
      },
      {
        "order": 7,
        "src": "/portfolio/calendar/008-igloo/07.webp",
        "width": 2000,
        "height": 5262
      }
    ],
    "sourceDetailUrl": "https://www.touchagraphic.com/portfolio/pf_detail.html?idx=1863&part_idx=21"
  },
  {
    "order": 9,
    "idx": 1865,
    "title": "경기도중독관리통합지원센터 100일 달력",
    "company": "경기도중독관리통합지원센터",
    "category": "Calendar",
    "date": "2025",
    "thumbnail": {
      "src": "/portfolio/calendar/009-gyeonggi-addiction-center/thumbnail.webp",
      "width": 890,
      "height": 596
    },
    "detailImages": [
      {
        "order": 1,
        "src": "/portfolio/calendar/009-gyeonggi-addiction-center/01.webp",
        "width": 2000,
        "height": 1334
      },
      {
        "order": 2,
        "src": "/portfolio/calendar/009-gyeonggi-addiction-center/02.webp",
        "width": 2000,
        "height": 1334
      },
      {
        "order": 3,
        "src": "/portfolio/calendar/009-gyeonggi-addiction-center/03.webp",
        "width": 2000,
        "height": 1340
      },
      {
        "order": 4,
        "src": "/portfolio/calendar/009-gyeonggi-addiction-center/04.webp",
        "width": 2000,
        "height": 1334
      },
      {
        "order": 5,
        "src": "/portfolio/calendar/009-gyeonggi-addiction-center/05.webp",
        "width": 2000,
        "height": 1334
      },
      {
        "order": 6,
        "src": "/portfolio/calendar/009-gyeonggi-addiction-center/06.webp",
        "width": 2000,
        "height": 1333
      }
    ],
    "sourceDetailUrl": "https://www.touchagraphic.com/portfolio/pf_detail.html?idx=1865&part_idx=21"
  },
  {
    "order": 10,
    "idx": 990,
    "title": "2025 IMAGINE SEOUL 캘린더",
    "company": null,
    "category": "Calendar",
    "date": "2025",
    "thumbnail": {
      "src": "/portfolio/calendar/010-imagine-seoul/thumbnail.webp",
      "width": 1200,
      "height": 803
    },
    "detailImages": [
      {
        "order": 1,
        "src": "/portfolio/calendar/010-imagine-seoul/01.webp",
        "width": 2000,
        "height": 1125
      },
      {
        "order": 2,
        "src": "/portfolio/calendar/010-imagine-seoul/02.webp",
        "width": 2000,
        "height": 1125
      },
      {
        "order": 3,
        "src": "/portfolio/calendar/010-imagine-seoul/03.webp",
        "width": 2000,
        "height": 1125
      },
      {
        "order": 4,
        "src": "/portfolio/calendar/010-imagine-seoul/04.webp",
        "width": 2000,
        "height": 1125
      },
      {
        "order": 5,
        "src": "/portfolio/calendar/010-imagine-seoul/05.webp",
        "width": 2000,
        "height": 1125
      },
      {
        "order": 6,
        "src": "/portfolio/calendar/010-imagine-seoul/06.webp",
        "width": 2000,
        "height": 1125
      },
      {
        "order": 7,
        "src": "/portfolio/calendar/010-imagine-seoul/07.webp",
        "width": 2000,
        "height": 1125
      },
      {
        "order": 8,
        "src": "/portfolio/calendar/010-imagine-seoul/08.webp",
        "width": 2000,
        "height": 1125
      },
      {
        "order": 9,
        "src": "/portfolio/calendar/010-imagine-seoul/09.webp",
        "width": 2000,
        "height": 1125
      },
      {
        "order": 10,
        "src": "/portfolio/calendar/010-imagine-seoul/10.webp",
        "width": 2000,
        "height": 1125
      },
      {
        "order": 11,
        "src": "/portfolio/calendar/010-imagine-seoul/11.webp",
        "width": 2000,
        "height": 1125
      },
      {
        "order": 12,
        "src": "/portfolio/calendar/010-imagine-seoul/12.webp",
        "width": 2000,
        "height": 1125
      },
      {
        "order": 13,
        "src": "/portfolio/calendar/010-imagine-seoul/13.webp",
        "width": 2000,
        "height": 1125
      },
      {
        "order": 14,
        "src": "/portfolio/calendar/010-imagine-seoul/14.webp",
        "width": 2000,
        "height": 1125
      },
      {
        "order": 15,
        "src": "/portfolio/calendar/010-imagine-seoul/15.webp",
        "width": 2000,
        "height": 1125
      },
      {
        "order": 16,
        "src": "/portfolio/calendar/010-imagine-seoul/16.webp",
        "width": 2000,
        "height": 1125
      },
      {
        "order": 17,
        "src": "/portfolio/calendar/010-imagine-seoul/17.webp",
        "width": 2000,
        "height": 1125
      },
      {
        "order": 18,
        "src": "/portfolio/calendar/010-imagine-seoul/18.webp",
        "width": 2000,
        "height": 1125
      },
      {
        "order": 19,
        "src": "/portfolio/calendar/010-imagine-seoul/19.webp",
        "width": 2000,
        "height": 1125
      },
      {
        "order": 20,
        "src": "/portfolio/calendar/010-imagine-seoul/20.webp",
        "width": 2000,
        "height": 1126
      }
    ],
    "sourceDetailUrl": "https://www.touchagraphic.com/portfolio/pf_detail.html?idx=990&part_idx=21"
  },
  {
    "order": 11,
    "idx": 1873,
    "title": "'대한민국 국향대전' 캘린더",
    "company": "한평군 농업기술센터",
    "category": "Calendar",
    "date": "2024",
    "thumbnail": {
      "src": "/portfolio/calendar/011-guk-hyang-festival/thumbnail.webp",
      "width": 1200,
      "height": 803
    },
    "detailImages": [
      {
        "order": 1,
        "src": "/portfolio/calendar/011-guk-hyang-festival/01.webp",
        "width": 2000,
        "height": 1303
      },
      {
        "order": 2,
        "src": "/portfolio/calendar/011-guk-hyang-festival/02.webp",
        "width": 2000,
        "height": 1303
      },
      {
        "order": 3,
        "src": "/portfolio/calendar/011-guk-hyang-festival/03.webp",
        "width": 2000,
        "height": 1303
      },
      {
        "order": 4,
        "src": "/portfolio/calendar/011-guk-hyang-festival/04.webp",
        "width": 2000,
        "height": 1484
      },
      {
        "order": 5,
        "src": "/portfolio/calendar/011-guk-hyang-festival/05.webp",
        "width": 2000,
        "height": 2458
      }
    ],
    "sourceDetailUrl": "https://www.touchagraphic.com/portfolio/pf_detail.html?idx=1873&part_idx=21"
  },
  {
    "order": 12,
    "idx": 1632,
    "title": "한국가스기술공사 2025 캘린더",
    "company": "한국가스기술공사",
    "category": "Calendar",
    "date": "2024",
    "thumbnail": {
      "src": "/portfolio/calendar/012-kogas/thumbnail.webp",
      "width": 890,
      "height": 594
    },
    "detailImages": [
      {
        "order": 1,
        "src": "/portfolio/calendar/012-kogas/01.webp",
        "width": 2000,
        "height": 1854
      },
      {
        "order": 2,
        "src": "/portfolio/calendar/012-kogas/02.webp",
        "width": 2000,
        "height": 4435
      },
      {
        "order": 3,
        "src": "/portfolio/calendar/012-kogas/03.webp",
        "width": 2000,
        "height": 1447
      },
      {
        "order": 4,
        "src": "/portfolio/calendar/012-kogas/04.webp",
        "width": 2000,
        "height": 6911
      },
      {
        "order": 5,
        "src": "/portfolio/calendar/012-kogas/05.webp",
        "width": 2000,
        "height": 1334
      },
      {
        "order": 6,
        "src": "/portfolio/calendar/012-kogas/06.webp",
        "width": 2000,
        "height": 1334
      },
      {
        "order": 7,
        "src": "/portfolio/calendar/012-kogas/07.webp",
        "width": 2000,
        "height": 1334
      },
      {
        "order": 8,
        "src": "/portfolio/calendar/012-kogas/08.webp",
        "width": 2000,
        "height": 1334
      },
      {
        "order": 9,
        "src": "/portfolio/calendar/012-kogas/09.webp",
        "width": 2000,
        "height": 1334
      },
      {
        "order": 10,
        "src": "/portfolio/calendar/012-kogas/10.webp",
        "width": 2000,
        "height": 1334
      },
      {
        "order": 11,
        "src": "/portfolio/calendar/012-kogas/11.webp",
        "width": 2000,
        "height": 1334
      },
      {
        "order": 12,
        "src": "/portfolio/calendar/012-kogas/12.webp",
        "width": 2000,
        "height": 1334
      },
      {
        "order": 13,
        "src": "/portfolio/calendar/012-kogas/13.webp",
        "width": 2000,
        "height": 1334
      }
    ],
    "sourceDetailUrl": "https://www.touchagraphic.com/portfolio/pf_detail.html?idx=1632&part_idx=21"
  },
  {
    "order": 13,
    "idx": 974,
    "title": "한국환경산업기술원 캘린더",
    "company": "한국환경산업기술원",
    "category": "Calendar",
    "date": "2024",
    "thumbnail": {
      "src": "/portfolio/calendar/013-keiti/thumbnail.webp",
      "width": 1200,
      "height": 803
    },
    "detailImages": [
      {
        "order": 1,
        "src": "/portfolio/calendar/013-keiti/01.webp",
        "width": 2000,
        "height": 1267
      },
      {
        "order": 2,
        "src": "/portfolio/calendar/013-keiti/02.webp",
        "width": 2000,
        "height": 1333
      },
      {
        "order": 3,
        "src": "/portfolio/calendar/013-keiti/03.webp",
        "width": 2000,
        "height": 1333
      },
      {
        "order": 4,
        "src": "/portfolio/calendar/013-keiti/04.webp",
        "width": 2000,
        "height": 1333
      },
      {
        "order": 5,
        "src": "/portfolio/calendar/013-keiti/05.webp",
        "width": 2000,
        "height": 1333
      },
      {
        "order": 6,
        "src": "/portfolio/calendar/013-keiti/06.webp",
        "width": 2000,
        "height": 1531
      },
      {
        "order": 7,
        "src": "/portfolio/calendar/013-keiti/07.webp",
        "width": 2000,
        "height": 1531
      },
      {
        "order": 8,
        "src": "/portfolio/calendar/013-keiti/08.webp",
        "width": 2000,
        "height": 1125
      },
      {
        "order": 9,
        "src": "/portfolio/calendar/013-keiti/09.webp",
        "width": 2000,
        "height": 1847
      },
      {
        "order": 10,
        "src": "/portfolio/calendar/013-keiti/10.webp",
        "width": 2000,
        "height": 1847
      },
      {
        "order": 11,
        "src": "/portfolio/calendar/013-keiti/11.webp",
        "width": 2000,
        "height": 1334
      },
      {
        "order": 12,
        "src": "/portfolio/calendar/013-keiti/12.webp",
        "width": 2000,
        "height": 1333
      },
      {
        "order": 13,
        "src": "/portfolio/calendar/013-keiti/13.webp",
        "width": 2000,
        "height": 1333
      },
      {
        "order": 14,
        "src": "/portfolio/calendar/013-keiti/14.webp",
        "width": 2000,
        "height": 1333
      },
      {
        "order": 15,
        "src": "/portfolio/calendar/013-keiti/15.webp",
        "width": 2000,
        "height": 1333
      },
      {
        "order": 16,
        "src": "/portfolio/calendar/013-keiti/16.webp",
        "width": 2000,
        "height": 2551
      },
      {
        "order": 17,
        "src": "/portfolio/calendar/013-keiti/17.webp",
        "width": 2000,
        "height": 1333
      },
      {
        "order": 18,
        "src": "/portfolio/calendar/013-keiti/18.webp",
        "width": 2000,
        "height": 1333
      },
      {
        "order": 19,
        "src": "/portfolio/calendar/013-keiti/19.webp",
        "width": 2000,
        "height": 1323
      },
      {
        "order": 20,
        "src": "/portfolio/calendar/013-keiti/20.webp",
        "width": 2000,
        "height": 1333
      },
      {
        "order": 21,
        "src": "/portfolio/calendar/013-keiti/21.webp",
        "width": 2000,
        "height": 1333
      },
      {
        "order": 22,
        "src": "/portfolio/calendar/013-keiti/22.webp",
        "width": 2000,
        "height": 1196
      },
      {
        "order": 23,
        "src": "/portfolio/calendar/013-keiti/23.webp",
        "width": 2000,
        "height": 1196
      }
    ],
    "sourceDetailUrl": "https://www.touchagraphic.com/portfolio/pf_detail.html?idx=974&part_idx=21"
  },
  {
    "order": 14,
    "idx": 958,
    "title": "아이디어두잇 2022 캘린더",
    "company": "IDEA DO OT",
    "category": "Calendar",
    "date": "2022",
    "thumbnail": {
      "src": "/portfolio/calendar/014-ideadoit-2022/thumbnail.webp",
      "width": 890,
      "height": 596
    },
    "detailImages": [
      {
        "order": 1,
        "src": "/portfolio/calendar/014-ideadoit-2022/01.webp",
        "width": 2000,
        "height": 1334
      },
      {
        "order": 2,
        "src": "/portfolio/calendar/014-ideadoit-2022/02.webp",
        "width": 2000,
        "height": 1334
      },
      {
        "order": 3,
        "src": "/portfolio/calendar/014-ideadoit-2022/03.webp",
        "width": 2000,
        "height": 3000
      },
      {
        "order": 4,
        "src": "/portfolio/calendar/014-ideadoit-2022/04.webp",
        "width": 2000,
        "height": 3000
      },
      {
        "order": 5,
        "src": "/portfolio/calendar/014-ideadoit-2022/05.webp",
        "width": 2000,
        "height": 1334
      }
    ],
    "sourceDetailUrl": "https://www.touchagraphic.com/portfolio/pf_detail.html?idx=958&part_idx=21"
  },
  {
    "order": 15,
    "idx": 943,
    "title": "아이디어두잇 2021 캘린더 & 브로슈어",
    "company": null,
    "category": "Editorial",
    "date": "2020",
    "thumbnail": {
      "src": "/portfolio/calendar/015-ideadoit-2021-brochure/thumbnail.webp",
      "width": 1200,
      "height": 803
    },
    "detailImages": [
      {
        "order": 1,
        "src": "/portfolio/calendar/015-ideadoit-2021-brochure/01.webp",
        "width": 2000,
        "height": 1125
      },
      {
        "order": 2,
        "src": "/portfolio/calendar/015-ideadoit-2021-brochure/02.webp",
        "width": 2000,
        "height": 1123
      },
      {
        "order": 3,
        "src": "/portfolio/calendar/015-ideadoit-2021-brochure/03.webp",
        "width": 2000,
        "height": 1123
      },
      {
        "order": 4,
        "src": "/portfolio/calendar/015-ideadoit-2021-brochure/04.webp",
        "width": 2000,
        "height": 1123
      },
      {
        "order": 5,
        "src": "/portfolio/calendar/015-ideadoit-2021-brochure/05.webp",
        "width": 2000,
        "height": 1125
      },
      {
        "order": 6,
        "src": "/portfolio/calendar/015-ideadoit-2021-brochure/06.webp",
        "width": 2000,
        "height": 1123
      },
      {
        "order": 7,
        "src": "/portfolio/calendar/015-ideadoit-2021-brochure/07.webp",
        "width": 2000,
        "height": 1125
      },
      {
        "order": 8,
        "src": "/portfolio/calendar/015-ideadoit-2021-brochure/08.webp",
        "width": 2000,
        "height": 1125
      },
      {
        "order": 9,
        "src": "/portfolio/calendar/015-ideadoit-2021-brochure/09.webp",
        "width": 2000,
        "height": 1334
      },
      {
        "order": 10,
        "src": "/portfolio/calendar/015-ideadoit-2021-brochure/10.webp",
        "width": 2000,
        "height": 1334
      },
      {
        "order": 11,
        "src": "/portfolio/calendar/015-ideadoit-2021-brochure/11.webp",
        "width": 2000,
        "height": 1334
      },
      {
        "order": 12,
        "src": "/portfolio/calendar/015-ideadoit-2021-brochure/12.webp",
        "width": 2000,
        "height": 1333
      },
      {
        "order": 13,
        "src": "/portfolio/calendar/015-ideadoit-2021-brochure/13.webp",
        "width": 2000,
        "height": 1342
      },
      {
        "order": 14,
        "src": "/portfolio/calendar/015-ideadoit-2021-brochure/14.webp",
        "width": 2000,
        "height": 1125
      },
      {
        "order": 15,
        "src": "/portfolio/calendar/015-ideadoit-2021-brochure/15.webp",
        "width": 2000,
        "height": 1125
      },
      {
        "order": 16,
        "src": "/portfolio/calendar/015-ideadoit-2021-brochure/16.webp",
        "width": 2000,
        "height": 1125
      },
      {
        "order": 17,
        "src": "/portfolio/calendar/015-ideadoit-2021-brochure/17.webp",
        "width": 2000,
        "height": 1125
      },
      {
        "order": 18,
        "src": "/portfolio/calendar/015-ideadoit-2021-brochure/18.webp",
        "width": 2000,
        "height": 1125
      }
    ],
    "sourceDetailUrl": "https://www.touchagraphic.com/portfolio/pf_detail.html?idx=943&part_idx=21"
  },
  {
    "order": 16,
    "idx": 908,
    "title": "평창올림픽기념 설빙 달력형 포스터 디자인",
    "company": null,
    "category": "Graphic",
    "date": "2018",
    "thumbnail": {
      "src": "/portfolio/calendar/016-sulbing-pyeongchang/thumbnail.webp",
      "width": 628,
      "height": 420
    },
    "detailImages": [
      {
        "order": 1,
        "src": "/portfolio/calendar/016-sulbing-pyeongchang/01.webp",
        "width": 2000,
        "height": 2500
      },
      {
        "order": 2,
        "src": "/portfolio/calendar/016-sulbing-pyeongchang/02.webp",
        "width": 2000,
        "height": 2500
      },
      {
        "order": 3,
        "src": "/portfolio/calendar/016-sulbing-pyeongchang/03.webp",
        "width": 2000,
        "height": 1500
      },
      {
        "order": 4,
        "src": "/portfolio/calendar/016-sulbing-pyeongchang/04.webp",
        "width": 2000,
        "height": 1600
      },
      {
        "order": 5,
        "src": "/portfolio/calendar/016-sulbing-pyeongchang/05.webp",
        "width": 2000,
        "height": 2662
      },
      {
        "order": 6,
        "src": "/portfolio/calendar/016-sulbing-pyeongchang/06.webp",
        "width": 2000,
        "height": 2000
      },
      {
        "order": 7,
        "src": "/portfolio/calendar/016-sulbing-pyeongchang/07.webp",
        "width": 2000,
        "height": 2000
      },
      {
        "order": 8,
        "src": "/portfolio/calendar/016-sulbing-pyeongchang/08.webp",
        "width": 2000,
        "height": 1400
      },
      {
        "order": 9,
        "src": "/portfolio/calendar/016-sulbing-pyeongchang/09.webp",
        "width": 2000,
        "height": 1600
      },
      {
        "order": 10,
        "src": "/portfolio/calendar/016-sulbing-pyeongchang/10.webp",
        "width": 2000,
        "height": 1333
      }
    ],
    "sourceDetailUrl": "https://www.touchagraphic.com/portfolio/pf_detail.html?idx=908&part_idx=21"
  },
  {
    "order": 17,
    "idx": 827,
    "title": "대구오페라하우스 캘린더",
    "company": null,
    "category": "Calendar",
    "date": "2014",
    "thumbnail": {
      "src": "/portfolio/calendar/017-daegu-opera/thumbnail.webp",
      "width": 628,
      "height": 420
    },
    "detailImages": [
      {
        "order": 1,
        "src": "/portfolio/calendar/017-daegu-opera/01.webp",
        "width": 2000,
        "height": 1338
      },
      {
        "order": 2,
        "src": "/portfolio/calendar/017-daegu-opera/02.webp",
        "width": 2000,
        "height": 1337
      },
      {
        "order": 3,
        "src": "/portfolio/calendar/017-daegu-opera/03.webp",
        "width": 2000,
        "height": 1338
      }
    ],
    "sourceDetailUrl": "https://www.touchagraphic.com/portfolio/pf_detail.html?idx=827&part_idx=21"
  }
]

export function getCalendarProjectByIdx(idx: number): CalendarPortfolioProject | undefined {
  return CALENDAR_PORTFOLIO.find(p => p.idx === idx)
}
