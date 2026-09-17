import type { CSSProperties } from "react";
import { lazy, Suspense, useEffect, useState } from "react";
import Image from "next/image";
import { CHOONI_MOTION, type ChooniMotion } from "@/lib/chooni-motion";
import { WORLD_MANIFEST, worldPointToPercent } from "@/lib/world-manifest";
import { WORLD_CHOONI_PRESETS, WORLD_CHOONI_SUMMON_MS } from "@/lib/world-chooni-presets";
import type {
  CameraPreset,
  JourneyProjectStatus,
  ProjectId,
} from "@/types/game";
import type { IslandRegion, IslandStatuses } from "@/types/world";
import styles from "./world.module.css";

const Chooni3D = lazy(() => import("@/components/character/Chooni3D").then((module) => ({ default: module.Chooni3D })));

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
      onClick={(event) => {
        if (event.target instanceof Element && event.target.closest('[data-block-island-entry="true"]')) return;
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
          {destination && <FocusChooni key={destination.projectId} island={destination} reducedMotion={reducedMotion} />}
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
        const opensDetail = focusedIslandId === island.projectId;
        const visual = island.visualBounds;
        const scale = island.renderedScale ?? 1;
        const bounds = opensDetail && visual ? {
          x: visual.x + visual.width * (1 - scale) / 2,
          y: visual.y + visual.height * (1 - scale) / 2,
          width: visual.width * scale,
          height: visual.height * scale,
        } : island.interactionBounds;
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
            data-opens-detail={opensDetail}
            tabIndex={0}
            aria-pressed={status === "active"}
            aria-label={opensDetail ? `View ${island.projectName} project` : `${island.capability}. ${island.projectName}. ${island.category}. ${status}.`}
            onClick={(event) => {
              event.stopPropagation();
              if (interactive) onSelectIsland(island.projectId);
            }}
          >
            <span className={styles.visuallyHidden}>
              {opensDetail ? `View ${island.projectName} project` : `Focus ${island.projectName} island.`}
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

function FocusChooni({ island, reducedMotion }: { island: IslandRegion; reducedMotion: boolean }) {
  const [ready, setReady] = useState(false);
  const [motionState, setMotionState] = useState<ChooniMotion>("enter");
  const preset = WORLD_CHOONI_PRESETS[island.projectId];
  const desktop = worldPointToPercent({
    x: island.focusChooniSpawn.x + preset.desktop.offsetX,
    y: island.focusChooniSpawn.y + preset.desktop.offsetY,
  });
  const mobile = worldPointToPercent({
    x: island.focusChooniSpawn.x + preset.mobile.offsetX,
    y: island.focusChooniSpawn.y + preset.mobile.offsetY,
  });
  const placement = {
    "--focus-chooni-x": `${desktop.x}%`,
    "--focus-chooni-y": `${desktop.y}%`,
    "--focus-chooni-width": `${preset.desktop.width / WORLD_MANIFEST.canvas.width * 100}%`,
    "--focus-chooni-height": `${preset.desktop.height / WORLD_MANIFEST.canvas.height * 100}%`,
    "--focus-chooni-mobile-x": `${mobile.x}%`,
    "--focus-chooni-mobile-y": `${mobile.y}%`,
    "--focus-chooni-mobile-width": `${preset.mobile.width / WORLD_MANIFEST.canvas.width * 100}%`,
    "--focus-chooni-mobile-height": `${preset.mobile.height / WORLD_MANIFEST.canvas.height * 100}%`,
    "--focus-chooni-summon-ms": `${WORLD_CHOONI_SUMMON_MS}ms`,
  } as CSSProperties;

  useEffect(() => {
    if (motionState !== "greeting") return;
    const timer = window.setTimeout(() => setMotionState("idle"), CHOONI_MOTION.greetingMs);
    return () => window.clearTimeout(timer);
  }, [motionState]);

  return (
    <div
      className={styles.focusChooni}
      data-block-island-entry="true"
      data-ready={ready}
      data-motion={motionState}
      role="img"
      aria-label="Chooni has arrived at this project island."
      style={placement}
    >
      <span className={styles.focusChooniSparkle} aria-hidden="true" />
      <span className={styles.focusChooniDust} aria-hidden="true" />
      <span className={styles.focusChooniFragments} aria-hidden="true">
        <i /><i /><i /><i /><i />
      </span>
      <span className={styles.focusChooniVisual} aria-hidden="true">
        <Suspense fallback={null}>
          <Chooni3D motion={motionState} reducedMotion={reducedMotion}
            className={styles.focusChooniModel}
            entranceDelayMs={WORLD_CHOONI_SUMMON_MS}
            greetingAfterLandingMs={0}
            onReady={() => setReady(true)}
            onEntranceComplete={() => setMotionState(reducedMotion ? "idle" : "greeting")} />
        </Suspense>
      </span>
    </div>
  );
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
