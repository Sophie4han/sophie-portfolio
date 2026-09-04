import type { CSSProperties } from "react";
import { WORLD_MANIFEST, worldPointToPercent } from "@/lib/world-manifest";
import type {
  CameraPreset,
  JourneyProjectStatus,
  ProjectId,
} from "@/types/game";
import type { IslandStatuses } from "@/types/world";
import styles from "./world.module.css";

interface WorldRendererProps {
  cameraPreset: CameraPreset;
  focusedIslandId: ProjectId | null;
  statuses: IslandStatuses;
  reducedMotion: boolean;
  onSelectIsland: (projectId: ProjectId) => void;
}

export function WorldRenderer({
  cameraPreset,
  focusedIslandId,
  statuses,
  reducedMotion,
  onSelectIsland,
}: WorldRendererProps) {
  const camera = WORLD_MANIFEST.cameraPresets[cameraPreset];
  const cameraStyle = {
    "--camera-x": `${camera.desktop.translateX}%`,
    "--camera-y": `${camera.desktop.translateY}%`,
    "--camera-scale": camera.desktop.scale,
    "--camera-origin-x": `${camera.desktop.originX}%`,
    "--camera-origin-y": `${camera.desktop.originY}%`,
    "--camera-mobile-x": `${camera.mobile.translateX}%`,
    "--camera-mobile-y": `${camera.mobile.translateY}%`,
    "--camera-mobile-scale": camera.mobile.scale,
    "--camera-mobile-origin-x": `${camera.mobile.originX}%`,
    "--camera-mobile-origin-y": `${camera.mobile.originY}%`,
  } as CSSProperties;

  return (
    <div className={styles.worldViewport} data-camera-preset={cameraPreset}>
      <div
        className={styles.cameraRig}
        data-reduced-motion={reducedMotion}
        style={cameraStyle}
      >
        <div
          className={styles.worldCanvas}
          style={{ aspectRatio: `${WORLD_MANIFEST.canvas.width} / ${WORLD_MANIFEST.canvas.height}` }}
        >
          <WorldEnvironmentLayers />
          <IslandVisuals statuses={statuses} focusedIslandId={focusedIslandId} />
          <ChooniWorldStage focusedIslandId={focusedIslandId} />
          <SemanticInteractionOverlay
            statuses={statuses}
            focusedIslandId={focusedIslandId}
            onSelectIsland={onSelectIsland}
          />
        </div>
      </div>
    </div>
  );
}

function WorldEnvironmentLayers() {
  return (
    <div className={styles.environmentLayers} aria-hidden="true">
      {WORLD_MANIFEST.layers.map((layer) => (
        <div
          key={layer.id}
          className={styles.environmentLayer}
          data-layer-id={layer.id}
          data-layer-role={layer.role}
          style={{ zIndex: layer.zIndex }}
        />
      ))}
    </div>
  );
}

function IslandVisuals({
  statuses,
  focusedIslandId,
}: {
  statuses: IslandStatuses;
  focusedIslandId: ProjectId | null;
}) {
  return WORLD_MANIFEST.islands.map((island) => {
    const position = worldPointToPercent(island.position);
    const label = worldPointToPercent(island.labelAnchor);
    const status = focusedIslandId === island.projectId
      ? "active"
      : statuses[island.projectId];

    return (
      <div key={island.projectId} aria-hidden="true">
        <div
          className={styles.islandVisual}
          data-island={island.projectId}
          data-status={status}
          style={positionStyle(position)}
        >
          <span className={styles.landMass} />
          <span className={styles.statusMarker}>{statusSymbol(status)}</span>
        </div>
        <div className={styles.islandLabel} style={positionStyle(label)}>
          <small>{String(island.sequence).padStart(2, "0")} · {island.capability}</small>
          <strong>{island.projectName}</strong>
          <span>{status}</span>
        </div>
      </div>
    );
  });
}

function SemanticInteractionOverlay({
  statuses,
  focusedIslandId,
  onSelectIsland,
}: {
  statuses: IslandStatuses;
  focusedIslandId: ProjectId | null;
  onSelectIsland: (projectId: ProjectId) => void;
}) {
  return (
    <div className={styles.interactionOverlay} aria-label="Project islands">
      {WORLD_MANIFEST.islands.map((island) => {
        const status = focusedIslandId === island.projectId
          ? "active"
          : statuses[island.projectId];
        const locked = status === "locked";
        const bounds = island.interactionBounds;
        const style = {
          left: `${(bounds.x / WORLD_MANIFEST.canvas.width) * 100}%`,
          top: `${(bounds.y / WORLD_MANIFEST.canvas.height) * 100}%`,
          width: `${(bounds.width / WORLD_MANIFEST.canvas.width) * 100}%`,
          height: `${(bounds.height / WORLD_MANIFEST.canvas.height) * 100}%`,
        };

        return (
          <button
            key={island.projectId}
            type="button"
            className={styles.islandTarget}
            style={style}
            aria-disabled={locked}
            aria-label={`${island.projectName} project island. Status: ${status}.`}
            onClick={() => {
              if (!locked) onSelectIsland(island.projectId);
            }}
          >
            <span className={styles.visuallyHidden}>
              {locked
                ? `${island.projectName} is locked until the previous island is completed.`
                : `Focus ${island.projectName} island.`}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function ChooniWorldStage({ focusedIslandId }: { focusedIslandId: ProjectId | null }) {
  const anchor = focusedIslandId
    ? WORLD_MANIFEST.islands.find(({ projectId }) => projectId === focusedIslandId)?.chooniAnchor
    : WORLD_MANIFEST.overviewChooniAnchor;
  const position = worldPointToPercent(anchor ?? WORLD_MANIFEST.overviewChooniAnchor);

  return (
    <div
      className={styles.chooniWorldStage}
      data-chooni-intent={focusedIslandId ? "point-project" : "world-idle"}
      data-focused-island={focusedIslandId ?? "none"}
      style={positionStyle(position)}
      role="img"
      aria-label={`Chooni world character placeholder. ${focusedIslandId ? `Pointing to ${focusedIslandId}.` : "Waiting at the center of the world."}`}
    >
      <span aria-hidden="true">CHOONI</span>
    </div>
  );
}

function positionStyle(point: { x: number; y: number }): CSSProperties {
  return { left: `${point.x}%`, top: `${point.y}%` };
}

function statusSymbol(status: JourneyProjectStatus) {
  if (status === "locked") return "×";
  if (status === "completed") return "✓";
  if (status === "active") return "◆";
  return "○";
}
