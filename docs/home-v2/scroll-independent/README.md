# Scroll-independent Chooni completion

Changed ChooniGuide.tsx and DelayedDown.tsx. The existing path and 3.6-second interpolation remain.

- Removed Chooni's scroll listener, Hero-visibility conditions and scroll threshold checks.
- Removed early completion from resize, reduced-motion changes, unsafe-path/start guards, button MutationObserver and unmount cleanup.
- Removed Chooni → navigation stage callbacks and navigation-ready props. Chooni owns its own 10-second start timer; the button/scroll-unlock component never receives walking/arrival state.
- The only assignment `arrived = true` occurs inside the rAF tick after elapsed >= 3600ms. Returning to an already completed instance may display the saved resting pose; it cannot mark an incomplete run complete.
- During movement only rAF writes position. Resize/font placement cannot reset it. The arrived CSS does not own position or wrapper transform.
- Reduced motion/unsafe geometry can suppress travel but cannot complete the timeline early. Unmount cancels rAF without writing arrived.

## Browser QA

`qa.mjs` uses a foreground Chrome tab at http://localhost:3036/. Each scenario reloads HOME, waits for the actual 10-second button/unlock event, then immediately scrolls by 0, 5, 50 or 1800px. It samples the visible SVG every frame, normalized to Hero coordinates to distinguish document scrolling from animation jumps.

| Scenario | Measured motion | Moving samples | A/B changes | Premature pose stop | Path jump |
|---|---:|---:|---:|---:|---:|
| No scroll | 3609.4ms | 217 | 20 | 0 | 0 |
| 5px | 3603.4ms | 217 | 20 | 0 | 0 |
| 50px | 3605.5ms | 217 | 20 | 0 | 0 |
| Fast 1800px downward scroll | 3611.3ms | 217 | 20 | 0 | 0 |

All four arrived only after completion and restored neutral limbs. Navigation stage remained navigationReady throughout walking and arrival. Assertions passed; no recorded runtime exceptions. The fast-scroll case measured offscreen SVG motion until completion rather than treating viewport departure as completion.

Lint, TypeScript and production build passed. No dependencies added.
