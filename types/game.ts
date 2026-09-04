import type { TransitionId } from "./transition";

export const PROJECT_SEQUENCE = [
  "harubareun",
  "project-02",
  "fitmate",
] as const;

export type ProjectId = (typeof PROJECT_SEQUENCE)[number];
export type JourneyProjectStatus = "locked" | "available" | "active" | "completed";

export type SceneId =
  | "boot"
  | "intro-greeting"
  | "intro-follow"
  | "intro-gate"
  | "enter-world"
  | "world-overview"
  | "island-focus"
  | "island-entry"
  | "case-study-transition"
  | "case-study-world"
  | "final-checkpoint"
  | "project-clear"
  | "badge-acquired"
  | "world-return"
  | "next-island-unlock"
  | "world-complete"
  | "ending";

export type ScenePhase = "idle" | "entering" | "active" | "exiting";

export type CameraPreset =
  | "OVERVIEW"
  | "BUILD_FOCUS"
  | "ITERATE_FOCUS"
  | "UNDERSTAND_FOCUS"
  | "WORLD_COMPLETE";

export type ChooniIntent =
  | "idle"
  | "greet"
  | "lead-forward"
  | "look-at-gate"
  | "enter-portal"
  | "world-idle"
  | "point-project"
  | "introduce-project"
  | "enter-project-world"
  | "guide-content"
  | "arrive-at-checkpoint"
  | "celebrate"
  | "present-badge"
  | "return-to-world"
  | "point-next"
  | "journey-complete"
  | "ending-guide";

export type ChooniPlacement =
  | "intro-stage"
  | "gate-side"
  | "world-current-node"
  | "island-entry"
  | "case-study-guide"
  | "completion-stage";

export interface SceneState {
  sceneId: SceneId;
  phase: ScenePhase;
  focusedIslandId: ProjectId | null;
  cameraPreset: CameraPreset;
  requestedChooniIntent: ChooniIntent | null;
  transitionId: TransitionId | null;
  pendingScene: PendingSceneState | null;
}

export interface PendingSceneState {
  sceneId: SceneId;
  focusedIslandId: ProjectId | null;
  cameraPreset: CameraPreset;
  requestedChooniIntent: ChooniIntent | null;
}

export interface WorldProgressV1 {
  version: 1;
  introCompleted: boolean;
  completedProjectIds: ProjectId[];
  updatedAt: string;
}

export interface ChooniRequest {
  intent: ChooniIntent;
  placement: ChooniPlacement;
  facing?: "left" | "right" | "front" | "back";
  loop?: boolean;
  reducedMotionFallback: ChooniIntent;
}

export interface ChooniController {
  request(input: ChooniRequest): void;
  settle(intent?: ChooniIntent): void;
  cancel(): void;
}

export const INITIAL_SCENE_STATE: SceneState = {
  sceneId: "boot",
  phase: "active",
  focusedIslandId: null,
  cameraPreset: "OVERVIEW",
  requestedChooniIntent: null,
  transitionId: null,
  pendingScene: null,
};
