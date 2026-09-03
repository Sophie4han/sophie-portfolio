# MOVE ON Implementation Plan

> Status: **Gate 08 진입 전 설계안 — UI 구현 미착수**  
> Sources: `AGENTS.md`, `docs/design-system.md`, `docs/ui-architecture.md`, `docs/asset-manifest.md`  
> Runtime baseline: Next.js 16.3.4, React 19.2.8, TypeScript strict, Tailwind CSS 4, App Router  
> Content rule: 실제 프로젝트명, 역할, KPI, 성과와 Evidence는 승인된 자료가 들어오기 전까지 생성하지 않는다.

## 1. Scope and decisions

이 문서는 승인된 7개 독립 화면과 embedded state를 구현하기 위한 route, component boundary, data model, browser state와 QA 방식을 정의한다. `app`, `components`, `data`, `types`, `lib`, `public`은 **향후 승인 후 만들 구조**이며 이 단계에서는 생성하지 않는다.

- 페이지와 긴 콘텐츠는 Server Component를 기본값으로 유지한다.
- 브라우저 API, URL을 바꾸는 control, dialog, accordion, CHOONI layer motion state처럼 상호작용이 필요한 최소 단위만 Client Component로 만든다.
- 프로젝트 접근은 intro, progress, badge 상태와 무관하게 항상 허용한다.
- 게임 엔진, canvas world, tile map, 계정, API route, 데이터베이스는 사용하지 않는다.
- 새 라이브러리를 설치하지 않는다. 현재 요구사항은 React, Next.js, TypeScript와 CSS만으로 구현 가능하다.

## 2. Next.js 16 official-document findings

설치된 `node_modules/next/dist/docs/`의 Project Structure, Layouts and Pages, Linking and Navigating, Server and Client Components, `page.js`, Dynamic Route Segments, `useSearchParams` 문서를 기준으로 한다.

- App Router는 folder segment와 `page.tsx`로 공개 route를 만든다. `layout.tsx`는 하위 route의 공통 UI를 감싼다.
- page와 layout은 기본적으로 Server Component다. `'use client'`는 browser API나 state가 필요한 작은 경계에만 둔다.
- Next.js 16 page의 `params`와 `searchParams`는 Promise이므로 Server page에서 반드시 `await`한다.
- `PageProps<'/route'>`는 type generation 이후 route literal 기반의 강한 타입을 제공한다.
- `useSearchParams`는 Client hook이다. 정적 prerender route에서 쓰면 가장 가까운 `Suspense` 경계까지 client rendering 대상이 되므로, 이 계획은 page의 `searchParams` prop을 우선 사용한다.
- `[slug]` dynamic segment는 직접 URL 접근을 지원한다. 승인된 slug는 `generateStaticParams`로 prerender하고, 유효하지 않은 slug는 `notFound()`로 처리한다.
- Client Component에 전달하는 Server data props는 직렬화 가능해야 한다. 함수나 browser 객체를 data model에 넣지 않는다.
- 내부 이동은 `<Link>`를 기본으로 하고, 상태 판정 후 replace가 필요한 intro gate와 query control만 `useRouter`를 사용한다.

## 3. Proposed App Router structure

```text
app/
├── layout.tsx                         # Root Server layout: html/body, fonts, metadata shell
├── globals.css                        # 승인된 tokens와 전역 접근성 규칙
├── page.tsx                           # / — Prologue
├── not-found.tsx                      # 잘못된 Case Study slug 등의 복구 경로
├── world/
│   └── page.tsx                       # /world — World Map
├── projects/
│   ├── page.tsx                       # /projects — Project Select
│   └── [slug]/
│       ├── page.tsx                   # /projects/[slug] — Case Study Detail
│       └── not-found.tsx              # 선택적 project-scoped not-found
├── about/
│   └── page.tsx                       # /about — About
├── experience/
│   └── page.tsx                       # /experience — Experience
└── contact/
    └── page.tsx                       # /contact — Contact
```

### Route behavior

| Route | 독립 화면 | 기본 render | URL/state 규칙 |
|---|---|---|---|
| `/` | Prologue 3-step | Server shell + Client intro controls | 첫 방문은 표시, 재방문은 hydration 후 `/world`로 `replace`; `?replay=1`은 항상 표시 |
| `/world` | World Map | Server page + category Client island | `?category=build|iterate|understand`; 없거나 잘못되면 `build` 기본값 |
| `/projects` | Project Select | Server page + filter Client island | `?category=all|build|iterate|understand`; 없거나 잘못되면 `all` |
| `/projects/[slug]` | Case Study Detail | Server page | 직접 접근 가능; 승인 slug만 생성, invalid slug는 404 |
| `/about` | About | Server page | browser progress와 독립 |
| `/experience` | Experience | Server page + 필요한 entry accordion만 Client | 관련 프로젝트는 승인된 slug만 연결 |
| `/contact` | Contact | Server page + copy control만 Client | 승인된 연락처가 없으면 placeholder/안내 상태 |

`/`의 재방문 판정은 Server에서 알 수 없는 `localStorage` 값이므로 `IntroVisitGate`가 hydration 후 처리한다. 첫 paint에는 Prologue의 안정적인 Server shell과 `Skip intro`를 제공한다. JavaScript 또는 storage가 실패해도 사용자가 `/world` 링크로 이동할 수 있다.

## 4. Seven screens and embedded-state mapping

| 독립 화면 | Embedded scene/state | Route를 만들지 않는 이유 | 소유 component |
|---|---|---|---|
| Prologue | Step 1, Step 2, Step 3 Portal, entering, replay | stepper/storyboard 내부 상태 | `IntroExperience` |
| World Map | embedded Project Select panel, selected category, Progress, Badge Collection, CHOONI tip | 같은 문맥에서 panel만 갱신 | `WorldExplorer` |
| Project Select | category filter, empty/error/unavailable card state | 목록 filter 상태 | `ProjectFilterController` |
| Case Study Detail | TOC current section, Evidence Gallery, completion, Badge Completion | 문서 내부 dialog/panel 상태 | `CaseStudyTocClient`, `EvidenceGalleryDialog`, `CompletionController` |
| About | profile asset loading/error | 화면 콘텐츠 상태 | Server section + asset fallback |
| Experience | entry expanded/collapsed, no-related-project | disclosure state | `ExperienceAccordion` |
| Contact | copy-success/copy-error, unavailable external link | 짧은 action feedback | `CopyContactButton` |

Portal, World의 Project Select, Evidence Gallery와 Badge Completion은 독립 route나 접근 관문으로 만들지 않는다.

## 5. Proposed source organization

```text
components/
├── layout/
│   ├── SiteHeader.tsx
│   ├── MobileMenu.tsx
│   ├── Breadcrumbs.tsx
│   └── Footer.tsx
├── intro/
│   ├── IntroExperience.tsx
│   ├── IntroVisitGate.tsx
│   ├── IntroScene.tsx
│   └── PortalHero.tsx
├── world/
│   ├── WorldOverview.tsx
│   ├── WorldExplorer.tsx
│   ├── CapabilityIsland.tsx
│   ├── EmbeddedProjectSelect.tsx
│   ├── ProgressPanel.tsx
│   └── BadgeCollection.tsx
├── projects/
│   ├── ProjectIndex.tsx
│   ├── ProjectFilterController.tsx
│   ├── ProjectCard.tsx
│   └── ProjectPagination.tsx
├── case-study/
│   ├── CaseStudyHero.tsx
│   ├── CaseStudyToc.tsx
│   ├── CaseStudyTocClient.tsx
│   ├── NarrativeSection.tsx
│   ├── ContributionMatrix.tsx
│   ├── MetricBlock.tsx
│   ├── DecisionRecord.tsx
│   ├── EvidenceFigure.tsx
│   ├── EvidenceGalleryDialog.tsx
│   ├── CompletionController.tsx
│   └── BadgeCompletionPanel.tsx
├── about/
├── experience/
├── contact/
├── character/
│   └── ChooniCharacter.tsx
└── ui/
    ├── Button.tsx
    ├── TextLink.tsx
    ├── IconButton.tsx
    ├── Card.tsx
    ├── PixelFrame.tsx
    ├── Tag.tsx
    ├── Badge.tsx
    ├── StatusLabel.tsx
    ├── Accordion.tsx
    ├── Tabs.tsx
    ├── Dialog.tsx
    ├── ProgressBar.tsx
    ├── InlineNotice.tsx
    └── states/
        ├── LoadingState.tsx
        ├── EmptyState.tsx
        └── ErrorState.tsx

data/
├── categories.ts
├── projects.ts
├── case-studies.ts
├── experience.ts
└── site.ts

types/
├── category.ts
├── project.ts
├── case-study.ts
├── progress.ts
└── asset.ts

lib/
├── projects.ts                       # ProjectSummary read/filter/slug helpers
├── case-studies.ts                   # projectId/slug 기반 CaseStudy lookup
├── category-query.ts                 # query validation/building
├── progress-storage.ts               # browser-only parser/migration
└── guards.ts                         # runtime type guards
```

폴더는 route와 domain 책임을 기준으로 나누며 page 전체를 하나의 Client Component로 만들지 않는다. `data/`는 승인된 콘텐츠의 단일 source of truth가 되고 JSX에는 반복 프로젝트 데이터를 하드코딩하지 않는다.

## 6. Server and Client Component boundary

### Server Components by default

- 모든 `page.tsx`, root `layout.tsx`
- `SiteHeader`의 정적 link 영역, `Breadcrumbs`, `Footer`
- `WorldOverview`의 제목·positioning·category 설명
- `ProjectIndex`와 `ProjectCard`의 기본 콘텐츠 표현
- `CaseStudyHero`, `NarrativeSection`, `ContributionMatrix`, `MetricBlock`, `DecisionRecord`, `EvidenceFigure`, `ProjectPagination`
- About, Experience, Contact의 정적 섹션
- project lookup, slug validation, metadata 생성, 승인된 data 정렬

### Client Components — 최소 범위

| Client Component | 필요한 browser/interaction 기능 | 전달받는 Server data |
|---|---|---|
| `IntroVisitGate` | `localStorage`, hydration 후 `router.replace` | replay 여부, world URL |
| `IntroExperience` | Mobile step, Next/Back, Enter/Skip, keyboard focus | 세 scene의 직렬화 가능한 content props |
| `ChooniCharacter` | static PNG layer 조합, motion state와 reduced-motion media query | layer bundle descriptor와 accessible name |
| `WorldExplorer` | island 선택, query 갱신, embedded panel 교체 | categories와 project summaries |
| `ProjectFilterController` | filter 선택, query 갱신, 결과 announce | projects와 initial category |
| `ProgressPanel` / `BadgeCollection` | `localStorage` read와 storage-error fallback | project id/slug 목록 |
| `MobileMenu` | dialog, focus trap, Escape/close | navigation link data |
| `CaseStudyTocClient` | IntersectionObserver, current section, Mobile accordion | section id/label 목록 |
| `EvidenceGalleryDialog` | dialog open/close, focus return, Escape | 승인된 evidence descriptors |
| `CompletionController` | 명시적 complete action과 localStorage write | current project id와 다음 actions |
| `ExperienceAccordion` | entry expanded/collapsed | 공개 가능한 entry content |
| `CopyContactButton` | Clipboard API, live status | 승인된 contact string |

Client 파일의 import는 그 아래 모듈도 client bundle에 포함시킬 수 있으므로, 큰 데이터 파일과 Server-only helper는 Client 경계에서 import하지 않고 필요한 serializable subset만 props로 전달한다.

## 7. Component hierarchy

### Global shell

```text
RootLayout (Server)
├── SkipToContent (Server HTML link)
├── SiteHeader (Server)
│   └── MobileMenu (Client)
├── <main id="main-content">
│   └── route page
└── Footer (Server)
```

### Prologue

```text
ProloguePage (Server)
├── IntroVisitGate (Client)
└── IntroExperience (Client)
    ├── IntroProgress
    ├── IntroScene × 3
    │   ├── GuideDialogue (CSS-native frame + HTML text)
    │   └── ChooniCharacter (Client)
    ├── PortalHero
    └── Next / Back / Enter / Skip controls
```

Desktop은 세 scene을 DOM 순서대로 동시에 표시한다. Tablet/Mobile은 같은 scene data를 단일-step UI로 표현하되 DOM과 focus announcement를 현재 단계에 맞춘다.

### World Map

```text
WorldPage (Server; searchParams await)
└── WorldOverview (Server)
    └── WorldExplorer (Client)
        ├── CapabilityIsland × 3
        ├── EmbeddedProjectSelect
        │   └── ProjectCard × N (Server-rendered content pattern)
        ├── ProgressPanel (Client)
        ├── BadgeCollection (Client)
        └── GuideDialogue + ChooniCharacter (Client)
```

Client parent가 필요한 곳에서는 Server-rendered children/serializable data composition을 활용한다. 구현 시 실제 bundle 결과를 확인해 `ProjectCard` markup 중복이나 전체 client 전환이 생기면 interactive wrapper와 content view를 분리한다.

### Project Select

```text
ProjectsPage (Server; searchParams await)
├── Breadcrumbs
└── ProjectFilterController (Client)
    ├── CapabilityFilters
    ├── live result summary
    └── ProjectIndex
        └── ProjectCard × N
```

### Case Study Detail

```text
CaseStudyPage (Server; params await)
├── Breadcrumbs
├── CaseStudyHero
├── CaseStudyTocClient (Client)
├── NarrativeSection × ordered sections
│   ├── ContributionMatrix
│   ├── MetricBlock
│   ├── DecisionRecord
│   └── EvidenceFigure
├── EvidenceGalleryDialog (Client, optional)
├── CompletionController (Client)
│   └── BadgeCompletionPanel
├── ProjectPagination
└── ContactCta
```

### About / Experience / Contact

```text
AboutPage (Server)
└── EditorialHero → PositioningStatement → CapabilitySummary → PrincipleList → RelatedLinks

ExperiencePage (Server)
└── ExperienceTimeline → ExperienceAccordion (Client only if disclosure is retained) → RelatedProjectLinks

ContactPage (Server)
└── ContactHero → PrimaryContactLink → CopyContactButton (Client) → ExternalProfileLinks → ChooniCharacter(optional)
```

## 8. Shared UI components

공통 UI는 HTML/CSS-native 구현을 기본으로 한다. 버튼·말풍선·카드·HUD·focus ring·상태·progress bar에 raster frame을 쓰지 않는다.

| Component | Semantic base | 필수 상태/규칙 |
|---|---|---|
| `Button` | `<button>` | default, hover, focus-visible, pressed, disabled; 44×44px minimum |
| `TextLink` | Next `<Link>` 또는 `<a>` | internal/external 구분, 새 창 사전 표시 |
| `IconButton` | `<button>` | accessible name 필수, 장식 icon은 숨김 |
| `Card` / `PixelFrame` | `<article>`/`div` | category token과 CSS border; interactive nesting 금지 |
| `GuideDialogue` | aside/status 문맥에 맞는 element | 실제 HTML text, dismiss control |
| `Tabs` / filter group | button group 또는 tabs | 선택과 결과 관계, URL query, 색 외 indicator |
| `Accordion` | button + controlled region | `aria-expanded`, `aria-controls`, keyboard order |
| `Dialog` | native `<dialog>` 우선 검토 | focus trap, Escape, close, opener focus 복귀 |
| `ProgressBar` | `<progress>` 또는 progressbar semantics | text equivalent, localStorage 실패 상태 |
| `StatusLabel` | text label | 색 + icon/label, 상태 의미 고정 |
| `InlineNotice` | status/alert 문맥별 선택 | 문제·영향·복구 행동을 평문으로 제공 |
| `Loading/Empty/ErrorState` | section/status | 핵심 CTA와 route 접근을 막지 않음 |

## 9. Data model

실제 구현에서는 아래 type을 `types/`에 두고 승인된 값만 `data/`에 입력한다. 예시 값 대신 placeholder 상태를 type으로 표현한다.

### Category schema

```ts
export const categoryIds = ['build', 'iterate', 'understand'] as const;
export type CategoryId = (typeof categoryIds)[number];
export type ProjectFilter = 'all' | CategoryId;

export interface CapabilityCategory {
  id: CategoryId;
  label: 'BUILD' | 'ITERATE' | 'UNDERSTAND';
  description: string; // 승인 문구 또는 [문구 확인 필요]
  accentToken:
    | 'accent-build'
    | 'accent-iterate'
    | 'accent-understand';
  iconAsset: string;
  islandAsset: string;
  order: 1 | 2 | 3;
}
```

각 프로젝트는 정확히 하나의 `primaryCategory`를 가진다. category validation은 query와 data 입력 양쪽에 같은 `isCategoryId` guard를 사용한다.

### Shared content state

```ts
export type VerificationState =
  | 'verified'
  | 'needs-confirmation'
  | 'needs-metric'
  | 'needs-scope'
  | 'needs-evidence';

export interface VerifiedText {
  value: string;
  state: VerificationState;
}
```

미확정 내용을 그럴듯한 임시 문장으로 채우지 않는다. 화면에는 문서에서 승인된 `[확인 필요]`, `[수치 확인 필요]`, `[담당 범위 확인 필요]`, `[근거 자료 필요]`를 그대로 노출할 수 있다.

### Project data schema

```ts
export type ProjectTier =
  | 'hero'
  | 'major'
  | 'supporting'
  | 'selected-work'
  | 'archive';

export type ProjectAvailability = 'available' | 'unavailable';

export interface ProjectSummary {
  id: string;                    // stable internal id; progress key
  slug: string;                  // approved URL-safe unique slug
  title: VerifiedText;
  summary: VerifiedText;
  primaryCategory: CategoryId;
  tier: ProjectTier;
  role: VerifiedText;
  period: VerifiedText;
  contributionOrImpact: VerifiedText;
  thumbnail?: EvidenceAsset;
  projectObjectAsset?: string;
  badgeSymbolAsset?: string;
  availability: ProjectAvailability;
  unavailableReason?: VerifiedText;
  recommendedOrder?: number;
}
```

`ProjectSummary`는 목록과 preview에 필요한 정보만 가진다. `id`는 slug가 바뀌어도 localStorage 기록이 유지되도록 별도로 둔다. `unavailable`은 실제 사유가 있을 때만 사용하며 progress 때문에 잠그지 않는다.

`data/projects.ts`와 `data/case-studies.ts`는 분리한다. 상세 데이터는 `projectId`를 canonical relation key로 사용하고, route에서는 승인된 slug를 먼저 `ProjectSummary`로 찾은 뒤 해당 `id`로 `CaseStudy`를 조회한다.

```ts
export function getProjectSummaryBySlug(
  slug: string,
): ProjectSummary | undefined;

export function getCaseStudyByProjectId(
  projectId: string,
): CaseStudy | undefined;

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  const project = getProjectSummaryBySlug(slug);
  return project ? getCaseStudyByProjectId(project.id) : undefined;
}
```

World와 Project Select의 Client filter/controller에는 `ProjectSummary[]` 또는 그보다 작은 직렬화 가능한 card view model만 전달한다. `CaseStudy`, section body, metric, contribution, Evidence 배열 전체는 Client props나 filter bundle에 포함하지 않는다.

### Case Study data schema

```ts
export type CaseStudySectionKind =
  | 'problem'
  | 'context'
  | 'insight'
  | 'decision'
  | 'execution'
  | 'result'
  | 'learning';

export interface CaseStudy {
  projectId: string;
  hero: {
    summary: VerifiedText;
    role: VerifiedText;
    team: VerifiedText;
    period: VerifiedText;
    scope: VerifiedText;
  };
  sections: CaseStudySection[];  // canonical order guard로 검증
  individualContribution: ContributionItem[];
  teamContribution: ContributionItem[];
  metrics: Metric[];
  evidence: EvidenceAsset[];
  limitations: VerifiedText[];
  pagination: {
    previousProjectId?: string;
    nextProjectId?: string;
  };
}

export interface CaseStudySection {
  id: string;
  kind: CaseStudySectionKind;
  heading: VerifiedText;
  body: VerifiedText[];
  evidenceIds?: string[];
}

export interface ContributionItem {
  text: VerifiedText;
  owner: 'individual' | 'team';
  evidenceIds?: string[];
}

export interface Metric {
  id: string;
  label: VerifiedText;
  value: VerifiedText;
  period: VerifiedText;
  source?: VerifiedText;
}

export interface EvidenceAsset {
  id: string;
  src: string;
  alt: string;
  caption: VerifiedText;
  source?: VerifiedText;
  width: number;
  height: number;
  masked: boolean;
  publicApproved: boolean;
}
```

`EvidenceAsset`는 `publicApproved: true`인 항목만 렌더링한다. Individual과 Team contribution은 구조상 분리하며 하나의 자유 텍스트 필드로 합치지 않는다. Case Study section은 Problem → Context → Insight → Decision → Execution → Result → Learning 순서를 runtime guard와 테스트에서 검증한다.

## 10. P0 pixel asset directory

P0 파일 계획은 다음 기준으로 관리한다.

- 승인된 P0 logical asset ID는 정확히 **10개**다.
- Mobile variant는 별도 logical asset ID가 아니라 원본 ID에서 파생된 파일이다.
- 하나의 logical CHOONI asset은 여러 static PNG layer 파일을 포함할 수 있으며 logical ID 수는 증가하지 않는다.
- 기존 최대 17개 예상은 단일 sprite sheet를 전제로 한 값이므로 폐기한다. 비-CHOONI 파생 파일과 확정된 Step 1 layer 7개를 합친 최소 기준 이후의 실제 파일 수는 나머지 bundle 승인 시 확정한다.
- 최종 layer 구성, Mobile variant와 실제 파일 수는 에셋 제작 승인 시 확정한다.

구조는 `docs/asset-manifest.md`의 정확한 ID를 반영한다. 파일은 에셋 제작 및 Development 승인 뒤에만 추가한다.

```text
public/
└── images/
    └── pixel/
        ├── chooni/
        │   ├── prologue-greeting/
        │   │   ├── body-base.png
        │   │   ├── arm-right-neutral.png
        │   │   ├── arm-right-wave.png
        │   │   ├── face-neutral.png
        │   │   ├── face-smile.png
        │   │   ├── face-blink-half.png
        │   │   └── face-blink-closed.png
        │   ├── prologue-guide/              # layer 파일 구성 승인 후 확정
        │   ├── prologue-guide-mobile/       # 필요 layer만 파생
        │   ├── prologue-departure/          # layer 파일 구성 승인 후 확정
        │   ├── prologue-departure-mobile/   # 필요 layer만 파생
        │   ├── world-guide/                  # layer 파일 구성 승인 후 확정
        │   └── world-guide-mobile/           # 필요 layer만 파생
        ├── portal/
        │   ├── portal-step-3.png
        │   └── portal-step-3-mobile.png
        ├── islands/
        │   ├── island-build.png
        │   ├── island-build-mobile.png
        │   ├── island-iterate.png
        │   ├── island-iterate-mobile.png
        │   ├── island-understand.png
        │   └── island-understand-mobile.png
        └── world/
            ├── world-background-desktop.png
            └── world-background-mobile-chapter.png
```

Desktop/Tablet이 같은 원본을 안전 crop하는 배경에는 Tablet 파일을 따로 만들지 않는다. 섬의 hover/focus/selected/visited 이미지, selection outline, terrain/water tileset과 UI 9-slice 파일은 만들지 않는다.

## 11. CHOONI layered PNG implementation

`ChooniCharacter`는 같은 canvas와 anchor를 공유하는 static transparent PNG를 겹쳐 표시하는 작은 Client Component다. Piskel에서 frame-by-frame animation이나 sprite sheet를 production용으로 만들지 않는다. 현재 제작된 Piskel 및 motion guide 이미지는 시각 참고 자료일 뿐 `public/`에 배포하지 않는다.

```ts
export type ChooniLayerGroup = 'body' | 'arm-right' | 'face' | 'pose-detail';

export interface ChooniLayer {
  id: string;
  src: string;
  group: ChooniLayerGroup;
  zIndex: number;
}

export interface ChooniLayerBundle {
  logicalAssetId:
    | 'chooni-prologue-greeting'
    | 'chooni-prologue-guide'
    | 'chooni-prologue-departure'
    | 'chooni-world-guide';
  canvasWidth: number;
  canvasHeight: number;
  groundAnchor: { x: number; y: number };
  layers: readonly ChooniLayer[];
  states: readonly ChooniMotionState[];
}

export interface ChooniMotionState {
  id: string;
  visibleLayerIds: readonly string[];
  durationMs?: number;
  nextStateId?: string;
  reducedMotionLayerIds: readonly string[];
}
```

- 각 layer를 같은 크기의 absolute element로 겹치고 descriptor의 `zIndex` 순서로 합성한다. 같은 group의 대체 layer는 동시에 하나만 표시한다.
- wrapper를 bundle canvas 크기로 고정하고 모든 layer에서 character scale, ground anchor, body-part volume, spot placement, palette와 움직이지 않는 transparent padding을 유지한다.
- 정수 배율과 nearest-neighbor rendering을 사용하고 anti-aliasing을 허용하지 않는다.
- React는 `ChooniMotionState` 전환과 layer visibility만 관리하고 CSS transition/keyframes가 opacity와 transform timing을 담당한다. frame-count 기반 단계형 재생, frame index와 frame timing table은 사용하지 않는다.
- blink, wave, point처럼 불연속적인 상태 교체는 작은 React state/timer로 제어할 수 있다. 연속적인 bob, sway, arm transform과 wrapper 이동은 CSS로 처리한다. 모션 라이브러리는 추가하지 않는다.
- 각 state의 start/end composition과 `groundAnchor`를 manifest handoff 값과 대조한다.
- alt가 필요한 경우 `role="img"`와 accessible label을 wrapper에 제공한다. 같은 정보가 인접 실제 텍스트에 있으면 장식으로 처리한다.
- loading/error여도 dialogue와 CTA는 유지하며 layout shift를 막기 위해 공통 canvas 공간을 예약한다.
- static layer PNG에는 `next/image`를 우선 검토하고 동일 fill box, 명시적 `sizes`, integer scaling과 `image-rendering: pixelated`를 적용한다.

### Internal layer motion vs screen movement

- layer transform은 제자리의 표정·팔·몸통 motion만 담당한다. 화면상 walk와 Portal 진입 경로는 `ChooniCharacter`의 고정 크기 wrapper에 적용하는 CSS `transform`이 담당한다.
- `top`/`left`를 animation하지 않는다. wrapper translate는 layout flow를 바꾸지 않고, 시작점과 도착점은 responsive scene별 CSS custom property로 명시한다.
- wrapper translate와 body/leg layer motion은 하나의 named motion state에서 duration을 공유해 발 미끄러짐과 timing drift를 줄인다.
- 이동 종료 event에서 정확한 최종 transform을 적용한 뒤 이동 state를 중지하고 다음 장면의 승인된 static composition으로 정착시킨다.
- animation 완료가 navigation이나 CTA 활성화의 조건이 되지 않게 한다.

### Prologue scene transition contract

`IntroExperience`는 아래 pose contract를 순서대로 사용한다.

1. greeting 종료의 neutral layer composition과 guide 시작 composition의 silhouette, scale, facing direction, ground anchor가 같다.
2. guide/point 종료 뒤 wrapper 이동을 시작할 때 layer 교체로 캐릭터의 위치나 anchor가 바뀌지 않는다.
3. 이동 motion은 static leg/body layer의 제한된 교대 또는 CSS transform으로 표현하고 frame-by-frame walk cycle을 요구하지 않는다.
4. departure 시작 composition은 이동 종료 composition과 같은 silhouette, scale, facing direction, ground anchor를 사용한다.
5. scene 전환 뒤 wrapper 위치와 static layer composition을 명시적으로 확정해 hydration이나 resize 후에도 중간 상태가 남지 않게 한다.

### Reduced-motion implementation

- `prefers-reduced-motion: reduce`에서는 walk와 Portal 진입 wrapper의 translate transform을 실행하지 않는다.
- 선택된 motion state의 `reducedMotionLayerIds` 조합을 즉시 표시하고 layer transition과 playback timer를 시작하지 않는다.
- Prologue scene, dialogue와 CTA를 즉시 노출하며 animation timer를 기다리지 않는다.
- Enter, Skip, Next/Back과 모든 콘텐츠·route 접근은 동일하게 유지한다.

## 12. Intro first-visit state

### Storage record

```ts
interface IntroStateV1 {
  version: 1;
  completed: boolean;
  completedAt?: string; // ISO timestamp; 분석/평가용이 아님
}

const INTRO_STORAGE_KEY = 'move-on:intro:v1';
```

### Flow

1. `/`는 Server-rendered Prologue shell을 제공한다.
2. `?replay=1`이면 storage와 무관하게 Prologue를 표시하고 완료/Badge data를 초기화하지 않는다.
3. replay가 아니면 `IntroVisitGate`가 mount 후 storage를 안전하게 읽는다.
4. `completed: true`이면 `router.replace('/world')`한다.
5. 값이 없거나 invalid이면 Prologue를 유지한다.
6. Enter 또는 Skip을 누르면 intro record를 저장한 뒤 `/world`로 이동한다.
7. storage read/write가 throw하면 접근을 막지 않고 현재 session에서 이동을 계속한다.

자동 진입, 시간 제한, 완료를 요구하는 loading gate는 사용하지 않는다. hydration 전에도 `Skip intro`는 실제 link 또는 progressive-enhancement 가능한 control로 제공한다.

## 13. Progress and Badge localStorage

Badge는 별도 진실 원천으로 저장하지 않고 `completedProjectIds`에서 파생한다. 중복 상태를 피하고 project 접근 권한과 연결하지 않는다.

```ts
interface PortfolioProgressV1 {
  version: 1;
  visitedProjectIds: string[];
  completedProjectIds: string[];
  updatedAt: string;
}

const PROGRESS_STORAGE_KEY = 'move-on:progress:v1';
```

- Case Study가 client에 mount되면 해당 project id를 `visitedProjectIds`에 idempotent하게 추가한다.
- `completedProjectIds`는 사용자가 `Complete exploration` 버튼을 누를 때만 추가한다. scroll depth로 자동 완료하지 않는다.
- Badge Collection과 Project Card의 완료 표시는 같은 record에서 파생한다.
- 알 수 없는 id, 중복 id, 잘못된 JSON은 guard로 제거하고 안전한 빈 상태로 복구한다.
- schema version이 다르면 명시적 migration 또는 빈 state fallback을 사용한다.
- `storage` event를 구독해 같은 origin의 다른 tab 갱신을 반영할 수 있다.
- 계정, 서버 전송, 개인정보, 점수, 평가 data를 저장하지 않는다.
- storage가 없거나 삭제되어도 모든 URL과 프로젝트는 접근 가능하다.

## 14. World category URL query

### Canonical query

- World: `/world?category=build|iterate|understand`
- Project Select: `/projects?category=all|build|iterate|understand`
- key는 하나의 `category`만 인정한다. 배열 값이나 알 수 없는 값은 각 route의 기본값으로 정규화한다.

### Next.js 16 handling

```ts
type CategorySearchParams = Promise<{
  category?: string | string[];
}>;
```

page Server Component가 `await searchParams` 후 runtime guard로 `initialCategory`를 결정한다. 이는 직접 링크의 첫 HTML부터 올바른 선택과 결과를 보여주기 위한 선택이며 `/world`와 `/projects`는 request-time rendering 대상이 된다.

Client controller는 `usePathname`, `useRouter`, `useSearchParams`로 현재 query를 복사해 `category`만 변경하고 `router.replace`를 사용한다. 이 hook을 쓰는 controller는 작은 Client boundary 안에 두고 필요 시 `Suspense` fallback을 제공한다. 브라우저 back/forward 시 hook 값에서 selection을 다시 동기화한다.

- island/filter 클릭은 전체 reload 없이 query와 panel/list를 갱신한다.
- World desktop은 강제 route 이동이나 강제 scroll을 하지 않는다.
- 선택된 control에는 실제 label, icon과 `aria-current` 또는 명확한 selected state를 제공한다.
- 결과 변경은 non-blocking live region에서 category와 결과 수를 알린다.
- href가 있는 `<Link>` 기반 filter도 제공해 JavaScript 실패 시 URL navigation이 가능하게 한다.

## 15. Direct Case Study URL access

`/projects/[slug]`는 intro/progress/badge 조건 없이 직접 렌더링한다.

```ts
export async function generateStaticParams() {
  return approvedProjectSummaries
    .filter(({ id }) => getCaseStudyByProjectId(id) !== undefined)
    .map(({ slug }) => ({ slug }));
}

export default async function Page(props: PageProps<'/projects/[slug]'>) {
  const { slug } = await props.params;
  const project = getProjectSummaryBySlug(slug);
  if (!project) notFound();
  const caseStudy = getCaseStudyByProjectId(project.id);
  if (!caseStudy) notFound();
  // render verified content
}
```

- slug는 승인된 프로젝트 data에서만 나온다. 임의 slug나 프로젝트명을 생성하지 않는다.
- `generateMetadata`도 `await params`하고 승인된 title/summary만 사용한다.
- invalid/unavailable slug는 404 또는 사유가 명확한 unavailable 화면으로 처리한다. 가짜 카드나 잠금 화면으로 위장하지 않는다.
- Case Study 본문은 Server-rendered이므로 검색, 공유, 새 탭과 JavaScript 실패 시에도 핵심 내용을 읽을 수 있다.
- completion Client island는 hydration 후 visited/completed 표시만 덧붙이며 본문 접근을 제어하지 않는다.
- 이전/다음과 Back to projects는 실제 `<Link>`를 사용한다.

## 16. Responsive implementation strategy

공통 breakpoint는 Mobile `<768px`, Tablet `768–1279px`, Desktop `≥1280px`다. CSS media query와 grid를 사용하며 JavaScript viewport branching으로 핵심 콘텐츠를 숨기지 않는다.

| Surface | Desktop ≥1280 | Tablet 768–1279 | Mobile <768 |
|---|---|---|---|
| Prologue | 3-column storyboard, DOM Step 1→3 | 한 scene stepper, 8-column composition | single-column stepper; label→dialogue→character/Portal→actions |
| World | map 7 columns + project panel 5 columns | map full width 뒤 project section | 전체 지도 대신 BUILD→ITERATE→UNDERSTAND chapters |
| Projects | filter 3 + cards 9 columns, 2–3 card columns | top filters + 2-column cards | wrap filter + 1-column; text before thumbnail |
| Case Study | TOC 2–3, body 6–7, metadata 2–3 columns | body 6 + TOC 2 또는 sticky row | On this page accordion + single-column narrative |
| About | asymmetric 12-column editorial | 5/3 또는 stack | positioning부터 related links까지 단일 열 |
| Experience | Period 2 + body 6–7 + related 3–4 | 2/6 또는 stacked entry | 최신순 단일 열; 핵심 metadata는 접지 않음 |
| Contact | statement 7–8 + actions 4–5 | vertical stack, links 최대 2열 | 안내→contact→copy→external→return |

- 본문/DOM 순서는 모든 viewport에서 같다. CSS visual order로 의미 순서를 뒤집지 않는다.
- touch target은 최소 44×44px, control 사이 최소 8px다.
- 200% zoom, 긴 한글 제목과 placeholder에서도 clipping이 없어야 한다.
- scene 이미지는 `sizes`와 명시적 width/height를 사용하고 Mobile 전용 P0 variant만 필요한 곳에서 source를 바꾼다.
- 장식 밀도는 콘텐츠 영역의 15% 이하, 큰 hero pixel scene은 화면당 하나로 제한한다.
- hover는 보조 feedback이며 touch/keyboard에서도 같은 정보와 행동을 제공한다.

## 17. Accessibility verification

목표는 WCAG 2.2 AA다. 자동 검사만으로 완료 처리하지 않고 keyboard와 screen-reader 수동 검증을 병행한다.

### Structure and content

- 각 route에 하나의 `h1`, 순차적 heading, `header/nav/main/footer` landmark를 확인한다.
- `Skip to content`가 첫 focus이며 모든 깊은 화면에 Projects/World 복귀 링크가 있는지 확인한다.
- 프로젝트 Role/Period/Contribution/Impact가 장식이나 hover 없이 읽히는지 확인한다.
- Individual/Team contribution과 status가 색만이 아니라 실제 text로 구분되는지 확인한다.
- 의미 있는 pixel art의 alt와 장식의 빈 alt를 asset record와 대조한다.

### Keyboard and focus

- Tab/Shift+Tab만으로 intro skip, scene step, island/filter, project link, TOC, gallery, completion, contact를 사용할 수 있어야 한다.
- focus-visible은 2px 이상, 2px offset이며 pixel frame에 묻히지 않아야 한다.
- Mobile menu와 Gallery dialog의 focus trap, Escape close, opener focus return을 확인한다.
- step 변경 시 새 heading focus/announcement가 과도한 context loss 없이 작동하는지 확인한다.

### Perception and motion

- 일반 text 4.5:1, 큰 text와 필수 UI graphic 3:1 이상을 실제 token 조합별로 측정한다.
- 200% zoom, text spacing override, Windows High Contrast/forced colors에서 핵심 정보와 focus를 확인한다.
- `prefers-reduced-motion: reduce`에서 승인된 static layer 조합, transform 제거와 장면/CTA 즉시 노출을 확인한다.
- Prologue state 경계에서 layer composition의 silhouette, scale, facing direction과 ground anchor 연속성을 확인한다.
- internal layer motion과 wrapper translate duration의 동기화, 종료 후 정확한 최종 transform/static composition 정착을 확인한다.
- live region은 category 결과, copy 결과, 오류처럼 필요한 변화만 concise하게 알린다.

### Suggested tooling without installation

브라우저 DevTools의 Accessibility tree, Lighthouse, keyboard, VoiceOver(macOS/Safari)를 기본으로 사용한다. axe 또는 Playwright 자동 접근성 검사는 유용하지만 현재 dependency가 아니므로 설치하지 않는다. 도입이 필요하면 목적, 대체 수동 절차, bundle 영향 없음(devDependency), 유지보수 비용을 설명하고 별도 승인을 받는다.

## 18. Verification and responsive QA plan

### Static checks

1. `npm run lint`
2. `npm run build` — Next type generation, dynamic `params/searchParams`, static Case Study routes 포함
3. `npx tsc --noEmit`은 기존 TypeScript 실행 경로가 필요할 때만 사용하며 package 설치는 하지 않는다.
4. `git diff --check`
5. project data guard: unique `id`/`slug`, category 1개, Case Study section canonical order, public Evidence only

### Functional checks

- first visit, Enter, Skip, return visit, Replay, storage unavailable/invalid JSON
- World/Projects category direct URL, invalid query fallback, back/forward restoration
- direct Case Study URL, reload, new tab, invalid slug 404
- visited vs completed 분리, explicit completion only, re-completion, storage deletion, cross-tab update
- dialog open/close/Escape/focus return, accordion state, contact copy success/error
- asset loading/error에서도 title, text, CTA와 navigation 유지
- browser console error, broken link, image path와 aspect-ratio 확인

### Viewport matrix

| Class | 대표 폭 | 핵심 확인 |
|---|---:|---|
| Mobile small | 320px | overflow, 44px targets, long placeholders |
| Mobile standard | 390px | Prologue stepper, chapter order, single-column cards |
| Tablet | 768px, 1024px | breakpoint 경계, 8-column flow, sticky collision |
| Desktop | 1280px, 1440px | 7/5 World split, 3-scene Prologue, editorial max widths |
| Zoom | 200% | reflow, no clipped heading/CTA, navigation access |

최소 Safari, Chrome, Firefox 최신 버전에서 keyboard와 responsive behavior를 확인한다. 실제 기기 확인이 불가능하면 미검증으로 명시한다. 성능은 production build에서 JavaScript chunk, image dimensions, LCP 후보와 layout shift를 확인한다.

## 19. Phased implementation order

전체 UI/UX 골격을 먼저 완성하고 검증한 뒤 에셋, 실제 콘텐츠와 상세 interaction을 연결한다. 각 단계는 이전 단계 결과와 필요한 승인 범위를 확인한 뒤 진행한다.

1. **Foundation approval** — 이 implementation plan, 7개 route, data 분리, Client boundary 승인.
2. **Minimal contracts and CSS foundation** — category/project/case-study/progress type의 골격과 guard, color/type/spacing/grid, reset, focus, reduced-motion, 공통 semantic primitive를 준비한다. 실제 프로젝트 데이터는 입력하지 않는다.
3. **Global navigation shell** — root layout, skip link, SiteHeader, MobileMenu, Footer, breadcrumb, not-found와 Light/Dark/Case Study surface 골격을 만든다.
4. **Seven route skeletons** — `/`, `/world`, `/projects`, `/projects/[slug]`, `/about`, `/experience`, `/contact`를 모두 만들고 각 route에 하나의 `h1`, 목적, 기본 복귀 경로와 승인된 placeholder를 배치한다.
5. **Embedded state placeholders** — Prologue Step 1–3/Portal, World embedded Project Select/Progress/Badge, Project filter states, Case Study TOC/Gallery/Completion, Experience disclosure, Contact feedback의 자리와 semantic container를 만든다. 이 단계에서는 상세 동작과 래스터 에셋을 연결하지 않는다.
6. **Responsive skeleton verification** — 7개 route 전체에서 Desktop/Tablet/Mobile의 navigation, reading order, grid→stack/chapter 전환, 44px touch target, 200% zoom과 긴 placeholder를 먼저 검증한다.
7. **P0 asset integration** — 승인된 10개 logical asset과 확정된 static layer/파생 파일을 Prologue/World 골격에 연결하고 fallback, shared canvas, anchor와 reduced-motion composition을 확인한다.
8. **Approved project data integration** — `ProjectSummary`와 `CaseStudy`를 분리 입력하고 projectId/slug lookup, category, direct Case Study URL, pagination을 연결한다. 승인되지 않은 역할·KPI·성과는 생성하지 않는다.
9. **Core interaction integration** — intro first-visit/replay, World와 Projects category URL query, Mobile menu, stepper, filter와 TOC를 연결한다.
10. **Progress and Badge integration** — versioned localStorage, visited/completed, ProgressPanel과 Badge Completion을 연결한다. 완료는 명시적 버튼으로만 기록한다.
11. **Evidence and secondary interactions** — 공개 승인된 Evidence Gallery, Experience accordion, contact copy와 필요한 dialog focus behavior를 연결한다.
12. **Full accessibility and responsive QA** — 전체 route의 keyboard, VoiceOver, contrast, reduced motion, asset failure와 viewport matrix를 재검증한다.
13. **Production verification** — lint, build, TypeScript, console, links, images, performance와 browser compatibility 결과를 기록한다.

## 20. Decisions required before code

- 이 route 구조, 특히 Prologue `/`와 World `/world` 분리를 승인할지.
- `/world`와 `/projects`에서 direct-query first paint를 위해 Server page가 `searchParams`를 읽어 request-time rendering하는 선택을 승인할지.
- 실제 프로젝트 `id`, `slug`, tier와 primary category.
- Case Study별 공개 콘텐츠, contribution, metric, Evidence와 순서.
- P0 asset 최종 layer 파일, Mobile variant와 code animation timing.
- About, Experience, Contact의 승인 문구·연락처·외부 link.
- 향후 axe/Playwright 같은 dev-only QA 도구가 필요한지. 현재 계획에는 설치하지 않는다.
