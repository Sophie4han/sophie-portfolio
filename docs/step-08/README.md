# STEP 08 — INVADER WATER production candidate

**Latest update:** the subsequently authorized landing correction is complete. See [landing correction](landing/README.md) and its updated screenshots. The original v01 measurements and landing limitation below are preserved as pre-correction history.

Baseline: `a2b8c398ad2d7b8130ea766a1a7313c31a755dcc`. Candidate for visual review; no commit or push.

## Island Design System

MOVE ON uses WOOD / HARUBAREUN, WATER / INVADER, and future ICE / FitMate. HARUBAREUN remains the master for camera, scale, cliff depth, object hierarchy, soft daylight and miniature rendering, not for copying vegetation. The previous woodland INVADER candidate and `asset-prompts.md` are superseded historical material and are not used by the application. No FitMate asset was made.

## Production asset

- `public/images/pixel/world/islands/invader/island-invader-base.png`: 1920×1080 RGBA, true transparent outer area.
- Measured art bounds: raster (1227,255,281,205); logical (1067,165,281,205), contained within the requested (1055,165,305,205).
- Master art bounds: 260×205. Same height, INVADER 8.1% wider; main terrain is more open because WATER replaces canopy.
- Original generation: 1429×1101 RGB. High-resolution source is preserved as `water/source-v01.png`; native cutout is 1278×932 (`water/cutout-v01.png`). The full-world runtime canvas is not a claim that the island itself contains 1920 pixels of detail.
- Built-in ImageGen produced one WATER candidate, prompted from the inspected master. Existing sharp performs edge-connected near-white backdrop extraction and aspect-preserving downsampling onto the canonical transparent raster; no recoloring or texture redraw. Exact prompt and provenance: `water/generation-prompt.md`. Reproduction: `node docs/step-08/water/prepare-asset.mjs`.

## Concept and landmark

Connected shallow lagoons, rounded wet stone banks, curving channels, stepping stones and a restrained right-edge trickle make the terrain a water region. Low reeds, grasses and occasional water plants supply environmental detail without woodland canopy. The palette uses aqua/teal water, blue-gray wet stone and cream accents, with a small amber light.

A compact open observation pavilion with a water-level device sits at the rear/right. It is subordinate to the lagoon and has a different silhouette from the rectilinear BUILD workshop. Water and curved crossings imply observation, adjustment and repetition; no diagrams, labels, classroom motifs or characters are baked into the image.

## Fixed contract and landing limitation

Interaction (1025,140,360,250), focus (1200,270), label (1200,130), visual bbox (1055,165,305,205), all camera presets and mobile camera policy are unchanged. INVADER CHOONI anchor is aligned to the explicitly requested (1035,375), replacing the earlier checkpoint's (1020,360). The state marker is (1335,170).

The fixed anchor lies **outside the fixed visual bbox**, so the prescribed point has no terrain beneath it. It is transparent, clear of any landmark, tree, rock or waterfall, and approximately 86.5 logical pixels from the nearest opaque art. A dry clearing exists on the front-left shore within the island, but it is not at (1035,375). Meeting both fixed-bbox containment and ground under that external coordinate is geometrically impossible. No anchor, bbox or terrain extension was silently changed. Actual LAND contact remains unresolved and is not reported complete; the final character renderer/drop animation is out of scope.

## Runtime integration

- `lib/world-manifest.ts`: production PNG path, requested visual box, state marker, requested CHOONI anchor.
- `components/world/world.module.css`: scope BUILD hover glow to BUILD, and apply the same scoped hover/focus treatment to INVADER. This prevents every production island glowing on BUILD hover.
- The existing `WorldRenderer` needs no change: it renders one full raster per production island using logical origin (160,90), left/top -10%, width/height 120%, shared camera transform, and existing state overlay. No per-state PNG variants.
- `app/dev/invader-island/page.tsx` and `InvaderIslandPreview.tsx`: development-only isolated visual fixture using the same WorldScene, with local fixture progress. Does not mutate SceneManager, progression, persistence or unlock rules. Production returns 404. The fixture's ENTER PROJECT button is intentionally inactive.

## Validation

Lint, TypeScript noEmit and Webpack production build passed; logs in `water/`. Chrome screenshot and measurement results are recorded in `browser-validation.json`. The capture harness keeps Chrome frames rendering, waits for the greeting to settle and uses a native mouse click; it does not change app timers or production progression. Earlier harness attempts clicked too early or captured during page activation and did not reach Overview; the final run completed both normal Prologue flows and all assertions without app-code changes.

| Review | Result | Screenshot |
| --- | --- | --- |
| Desktop Overview 1440×900 | Both production islands visible, same 184.5px displayed height; WOOD canopy and WATER lagoon distinguish the regions. WATER is naturally lighter/more open. No horizontal overflow. | `desktop-overview.png` |
| Desktop INVADER Focus 1440×900 | Existing ITERATE_FOCUS; complete 392×286px island, observation pavilion and dry shore readable. Labels hidden by the existing Focus policy; HUD is separate. Fixed CHOONI remains outside the island, not touching terrain. | `desktop-invader-focus.png` |
| Mobile Overview 390×844 | Existing 136vw camera width unchanged. BUILD ~86px and INVADER ~93px wide; both and all labels inside viewport. Fine device details are too small to read at this scale. | `mobile-overview.png` |

Additional checks: production INVADER remains aria-disabled and clicking it leaves OVERVIEW unchanged; BUILD hover does not glow INVADER; Focus keyboard outline is 2px dashed; production `/dev/invader-island` is HTTP 404; final browser JavaScript exceptions: 0. Additional keyboard capture: `desktop-invader-keyboard-focus.png`.

Preview used: production `http://localhost:3024`, development Focus `http://localhost:3022/dev/invader-island`. Capture reproduction: `STEP08_PRODUCTION_URL=http://localhost:3024 node docs/step-08/capture.mjs` with temporary Chrome CDP on 9229.

`protected-files.json` verifies 144 tracked files outside the two world integration files are byte-identical to baseline, including HARUBAREUN, Prologue, CHOONI motion and the scene/progression architecture. Package files are unchanged.

The required landing terrain is an open limitation. Real-device mobile, Safari/Firefox and quantitative performance are not covered by this review.
