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

## Work 자율 실행과 스몰비 Project 판단 연계

Work는 로컬 구현·검수·오류 수정을 자율적으로 끝내고, 스몰비 Project는 브랜드·디자인·마케팅·중요 구조의 상위 판단을 담당한다.
Work가 판단을 올릴 시점과 전달 내용을 먼저 정리하여, 사용자가 매번 두 환경 사이에서 무엇을 전달할지 결정하지 않도록 한다.
이 역할 구분은 기존 작업 범위·보호 영역 규칙을 보완하며, 승인된 방향 안의 실행에 불필요한 확인 절차를 추가하지 않는다.

### Work가 스몰비 Project로 판단을 올려야 하는 경우

- 디자인 방향이 2개 이상이고 브랜드 관점의 선택이 필요한 경우
- 사용자가 준 피드백의 의도가 애매하거나 여러 해석이 가능한 경우
- 중요한 정보 위계나 카피 의미를 새로 결정해야 하는 경우
- 기존 승인 구조를 크게 바꿔야 하는 경우
- 기능, 가격, 데이터, 라우팅 등 보호 영역 변경이 필요해진 경우
- 외부 레퍼런스 해석이나 마케팅/사업 관점 판단이 필요한 경우
- 작업 도중 예상하지 못한 큰 문제를 발견한 경우
- Work가 최선의 방향에 충분한 확신을 갖지 못하는 경우
- 작업 결과가 이후 프로젝트 전체의 기준점에 영향을 주는 경우

이 경우 Work는 해당 판단에 의존하는 작업을 멈추고, "스몰비 Project에서 상위 판단이 필요하다"고 알린다.
임의로 최종 결정하거나 추천안을 승인된 방향처럼 구현하지 않는다.
이미 사용자가 확정한 결정을 그대로 구현하는 일은 새 상위 판단으로 취급하지 않는다.

Work는 실제 코드·Git·브라우저에서 확인한 사실과 아직 확인하지 못한 내용을 구분하고, 아래 형식을 채운 복사 가능한 전달 블록을 만든다.
경로, 관련 코드 위치, 화면 검수 결과 등 결정에 필요한 근거를 간결하게 포함한다.

```text
[스몰비 Project 전달 필요]

현재 작업:
...

확인된 실제 상태:
...

Work가 발견한 문제:
...

결정이 필요한 것:

1. ...
2. ...

Work의 추천:
...

추천 이유:
...

결정 후 Work에서 이어서 할 작업:
...
```

블록과 함께 사용자에게 "이 내용을 스몰비 Project 채팅에 전달한 뒤 결정 결과를 다시 가져와 달라"고 명확하게 안내한다.
결정 결과가 돌아오면 현재 실제 로컬 상태와 대조한 뒤, 그 결정 범위 안에서 구현·localhost 검수·필요한 재수정·build를 이어서 수행한다.

### Work 안에서 계속 처리해도 되는 경우

- 이미 방향이 확정된 구현
- spacing / font-size / width 등의 미세조정
- 확정된 카피 교체
- build
- git diff / status 확인
- horizontal overflow / responsive 검수
- localhost 브라우저 재검수
- 명백한 코드 오류 수정
- 기존 승인 구조 안에서의 작은 UI 수정

이 경우 불필요하게 스몰비 Project로 판단을 올리거나 사용자에게 단순 구현·검수의 선택을 반복해서 묻지 않는다.
다만 수행 중 위의 상위 판단 사유가 새로 발생하면 해당 판단이 필요한 지점에서 멈춘다.

## 다중 Windows PC 작업과 Git 체크포인트

이 프로젝트는 여러 Windows PC에서 작업할 수 있다. PC마다 로컬 경로는 다를 수 있으므로 과거 경로를 그대로 가정하지 않는다.
Git과 실제 코드가 항상 source of truth이며 과거 채팅 내용보다 우선한다.

### 새 PC 또는 새 Work Local 세션 시작

아래 순서로 확인한다. 1~5는 기존 "세션 시작 시 필수 읽기"에 앞서 수행하는 저장소 안전 점검이다.
문서의 BUILDING_PROFILE → PROJECT_NOW 우선순위와, 상세 이력이 필요할 때만 PROJECT_STATUS 관련 부분을 읽는 기존 원칙은 유지한다.

1. 현재 로컬 repository 위치 확인 (`git rev-parse --show-toplevel`)
2. current branch 확인 (`git branch --show-current`)
3. git status 확인 (staged / unstaged / untracked를 구분)
4. remote와 로컬의 차이 확인 (remote URL과 upstream 확인, 가능하면 `git fetch origin` 후 `origin/v2-redesign`과의 차이 확인)
5. 필요하면 최신 `origin/v2-redesign` 상태 반영
6. `BUILDING_PROFILE.md` 읽기
7. `PROJECT_NOW.md` 읽기
8. `AGENTS.md` 읽기

그 다음 필요한 상세 이력과 작업 대상 실제 코드를 확인한다.
fetch는 작업 파일을 합치는 작업과 구분한다. 원격 확인에 실패하면 최신 상태라고 단정하지 않고 확인 한계를 보고한다.

로컬에 미커밋 변경이 있으면 무조건 pull / merge / reset하지 말고 먼저 상태를 보고한다.
untracked 파일도 별도로 보고하고, 자동 삭제·staging하거나 동기화 과정에서 덮어쓰지 않는다.
작업 트리가 안전하고 `v2-redesign`이 원격보다 뒤에만 있는 경우에는 fast-forward 방식으로 반영한다.
브랜치가 다르거나 이력이 갈라진 경우에는 임의의 checkout / merge / reset으로 맞추지 않고 차이와 안전한 다음 단계를 보고한다.

### PC를 바꾸기 전

- 완료된 작업은 검수와 build 후 commit/push하여 GitHub에 체크포인트를 남긴다. 이때 기존 PROJECT_NOW 유지 규칙도 따른다.
- commit/push 전 diff와 staging 대상을 확인하고 이번 작업과 무관한 파일을 임의로 포함하지 않는다.
- 사용자가 commit/push 금지 또는 수정 범위를 명시한 경우 그 지시를 우선하며, 체크포인트가 남지 않은 상태임을 알린다.
- 미커밋 변경은 다른 PC에서 자동으로 이어지지 않는다.
- untracked 파일 역시 Git에 포함되지 않으면 다른 PC로 전달되지 않는다.
- Work는 repository / branch / 실제 commit SHA / push 결과 / 남은 미커밋·untracked 항목 / 다음 작업을 간결하게 정리해 사용자가 새 PC에서 이어갈 정보를 준비한다.
