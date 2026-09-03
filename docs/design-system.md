# MOVE ON UI/UX Design System

> Status: Gate 07 승인사항 반영본  
> Approved direction: **Pixel Adventure × Editorial Product Portfolio**  
> Career positioning: **0→1 Product Manager**, supported by Product × Brand × Commerce execution experience  
> Scope: 승인된 UI/UX 원칙과 1차 디자인 토큰. `Still pending` 항목과 실제 구현은 별도 승인 후 확정한다.

## 1. Reference hierarchy

### Primary reference — `UI:UX(2).png`

전체 화면 흐름과 핵심 UX의 기준으로 사용한다.

- 밝은 온보딩에서 캐릭터가 사용자를 안내하고, 어두운 월드 화면으로 진입하는 장면 전환
- BUILD / ITERATE / UNDERSTAND 세 개의 섬을 통한 역량 및 프로젝트 분류
- 월드맵, 프로젝트 선택 카드, 진행 상태, 배지, 도움말의 게임형 정보 구조
- 픽셀 프레임과 장면 그래픽을 사용하되 핵심 텍스트와 CTA는 명확하게 분리하는 방식

### Supporting references — first three images

화면 구조나 사용자 흐름을 복제하지 않고 시각 언어에만 활용한다.

- 하늘색·애시드 라임·핑크·그린의 강한 컬러 블록
- 픽셀 디스플레이 서체와 읽기 쉬운 산세리프 본문의 대비
- 스티커, 커서, 픽셀 아이콘, 계단형 외곽선
- 큰 제목, 작은 메타데이터, 비대칭 이미지 배치가 공존하는 에디토리얼 레이아웃
- 흰 여백과 검은 면을 적극적으로 교차하는 고대비 구성

레퍼런스에 포함된 브랜드, 캐릭터, 제품 이미지, 문구 및 구체적 그래픽은 복제하지 않는다.

## 2. Design concept and principles

### Concept

MOVE ON은 Sophie의 커리어를 탐험 가능한 세계로 번역한다. 사용자는 캐릭터의 안내를 받아 세 가지 역량 영역을 둘러보지만, 실제 목적은 게임 완주가 아니라 Sophie의 문제 정의, 의사결정, 기여 범위와 임팩트를 빠르게 검토하는 것이다.

Career Positioning은 **0→1 Product Manager**를 중심으로 표현한다. Product × Brand × Commerce 경험은 0→1 제품을 발견하고 설계하고 시장에 실행한 범위를 설명하는 보조 축으로 사용하며, 중심 직무 타이틀과 경쟁하지 않는다.

### Experience promise

**Playful at the entrance, rigorous in the evidence.** 첫인상은 기억에 남고 탐험적이어야 하며, 프로젝트를 읽는 순간에는 정보 구조가 차분하고 검증 가능해야 한다.

### Principles

1. **Evidence before decoration** — 픽셀 그래픽은 실제 프로젝트 설명을 돕는 표지와 내비게이션으로만 사용한다.
2. **Recruiter-first readability** — 30초 안에 포지셔닝, 대표 프로젝트, 역할과 핵심 성과를 파악할 수 있어야 한다.
3. **Exploration without obstruction** — 게임형 선택과 발견의 즐거움은 제공하되 콘텐츠 접근을 잠그지 않는다.
4. **Two-speed experience** — 월드 화면은 탐험적으로, Case Study는 에디토리얼 문서처럼 빠르게 스캔 가능하게 만든다.
5. **One semantic accent per project** — BUILD, ITERATE, UNDERSTAND 색상은 분류와 이동을 돕는 의미 체계로 사용한다.
6. **Progressive disclosure** — Home → Project Preview → Full Case Study 순으로 정보 밀도를 높인다.
7. **Authentic contribution** — 개인 기여와 팀 성과를 시각적으로 구분하고 확인되지 않은 정보는 상태 라벨로 표시한다.

## 3. User flow

### Primary flow

1. **Welcome / Orientation (Light Mode)**
   - 3단계 장면으로 MOVE ON과 오리지널 가이드 캐릭터 춘이를 짧게 소개한다.
   - `Enter portfolio`를 기본 CTA로 제공한다.
   - 최초 방문에만 기본 노출하며 `Skip intro`로 즉시 World Overview에 진입할 수 있다.
2. **World Overview (Dark Mode)**
   - Intro 완료 후의 기본 도착점이다.
   - Career Positioning, 세 역량 영역, 대표 프로젝트를 한 화면 또는 초기 스크롤 안에서 보여준다.
   - 각 섬에는 영역명, 한 줄 역량 설명, 대표 프로젝트 수를 표시한다.
   - 재방문자는 이 화면으로 바로 이동하며 `Replay intro`로 온보딩을 다시 볼 수 있다.
3. **Project Selection (Dark Mode)**
   - BUILD / ITERATE / UNDERSTAND 필터와 프로젝트 카드를 제공한다.
   - 각 프로젝트는 세 분류 중 하나의 primary category만 가진다. 실제 프로젝트 배정은 아직 확정하지 않는다.
   - 모든 프로젝트는 처음부터 열람 가능하다. 권장 순서만 번호와 강조로 안내한다.
4. **Project Preview**
   - 문제, Sophie의 역할, 핵심 결과, 기간을 요약한다.
   - `Read case study`와 `View all projects`를 동시에 제공한다.
5. **Case Study (Case Study Mode)**
   - Problem → Context → Insight → Decision → Execution → Result → Learning 순으로 읽는다.
   - sticky 목차, 진행 표시, 이전/다음 프로젝트 이동을 제공한다.
6. **About / Experience / Contact**
   - 전역 내비게이션에서 언제든 접근할 수 있으며 게임 진행과 무관하다.

### Fast path for recruiters

`Skip intro` → `World Overview` → `Selected Projects` → 프로젝트 카드의 Role/Impact 확인 → Case Study의 Summary/Contribution/Result → Contact

### Return and recovery

- 뒤로가기를 사용해도 선택한 필터와 스크롤 맥락을 가능한 범위에서 유지한다.
- 모든 깊은 화면에서 `Back to projects`를 제공한다.
- URL 직접 접근 시에도 온보딩 완료나 배지 획득을 요구하지 않는다.
- 최초 방문 여부와 intro 완료 상태는 브라우저 로컬 상태로 관리하며, 상태를 읽을 수 없거나 초기화된 경우에도 `Skip intro`를 제공한다.

## 4. Screen modes

### Light Mode — Welcome and orientation

- 역할: 첫인상, 브랜드 소개, 사용법 안내
- 배경: 따뜻한 오프화이트
- 텍스트: 잉크 블랙
- 표현: 넓은 여백, 말풍선, 작은 픽셀 장식, 단일 primary CTA
- 제한: 3개의 짧은 장면. 최초 방문에만 기본 노출하고 자동 진행하지 않으며 즉시 건너뛸 수 있어야 한다. 재방문 시에는 World Overview의 `Replay intro`를 통해 접근한다.

### Dark Mode — World and project discovery

- 역할: 역량 영역 탐색, 프로젝트 비교, 진행 맥락 표시
- 배경: 블루 블랙
- 텍스트: 소프트 화이트
- 표현: 섬/카드의 accent outline, 픽셀 프레임, 제한된 환경 장식
- 제한: 어두운 장면에서도 본문 대비와 카드 경계가 명확해야 한다. 장식이 카드 제목이나 CTA를 침범하지 않는다.

### Case Study Mode — Focused editorial reading

- 역할: 긴 서사, 근거, 기여도와 결과의 정독
- 기본 배경: 오프화이트. 프로젝트 accent는 라벨, 링크, 구분선, 핵심 수치에만 사용
- 본문 열은 좁고 안정적으로 유지하며 이미지와 데이터는 별도 와이드 트랙을 사용할 수 있다.
- 게임 HUD 대신 문서형 목차와 읽기 진행률을 사용한다.
- Light Mode를 기본으로 고정한다. Dark Mode는 Evidence Gallery 등 제한된 구간에만 사용하며 전체 본문을 장시간 dark surface에 두지 않는다.

## 5. Foundation colors

아래 값은 승인된 **1차 디자인 토큰**이다. 구현 QA에서 실제 조합별 WCAG 대비를 검증하고, 기준을 충족하지 못하는 조합만 조정한다.

| Token | Value | Usage |
|---|---:|---|
| `canvas-light` | `#F7F3E8` | Light/Case Study 기본 배경 |
| `canvas-white` | `#FFFEF8` | 카드, 본문 surface |
| `canvas-dark` | `#071014` | World 기본 배경 |
| `surface-dark` | `#0D171B` | Dark 카드와 패널 |
| `surface-dark-raised` | `#142126` | hover/raised dark surface |
| `ink-strong` | `#111111` | Light 기본 텍스트 |
| `ink-muted` | `#5F625F` | Light 보조 텍스트 |
| `paper-strong` | `#F7F5EC` | Dark 기본 텍스트 |
| `paper-muted` | `#AEB8B6` | Dark 보조 텍스트 |
| `line-light` | `#D8D4CA` | Light 구분선 |
| `line-dark` | `#3B484A` | Dark 구분선 |
| `focus` | `#FFFFFF` / `#111111` | 배경에 따른 외부 focus ring |
| `success` | `#35C979` | 완료/검증 상태 |
| `warning` | `#F4B942` | 확인 필요/주의 상태 |
| `danger` | `#E85B63` | 오류 상태만 사용 |

### Color usage rules

- 본문 텍스트에는 accent 원색을 사용하지 않는다. 링크나 짧은 라벨에 한정한다.
- 상태 색과 역량 accent를 혼동하지 않는다. 성공은 항상 green semantic token으로 표시한다.
- 큰 배경 컬러 블록 위에는 검증된 ink 조합만 사용한다.
- 색만으로 분류하지 않고 이름, 번호, 아이콘 또는 패턴을 함께 제공한다.

## 6. Capability accent colors

| Capability | Token | Value | Meaning | Visual cue |
|---|---|---:|---|---|
| BUILD | `accent-build` | `#D7FF00` | 기회를 실제 제품과 출시로 전환 | 깃발, 상승하는 계단/블록 |
| ITERATE | `accent-iterate` | `#FF5AA5` | 전문성과 피드백을 반복 개선으로 연결 | 순환 화살표, 레이어/루프 |
| UNDERSTAND | `accent-understand` | `#55BFFF` | 사용자와 데이터에서 구조적 인사이트 도출 | 렌즈, 경로, 연결점 |

각 accent는 기본색 외에 구현 시 `soft`, `base`, `strong`, `on-accent` 단계가 필요하다. 파생값은 자동 생성하지 않고 구현 QA의 실제 WCAG 대비 결과를 기준으로 확정한다.

## 7. Typography roles

역할 구조는 **Pixel Display / Geist Sans / Geist Mono**로 확정한다. Pixel Display의 실제 서체 파일과 한글 fallback은 에셋 및 라이선스를 확인한 뒤 확정한다. 새 폰트 패키지는 승인 없이 설치하지 않는다.

| Role | Style | Recommended usage |
|---|---|---|
| Pixel Display | 실제 서체와 한글 fallback 확정 전 | 월드 타이틀, 섬 이름, 짧은 영문 라벨, 숫자, 배지 |
| Geist Sans | 굵기와 크기 대비로 에디토리얼 계층 구성 | Hero statement, Case Study 제목과 본문, 프로젝트 설명, 내비게이션 |
| Geist Mono | 고정폭 메타데이터 | 기간, 역할, 단계 번호, evidence caption |

### Type scale — draft

| Token | Desktop | Mobile | Role |
|---|---:|---:|---|
| `display-xl` | 72/0.95 | 40/1.0 | Home hero |
| `display-lg` | 52/1.0 | 36/1.05 | Case Study title |
| `heading-1` | 40/1.1 | 30/1.15 | Page heading |
| `heading-2` | 28/1.2 | 24/1.25 | Section heading |
| `heading-3` | 20/1.3 | 18/1.35 | Card/subsection heading |
| `body-lg` | 18/1.65 | 17/1.6 | Lead paragraph |
| `body-md` | 16/1.65 | 16/1.6 | Main body |
| `body-sm` | 14/1.5 | 14/1.5 | Metadata/caption |
| `label` | 13/1.2 | 13/1.2 | Pixel/mono UI label |

- 픽셀 서체는 한 문장 또는 약 24자 이내의 영문 라벨에만 사용한다.
- 긴 본문, 한글 문단, 작은 도움말에는 픽셀 서체를 사용하지 않는다.
- UI 라벨과 프로젝트명은 영문 중심, 긴 Case Study 본문은 한글 중심으로 운영한다.
- 본문 한 줄 길이는 한글 약 35–50자, 영문 약 55–75자를 목표로 한다.
- 강조를 위해 전부 대문자를 사용할 때도 접근 가능한 텍스트 값은 자연스러운 문장으로 유지한다.

## 8. Spacing and grid

### Base spacing

4px 기반 스케일을 사용한다: `4, 8, 12, 16, 24, 32, 48, 64, 96, 128`.

- 작은 픽셀 디테일과 icon gap: 4–8px
- control 내부 간격: 8–16px
- card 내부 여백: 20–32px
- section 간격: 64–128px
- Case Study 문단 간격: 16–24px

### Layout grid

1차 반응형 breakpoint는 `<768px` / `768–1279px` / `≥1280px`을 사용한다.

| Viewport | Columns | Gutter | Outer margin | Notes |
|---|---:|---:|---:|---|
| ≥ 1280 | 12 | 24px | 48–80px | 최대 콘텐츠 폭 1440px |
| 768–1279 | 8 | 20px | 32px | 월드 카드는 2열 우선 |
| < 768 | 4 | 16px | 20px | 핵심 콘텐츠 1열 |

- Case Study 본문 열은 최대 720px, lead는 최대 880px를 권장한다.
- 이미지/evidence는 8–12 columns까지 확장할 수 있으나 캡션은 본문 기준선에 맞춘다.
- 비대칭 에디토리얼 구성은 데스크톱에서만 사용하고 정보 순서는 DOM 흐름과 일치시킨다.
- 픽셀 프레임의 1단위는 4px 또는 8px로 통일해 반쪽 픽셀과 흐린 선을 피한다.

## 9. Pixel asset rules

- **춘이**는 MOVE ON만의 오리지널 가이드 캐릭터로 제작한다. 영문 UI에서는 **CHOONI**로 표기한다.
- MOVE ON 고유의 캐릭터, 섬, 배지, 커서, 환경 오브젝트만 새로 제작한다. 레퍼런스 자산을 트레이싱하거나 복제하지 않는다.
- 동일 장면의 자산은 공통 pixel density와 제한된 팔레트를 사용한다.
- 래스터 픽셀 아트는 정수 배율로 확대하고 보간으로 흐려지지 않게 한다.
- 중요한 정보는 이미지 안에만 넣지 않는다. 프로젝트명, 상태, CTA는 실제 텍스트로 제공한다.
- 장식 자산은 빈 alt를 사용하고, 의미가 있는 자산은 목적을 설명하는 alt를 제공한다.
- 캐릭터는 안내자이지 필수 조작 대상이 아니다. 캐릭터 응답 없이도 모든 경로를 이용할 수 있어야 한다.
- 한 화면의 큰 hero pixel scene은 1개로 제한하고 작은 장식의 밀도는 콘텐츠 영역의 15% 이하를 목표로 한다.
- 스티커형 흰 외곽선, 계단형 border, pixel shadow는 accent 요소에만 사용한다.
- 프로젝트 결과물 이미지는 픽셀화하지 않는다. 원본의 정보성과 증거 가치를 보존한다.
- 구현 시 각 이미지에 용도, 원본, 저작권/사용 허가, alt, crop 기준을 기록한다.

## 10. Responsive rules

### Desktop

- 온보딩 장면은 최대 3열 storyboard가 가능하지만 각 단계는 독립적으로 읽혀야 한다.
- 월드맵과 프로젝트 목록을 나란히 보여줄 수 있다.
- hover는 보조 피드백이며 핵심 정보는 기본 상태에서도 노출한다.

### Tablet

- 월드맵 다음에 프로젝트 목록이 이어지는 1–2열 혼합 구조를 사용한다.
- sticky 보조 패널은 콘텐츠를 가리지 않을 때만 유지한다.
- 섬 장면의 텍스트와 CTA는 그래픽 바깥의 안정된 영역에 배치한다.

### Mobile

- 온보딩은 세로 카드/slide 형태로 재구성하되 swipe만을 유일한 조작으로 사용하지 않는다.
- 월드맵은 축소된 전체 지도가 아니라 BUILD → ITERATE → UNDERSTAND의 세로 챕터로 전환한다.
- 프로젝트 카드는 1열이며 Role, Period, Contribution/Impact 요약을 이미지보다 먼저 읽을 수 있게 한다.
- Case Study 목차는 접을 수 있는 `On this page` 컨트롤로 전환한다.
- 최소 터치 영역 44×44px, control 간 최소 간격 8px를 확보한다.
- 화면 가장자리에 장식이나 fixed HUD를 과도하게 두지 않는다.

### Content resilience

- 200% 확대, 긴 한글 제목, 영문 대문자, 수치 미확정 라벨에서도 겹치거나 잘리지 않아야 한다.
- orientation이나 특정 viewport 높이에 의존해 콘텐츠를 숨기지 않는다.

## 11. Component inventory

### Global navigation

- `SiteHeader`: logo, Projects, About, Experience, Contact, mode-aware contrast
- `SkipIntroLink`: 첫 focus 대상
- `MobileMenu`: dialog semantics, focus trap, close control
- `Breadcrumbs`: Case Study 위치와 복귀 경로
- `Footer`: 연락처, 문서/프로필 링크, 저작권

### Orientation and world

- `IntroScene`: step label, dialogue, character art, primary/secondary action
- `GuideDialogue`: 도움말 또는 문맥 안내. dismissible
- `WorldOverview`: 세 capability 영역과 대표 프로젝트
- `CapabilityIsland`: BUILD / ITERATE / UNDERSTAND 소개 및 진입
- `ProgressPanel`: `localStorage` 기반으로 열람 현황을 표시하는 편의 요소
- `BadgeCollection`: `localStorage` 기반으로 읽은 프로젝트를 회고하는 비필수 요소

### Project discovery

- `CapabilityTabs`: 세 분류 + All
- `ProjectCard`: title, summary, role, period, category, evidence/impact teaser
- `ProjectQuickView`: 선택 사항. 핵심 정보를 숨기지 않는 범위에서만 사용
- `StatusLabel`: Featured, New, `[확인 필요]` 등
- `ProjectIndex`: 검색/필터 가능한 전체 프로젝트 목록

### Case Study

- `CaseStudyHero`: title, summary, role, team, period, scope
- `CaseStudyToc`: 현재 섹션과 읽기 진행률
- `NarrativeSection`: Problem, Context, Insight, Decision, Execution, Result, Learning
- `ContributionMatrix`: Individual Contribution / Team Contribution 구분
- `MetricBlock`: 수치, 기준 기간, 출처 또는 검증 상태
- `DecisionRecord`: alternatives, rationale, trade-off
- `EvidenceFigure`: 이미지/영상, 설명, 캡션, 출처
- `QuoteBlock`: 확인된 사용자/이해관계자 발언만 사용
- `LimitationCallout`: 제약, 미해결점, 학습
- `ProjectPagination`: 이전/다음 및 전체 프로젝트 복귀

### Primitives

- Button, TextLink, IconButton
- Tag, Badge, Tooltip
- Card, PixelFrame, Divider
- Accordion, Tabs, Dialog
- InlineNotice, Skeleton, EmptyState, ErrorState

## 12. Component states

모든 interactive component는 다음 상태를 정의한다.

| State | Requirement |
|---|---|
| Default | 목적과 affordance가 장식 없이도 명확함 |
| Hover | outline/배경/미세 이동 중 최대 두 가지 변화만 사용 |
| Focus-visible | 2px 이상 고대비 ring + 2px offset, 픽셀 프레임 안에 묻히지 않음 |
| Active/Pressed | 1–2px 정수 이동 또는 surface 변화, layout shift 없음 |
| Selected/Current | 색 + 라벨/아이콘/`aria-current`로 중복 전달 |
| Visited/Completed | 탐색 기록만 표현하며 접근 권한을 바꾸지 않음 |
| Disabled | 예외적으로만 사용. 이유와 대체 경로를 함께 표시 |
| Loading | 진행 상황 또는 skeleton 제공, 캐릭터 애니메이션만 보여주지 않음 |
| Empty | 원인과 다음 행동을 설명 |
| Error | 문제, 영향, 복구 방법을 평문으로 안내 |

### Project availability

- 기본 상태는 `available`이다.
- `recommended next`는 강조할 수 있지만 다른 프로젝트를 잠그지 않는다.
- 비공개 또는 준비 중 프로젝트는 흐린 가짜 카드 대신 이유가 명시된 `unavailable` 상태로 표시하거나 목록에서 제외한다.

## 13. Motion rules

아래 motion budget과 reduced-motion 원칙을 승인된 1차 기준으로 사용한다.

- 모션은 진입 맥락, 선택 결과, 정보 계층을 설명할 때만 사용한다.
- micro interaction: 120–180ms
- 카드/패널 transition: 180–260ms
- 화면 전환: 300–450ms 이내
- easing: 진입은 ease-out, 퇴장은 ease-in, 반복 장식은 기본적으로 사용하지 않는다.
- 섬 선택 시 accent outline → 제목/요약 → CTA 순서로 짧게 강조할 수 있다.
- parallax, scroll-jacking, 강제 horizontal scroll, 긴 intro loading, 지속적인 캐릭터 idle motion은 사용하지 않는다.
- 화면 전환 중에도 브라우저 뒤로가기와 직접 링크가 정상 작동해야 한다.
- `prefers-reduced-motion: reduce`에서는 이동/확대/시차 효과를 제거하고 즉시 전환 또는 opacity 변화만 사용한다.
- motion이 완료되어야만 정보를 읽거나 조작할 수 있는 구조를 만들지 않는다.

## 14. Accessibility rules

- 목표 기준은 WCAG 2.2 AA다.
- 일반 텍스트 4.5:1, 큰 텍스트와 필수 UI 그래픽 3:1 이상의 대비를 확보한다.
- 시맨틱 landmark와 heading hierarchy를 유지하고 페이지마다 하나의 명확한 `h1`을 둔다.
- 키보드만으로 intro skip, capability 선택, project 탐색, Case Study 이동이 가능해야 한다.
- `Skip to content` 링크를 제공하고 focus 순서는 시각적/문서 순서와 일치시킨다.
- 픽셀 아이콘 단독 버튼에는 접근 가능한 이름을 제공한다.
- 말풍선 텍스트는 이미지가 아니라 실제 DOM 텍스트로 제공한다.
- 상태, 역량, 진행률은 색에만 의존하지 않는다.
- 자동 재생 오디오, 깜박임, 시간 제한, 강제 입력은 사용하지 않는다.
- 프로젝트 evidence의 alt는 보이는 내용을 나열하기보다 해당 근거가 증명하는 바를 설명한다.
- 공개 가능한 Evidence만 사용한다. 내부 정보와 수치는 필요한 경우 식별할 수 없도록 마스킹하며, 마스킹으로 의미가 왜곡되지 않게 설명을 덧붙인다.
- 데이터 시각화는 텍스트 요약과 표 또는 동등한 대체 정보를 제공한다.
- UI 라벨과 프로젝트명은 영문을 중심으로, 긴 Case Study 본문은 한글을 중심으로 제공한다. 페이지 및 언어가 전환되는 구간의 language metadata를 정확히 설정한다.

## 15. UX safety rules

- 3단계 온보딩은 최초 방문에만 기본 노출한다. `Skip intro`를 항상 제공하고, 재방문자는 World Overview로 바로 이동하되 `Replay intro`를 사용할 수 있다.
- 프로젝트는 순차적으로 잠그지 않는다. 배지와 progress는 열람을 독려할 뿐 접근을 통제하지 않는다.
- 카드 앞면에서 최소한 Project, Role, Period, 한 줄 Impact/Contribution을 확인할 수 있게 한다.
- 장식적 지도와 별개로 `View all projects` 목록 경로를 항상 제공한다.
- 뒤로가기, 새 탭, 직접 URL, 링크 공유가 정상적인 웹 탐색으로 동작해야 한다.
- hover, drag, swipe, pixel-perfect 클릭을 필수 조작으로 요구하지 않는다.
- 사용자의 스크롤을 가로채거나 갑작스러운 모드 전환으로 위치를 잃게 하지 않는다.
- Case Study에서 개인 기여와 팀 기여를 인접하지만 분리된 영역으로 표시한다.
- 확인되지 않은 수치와 내용은 `[확인 필요]`, `[수치 확인 필요]`, `[담당 범위 확인 필요]`, `[근거 자료 필요]`로 표시한다.
- progress, badge, completed 상태는 `localStorage` 기반 편의 기능으로만 다루고 프로젝트 접근, 평가, 계정 생성 또는 개인정보 수집과 연결하지 않는다.
- 연락하기 전 불필요한 입력이나 게임 완료를 요구하지 않는다.
- dark/light는 장면 의미를 위한 모드이며 사용자 OS 테마를 무시하는 일반 테마 토글로 오인되지 않게 한다.

## 16. Prohibited patterns / 금지 사항

- 레퍼런스의 캐릭터, 섬, 브랜드 자산, 카피를 그대로 복제하는 행위
- 포지셔닝 승인 전 PM/BM 타이틀이나 소개 문장을 확정하는 행위
- 프로젝트, 역할, KPI, 사용자 반응, 사업 성과를 추측하거나 과장하는 행위
- 팀 성과를 Sophie의 단독 성과처럼 표현하는 행위
- 프로젝트 접근을 배지, 선행 프로젝트, 게임 진행률로 잠그는 행위
- 긴 intro를 강제하거나 skip을 숨기는 행위
- 픽셀 폰트를 본문과 긴 한글 문장에 사용하는 행위
- neon accent를 넓은 본문 배경이나 작은 본문 텍스트에 남용하는 행위
- 모든 섹션에 동일한 등장 애니메이션을 적용하는 행위
- scroll-jacking, 과도한 parallax, 자동 캐러셀, hover-only 정보 제공
- 모바일을 데스크톱 월드맵의 단순 축소판으로 만드는 행위
- 실제 evidence 이미지를 장식적으로 pixelate하거나 읽기 어렵게 crop하는 행위
- 공개 승인을 받지 않은 Evidence를 노출하거나 내부 정보 및 민감한 수치를 마스킹 없이 사용하는 행위
- 의미 없는 HUD, 수치, 레벨, 알림으로 인지 부하를 늘리는 행위
- 장식 때문에 heading, CTA, focus ring, 본문 대비가 약해지는 구성
- 승인되지 않은 dark mode, 폰트, 라이브러리, 외부 tracking을 임의로 추가하는 행위

## 17. Validation checklist

### 30-second comprehension test

- Sophie의 포지셔닝을 설명할 수 있는가?
- 대표 프로젝트와 세 역량 영역을 찾을 수 있는가?
- 각 프로젝트에서 Sophie가 직접 한 일을 구분할 수 있는가?

### Navigation test

- intro를 건너뛰고 모든 프로젝트에 접근할 수 있는가?
- 키보드와 모바일 터치로 동일한 핵심 경로를 완료할 수 있는가?
- Case Study에서 전체 프로젝트 및 Contact로 쉽게 이동할 수 있는가?

### Content test

- Problem → Decision → Execution → Result 흐름이 시각 장식보다 먼저 이해되는가?
- 수치의 기준과 출처, 개인/팀 기여가 구분되는가?
- 확인되지 않은 내용이 명시적으로 표시되는가?

## 18. Decision status

### Approved decisions

1. Career Positioning은 **0→1 Product Manager**를 중심으로 하며 Product × Brand × Commerce 실행 경험을 보조 설명으로 사용한다.
2. Intro 완료 후 기본 도착점은 World Overview다.
3. 3단계 Intro는 최초 방문에만 기본 노출한다. 재방문자는 World Overview로 바로 이동하며 `Replay intro`를 제공한다.
4. 각 프로젝트는 BUILD / ITERATE / UNDERSTAND 중 하나의 primary category만 가진다.
5. **Pixel Adventure × Editorial Product Portfolio**를 최종 Visual Direction으로 사용한다.
6. 현재 Foundation 및 Capability accent 컬러를 1차 디자인 토큰으로 사용하고 구현 QA에서 대비를 검증한다.
7. Typography 역할 구조는 Pixel Display / Geist Sans / Geist Mono를 사용한다.
8. 춘이는 MOVE ON의 오리지널 가이드 캐릭터로 제작하며 영문 UI에서는 CHOONI로 표기한다.
9. Case Study는 Light Mode를 기본으로 하고 Dark Mode는 Evidence Gallery 등 제한된 구간에만 사용한다.
10. Progress와 Badge는 `localStorage` 기반 편의 기능으로 유지하며 프로젝트 접근을 제한하지 않는다.
11. 반응형 breakpoint는 `<768px` / `768–1279px` / `≥1280px`을 1차 기준으로 사용한다.
12. Section 13의 motion budget과 reduced-motion 원칙을 1차 기준으로 사용한다.
13. UI 라벨과 프로젝트명은 영문 중심, 긴 Case Study 본문은 한글 중심으로 운영한다.
14. 공개 가능한 Evidence만 사용하며 내부 정보와 수치는 필요한 경우 마스킹한다.

### Still pending

- 실제 프로젝트의 BUILD / ITERATE / UNDERSTAND 배정
- 최종 픽셀 폰트 파일과 라이선스
- 픽셀 에셋 상세 목록 및 제작 사양
- 프로젝트별 공개 가능한 Evidence 범위

위 `Still pending` 항목은 확인되기 전까지 추측하지 않는다. 실제 UI 구현은 별도 Development 승인 이후 시작한다.
