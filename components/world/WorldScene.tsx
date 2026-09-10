import Image from "next/image";
import { resolveProjectProgression } from "@/lib/project-progression";
import { getIslandRegion } from "@/lib/world-manifest";
import type { SceneState, WorldProgressV1 } from "@/types/game";
import type { SceneEvent } from "@/types/scene";
import type { TransitionRuntimeState } from "@/types/transition";
import { WorldRenderer } from "./WorldRenderer";
import styles from "./world.module.css";

interface WorldSceneProps {
  scene: SceneState;
  worldProgress: WorldProgressV1;
  transition: TransitionRuntimeState;
  dispatch: (event: SceneEvent) => void;
}

export function WorldScene({
  scene,
  worldProgress,
  transition,
  dispatch,
}: WorldSceneProps) {
  const progression = resolveProjectProgression(
    worldProgress.completedProjectIds,
    scene.focusedIslandId,
  );
  const focusedIsland = scene.focusedIslandId
    ? getIslandRegion(scene.focusedIslandId)
    : null;
  const focusedStatus = focusedIsland
    ? progression.statuses[focusedIsland.projectId]
    : null;

  const worldTarget = scene.pendingScene &&
    (scene.pendingScene.sceneId === "island-focus" || scene.pendingScene.sceneId === "world-overview")
    ? scene.pendingScene : scene;

  return (
    <main className={styles.worldScene}>
      <h1 className={styles.visuallyHidden}>MOVE ON World</h1>
      <WorldRenderer
        cameraPreset={worldTarget.cameraPreset}
        focusedIslandId={worldTarget.focusedIslandId}
        statuses={progression.statuses}
        reducedMotion={transition.reducedMotion}
        durationMs={transition.durationMs}
        interactive={scene.phase === "active"}
        onSelectIsland={(projectId) => dispatch({ type: "SELECT_ISLAND", projectId })}
        onBackToWorld={() => dispatch({ type: "BACK_TO_WORLD" })}
      />
      <WorldHud
        progress={progression.progress}
        total={progression.total}
      />
      <nav className={styles.utilityNav} aria-label="Portfolio">
        <button type="button" aria-current={!focusedIsland ? "page" : undefined} disabled={scene.phase !== "active"} onClick={() => { if (focusedIsland) dispatch({ type: "BACK_TO_WORLD" }); }}>WORLD</button>
        <span aria-disabled="true" title="Projects page is not available yet">PROJECTS · SOON</span>
        <span aria-disabled="true" title="About page is not available yet">ABOUT</span>
        <span aria-disabled="true" title="Experience page is not available yet">EXPERIENCE</span>
      </nav>
      {focusedIsland && focusedStatus && scene.phase === "active" && (
        <ProjectHud
          island={focusedIsland}
          onEnter={() => dispatch({ type: "ENTER_ISLAND" })}
        />
      )}
      <p className={styles.selectionAnnouncement} aria-live="polite">
        {focusedIsland
          ? `${focusedIsland.projectName} selected. Camera preset ${scene.cameraPreset}. Status ${focusedStatus}.`
          : `World overview. ${progression.progress} of ${progression.total} islands completed.`}
      </p>
    </main>
  );
}

function WorldHud({
  progress,
  total,
}: {
  progress: number;
  total: number;
}) {
  return (
    <aside className={styles.worldHud} aria-label="World progress">
      <strong>MOVE ON</strong>
      <span>Select a project to explore</span>
      <small>{progress === total ? "WORLD COMPLETE" : `${String(progress).padStart(2, "0")} / ${String(total).padStart(2, "0")} completed`}</small>
    </aside>
  );
}

function ProjectHud({
  island,
  onEnter,
}: {
  island: ReturnType<typeof getIslandRegion>;
  onEnter: () => void;
}) {
  const projectImage: string | null = null;

  return (
    <aside className={styles.projectHud} aria-labelledby="focused-project-title">
      <p>{island.capability}</p>
      <h2 id="focused-project-title">{island.projectName}</h2>
      <p>{island.outcome}</p>
      <small>{island.focusCategory}</small>
      {projectImage && (
        <div className={styles.projectImageSlot}>
          <Image src={projectImage} alt={`${island.projectName} product`} width={640} height={480} />
        </div>
      )}
      <div className={styles.projectActions}>
        <button type="button" onClick={onEnter}>VIEW PROJECT ↗</button>
      </div>
    </aside>
  );
}
