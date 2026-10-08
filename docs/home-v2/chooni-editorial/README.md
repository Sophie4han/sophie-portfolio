# Chooni: unfilled editorial line illustration

No new reference image was attached to this request. The existing pixel Chooni and the user's written reference direction informed the revision: rounded head, large eyes, four short feet, low oval body, substantial curved tail and a gentle smile.

Simplification: eyes are open oval outlines with one short vertical pupil stroke each, without highlights or layered iris detail. Body occlusion fills are removed; visible contour segments now meet without opaque patches. Foot detail stays minimal. Two small unfilled spots suggest leopard-gecko identity without dense patterning. Mouth remains a shallow elongated curve. No hearts, added decorations or color. Hello uses ink as well.

Source changes: `components/home/ChooniGuide.tsx` SVG anatomy/eyes; `components/home/chooni-guide.module.css` greeting color. Dimensions, timers, route, hover/blink mechanics and scroll cancellation unchanged. All anatomy inherits fill:none.

QA: initial layout and enlarged screenshots at 1440×900, 1366×768, 768×1024, 390×844 and 320×568. Route safe, no Hero overflow. Actual hover and 30-second arrival checked, with final full-Hero screenshot; blink capture samples its closed keyframe for visual inspection. No runtime exceptions. Lint, TypeScript and production build passed. Chrome only; physical mobile hardware and other browsers not tested in this revision.
