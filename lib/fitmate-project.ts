// Source: 「제목 없는 문서」, CASE 03 — FitMate, and approved navigation labels.
// https://docs.google.com/document/d/17YxepizwgLH8KtJaccYc1JZEDxntVF1EAUNLqVMs-TY/edit
export const FITMATE_PROJECT = {
  name: "FitMate",
  lead: "From User Flow to Working iOS Product",
  projectType: "iOS Bootcamp Team Project · App Store Released",
  introduction: "운동 메이트 경험을 iOS 앱으로 직접 구현하고 App Store 출시까지 경험했으며, 사용자 테스트를 통해 실제 사용과정의 문제를 발견하고 개선했습니다.",
  sections: [
    { id: "contribution", number: "01", title: "구현 범위", summary: "My Contribution / User Flow" },
    { id: "validation", number: "02", title: "검증과 개선", summary: "User Testing / Iteration" },
    { id: "foundation", number: "03", title: "기술적 기반", summary: "Technical Foundation / Outcome / Learning" },
  ],
} as const;

export type FitMateSectionId = typeof FITMATE_PROJECT.sections[number]["id"];
