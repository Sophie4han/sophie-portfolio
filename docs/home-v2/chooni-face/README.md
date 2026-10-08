# Chooni face refinement

Only `components/home/ChooniGuide.tsx` and `components/home/chooni-guide.module.css` changed.

- Eyes: two 1.15-unit solid dots without the inherited 2.1-unit outline. Removed the alternative curved smile-eye paths entirely.
- Mouth: increased width from 8 to 15 SVG units, with a shallow curve and a lighter 1.5-unit stroke.
- Neutral: tiny round eyes, long shallow smile.
- Hover: dots remain visible, shift upward 0.3 units and compress vertically to 85%; mouth rotates just 1 degree. Existing hello timing unchanged.
- Blink: existing once-only 180ms compression applies to an inner eye group; mouth is unaffected. Outer gaze group keeps hover/arrival transforms separate from the blink transform.
- Arrival: dots move 0.25 units sideways and 0.65 units downward; mouth remains unchanged. No replacement with curved closed eyes.

Reviewed enlarged neutral/hover/blink/arrival captures and final Hero screenshot. Four limbs, body, head outline, tail, overall size and navigation behavior remain unchanged. `blink.png` is a paused sample of the existing closed-eye keyframe for visual inspection; it does not represent a second production blink.

Actual desktop hover and real 30-second button arrival checked. Two dot eyes remain in both states; four limbs preserved. No runtime exceptions. ESLint, standalone TypeScript and production build passed. Screenshots and structured results in this directory.
