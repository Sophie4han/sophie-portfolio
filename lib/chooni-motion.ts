/** Whole-body transforms only. The GLB mesh and its facial texture stay untouched. */
export type ChooniMotion = "enter" | "idle" | "greeting" | "happy" | "portal-reaction" | "departure";

/** Measured torso axis of chooni-25.glb, in the GLB's original units. */
export const CHOONI_BODY_PIVOT = { x: 0.08, z: 0.12 } as const;

export const CHOONI_MOTION = {
  enterMs: 650,
  greetingAfterLandingMs: 280,
  speechDelayMs: 120,
  speechRevealMs: 360,
  happyMs: 620,
  greetingMs: 1000,
  portalTurnDelayMs: 420,
  portalTurnMs: 600,
  departureMs: 1100,
  lerpSpeed: 10,
  idleBreath: 0.004,
  idleSwayRadians: 0.009,
  greetingLeanRadians: 0.035,
  greetingTiltRadians: 0.045,
  greetingYawRadians: 0.022,
  greetingBounce: 0.025,
  happyBounce: 0.095,
  happyScale: 0.065,
  portalTurnRadians: 2.35,
  departureHop: 0.035,
  departureScale: 0.68,
} as const;
