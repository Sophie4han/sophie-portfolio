# Continuous movement, unchanged path

[Actual browser recording](chooni-continuous.webm) · [Video with 0.5-second stepping and captures](review.html)

Changed only `components/home/ChooniGuide.tsx` and `components/home/chooni-guide.module.css`. Waypoint arrays match the previous reference-path recording exactly at 1440×900. No new dependency or React per-frame/waypoint position state.

## Change

- Position wrapper writes translate3d(x,y,0) every requestAnimationFrame.
- A dedicated inner div owns scaleX facing. The SVG and independent four leg groups live inside it. The label stays outside facing.
- Progress is total distance travelled over 3,600ms. Each segment linearly interpolates x/y from its continuous remaining distance, so corners have no ease-to-zero pause or endpoint timers.
- A/B gait is derived from the same elapsed time, with a 350ms cycle (175ms per pose). Turning changes facing only, without restarting the gait or position.
- Late initial/font-placement callbacks now check !started before layout: they cannot reset the position during travel. This was a possible reset path, not a claim that it reproduced on every browser.
- Arrival cancels the frame callback, commits the existing final position, removes the walk pose, and retains the label. Reduced-motion and interruption cleanup remain.

## Evidence

The WebM re-encodes 177 actual Chrome screencast frames at their original timestamps (~5.994s including the pre/post-walk interval). No staged poses, replayed synthetic waypoint animation or slow-motion production setting. Half-second captures are approximate sampling; the review video's seek buttons advance exactly 0.5s.

Live monitoring recorded 211 moving frames, 20 A/B switches, both poses in every segment, and four neutral limbs at arrival. Longest observed frame interval was 49.9ms; displacement matched elapsed path distance (no waypoint-sized jump). The record contains translate3d throughout. The recorded video and visual captures are the primary review artifacts; live-motion.json supplies supplementary diagnostics.

Lint, TypeScript and production build passed. Chrome desktop/emulated mobile testing; physical Safari/iOS not tested.
