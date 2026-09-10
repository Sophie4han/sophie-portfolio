import type { CSSProperties } from "react";
import Image from "next/image";
import { WORLD_MANIFEST, worldPointToPercent } from "@/lib/world-manifest";
import type {
  CameraPreset,
  JourneyProjectStatus,
  ProjectId,
} from "@/types/game";
import type { IslandRegion, IslandStatuses } from "@/types/world";
import styles from "./world.module.css";

interface WorldRendererProps {
  cameraPreset: CameraPreset;
  focusedIslandId: ProjectId | null;
  statuses: IslandStatuses;
  reducedMotion: boolean;
  durationMs: number;
  interactive: boolean;
  onSelectIsland: (projectId: ProjectId) => void;
  onBackToWorld: () => void;
}
export function WorldRenderer({
  cameraPreset,
  focusedIslandId,
  statuses,
  reducedMotion,
  durationMs,
  interactive,
  onSelectIsland,
  onBackToWorld,
}: WorldRendererProps) {
  const camera = WORLD_MANIFEST.cameraPresets[cameraPreset];
  const focusScale = focusedIslandId ? 1.2 : 1;
  const focusTranslateX = focusedIslandId ? -8 : 0;
  const destination = WORLD_MANIFEST.islands.find((island) => island.projectId === focusedIslandId);
  const focusCenter = destination ? worldPointToPercent({
    x: destination.position.x - (focusedIslandId ? 70 : 0),
    y: destination.position.y,
  }) : { x: 50, y: 50 };
  const cameraStyle = {
    "--world-motion-duration": `${durationMs}ms`,
    "--focus-x": `${50 - focusCenter.x}%`,
    "--focus-y": `${50 - focusCenter.y}%`,
    "--camera-x": `${camera.desktop.translateX + focusTranslateX}%`,
    "--camera-y": `${camera.desktop.translateY}%`,
    "--camera-scale": camera.desktop.scale * focusScale,
    "--camera-origin-x": `${camera.desktop.originX}%`,
    "--camera-origin-y": `${camera.desktop.originY}%`,
    "--camera-mobile-x": `${camera.mobile.translateX}%`,
    "--camera-mobile-y": `${camera.mobile.translateY}%`,
    "--camera-mobile-scale": camera.mobile.scale * focusScale,
    "--camera-mobile-origin-x": `${camera.mobile.originX}%`,
    "--camera-mobile-origin-y": `${camera.mobile.originY}%`,
  } as CSSProperties;

  return (
    <div
      className={styles.worldViewport}
      data-camera-preset={cameraPreset}
      data-focused={Boolean(focusedIslandId)}
      onClick={() => {
        if (focusedIslandId && interactive) onBackToWorld();
      }}
    >
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
            style={islandRasterStyle(island)}
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
          <small>{island.capability}</small>
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
            tabIndex={0}
            aria-pressed={status === "active"}
            aria-label={`${island.capability}. ${island.projectName}. ${island.category}. ${status}.`}
            onClick={(event) => {
              event.stopPropagation();
              if (interactive) onSelectIsland(island.projectId);
            }}
          >
            <span className={styles.visuallyHidden}>
              Focus {island.projectName} island.
            </span>
          </button>
        );
      })}
    </div>
  );
}

function positionStyle(point: { x: number; y: number }): CSSProperties {
  return { left: `${point.x}%`, top: `${point.y}%` };
}

/** Source pixel density is independent of logical placement and camera zoom. */
function islandRasterStyle(island: IslandRegion): CSSProperties {
  const source = island.productionSourceBounds;
  const bounds = island.visualBounds;
  if (!source || !bounds) return productionRasterStyle();
  const scale = island.renderedScale ?? 1;
  const width = bounds.width * scale;
  const height = bounds.height * scale;
  const left = bounds.x + (bounds.width - width) / 2;
  const top = bounds.y + (bounds.height - height) / 2;
  const { canvas, productionRaster } = WORLD_MANIFEST;
  return {
    left: `${(left - source.x * width / source.width) / canvas.width * 100}%`,
    top: `${(top - source.y * height / source.height) / canvas.height * 100}%`,
    width: `${productionRaster.width * width / source.width / canvas.width * 100}%`,
    height: `${productionRaster.height * height / source.height / canvas.height * 100}%`,
  };
}

function statusSymbol(status: JourneyProjectStatus) {
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
