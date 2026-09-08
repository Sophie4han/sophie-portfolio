# STEP 06 — Production World Visual Integration

검증일: 2026-09-08. 기준 checkpoint: `c0f7979a3aa40acf3c1b51d440d4476e44e3e7db`.

## 변경 파일

- `components/world/WorldRenderer.tsx`: 승인된 배경/BUILD PNG를 전체 raster layer로 렌더링, 기존 semantic interaction overlay 보존.
- `components/world/world.module.css`: 밝은 배경의 텍스트 대비, production BUILD 상태 표시, 조용한 미완성 섬, 좁은 모바일 Overview 표시 폭.
- `lib/world-manifest.ts`: production raster/asset 및 승인된 BUILD visual/state metadata, CHOONI 승인 앵커 정합화.
- `types/world.ts`: raster와 선택적 production asset/bounds/marker 필드.
- `docs/step-06/`: Chrome 캡처, 측정 JSON, 원본 무결성 확인, 이 리포트.

## 통합 에셋과 정확한 배치

- Background: `public/images/pixel/world/shared/world-background-floating-v02.png`
- BUILD: `public/images/pixel/world/islands/harubareun/island-harubareun-base.png`

두 원본은 1920 × 1080이다. 1600 × 900 논리 월드에서 원점이 raster (160,90)이므로 두 이미지 모두 `left:-10%; top:-10%; width:120%; height:120%`로 렌더링한다. Next Image의 `unoptimized`로 원본을 직접 사용한다. 이미지 파일을 trim, stretch 또는 재저장하지 않는다. 카메라가 두 layer에 동일하게 적용된다.

BUILD PNG는 투명 여백 안에 이미 배치되어 있다. 승인 visual box `(245,170,300,205)`에 이미지를 다시 끼워 넣지 않는다. 승인 문서의 실제 alpha box는 logical `(265,170,260,205)`이며 전체 raster를 그대로 정렬하면 승인 visual box 내부에 놓인다. visual box는 상태 wrapper에 사용한다.

| 계약 | 적용 값 |
| --- | --- |
| Logical world | 1600 × 900 |
| Visual box | x245, y170, w300, h205 |
| Interaction bounds | x220, y145, w360, h250 |
| Focus point | x390, y275 |
| Label anchor | x390, y135 |
| State marker | x520, y175 |
| CHOONI destination | x535, y375 |

STEP 05.5 runtime의 CHOONI `(555,365)`는 이번 요청과 승인 provenance의 `(535,375)`와 달랐다. 승인된 값을 적용했으며 다른 섬의 앵커는 변경하지 않았다. 중앙 CHOONI `(800,430)` 유지.

원본 SHA-256과 checkpoint bytes 일치는 [asset-integrity.json](asset-integrity.json)에 기록했다. 승인 PNG, provenance, 생성 스크립트는 변경하지 않았다.

## 카메라 / 모바일 표시 변경

모든 manifest camera preset은 그대로다. Desktop BUILD_FOCUS는 translate `(18%,13%)`, scale `1.55`, origin `(24%,30%)`를 유지한다. 기존 카메라에서 전체 BUILD가 보이므로 preset 보정은 하지 않았다.

390 × 844의 기존 Overview 표시 폭 100vw에서는 alpha 아트 폭이 약 63px였다. 작은 아트를 개선하기 위해 **viewport ≤480px, Overview만** cameraRig width를 `100vw → 136vw`로 바꿨다. 390px에서 logical world 표시 폭은 `390 → 530.4px`, BUILD alpha 폭은 약 `63.4 → 86.2px`다. 섬 좌표는 동일하고 세 목적지 라벨 및 아트가 화면 안에 남는다. 모바일 Focus width `200vw`는 유지한다.

모바일 Focus crop은 기존처럼 섬과 CHOONI의 중간 앵커를 사용한다. 승인 CHOONI 정합화에 따라 파생 translate만 X `20.46875% → 21.09375%`, Y `14.44444% → 13.88889%`로 바뀐다. 별도 preset 변경은 없다.

## Active / UI / CHOONI

BUILD ellipse를 제거하고 실제 PNG를 표시한다. Active는 작은 마름모 marker와 5px의 약한 alpha 외곽 glow를 사용한다. Hover는 약한 glow, 키보드 focus는 interaction bounds를 따라 2px dashed outline이다. 큰 lime 원이나 두꺼운 selection ring은 production 아트에 적용하지 않는다.

INVADER/FitMate는 낮은 강조의 임시 타원으로 유지한다. 새 숲/건물 CSS나 최종 아트를 생성하지 않았다. 잠금·선택·완료 marker 분기는 유지한다. Focus에서는 선택하지 않은 섬을 더 흐리게 표시한다.

라벨은 HTML이며 Overview의 번호/capability/name/category를 유지한다. BUILD label은 canopy 위에 위치한다. Focus에서는 기존 STEP 05.5처럼 라벨을 숨기고 HUD로 정보를 전달한다. 밝은 배경에 맞춰 글자를 어둡게 하고 HUD에 얇은 밝은 바탕을 사용했다.

CHOONI는 기존 원형 placeholder다. 중앙에서 승인 BUILD destination으로 이동하며, production 섬의 전경과 주요 작업장에 겹치지 않는다. HUD는 scene 정착 후 표시되고 섬과 CHOONI를 가리지 않는다. 이동/복귀/모션 감소 로직은 기존 scene 상태를 사용한다.

## Chrome 검증과 캡처

Webpack production build를 로컬 `next start --port 3016`에서 실행하고 Headless Chrome/CDP로 검증했다. 실제 PNG의 1920 × 1080 로드와 decode를 확인했다. 진행 상태를 우회하지 않고 Intro → Overview → BUILD로 진입했다.

- [Desktop Overview — 1440 × 900](desktop-overview.png): production BUILD 전체, 공유 배경, 세 HTML 라벨 확인.
- [Desktop BUILD Focus — 1440 × 900](desktop-build-focus.png): 섬 전체와 workshop/woodland/길 확인, CHOONI와 HUD 분리. 작은 병·상자의 세부는 원본 해상도 한계가 있다.
- [Mobile Overview — 390 × 844](mobile-overview.png): 표시 폭 보정 후 세 섬/라벨이 화면 내부. BUILD 아트는 약 86px 폭이며 세부 작품 설명은 Focus에서 보는 구조다.
- [Mobile BUILD Focus — 390 × 844](mobile-build-focus.png): 전체 BUILD, 주변 CHOONI, 하단 HUD와 주요 버튼 확인. 원본 아트 잘림 없음.
- [Keyboard focus](desktop-keyboard-focus.png): 2px dashed focus 표시. Enter로 BUILD_FOCUS 진입 확인.

Back은 OVERVIEW와 중앙 CHOONI로 복귀했다. Locked ITERATE 선택 입력은 Overview를 유지했다. UNDERSTAND 잠금 시각/semantic 상태는 유지되며, 이후 Journey를 우회해 Focus를 열지 않았다. Reduced motion에서 카메라/CHOONI transition-duration 0s. 최종 실행의 runtime exception은 0건이다. 자세한 좌표/상태는 [browser-validation.json](browser-validation.json)에 있다.

## 검사 결과와 범위 제한

- `npm run lint`: 통과.
- `npx --no-install tsc --noEmit`: 최종 build 후 통과.
- `npm run build -- --webpack`: 최종 변경으로 production build 통과. STEP 05.5에서 확인된 Turbopack 로컬 포트 제한 때문에 승인된 Webpack 경로를 사용했다.
- `git diff --check`: 통과.

SceneManager, progression resolver, transition system, `/app/dev/chooni-motion/`, 승인 final assets는 변경하지 않았다. 패키지 설치 없음. `/projects` 등 공개 페이지는 checkpoint부터 존재하지 않아 기존 PROJECTS · SOON 상태를 유지했으며 recruiter fast path 완료로 보고하지 않는다.

실제 모바일 기기/Safari/Firefox, 완료 상태 Journey 전체, 공개 Case Study 탐색은 검증하지 않았다. 모바일 Overview의 아트 크기와 portrait 여백은 최종 시각 리뷰 대상이다. Final character rig와 sprite, INVADER/FitMate production asset은 이번 범위가 아니다.

**시각 승인 대기. 커밋·push 및 다음 에셋 제작은 하지 않는다.**
