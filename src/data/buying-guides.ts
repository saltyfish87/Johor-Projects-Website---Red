/**
 * The three short buyer-profile pages under /buying-guides/<type> (rewritten 2026-09-25).
 * Same rules as the articles: only facts that can be checked; rates and percentages are left to the
 * buyer's lawyer and bank because they change with each budget.
 */
export interface BuyingGuide {
  type: string;
  label: { EN: string; ZH: string };
  title: { EN: string; ZH: string };
  intro: { EN: string; ZH: string };
  sections: { heading: { EN: string; ZH: string }; body: { EN: string; ZH: string } }[];
  /** Related long articles (slugs under /blog) */
  articles: string[];
}

export const buyingGuides: BuyingGuide[] = [
  {
    type: "malaysian-buyer",
    label: { EN: "For Malaysian citizens", ZH: "马来西亚公民" },
    title: { EN: "Malaysian Citizens Buying Guide", ZH: "马来西亚公民购屋指南" },
    intro: {
      EN: "Malaysian citizens buy without a price threshold or state consent, and have access to the financing and withdrawal schemes below. Figures change with each budget, so confirm the current ones with your bank and lawyer.",
      ZH: "马来西亚公民买房没有门槛价，也不需要州政府批准，并可使用以下的贷款和提款安排。数字会随每年财政预算案调整，请向银行和律师确认当时的规定。"
    },
    sections: [
      { heading: { EN: "Financing", ZH: "贷款" }, body: { EN: "Local banks lend a larger share of the price to citizens than to foreign buyers, and first-time buyers may qualify for a higher margin under the bank's own rules. The rate is priced off each bank's base rate and quoted at approval.", ZH: "本地银行贷给公民的房价比例高于外国买家，首次购屋者可能按银行自己的规则获得更高比例。利率以各银行的基准利率为基础，批贷时报价。" } },
      { heading: { EN: "EPF Account 2 withdrawal", ZH: "公积金第二户口提款" }, body: { EN: "EPF members may withdraw from Account 2 towards buying a home or reducing a housing loan, under the conditions and limits EPF publishes. Check the current scheme on the EPF website before you rely on it for the down payment.", ZH: "公积金会员可以按公积金局公布的条件和限额，从第二户口提款用于买房或减少房贷。打算用它付头期之前，先在公积金局网站确认当时的方案。" } },
      { heading: { EN: "Real Property Gains Tax", ZH: "产业盈利税" }, body: { EN: "Gains on a sale are taxed at rates that fall the longer you hold the property, with citizens on a lower schedule than foreigners. The current rates are published by the Inland Revenue Board; your lawyer applies them at the sale.", ZH: "卖出的盈利按持有年期递减的税率征税，公民的税率表低于外国人。现行税率由内陆税收局公布，卖出时由律师计算。" } }
    ],
    articles: ["freehold-vs-leasehold-property-malaysia", "johor-bahru-property-market-outlook", "new-launch-property-projects-near-rts"]
  },
  {
    type: "singaporean-commuter",
    label: { EN: "For Singapore residents", ZH: "新加坡居民" },
    title: { EN: "Singapore Residents and Daily Commuters Guide", ZH: "新加坡居民与每日通勤者指南" },
    intro: {
      EN: "For Singapore citizens and permanent residents who want a home in Johor Bahru, whether to live in and commute or as a second base. Singapore buyers follow the foreign-purchase rules in Johor.",
      ZH: "给想在新山有个家的新加坡公民和永久居民，不论是住下来每天通勤，还是当第二个家。新加坡买家在柔佛按外国人购屋规定买房。"
    },
    sections: [
      { heading: { EN: "The RTS Link", ZH: "新柔捷运" }, body: { EN: "The RTS Link will run between Bukit Chagar, beside the Johor Bahru customs complex, and Woodlands North. The operator describes a ride of about five minutes with both countries' immigration cleared before boarding; passenger service is officially targeted for around the end of 2026. Until then the Causeway and the Second Link are the crossings.", ZH: "新柔捷运将连接新山关卡大楼旁的武吉查加与兀兰北。营运方称车程约五分钟，两国出入境手续在上车前办完；官方目标是 2026 年年底前后开始载客。在那之前，过境走长堤和第二通道。" } },
      { heading: { EN: "HDB ownership", ZH: "组屋规定" }, body: { EN: "Owners of HDB flats are subject to HDB's rules on owning private property, including overseas property, during the Minimum Occupation Period. Confirm your position with HDB before you book.", ZH: "组屋业主在最短居住期内持有私宅（包括海外房产）受建屋局规定约束。订购前先向建屋局确认自己的情况。" } },
      { heading: { EN: "Money and banks", ZH: "资金与银行" }, body: { EN: "The purchase is in ringgit. Malaysian banks and several Singapore banks with Malaysian operations lend to Singapore buyers on their own terms; see the home loan guide for the documents and the order of steps.", ZH: "交易以令吉进行。马来西亚银行和几家在马来西亚有业务的新加坡银行会按各自条件贷给新加坡买家；所需文件和步骤顺序见房贷指南。" } }
    ],
    articles: ["why-singaporeans-buying-property-johor-bahru", "johor-singapore-investment-guide", "living-johor-bahru-working-singapore", "how-foreigners-obtain-malaysian-home-loan"]
  },
  {
    type: "foreigner-investor",
    label: { EN: "For other foreign buyers", ZH: "其他外国买家" },
    title: { EN: "Foreign Buyers Guide", ZH: "外国买家指南" },
    intro: {
      EN: "For buyers who are neither Malaysian nor Singaporean. The rules are the same as for Singapore buyers: a state minimum price, state consent, and the ordinary HDA contract.",
      ZH: "给既不是马来西亚人也不是新加坡人的买家。规定与新加坡买家相同：州政府最低购屋价、州政府批准，以及一般的房屋发展法令合约。"
    },
    sections: [
      { heading: { EN: "Minimum purchase price", ZH: "最低购屋价" }, body: { EN: "Johor sets a minimum price for foreign buyers, commonly RM1,000,000 for strata homes with exceptions in designated zones. It is set by the state and can change; confirm the current figure for the project with your lawyer.", ZH: "柔佛州为外国买家设定最低购屋价，分层住宅一般为 RM1,000,000，指定区域有例外。由州政府决定，会变；请律师确认你看的项目当时的数字。" } },
      { heading: { EN: "State consent", ZH: "州政府批准" }, body: { EN: "Every foreign purchase needs the Johor state authority's consent before transfer. Your lawyer applies after the SPA is signed; a consent fee is payable and the process takes months.", ZH: "每宗外国人购屋都要在过户前取得柔佛州政府的批准。买卖合约签署后由律师申请；需缴批准费，流程以月计。" } },
      { heading: { EN: "Malaysia My Second Home", ZH: "第二家园计划（MM2H）" }, body: { EN: "MM2H is a long-term residence pass with financial conditions set by the government and revised from time to time. It is separate from property ownership: you can buy without it, and holding it does not remove the price threshold. Check the current conditions on the official MM2H site.", ZH: "MM2H 是政府设定财务条件、不时修订的长期居留准证。它与买房是两回事：没有它也能买，有它也不豁免门槛价。现行条件请看官方 MM2H 网站。" } }
    ],
    articles: ["guide-foreigners-buying-property-malaysia", "how-foreigners-obtain-malaysian-home-loan", "freehold-vs-leasehold-property-malaysia"]
  }
];
