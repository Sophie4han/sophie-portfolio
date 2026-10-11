import type { ProjectId } from "@/types/game";

interface HomeProject {
  id: ProjectId;
  title: string;
  subtitle?: string;
  category: string;
  image: string;
  alt: string;
}

export const HOME_PROJECTS: readonly HomeProject[] = [
  { id: "harubareun", title: "HARUBAREUN", subtitle: "A brand built from zero.", category: "Brand · Product · Commerce", image: "/images/projects/harubareun/summary/harubareun-brand-identity.jpg", alt: "하루바른 브랜드 아이덴티티" },
  { id: "project-02", title: "INVADER", category: "Product · UX · Commerce", image: "/images/projects/invader/summary/fires-brand-commerce.png", alt: "INVADER 교육 상품의 브랜드와 커머스 화면" },
  { id: "fitmate", title: "FITMATE", category: "App · Product", image: "/images/projects/fitmate/summary/fitmate-five-screens.png", alt: "FitMate 앱의 주요 화면 다섯 개" },
];

// Career Journey appears in the HOME reel, but never in project Next navigation.
type HomeCarouselItem = (HomeProject & { kind: "project"; href: string }) | {
  kind: "experience"; id: "experience"; title: string; subtitle: string; category: string; href: "/experience";
};
export const HOME_CAROUSEL_ITEMS: readonly HomeCarouselItem[] = [
  ...HOME_PROJECTS.map(project => ({ ...project, kind: "project" as const, href: `/?project=${project.id}` })),
  { kind: "experience", id: "experience", title: "EXPERIENCE", subtitle: "How I got here.", category: "Career Journey", href: "/experience" },
];
