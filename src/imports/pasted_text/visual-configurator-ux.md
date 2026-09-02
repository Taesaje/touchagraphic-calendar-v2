현재 견적 계산기는 option row 구조까지는 개선되었지만,
아직 “현대적인 폼” 수준이고,
첨부한 Sincerely configurator처럼 제품을 자연스럽게 구성해나가는 UX에는 도달하지 못했다.

이번 작업의 목표는 단순 styling이 아니라

“visual configurator + progressive interaction”

으로 한 단계 발전시키는 것이다.

첨부 이미지 중

- 현재 Touchgraphic 견적 화면 = 수정 대상
- Sincerely configurator = UX / motion / visual option reference

로 사용한다.

매우 중요:

Sincerely의
흰색 화면, 파란색, 제품 배치, 헤더 디자인을 복제하지 않는다.

현재 Touchgraphic의
ivory / ink / orange 디자인 시스템과
왼쪽 configuration + 오른쪽 견적서 구조는 유지한다.

가져올 것은 다음 3가지다.

1. 옵션을 이미지로 빠르게 이해하는 방식
2. 선택 → 접힘 → 다음 항목 열림의 자연스러운 progressive flow
3. selected / unselected 상태가 즉시 이해되는 interaction


────────────────────
1. 잘못된 초기 선택 상태부터 수정
────────────────────

현재 getOptIdx()가 선택되지 않은 경우에도 0을 반환하고 있어서
사용자가 실제로 선택하지 않았는데 첫 번째 옵션이 선택된 것으로 처리되고 있다.

이 구조를 수정한다.

선택하지 않은 경우에는 undefined 또는 null 상태가 존재해야 한다.

즉 처음 진입하면:

사이즈
옵션을 선택해주세요 0/1

이어야 한다.

사용자가 실제로 옵션을 클릭한 이후에만:

✓ 선택 완료 1/1

로 표시한다.

오른쪽 견적서 SPEC 역시
실제 사용자가 선택한 값만 선택값으로 취급한다.


────────────────────
2. Option interaction을 부드러운 progressive flow로 변경
────────────────────

현재 accordion이 열리고 닫힐 때
콘텐츠가 즉시 나타나거나 사라지는 느낌을 줄이지 말고
실제 transition을 적용한다.

목표 interaction:

사용자가 옵션 선택
→ selected row가 약 150~200ms 동안 자연스럽게 강조
→ 현재 section이 약 250~320ms 동안 부드럽게 접힘
→ 다음 section이 약 250~320ms 동안 자연스럽게 열림

형태.

단순 display:none / conditional instant mount처럼
탁탁 바뀌는 느낌을 피한다.

CSS transition을 사용해서

height 또는 grid-template-rows
opacity
translateY

정도를 조합한다.

추천 easing:

cubic-bezier(0.22, 1, 0.36, 1)

정도의 자연스러운 ease-out.

과도한 bounce / spring 효과는 사용하지 않는다.


────────────────────
3. Accordion animation 구조
────────────────────

Option content를 단순히

{isOpen && (...)}

로 순간 mount/unmount하는 구조보다

animation 가능한 wrapper 안에 유지하는 방식을 우선 검토한다.

예:

display:grid
grid-template-rows:
open → 1fr
closed → 0fr

transition:
grid-template-rows 280ms cubic-bezier(...)

내부:
overflow:hidden

그리고 내부 option rows에는

opacity
transform: translateY(...)

transition도 가볍게 적용한다.

Chevron 역시 현재처럼 회전시키되
동일한 easing과 duration을 사용한다.


────────────────────
4. 사이즈 옵션을 Visual Choice로 변경
────────────────────

현재:

A · 가로형
B · 세로형
C · 정사각
D · 와이드

가 텍스트 row로만 표시된다.

이 부분은 시각적으로 바로 비교할 수 있게 만든다.

각 row 왼쪽에 약 72~88px 크기의
visual thumbnail area를 추가한다.

단 존재하지 않는 제품 사진을 임의로 만들지 않는다.

사이즈 옵션에는 제품 사진 대신
미니멀한 calendar proportion diagram을
CSS 또는 inline SVG로 직접 만든다.

예:

A · 가로형
→ 가로형 캘린더 실루엣

B · 세로형
→ 세로형

C · 정사각
→ 정사각형

D · 와이드
→ 더 긴 가로형

thumbnail은

white / very light neutral background
+
thin ink outline

정도의 매우 단순한 그래픽으로 만든다.

목적은 장식이 아니라
사용자가 형태 차이를 1초 안에 이해하게 만드는 것이다.


────────────────────
5. 사이즈 Option Row 구조
────────────────────

각 row:

[ visual thumbnail ]

A · 가로형
짧은 사양 설명 영역

                              selected check

형태.

현재 실제 규격 데이터가 없다면
가짜 mm 수치를 만들지 않는다.

sub text가 필요하지 않으면
option name만 표시한다.

향후 실제 규격 데이터가 추가될 수 있도록
component 구조는

thumbnail
title
description(optional)
priceDelta(optional)

형태로 설계한다.


────────────────────
6. 표지 스타일에는 실제 이미지 사용
────────────────────

“표지 스타일”은 이미지가 선택 판단에 매우 중요하다.

현재 프로젝트 asset 중
각 옵션과 실제로 의미가 일치하는 이미지가 있을 때만
thumbnail로 사용한다.

예:

불꽃양 그래픽
→ 실제 불꽃양 캘린더 표지 asset

2027 타이포그래피
→ 실제 해당 디자인 asset이 존재하면 그것을 사용

정확히 대응되는 asset을 찾을 수 없다면
임의의 다른 이미지를 해당 옵션 이미지라고 속여서 사용하지 않는다.

그 경우에는 placeholder가 아니라
neutral visual tile을 사용하고
향후 asset 연결이 쉽도록 구조화한다.


────────────────────
7. 내지 레이아웃도 Visual Choice로 변경
────────────────────

2분할
4분할
5분할
미니 달력형

역시 텍스트만 보여주지 않는다.

각 레이아웃 구조를
간단한 inline SVG / CSS wireframe thumbnail로 표현한다.

예:

2분할
→ 페이지 안에 큰 2개 영역

4분할
→ 2 × 2 grid

5분할
→ 실제 개념을 이해할 수 있는 5영역 diagram

미니 달력형
→ 큰 콘텐츠 영역 + 작은 calendar grid

정도로 보여준다.

실제 최종 디자인을 가짜로 만들어 보여주는 것이 아니라
“레이아웃 구조”만 시각화한다.


────────────────────
8. Option row 크기 및 visual hierarchy
────────────────────

이미지가 들어가면서 현재 56px row는 너무 작다.

Desktop 기준:

min-height:
약 88~104px

thumbnail:
약 72~80px

padding:
12~16px

정도로 조정한다.

option이 4개여도 지나치게 무거운 카드 묶음처럼 보이지 않게 한다.

border-radius:
0~2px 유지

shadow:
사용하지 않는다.

selected state:

accent border
+
아주 옅은 accent tint
+
check

정도만 사용한다.


────────────────────
9. Hover / press interaction
────────────────────

Desktop hover:

unselected option에 마우스를 올리면

border color가 조금 진해지고
background가 아주 약하게 변한다.

thumbnail을 과도하게 확대하지 않는다.

선택 시:

row가 살짝 강조되면서
check가 fade/scale-in 되는 정도의
micro interaction을 적용한다.

예:

check:
opacity 0 → 1
scale .85 → 1

약 160~200ms.


────────────────────
10. 다음 옵션 자동 진행
────────────────────

사용자가 사이즈를 선택하면

현재 사이즈 section이 접히고
다음 “표지 스타일” section이 자연스럽게 열린다.

필요한 경우 다음 section header가
viewport 안에 자연스럽게 들어오도록

scrollIntoView({
 behavior:'smooth',
 block:'nearest'
})

정도의 보조 동작을 사용할 수 있다.

단 페이지가 갑자기 크게 점프하면 안 된다.

사용자가 이전 option header를 누르면
언제든 다시 열어서 수정 가능해야 한다.


────────────────────
11. 완료된 section의 요약 표시
────────────────────

section이 닫힌 뒤 header에서

사이즈        B · 세로형        ✓

처럼
현재 선택값 자체를 확인할 수 있게 하는 것을 권장한다.

지금의

✓ 선택 완료 1/1

만 보여주는 것보다
무엇을 골랐는지 기억할 수 있어야 한다.

Desktop 예:

사이즈
B · 세로형        ✓

또는 작은 secondary text로 표시.

0/1, 1/1 숫자는 UX상 꼭 필요하지 않다면
시각적 우선순위를 낮춘다.

핵심은
“완료했는가”보다
“무엇을 선택했는가”다.


────────────────────
12. Tier 선택 UI도 interaction 통일
────────────────────

Template Plan
Custom Basic
Custom High-End

영역 역시 현재 선택 상태가 명확해야 한다.

이번 작업에서 크게 리디자인하지 않되

- hover
- selected transition
- underline movement / accent transition

을 옵션 UI와 동일한 motion language로 통일한다.

과도한 tab animation은 사용하지 않는다.


────────────────────
13. 오른쪽 견적서 반응
────────────────────

왼쪽 option이 변경될 때
오른쪽 SPEC 값이 순간적으로 딱 바뀌는 느낌을 줄인다.

값이 변경되면

old value opacity down
→ new value opacity up

정도의 150~220ms subtle transition을 적용할 수 있다.

총 견적 숫자 animation은 기존 기능을 유지한다.

견적서 자체의 구조는 변경하지 않는다.


────────────────────
14. Motion accessibility
────────────────────

prefers-reduced-motion: reduce

환경에서는
모든 slide / translate animation을 최소화하거나 제거한다.

기능은 동일하게 유지한다.


────────────────────
15. Responsive
────────────────────

Desktop:
현재 left configurator + right estimate 구조 유지.

Tablet / Mobile:

Option thumbnail이 지나치게 작아지지 않게 한다.

Option row:

thumbnail
+
text
+
selected indicator

구조를 유지한다.

Mobile에서는 필요한 경우
thumbnail 약 60~68px로 축소한다.

native select로 다시 fallback하지 않는다.


────────────────────
16. 변경하지 말 것
────────────────────

이번에는 변경 금지:

- 견적 계산 공식
- 가격 데이터
- tier 데이터
- breakdown
- 오른쪽 견적서 구조
- 상담 신청 flow
- Landing 다른 section
- 전체 brand color
- 전체 font system

새로운 가짜 가격
가짜 제품 규격
가짜 제품 사진

을 만들지 않는다.


최종 목표는:

“옵션이 나열된 견적 폼”

이 아니라

“제품을 하나씩 구성하면서
결과와 가격을 즉시 확인하는 visual configurator”

처럼 느껴지게 하는 것이다.

Sincerely의 디자인을 복제하지 않고,
Sincerely에서 느껴지는

visual clarity
progressive disclosure
smooth continuity
immediate feedback

를 Touchgraphic의 스타일 안에서 구현해줘.

완료 후에는 다음만 보고해줘.

1. 초기 unselected state를 어떻게 수정했는지
2. accordion animation 구현 방식
3. 사이즈 / 표지 / 내지에 어떤 visual thumbnail 방식을 사용했는지
4. 선택 후 다음 단계 전환 방식
5. 오른쪽 견적서 값 변화에 적용한 transition