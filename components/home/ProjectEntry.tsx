"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { saveDetailSection, saveSceneSnapshot } from "@/lib/scene-persistence";
import type { ProjectId } from "@/types/game";
import styles from "./home.module.css";
import { FitMateProjectDetail } from "@/components/project/FitMateProjectDetail";
import { InvaderProjectDetail } from "@/components/project/InvaderProjectDetail";
import { HarubareunProjectDetail } from "@/components/project/HarubareunProjectDetail";
import { ProjectNavigation } from "@/components/project/ProjectNavigation";
import navigation from "@/components/project/project-navigation.module.css";

const GameShell = dynamic(() => import("@/components/game/GameShell").then((module) => module.GameShell), { ssr: false });

/** Adapter only: the original scene navigation and all detail content stay intact. */
export function ProjectEntry({ projectId }: { projectId?: ProjectId }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (projectId) {
      saveSceneSnapshot("island-entry", projectId);
      saveDetailSection(projectId, null);
    }
    // Mount the existing scene machine only after its entry snapshot is ready.
    const frame = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(frame);
  }, [projectId]);
  const content = projectId === "harubareun" ? <HarubareunProjectDetail />
    : projectId === "project-02" ? <InvaderProjectDetail />
    : projectId === "fitmate" ? <FitMateProjectDetail />
    : ready ? <GameShell /> : <p role="status" className={styles.loading}>Opening selected work…</p>;
  if (!projectId) return <div className={styles.detailEntry}>{content}</div>;
  return <div className={navigation.shell}>
    <ProjectNavigation projectId={projectId} />
    <div className={navigation.content} data-project-content>{content}</div>
  </div>;
}
