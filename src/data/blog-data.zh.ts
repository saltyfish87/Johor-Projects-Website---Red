/**
 * 简体中文版指南（2026-09-25 重写）。繁体版由 OpenCC 在构建时自动生成，不另外维护。
 * 规则同 blog-data.ts：数字只来自项目表格（发展商记录）、OpenStreetMap 直线测距、
 * RTS 营运方与两国政府的公开说明；不写回酬、不写涨幅预测；发展商说法注明「发展商称」。
 * 楼盘资料、户型图、照片都在 jbproperties.my/zh，文章只链过去，不重复。
 */
import { BlogPost, AreaGuide, DeveloperProfile } from "../types";

const UPDATED_ZH = "2026年9月25日";

/** 分类名对照（英 → 中） */
export const CATEGORY_ZH: Record<string, string> = {
  "Buying from Singapore": "从新加坡买房",
  "Buying Guides": "置业指南",
  "RTS Link": "新柔捷运",
  "Market": "市场",
  "Areas": "区域",
  "Living in JB": "新山生活"
};

type ZhPost = Pick<BlogPost, "title" | "summary" | "content"> & { metaDescription: string; seoTitle: string; readTime?: string };

const G = "https://www.jbproperties.my/zh/project";

export const blogPostsZh: Record<string, ZhPost> = {
  "why-singaporeans-buying-property-johor-bahru": {
    title: "新加坡人为什么到新山买房：几个实际的原因",
    seoTitle: "新加坡人为什么到新山买房 | jbpropertyportal.my",
    summary: "同样的预算换到更大的空间、新柔捷运、永久地契写自己的名字、海峡对岸的第二个家。新加坡买家给出的原因，以及每一条背后的事实。",
    metaDescription: "新加坡买家到新山买新楼盘的几个实际原因：目前挂牌项目的价格与面积、通往兀兰北的新柔捷运、永久地契，以及下决定前要先确认的事。",
    readTime: "3 分钟",
    content: `新山就在柔佛海峡对岸，隔着兀兰。对新加坡家庭来说，这是最近的一个海外房产市场，饮食和语言都熟悉，货币也比新元「更耐用」。买家告诉我们的原因，大致分四类。

## 一、同样的钱，更大的空间

我们挂牌网站上的九个新楼盘，最低从 M Grand Minori（Taman Pelangi）一个小单位的 RM300,000 起，最高到 Aethera Residences 最大单位的 RM5,000,000（发展商 2026 年 9 月的参考价）。面积从 280 平方英尺的开放式单位到 2,594 平方英尺的复式。买家自己拿同样的预算跟新加坡比。我们不发布回酬或涨幅预测。

## 二、新柔捷运（RTS Link）

新山—新加坡捷运系统衔接线将连接新山的武吉查加（Bukit Chagar）与新加坡的兀兰北。营运方说明车程约五分钟，两国的出入境手续在出发站一次办完；官方目标是 2026 年年底前后开始载客。几个挂牌项目走路就到：以项目坐标直线量，[Coronade Twins](${G}/coronade-twins) 离车站约 350 米，[Aethera Residences](${G}/aethera-residences) 约 400 米（OpenStreetMap）。

## 三、永久地契，写自己的名字

我们挂牌的九个项目全部是永久地契。外国人（包括新加坡人）符合柔佛州的外国人购屋条件后，可以用自己的名字持有分层地契房产。门槛价和州政府批准的流程，见外国人购屋指南。

## 四、第二个家，不只是投资

不少买家要的是周末的家、给父母住的地方，或是到柔佛工作的落脚点。两国政府在 2025 年签署的柔新经济特区协议，也让人预期跨境工作会更多。

## 下决定前先确认

- 持有组屋（HDB）的人：新加坡关于持有组屋期间在海外拥有私宅的规定，包括最短居住期（MOP），都适用于你。请向建屋局确认。
- 贷款：马来西亚银行会贷给新加坡买家，但条件是银行自己定的。见房贷指南。
- 地契性质：这些项目大多是建在商业地契上的服务式公寓，受《房屋发展法令》保障。请律师说明这对水电费率和门牌税的影响。

## 常见问题

#### 新加坡人可以在柔佛拥有永久地契公寓吗？

可以。符合柔佛州的外国人购屋条件并取得州政府批准即可。买卖合约签署后由律师提交申请。

#### 一定要人在马来西亚才能买吗？

大部分步骤不需要。订购、买卖合约和贷款文件都可以由马来西亚律师安排，人在新加坡处理；有些银行会要求见面一次。`
  },
  "guide-foreigners-buying-property-malaysia": {
    title: "外国人在新山买房：步骤、批准与费用",
    seoTitle: "外国人在新山买房：一步一步说明 | jbpropertyportal.my",
    summary: "非马来西亚公民从订购到拿钥匙的六个步骤：州政府门槛价、买卖合约、州政府批准、贷款、印花税，以及《房屋发展法令》下的交付。",
    metaDescription: "外国买家在新山买新楼盘的分步指南：州政府最低购屋价、订购与买卖合约、柔佛州政府批准、房贷、按价格分级的印花税，以及房屋发展法令下的交屋。",
    readTime: "3 分钟",
    content: `非公民按各州的外国人购屋规定买房；永久居民的身份如何认定，请先问律师。以下是在新山买一个新楼盘分层单位的路径。

## 第一步：确认最低购屋价

每个州都为外国买家设定最低购屋价。柔佛州对分层住宅一般适用 RM1,000,000 的门槛，部分指定区域有例外。这个数字由州政府决定，会变，所以订购前请律师确认你看的那个项目目前的门槛。我们挂牌的几个项目，门槛以下和以上的单位都有；低于门槛的单位是给马来西亚买家的。

## 第二步：订购与签约

先付发展商规定的订购金，然后在订购表格注明的期限内（通常是几个星期）签署买卖合约（SPA）。新楼盘的付款进度由《房屋发展法令》统一规定，同一个项目每位买家都一样。

## 第三步：柔佛州政府批准

外国买家在过户前需要取得州政府的批准。买卖合约签署后由律师提交申请；需缴付州政府的批准费，流程以月计。发展商的指定律师对此很熟。

## 第四步：贷款

马来西亚银行会贷给外国买家，贷款比例、年期和所需文件与本地人不同。见房贷指南。

## 第五步：印花税与律师费

过户印花税按房价分级计算，律师费按《律师酬金令》的收费表。签约前请索取书面估算；金额取决于房价，也可能随年度财政预算案调整。

## 第六步：竣工与交屋

按《房屋发展法令》标准合约出售的高层项目，发展商须在买卖合约注明的期限内交付空置管有权，通常是签约后 36 个月。逾期交付，合约规定有赔偿。

## 以后卖出

卖出获利要缴产业盈利税（RPGT），税率取决于持有年期和是否公民，头几年较高。打算卖的时候再确认当时的税率表。

## 常见问题

#### 外国人在柔佛什么房产都能买吗？

不是。马来保留地、廉价屋和其他几类不开放给外国买家。我们挂牌的九个项目都是分层高楼，是一般开放给外国人的类别，但要符合门槛价。

#### 州政府批准由谁申请？

买卖合约签署后由你的律师申请，你不需要自己跟州政府部门打交道。`
  },
  "rts-link-impact-johor-bahru-prices": {
    title: "新柔捷运与新山房产：已知的事实，和不知道的部分",
    seoTitle: "新柔捷运与新山房产：事实与距离 | jbpropertyportal.my",
    summary: "武吉查加到兀兰北这条线的事实、每个挂牌项目量出来的距离，以及本站为什么不做价格预测。",
    metaDescription: "新山—新加坡捷运衔接线是什么、目标何时开通，以及每个挂牌新楼盘到武吉查加站的直线距离。不做价格预测。",
    readTime: "3 分钟",
    content: `## 这条线本身

新山—新加坡捷运系统衔接线连接新山市中心苏丹依斯干达关卡大楼旁的武吉查加站，与新加坡的兀兰北站。营运方说明车程约五分钟，每个方向每小时最多可载 10,000 名乘客；两国的出入境手续在出发站办完。官方目标是 2026 年年底前后开始载客，实际日期以营运方公告为准。

## 哪些挂牌项目在它附近

下表是从项目坐标到武吉查加站的直线距离，用 OpenStreetMap 量出。走路一定比直线长。

| 项目 | 到武吉查加直线距离 |
|---|---|
| [Coronade Twins](${G}/coronade-twins) | 约 350 米 |
| [Aethera Residences](${G}/aethera-residences) | 约 400 米 |
| [Causewayz Square – Dover Tower](${G}/dover-tower) | 约 760 米 |
| [Causewayz Square – Brixton Tower](${G}/brixton-tower) | 约 840 米 |
| [Causewayz Square – Axis Tower](${G}/axis-tower) | 约 870 米 |
| [Princess Cove 第三期](${G}/princess-cove-phase-3) | 约 1.1 公里 |
| [Princess Cove 第二期](${G}/princess-cove-phase-2) | 约 1.4 公里 |
| [M Grand Minori](${G}/m-grand-minori) | 约 1.9 公里 |

Gen Sphere 暂不列出，等项目表格上的坐标确认后补上。

## 发展商怎么说连接

有几家发展商称有有盖连接：UOA 称 Aethera Residences 有 400 米有盖步道到车站，EXSIM 称 Causewayz Square 有 600 米有盖天桥到关卡和车站，R&F 称 Princess Cove 第二期有 650 米连接桥。这些是发展商对尚未开放的工程的说法，看房时请问清目前进度。

## 本站不做的事

我们不发布跟捷运挂钩的价格或租金预测。挂牌页上的价格是更新当时发展商的参考价，再往前推就是猜。你自己能查的是：距离、发展商称的连接、竣工年份和价格表。

## 常见问题

#### 捷运车程多长？

据营运方说明，武吉查加到兀兰北约五分钟。

#### 捷运什么时候开通？

官方目标是 2026 年年底前后开始载客，以营运方公告为准。

#### 武吉查加站到底在哪里？

在苏丹依斯干达大楼（新山长堤关卡）旁边，市中心。`
  },
  "johor-bahru-property-market-outlook": {
    title: "2026 年新山新楼盘：市场上到底有什么",
    seoTitle: "2026 年新山新楼盘：价格、面积、竣工 | jbpropertyportal.my",
    summary: "我们挂牌网站上九个新楼盘的清单：价格、面积、单位数、竣工年份和地契，全部来自发展商记录。",
    metaDescription: "2026 年新山新楼盘市场上有什么：捷运和关卡附近的九个项目，按发展商价格范围、单位面积、单位数、竣工年份和地契比较。",
    readTime: "3 分钟",
    content: `与其讲展望，不如列出实际在卖的东西。下表是我们挂牌网站上的九个项目，数据取自 2026 年 9 月更新的发展商记录。

| 项目 | 区域 | 起价 (RM) | 面积 (平方英尺) | 单位数 | 竣工 |
|---|---|---|---|---|---|
| [M Grand Minori](${G}/m-grand-minori) | Taman Pelangi | 300,000 | 403–835 | 1,733 | 2030 |
| [Coronade Twins](${G}/coronade-twins) | IIBD | 476,000 | 280–1,230 | 539 | 2030 |
| [Gen Sphere](${G}/gen-sphere) | Taman Sri Tebrau | 550,000 | 459–755 | 996 | 2029 |
| [Causewayz Square – Axis Tower](${G}/axis-tower) | JBCC / Lumba Kuda | 580,300 | 366–592 | 1,100 | 2029 |
| [Causewayz Square – Brixton Tower](${G}/brixton-tower) | JBCC / Lumba Kuda | 691,000 | 474–850 | 1,200 | 2029 |
| [Princess Cove 第二期](${G}/princess-cove-phase-2) | Tanjung Puteri | 690,000 | 471–1,471 | 3,724 | 2023 已竣工 |
| [Princess Cove 第三期](${G}/princess-cove-phase-3) | Tanjung Puteri | 720,000 | 314–1,556 | 4,385 | 2027 |
| [Causewayz Square – Dover Tower](${G}/dover-tower) | JBCC / Lumba Kuda | 727,500 | 474–850 | 1,200 | 2029 |
| [Aethera Residences](${G}/aethera-residences) | IIBD | 1,200,000 | 650–2,594 | 786 | 2029 |

## 表格说明了什么

- 九个项目全部是永久地契，以商业地契上的服务式公寓形式、按《房屋发展法令》出售。
- 只有 Princess Cove 第二期已竣工，其余在建，发展商称 2027 至 2030 年间交付。
- 规模差距很大：Coronade Twins 有 539 个单位，Princess Cove 两期加起来超过 8,000 个。
- 起价从 RM300,000 到 RM1,200,000。外国买家要对照柔佛州的外国人最低购屋价，见外国人购屋指南。

## 值得权衡的事

同一个发展项目里定位也不同：EXSIM 把 Axis Tower 定位为交给营运商做短期出租，Brixton 和 Dover Tower 则给自住业主，发展商称两者分区管理。Gen Sphere 和 M Grand Minori 的记录里有双钥匙户型。打算捷运开通就入住的人，要看竣工时间。

## 常见问题

#### 这些项目有已经竣工的吗？

Princess Cove 第二期记录为 2023 年竣工，其余八个在建。

#### 价格是最终价吗？

不是。这些是挂牌更新当时发展商的参考价，订购前请索取最新价格表。`
  },
  "best-areas-buy-property-near-ciq": {
    title: "新山关卡附近买在哪里：五个地段，量出来的距离",
    seoTitle: "新山关卡附近买在哪里：五个区域比较 | jbpropertyportal.my",
    summary: "挂牌新楼盘所在的五个地段，附每个项目到关卡大楼和武吉查加站的直线距离。",
    metaDescription: "比较新山关卡附近有新楼盘的五个地段：Lumba Kuda、IIBD、Tanjung Puteri、Taman Pelangi 和 Taman Sri Tebrau，附到关卡和捷运站的测量距离。",
    readTime: "3 分钟",
    content: `苏丹依斯干达大楼是新山长堤这一端的关卡（海关、移民、检疫）大楼，武吉查加捷运站正在它旁边兴建。挂牌的新楼盘分布在周围五个地段。距离是从项目坐标量的直线（OpenStreetMap），走路更远；有盖连接都是发展商的说法。

## 一、Lumba Kuda 与新山市中心

紧贴关卡大楼西侧的街区。EXSIM 的 Causewayz Square 三座塔楼在这里：[Dover Tower](${G}/dover-tower) 离关卡约 130 米，[Brixton Tower](${G}/brixton-tower) 约 220 米，[Axis Tower](${G}/axis-tower) 约 250 米。Johor Bahru City Square 商场离三座都在约 650 米内。

## 二、依布拉欣国际商业区（IIBD）

以 Coronation Square 为核心、规划在关卡西北方的金融区。[Coronade Twins](${G}/coronade-twins) 离武吉查加站约 350 米、离关卡 570 米；[Aethera Residences](${G}/aethera-residences) 约 400 米和 760 米。两者最近的商场都是 Komtar JBCC。

## 三、Tanjung Puteri 海滨

关卡东南方填海地上 R&F 的 Princess Cove。[第三期](${G}/princess-cove-phase-3) 离关卡约 430 米，已竣工的[第二期](${G}/princess-cove-phase-2) 约 650 米。R&F Mall 是发展项目的一部分。

## 四、Taman Pelangi

市中心以北的成熟住宅区。[M Grand Minori](${G}/m-grand-minori) 离武吉查加站约 1.9 公里，Pelangi Leisure Mall 约 560 米。发展商列有到关卡大楼的穿梭巴士。

## 五、Taman Sri Tebrau

市中心东北方、地不佬走廊沿线。[Gen Sphere](${G}/gen-sphere) 在这里；它的测量距离暂不公布，等项目表格上的坐标确认。

## 怎么用这份资料

最近不等于最好。最靠近的三座塔楼也属于规模最大的项目，Princess Cove 两期则把几千个单位放在同一个地址。请把距离跟单位数、竣工年份和价格一起看，这些都在挂牌页上。

## 常见问题

#### 哪个挂牌项目离关卡大楼最近？

Causewayz Square Dover Tower，直线约 130 米。

#### 哪个离武吉查加捷运站最近？

Coronade Twins，直线约 350 米；其次是 Aethera Residences，约 400 米。`
  },
  "freehold-vs-leasehold-property-malaysia": {
    title: "马来西亚永久地契与租赁地契，以及「商业地契」是什么意思",
    seoTitle: "马来西亚永久地契与租赁地契说明 | jbpropertyportal.my",
    summary: "两种地契怎么运作、为什么九个挂牌项目都是永久地契，以及服务式公寓建在《房屋发展法令》下的商业地上时要问什么。",
    metaDescription: "给外国买家的马来西亚永久与租赁地契说明，以及服务式公寓「房屋发展法令下的商业地契」是什么意思。九个挂牌的新山项目全部是永久地契。",
    readTime: "3 分钟",
    content: `## 永久地契（Freehold）

业主无期限地持有土地或其分层份额，可以继承，随时可以卖。跟任何土地一样，仍受规划条例和州政府征地权力约束。

## 租赁地契（Leasehold）

州政府以固定年期（常见 99 年）批出土地，地契上写着到期日。业主可以在到期前申请延长，费用由州政府定。银行批贷时会看剩余年期。租赁地契在马来西亚很普遍，很多管理良好的项目也是租赁地契；它只是多了一个要查的日期。

## 为什么在这里不是重点

我们挂牌的九个项目，发展商记录全部是永久地契，所以地契不是它们之间的分别。要跟其他新山项目比较时才会用到。

## 《房屋发展法令》下的商业地契

这些项目大多是建在商业用地上的服务式公寓，但跟一般住宅一样按《房屋发展法令》出售。有三个实际影响：

- 水电可能按商业费率收费，请问发展商适用哪种费率。
- 地方政府的门牌税可能与住宅地契不同。
- 《房屋发展法令》的买家保障，包括标准合约和逾期交付赔偿，仍然适用，因为单位是作为住宅出售的。

签约前律师可以就具体项目确认这三点。

## 外国人要注意的

外国人购屋规定管的是门槛价和州政府批准，不是地契类型。取得批准后，外国买家可以持有柔佛的永久或租赁分层房产。

## 常见问题

#### 挂牌项目有租赁地契的吗？

没有。九个项目在发展商记录上都是永久地契。

#### 「商业地契」是不是不能住？

不是。商业地契上的服务式公寓就是作为住宅出售和使用的。这个标签影响的是费率和门牌税，买前确认即可。`
  },
  "johor-singapore-investment-guide": {
    title: "从新加坡到新山买房：一份清单",
    seoTitle: "从新加坡到新山买房：清单 | jbpropertyportal.my",
    summary: "从新加坡订购新山新楼盘之前要弄清的十二件事，按它们出现的顺序排列。",
    metaDescription: "新加坡居民买新山新楼盘的十二点清单：组屋规定、外国人门槛价、买卖合约、州政府批准、贷款、货币，以及交屋时要做的事。",
    readTime: "3 分钟",
    content: `新加坡居民买新山新楼盘时，问题大致按这个顺序出现。有更详细指南的项目会注明。

## 看房前

1. **你的组屋身份。** 如果你持有组屋，先向建屋局确认能否在海外拥有私宅，以及最短居住期是否已满。
2. **外国人门槛价。** 柔佛州为外国买家设定最低购屋价；确认你看中的项目目前的数字。低于门槛的单位是给马来西亚人的。
3. **以令吉做预算。** 房价、贷款和费用都以令吉计。决定头期和每月供款怎么付、用哪家银行。

## 在售楼处

4. **索取最新价格表和付款进度。** 任何网站上的价格在发展商确认前都只是参考。
5. **问地契性质和费率。** 挂牌项目大多是商业地契上的服务式公寓，问清适用哪种水电费率。
6. **问项目内部的分区。** 有些项目把短期出租塔楼和自住塔楼分开，例如 EXSIM 对 Causewayz Square 的说法。
7. **看竣工年份。** 挂牌页上的交付日期是发展商的目标，在建项目为 2027 至 2030 年。

## 签约前

8. **委任律师。** 新楼盘通常用发展商的指定律师，你也可以自己委任。
9. **索取书面费用估算**，包括印花税、律师费和州政府批准费。
10. **需要贷款的话，先取得原则性批准**再签买卖合约。见房贷指南。

## 签约后

11. **州政府批准。** 由律师申请，流程以月计。
12. **交屋。** 按《房屋发展法令》标准合约，须在买卖合约注明的期限内交付，通常 36 个月。验屋并在合约注明的保修期内报修。

## 常见问题

#### 可以用新加坡银行账户付款吗？

可以。款项以令吉付给发展商或律师的账户，由你的银行换汇。

#### 需要开马来西亚银行账户吗？

买房本身不需要。之后付贷款供款和管理费会方便些，马来西亚银行会用一般文件为外国业主开户。`
  },
  "how-foreigners-obtain-malaysian-home-loan": {
    title: "外国人与新加坡买家在马来西亚申请房贷",
    seoTitle: "外国人与新加坡人的马来西亚房贷 | jbpropertyportal.my",
    summary: "非马来西亚人怎么向马来西亚银行申请房贷：谁会贷、贷款长什么样、要准备的文件，以及签买卖合约前要问银行的问题。",
    metaDescription: "外国和新加坡买家为新山新楼盘向马来西亚银行申请房贷：贷款比例和年期、货币、文件清单，以及围绕买卖合约的步骤顺序。",
    readTime: "3 分钟",
    content: `马来西亚银行会贷给外国买家，包括没有马来西亚收入的新加坡居民。条件由各银行自定，所以这里讲的是流程的样子，不是利率表。

## 贷款长什么样

- **货币。** 贷款以令吉计，也以令吉偿还，不论你赚的是什么货币。
- **比例。** 银行贷给外国买家的房价比例一般低于马来西亚人，具体看银行、你的收入和项目。
- **年期。** 贷款到银行设定的最高年龄为止，所以年期取决于你批贷时的年龄。
- **利率。** 通常以银行的基准利率为基础，随国家银行的政策利率变动；银行会报给你当时的数字。

## 谁会贷

马来西亚的大型银行，以及几家在马来西亚有业务的新加坡银行。发展商通常为每个项目安排一组指定银行；用指定银行方便，但你可以找任何一家。

## 要准备的文件

- 护照；新加坡居民另加身份证（NRIC）
- 近期工资单和最新的所得税评税通知
- 显示薪金入账的银行月结单
- 你所在国的信贷报告，例如新加坡信贷局（CBS）报告
- 单位的订购表格或买卖合约

自雇人士以商业注册和账目代替工资单。

## 步骤顺序

1. 订购前先问银行大概能贷多少比例。
2. 拿到订购表格后就申请，让贷款批准信在买卖合约期限前到手。
3. 与银行律师签署贷款协议；银行按《房屋发展法令》的进度表付款给发展商。
4. 银行放款后开始供款；问清建造期间利息怎么算。

## 要问银行的问题

- 有没有锁定期？提前还清要付什么费用？
- 银行是否要求火险和房贷保险？可以自选保险公司吗？
- 从海外账户供款有没有手续费？

## 常见问题

#### 只有新加坡收入也能拿马来西亚房贷吗？

可以。银行用上述文件评估海外收入；能贷的房价比例可能低于马来西亚借款人。

#### 贷款批准前可以先签买卖合约吗？

先拿到批准信，至少要有银行明确的表示。买卖合约一签，不论贷款有没有下来，你都有购买义务。`
  },
  "living-johor-bahru-working-singapore": {
    title: "住新山、在新加坡上班：通勤怎么走",
    seoTitle: "住新山在新加坡上班：通勤说明 | jbpropertyportal.my",
    summary: "现在有哪些过境方式、新柔捷运改变什么，以及挂牌项目周边的日常：商场、学校、诊所，来自发展商记录和 OpenStreetMap。",
    metaDescription: "每天从新山到新加坡通勤现在怎么走（长堤与第二通道）、新柔捷运从目标开通起改变什么，以及挂牌住宅附近的日常设施。",
    readTime: "3 分钟",
    content: `## 现在的过境方式

新山和新加坡之间有两条公路连接：从市中心到兀兰的长堤，以及从依斯干达公主城到大士的第二通道。通勤者开车、骑摩托或坐巴士过关，关卡耗时随时段和日子变化。打算每天通勤的人，买房前应该在自己预定的时段实际走一趟。

## 新柔捷运改变什么

从官方目标的 2026 年年底前后开通起，捷运将连接关卡大楼旁的武吉查加站与兀兰北，营运方称车程约五分钟，两国出入境手续在上车前办完。对住在武吉查加步行范围内的人来说，公路排队就没有了。以直线量，[Coronade Twins](${G}/coronade-twins) 离车站约 350 米，[Aethera Residences](${G}/aethera-residences) 约 400 米；Causewayz Square 三座塔楼在约 900 米内。

## 挂牌住宅周边的日常

来自发展商记录和 OpenStreetMap：

- **购物。** Komtar JBCC 和 Johor Bahru City Square 离市中心各项目约 650 米内；R&F Mall 是 Princess Cove 的一部分；Pelangi Leisure Mall 离 M Grand Minori 约 560 米。
- **学校。** 宽柔中学出现在多数市中心项目的发展商名单上；St. Joseph 小学离 Coronade Twins 和 Aethera Residences 约 300 米内。
- **诊所。** KPJ Medical Suites 离 Coronade Twins 约 100 米；其他项目列出的诊所都在约一公里内。

## 要事先规划的

- **在新加坡上班、地址在马来西亚。** 确认雇主没有异议，新加坡的税务和公积金事项照常处理。
- **车辆。** 如果保留新加坡注册的车，把它开进马来西亚、以及把马来西亚车开进新加坡的规定都适用。
- **医疗。** 新加坡的医疗计划一般不涵盖在马来西亚的治疗，请查看你的保险。

## 常见问题

#### 现在通勤要多久？

看过境点、时段和交通方式，没有一个可靠的单一数字，所以我们建议买前实际走一趟。

#### 哪些挂牌项目离捷运站最近？

以项目坐标直线量，Coronade Twins 约 350 米，Aethera Residences 约 400 米。`
  },
  "new-launch-property-projects-near-rts": {
    title: "武吉查加捷运站附近的新楼盘：九个挂牌项目一表比较",
    seoTitle: "武吉查加捷运站附近新楼盘比较 | jbpropertyportal.my",
    summary: "九个挂牌新山新楼盘放在一张表：到武吉查加站的直线距离、发展商起价、面积、单位数和竣工年份。",
    metaDescription: "比较武吉查加捷运站附近的九个新山新楼盘：到车站的测量距离、发展商起价、面积范围、单位数和竣工年份，附官方挂牌页链接。",
    readTime: "3 分钟",
    content: `一张表，九个项目。距离是从项目坐标到武吉查加捷运站的直线（OpenStreetMap），走路更远。价格是 2026 年 9 月更新时发展商的参考「起价」。户型图、照片和完整资料在各挂牌页。

| 项目 | 到武吉查加 | 起价 (RM) | 面积 (平方英尺) | 单位数 | 竣工 |
|---|---|---|---|---|---|
| [Coronade Twins](${G}/coronade-twins) | 约 350 米 | 476,000 | 280–1,230 | 539 | 2030 |
| [Aethera Residences](${G}/aethera-residences) | 约 400 米 | 1,200,000 | 650–2,594 | 786 | 2029 |
| [Causewayz Square – Dover Tower](${G}/dover-tower) | 约 760 米 | 727,500 | 474–850 | 1,200 | 2029 |
| [Causewayz Square – Brixton Tower](${G}/brixton-tower) | 约 840 米 | 691,000 | 474–850 | 1,200 | 2029 |
| [Causewayz Square – Axis Tower](${G}/axis-tower) | 约 870 米 | 580,300 | 366–592 | 1,100 | 2029 |
| [Princess Cove 第三期](${G}/princess-cove-phase-3) | 约 1.1 公里 | 720,000 | 314–1,556 | 4,385 | 2027 |
| [Princess Cove 第二期](${G}/princess-cove-phase-2) | 约 1.4 公里 | 690,000 | 471–1,471 | 3,724 | 2023 已竣工 |
| [M Grand Minori](${G}/m-grand-minori) | 约 1.9 公里 | 300,000 | 403–835 | 1,733 | 2030 |
| [Gen Sphere](${G}/gen-sphere) | 待确认 | 550,000 | 459–755 | 996 | 2029 |

## 怎么读这张表

- **距离**是到车站的直线。Aethera Residences、Causewayz Square 和 Princess Cove 第二期的发展商各自称有有盖连接到车站或关卡大楼；在连接开放前，当作发展商的说法看。
- **Gen Sphere** 的距离暂不公布，等项目表格上的坐标确认。
- **起价**是发展商价格表上最低的单位，不是典型单位的价格。外国买家要拿柔佛州的外国人最低购屋价对照你要的单位。
- **单位数**从 Coronade Twins 的 539 个到 Princess Cove 第三期的 4,385 个。大项目设施多，邻居也多。
- **竣工**是发展商的目标。只有 Princess Cove 第二期已竣工。

## 同样的事实，别的看法

区域指南按地段整理这些项目；捷运那篇文章说明这条线是什么、目标何时开通。

## 常见问题

#### 哪个新楼盘离武吉查加捷运站最近？

Coronade Twins，直线约 350 米；其次 Aethera Residences，约 400 米。

#### 哪个入场价最低？

M Grand Minori 的单位从 RM300,000 起；注意低于柔佛外国人门槛价的单位是给马来西亚买家的。`
  }
};

type ZhArea = Pick<AreaGuide, "name" | "where" | "description" | "highlights">;
export const areaGuidesZh: Record<string, ZhArea> = {
  "johor-bahru": {
    name: "新山市中心与依布拉欣国际商业区（IIBD）",
    where: "苏丹依斯干达关卡大楼、武吉查加捷运站，以及规划中的依布拉欣国际商业区周围的街区。",
    description: "新山市中心是长堤的马来西亚这一端。关卡大楼在海滨，武吉查加捷运站正在它旁边兴建，依布拉欣国际商业区是州政府规划在西北方、以 Coronation Square 为核心的金融区。两个挂牌项目在 IIBD 里面，另外三个在车站一公里内。",
    highlights: [
      "武吉查加捷运站：离 Coronade Twins 直线约 350 米、离 Aethera Residences 约 400 米（OpenStreetMap）",
      "挂牌项目约 650 米内的商场：Komtar JBCC、Johor Bahru City Square",
      "IIBD 的两个项目都是永久地契服务式公寓，发展商称 2029 和 2030 年交付"
    ]
  },
  "ciq": {
    name: "关卡周边：Lumba Kuda 与 Tanjung Puteri",
    where: "紧邻苏丹依斯干达大楼（新山长堤关卡）西侧和东南侧的街区。",
    description: "苏丹依斯干达大楼处理长堤的公路过境。西侧的 Lumba Kuda 有 EXSIM 的 Causewayz Square 三座塔楼；东南侧的 Tanjung Puteri 海滨有 R&F 的 Princess Cove。这些是离关卡本身最近的挂牌住宅，直线约 130 米到 650 米。",
    highlights: [
      "离关卡最近的挂牌项目：Causewayz Square Dover Tower，直线约 130 米",
      "Princess Cove 第二期是名单上唯一已竣工的项目（2023）；第三期发展商称 2027 年交付",
      "发展商称有有盖连接到关卡大楼：EXSIM 600 米、R&F 650 米（发展商说法，尚未开放）"
    ]
  },
  "bukit-chagar": {
    name: "武吉查加捷运站一带",
    where: "武吉查加是关卡大楼旁的小山，新山的捷运站正在这里兴建。",
    description: "武吉查加站是新柔捷运在马来西亚的终点站，通往兀兰北。两国的出入境手续将在上车前于此办完，营运方称车程约五分钟。市中心的每个挂牌项目都在车站约 1.4 公里内，IIBD 的两个项目最近。",
    highlights: [
      "到兀兰北车程：营运方称约五分钟；目标 2026 年年底前后开始载客",
      "直线 500 米内：Coronade Twins（约 350 米）、Aethera Residences（约 400 米）",
      "1 公里内：Causewayz Square 三座塔楼（约 760 至 870 米）"
    ]
  },
  "rts": {
    name: "新柔捷运走廊",
    where: "新山—新加坡捷运系统衔接线的路线，从武吉查加到兀兰北。",
    description: "新柔捷运是一条短的跨境铁路，海峡两边各一个站。它不是穿过新山的地铁线，所以「靠近捷运」就是靠近武吉查加。本页按到该站的测量距离列出挂牌网站上的每个项目，Gen Sphere 待坐标确认后补上。",
    highlights: [
      "只有两个站：武吉查加（新山）和兀兰北（新加坡）",
      "营运方说明的运量：每个方向每小时最多 10,000 名乘客",
      "八个挂牌项目量得离武吉查加约 350 米至 1.9 公里"
    ]
  },
  "iskandar-puteri": {
    name: "依斯干达公主城",
    where: "新山都会区的西部，第二通道（往大士）、公主港和教育城一带。",
    description: "依斯干达公主城是市中心以西的规划新镇，从新加坡走第二通道而不是长堤。这里有公主港、马来西亚乐高乐园和教育城校区群。我们挂牌网站上目前的九个项目都不在依斯干达公主城；想看这一区的买家可以直接联系我们，有新挂牌时本页会更新。",
    highlights: [
      "过境：第二通道（大士），不是长堤或捷运",
      "地标：公主港、马来西亚乐高乐园、教育城",
      "这里的挂牌项目：目前没有"
    ]
  }
};

export const developerProfilesZh: Record<string, Pick<DeveloperProfile, "name" | "description">> = {
  "uoa-group": {
    name: "UOA 集团",
    description: "UOA 集团（UOA Development Bhd）是在马来西亚交易所上市的发展商，以吉隆坡的商业与住宅项目闻名，包括 Bangsar South。在新山的挂牌项目是依布拉欣国际商业区的 Aethera Residences，永久地契服务式公寓，786 个单位，发展商称 2029 年交付。"
  },
  "exsim-group": {
    name: "EXSIM 集团",
    description: "EXSIM 集团是马来西亚发展商，在巴生谷有多个高层住宅项目的记录，包括 Millerz Square 和 The Rainz。在新山，它在关卡大楼旁的 Lumba Kuda 兴建 Causewayz Square：Axis Tower 由发展商定位为交营运商做短期出租，Brixton 和 Dover Tower 给自住业主，全部永久地契，发展商称 2029 年交付。"
  },
  "r-f-development": {
    name: "R&F 富力",
    description: "R&F Development Sdn Bhd 是中国发展商富力地产在马来西亚的公司。它在新山的项目是 Princess Cove，位于长堤旁 Tanjung Puteri 填海地上的海滨发展项目，分期出售。第二期已竣工（2023），第三期发展商称 2027 年交付；两期都是永久地契，R&F Mall 是发展项目的一部分。"
  },
  "mah-sing-group": {
    name: "马星集团",
    description: "马星集团（Mah Sing Group Bhd）是在马来西亚交易所上市的发展商，项目遍及巴生谷、柔佛、槟城和沙巴，多以 M 系列品牌命名。在新山的挂牌项目是 Taman Pelangi 的 M Grand Minori，永久地契服务式公寓，1,733 个单位，发展商称 2030 年交付，并称有到关卡大楼的穿梭巴士。"
  }
};

/** 页面上的固定中文字句（构建脚本和 App 共用） */
export const UI_ZH = {
  updated: UPDATED_ZH,
  readMore: "阅读全文",
  faq: "常见问题",
  author: "作者：Yee Woei Shyan（REN 46305），IQI Realty Sdn Bhd",
  listingsTitle: "本文提到的项目：jbproperties.my 官方挂牌页",
  listingsNote: "户型图、价格和照片都在官方挂牌网（英文、中文、马来文）。",
  allListings: "jbproperties.my 上的全部新山挂牌 →",
  areaProjects: "这一区的挂牌项目",
  distanceNote: "直线距离由 OpenStreetMap 从项目坐标量出，走路比直线长。",
  project: "项目",
  toStation: "到武吉查加站",
  toCiq: "到关卡",
  from: "起价",
  completion: "竣工",
  developerProjects: "在新山的挂牌项目",
  published: "发布",
  home: "首页",
  blog: "指南",
  areas: "区域",
  developers: "发展商"
};
