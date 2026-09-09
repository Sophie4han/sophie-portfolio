# STEP 07 — Prologue Production Visual

시각 검토용 구현. 커밋/push 및 다음 STEP 진행 없음.

## 변경 범위

- `components/intro/IntroScene.tsx`: 기존 copy/reply/fast-path contract 유지, 환경을 WoodlandStage로 분리, 작은 MOVE ON HUD, 진행 중 중복 primary reply 비활성화.
- `components/intro/WoodlandStage.tsx`: 공통 지면 좌표계, 배경, 조건부 Gate, 교체 가능한 CHOONI renderer. Gate는 이미지 리소스만 preload하며 Greeting DOM에 시각 노드는 없음.
- `components/intro/intro-scene.module.css`: 환경 framing, 작은 dialogue, 반응/회전/이동, 모바일 별도 배치, focus와 reduced-motion.
- `lib/prologue-visual.ts`: 명시적 feet anchors.
- `components/game/scene-transition.module.css`: World 전환 overlay 색만 daylight cream으로 변경.
- `public/images/pixel/prologue/woodland-clearing-v01.png`: 1536×1024 숲 배경.
- `public/images/pixel/prologue/woodland-gate-v01.png`: 별도 alpha 석문.
- `docs/step-07/`: 검토 캡처, 브라우저 측정, 생성 프롬프트, 보고서.

SceneManager, SceneViewport, transition coordinator/descriptors, reducer, World renderer/manifest/원본 에셋, `/app/dev/chooni-motion/`은 수정하지 않았다. npm package 추가 없음.

## Visual 구조

WoodlandStage → 공통 woodland plane → background / gate / feet anchor + shadow + ChooniPlaceholder.
Dialogue와 MOVE ON HUD는 화면 기준 HTML 레이어다. 모노 라벨, 짙은 sage/ink, cream 표면과 작은 UI 밀도는 현재 World treatment를 따른다. 기존 영어 copy를 유지한다. Reply 후 Follow/Enter 버튼은 없다.

배경은 새로 생성한 raster 한 장에 작은 clearing, 길, 풀, 꽃, 돌, 낮은 관목과 주변 숲을 포함한다. 배경에 Gate나 춘이가 그려져 있지 않다. Next Image responsive 최적화를 사용한다. 원본과 생성 프롬프트는 저장소에 보존했다. [생성 프롬프트](asset-prompts.md).

Gate는 작은 stone+moss alpha 이미지와 내부의 약한 cream/sage atmospheric 면으로 구성한다. 기존 `gateVisibility`가 hidden일 때 렌더링하지 않는다. 문 등장 이후에만 빛이 존재한다. 현재 4개의 semantic scene과 모든 자동 진행 시간은 유지한다.

## CHOONI 교체 계약

좌표는 1536×1024 지면의 백분율이며 모두 발 위치다.

| 위치 | x% | y% |
| --- | --- | --- |
| Greeting | 60 | 65 |
| Reaction | 60 | 65 |
| Turned | 60 | 65 |
| Gate approach | 69 | 57 |
| Gate entry | 72 | 52 |
| Gate ground | 72 | 52 |

Reaction/turn은 같은 위치에서 일어난다. 900ms 반응/회전, intro-gate의 1000ms 접근, enter-world의 780ms 진입은 기존 scene lifecycle 안의 visual animation이다. 전환 이벤트를 새로 발행하지 않는다.

`ChooniPlaceholder`만 production renderer로 교체한다. 슬롯의 bottom-center가 발 위치이며 이동과 그림자는 바깥에 유지한다. sprite 자체에 발 아래 투명 여백이 있으면 renderer 내부에서 정규화해야 한다. 현재 placeholder는 Desktop 38×42px, Mobile 32×36px의 작은 어두운 형태다. rig/기존 motion asset은 사용하거나 수정하지 않았다.

## Responsive

Desktop은 전체 배경을 채우는 3:2 평면에 대화를 왼쪽, actor와 문을 오른쪽에 배치한다. 390×844는 960px 너비의 동일 평면을 x65% 기준으로 재구도화해 actor와 gate를 함께 보여주며, dialogue는 하단으로 옮긴다. 하단은 sage 색으로 부드럽게 연결한다. 버튼 최소 높이 44px. 짧은 화면은 스크롤 가능한 최소 높이를 유지한다.

## 남아 있는 계약

최종 CHOONI artwork는 의도적으로 미완성이다. Secondary `I’ll explore myself`는 기존대로 `/projects` future contract와 안내를 유지한다. `/projects`가 미구현인 상태를 이번 범위에서 확대 구현하지 않았다.

다음 결정은 이 STEP의 시각 검토다.

## 검증 / 검토 화면

- `npm run lint`: 통과, 오류·경고 0.
- `npx tsc --noEmit`: 통과.
- `npm run build -- --webpack`: Webpack production build, TypeScript 및 5개 정적 페이지 생성 통과.
- Google Chrome production 서버에서 Desktop 1440×900 / Mobile 390×844 확인.
- 양쪽 일반 자동 진행: Greeting → intro-follow → intro-gate → enter-world → OVERVIEW 도착. 페이지 JavaScript 예외 0. [자동 진행 기록](automatic-flow-validation.json).
- 시각 캡처는 짧은 구간을 안정적으로 검토하기 위해 브라우저 도구에서만 1100/760/620ms dwell timer를 보류했다. 앱 소스의 timer/scene architecture는 그대로다. [화면 측정](browser-validation.json).
- Greeting에 Gate 시각 DOM 없음. Gate는 Desktop 약 274px, Mobile 약 182px로 완전히 화면 안에 표시. 대화와 가로 overflow 없음.

| 검토 항목 | Screenshot |
| --- | --- |
| A. Desktop Greeting | [desktop-greeting.png](desktop-greeting.png) |
| B. Desktop Gate Revealed | [desktop-gate-revealed.png](desktop-gate-revealed.png) |
| C. Desktop Gate Entry 직전 | [desktop-before-gate-entry.png](desktop-before-gate-entry.png) |
| D. Mobile Greeting | [mobile-greeting.png](mobile-greeting.png) |
| E. Mobile Gate Revealed | [mobile-gate-revealed.png](mobile-gate-revealed.png) |

Chrome 외 브라우저 호환성 및 정량 Core Web Vitals는 이번 검증에 포함하지 않았다.

추가 Chrome 확인: 모바일 두 reply 모두 높이 44px, Tab으로 primary reply에 접근하고 solid focus outline 표시, secondary 선택 시 기존 future-route 안내 및 Greeting 유지, reduced-motion에서 actor animation none 및 자동 World 도착. 페이지 예외 0. [상호작용 검증](interaction-validation.json), [키보드 캡처](mobile-keyboard-focus.png).

로컬 production preview: http://localhost:3018
