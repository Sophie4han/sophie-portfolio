// Source: 「제목 없는 문서」, CASE 02 — INVADER only.
// https://docs.google.com/document/d/17YxepizwgLH8KtJaccYc1JZEDxntVF1EAUNLqVMs-TY/edit
export const INVADER_PROJECT = {
  name: "INVADER",
  lead: "From Expertise to Marketable Product",
  introduction: "강사의 전문성을 판매 가능한 교육 Product로 구조화하고, 상세페이지·CRM·Live Sales·본강의까지 고객 Funnel을 운영하며 시장 반응에 따라 Product를 개선했습니다.",
  facts: [
    { label: "역할", value: "Education Product PM" },
    { label: "범위", value: "Planning & Operations" },
    { label: "고객 Funnel", value: "상세페이지 · CRM · Live Sales · 본강의" },
  ],
  sections: [
    { id: "value", number: "01", title: "Product Planning", summary: "강사의 전문성을 ‘팔리는 교육상품’으로 구체화하다" },
    { id: "experience", number: "02", title: "Live Content Planning & Rehearsal", summary: "정보를 전달하는 강의에서 ‘결제를 설득하는 흐름’으로" },
    { id: "signal", number: "03", title: "Live Operation & CRM", summary: "무료강의 전후의 고객 접점을 하나의 운영 Flow로 관리했습니다" },
    { id: "performance", number: "04", title: "Performance & Iteration", summary: "성과를 기록하는 데서 끝내지 않고, 다음 Product를 다시 설계했습니다" },
  ],
} as const;

export type InvaderSectionId = typeof INVADER_PROJECT.sections[number]["id"];
