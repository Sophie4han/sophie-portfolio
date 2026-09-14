// Source: 「제목 없는 문서」, CASE 02 — INVADER only.
// https://docs.google.com/document/d/17YxepizwgLH8KtJaccYc1JZEDxntVF1EAUNLqVMs-TY/edit
export const INVADER_PROJECT = {
  name: "INVADER",
  lead: "From Expertise to Marketable Product",
  introduction: "강사의 전문성을 판매 가능한 교육 Product로 구조화하고, 상세페이지·CRM·Live Sales·본강의까지 고객 Funnel을 운영하며 시장 반응에 따라 Product를 개선했습니다.",
  facts: [
    { label: "역할", value: "Content Product PM" },
    { label: "범위", value: "Planning & Operations" },
    { label: "고객 Funnel", value: "상세페이지 · CRM · Live Sales · 본강의" },
  ],
  sections: [
    { id: "value", number: "01", title: "Product Value", summary: "강사의 실제 자산을 Product Value로 만들었다" },
    { id: "experience", number: "02", title: "구매 경험", summary: "시장을 바꿀 수 없다면 구매 경험을 바꿨다" },
    { id: "signal", number: "03", title: "Funnel Signal", summary: "Funnel Signal을 Product Perception 문제로 해석" },
  ],
} as const;

export type InvaderSectionId = typeof INVADER_PROJECT.sections[number]["id"];
