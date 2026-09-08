# figma-make-app

React + Vite + Tailwind CSS project. It was scaffolded in Figma Make; ongoing work is done locally in Claude Code.

## 세션 시작 시 필수 읽기

이 프로젝트에서 작업을 시작하기 전에 반드시 다음 순서로 확인한다.

1. `BUILDING_PROFILE.md`
   - 사용자의 작업 방식
   - 판단 기준
   - Pain Point
   - 도구 선택 원칙
   - "방법이 아니라 목표에 최적화한다"는 최상위 원칙
   을 확인한다.

2. `PROJECT_NOW.md`
   - 존재하는 경우 현재 작업 상태와 바로 다음 작업을 확인한다.

3. `PROJECT_STATUS.md`
   - 상세 이력이나 과거 결정이 필요한 경우 관련 섹션만 찾아 읽는다.
   - 새 세션마다 전체 문서를 처음부터 끝까지 읽는 것을 기본값으로 하지 않는다.

4. 실제 코드와 Git 상태
   - 문서와 코드가 다르면 실제 코드/Git 상태가 source of truth다.

사용자가 특정 도구나 방법을 요청하더라도,
더 본질적이고 효율적인 방법이 있다면
BUILDING_PROFILE.md의 원칙에 따라 먼저 제안한다.

단 새로운 도구를 무분별하게 권하지 말고
전환 비용과 장기 효율을 함께 판단한다.

## PROJECT_NOW 유지 규칙

`PROJECT_NOW.md`는 현재 상태만 담는 문서다.

실제 기능/디자인/구조/배포 상태가 바뀌는 작업을 완료했을 때는
작업 종료 전에 `PROJECT_NOW.md`도 현재 상태에 맞게 갱신한다.

사용자가 매번 별도로
"PROJECT_NOW를 업데이트해라"
라고 요청할 필요가 없어야 한다.

단 다음 원칙을 지킨다.

1. 과거 작업 이력을 append하지 않는다.
   항상 현재 상태로 덮어쓴다.

2. commit SHA, modified/untracked 파일 목록처럼
   빠르게 변하는 Git 상태를 PROJECT_NOW.md에 고정하지 않는다.
   이런 정보는 세션 시작 시 실제 Git에서 확인한다.

3. 완료되지 않은 작업은
   완료된 것처럼 기록하지 않는다.

4. 실제 화면 검수가 필요한 디자인 작업은
   코드 작성/build 성공만으로 "완료" 처리하지 않는다.

5. PROJECT_NOW.md는 짧게 유지한다.
   상세 히스토리는 PROJECT_STATUS.md에 남긴다.

6. 작업의 결과가 현재 프로젝트 상태를 바꾸지 않는 경우
   PROJECT_NOW.md를 억지로 수정하지 않는다.

예:
- 단순 조사
- 질문 답변
- 임시 테스트
- 실패한 실험
- 코드 변경 없는 진단

7. `npm run publish:v2`로 작업을 종료하기 전에는
   PROJECT_NOW.md가 현재 실제 상태와 맞는지 확인한다.

## Development Server

This project originated in Figma Make, but work now happens locally in Claude Code. **No dev server runs automatically here** — start one yourself only when you need to see the site in a browser.

- Start it when needed: `npm run dev` (Vite; serves on `$PORT`, default 8443)
- Open the local URL that Vite prints and verify the change in the browser
- Hot reload: while `npm run dev` is running, edits to source files show up immediately
- The server does not need to stay running for editing, formatting, or `npm run build`; stop it when you are done
- Ignore any older wording that assumes a preview panel or an always-on server — that was the Figma Make environment, not this one

## Project Structure

This is the canonical project structure. Start with task-relevant files below. Only follow imports or inspect other files when required, when a documented path is missing, or when the repository contradicts this guide.

- `src/main.tsx` - React entrypoint; imports `src/index.css` and mounts `src/App.tsx` into the `#root` element
- `src/App.tsx` - Primary application component and the usual starting point for UI work
- `src/index.css` - Global CSS entrypoint and Tailwind CSS v4 import
- `index.html` - Vite HTML shell containing the `#root` element and loading `src/main.tsx`
- `package.json` - Project dependencies and the Vite build, development, preview, and formatting scripts
- `vite.config.ts` - Vite configuration with React, Tailwind CSS v4, and Figma Make plugins plus the `@` alias for `src`
- `.mise.toml` - Toolchain versions for Node.js and pnpm

## Dependencies

- Runtime: React 19 and React DOM 19
- Styling: Tailwind CSS v4 with the `@tailwindcss/vite` plugin
- Build tooling: Vite 8, TypeScript 5.7, and `@vitejs/plugin-react`
- Formatting: oxfmt

## Styling

This project uses **Tailwind CSS v4** through the `@tailwindcss/vite` plugin configured in `vite.config.ts`. `src/index.css` imports Tailwind with `@import 'tailwindcss';`. Use Tailwind utility classes directly in JSX and put global CSS or Tailwind v4 theme customization in `src/index.css`. This scaffold does not need a Tailwind config file or PostCSS config.

`src/main.tsx` imports `src/index.css`, so global font wiring belongs in `src/index.css`. Keep CSS `@import` statements first, then add any `@font-face` rules and font-family defaults there.

## Code quality

- Use double quotes for strings containing apostrophes (`"We're here to help"`), or escape them in single-quoted strings. An unescaped apostrophe in a single-quoted string breaks the build.
- Ensure JSX tags are closed and braces are balanced.
- Export components as default exports.

## Where things live (this project)

- `src/App.tsx` holds the entire landing page: every section component (`Header`, `Hero`, `TrustStrip`, `Portfolio`, `EstimatorSection` → `EstimatorInline`, `Consultation`, `FAQ`, `Footer`) plus the `ConsultForm` view live in this one file.
- The estimator currently in use is `EstimatorInline` (with `EstimatorSection` as its wrapper) and its data source `TIER_DATA` / `TIER_ORDER`. `EstimatorPage` and the helpers `getImageFor` / `getRecommendedPath` / `getHeroImage` / `getSubThumbs` / `MATERIAL_OPTS`…`PACKAGING_OPTS` are unused legacy from before the estimator was inlined — do not edit them when changing the estimator.
- `src/index.css` holds the global design system: font `@import`s, the Tailwind v4 `@theme` tokens (`--color-ivory`, `--color-ink*`, `--color-accent` `#D65A34` / `--color-accent-dark` `#B84A28`, `--font-family-*`), global `body` rules including `word-break: keep-all`, and the `.slip-perf` estimate-slip perforation effect.
- Colors and fonts are also hard-coded inline in many places in `src/App.tsx` (accent literals `#D65A34` / `#B84A28` / `#d6392c`, and `fontFamily: 'Noto Serif KR' / 'Noto Sans KR'`). Changing a token in `src/index.css` alone will not update these — search `src/App.tsx` too.
- Shared container width: normal sections use `max-w-[1360px] mx-auto px-8 md:px-12`; `Portfolio` intentionally uses `max-w-[1440px]`.

## Project-specific working rules

1. 요청받지 않은 섹션이나 컴포넌트는 수정하지 않는다.
2. 한 번에 한 섹션 또는 한 종류의 문제만 수정한다.
3. 수정하기 전에 관련 코드를 먼저 읽고 현재 구조와 의도를 파악한다.
4. 기존 기능, 상태 관리, 링크, 인터랙션, 데이터는 디자인 수정 때문에 임의로 변경하지 않는다.
5. 견적 계산기의 가격 데이터와 계산 로직은 명시적으로 요청받지 않는 한 절대 변경하지 않는다.
6. 견적 계산기를 수정할 때는 현재 실제 사용 중인 `EstimatorInline`을 우선 확인하고, 미사용 레거시 견적 코드(`EstimatorPage` 등)를 실수로 수정하지 않는다.
7. 한국어가 핵심 정보의 1차 표현이어야 한다.
8. 새로운 badge, eyebrow, gradient, rounded-card, icon 등을 디자인 개선이라는 이유로 임의 추가하지 않는다.
9. 요청받지 않은 새로운 감성 카피나 마케팅 문구를 임의로 만들지 않는다.
10. 기존 editorial / print-studio 톤을 유지하고 typography, whitespace, imagery를 우선해서 완성도를 높인다.
11. accent 색상은 CTA, 선택 상태 등 행동 지점에 제한적으로 사용한다.
12. 외부 레퍼런스는 구조, 정보 위계, interaction 원리만 참고하고 색상, 폰트, 장식을 그대로 복제하지 않는다.
13. 디자인 수정은 가능한 한 최소 범위로 한다. 한 부분 요청 때문에 전체 페이지 스타일을 재설계하지 않는다.
14. 데스크톱뿐 아니라 모바일 반응형도 항상 고려한다.
15. 수정 후 horizontal overflow, 잘림, 레이아웃 깨짐 여부를 확인한다.
16. 수정 완료 후 `npm run build`를 실행해 빌드 오류가 없는지 확인한다.
17. 전체 디자인 / 폰트 / 글로벌 스타일은 주로 `src/index.css`를 확인한다.
18. 개별 섹션, 컴포넌트, 레이아웃, 인터랙션 수정은 주로 `src/App.tsx`의 해당 부분만 수정한다.
19. `fontFamily`가 인라인으로 지정된 부분이 있을 수 있으므로 폰트 변경 시 `src/index.css`와 `src/App.tsx` 양쪽을 확인한다.
20. 사용자가 명확히 요청하지 않은 리팩터링, 파일 구조 변경, 라이브러리 교체는 하지 않는다.
