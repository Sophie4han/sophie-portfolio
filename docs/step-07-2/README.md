# STEP 07.2 — Prologue soft 3D / 2.5D review

STEP 07.1의 composition·UI·ground anchors를 유지한 스타일 보정본. 로컬 preview: http://localhost:3020 . 시각 검토를 위해 STOP. 커밋/push 및 후속 프로젝트 작업 없음.

## 이번 변경 파일

- `components/intro/WoodlandStage.tsx`: v03 배경/Gate, Greeting에서 responsive image 사전 decode, Gate contact layer, visible image synchronous decoding hint.
- `components/intro/intro-scene.module.css`: 700ms Gate materialization, ambient settle, contact shadow, 등장 완료 후 접근 타이밍.
- `components/game/SceneViewport.tsx`: Prologue의 scene별 key 제거로 같은 DOM을 유지.
- `public/images/pixel/prologue/woodland-clearing-v03.png`
- `public/images/pixel/prologue/woodland-gate-v03.png`
- `docs/step-07-2/`: 전후 캡처, 검증 자료, 프롬프트, 보고.

기존 미커밋 STEP 07/07.1 작업 위에 적용했다. `IntroScene.tsx`, `lib/prologue-visual.ts`, `/app/dev/chooni-motion/`은 이번 작업 전 hash와 일치한다. Dialogue UI·텍스트, placeholder renderer, ground anchors, 반응형 plane 규칙은 변경하지 않았다. World/INVADER/FitMate/CHOONI rig 수정 및 라이브러리 설치 없음.

## 배경·Gate·2.5D depth

배경: 기존 clearing과 winding path, 주요 나무·돌·수풀 위치를 참조 보존하면서 foliage의 둥근 mass, 원통형 trunk, 지면의 부드러운 요철, 풀과 흙 사이 가장자리 명암, 돌의 윗면 highlight와 하부 shadow를 재해석했다. 원경은 낮은 대비, 중경은 명확한 형태, 전경은 조금 진한 수풀로 구분한다. runtime 3D mesh나 강한 blur를 쓰지 않고 원화의 볼륨·명암으로 공간을 표현한다.

Gate: 같은 stone arch·기둥·threshold·ivy 구조에 매트하고 부드러운 bevel, 돌 틈의 깊이, 오른쪽 면의 sage shadow를 적용했다. 잔 표면 무늬를 줄여 작은 화면에서도 큰 volume이 읽힌다. 실제 RGBA 에셋이며 opening도 투명하다. 돌 아래 radial contact shadow와 PNG 안의 풀/이끼 overlap을 함께 사용한다. opening은 반투명 cream/sage 대기광으로 배경이 일부 비친다.

생성형 보정이므로 미세한 나뭇잎·잔돌·꽃잎 형태까지 동일하지는 않다. 주요 화면 배치와 UI geometry를 보존했으며, 완전한 픽셀 단위 보존을 주장하지 않는다. 기존 World woodland의 자연색·돌·숲 재질과 비교해 close-up/zoomed-out 관계를 유지하는 방향이다. 최종 인상은 사용자 시각 검토 대상이다.

배경 **1536×1024 RGB**, Gate **1254×1254 RGBA**. 이전과 같은 실제 해상도다. 배경에 요청한 더 큰 canvas는 도구가 반환하지 않았다. 2× native source나 실제 3D 렌더로 보고하지 않는다. [실제 metadata](asset-metadata.json), [도구와 프롬프트](asset-prompts.md).

## 광원·그림자·향후 CHOONI contract

- Main light: 화면 upper-left에서 내려오는 넓고 부드러운 daylight, ambient fill 충분히 유지.
- Expected CHOONI cast shadow: 발 접점에서 화면 lower-right로 짧게 뻗는 방향. 강한 rim/bloom 없음.
- Shadow softness: 현재 Gate cast shadow는 desktop CSS 기준 +6px/+8px, blur 5px의 낮은 농도. 바닥 AO는 넓은 radial gradient. 향후 CHOONI는 발 바로 밑 짧은 contact core와 약 3–6px의 부드러운 edge를 기준으로 크기에 맞춰 조정.
- 현재 CHOONI shadow/placeholder는 요청대로 기존 42×12px, blur 3px을 유지한다. 방향성 cast shadow 적용은 최종 renderer 합성 시 할 작업이다.
- Shared plane: 1536×1024, 모든 좌표는 feet bottom-center. Greeting/reaction/turned (60%,65%), approach (69%,57%), entry/Gate (72%,52%). Desktop greeting feet (864,594), Gate anchor (1036.8,469.2). Mobile은 동일 plane의 기존 reframe.
- 교체 지점: `ChooniPlaceholder()` renderer만 교체. 투명 foot padding을 정규화하고 bottom-center를 slot 바닥에 맞춘다. travel/scene events/timers/shadow는 renderer 밖에 유지.
- 최종 3D CHOONI 미제공으로 실제 캐릭터 합성 적합성은 아직 검증하지 않았다.

## Gate reveal 및 flicker

기존 구조에서 `key={scene.sceneId}`가 intro-follow → intro-gate → enter-world마다 IntroScene을 재마운트하고 Gate의 260ms opacity animation을 재시작했다. 이 구조적 재시작 원인을 제거했다. 기존 preloading은 유지하고 Greeting에서 같은 responsive candidate를 off-DOM Image로 decode한다. Greeting에는 Gate DOM과 광원이 없다. decode 실패 시 native loading fallback을 사용하며 네트워크 장애까지 숨기거나 성공으로 간주하지 않는다.

700ms sequence: 0–150ms 약한 대기광, 약 100–500ms stone opacity 0→1 / scale .96→1 / Y 8px→0, 500–700ms 대기광 안정화. blur 애니메이션 없음. 같은 DOM이 visibility revealing→revealed를 통과하므로 애니메이션이 다시 시작되지 않는다.

기존 gate-reveal transition의 commit은 시작 후 280ms다. CHOONI approach에 420ms delay를 적용해 reveal 시작 약 700ms 후 이동을 시작한다. 이동은 600ms로 기존 760ms dwell 및 transition 흐름 안에서 목적지에 도달한다. scene 순서와 transition descriptor는 유지한다. reduced-motion에서는 CSS 모션이 즉시 생략된다.

## Chrome 전후 캡처

Before는 STEP 07.1 최종 Chrome 캡처를 보존한 것. After는 이번 Webpack production build에서 새로 캡처했다. 정지 화면 촬영만 browser harness에서 자동 dwell timer를 보류했다. 실제 앱 타이머는 수정하지 않았고, 정상 자동 흐름은 별도 프레임 검사로 검증한다.

| 화면 | Before | After |
| --- | --- | --- |
| Desktop Greeting 1440×900 | [전](before/desktop-greeting.png) | [후](after/desktop-greeting.png) |
| Desktop Gate Revealed 1440×900 | [전](before/desktop-gate-revealed.png) | [후](after/desktop-gate-revealed.png) |
| Desktop Entry 직전 1440×900 | [전](before/desktop-before-gate-entry.png) | [후](after/desktop-before-gate-entry.png) |
| Mobile Greeting 390×844 | [전](before/mobile-greeting.png) | [후](after/mobile-greeting.png) |
| Mobile Gate Revealed 390×844 | [전](before/mobile-gate-revealed.png) | [후](after/mobile-gate-revealed.png) |

다섯 화면을 직접 시각 검토했다. 배경·Gate 이미지 모두 로딩, 가로 overflow 없음, JavaScript 예외 0. Gate·actor·Dialogue bounding rect는 다섯 화면 모두 이전 값과 일치한다. [좌표 비교](geometry-comparison.json), [브라우저 측정](after/browser-validation.json).

## 코드 검증

- `npm run lint`: exit 0, 경고/오류 없음. [log](lint.log)
- `npx tsc --noEmit`: exit 0. [log](typescript.log)
- `npm run build -- --webpack`: exit 0, compilation/TypeScript/static generation 완료. [log](build.log)

다음 Decision Gate는 이 보정본의 사용자 시각 검토다. 실제 3D CHOONI 합성, 추가 native 해상도 확보, 다른 브라우저 전체 QA는 이번 결과에 포함되지 않는다.

## 프레임별 flicker / 자동 흐름 검증

[프레임 기록](reveal-frame-validation.json): cold browser cache에서 Desktop 265 frames, Mobile 128 frames, reduced-motion 46 frames를 검사했다. 세 경우 모두 World 도착 성공, Gate DOM 교체 0, stone opacity 역행 0, opacity>0인데 이미지 미로딩인 프레임 0, Greeting Gate 노출 0, JavaScript 예외 0. 검사한 조건에서 재시작 flicker가 제거됐다. 모든 장치/네트워크 조건을 보장하는 결과는 아니다.

첫 reduced-motion 검사에서는 Greeting이 활성화되기 전 버튼 클릭이 무시됐다. harness에 활성화 상태 대기를 넣어 세 경우 모두 재검사했다. 앱 코드를 검사를 통과시키기 위해 바꾸지 않았다. 재현 스크립트: [캡처](capture.mjs), [reveal 검사](validate-reveal.mjs). Chrome CDP 9227과 로컬 production 3020이 필요하며 새 검증 탭에서 실행된다.
