import {
  PROJECT_SEQUENCE,
  type JourneyProjectStatus,
  type ProjectId,
} from "../types/game";

export interface ProjectProgression {
  statuses: Readonly<Record<ProjectId, JourneyProjectStatus>>;
  completedProjectIds: readonly ProjectId[];
  nextAvailableProjectId: ProjectId | null;
  progress: number;
  total: number;
  worldCompleted: boolean;
}

/** Completion is a record of exploration, never an access prerequisite. */
export function resolveProjectProgression(
  completedProjectIds: readonly ProjectId[],
  activeProjectId: ProjectId | null = null,
): ProjectProgression {
  const recordedCompletions = new Set(completedProjectIds);
  const completions = PROJECT_SEQUENCE.filter(id => recordedCompletions.has(id));
  const completedSet = new Set(completions);
  const nextAvailableProjectId = PROJECT_SEQUENCE.find(id => !completedSet.has(id)) ?? null;

  const statuses = Object.fromEntries(
    PROJECT_SEQUENCE.map((projectId): [ProjectId, JourneyProjectStatus] => {
      if (completedSet.has(projectId)) return [projectId, "completed"];
      return [projectId, activeProjectId === projectId ? "active" : "available"];
    }),
  ) as Record<ProjectId, JourneyProjectStatus>;

  return {
    statuses,
    completedProjectIds: completions,
    nextAvailableProjectId,
    progress: completions.length,
    total: PROJECT_SEQUENCE.length,
    worldCompleted: completions.length === PROJECT_SEQUENCE.length,
  };
}
