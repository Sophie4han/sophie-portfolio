# Reference-image path

The red line in the user's 2026-10-08 10.28.44 screenshot is the visual source of truth. Earlier versions misread it as travelling underneath all Korean copy. It actually crosses BETWEEN the English headline and Korean copy, descends LEFT of the copy, then approaches the button from the left. This version follows that geometry, including the left-side endpoint of the red arrow.

## Actual browser evidence

[Watch the recording](chooni-reference-path.webm).

This is 152 Chrome screencast frames spanning 6.039 seconds, re-encoded to WebM at their captured timestamps. It is not a synthetic waypoint replay, slowed animation, or staged pose sequence. `record.mjs` uses Chrome's existing MediaRecorder support to encode the captured frames; no project dependency was added.

[Start](capture-start.png) → [Right](capture-1.png) → [Descend](capture-2.png) → [Left across headline/copy gap](capture-3.png) → [Descend left of copy](capture-4.png) → [Bottom approach](capture-5.png) → [Rest](capture-final.png).

## Implementation

- ChooniGuide.tsx: reference-based waypoint geometry. Right rail is just beyond the headline's right edge, not at the viewport's far edge. Middle crossing is 4px below the actual English text bounds. Left descent is outside the first Korean paragraph. Final position is 28px LEFT of the down button, matching the red arrow endpoint. Toward perch remains anchored to the existing word.
- home.module.css: 12px mobile copy inset reserves the left corridor. Small/short mobile gets extra headline-to-copy spacing to fit the crossing.
- chooni-guide.module.css: final label stays left of Chooni, keeping the button unobstructed.

Travel takes 3.6 seconds (550 / 650 / 1100 / 650 / 650ms). The longer cross-screen route needs enough time to be visually readable. Walking uses the existing shared clock: 350ms A/B cycle, ON from the first travel sample until arrival, uninterrupted across direction changes. SVG facing mirrors on the leftward crossing; all four legs mirror with it. Final state removes the walking pose. Existing 10-second lock/unlock and reduced-motion handling remain.

The text exclusion check uses actual text bounds and swept character rectangles. No production red line or route overlay was added. Video and captures are QA artifacts only.

`qa.json` contains the five viewport traces. Its legacy `gap` field measures against the button's RIGHT edge, so it is negative for this intentionally left-side arrival; the actual clearance to the button's left edge is 28px.

Lint, TypeScript, production build and diff whitespace check passed. Chrome emulation; no physical Safari/iOS test.

## Final verification

320×568 uses 13px Korean copy to retain a real crossing/left corridor without vertical overflow; other viewport typography sizes are unchanged. Final merged results are in qa-final.json.

- 1440x900: safe route true; text collisions 0; Hero/scroll height 900/900px; both walking poses in every segment True; final neutral limbs ['none', 'none', 'none', 'none'].
- 1366x768: safe route true; text collisions 0; Hero/scroll height 768/768px; both walking poses in every segment True; final neutral limbs ['none', 'none', 'none', 'none'].
- 768x1024: safe route true; text collisions 0; Hero/scroll height 1024/1024px; both walking poses in every segment True; final neutral limbs ['none', 'none', 'none', 'none'].
- 390x844: safe route true; text collisions 0; Hero/scroll height 844/844px; both walking poses in every segment True; final neutral limbs ['none', 'none', 'none', 'none'].
- 320x568: safe route true; text collisions 0; Hero/scroll height 568/568px; both walking poses in every segment True; final neutral limbs ['none', 'none', 'none', 'none'].
