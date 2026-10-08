# Active-source audit

No animation implementation was changed for this audit. A temporary MOTION-V2 span was added, observed, captured, then removed.

- Listening Next process: PID 12815, parent 12814; command `next dev --port 3036`; cwd `/Users/sophie/sophie-portfolio`.
- Audited URL: http://localhost:3036/ (same as prior QA recordings).
- Render chain: app/page.tsx → HomePage.tsx → DelayedDown.tsx → ChooniGuide.tsx. Project/world queries branch to ProjectEntry instead.
- Temporary marker visible in marker.png; exactly one data-chooni element.
- DevTools interception of the real application requestAnimationFrame callback (not a simulated animation) recorded 217 tick executions and 217 distinct position transforms. The captured callback source is the current continuous-distance implementation.
- First sampled tick ~10.908s after navigation; final tick ~14.508s. Actual animation duration 3.6s. Startup/hydration precedes the existing 10s timer.
- No runtime exceptions captured. No service worker controls this page. The position wrapper has no CSS animation/transition driving its transform.
- Marker removal was verified via HMR in the existing QA tab without a navigation reload.

Important limitation: the user's exact browser URL/port/query and browser runtime have not yet been supplied. The previous QA browser uses a separate headless Chrome profile. This establishes current source execution on the audited endpoint, not on an unobserved user tab. User-side stale code, reduced-motion settings or rendering stalls cannot yet be concluded or ruled out. No speculative animation rewrite or cache deletion was performed.
