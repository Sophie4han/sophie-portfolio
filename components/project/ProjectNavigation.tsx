"use client";

import Link from "next/link";
import { HOME_PROJECTS } from "@/lib/home-projects";
import type { ProjectId } from "@/types/game";
import styles from "./project-navigation.module.css";

export const RETURN_TO_WORK_KEY = "move-on:return-to-work";

export function ProjectNavigation({ projectId }: { projectId: ProjectId }) {
  const index = HOME_PROJECTS.findIndex(project => project.id === projectId);
  const next = index >= 0 ? HOME_PROJECTS[index + 1] : undefined;
  const rememberReturn = () => sessionStorage.setItem(RETURN_TO_WORK_KEY, "true");
  return <nav className={styles.navigation} aria-label="Project navigation">
    <div className={styles.topBar}><Link href="/#work" onClick={rememberReturn} className={styles.link}><span aria-hidden="true">←</span> Back to work</Link></div>
    <div className={styles.bottomBar}>
      {next ? <Link href={`/?project=${next.id}`} className={styles.link}>Next — {next.title} <span aria-hidden="true">↗</span></Link>
        : <Link href="/#work" onClick={rememberReturn} className={styles.link}>Back to work <span aria-hidden="true">→</span></Link>}
    </div>
  </nav>;
}
