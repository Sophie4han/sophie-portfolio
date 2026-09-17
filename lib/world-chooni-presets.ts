import type { ProjectId } from "@/types/game";

interface IslandChooniPlacement {
  offsetX: number;
  offsetY: number;
  width: number;
  height: number;
}

interface IslandChooniPreset {
  desktop: IslandChooniPlacement;
  mobile: IslandChooniPlacement;
}

/** Logical 1600 × 900 world coordinates; offsets are relative to focusChooniSpawn. */
export const WORLD_CHOONI_PRESETS: Readonly<Record<ProjectId, IslandChooniPreset>> = {
  harubareun: {
    desktop: { offsetX: 0, offsetY: -12, width: 70, height: 80 },
    mobile: { offsetX: 8, offsetY: -14, width: 108, height: 124 },
  },
  "project-02": {
    desktop: { offsetX: -2, offsetY: -10, width: 70, height: 80 },
    mobile: { offsetX: -3, offsetY: -12, width: 108, height: 124 },
  },
  fitmate: {
    desktop: { offsetX: -10, offsetY: -12, width: 66, height: 76 },
    mobile: { offsetX: -10, offsetY: -16, width: 102, height: 117 },
  },
};

export const WORLD_CHOONI_SUMMON_MS = 820;
