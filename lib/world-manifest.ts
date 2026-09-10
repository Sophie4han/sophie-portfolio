import type { CameraPreset, ProjectId } from "../types/game";
import type { IslandRegion, WorldManifest, WorldPoint } from "../types/world";

export const WORLD_MANIFEST: WorldManifest = {
  canvas: { width: 1600, height: 900 },
  productionRaster: {
    width: 1920, height: 1080, logicalOrigin: { x: 160, y: 90 },
    background: "/images/pixel/world/shared/world-background-floating-v02.png",
  },
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
      category: "Consumer Product",
      focusCategory: "Consumer Product · New Business",
      productionAsset: "/images/pixel/world/islands/harubareun/island-harubareun-base.png",
      productionSourceBounds: { x: 329, y: 43, width: 1261, height: 993 },
      visualBounds: { x: 250, y: 170, width: 291, height: 229 },
      stateAnchor: { x: 520, y: 175 },
      position: { x: 390, y: 275 },
      interactionBounds: { x: 220, y: 145, width: 360, height: 250 },
      labelAnchor: { x: 390, y: 135 },
      chooniAnchor: { x: 535, y: 375 },
      chooniPlacement: "world-current-node",
      focusPreset: "BUILD_FOCUS",
    },
    {
      projectId: "project-02",
      sequence: 2,
      capability: "ITERATE",
      projectName: "INVADER",
      outcome: "From Expertise to Marketable Product",
      category: "Content Product",
      focusCategory: "Content Product",
      productionAsset: "/images/pixel/world/islands/invader/island-invader-base.png",
      productionSourceBounds: { x: 321, y: 74, width: 1278, height: 932 },
      visualBounds: { x: 1050, y: 165, width: 315, height: 230 },
      stateAnchor: { x: 1335, y: 170 },
      position: { x: 1200, y: 270 },
      interactionBounds: { x: 1025, y: 140, width: 360, height: 250 },
      labelAnchor: { x: 1200, y: 130 },
      chooniAnchor: { x: 1130, y: 305 },
      chooniPlacement: "world-current-node",
      focusPreset: "ITERATE_FOCUS",
    },
    {
      projectId: "fitmate",
      sequence: 3,
      capability: "UNDERSTAND",
      projectName: "FitMate",
      outcome: "From User Flow to Working iOS Product",
      category: "Digital Product",
      focusCategory: "Digital Product",
      productionAsset: "/images/pixel/world/islands/fitmate/island-fitmate-base.png",
      productionSourceBounds: { x: 409, y: 111, width: 1102, height: 858 },
      renderedScale: 1.12,
      visualBounds: { x: 685, y: 571, width: 251, height: 195 },
      stateAnchor: { x: 925, y: 575 },
      position: { x: 800, y: 665 },
      interactionBounds: { x: 610, y: 530, width: 380, height: 255 },
      labelAnchor: { x: 800, y: 520 },
      chooniAnchor: { x: 850, y: 710 },
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
