import type { CSSProperties } from "react";

/** Percent coordinates in the shared 1536 × 1024 woodland plane.
 * All actor points describe FEET, never the center of an image.
 * Mobile reframes this same plane; scenery and actor cannot drift apart.
 */
export const PROLOGUE_ANCHORS = {
  greeting: { x: 47.5, y: 74 },
  reaction: { x: 47.5, y: 74 },
  turned: { x: 47.5, y: 74 },
  approach: { x: 55.5, y: 68 },
  gate: { x: 72, y: 52 },
} as const;

export const PROLOGUE_ANCHOR_STYLE = Object.fromEntries(
  Object.entries(PROLOGUE_ANCHORS).flatMap(([name, point]) => [
    [`--${name}-x`, `${point.x}%`],
    [`--${name}-y`, `${point.y}%`],
  ]),
) as CSSProperties;
