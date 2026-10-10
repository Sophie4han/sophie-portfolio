import type { ReactNode } from "react";
import s from "./fitmate-editorial.module.css";

export function FitMateChapter({ id, label, title, children }: { id: string; label: string; title: ReactNode; children: ReactNode }) {
  return <section id={id} className={s.section} data-fitmate-chapter aria-labelledby={`${id}-title`}>
    <header className={s.sectionHeading}><span className={s.label}>{label}</span><h2 id={`${id}-title`}>{title}</h2></header>
    {children}
  </section>;
}

export function FitMateFlow({ steps, label, className = "" }: { steps: readonly { title: string; detail?: string }[]; label: string; className?: string }) {
  return <ol className={`${s.flow} ${className}`} aria-label={label} data-sequence>{steps.map(({ title, detail }, index) => <li key={title} data-flow-step>
    <small>{String(index + 1).padStart(2, "0")}</small><strong>{title}</strong>{detail && <span>{detail}</span>}
  </li>)}</ol>;
}
