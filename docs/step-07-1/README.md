# STEP 07.1 — Prologue visual fidelity review

기존 composition/layout/scene contract를 유지한 디테일 보정본을 적용했다. **요청한 2× native source는 확보하지 못했다.** 내장 image_gen에 두 차례 큰 캔버스를 지정했으나 실제 출력은 기존 크기였다. 임의 upscale로 크기를 부풀리지 않았다. 이번 결과는 동일 픽셀 해상도에서 재구성한 material/edge detail 개선본이다.

## 실제 에셋 / 해상도

모든 경로는 저장소 기준이다. 아래는 코드의 width prop이나 srcset 숫자가 아닌 실제 PNG header 값이다.

| 에셋 | 변경 전 원본 | 적용 원본 | Desktop 렌더링 | 원본 대비 선형 배율 |
| --- | --- | --- | --- | --- |
| Background | 1536×1024 | 1536×1024 | 1440×960 | 전후 모두 0.9375× |
| Gate | 1254×1254 RGBA | 1254×1254 RGBA | 273.59×273.59 | 전후 모두 약 0.2182× |

- 전 배경: [woodland-clearing-v01.png](../../public/images/pixel/prologue/woodland-clearing-v01.png)
- 적용 배경: [woodland-clearing-v02.png](../../public/images/pixel/prologue/woodland-clearing-v02.png)
- 전 Gate: [woodland-gate-v01.png](../../public/images/pixel/prologue/woodland-gate-v01.png)
- 적용 Gate: [woodland-gate-v02.png](../../public/images/pixel/prologue/woodland-gate-v02.png)

Desktop viewport는 1440×900이며 기존 3:2 지면은 1440×960으로 유지된다. 상하 각 30px crop도 그대로다. Mobile 390×844의 지면 960×640, Gate 182.39×182.39도 유지된다. 원본보다 확대해서 그리는 구성은 아니다. 단, 2× DPR 전체 화면에 대응하는 원본 여유를 확보했다고 주장하지 않는다.

이전 STEP 07 보고의 Gate 1280×1280은 코드에 기입된 값이었다. 실제 v01 PNG는 1254×1254이며 이번 width/height prop을 정확한 값으로 정정했다. CSS가 크기를 결정하므로 표시 크기·anchor는 바뀌지 않았다.

배경 `sizes`를 기존 150vw에서 실제 CSS 평면 크기에 맞췄다. Desktop 1440×900에서 불필요한 w3840 요청 대신 w1920 후보를 고르지만, Next 최적화가 원본 이상 확대하지 않으므로 실제 응답 픽셀은 별도 [응답 측정](served-image-metadata.json)을 기준으로 본다. `naturalWidth`는 srcset density 보정값일 수 있으므로 실제 원본/응답 해상도와 혼동하지 않는다.

## 실제 fidelity 변화

원본을 참조한 image_gen 재구성이다. nearest-neighbor/interpolation 확대나 blur/sharpen 처리는 적용하지 않았다.

- 배경: 불규칙한 큰 pixel cluster 대신 잎 외곽, 잔디와 꽃잎, 나무껍질, 돌 표면, 흙길의 작은 형태가 새로 해석돼 보인다. 원경의 부드러운 깊이와 큰 tree/clearing/path 배치는 유지했다. 생성형 보정이므로 미세한 잎·풀·돌 모양은 원본과 픽셀 단위로 동일하지 않다.
- Gate: 둥근 bevel과 stone 틈의 깊이, 모서리·잎 외곽의 연속성, 표면의 작은 명암을 보강했다. 아치/기둥/threshold 구조와 카메라 각도를 유지한다. 실제 alpha가 없는 체크무늬 후보는 사용하지 않았고, 배경 제거 후 RGBA 결과를 적용했다.
- 기존 saturation/contact-shadow/portal 면은 그대로 유지한다. Gate만 밝거나 선명하게 만드는 추가 CSS filter는 없다.
- 최종 3D CHOONI는 아직 없으므로 실제 3D renderer와의 합성 적합성은 검증하지 않았다.

생성 도구와 정확한 프롬프트: [asset-prompts.md](asset-prompts.md).

## 변경 파일 / 보존 범위

이번 STEP에서 runtime 코드 변경은 `components/intro/WoodlandStage.tsx`의 두 asset 경로, Gate 원본 width/height, background sizes뿐이다. 신규 v02 PNG 두 개 및 `docs/step-07-1/` 검토 자료를 추가했다. v01 원본과 STEP 07 캡처를 보존했다.

Dialogue, reply, CSS layout, CHOONI placeholder·anchors, scene/transition architecture, World 연결 및 `/app/dev/chooni-motion/`은 STEP 07.1 시작 시점과 동일하다. [파일 hash 비교](scope-integrity.json). npm package 추가 없음. 커밋/push 없음.

## Chrome 전후 비교

Before는 승인된 STEP 07 최종 Chrome 캡처를 복사해 보존한 것이다. After는 STEP 07.1 Webpack production 서버에서 새로 캡처했다. 짧은 scene 시각 검토를 위해 캡처 도구에서만 자동 dwell timer를 보류했다. 실제 앱의 타이머는 바꾸지 않았다.

| 화면 | Before | After |
| --- | --- | --- |
| Desktop Greeting 1440×900 | [전](before/desktop-greeting.png) | [후](after/desktop-greeting.png) |
| Desktop Gate Revealed 1440×900 | [전](before/desktop-gate-revealed.png) | [후](after/desktop-gate-revealed.png) |
| Desktop Gate Entry 직전 1440×900 | [전](before/desktop-before-gate-entry.png) | [후](after/desktop-before-gate-entry.png) |
| Mobile Greeting 390×844 | [전](before/mobile-greeting.png) | [후](after/mobile-greeting.png) |
| Mobile Gate Revealed 390×844 | [전](before/mobile-gate-revealed.png) | [후](after/mobile-gate-revealed.png) |

다섯 화면에서 이미지 로딩 성공, 가로 overflow 없음, Gate/actor/dialogue 좌표 보존, 페이지 JavaScript 예외 0 확인. [측정 JSON](after/browser-validation.json).

## 검사 결과

- `npm run lint`: 통과, 오류·경고 0.
- `npm run build -- --webpack`: 통과, compilation/TypeScript/정적 페이지 생성 완료.
- `npx tsc --noEmit`: build 완료 후 재실행 통과. 최초 병렬 실행은 build가 `.next/types`를 재생성하는 중 파일을 읽어 TS6053이 발생했으며, 완료 후 같은 명령으로 정상 통과했다. 설정/규칙 변경 없음.
- 캡처용 timer 보류가 없는 새 Chrome 탭에서 자동 World 도착 별도 확인: [automatic-flow-validation.json](automatic-flow-validation.json).

로컬 production preview: http://localhost:3019

시각 검토를 위해 이 단계에서 STOP. 2× 원본 확보는 미충족 사항으로 남기며, 다음 STEP은 진행하지 않았다.
