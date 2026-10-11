import type { Metadata } from "next";
import { ExperiencePage } from "@/components/experience/ExperiencePage";

export const metadata: Metadata = {
  title:"Experience | Sophie — Product · Brand · Commerce",
  description:"디자인에서 고객, 서비스 운영, 제품과 사업으로 이어진 경력의 흐름.",
};

export default function Experience() {
  return <ExperiencePage />;
}
