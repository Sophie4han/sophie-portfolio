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
    paragraphs:["드롭탑 본사 디자인팀에서 모바일 배너와 SNS 광고 이미지, 짧은 영상 등을 제작했습니다.","마케팅팀과 가까이 일하면서 단순히 요청받은 이미지를 만드는 것보다, 무엇을 어떻게 보여줘야 하는지 함께 맞추는 과정을 처음 경험했습니다."],
    diagram:["MARKETING REQUEST","MESSAGE","VISUAL","CUSTOMER TOUCHPOINT"],keywords:["Visual Communication","Marketing Collaboration","Content"],
  },
  {
    id:"kanna",number:"02",company:"CAFE KANNA",role:"매니저 · 매장 운영",category:"CUSTOMER & OPERATION",stage:"CUSTOMER",
    statement:"Closer to the customer.",
    paragraphs:["매니저로 매장을 운영하면서 고객 반응을 가장 가까이에서 봤습니다.","메뉴판과 포스터를 직접 만들고, 대학가 고객을 대상으로 이벤트와 SNS 홍보도 함께 기획했습니다.","이때부터 결과물을 만드는 일과 실제 운영을 따로 생각하지 않게 됐습니다."],
    diagram:["CUSTOMER","STORE OPERATION","EVENT / PROMOTION","CONTENT"],keywords:["Customer","Operation","Promotion","Content"],kind:"exchange",
  },
  {
    id:"29cm",number:"03",company:"29CM",role:"검색 운영 · 상품 매핑",category:"SEARCH & SERVICE",stage:"SEARCH",
    statement:"From what looks right to what works right.",
    paragraphs:["29CM 웹과 앱의 검색 결과가 더 정확하게 연결되도록 검색어와 상품 매핑을 운영했습니다.","잘못 노출되는 상품은 적절한 카테고리로 다시 연결하고, 상품 정보 자체가 잘못 등록된 경우에는 MD와 확인해 수정했습니다.","화면을 만드는 것보다, 고객이 원하는 상품에 제대로 도달하도록 서비스의 기준을 맞추는 일을 처음 경험했습니다."],
    diagram:["CUSTOMER QUERY","SEARCH LOGIC","SEARCH RESULT","PRODUCT","DISCOVERY"],annotation:"Does this result actually make sense?",keywords:["Search Operation","Product Mapping","Service Quality","MD Collaboration"],
  },
  {
    id:"yic",number:"04",company:"YIC JAPAN",affiliation:"Service / Brand — OSAKEDA",role:"AKABANE, TOKYO",category:"CROSS-CULTURAL WORK",stage:"TOKYO",
    statement:"Working outside the familiar.",
    paragraphs:["일본에서 직접 생활하고 일하면서 다른 언어와 업무 방식 안에서 사람들과 맞춰 일하는 경험을 했습니다.","도쿄 아카바네에서 일본인과 한국인 동료들과 함께 근무하며, 같은 상황도 문화와 커뮤니케이션 방식에 따라 다르게 받아들여질 수 있다는 걸 체감했습니다."],
    diagram:["KOREA","TOKYO / AKABANE"],keywords:["LANGUAGE","CUSTOMER","WORK CULTURE"],kind:"location",
  },
  {
    id:"invader",number:"05",company:"INVADER SCHOOL",role:"교육상품 기획 · 운영",category:"PRODUCT & OPERATION",stage:"PRODUCT",
    statement:"From execution to product decisions.",
    paragraphs:["교육상품의 기획과 운영을 맡으며 강사의 경험을 상품으로 정리하고, CRM·Live Sales·수강 운영과 성과 확인까지 이어지는 흐름을 경험했습니다."],
    diagram:["EXPERTISE","PRODUCT","FUNNEL","PERFORMANCE"],keywords:["Product Planning","CRM","Live Sales","Performance"],projectId:"project-02",
  },
  {
    id:"harubareun-tf",number:"05 ↳",company:"NEW BUSINESS TF",affiliation:"INVADER SCHOOL 내 신사업 TF",role:"HARUBAREUN · 건강식품 사업",category:"BRAND & COMMERCE",stage:"BRAND / COMMERCE",
    statement:"From product to brand and commerce.",
    paragraphs:["인베이더스쿨에서 기획과 운영 업무를 하던 중, 소수 인원으로 구성된 신사업 TF에 합류했습니다.","건강식품 사업을 처음부터 만드는 과정에서 HARUBAREUN이라는 이름을 정하는 것부터 제품과 브랜드 방향, 제조사 커뮤니케이션, 생산 일정과 판매 준비까지 경험의 범위가 넓어졌습니다."],
    diagram:["INVADER SCHOOL","NEW BUSINESS TF","HARUBAREUN"],keywords:["Product","Brand","Commerce"],kind:"branch",projectId:"harubareun",
  },
];
