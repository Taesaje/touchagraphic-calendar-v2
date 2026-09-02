현재 버전을 기준으로 이번에는 디자인 리디자인이 아니라
Header + 랜딩페이지 내부 견적 UX + 3/4번째 섹션 width hierarchy만 수정해줘.

중요:
Hero, TrustStrip, Portfolio의 디자인은 이번 작업에서 변경하지 않는다.


────────────────────────
1. Header navigation 제거
────────────────────────

현재 Header 중앙에 있는

About
Works
견적 확인하기
Contact

4개의 navigation 메뉴를 전부 제거해줘.

Header는 Desktop 기준:

왼쪽:
터치어그래픽

오른쪽:
제작 문의

만 남긴다.

현재 우측 버튼의

“견적 확인”

문구를

“제작 문의”

로 변경한다.


[제작 문의 버튼 동작]

이 버튼을 눌렀을 때 다른 화면으로 이동하지 않는다.

현재 랜딩페이지의

#contact

상담 문의 섹션까지 smooth scroll 하도록 변경한다.

예:

document
  .getElementById('contact')
  ?.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  })

방식.

고정 Header 때문에 제목이 가려지지 않도록
contact section에는 적절한 scroll-margin-top도 적용해줘.


────────────────────────
2. 3번째 / 4번째 섹션 폭 통일
────────────────────────

현재 페이지에서는

Hero:
max-width 1360px

Portfolio:
max-width 1440px

인데,

예상 견적:
max-width 1020px

상담 문의:
max-width 1000px

로 갑자기 좁아진다.

이 때문에 Portfolio 이후 페이지의 공간감이 갑자기 축소되어 보인다.

이번에는 예상 견적과 상담 문의의
outer container를 Hero의 기준에 맞춰줘.

Desktop 기준 공통 outer container:

max-width: 1360px
margin-left/right: auto
padding-left/right:
px-8 md:px-12

정도를 사용한다.

즉:

Hero
→ 1360

예상 견적
→ 1360

상담 문의
→ 1360

이라는 동일한 기본 grid를 사용한다.

Portfolio는 이미지 showcase이므로
현재의 1440px 구조를 그대로 유지한다.


중요:

내용을 무조건 좌우 끝까지 늘리라는 뜻은 아니다.

텍스트 자체는 읽기 좋은 width를 유지할 수 있다.

하지만 section의 전체 frame과 grid는
Hero와 동일한 넓은 container를 사용해야 한다.

현재처럼 1000~1020px짜리 작은 섹션이
페이지 중앙에 별도로 떠 있는 느낌은 없애줘.


────────────────────────
3. 예상 견적을 별도 페이지가 아닌
   Landing page 내부 기능으로 변경
────────────────────────

이 부분이 가장 중요하다.

현재 코드에서는

openEstimator()
→ setView('estimator')

방식으로 AppView 자체를 변경해서
Landing page가 사라지고
EstimatorPage가 별도 화면처럼 렌더링된다.

이 구조를 변경해줘.

앞으로

“예상 견적 확인하기”

버튼을 클릭하면
절대로 별도 페이지/별도 view로 이동하지 않는다.

대신 현재 Landing page 안의

#estimator

영역으로 smooth scroll 한다.


────────────────────────
4. 기존 Estimator 기능을 Landing 안으로 삽입
────────────────────────

현재 EstimatorCTA는

“조건을 선택하고
예상 견적을 확인해보세요.”

텍스트와 버튼만 보여주는 CTA 섹션이다.

이 영역을 실제 견적 계산 섹션으로 변경한다.

구조:

[섹션 헤더]

조건을 선택하고
예상 견적을 확인해보세요.

기존 설명

↓

[실제 견적 계산기]

기존 EstimatorPage에서 사용하던

- 등급 선택
- 옵션 선택
- 애드온
- 진행 조건
- 오른쪽 견적서
- 가격 계산
- 숫자 animation
- 상담 신청

기능을 그대로 이 영역 아래에 삽입한다.


중요:

기존 견적 계산 기능을 새로 만들지 않는다.

현재 EstimatorPage의 로직을 재사용한다.


────────────────────────
5. EstimatorPage를 Embedded component로 정리
────────────────────────

현재 EstimatorPage에는 별도 화면 전용 UI가 있다.

예:

- min-h-screen
- 별도 background page
- 상단 sticky estimator header
- ← 이전 화면
- PRINT ESTIMATE

이런 “별도 페이지용 wrapper”는
Landing 안에 들어왔을 때는 필요 없다.

견적 계산기의 실제 핵심 부분만 재사용할 수 있도록
컴포넌트를 구조적으로 분리해줘.

예:

EstimatorContent

또는

EstimatorInline

같은 component로 분리하고,

Landing에서는:

<section id="estimator">
  section heading
  <EstimatorInline />
</section>

형태로 사용한다.


Landing 안에서는 다음을 제거:

- ← 이전 화면
- Estimator 전용 sticky header
- 별도의 full-screen wrapper
- 별도 페이지처럼 보이게 만드는 min-h-screen


하지만 다음은 그대로 유지:

- Tier 선택
- 옵션
- addon
- 견적 계산
- 우측 견적서
- 실시간 금액 변경
- 견적서 복사
- 상담 신청 기능


────────────────────────
6. 모든 “예상 견적 확인” CTA 동작 통일
────────────────────────

Landing page 내에서

예상 견적 확인하기 →

관련 CTA를 누르면 모두

#estimator

로 smooth scroll 되도록 통일한다.

적용 대상:

- Hero의 “예상 견적 확인하기 →”
- 기존 Estimator CTA
- 상담 영역의 “견적 계산기로 이동”
- 그 외 동일한 목적의 CTA

이 버튼들로 AppView를 estimator로 변경하지 않는다.

#estimator로 이동한다.


고정 Header 때문에 섹션 헤더가 가려지지 않도록

#estimator

에도 scroll-margin-top을 적용한다.


────────────────────────
7. App 구조 정리
────────────────────────

현재:

type AppView =
'landing' | 'estimator' | 'consult'

구조에서

estimator를 별도의 page/view로 사용할 필요가 없어졌다.

가능하면 estimator view dependency를 제거해줘.

Landing은 항상 그대로 유지한다.

견적 CTA:
Landing 내부 scroll

상담 신청:
현재 ConsultForm flow는 이번 작업에서는 그대로 유지 가능

즉 이번 수정에서는
ConsultForm을 Landing 내부로 합치는 작업까지는 하지 않는다.


────────────────────────
8. 상담 문의 섹션 width
────────────────────────

현재 Consultation:

max-w-[1000px]

을 사용하고 있는데

Hero와 동일한:

max-w-[1360px]
px-8 md:px-12

outer container로 변경한다.

현재 2-column 콘텐츠 구조는 유지한다.

다만 넓어진 공간에서
각 column이 지나치게 멀어지지 않도록

grid column 비율,
column gap,
내부 text max-width

를 자연스럽게 조절한다.

중요한 것은:

“내용을 크게 키우는 것”

이 아니라

“페이지 전체의 outer grid가 갑자기 좁아지지 않는 것”

이다.


────────────────────────
9. 예상 견적 섹션 width
────────────────────────

Estimator section 역시

max-w-[1360px]
px-8 md:px-12

outer grid를 사용한다.

실제 estimator interface는
그 안에서 적절한 최대 폭을 사용할 수 있지만,

section heading부터 calculator까지
Hero와 동일한 horizontal axis 안에 있어야 한다.

왼쪽 시작선이 Hero / 다른 주요 섹션과
시각적으로 연결되어야 한다.


────────────────────────
10. 이번 작업에서 변경하지 말 것
────────────────────────

이번에는 아래를 수정하지 않는다.

- Hero typography
- Hero 이미지
- Hero spacing
- TrustStrip
- Portfolio
- Portfolio card size
- Portfolio carousel
- Portfolio overflow 구조
- FAQ
- Footer design
- 색상 시스템
- 폰트 시스템
- 견적 계산 가격 데이터
- 견적 계산 공식

새로운 디자인 요소,
badge,
icon,
영문 label,
새로운 section도 만들지 않는다.


────────────────────────
11. Responsive
────────────────────────

Desktop뿐 아니라 Mobile에서도 확인한다.

모바일 Header:

왼쪽:
터치어그래픽

오른쪽:
제작 문의

만 표시.

Estimator는 Landing 내부에서
1-column으로 자연스럽게 배치된다.

Desktop에서 오른쪽에 있던 견적서는
Mobile에서는 controls 다음에 아래로 내려온다.

horizontal overflow는 발생하면 안 된다.


────────────────────────
최종 검수 조건
────────────────────────

수정 완료 후 직접 확인해줘.

1.
Header에서
About / Works / 견적 확인하기 / Contact
가 모두 삭제되었는지

2.
Header 우측이
“제작 문의”
인지

3.
제작 문의 클릭 →
#contact smooth scroll 되는지

4.
Hero의
“예상 견적 확인하기”
클릭 →
별도 화면이 아니라
현재 페이지의 #estimator로 이동하는지

5.
견적 계산기가 실제로 Landing page 안에서 작동하는지

6.
Estimator용 별도 sticky header /
“이전 화면”이 Landing 안에 노출되지 않는지

7.
예상 견적과 상담 문의 outer width가
Hero와 같은 1360px grid 기준인지

8.
Portfolio 이후 갑자기 페이지가 좁아지는 느낌이 사라졌는지

9.
기존 견적 계산 기능과 금액 변경이 정상 작동하는지

10.
Mobile에서 horizontal overflow가 없는지


완료 후에는 아래만 보고해줘.

- Header 변경 내용
- Estimator를 inline으로 만든 방식
- Estimator / Consultation의 최종 max-width
- 예상 견적 CTA가 어떤 scroll handler를 사용하는지

그 외 새로운 디자인 제안은 하지 마.