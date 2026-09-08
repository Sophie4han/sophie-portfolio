import type { CSSProperties } from "react";
import Image from "next/image";
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
  durationMs: number;
  interactive: boolean;
  onSelectIsland: (projectId: ProjectId) => void;
}

export function WorldRenderer({
  cameraPreset,
  focusedIslandId,
  statuses,
  reducedMotion,
  durationMs,
  interactive,
  onSelectIsland,
}: WorldRendererProps) {
  const camera = WORLD_MANIFEST.cameraPresets[cameraPreset];
  const destination = WORLD_MANIFEST.islands.find((island) => island.projectId === focusedIslandId);
  const focusCenter = destination ? worldPointToPercent({
    x: (destination.position.x + destination.chooniAnchor.x) / 2,
    y: (destination.position.y + destination.chooniAnchor.y) / 2,
  }) : { x: 50, y: 50 };
  const cameraStyle = {
    "--world-motion-duration": `${durationMs}ms`,
    "--focus-x": `${50 - focusCenter.x}%`,
    "--focus-y": `${50 - focusCenter.y}%`,
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
    <div className={styles.worldViewport} data-camera-preset={cameraPreset} data-focused={Boolean(focusedIslandId)}>
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
            interactive={interactive}
          />
        </div>
      </div>
    </div>
  );
}

function WorldEnvironmentLayers() {
  return (
    <div className={styles.environmentLayers} aria-hidden="true">
      <Image
        src={WORLD_MANIFEST.productionRaster.background}
        alt=""
        width={WORLD_MANIFEST.productionRaster.width}
        height={WORLD_MANIFEST.productionRaster.height}
        unoptimized
        loading="eager"
        className={styles.productionRaster}
        style={productionRasterStyle()}
      />
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
      <div key={island.projectId} aria-hidden="true" data-destination={island.projectId} data-muted={Boolean(focusedIslandId && focusedIslandId !== island.projectId)}>
        {island.productionAsset && (
          <Image
            src={island.productionAsset}
            alt=""
            width={WORLD_MANIFEST.productionRaster.width}
            height={WORLD_MANIFEST.productionRaster.height}
            unoptimized
            loading="eager"
            className={`${styles.productionRaster} ${styles.productionIsland}`}
            data-status={status}
            style={productionRasterStyle()}
          />
        )}
        <div
          className={styles.islandVisual}
          data-island={island.projectId}
          data-status={status}
          data-production={Boolean(island.productionAsset)}
          style={island.visualBounds ? {
            left: `${island.visualBounds.x / WORLD_MANIFEST.canvas.width * 100}%`,
            top: `${island.visualBounds.y / WORLD_MANIFEST.canvas.height * 100}%`,
            width: `${island.visualBounds.width / WORLD_MANIFEST.canvas.width * 100}%`,
            height: `${island.visualBounds.height / WORLD_MANIFEST.canvas.height * 100}%`,
          } : positionStyle(position)}
        >
          {!island.productionAsset && <span className={styles.landMass} />}
          <span className={styles.statusMarker} style={island.stateAnchor && island.visualBounds ? {
            left: `${(island.stateAnchor.x - island.visualBounds.x) / island.visualBounds.width * 100}%`,
            top: `${(island.stateAnchor.y - island.visualBounds.y) / island.visualBounds.height * 100}%`,
            transform: "translate(-50%, -50%)",
          } : undefined}>{statusSymbol(status)}</span>
        </div>
        <div className={styles.islandLabel} data-island={island.projectId} style={positionStyle(label)}>
          <small>{String(island.sequence).padStart(2, "0")} · {island.capability}</small>
          <strong>{island.projectName}</strong>
          <span>{island.category}</span>
        </div>
      </div>
    );
  });
}

function SemanticInteractionOverlay({
  statuses,
  focusedIslandId,
  onSelectIsland,
  interactive,
}: {
  statuses: IslandStatuses;
  focusedIslandId: ProjectId | null;
  onSelectIsland: (projectId: ProjectId) => void;
  interactive: boolean;
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
            data-island={island.projectId}
            tabIndex={focusedIslandId && focusedIslandId !== island.projectId ? -1 : 0}
            aria-disabled={locked || !interactive}
            aria-pressed={status === "active"}
            aria-label={`${island.sequence} ${island.capability}. ${island.projectName}. ${island.category}. ${locked ? "Locked until the previous project is completed" : status}.`}
            onClick={() => {
              if (!locked && interactive) onSelectIsland(island.projectId);
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
      data-chooni-intent="world-idle"
      data-focused-island={focusedIslandId ?? "none"}
      style={positionStyle(position)}
      role="img"
      aria-label={`Chooni world character placeholder. ${focusedIslandId ? "Travels with you to the selected project." : "Waiting at the center of the world."}`}
    >
      <span aria-hidden="true">CHOONI</span>
    </div>
  );
}

function positionStyle(point: { x: number; y: number }): CSSProperties {
  return { left: `${point.x}%`, top: `${point.y}%` };
}

function statusSymbol(status: JourneyProjectStatus) {
  if (status === "locked") return "Ⅱ";
  if (status === "completed") return "✓";
  if (status === "active") return "◆";
  return "↗";
}

/** Preserve the full production raster: logical (0, 0) is raster (160, 90). */
function productionRasterStyle(): CSSProperties {
  const { productionRaster: raster, canvas } = WORLD_MANIFEST;
  return {
    left: `${-raster.logicalOrigin.x / canvas.width * 100}%`,
    top: `${-raster.logicalOrigin.y / canvas.height * 100}%`,
    width: `${raster.width / canvas.width * 100}%`,
    height: `${raster.height / canvas.height * 100}%`,
  };
}
