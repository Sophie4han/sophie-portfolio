import { ChooniMotionTest } from "./ChooniMotionTest";
import styles from "./chooni-motion.module.css";

export default function ChooniMotionPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Development test route</p>
        <h1>CHOONI layer motion test</h1>
        <p>
          Static 128×128 PNG alignment, expression replacement, arm replacement,
          and transparent-edge inspection.
        </p>
      </header>
      <ChooniMotionTest />
    </main>
  );
}
