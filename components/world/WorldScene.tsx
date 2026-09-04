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

  return (
    <main className={styles.worldScene}>
      <h1 className={styles.visuallyHidden}>MOVE ON World</h1>
      <WorldRenderer
        cameraPreset={scene.cameraPreset}
        focusedIslandId={scene.focusedIslandId}
        statuses={progression.statuses}
        reducedMotion={transition.reducedMotion}
        onSelectIsland={(projectId) => dispatch({ type: "SELECT_ISLAND", projectId })}
      />
      <WorldHud
        progress={progression.progress}
        total={progression.total}
        completed={progression.completedProjectIds.length}
      />
      {focusedIsland && focusedStatus && (
        <ProjectHud
          island={focusedIsland}
          status={focusedStatus}
          onEnter={() => dispatch({ type: "ENTER_ISLAND" })}
          onBack={() => dispatch({ type: "BACK_TO_WORLD" })}
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
  completed,
}: {
  progress: number;
  total: number;
  completed: number;
}) {
  return (
    <aside className={styles.worldHud} aria-label="World progress">
      <strong>MOVE ON WORLD</strong>
      <span>Progress {progress} / {total}</span>
      <span aria-label={`${completed} of ${total} badges collected`}>
        Badges {Array.from({ length: total }, (_, index) => index < completed ? "●" : "○").join(" ")}
      </span>
    </aside>
  );
}

function ProjectHud({
  island,
  status,
  onEnter,
  onBack,
}: {
  island: ReturnType<typeof getIslandRegion>;
  status: string;
  onEnter: () => void;
  onBack: () => void;
}) {
  return (
    <aside className={styles.projectHud} aria-labelledby="focused-project-title">
      <p>{String(island.sequence).padStart(2, "0")} · {island.capability}</p>
      <h2 id="focused-project-title">{island.projectName}</h2>
      <p>{island.outcome}</p>
      <strong>Status · {status}</strong>
      <div className={styles.projectActions}>
        <button type="button" onClick={onEnter}>Enter island</button>
        <button type="button" onClick={onBack}>Back to world</button>
      </div>
    </aside>
  );
}
