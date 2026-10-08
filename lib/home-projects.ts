import type { ProjectId } from "@/types/game";

interface HomeProject {
  id: ProjectId;
  title: string;
  subtitle?: string;
  category: string;
  period: string;
  image: string;
  alt: string;
}

export const HOME_PROJECTS: readonly HomeProject[] = [
  { id: "harubareun", title: "HARUBAREUN", subtitle: "A brand built from zero.", category: "Brand · Product · Commerce", period: "2026.06–08", image: "/images/projects/harubareun/summary/harubareun-brand-identity.jpg", alt: "하루바른 브랜드 아이덴티티" },
  { id: "project-02", title: "INVADER", category: "Product · UX · Commerce", period: "[기간 확인 필요]", image: "/images/projects/invader/summary/fires-brand-commerce.png", alt: "INVADER 교육 상품의 브랜드와 커머스 화면" },
  { id: "fitmate", title: "FITMATE", category: "App · Product", period: "[기간 확인 필요]", image: "/images/projects/fitmate/summary/fitmate-five-screens.png", alt: "FitMate 앱의 주요 화면 다섯 개" },
];
