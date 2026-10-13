import type { ProjectId } from "@/types/game";

export interface CareerCase {
  id: string;
  number: string;
  company: string;
  affiliation?: string;
  role: string;
  category: string;
  stage: string;
  statement: string;
  paragraphs: readonly string[];
  diagram: readonly string[];
  keywords: readonly string[];
  kind?: "exchange" | "location" | "branch";
  annotation?: string;
  projectId?: ProjectId;
}

// Copy and relationships supplied in the approved Experience page brief.
export const CAREER_CASES: readonly CareerCase[] = [
  {
    id:"dado",number:"01",company:"DADO GLOBAL / DROPTOP",role:"본사 디자인팀",category:"DESIGN",stage:"DESIGN",
    statement:"I started by making things visible.",
    paragraphs:["드롭탑 본사 디자인팀에서 모바일 배너와 SNS 광고 이미지, 짧은 영상을 만들었습니다.","마케팅팀과 가까이 일하면서 단순히 요청받은 이미지를 제작하는 것보다, 어떤 메시지를 어떤 형식으로 보여줄지 기획 단계부터 함께 맞췄습니다.","여러 디지털 채널에 맞춰 콘텐츠를 만들면서, 디자인은 보기 좋게 만드는 것보다 브랜드가 하고 싶은 말을 고객에게 제대로 전달하는 일에 가깝다는 걸 처음 배웠습니다."],
    diagram:["MESSAGE","CONTENT","VISUAL","CUSTOMER"],keywords:["Visual Communication","Digital Content","Marketing Collaboration"],
  },
  {
    id:"kanna",number:"02",company:"CAFE KANNA",role:"매니저 · 매장 운영",category:"CUSTOMER & OPERATION",stage:"CUSTOMER",
    statement:"Closer to the customer.",
    paragraphs:["매니저로 매장을 운영하면서 바리스타 업무뿐 아니라 메뉴판과 포스터, SNS 콘텐츠까지 직접 만들었습니다.","대학가라는 입지에 맞춰 이벤트를 기획하고, 실제 고객 반응을 보면서 홍보 방식도 계속 바꿨습니다.","이때부터 디자인 결과물만 보는 게 아니라, 만든 것이 실제 현장에서 어떻게 쓰이고 사람들이 어떻게 반응하는지까지 같이 보기 시작했습니다."],
    diagram:["CUSTOMER","STORE","EVENT","CONTENT"],keywords:["Customer","Store Operation","Promotion","Content"],kind:"exchange",
  },
  {
    id:"29cm",number:"03",company:"29CM",role:"검색 운영 · 상품 매핑",category:"SEARCH & SERVICE",stage:"SEARCH",
    statement:"From what looks right to what works right.",
    paragraphs:["29CM 웹과 앱의 SRP(Search Results Page)를 운영하며 검색어와 상품이 제대로 연결되도록 매핑 작업을 했습니다.","잘못된 카테고리에 노출된 상품은 다시 연결하고, 상품 정보 자체가 잘못된 경우에는 MD팀과 확인해 데이터를 수정했습니다.","화면을 직접 만드는 일보다, 고객이 원하는 상품에 정확하게 도달하도록 검색 결과와 상품 정보를 맞추는 일이 서비스 경험에 얼마나 큰 영향을 주는지 이때 처음 알게 됐습니다."],
    diagram:["QUERY","MAPPING","SEARCH RESULT","PRODUCT","DISCOVERY"],annotation:"Does this result actually make sense?",keywords:["Search Operation","Product Mapping","SRP","MD Collaboration"],
  },
  {
    id:"yic",number:"04",company:"YIC JAPAN",affiliation:"Service / Brand — OSAKEDA",role:"자사몰 · SNS · 재고 · 출고 · 발주",category:"COMMERCE & OPERATION",stage:"TOKYO",
    statement:"From product knowledge to daily operation.",
    paragraphs:["도쿄 아카바네에서 오사케다의 자사몰과 SNS를 관리하고, 사케 재고 관리와 출고 업무도 함께 맡았습니다.","인원이 많지 않아 직접 상품을 포장하고 발송했으며, 팀원 한 명과 재고를 확인해 필요한 상품을 발주하는 일도 진행했습니다.","매주 수요일에는 전 직원이 함께 사케 테이스팅에 참여했습니다. 제품의 맛과 특징을 직접 익히고, 이를 자사몰과 SNS에 소개할 때 참고했습니다. 상품을 보여주는 일뿐 아니라 재고와 출고, 발주까지 실제 운영이 어떻게 이어지는지 가까이에서 배웠습니다."],
    diagram:["PRODUCT","INVENTORY","FULFILLMENT","ORDER","STORE / SNS"],keywords:["Commerce","Inventory","Fulfillment","Ordering","SNS"],kind:"location",annotation:"WEEKLY SAKE TASTING · EVERY WEDNESDAY",
  },
  {
    id:"invader",number:"05",company:"INVADER SCHOOL",role:"교육상품 기획 · 운영",category:"PRODUCT & OPERATION",stage:"PRODUCT",
    statement:"From execution to product decisions.",
    paragraphs:["교육상품의 기획과 운영을 맡으며 강사의 경험을 상품으로 정리하고, 무료강의·CRM·Live Sales·수강 운영까지 이어지는 과정을 직접 운영했습니다.","회차가 끝난 뒤에는 신청, 시청, 결제 데이터를 확인하면서 다음 기획에서 무엇을 바꿔야 할지도 함께 봤습니다."],
    diagram:["EXPERTISE","PRODUCT","FUNNEL","PERFORMANCE"],keywords:["Product Planning","CRM","Live Sales","Performance"],projectId:"project-02",
  },
  {
    id:"harubareun-tf",number:"05 ↳",company:"NEW BUSINESS TF",affiliation:"INVADER SCHOOL 내 신사업 TF",role:"HARUBAREUN · 건강식품 사업",category:"BRAND & COMMERCE",stage:"BRAND / COMMERCE",
    statement:"From product to brand and commerce.",
    paragraphs:["인베이더스쿨에서 기획과 운영 업무를 하던 중 신사업 TF에 합류했습니다.","건강식품 사업을 처음부터 만드는 과정에서 HARUBAREUN이라는 이름을 정하는 것부터 제품 방향, 제조사 커뮤니케이션, 생산 일정, 판매 채널 준비까지 역할이 넓어졌습니다."],
    diagram:["INVADER SCHOOL","NEW BUSINESS TF","HARUBAREUN"],keywords:["Product","Brand","Commerce"],kind:"branch",projectId:"harubareun",
  },
];
