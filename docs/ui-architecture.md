# MOVE ON UI Architecture

> Status: IA/UX 검토용 완성 명세  
> Source of truth: `AGENTS.md`, `docs/design-system.md`  
> Primary reference: `UI:UX(2).png`  
> Visual direction: **Pixel Adventure × Editorial Product Portfolio**  
> Career positioning: **0→1 Product Manager**, supported by Product × Brand × Commerce execution experience  
> Scope: 7개 독립 화면과 embedded scene/state의 구조. UI 구현은 별도 승인 후 시작한다.

## 1. Architecture principles

- 독립 화면은 Prologue, World Map, Project Select, Case Study Detail, About, Experience, Contact의 7개다.
- 탐험 경험은 콘텐츠 발견을 돕되 프로젝트 접근을 잠그거나 지연시키지 않는다.
- 최초 방문자는 Prologue를 거쳐 World Map에 도착한다. 재방문자는 World Map으로 바로 이동하고 `Replay intro`로 Prologue를 다시 볼 수 있다.
- Career Positioning은 **0→1 Product Manager**를 중심으로, Product × Brand × Commerce 실행 경험을 보조 축으로 전달한다.
- 각 프로젝트는 BUILD / ITERATE / UNDERSTAND 중 하나의 primary category만 가진다. 실제 배정은 승인 전까지 확정하지 않는다.
- Project, Role, Period, Contribution/Impact는 장식보다 먼저 읽혀야 한다.
- Progress와 Badge는 `localStorage` 기반 편의 기능이며 계정, 평가 또는 프로젝트 접근 권한과 연결하지 않는다.
- URL 직접 접근, 새 탭, 링크 공유, 브라우저 뒤로가기를 정상적인 웹 탐색으로 지원한다.
- UI 라벨과 프로젝트명은 영문 중심, 긴 Case Study 본문은 한글 중심으로 운영한다.
- 실제 프로젝트명, 역할, KPI, 성과 또는 Evidence를 추측하지 않는다.

## 2. Placeholder convention

| 콘텐츠 유형 | 표기 |
|---|---|
| 프로젝트명 | `[프로젝트명 확인 필요]` |
| 프로젝트 요약 | `[프로젝트 요약 확인 필요]` |
| 소개 또는 일반 문구 | `[문구 확인 필요]` |
| 역할·책임·소유 범위 | `[담당 범위 확인 필요]` |
| 팀 기여 | `[팀 기여 확인 필요]` |
| 기간 | `[기간 확인 필요]` |
| KPI·정량 성과 | `[수치 확인 필요]` |
| 정성 결과·근거 | `[근거 자료 필요]` |
| 프로젝트 category | `[BUILD / ITERATE / UNDERSTAND 배정 필요]` |
| 연락처·외부 URL | `[링크 확인 필요]` |

레이아웃을 채우기 위한 가짜 문장이나 임의 숫자를 만들지 않는다. 자료가 없거나 공개 범위가 정해지지 않은 위치에는 위 placeholder를 그대로 사용한다.

## 3. Global navigation model

### 3.1 Primary flow

`Prologue Step 1 → Step 2 → Step 3 Portal → World Map + embedded Project Select panel → Case Study Detail → Badge Completion state`

Portal과 Badge Completion은 이 흐름에 포함되지만 독립 화면이나 route가 아니다.

### 3.2 Recruiter fast path

`Skip intro → World Map → /projects → Case Study Summary / Contribution / Result → Contact`

### 3.3 Persistent navigation

World Map 이후에는 `Projects`, `About`, `Experience`, `Contact`, `Replay intro`를 제공한다. `SiteHeader`는 일반적인 SaaS형 navigation bar가 아니라 픽셀 프레임, 좌표·상태 라벨, 제한된 accent를 사용하는 HUD visual language로 표현한다. 단, 장식과 무관하게 목적지의 텍스트 링크, 명확한 현재 위치, 키보드 탐색을 유지한다.

Case Study Detail에는 `Back to projects`, breadcrumb, 이전/다음 프로젝트 이동을 추가한다. 모든 깊은 화면에서 World Map 또는 Projects로 복귀할 수 있어야 한다.

### 3.4 Mode sequence

- Prologue: Light Mode. Step 3 Portal에서 Dark Mode로의 전환을 예고한다.
- World Map 및 Project Select: Dark Mode.
- Case Study, About, Experience, Contact: Light Mode.
- Evidence Gallery와 Badge Completion: Case Study 내부의 제한된 Dark surface.

## 4. Shared layout and behavior

- Breakpoints는 Mobile `<768px`, Tablet `768–1279px`, Desktop `≥1280px`을 사용한다.
- Grid는 Desktop 12 columns / 24px gutter / 48–80px margin, Tablet 8 columns / 20px gutter / 32px margin, Mobile 4 columns / 16px gutter / 20px margin을 1차 기준으로 한다.
- Pixel Display는 짧은 영문 라벨, Geist Sans는 제목·본문, Geist Mono는 기간·역할·단계 번호 등 metadata에 사용한다.
- 모든 독립 화면은 `Skip to content`, 하나의 `h1`, semantic landmark, 논리적인 focus order를 제공한다.
- interactive control은 최소 44×44px touch target과 명확한 `focus-visible`을 가진다.
- 공통 상태는 `loading`, `ready`, `empty`, `error`, `reduced-motion`이며 필요한 화면에서 `selected`, `visited`, `completed`를 추가한다.
- 이미지 로딩 실패 시에도 제목, 요약, CTA와 화면 이동이 유지되어야 한다.
- 장식 픽셀아트는 빈 alt, 의미 있는 픽셀아트는 목적을 설명하는 alt를 사용한다.
- 화면 전환은 300–450ms 이내이며 `prefers-reduced-motion`에서는 이동·확대·시차를 제거한다.
- 공개 가능한 Evidence만 사용하고 내부 정보와 수치는 필요한 경우 마스킹한다.

## 5. Prologue 3-step

### 5.1 화면 목적

최초 방문자에게 MOVE ON, MOVECKO, Sophie의 포지셔닝과 탐색 방식을 짧게 소개하고 World Map으로 안내한다.

### 5.2 핵심 사용자 행동

- Desktop에서 세 장면의 흐름을 확인하고 Step 3의 `Enter MOVE ON WORLD` 선택
- Tablet/Mobile에서 `Next`와 `Back`으로 단계 이동
- 어느 환경에서든 `Skip intro`로 World Map 이동
- 재생 중 취소하여 World Map 복귀

### 5.3 콘텐츠 우선순위

1. Step 1–3 번호와 순서
2. MOVECKO의 안내 `[문구 확인 필요]`
3. `0→1 Product Manager` 포지셔닝
4. Product × Brand × Commerce 보조 설명 `[문구 확인 필요]`
5. Step 3 Portal과 `Enter MOVE ON WORLD`
6. `Skip intro`, `Next`, `Back`

### 5.4 주요 컴포넌트

- `IntroStoryboard`, `IntroScene`, `IntroProgress`
- `MoveckoCharacter`, `GuideDialogue`
- `PortalHero`, `EnterWorldButton`
- `SkipIntroLink`, `NextButton`, `BackButton`
- `PixelSceneDecoration`

### 5.5 화면 상태

- `first-visit / desktop-storyboard`
- `first-visit / tablet-mobile-step-1|2|3`
- `replay / desktop-storyboard`
- `replay / tablet-mobile-step-1|2|3`
- `return-visit-bypassed`
- `local-storage-unavailable`, `asset-loading`, `asset-error`, `reduced-motion`

### 5.6 이동 가능한 화면

- 다음: World Map(`Enter MOVE ON WORLD` 또는 `Skip intro`)
- Tablet/Mobile 내부: 이전·다음 Prologue step
- Replay 취소: World Map

### 5.7 Desktop layout

- ≥1280px에서 Primary Reference처럼 연결된 3-column storyboard를 한 화면에 동시에 노출한다.
- 각 column은 단계 번호, 안내 내용, 해당 MOVECKO 상태를 모두 포함한다.
- Step 3 column 안에 Portal과 `Enter MOVE ON WORLD` CTA를 포함한다.
- 연결선은 순서를 보조하지만 DOM과 키보드 순서는 Step 1 → Step 2 → Step 3을 따른다.
- Portal을 위한 별도 화면이나 route를 만들지 않는다.

### 5.8 Tablet layout

- 8-column 안에서 한 장면씩 진행하는 stepper로 전환한다.
- 현재 단계와 `1 of 3` 형태의 전체 진행 위치를 항상 보여준다.
- 안내와 MOVECKO/Portal은 4/4 columns 또는 위아래로 배치하고 CTA 영역을 우선 보존한다.

### 5.9 Mobile layout

- 한 장면씩 진행하는 단일 열 stepper다.
- step label → dialogue → MOVECKO 또는 Portal → actions 순으로 배치한다.
- swipe는 보조 입력일 수 있으나 `Next`와 `Back` 버튼을 대체하지 않는다.

### 5.10 접근성 고려사항

- Desktop의 세 장면은 시각·DOM·focus 순서가 일치해야 한다.
- Tablet/Mobile 단계 변경 시 heading으로 focus를 관리하고 현재 단계를 알린다.
- 말풍선 문구는 이미지가 아닌 실제 텍스트로 제공한다.
- Portal asset이 실패해도 Enter CTA를 사용할 수 있어야 한다.
- 자동 진입, 자동 재생 오디오, 시간 제한을 사용하지 않는다.

### 5.11 필요한 픽셀아트 에셋

- `[MOVECKO Step 1 인사 포즈 제작 필요]`
- `[MOVECKO Step 2 안내·걷기 포즈 제작 필요]`
- `[MOVECKO Step 3 출발 포즈 제작 필요]`
- `[Step 3 Portal 제작 필요]`
- `[3-column 연결선·방향 marker 제작 필요]`
- `[Light Mode 환경 장식과 말풍선 frame 제작 필요]`

## 6. World Map

### 6.1 화면 목적

Intro 완료 및 재방문의 기본 도착점이다. Sophie의 포지셔닝과 세 capability를 한눈에 보여주고 프로젝트를 탐색하게 한다.

### 6.2 핵심 사용자 행동

- BUILD / ITERATE / UNDERSTAND island 선택
- embedded Project Select panel에서 프로젝트 선택
- `View all projects`로 `/projects` 이동
- Progress와 Badge 확인
- `Replay intro`, About, Experience, Contact 이동

### 6.3 콘텐츠 우선순위

1. `0→1 Product Manager`
2. 세 capability 이름과 의미
3. 선택 category의 프로젝트 카드 `[프로젝트명 확인 필요]`
4. Role / Period / Contribution 또는 Impact placeholder
5. `View all projects`
6. Progress, Badge, MOVECKO tip

### 6.4 주요 컴포넌트

- `PixelHudHeader`, `WorldOverview`
- `CapabilityIsland` × 3
- `EmbeddedProjectSelectPanel`, `ProjectCard`
- `ProgressPanel`, `BadgeCollection`
- `GuideDialogue`, `ReplayIntroLink`, `Footer`

### 6.5 화면 상태

- `ready / no-progress|in-progress|all-completed`
- `category-default|build|iterate|understand`
- `category-query-restored`
- `island-hover|focus|selected`
- `local-storage-unavailable`, `asset-loading`, `asset-error`, `empty-projects`, `error`

### 6.6 이동 가능한 화면

- 다음: Case Study Detail, Project Select `/projects`
- 전역: About, Experience, Contact
- 보조: Prologue(`Replay intro`)

### 6.7 Desktop layout

- 12-column에서 왼쪽 World Map 7 columns + 오른쪽 embedded Project Select panel 5 columns를 기본으로 한다.
- 세 island와 오른쪽 panel은 첫 화면에서 동시에 보여야 한다.
- island 선택 시 route 이동이나 전체 reload 없이 오른쪽 panel의 제목, accent, 프로젝트 카드만 갱신한다.
- 선택 category는 `?category=build|iterate|understand` 같은 공유 가능한 URL query로 유지하고 history 및 직접 링크에서 복원한다.

### 6.8 Tablet layout

- World Map을 8 columns 전체 폭으로 먼저 배치하고 Project Select section을 바로 이어 배치한다.
- island 선택은 아래 section의 콘텐츠와 URL query를 갱신하되 강제 스크롤하지 않는다.

### 6.9 Mobile layout

- 축소된 전체 지도 대신 BUILD → ITERATE → UNDERSTAND 세로 챕터를 사용한다.
- 각 capability 설명 바로 뒤에 해당 프로젝트 카드를 함께 배치한다.
- Progress와 Badge는 접을 수 있는 보조 영역으로 둔다.

### 6.10 접근성 고려사항

- 지도와 동등한 capability 텍스트 control을 제공한다.
- 색 외에 label, 번호, icon/pattern으로 category를 구분한다.
- panel 갱신 후 선택 category와 결과 수를 알리되 focus를 임의로 이동하지 않는다.
- URL query가 유효하지 않으면 안전한 기본 category를 보여주고 오류로 탐색을 막지 않는다.

### 6.11 필요한 픽셀아트 에셋

- `[BUILD island 제작 필요]`
- `[ITERATE island 제작 필요]`
- `[UNDERSTAND island 제작 필요]`
- `[World 지형·하늘·물 타일 제작 필요]`
- `[Project Select panel frame 제작 필요]`
- `[World 안내 MOVECKO 포즈와 Progress/Badge HUD 제작 필요]`

## 7. Project Select

### 7.1 화면 목적

`/projects`에서 전체 프로젝트를 직접 비교하는 독립 fast path다. 게임 맥락을 거치지 않아도 Role, Period, Contribution/Impact를 빠르게 검토할 수 있어야 한다.

### 7.2 핵심 사용자 행동

- All / BUILD / ITERATE / UNDERSTAND 필터 선택
- 프로젝트 비교 및 Case Study 진입
- World Map 복귀
- About, Experience, Contact 이동

### 7.3 콘텐츠 우선순위

1. 현재 필터와 결과 수
2. Project `[프로젝트명 확인 필요]`
3. Role `[담당 범위 확인 필요]`
4. Period `[기간 확인 필요]`
5. Contribution/Impact `[근거 자료 필요]` `[수치 확인 필요]`
6. Category `[BUILD / ITERATE / UNDERSTAND 배정 필요]`
7. Thumbnail `[근거 자료 필요]`

### 7.4 주요 컴포넌트

- `PixelHudHeader`, `Breadcrumbs`
- `CapabilityFilters`, `ProjectIndex`, `ProjectCard`
- `StatusLabel`, `InlineNotice`, `Footer`

### 7.5 화면 상태

- `all-projects`, `category-filtered`, `category-query-restored`
- `card-default|hover|focus|visited|completed`
- `loading`, `empty-filter`, `error`, `unavailable`

### 7.6 이동 가능한 화면

- 다음: Case Study Detail
- 이전: World Map
- 전역: About, Experience, Contact, Replay intro

### 7.7 Desktop layout

- filter는 상단 또는 왼쪽 3 columns, 목록은 나머지 9 columns의 2–3열로 구성한다.
- 필터는 World Map과 같은 공유 가능한 URL query 규칙을 사용한다.
- hover 없이도 모든 핵심 카드 정보를 노출한다.

### 7.8 Tablet layout

- filter는 상단 control group, 카드는 2열로 배치한다.
- 긴 제목과 placeholder가 줄바꿈되어도 읽기 순서와 CTA를 유지한다.

### 7.9 Mobile layout

- filter는 접근 가능한 wrap button group 또는 tabs로 제공하고 카드는 단일 열로 배치한다.
- 제목, Role, Period, Contribution/Impact를 thumbnail보다 먼저 읽게 한다.

### 7.10 접근성 고려사항

- filter control의 선택 상태와 결과 영역 관계를 명확히 제공한다.
- 결과 변경을 non-blocking 방식으로 알린다.
- completed 상태는 색상 외 label 또는 icon을 함께 사용한다.
- 카드 전체 링크를 사용할 경우 내부에 중복 interactive control을 만들지 않는다.

### 7.11 필요한 픽셀아트 에셋

- `[Capability별 card frame 제작 필요]`
- `[All filter 공통 frame 제작 필요]`
- `[Project thumbnail placeholder 제작 필요]`
- `[visited/completed marker 제작 필요]`
- `[empty/error MOVECKO 포즈 제작 필요]`

## 8. Case Study Detail

### 8.1 화면 목적

Problem → Context → Insight → Decision → Execution → Result → Learning을 근거 중심으로 설명하고 Sophie의 개인 기여와 팀 성과를 구분한다.

### 8.2 핵심 사용자 행동

- Summary, Role, Result 빠르게 스캔
- 목차로 section 이동
- Evidence 확인 또는 Gallery 열기
- 이전/다음 프로젝트 및 `/projects` 이동
- 마지막 `Complete exploration` 선택
- 완료 후 Badge와 다음 행동 확인

### 8.3 콘텐츠 우선순위

1. Summary `[프로젝트 요약 확인 필요]`
2. Role / Period / Team / Scope `[담당 범위 확인 필요]` `[기간 확인 필요]`
3. Problem과 Business Goal `[확인 필요]`
4. Individual / Team Contribution `[담당 범위 확인 필요]` `[팀 기여 확인 필요]`
5. Insight, Decision, rationale `[근거 자료 필요]`
6. Result `[수치 확인 필요]` `[근거 자료 필요]`
7. Execution과 Evidence `[근거 자료 필요]`
8. Limitations와 Learning `[확인 필요]`
9. `Complete exploration`

### 8.4 주요 컴포넌트

- `PixelHudHeader`, `Breadcrumbs`, `CaseStudyHero`, `CaseStudyToc`
- `NarrativeSection`, `ContributionMatrix`, `MetricBlock`, `DecisionRecord`
- `EvidenceFigure`, `EvidenceGallery`, `LimitationCallout`
- `CompleteExplorationButton`, `BadgeCompletionPanel|Dialog`
- `ProjectPagination`, `ContactCta`, `Footer`

### 8.5 화면 상태

- `ready-unread`, `reading-current-section`, `completed`
- `evidence-gallery-open`, `badge-completion-open`
- `masked-evidence`, `missing-content`
- `local-storage-unavailable`, `loading`, `error`, `reduced-motion`

### 8.6 이동 가능한 화면

- 이전: Project Select, World Map
- 다음: 이전/다음 Case Study Detail, Contact
- 내부 상태: Evidence Gallery, Badge Completion

### 8.7 Desktop layout

- Light Mode 12-column editorial grid를 사용한다.
- 본문은 최대 720px, lead는 최대 880px로 제한한다.
- 목차 2–3 columns, 본문 6–7 columns, metadata 2–3 columns 구성이 가능하다.
- Evidence는 8–12 columns로 확장할 수 있으며 Gallery만 제한적으로 Dark Mode를 사용한다.

### 8.8 Tablet layout

- 8-column에서 본문 6 columns 중심, 목차는 2 columns 또는 상단 sticky row로 구성한다.
- Contribution과 metadata는 폭에 따라 2열 또는 단일 열로 전환한다.

### 8.9 Mobile layout

- `On this page` accordion → Hero → metadata → narrative → completion 순의 단일 열이다.
- 개인 기여와 팀 기여는 별도 카드로 제공한다.
- Evidence는 원본 비율과 읽을 수 있는 caption을 유지한다.

### 8.10 접근성 고려사항

- 하나의 `h1`과 순차적인 heading hierarchy를 유지한다.
- 목차 현재 항목은 `aria-current`와 시각 표시를 함께 제공한다.
- Gallery dialog는 focus trap, ESC, 명시적 닫기와 focus 복귀를 지원한다.
- Evidence와 수치에는 텍스트 설명 및 필요 시 표 대안을 제공한다.
- 완료는 자동 스크롤 감지 없이 사용자의 `Complete exploration` 활성화로만 기록한다.

### 8.11 필요한 픽셀아트 에셋

- `[Case Study section marker 세트 제작 필요]`
- `[Problem/Insight/Decision/Execution/Result/Learning icon 제작 필요]`
- `[Individual/Team Contribution icon 제작 필요]`
- `[Evidence Gallery dark frame 제작 필요]`
- `[Complete exploration 및 Badge frame 제작 필요]`

## 9. About

### 9.1 화면 목적

Sophie가 어떤 문제를 해결하는 0→1 Product Manager인지와 Product × Brand × Commerce 실행 경험이 이를 어떻게 보조하는지 설명한다.

### 9.2 핵심 사용자 행동

- Positioning과 working principles 확인
- 관련 프로젝트 또는 Experience 이동
- Contact 이동
- World Map 복귀

### 9.3 콘텐츠 우선순위

1. `0→1 Product Manager`
2. 소개 `[문구 확인 필요]`
3. Product × Brand × Commerce 경험 `[근거 자료 필요]`
4. 문제 해결·협업 원칙 `[확인 필요]`
5. Projects, Experience, Contact 연결
6. Profile visual `[근거 자료 필요]`

### 9.4 주요 컴포넌트

- `PixelHudHeader`, `EditorialHero`, `PositioningStatement`
- `CapabilitySummary`, `PrincipleList`, `ProfileFigure`
- `RelatedLinks`, `ContactCta`, `Footer`

### 9.5 화면 상태

- `ready`, `missing-content`, `profile-asset-loading|error`, `reduced-motion`

### 9.6 이동 가능한 화면

- World Map, Project Select, Experience, Contact, 관련 Case Study, Replay intro

### 9.7 Desktop layout

- 12-column 비대칭 editorial layout으로 큰 positioning과 좁은 본문을 대비시킨다.
- visual은 본문의 reading order를 끊지 않는 보조 영역에 둔다.

### 9.8 Tablet layout

- positioning은 전체 8 columns, 본문과 capability는 5/3 또는 단일 열로 배치한다.

### 9.9 Mobile layout

- positioning → 소개 → capability → principles → related links 순의 단일 열이다.
- 장식은 heading과 CTA의 여백을 침범하지 않는다.

### 9.10 접근성 고려사항

- 추상적인 역량 설명은 확인 가능한 프로젝트 링크와 연결한다.
- profile visual은 목적에 따라 의미 있는 alt 또는 빈 alt를 사용한다.
- 큰 display text가 200% 확대에서 잘리거나 겹치지 않아야 한다.

### 9.11 필요한 픽셀아트 에셋

- `[About MOVECKO 포즈 제작 필요]`
- `[0→1 journey 모티프 제작 필요]`
- `[Product/Brand/Commerce icon 제작 필요]`
- `[Profile visual 처리 사양 필요]`

## 10. Experience

### 10.1 화면 목적

경력의 시간 흐름, 조직·팀 맥락, 역할, 책임과 연결 프로젝트를 빠르게 검토하게 한다.

### 10.2 핵심 사용자 행동

- 경력 항목과 역할 범위 스캔
- 상세 책임 확인
- 관련 Case Study 이동
- About 또는 Contact 이동

### 10.3 콘텐츠 우선순위

1. Role `[확인 필요]`
2. Organization / Period `[확인 필요]` `[기간 확인 필요]`
3. Scope / Ownership `[담당 범위 확인 필요]`
4. Result `[수치 확인 필요]` `[근거 자료 필요]`
5. Related Project `[프로젝트명 확인 필요]`
6. 보조 이력 `[확인 필요]`

### 10.4 주요 컴포넌트

- `PixelHudHeader`, `ExperienceHeader`, `ExperienceTimeline`
- `ExperienceEntry`, `RoleMetadata`, `ContributionList`
- `RelatedProjectLinks`, `InlineNotice`, `ContactCta`, `Footer`

### 10.5 화면 상태

- `ready`, `entry-expanded|collapsed`, `missing-content`
- `no-related-project`, `loading`, `error`

### 10.6 이동 가능한 화면

- About, Contact, World Map, Project Select, 관련 Case Study

### 10.7 Desktop layout

- 12-column에서 Period 2 columns, Role/본문 6–7 columns, 관련 프로젝트 3–4 columns로 구성한다.
- timeline 장식보다 텍스트 정렬과 비교 가능성을 우선한다.

### 10.8 Tablet layout

- Period 2 columns + 본문 6 columns 또는 entry별 stacked layout을 사용한다.
- 관련 프로젝트는 각 entry 아래에 둔다.

### 10.9 Mobile layout

- 최신순 단일 열이며 Role, Organization, Period, Scope는 접힘 영역 밖에 둔다.
- chronology는 장식 선이 아닌 heading과 DOM 순서로도 이해되어야 한다.

### 10.10 접근성 고려사항

- chronology를 텍스트와 실제 DOM 순서로 전달한다.
- accordion에는 expanded 상태와 control 관계를 제공한다.
- 성과 수치는 기준 기간과 맥락을 함께 제공한다.
- 현재 역할은 색 외 텍스트로 표시한다.

### 10.11 필요한 픽셀아트 에셋

- `[Experience milestone marker 제작 필요]`
- `[Role/category icon 제작 필요]`
- `[Timeline 시작/현재 marker 제작 필요]`
- `[Related project connector 제작 필요]`

## 11. Contact

### 11.1 화면 목적

채용 담당자와 협업자가 최소한의 단계로 Sophie에게 연락하거나 승인된 외부 프로필을 열게 한다.

### 11.2 핵심 사용자 행동

- Primary contact 선택
- 연락처 복사
- 외부 프로필 열기
- World Map 또는 Projects 복귀

### 11.3 콘텐츠 우선순위

1. 연락 안내 `[문구 확인 필요]`
2. Primary contact `[링크 확인 필요]`
3. External profile `[링크 확인 필요]`
4. 응답 안내 `[확인 필요]`
5. Projects / World Map 복귀

### 11.4 주요 컴포넌트

- `PixelHudHeader`, `ContactHero`, `PrimaryContactLink`
- `CopyContactButton`, `ExternalProfileLinks`, `CopyConfirmation`
- `MoveckoFarewell`, `Footer`

### 11.5 화면 상태

- `ready`, `copy-success`, `copy-error`
- `missing-contact`, `external-link-unavailable`, `reduced-motion`

### 11.6 이동 가능한 화면

- 내부: World Map, Project Select, About, Experience, Replay intro
- 외부: 승인된 연락처와 프로필 `[링크 확인 필요]`

### 11.7 Desktop layout

- 12-column에서 statement 7–8 columns, 연락 행동 4–5 columns로 구성한다.
- Primary contact는 첫 viewport 안에 둔다.

### 11.8 Tablet layout

- statement와 연락 행동을 8-column 안에서 위아래로 배치하고 외부 링크는 최대 2열로 둔다.

### 11.9 Mobile layout

- 안내 → primary contact → copy → 외부 링크 → 복귀 행동 순의 단일 열이다.
- 긴 주소가 잘리지 않도록 안전한 줄바꿈을 허용한다.

### 11.10 접근성 고려사항

- contact link와 copy button의 역할 및 accessible name을 구분한다.
- copy 결과는 non-blocking live region으로 알린다.
- 새 창 링크는 사전에 표시한다.
- 연락을 위해 form 입력, Badge 또는 게임 완료를 요구하지 않는다.

### 11.11 필요한 픽셀아트 에셋

- `[Contact MOVECKO 포즈 제작 필요]`
- `[Email/External profile icon 제작 필요]`
- `[Copy success indicator 제작 필요]`
- `[Contact 환경 장식 제작 필요]`

## 12. Embedded scenes and states

### 12.1 Prologue Step 3 Portal / Enter CTA

- 위치: Prologue의 세 번째 column 또는 Tablet/Mobile stepper의 Step 3.
- 역할: Light에서 Dark World로 진입하는 맥락과 명시적 CTA 제공.
- 상태: `ready`, `entering`, `asset-loading`, `asset-error`, `reduced-motion`.
- 규칙: 별도 화면·route·로딩 관문을 만들지 않는다. asset이 없어도 CTA는 동작한다.

### 12.2 World Map embedded Project Select panel

- 위치: Desktop 오른쪽 5 columns, Tablet은 World Map 다음 section, Mobile은 각 capability chapter 바로 뒤.
- 역할: 선택 category의 프로젝트 카드와 accent 표시.
- 상태: `default`, `category-selected`, `loading`, `empty`, `error`.
- 규칙: Desktop island 선택 시 panel만 갱신하고 category를 공유 가능한 URL query에 반영한다. 강제 route 이동과 강제 스크롤을 사용하지 않는다.

### 12.3 Case Study Evidence Gallery

- 위치: Case Study 안의 제한된 Dark section 또는 accessible dialog.
- 역할: 승인된 Evidence를 원본 맥락, caption, alt와 함께 확대 열람.
- 상태: `inline`, `dialog-open`, `masked`, `asset-loading`, `asset-error`.
- 규칙: 별도 route가 아니며 공개 범위가 승인되지 않은 Evidence는 노출하지 않는다.

### 12.4 Case Study Badge Completion panel/dialog

- 위치: Case Study 마지막 `Complete exploration` 다음의 inline panel 또는 accessible dialog.
- 역할: 완료와 Badge를 알리고 다음 프로젝트, `/projects`, World Map, Contact 행동을 제공.
- 상태: `newly-completed`, `already-completed`, `storage-error`, `no-next-project`, `reduced-motion`.
- 규칙: 별도 route가 아니다. 자동 스크롤 감지로 열거나 기록하지 않는다. 사용자가 `Complete exploration`을 눌렀을 때만 `localStorage`에 완료를 기록하고 표시한다.

## 13. Cross-screen state rules

### 13.1 First visit and replay state

- 첫 방문은 Prologue에서 시작한다.
- Enter 또는 Skip 시 intro 완료를 `localStorage`에 기록하고 World Map으로 이동한다.
- 재방문자는 World Map으로 바로 이동한다.
- `Replay intro`는 Prologue를 보여주지만 프로젝트 Progress와 Badge를 초기화하지 않는다.
- storage 접근 실패는 콘텐츠 접근을 막지 않는다.

### 13.2 Category state

- 모든 프로젝트는 정확히 하나의 `primaryCategory`를 가진다.
- World Map과 `/projects`의 선택 category는 URL query로 공유·복원한다.
- 잘못된 query는 안전한 기본 상태로 처리한다.
- category는 accent color뿐 아니라 영문 label과 icon/pattern으로 함께 표시한다.

### 13.3 Completion and badge state

- 완료는 `Complete exploration` 버튼 활성화로만 기록한다.
- 자동 스크롤 감지는 사용하지 않는다.
- 완료 상태는 Case Study, Project Card, World Map Progress, Badge Collection에 일관되게 반영한다.
- storage 상태가 없거나 삭제돼도 모든 프로젝트는 계속 접근 가능하다.
- 재완료 시 중복 축하 dialog를 강제하지 않는다.

### 13.4 Content and evidence state

- 실제 프로젝트 콘텐츠와 KPI는 확인 및 승인 전 생성하지 않는다.
- 개인 기여와 팀 기여는 별도 필드와 시각 영역으로 유지한다.
- 공개되지 않은 Evidence와 내부 정보는 노출하지 않고 필요한 수치는 마스킹한다.
- 누락 데이터는 정해진 placeholder로 표시한다.

## 14. Surface and route classification

| Surface | Classification | Route/state behavior |
|---|---|---|
| Prologue 3-step | 독립 화면 | 최초 방문 또는 Replay로 진입. Desktop storyboard, Tablet/Mobile stepper |
| Prologue Step 3 Portal / Enter CTA | Embedded scene | Prologue 안에 포함, 별도 route 없음 |
| World Map | 독립 화면 | Intro 완료 및 재방문의 기본 도착점 |
| World Map Project Select | Embedded panel/section | Desktop 우측 panel, Tablet 후속 section, Mobile capability별 카드 |
| Project Select | 독립 화면 | `/projects` fast path와 공유 가능한 category query |
| Case Study Detail | 독립 화면 | 프로젝트별 직접 링크 |
| Evidence Gallery | Embedded section 또는 overlay/dialog state | Case Study 내부, 별도 route 없음 |
| Badge Completion | Inline panel 또는 overlay/dialog state | Case Study 내부, 별도 route 없음 |
| About | 독립 화면 | Pixel HUD navigation에서 접근 |
| Experience | 독립 화면 | Pixel HUD navigation에서 접근 |
| Contact | 독립 화면 | Pixel HUD navigation에서 접근 |

## 15. Validation checklist

- 독립 화면이 정확히 7개인가?
- Prologue Desktop에서 3개 장면이 동시에 보이고 각 번호, 안내, MOVECKO 상태와 Step 3 Portal이 포함되는가?
- Tablet/Mobile Prologue가 한 장면씩 진행하는 stepper인가?
- Portal과 Enter CTA가 Prologue Step 3에만 포함되고 별도 route가 없는가?
- Desktop World Map이 왼쪽 7 columns + 오른쪽 Project Select 5 columns인가?
- island 선택 시 오른쪽 panel만 갱신되고 category가 공유 가능한 URL query로 유지되는가?
- `/projects`가 전체 프로젝트 비교용 독립 fast path인가?
- Badge Completion이 Case Study 내부 state이고 별도 route가 없는가?
- 완료가 `Complete exploration`을 눌렀을 때만 기록되는가?
- 자동 스크롤 감지가 사용되지 않는가?
- SiteHeader가 픽셀 HUD visual language와 접근 가능한 전역 링크를 함께 제공하는가?
- 모든 독립 화면에 11개 필수 명세 항목이 있는가?
- 중복 heading, 빈 section, 이전 사용자 흐름이 없는가?
- 실제 프로젝트명, KPI, 역할 또는 성과를 추측하지 않았는가?

## 16. Still pending

- 실제 프로젝트의 BUILD / ITERATE / UNDERSTAND 배정
- 최종 픽셀 폰트 파일과 라이선스
- 픽셀 에셋 상세 제작 사양
- 프로젝트별 공개 가능한 Evidence 범위
- 승인된 연락처와 외부 링크

위 항목은 확인되기 전까지 추측하지 않는다. UI 구현은 별도 Development 승인 후 시작한다.
