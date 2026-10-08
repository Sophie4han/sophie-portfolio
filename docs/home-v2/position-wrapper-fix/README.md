# Position wrapper fix

Reproduced on http://localhost:3036 at 1440×780. The geometry diagnostic returned false and selected identical start/start keyframes. Both the actual SVG and a temporary 20px red square remained stationary; arrival then moved only Chooni to the finish. No CSS override was responsible.

Removed only the geometry diagnostic from the movement suppression condition. Reduced motion still suppresses travel. Waypoints, native animation timing, walking CSS, direction, timer and arrival completion callback remain unchanged. Geometry diagnostics are retained for inspection; this change does not redesign or certify text clearance at every viewport.

After: all five position segments execute. Around 1s, visible SVG and comparison square both measured (655.44, 422.59), versus start (886.01, 134.35). They matched throughout sampling. The completion frame moved less than 3px from its preceding frame. Temporary square was injected only by CDP and removed afterward; it was never added to application source.

before.json / after.json contain actual DOM rect and computed-transform measurements; probe.mjs / verify.mjs reproduce the comparison.
