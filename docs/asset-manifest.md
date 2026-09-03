# MOVE ON Asset Manifest

> Status: **제작 전 인벤토리 / 모든 래스터 항목 미제작**  
> Source of truth: `AGENTS.md`, `docs/design-system.md`, `docs/ui-architecture.md`  
> Character naming: 한글 **춘이**, 영문 **CHOONI**  
> Character component: `ChooniCharacter`  
> Scope: 게임 엔진용 리소스 목록이 아니라, 게임형 포트폴리오 웹사이트에 필요한 래스터 에셋과 CSS/HTML 구현 책임을 구분한다.

## 1. 제작 및 구현 원칙

- 픽셀 래스터로 제작하는 대상은 춘이, Portal, 세 capability 섬, 승인된 프로젝트별 고유 오브젝트, 배지의 핵심 문양, 배경 scene·환경 장식, 일부 픽셀 아이콘이다.
- 버튼, 말풍선, 카드, HUD panel, focus ring, 상태 표현, progress bar, divider, status label과 responsive layout은 HTML/CSS로 구현한다.
- UI 문구, 프로젝트명, capability 이름, 상태, CTA는 이미지 안에 넣지 않고 실제 HTML 텍스트로 제공한다.
- 프로젝트 결과물과 Evidence는 픽셀화하지 않고 원본의 정보성과 증거 가치를 유지한다.
- 래스터 픽셀아트는 공통 pixel density와 제한된 팔레트를 사용하고 정수 배율로 확대한다. 기본 픽셀 단위는 4px 또는 8px다.
- 아래 기준 크기는 화면 표시 크기가 아니라 **1× 원본 제작 크기**다.
- `PNG 9-slice`는 래스터 질감이 의미상 반드시 필요한 예외에만 검토한다. 현재 기본 UI 컴포넌트에는 사용하지 않는다.
- 애니메이션은 정보 이해에 필요한 짧은 동작만 사용한다. 지속적인 idle animation은 만들지 않는다.
- `prefers-reduced-motion`에서는 각 항목에 지정된 정지 프레임만 사용한다.
- 의미 있는 이미지에는 목적을 설명하는 alt를 제공하고, 장식 이미지는 빈 alt를 사용한다.

### 우선순위

| 우선순위 | 기준 |
|---|---|
| P0 | Prologue와 World Map의 승인된 핵심 장면에 반드시 필요한 에셋 |
| P1 | 현재 UI Architecture에서 필요성이 확인된 보조 에셋 |
| Deferred | 프로젝트 콘텐츠, 공개 범위 또는 실제 사용 필요성 승인 후에만 제작할 후보 |

## 2. P0 — Core raster assets

### 2.1 춘이 / CHOONI poses and animations

모든 춘이 에셋 ID는 `chooni-*`를 사용하며 UI에서는 `ChooniCharacter`가 렌더링한다.

| 에셋 이름 | 사용 화면 | 역할 | 파일 형식 | 투명 배경 | 프레임당 캔버스 | 프레임 수 | Sprite sheet 배열 | 전체 sheet 크기 | 프레임 시간 | Loop | Reduced-motion 정지 프레임 | Desktop / Mobile variant | 우선순위 | 제작 상태 |
|---|---|---|---|---|---:|---:|---|---:|---:|---|---|---|---|---|
| `chooni-prologue-greeting` | Prologue Step 1 | 춘이와 안내 경험을 처음 소개 | PNG sprite sheet | 예 | 128×128px | 4 | 4×1 | 512×128px | 140ms | 아니오 | frame 4 | 불필요 | P0 | **미제작** |
| `chooni-prologue-guide` | Prologue Step 2 | 다음 장면과 탐색 방향 안내 | PNG sprite sheet | 예 | 128×128px | 4 | 4×1 | 512×128px | 140ms | 아니오 | frame 4 | 필요: Mobile은 정면 방향 variant | P0 | **미제작** |
| `chooni-prologue-departure` | Prologue Step 3 | Portal과 Enter CTA 방향 제시 | PNG sprite sheet | 예 | 128×128px | 4 | 4×1 | 512×128px | 140ms | 아니오 | frame 4 | 필요: Portal 배치 방향 variant | P0 | **미제작** |
| `chooni-world-guide` | World Map | capability와 Project Select 맥락 안내 | PNG sprite sheet | 예 | 96×96px | 4 | 4×1 | 384×96px | 160ms | 아니오 | frame 1 | 필요: Mobile 80×80px/frame, 4×1, 320×80px | P0 | **미제작** |

### 2.2 Portal

| 에셋 이름 | 사용 화면 | 역할 | 파일 형식 | 투명 배경 | 프레임당 캔버스 | 프레임 수 | Sprite sheet 배열 | 전체 sheet 크기 | 프레임 시간 | Loop | Reduced-motion 정지 프레임 | Desktop / Mobile variant | 우선순위 | 제작 상태 |
|---|---|---|---|---|---:|---:|---|---:|---:|---|---|---|---|---|
| `portal-step-3` | Prologue Step 3 embedded scene | Light Mode에서 Dark World 진입을 예고하는 hero 픽셀아트 | PNG sprite sheet | 예 | 256×320px | 6 | 3×2 | 768×640px | 100ms | 아니오 | frame 1 | 필요: Mobile 192×240px/frame, 3×2, 576×480px | P0 | **미제작** |

Portal의 glow, threshold와 entering 강조는 가능한 범위에서 하나의 sprite에 포함한다. CTA와 focus 상태는 HTML/CSS가 담당한다.

### 2.3 BUILD / ITERATE / UNDERSTAND islands

각 섬은 기본 래스터 에셋 1개만 제작한다. hover, focus, active, selected, visited는 CSS `outline`, `transform`, overlay와 실제 텍스트/아이콘으로 표현한다.

| 에셋 이름 | 사용 화면 | 역할 | 파일 형식 | 투명 배경 | 기준 크기 | Desktop / Mobile variant | 상태/애니메이션 | 우선순위 | 제작 상태 |
|---|---|---|---|---|---:|---|---|---|---|
| `island-build` | World Map, Mobile BUILD chapter | BUILD 영역의 시각적 진입점; 깃발·상승 계단/블록 cue | PNG | 예 | 320×240px | 필요: Mobile chapter 288×168px | 정지 이미지 1개; 모든 상호작용 상태는 CSS | P0 | **미제작** |
| `island-iterate` | World Map, Mobile ITERATE chapter | ITERATE 영역의 시각적 진입점; 순환·레이어 cue | PNG | 예 | 320×240px | 필요: Mobile chapter 288×168px | 정지 이미지 1개; 모든 상호작용 상태는 CSS | P0 | **미제작** |
| `island-understand` | World Map, Mobile UNDERSTAND chapter | UNDERSTAND 영역의 시각적 진입점; 렌즈·경로·연결점 cue | PNG | 예 | 320×240px | 필요: Mobile chapter 288×168px | 정지 이미지 1개; 모든 상호작용 상태는 CSS | P0 | **미제작** |

### 2.4 World background scenes

World Map은 tile 기반 게임 월드로 제작하지 않는다. Desktop/Tablet은 하나의 공통 scene을 사용하고 Mobile은 세로 capability chapter용 배경을 사용한다.

| 에셋 이름 | 사용 화면 | 역할 | 파일 형식 | 투명 배경 | 기준 크기 | Desktop / Mobile variant | 상태/애니메이션 | 우선순위 | 제작 상태 |
|---|---|---|---|---|---:|---|---|---|---|
| `world-background-desktop` | World Map Desktop/Tablet | 세 섬이 배치되는 Dark World의 공통 배경 scene | PNG | 아니오 | 1440×900px | Tablet은 동일 원본의 안전 crop 사용 | 정지 이미지 1개 | P0 | **미제작** |
| `world-background-mobile-chapter` | World Map Mobile | 축소 지도를 대체하는 세로 chapter 공통 배경 | PNG | 아니오 | 390×320px | Mobile 전용; capability별 CSS accent overlay 허용 | 정지 이미지 1개 | P0 | **미제작** |

## 3. P1 — Confirmed supporting raster assets

P1에는 현재 승인된 화면 구조에서 실제 의미가 확인된 최소 보조 에셋만 둔다. 프레임, 상태 변화와 레이아웃은 포함하지 않는다.

| 에셋 이름 | 사용 화면 | 역할 | 파일 형식 | 투명 배경 | 기준 크기 또는 프레임 캔버스 | 프레임/아이콘 수 | Sheet 배열 및 전체 크기 | 시간 / Loop / Reduced-motion | Desktop / Mobile variant | 우선순위 | 제작 상태 |
|---|---|---|---|---|---:|---:|---|---|---|---|---|
| `capability-icon-build` | World Map, Project Select, badges | BUILD를 색 외 형태로 구분 | PNG | 예 | 32×32px | 1 | 해당 없음 | 해당 없음 | 불필요 | P1 | **미제작** |
| `capability-icon-iterate` | World Map, Project Select, badges | ITERATE를 색 외 형태로 구분 | PNG | 예 | 32×32px | 1 | 해당 없음 | 해당 없음 | 불필요 | P1 | **미제작** |
| `capability-icon-understand` | World Map, Project Select, badges | UNDERSTAND를 색 외 형태로 구분 | PNG | 예 | 32×32px | 1 | 해당 없음 | 해당 없음 | 불필요 | P1 | **미제작** |
| `icon-progress-visited` | Project Card, World Progress | 방문 기록을 텍스트와 함께 보조 | PNG | 예 | 24×24px | 1 | 해당 없음 | 해당 없음 | 불필요 | P1 | **미제작** |
| `icon-progress-completed` | Project Card, World Progress, Badge Collection | 사용자가 활성화한 완료 상태를 텍스트와 함께 보조 | PNG | 예 | 24×24px | 1 | 해당 없음 | 해당 없음 | 불필요 | P1 | **미제작** |
| `case-study-section-icons` | Case Study TOC/Narrative | Problem, Context, Insight, Decision, Execution, Result, Learning 구분 | PNG sprite sheet | 예 | 32×32px/icon | 7 | 7×1 / 224×32px | 애니메이션 아님 | 불필요 | P1 | **미제작** |
| `contribution-icons` | Contribution Matrix | Individual / Team Contribution 구분 | PNG sprite sheet | 예 | 32×32px/icon | 2 | 2×1 / 64×32px | 애니메이션 아님 | 불필요 | P1 | **미제작** |

## 4. Deferred raster assets — content approval required

아래 항목은 자산 종류만 예약한다. 실제 프로젝트 콘텐츠, category, 공개 가능 모티프 또는 화면 필요성이 승인되기 전에는 파일명 suffix, 개수, 크기, 프레임 수와 우선순위를 확정하거나 제작하지 않는다.

| 에셋 이름 | 사용 화면 | 역할 | 파일 형식 | 투명 배경 | 기준 크기 | Desktop / Mobile variant | 필요한 상태 또는 애니메이션 프레임 | 우선순위 | 제작 상태 |
|---|---|---|---|---|---|---|---|---|---|
| `project-object-[project-id]` | World Map island, Project Card | 승인된 실제 프로젝트를 식별하는 고유 오브젝트 | PNG | 예 | 승인 후 확정 | 승인 후 확정 | 기본 정지 이미지 우선 | Deferred | **미제작** · 프로젝트 선정/category 승인 필요 |
| `badge-symbol-[project-id]` | Badge Collection, Badge Completion | 읽은 프로젝트를 회고하는 배지의 핵심 문양 | PNG | 예 | 승인 후 확정 | 승인 후 확정 | unearned는 CSS 처리; 문양은 정지 이미지 1개 | Deferred | **미제작** · 프로젝트 선정/문양 승인 필요 |
| `chooni-empty` | Project Select empty state | 실제 빈 상태에서만 사용하는 춘이 정지 포즈 | PNG | 예 | 승인 후 확정 | 승인 후 확정 | 정지 이미지 1개 | Deferred | **미제작** · 빈 상태 사용 필요성 확인 필요 |
| `chooni-error` | 공통 error state | 복구 안내를 보조하는 춘이 정지 포즈 | PNG | 예 | 승인 후 확정 | 승인 후 확정 | 정지 이미지 1개 | Deferred | **미제작** · 오류 화면 사용 필요성 확인 필요 |
| `chooni-about` | About | 소개 콘텐츠를 보조하는 춘이 포즈 | PNG | 예 | 승인 후 확정 | 승인 후 확정 | 정지 이미지 1개 | Deferred | **미제작** · About 콘텐츠 승인 필요 |
| `chooni-contact-farewell` | Contact | 연락 CTA를 보조하는 작별 포즈 | PNG | 예 | 승인 후 확정 | 승인 후 확정 | 필요 시 4-frame non-loop; reduced-motion 마지막 frame | Deferred | **미제작** · Contact 콘텐츠 승인 필요 |
| `environment-prologue-set` | Prologue | Light Mode의 저밀도 환경 장식 | PNG sprite sheet | 예 | 승인 후 확정 | 승인 후 확정 | 정지 오브젝트만 우선 | Deferred | **미제작** · 최종 scene composition 승인 필요 |
| `environment-world-set` | World Map | 배경 scene 위 제한적 환경 장식 | PNG sprite sheet | 예 | 승인 후 확정 | 승인 후 확정 | 정지 오브젝트만 우선 | Deferred | **미제작** · 최종 scene composition 승인 필요 |
| `environment-contact-set` | Contact | 연락 영역의 저밀도 환경 장식 | PNG sprite sheet | 예 | 승인 후 확정 | 승인 후 확정 | 정지 오브젝트만 우선 | Deferred | **미제작** · Contact composition 승인 필요 |
| `about-zero-to-one-motif` | About | 0→1 여정을 보조하는 픽셀 모티프 | PNG | 예 | 승인 후 확정 | 승인 후 확정 | 정지 이미지 1개 | Deferred | **미제작** · About 콘텐츠 승인 필요 |
| `experience-milestone-icon-set` | Experience | 경력 milestone을 보조하는 픽셀 아이콘 | PNG sprite sheet | 예 | 승인 후 확정 | 불필요 예상 | 정지 아이콘 | Deferred | **미제작** · 경력 taxonomy 승인 필요 |
| `icon-email` | Contact | 이메일 링크 보조 | PNG | 예 | 24×24px 예상 | 불필요 | 정지 이미지 1개 | Deferred | **미제작** · 연락 수단 승인 필요 |
| `icon-external-profile` | Contact, Footer | 외부 프로필 링크 보조 | PNG | 예 | 24×24px 예상 | 불필요 | 정지 이미지 1개 | Deferred | **미제작** · 외부 링크 승인 필요 |

## 5. CSS-native UI component specification

다음 항목은 래스터 asset이 아니다. 기본 UI는 semantic HTML과 CSS로 만들며, 필요한 경우 디자인 토큰과 계단형 `clip-path`, `border`, `box-shadow`, pseudo-element를 사용한다.

| UI 항목 | 사용 화면 | HTML/CSS 책임 | 이미지 에셋 여부 |
|---|---|---|---|
| Button frames | 전체 화면 | 크기, border, pixel corner, shadow, disabled와 pressed 표현 | 없음 |
| Speech bubbles | Prologue, World, 상태 안내 | 유연한 본문 크기, 꼬리 pseudo-element, light/dark surface | 없음 |
| Project/Card frames | World panel, Project Select, Case Study | responsive padding, border, category accent, content overflow 대응 | 없음 |
| HUD panel | SiteHeader, World Progress/Badge | 좌표·상태 라벨 surface, responsive collapse, contrast | 없음 |
| Focus ring | 모든 interactive control | 2px 이상 고대비 ring과 2px offset | 없음 |
| Hover / active / selected / visited | 섬, 카드, 버튼, 필터 | outline, transform, surface/overlay, label/icon과 `aria-current` 연동 | 없음 |
| Progress bar | World Progress, Case Study TOC | 실제 progress semantics, track/fill, reduced-motion 대응 | 없음 |
| Divider | Case Study, About, Experience | 흐름과 section 구분; light/dark token 적용 | 없음 |
| Status label | Project Card, notice | Featured/New/확인 필요/unavailable 실제 텍스트와 semantic color | 없음 |
| Responsive layout | 전체 화면 | Desktop/Tablet grid와 Mobile chapter/stack 전환 | 없음 |
| Badge frame | Badge Collection/Completion | frame, unearned/earned surface, completion panel | 없음; 핵심 문양만 PNG |
| Portal CTA | Prologue Step 3 | Enter 버튼, focus, loading/error에서도 동작 유지 | 없음; Portal scene만 PNG |

## 6. Buttons and decorative pointer

- 버튼 프레임은 전부 CSS-native이며 별도 PNG를 제작하지 않는다.
- 시스템 커서를 대체하는 `CUR` 파일은 제작하지 않는다.
- 장식용 포인터가 시각 콘셉트에 실제로 필요하다고 승인되는 경우에만 `decorative-pointer` PNG를 추가한다. 포인터는 클릭 가능 상태나 시스템 cursor를 대신하지 않으며 현재는 Deferred다.

| 에셋 이름 | 사용 화면 | 역할 | 파일 형식 | 투명 배경 | 기준 크기 | Desktop / Mobile variant | 필요한 상태 또는 애니메이션 프레임 | 우선순위 | 제작 상태 |
|---|---|---|---|---|---:|---|---|---|---|
| `decorative-pointer` | Desktop editorial decoration | 비상호작용 장식 | PNG | 예 | 32×32px 예상 | Mobile 미사용 | 정지 이미지 1개 | Deferred | **미제작** · 실제 필요성 승인 필요 |

## 7. Lock / progress / status treatment

- `available`, `visited`, `completed`, `unavailable`은 실제 HTML 텍스트를 항상 제공한다.
- 모든 프로젝트는 기본적으로 접근 가능하다. lock은 진행 잠금에 사용하지 않는다.
- 비공개·준비 중 프로젝트가 실제로 존재할 때만 CSS-native lock icon 또는 승인된 24×24px 픽셀 PNG를 검토하고, 사유 텍스트를 함께 표시한다.
- progress bar, loading spinner, status label은 CSS-native다.
- P1의 visited/completed 아이콘 외 info/success/warning/error 아이콘은 우선 시스템 또는 CSS icon으로 구현하고, 픽셀 래스터가 꼭 필요하다고 확인될 때만 Deferred 목록에 추가한다.

## 8. Animation delivery checklist

모든 애니메이션 래스터 전달물에는 다음 정보를 파일 metadata 또는 handoff 문서에 동일하게 기록한다.

| 항목 | 필수 기록 내용 |
|---|---|
| Per-frame canvas size | 각 프레임의 정확한 width × height(px) |
| Frame count | 중복 프레임을 포함한 총 프레임 수 |
| Sprite sheet columns × rows | 읽기 순서는 왼쪽→오른쪽, 위→아래 |
| Total sprite sheet size | per-frame size × columns/rows와 일치해야 함 |
| Frame duration | ms 단위; 가변 duration이면 frame별 기재 |
| Loop 여부 | `yes/no`와 반복이 중단되는 조건 |
| Reduced-motion static frame | 1부터 시작하는 대체 frame 번호 |

## 9. 제작 전 확인 항목

1. 춘이의 외형, 표정 범위, 방향, 기준 팔레트와 공통 pixel density.
2. 실제 프로젝트 목록과 각 프로젝트의 BUILD / ITERATE / UNDERSTAND primary category.
3. 프로젝트별 고유 오브젝트와 배지에 사용할 수 있는 공개 모티프.
4. Portal과 춘이 애니메이션의 최종 timing을 프로토타입에서 검증.
5. 최종 scene composition에서 환경 장식이 실제로 필요한 위치와 수량.
6. 각 의미 있는 에셋의 alt, 장식 에셋의 빈 alt, 원본·저작권·사용 허가·crop 기준.

## 10. Responsibility summary

| Raster asset | CSS-native UI | Real HTML text | Deferred until content approval |
|---|---|---|---|
| 춘이 핵심 포즈·짧은 non-loop 애니메이션 | 버튼·말풍선·카드·HUD frame | 캐릭터 안내 문구와 CTA | 프로젝트별 고유 오브젝트 |
| Step 3 Portal scene | focus ring과 hover/active/selected/visited | 프로젝트명, Role, Period, Contribution/Impact | 프로젝트별 배지 핵심 문양 |
| BUILD / ITERATE / UNDERSTAND 섬 기본 이미지 | 섬의 outline·transform·overlay 상태 | capability 이름·설명·결과 수 | 추가 춘이 포즈와 상태 장면 |
| Desktop/Tablet World background scene | progress bar, divider, status label | available/visited/completed/unavailable 상태와 사유 | About/Experience/Contact 모티프와 환경 장식 |
| Mobile chapter background | responsive grid, chapter와 stack layout | 오류·빈 상태·복구 안내 | 연락처·외부 프로필 아이콘 |
| 승인된 일부 capability/progress/Case Study 픽셀 아이콘 | Badge frame과 completion panel | Badge 완료 안내와 다음 행동 | 장식용 pointer 및 기타 비필수 장식 |
