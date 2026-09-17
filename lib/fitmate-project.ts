// Source: 「제목 없는 문서」, CASE 03 — FitMate, and approved navigation labels.
// https://docs.google.com/document/d/17YxepizwgLH8KtJaccYc1JZEDxntVF1EAUNLqVMs-TY/edit
export const FITMATE_PROJECT = {
  name: "FitMate",
  lead: "From User Flow to Working iOS Product",
  projectType: "iOS Bootcamp Team Project · App Store Released",
  introduction: "운동 메이트 경험을 iOS 앱으로 직접 구현하고 App Store 출시까지 경험했으며, 사용자 테스트를 통해 실제 사용과정의 문제를 발견하고 개선했습니다.",
  sections: [
    { id: "product-strategy", number: "01", title: "Product Strategy", summary: "Core Product Loop / MVP Prioritization" },
    { id: "design-technical-flow", number: "02", title: "Design System & Technical Flow", summary: "Visual Rules / Product State / Data Flow" },
    { id: "test-iteration", number: "03", title: "Test & Iteration", summary: "User Test / Issue Validation / Product Improvement" },
    { id: "from-plan-to-product", number: "04", title: "From Plan to Product", summary: "Product Thinking / Technical Translation / Execution" },
  ],
} as const;

export type FitMateSectionId = typeof FITMATE_PROJECT.sections[number]["id"];
