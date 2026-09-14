import styles from "./project-detail-navigation.module.css";

interface ProjectDetailNavigationProps {
  projectName: string;
  disabled: boolean;
  onBackToFocus: () => void;
  onBackToWorld: () => void;
}

export function ProjectDetailNavigation({
  projectName,
  disabled,
  onBackToFocus,
}: ProjectDetailNavigationProps) {
  return (
    <header className={styles.header}>
      <nav className={styles.actions} aria-label="Project navigation">
        <button type="button" disabled={disabled} onClick={onBackToFocus} aria-label={`Back to ${projectName} Focus`}>
          ← BACK TO FOCUS
        </button>
      </nav>
      <span>{projectName} / PROJECT DETAIL</span>
    </header>
  );
}
