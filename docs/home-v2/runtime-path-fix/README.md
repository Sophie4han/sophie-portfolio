# Runtime path and gait correction

## Findings before editing

`baseline-qa.json` records the actual pre-change browser playback. The wrapper was position:absolute at top/left zero, with native per-segment translate animations. Waypoints were applied; no old movement keyframe or competing CSS position transition was found. SVG facing and limb transforms were already separate elements.

The last two desktop segments were only 20px down and 20px right (mobile: 14/16px). They were technically present but visually weak. Gait had an independent fixed 400ms × 5 CSS timeline while position chained five native completion callbacks. That design could stop gait before position finished. However, the foreground baseline recorded both leg poses in every segment: “walking only activates near arrival” was NOT reproduced and is not asserted as the root cause. Earlier reports overstated perceptual verification from state/transform existence alone.

## Implementation

Changed `components/home/ChooniGuide.tsx` and `components/home/chooni-guide.module.css` only. No dependency, content, timer or navigation changes.

Removed chained travel animations and independent CSS gait repeats. One requestAnimationFrame clock now samples all three separate transform layers:

- Position wrapper: translate only, with smoothstep interpolation within each waypoint segment.
- SVG: facing via scaleX(1/-1); editorial label remains outside.
- Four limb groups: explicit alternating A/B transforms selected by data-pose; body/tail receive continuous small motion values from the same clock.

Walking is enabled before the first position sample. Pose A is assigned in that same synchronous tick. Segments and facing do not restart the gait phase. Arrival/interruption cancels the frame callback and removes data-pose; all four limbs return to neutral. Layout/resize, scroll interruption, reduced-motion changes and unmount retain cleanup.

Timeline: 2,400ms total, segment durations 420 / 600 / 600 / 390 / 390ms. Gait cycle 350ms, alternating every 175ms: 6 complete cycles plus most of a seventh (14 A/B intervals). No independent gait clock can expire early.

The lower turn now ends 40px right of the button (within the requested 24–40px range), with the final character slightly lower to enlarge the downward segment. Desktop downward dogleg is 45px in the tested layouts, final horizontal approach 36px. Mobile has a shorter lower descent if constrained by the viewport. Text exclusion still validates swept rectangles with margins before movement. The down button is not crossed.

## Captures

All five are actual live browser captures, without pausing, moving the character for inspection or substituting a posed image:

- [FRAME 1: initial rightward A](frame-1.png)
- [FRAME 2: rightward B](frame-2.png)
- [FRAME 3: leftward segment](frame-3.png)
- [FRAME 4: final rightward segment](frame-4.png)
- [FRAME 5: arrival / neutral](frame-5.png)

The frame-level trace in `qa.json` records position, pose, segment, orientation matrix and all four actual limb matrices. Chrome viewport emulation only; no physical Safari/iOS device testing.

Lint, tsc and production build passed.

## Actual viewport-relative waypoints (x, y), wrapper top-left

| Viewport | Start | WP1 | WP2 | WP3 | WP4 | Final |
|---|---|---|---|---|---|---|
| 1440x900 | (886.0, 194.4) | (1364.0, 194.4) | (1364.0, 767.5) | (760.0, 767.5) | (760.0, 812.5) | (796.0, 812.5) |
| 1366x768 | (838.8, 130.8) | (1290.0, 130.8) | (1290.0, 641.5) | (723.0, 641.5) | (723.0, 686.5) | (759.0, 686.5) |
| 768x1024 | (553.9, 268.7) | (708.0, 268.7) | (708.0, 892.4) | (424.0, 892.4) | (424.0, 940.4) | (460.0, 940.4) |
| 390x844 | (68.3, 228.1) | (366.0, 228.1) | (366.0, 760.0) | (228.0, 760.0) | (228.0, 796.0) | (264.0, 796.0) |
| 320x568 | (55.6, 99.9) | (300.0, 99.9) | (300.0, 491.5) | (192.0, 491.5) | (192.0, 527.5) | (228.0, 527.5) |

1440×900 previous: (886.0,194.4) → (1364,194.4) → (1364,768.5) → (764,768.5) → (764,788.5) → (784,788.5). New: see first row above. The first/right-rail legs intentionally remain in the established safe corridor; the lower dogleg geometry and timing changed.

## Live-frame checks

- 1440x900: 145 live samples; 13 pose switches; 0 neutral limb frames while moving; 0 facing mismatches; 0 text collisions; A and B observed in all five segments; all four limbs neutral at arrival.

- 1366x768: 145 live samples; 13 pose switches; 0 neutral limb frames while moving; 0 facing mismatches; 0 text collisions; A and B observed in all five segments; all four limbs neutral at arrival.

- 768x1024: 145 live samples; 13 pose switches; 0 neutral limb frames while moving; 0 facing mismatches; 0 text collisions; A and B observed in all five segments; all four limbs neutral at arrival.

- 390x844: 145 live samples; 13 pose switches; 0 neutral limb frames while moving; 0 facing mismatches; 0 text collisions; A and B observed in all five segments; all four limbs neutral at arrival.

- 320x568: 145 live samples; 13 pose switches; 0 neutral limb frames while moving; 0 facing mismatches; 0 text collisions; A and B observed in all five segments; all four limbs neutral at arrival.

Reduced-motion (390×844): zero travel samples, final arrived state, 40px gap, four neutral limbs, zero active animations. Captured runtime exception list is empty. Arrival's ordinary label/gaze transitions explain the brief running count of 3 in non-reduced snapshots; they are not leg or position animations.
