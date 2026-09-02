# figma-make-app

React + Vite + Tailwind CSS project. It was scaffolded in Figma Make; ongoing work is done locally in Claude Code.

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
