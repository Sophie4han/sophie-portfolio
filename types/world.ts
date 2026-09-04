import type {
  CameraPreset,
  ChooniPlacement,
  JourneyProjectStatus,
  ProjectId,
} from "./game";

export interface WorldPoint {
  x: number;
  y: number;
}

export interface WorldBounds extends WorldPoint {
  width: number;
  height: number;
}

export interface CameraTransform {
  translateX: number;
  translateY: number;
  scale: number;
  originX: number;
  originY: number;
}

export interface CameraPresetDefinition {
  desktop: CameraTransform;
  mobile: CameraTransform;
}

export interface IslandRegion {
  projectId: ProjectId;
  sequence: 1 | 2 | 3;
  capability: "BUILD" | "ITERATE" | "UNDERSTAND";
  projectName: string;
  outcome: string;
  position: WorldPoint;
  interactionBounds: WorldBounds;
  labelAnchor: WorldPoint;
  chooniAnchor: WorldPoint;
  chooniPlacement: ChooniPlacement;
  focusPreset: CameraPreset;
}

export interface WorldEnvironmentLayer {
  id: string;
  role: "background" | "terrain" | "path" | "foreground";
  zIndex: number;
}

export interface WorldManifest {
  canvas: {
    width: number;
    height: number;
  };
  layers: readonly WorldEnvironmentLayer[];
  islands: readonly IslandRegion[];
  cameraPresets: Readonly<Record<CameraPreset, CameraPresetDefinition>>;
  overviewChooniAnchor: WorldPoint;
}

export type IslandStatuses = Readonly<Record<ProjectId, JourneyProjectStatus>>;
