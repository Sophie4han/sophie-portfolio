import type { CameraPreset, ProjectId } from "../types/game";
import type { IslandRegion, WorldManifest, WorldPoint } from "../types/world";

export const WORLD_MANIFEST: WorldManifest = {
  canvas: { width: 1600, height: 900 },
  layers: [
    { id: "world-background", role: "background", zIndex: 0 },
    { id: "world-terrain", role: "terrain", zIndex: 10 },
    { id: "world-paths", role: "path", zIndex: 20 },
    { id: "world-foreground", role: "foreground", zIndex: 40 },
  ],
  islands: [
    {
      projectId: "harubareun",
      sequence: 1,
      capability: "BUILD",
      projectName: "HARUBAREUN",
      outcome: "From Product Opportunity to Launch-ready",
      position: { x: 390, y: 275 },
      interactionBounds: { x: 220, y: 145, width: 360, height: 250 },
      labelAnchor: { x: 390, y: 135 },
      chooniAnchor: { x: 555, y: 365 },
      chooniPlacement: "world-current-node",
      focusPreset: "BUILD_FOCUS",
    },
    {
      projectId: "project-02",
      sequence: 2,
      capability: "ITERATE",
      projectName: "Project 02",
      outcome: "[Outcome copy pending approval]",
      position: { x: 1200, y: 270 },
      interactionBounds: { x: 1025, y: 140, width: 360, height: 250 },
      labelAnchor: { x: 1200, y: 130 },
      chooniAnchor: { x: 1020, y: 360 },
      chooniPlacement: "world-current-node",
      focusPreset: "ITERATE_FOCUS",
    },
    {
      projectId: "fitmate",
      sequence: 3,
      capability: "UNDERSTAND",
      projectName: "FitMate",
      outcome: "[Outcome copy pending approval]",
      position: { x: 800, y: 665 },
      interactionBounds: { x: 610, y: 530, width: 380, height: 255 },
      labelAnchor: { x: 800, y: 520 },
      chooniAnchor: { x: 1000, y: 745 },
      chooniPlacement: "world-current-node",
      focusPreset: "UNDERSTAND_FOCUS",
    },
  ],
  cameraPresets: {
    OVERVIEW: camera(0, 0, 1, 50, 50, 0, 0, 1.45, 50, 48),
    BUILD_FOCUS: camera(18, 13, 1.55, 24, 30, 31, 22, 2.05, 24, 30),
    ITERATE_FOCUS: camera(-18, 13, 1.55, 76, 30, -31, 22, 2.05, 76, 30),
    UNDERSTAND_FOCUS: camera(0, -18, 1.55, 50, 72, 0, -29, 2.05, 50, 72),
    WORLD_COMPLETE: camera(0, 0, 1.08, 50, 50, 0, 0, 1.45, 50, 48),
  },
  overviewChooniAnchor: { x: 800, y: 430 },
};

export function getIslandRegion(projectId: ProjectId): IslandRegion {
  const island = WORLD_MANIFEST.islands.find((item) => item.projectId === projectId);
  if (!island) throw new Error(`Missing island manifest entry: ${projectId}`);
  return island;
}

export function worldPointToPercent(point: WorldPoint) {
  return {
    x: (point.x / WORLD_MANIFEST.canvas.width) * 100,
    y: (point.y / WORLD_MANIFEST.canvas.height) * 100,
  };
}

function camera(
  translateX: number,
  translateY: number,
  scale: number,
  originX: number,
  originY: number,
  mobileTranslateX: number,
  mobileTranslateY: number,
  mobileScale: number,
  mobileOriginX: number,
  mobileOriginY: number,
) {
  return {
    desktop: { translateX, translateY, scale, originX, originY },
    mobile: {
      translateX: mobileTranslateX,
      translateY: mobileTranslateY,
      scale: mobileScale,
      originX: mobileOriginX,
      originY: mobileOriginY,
    },
  };
}

export const WORLD_PROJECT_IDS = WORLD_MANIFEST.islands.map(
  ({ projectId }) => projectId,
) satisfies ProjectId[];

export const WORLD_CAMERA_PRESETS = Object.keys(
  WORLD_MANIFEST.cameraPresets,
) as CameraPreset[];
