import type { ProjectId, SceneState, WorldProgressV1 } from "./game";

export type SceneEventType =
  | "BOOT_READY"
  | "INTRO_ACCEPTED"
  | "FOLLOW_COMPLETE"
  | "ENTER_WORLD"
  | "WORLD_ENTRY_COMPLETE"
  | "SELECT_ISLAND"
  | "BACK_TO_WORLD"
  | "ENTER_ISLAND"
  | "START_CASE_STUDY";

export type SceneEvent =
  | { type: "BOOT_READY" }
  | { type: "INTRO_ACCEPTED" }
  | { type: "FOLLOW_COMPLETE" }
  | { type: "ENTER_WORLD" }
  | { type: "WORLD_ENTRY_COMPLETE" }
  | { type: "SELECT_ISLAND"; projectId: ProjectId }
  | { type: "BACK_TO_WORLD" }
  | { type: "ENTER_ISLAND" }
  | { type: "START_CASE_STUDY" };

export type SceneManagerEvent =
  | SceneEvent
  | { type: "COMMIT_TRANSITION" }
  | { type: "SETTLE_SCENE" };

export type TransitionRejectionReason =
  | "scene-not-active"
  | "event-not-allowed"
  | "project-locked"
  | "missing-focused-island"
  | "no-pending-transition";

export interface SceneMachineState {
  scene: SceneState;
  worldProgress: WorldProgressV1;
  lastRejectedEvent: {
    eventType: SceneManagerEvent["type"];
    reason: TransitionRejectionReason;
  } | null;
}
