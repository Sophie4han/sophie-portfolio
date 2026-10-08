# Segmented route and facing

Changes: `components/home/ChooniGuide.tsx`, `components/home/chooni-guide.module.css`. Existing 10-second timer/unlock, 350ms start delay, five-cycle gait, final label and project structure remain unchanged. No dependency added.

## Waypoints

1. Toward perch → right outer rail: face right.
2. Outer rail → corridor below Korean/positioning text: side view, gaze down.
3. Lower corridor → turn point just right of button: face left.
4. Short descent to final button row: side view, gaze down.
5. Short rightward approach → final position: face right, 28px button gap.

Desktop/tablet use a 16px outer rail margin, 20px lower dogleg height and 20px final approach. Mobile uses 2px rail margin, a 14px dogleg and 16px final approach with its existing smaller character. Lower corridor is clamped below the measured copy/positioning bottom with 4px clearance. Button itself stays outside the route.

Each segment has explicit direction and its own native transform animation. Durations total 2,000ms, with a minimum 160ms per segment plus distance-weighted allocation. Ease-in-out brings velocity down at each corner. On segment completion, position is committed before the next animation begins. SVG alone uses scaleX(-1) on leftward segments; the label is outside this transform. Instant facing swap at the corner avoids a squashed intermediate silhouette. Leg animations do not restart on turns and are mirrored with the SVG.

Before travel, the existing swept-rectangle check validates every segment against headline text ranges, emphasis marks, Korean paragraphs and positioning, including a 2px margin. Unsafe layouts settle without travel. No real-time collision engine. Reduced-motion, resize and scroll interruption settle safely; unmount cancels the active segment.

## Captures

- [Start](start.png)
- [Rightward segment](segment-1.png)
- [Descending](segment-2.png)
- [Left-facing turn](segment-3.png)
- [Bottom rightward approach](segment-5.png)
- [Arrival](final.png)

`qa.mjs` samples live browser frames in one foreground Chrome tab across all five requested viewport sizes. `qa.json` contains per-frame segment, facing matrix, position and limb transforms. The final-state running count can include short label/gaze transitions; walking keyframes are removed on arrival.

Lint, TypeScript and production build passed. No real-device Safari/iOS verification performed.

## Results

| Viewport | Segments seen | Text collisions | Facing mismatch | Final gap |
|---|---|---|---|---|
| 1440x900 | 1–5 | 0 | 0 | 28px |
| 1366x768 | 1–5 | 0 | 0 | 28px |
| 768x1024 | 1–5 | 0 | 0 | 28px |
| 390x844 | 1–5 | 0 | 0 | 28px |
| 320x568 | 1–5 | 0 | 0 | 28px |

All five layouts: safe route true, arrived state reached, Hero height equals viewport/scroll height. No recorded runtime exceptions.
