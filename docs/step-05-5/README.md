# STEP 05.5 — World Overview UX/UI refinement

검증일: 2026-09-08. 현재 World 구현 범위만 수정했으며, 공개 페이지 추가와 에셋 제작은 진행하지 않았다.

## 변경 파일

- `components/world/WorldRenderer.tsx`: semantic island overlays, 카메라/CHOONI 이동 시간 연동, Focus crop, 라벨과 상태 표시.
- `components/world/WorldScene.tsx`: 기존 pending scene을 이용한 이동 시작, active 상태 이후 Focus HUD, 작은 World identity와 utility UI.
- `components/world/world.module.css`: 섬 강조, 라벨, 상태, hover/focus, HUD, 모바일 디오라마 및 crop 정렬.
- `lib/world-manifest.ts`: 승인된 INVADER/FitMate 명칭·outcome과 세 프로젝트 category metadata. 기존 프로젝트 ID 및 좌표·카메라 preset 값 보존.
- `types/world.ts`: category와 focusCategory 타입 추가.
- `docs/step-05-5/`: 최종 브라우저 캡처와 검증 기록.

## 시각 및 동작

BUILD는 supporting 섬 대비 너비 1.2배, 더 큰 제목과 밝은 지형으로 강조한다. ITERATE와 UNDERSTAND도 동일한 placeholder 품질을 유지한다. grid 배경과 HUD 패널 장식을 줄이고 섬을 주요 선택 대상으로 유지했다.

Overview 라벨은 번호·capability·프로젝트명·product category만 표시한다. 실제 HTML 버튼은 capability, category 및 잠금 사유를 accessible name으로 제공한다. Available은 화살표와 hover/focus 윤곽, Active는 마름모와 외곽선, Locked는 점선과 별도 표식, Completed는 체크와 이중 테두리로 구분한다. Completed 표시는 구현했지만 이번 Journey에서 완료 상태를 강제로 주입하지 않았다.

CHOONI는 중앙 앵커에서 시작해 선택한 섬의 기존 destination anchor로 이동한다. pending scene으로 카메라와 이동을 함께 시작하며, 별도 타이머나 hover 반응은 없다. Back은 중앙 위치와 Overview 카메라로 복귀한다. prefers-reduced-motion에서는 이동 transition이 제거된다.

Focus HUD는 기존 scene이 active로 정착한 뒤 나타난다. 프로젝트명, outcome, category, ENTER PROJECT, BACK TO WORLD를 제공한다. Focus 중 섬 라벨을 숨겨 HUD와 중복·겹침을 줄였다. ENTER PROJECT는 기존 ENTER_ISLAND 이벤트를 유지하며, 이후 Case Study 화면 완성은 이번 범위가 아니다.

모바일 Overview는 1600 × 900 월드를 390px 폭의 디오라마로 담는다. Focus는 기존 섬·CHOONI 앵커 중간 지점을 crop 중심으로 사용한다. world coordinate 및 interaction bounds는 변경하지 않았다. 모바일 라벨은 기존 앵커 기준 CSS offset으로 배치해 CHOONI와 분리했다.

## 최종 Chrome 검증

production build를 `next start --port 3015`로 실행하고, 로컬 Headless Chrome/CDP에서 확인했다. 진행 규칙 우회 없이 Intro부터 BUILD를 선택했다.

| 확인 항목 | 결과 |
| --- | --- |
| Desktop Overview, 1440 × 900 | 세 목적지 라벨 표시, BUILD 강조, 중앙 CHOONI, 가로 넘침 없음 |
| Desktop BUILD Focus | BUILD_FOCUS 전환, Active 표식, 이동 중 HUD 없음, 정착 후 HUD 표시 |
| CHOONI 이동 | 중간 프레임과 최종 좌표가 다름. 중앙 → 목적지 이동 확인 |
| Back | OVERVIEW 및 CHOONI 원래 위치 복원 |
| Locked ITERATE | 선택 입력 후 OVERVIEW 유지 |
| UNDERSTAND Locked | 점선/표식 및 disabled semantic 상태 확인; Focus는 우회하지 않음 |
| Mobile Overview, 390 × 844 | 세 라벨 표시, CHOONI와 라벨 분리, scrollWidth 390px |
| Mobile BUILD Focus, 390 × 844 | CHOONI x216–255/y392–431, HUD x22–368/y607–826. 서로 겹치지 않고 화면 내부에 위치 |
| Keyboard | Tab 입력 후 focus-visible solid outline 확인, Enter 키로 BUILD_FOCUS 전환 |
| Reduced motion | 카메라와 CHOONI transition-duration 모두 0s |
| Browser runtime exceptions | 최종 검증 실행에서 0건 |

[Desktop Overview](desktop-overview.png) · [Desktop BUILD Focus](desktop-build-focus.png) · [390 × 844 Mobile Overview](mobile-overview.png)

추가 확인: [Mobile BUILD Focus](mobile-build-focus.png), [Keyboard focus](desktop-keyboard-focus.png), [측정 결과 JSON](browser-validation.json).

## 빌드 및 정적 검사

- `npm run lint`: 통과.
- `npx --no-install tsc --noEmit`: 최종 빌드 후 통과.
- `npm run build`: Turbopack이 CSS 처리 중 로컬 포트 바인딩 `Operation not permitted`로 실패. 권한 재실행에서도 동일했다.
- `npm run build -- --webpack`: 최종 CSS 수정 후 production build 통과. package scripts와 설정은 변경하지 않았다.
- `git diff --check`: 통과.

초기 TypeScript 검사를 build와 동시에 실행했을 때 `.next/types` 재생성 충돌이 있었다. 최종 빌드 완료 후 독립 실행하여 통과했다. 캡처 도구는 Chrome 확장 배경 페이지를 제외하고 실제 page target만 사용하도록 수정했다. 실패한 초기 캡처는 최종 파일로 덮어썼다.

## 범위 제한과 시각 리뷰

`/projects`, `/about`, `/experience`, 공개 Case Study는 현재 저장소에 없다. 후속 사용자 지시에 따라 추가하지 않았다. World utility에 PROJECTS · SOON과 About/Experience 비활성 텍스트를 표시했으며 recruiter fast path 동작 완료로 간주하지 않는다.

승인된 생산 PNG, world production images, provenance, 생성 스크립트, `/app/dev/chooni-motion/`, SceneManager, transition architecture, progression resolver는 수정하지 않았다. 새 패키지를 설치하지 않았다.

시각 리뷰가 필요한 항목은 placeholder 단계의 BUILD 강조 정도, 모바일 디오라마 크기와 여백, Locked 표식의 직관성, 최종 아트 통합 전 배경 경계다. Safari/Firefox, 실제 모바일 기기, 완료된 Journey 전체 및 공개 Case Study 탐색은 검증하지 않았다.

STEP 05.5에서 작업을 종료한다. 다음 단계는 이 캡처의 시각 리뷰이며, ITERATE 에셋 제작이나 공개 페이지 구현으로 진행하지 않는다.
