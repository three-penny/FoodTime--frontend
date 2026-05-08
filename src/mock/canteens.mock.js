// @author Codex

import canteenImage1 from '../assets/images/canteen/食堂1.png';
import canteenImage2 from '../assets/images/canteen/食堂2.png';
import canteenImage3 from '../assets/images/canteen/食堂3.png';
import canteenImage4 from '../assets/images/canteen/食堂4.png';
import canteenImage5 from '../assets/images/canteen/食堂5.png';
import canteenImage6 from '../assets/images/canteen/食堂6.png';

const xueyiImg = canteenImage1;
const minghuImg = canteenImage2;
const dongkuaiImg = canteenImage3;
const xueerImg = canteenImage4;
const xuesanImg = canteenImage5;
const qingzhenImg = canteenImage6;
const xuesiImg = canteenImage1;
const xuesiFengweiImg = canteenImage2;
const liuyuanImg = canteenImage3;
const jiaogongImg = canteenImage4;
const xueyuanDahuoImg = canteenImage5;
const xueyuanQingzhenImg = canteenImage6;
const xueyuanXicanImg = canteenImage1;
const dongquImg = canteenImage2;
const dongquQingzhenImg = canteenImage3;
const yiminImg = canteenImage4;

export const CANTEENS = [
  {
    id: 'xueyi',
    name: '学一餐厅',
    shortName: '学一',
    image: xueyiImg,
    rating: 4.6,
    location: '明湖餐厅一层（十八号楼后）',
    openHours: '06:30 - 21:30',
    avgPrice: '人均 ¥12 - ¥18',
    peakQueue: '11:45 - 12:15',
    bestTime: '11:20 前、12:40 后',
    summary:
      '学一餐厅在明湖一层，是很多同学早午晚都会顺路去的基础型食堂。整体风格偏家常，菜品不花哨但很适合日常吃饭，赶课前来一份热菜配米饭很稳。公开上新菜单里出现过二代水煮鱼、三鲜烩肉片这类低油健康菜，适合作为“稳定不踩雷”的首页食堂。',
    rant:
      '平时觉得普通、真赶时间又会第一个想起来的食堂。饭点排队不算轻松，但胜在出餐快。',
    features: ['家常稳定', '出餐快', '价格友好', '适合赶课'],
    signatureDishes: ['二代水煮鱼', '三鲜烩肉片'],
    studentNotes: ['明湖一层比较好找', '午饭高峰建议提前十分钟', '适合日常正餐'],
    introBlocks: [
      {
        title: '食堂印象',
        content: '学一更像交大学生的日常饭点，选择直接，吃完也不耽误后面的课。',
      },
      {
        title: '推荐菜品',
        content: '二代水煮鱼、三鲜烩肉片都是公开上新中出现过的菜，适合放进招牌菜。',
      },
      {
        title: '排队建议',
        content: '12 点左右人会明显变多，想舒服一点可以 11:20 前去。',
      },
    ],
  },
  {
    id: 'minghu',
    name: '明湖餐厅',
    shortName: '明湖',
    image: minghuImg,
    rating: 4.7,
    location: '明湖二层（十八号楼后）',
    openHours: '10:30 - 21:30',
    avgPrice: '人均 ¥14 - ¥20',
    peakQueue: '11:45 - 12:40',
    bestTime: '11:25 前、12:45 后',
    summary:
      '明湖餐厅在明湖二层，适合想换点面食、饼类或者风味小吃的同学。分为八个档口，整体比其他更有“今天想吃点不一样”的感觉。适合做菜品列表页里的风味类食堂。',
    rant:
      '明湖有时候会让人纠结，因为看着都想吃。缺点是高峰期上楼之后发现热门窗口已经排起来了。',
    features: ['风味面食', '小吃丰富', '选择灵活', '适合换口味'],
    signatureDishes: ['云南米线', '炒饭'],
    studentNotes: ['云南米线特别正宗', '面食窗口适合晚饭', '热门小吃饭点排队明显'],
    introBlocks: [
      {
        title: '食堂定位',
        content: '明湖适合做风味餐厅，不只是吃饱，也适合用户来找特色菜。',
      },
      {
        title: '推荐菜品',
        content: '西北面食和牛肉汤都适合做详情页展示菜。',
      },
      {
        title: '体验建议',
        content: '想慢慢选窗口的话，尽量避开刚下课的时间。',
      },
    ],
  },
  {
    id: 'dongkuai',
    name: '东快餐厅',
    shortName: '东快',
    image: dongkuaiImg,
    rating: 4.7,
    location: '明湖二层（十八号楼后）',
    openHours: '10:30 - 21:30',
    avgPrice: '人均 ¥16 - ¥28',
    peakQueue: '11:45 - 12:15',
    bestTime: '11:20 前、12:40 后',
    summary:
      '东快餐厅位于明湖二层，名字听起来像快餐，但实际更偏风味窗口集合。公开上新里有木桶鱼、一纸鸡这类菜，适合想吃热乎、口味重一点的同学。它很适合放在项目里做“风味快餐型”食堂。',
    rant:
      '东快的问题是香味太明显，路过很难不被勾进去。钱包和减肥计划总有一个要妥协。',
    features: ['风味快餐', '口味丰富', '适合聚餐', '菜量扎实'],
    signatureDishes: ['木桶鱼', '一纸鸡'],
    studentNotes: ['明湖二层', '适合想吃重口味时来', '鱼类窗口饭点可能排队'],
    introBlocks: [
      {
        title: '整体印象',
        content: '东快更适合想吃风味菜的同学，比普通打饭更有选择感。',
      },
      {
        title: '推荐菜品',
        content: '木桶鱼、一纸鸡是公开菜单中出现过的真实菜品。',
      },
      {
        title: '使用场景',
        content: '适合午晚餐，也适合朋友一起点不同窗口互相尝。',
      },
    ],
  },
  {
    id: 'xueer',
    name: '学二餐厅',
    shortName: '学二',
    image: xueerImg,
    rating: 4.8,
    location: '学活一层',
    openHours: '06:30 - 22:00',
    avgPrice: '人均 ¥13 - ¥24',
    peakQueue: '11:40 - 12:20',
    bestTime: '11:15 前、12:45 后',
    summary:
      '学二餐厅在学活一层，是学生活动中心附近最顺手的食堂之一。公开菜单里出现过红酸里脊和时蔬干拌面，既有下饭菜也有面食选择。这里适合做项目里的“人气主力食堂”，因为位置、容量和日常属性都很强。',
    rant:
      '学二真的方便，但方便的代价就是饭点人多。你以为自己来得挺早，结果大家都这么想。',
    features: ['位置核心', '人气高', '窗口多', '适合日常'],
    signatureDishes: ['红酸里脊', '时蔬干拌面'],
    studentNotes: ['学活一层', '中午座位紧张', '适合赶活动或社团前吃'],
    introBlocks: [
      {
        title: '食堂印象',
        content: '学二是很典型的学生主力食堂，适合高频出现在首页推荐。',
      },
      {
        title: '推荐菜品',
        content: '红酸里脊适合配饭，时蔬干拌面适合想吃清爽一点的时候。',
      },
      {
        title: '排队建议',
        content: '11:40 后人流开始明显增加，12 点左右最挤。',
      },
    ],
  },
  {
    id: 'xuesan',
    name: '学生三餐厅',
    shortName: '学三',
    image: xuesanImg,
    rating: 4.5,
    location: '学活二层',
    openHours: '10:30 - 21:30',
    avgPrice: '人均 ¥14 - ¥25',
    peakQueue: '11:45 - 12:15',
    bestTime: '11:20 前、12:40 后',
    summary:
      '学生三餐厅在学活二层，后勤通知中也把它列为主校区餐厅。它适合和学二形成楼层联动：学二人多时可以上楼看看学三。项目里可以把它定位为学活区域的补充型风味餐厅。',
    rant:
      '有时候不是一开始就想去学三，而是学二太挤了才上楼。结果吃完发现，其实也挺香。',
    features: ['学活二层', '风味补充', '选择灵活', '适合错峰'],
    signatureDishes: ['风味盖饭', '干拌面', '小炒套餐'],
    studentNotes: ['学二排队长时可上楼', '适合午晚餐', '具体窗口可后续再细分'],
    introBlocks: [
      {
        title: '食堂定位',
        content: '学三适合和学二一起作为学活片区的数据展示。',
      },
      {
        title: '点餐建议',
        content: '可以按窗口类型补充盖饭、面食、小炒等菜品。',
      },
      {
        title: '数据备注',
        content: '公开资料能确认餐厅存在和位置，具体菜品建议后续校内实拍补全。',
      },
    ],
  },
  {
    id: 'qingzhen',
    name: '清真餐厅',
    shortName: '清真',
    image: qingzhenImg,
    rating: 4.7,
    location: '学活三层',
    openHours: '06:30 - 21:30',
    avgPrice: '人均 ¥15 - ¥28',
    peakQueue: '11:40 - 12:15',
    bestTime: '11:15 前、12:40 后',
    summary:
      '清真餐厅位于学活三层，主要服务有清真饮食需求的师生，也适合想换口味的同学。位置和功能都很明确，项目里建议单独建食堂条目，不要混进普通学活餐厅。',
    rant:
      '清真餐厅属于目标很明确的选择，想吃的时候会专门上三层。饭点热门窗口也会排队。',
    features: ['清真餐饮', '学活三层', '需求明确', '正餐友好'],
    signatureDishes: ['牛肉类套餐', '羊肉丸子', '清真盖饭'],
    studentNotes: ['尊重清真餐饮规范', '适合单独筛选', '饭点建议提前'],
    introBlocks: [
      {
        title: '餐厅特色',
        content: '清真餐厅适合有清真饮食需求的师生，也适合想换口味的人。',
      },
      {
        title: '页面建议',
        content: '建议在筛选项里增加“清真”标签，方便用户快速找到。',
      },
      {
        title: '用餐提示',
        content: '午饭高峰排队明显，建议提前或错峰。',
      },
    ],
  },
  {
    id: 'xuesi',
    name: '学四餐厅',
    shortName: '学四',
    image: xuesiImg,
    rating: 4.7,
    location: '嘉园东侧',
    openHours: '06:30 - 21:30',
    avgPrice: '人均 ¥13 - ¥25',
    peakQueue: '11:45 - 12:10',
    bestTime: '11:20 前、12:35 后',
    summary:
      '学四餐厅位于嘉园东侧，是宿舍区附近很有存在感的食堂。公开上新菜品里有墩子肉、菠萝鱼，风格偏家常但也有记忆点。适合做“宿舍附近常去”的食堂条目。',
    rant:
      '学四就是那种吃久了会有感情的地方。它不一定每次惊艳，但你饿的时候它很可靠。',
    features: ['靠近嘉园', '家常实在', '学生常去', '性价比高'],
    signatureDishes: ['墩子肉', '菠萝鱼'],
    studentNotes: ['嘉园附近同学常去', '中午座位紧张', '晚饭体验更舒服'],
    introBlocks: [
      {
        title: '食堂印象',
        content: '学四适合写成“生活感很强”的食堂，真实感会比较好。',
      },
      {
        title: '推荐菜品',
        content: '墩子肉和菠萝鱼都来自公开上新菜单。',
      },
      {
        title: '排队建议',
        content: '中午高峰要么早点来，要么干脆 12:35 后再来。',
      },
    ],
  },
  {
    id: 'xuesi_fengwei',
    name: '学四风味餐厅',
    shortName: '学四风味',
    image: xuesiFengweiImg,
    rating: 4.6,
    location: '学四二层',
    openHours: '10:30 - 21:30',
    avgPrice: '人均 ¥15 - ¥28',
    peakQueue: '11:45 - 12:15',
    bestTime: '11:20 前、12:45 后',
    summary:
      '学四风味餐厅在后勤通知中出现，位置为学四二层。它适合和学四餐厅区分开：一层偏日常正餐，二层偏风味选择。项目里可以把它做成同一区域下的另一个食堂卡片。',
    rant:
      '学四风味适合“不想吃普通饭”的时候去。缺点是饭点上二层也不一定能逃过排队。',
    features: ['风味窗口', '学四二层', '适合换口味', '选择多'],
    signatureDishes: ['风味面食', '盖饭套餐', '特色小吃'],
    studentNotes: ['和学四餐厅分开建数据', '适合晚饭', '菜品后续可按窗口补充'],
    introBlocks: [
      {
        title: '数据定位',
        content: '建议不要和学四餐厅合并，风味餐厅可以独立展示。',
      },
      {
        title: '推荐场景',
        content: '适合想换口味，但又不想走远的嘉园附近同学。',
      },
      {
        title: '备注',
        content: '具体菜品需要后续按窗口继续采集。',
      },
    ],
  },
  {
    id: 'liuyuan',
    name: '留园餐厅',
    shortName: '留园',
    image: liuyuanImg,
    rating: 4.8,
    location: '学四北侧',
    openHours: '10:30 - 20:00',
    avgPrice: '人均 ¥18 - ¥35',
    peakQueue: '11:45 - 12:20',
    bestTime: '12:45 后、17:30 前',
    summary:
      '留园餐厅位于学四北侧，它的菜品相对更精致，公开上新中出现过柠檬猪手、川味凉粉鸡。适合项目里做“品质更高、价格略高”的食堂。',
    rant:
      '留园好吃是好吃，就是钱包也会更有感觉。适合偶尔改善伙食，不太适合天天无脑冲。',
    features: ['菜品精致', '环境较安静', '价格略高', '适合改善伙食'],
    signatureDishes: ['柠檬猪手', '川味凉粉鸡'],
    studentNotes: ['非常清淡', '中午只允许教工用餐', '适合错峰体验'],
    introBlocks: [
      {
        title: '食堂印象',
        content: '留园非常清淡、健康，但是价格较贵',
      },
      {
        title: '推荐菜品',
        content: '柠檬猪手和川味凉粉鸡都是公开上新菜品。',
      },
      {
        title: '使用提示',
        content: '注意：只有晚上给学生开放”。',
      },
    ],
  },
  {
    id: 'jiaogong',
    name: '教工餐厅',
    shortName: '教工',
    image: jiaogongImg,
    rating: 4.7,
    location: '留园北侧',
    openHours: '10:30 - 20:00',
    avgPrice: '人均 ¥18 - ¥36',
    peakQueue: '11:40 - 12:20',
    bestTime: '12:45 后、17:20 前',
    summary:
      '教工餐厅位于留园北侧，属性上更偏教职工餐厅，但也适合做“精致健康、价格略高”的特殊餐厅展示。',
    rant:
      '教工餐厅看起来总有一种“今天吃得正式一点”的感觉。学生去之前最好先确认开放时间。',
    features: ['偏教工属性', '菜品精致', '低油低盐', '价格略高'],
    signatureDishes: ['泰汁鱼条', '鲁大仙鸡腿'],
    studentNotes: ['留园北侧', '开放情况以校内通知为准', '适合改善伙食'],
    introBlocks: [
      {
        title: '餐厅定位',
        content: '教工餐厅建议在数据里标注为偏教工属性，避免学生误解为全天普通开放。',
      },
      {
        title: '推荐菜品',
        content: '泰汁鱼条、鲁大仙鸡腿可作为真实菜品展示。',
      },
      {
        title: '页面提示',
        content: '详情页可加入“部分时段可能面向教职工”的提示。',
      },
    ],
  },
  {
    id: 'xueyuan_dahuo',
    name: '学苑大伙餐厅',
    shortName: '学苑大伙',
    image: xueyuanDahuoImg,
    rating: 4.8,
    location: '学苑大门左拐',
    openHours: '06:30 - 21:30',
    avgPrice: '人均 ¥13 - ¥25',
    peakQueue: '11:45 - 12:20',
    bestTime: '11:20 前、12:50 后',
    summary:
      '学苑大伙餐厅位于学苑大门左拐，是学苑片区的基础型食堂。公开上新菜单里出现过小碗杂粮饭、鲜果脆皮肉，既有健康主食也有酸甜口热菜。适合研究生、公寓区同学日常就餐。',
    rant:
      '学苑大伙就是那种住得近会经常吃的地方。菜不一定每天都惊喜，但离得近这件事太加分了。',
    features: ['学苑片区', '日常正餐', '主食友好', '适合常吃'],
    signatureDishes: ['小碗杂粮饭', '鲜果脆皮肉'],
    studentNotes: ['学苑大门左拐', '适合学苑公寓同学', '饭点建议错峰'],
    introBlocks: [
      {
        title: '食堂印象',
        content: '学苑大伙适合做学苑片区的主力食堂。',
      },
      {
        title: '推荐菜品',
        content: '小碗杂粮饭和鲜果脆皮肉来自公开上新菜单。',
      },
      {
        title: '使用场景',
        content: '适合日常三餐，尤其适合住在学苑附近的同学。',
      },
    ],
  },
  {
    id: 'xueyuan_qingzhen',
    name: '学苑清真餐厅',
    shortName: '学苑清真',
    image: xueyuanQingzhenImg,
    rating: 4.8,
    location: '学苑大门左拐',
    openHours: '06:30 - 21:30',
    avgPrice: '人均 ¥15 - ¥28',
    peakQueue: '11:45 - 12:15',
    bestTime: '11:20 前、12:45 后',
    summary:
      '学苑清真餐厅属于学苑片区的清真餐饮选择。公开菜单里出现过烩羊肉丸子和春饼套餐，适合有清真饮食需求的同学，也适合想在学苑附近换口味的人。',
    rant:
      '学苑清真很适合固定需求的同学收藏，住学苑附近的话会觉得特别方便。',
    features: ['清真餐饮', '学苑片区', '正餐友好', '需求明确'],
    signatureDishes: ['烩羊肉丸子', '春饼套餐'],
    studentNotes: ['注意清真餐饮规范', '适合单独加标签', '饭点建议提前'],
    introBlocks: [
      {
        title: '餐厅特色',
        content: '学苑清真建议单独建数据，不要并入学苑大伙。',
      },
      {
        title: '推荐菜品',
        content: '烩羊肉丸子、春饼套餐可作为真实菜品。',
      },
      {
        title: '页面建议',
        content: '可以加“清真”“学苑片区”“正餐”三个标签。',
      },
    ],
  },
  {
    id: 'xueyuan_xican',
    name: '学苑西餐厅',
    shortName: '学苑西餐',
    image: xueyuanXicanImg,
    rating: 4.6,
    location: '学苑大门左拐',
    openHours: '10:30 - 20:30',
    avgPrice: '人均 ¥16 - ¥32',
    peakQueue: '11:50 - 12:20',
    bestTime: '11:30 前、13:00 后',
    summary:
      '学苑西餐厅位于学苑片区，公开上新菜单中出现过司康糕点、金牌黄油面包。它适合做轻食、面包、简餐类餐厅，和普通大伙饭区分明显。页面上可以做得更年轻一点。',
    rant:
      '学苑西餐适合想吃点“不像食堂饭”的时候去，但真饿的时候可能还是会想加点主食。',
    features: ['西式简餐', '面包糕点', '适合轻食', '学苑片区'],
    signatureDishes: ['司康糕点', '金牌黄油面包'],
    studentNotes: ['适合下午加餐', '价格略高于普通大伙', '可以做轻食分类'],
    introBlocks: [
      {
        title: '食堂定位',
        content: '学苑西餐厅适合作为轻食/西式简餐类餐厅展示。',
      },
      {
        title: '推荐菜品',
        content: '司康糕点和金牌黄油面包是公开上新菜单中出现过的品类。',
      },
      {
        title: '页面建议',
        content: '可以在详情页里突出“下午加餐”“面包糕点”“轻食”。',
      },
    ],
  },
  {
    id: 'dongqu',
    name: '东区餐厅',
    shortName: '东区',
    image: dongquImg,
    rating: 4.6,
    location: '东区操场西侧',
    openHours: '07:00 - 21:30',
    avgPrice: '人均 ¥13 - ¥18',
    peakQueue: '11:45 - 12:15',
    bestTime: '11:20 前、12:40 后',
    summary:
      '东区餐厅位于东区操场西侧，是东校区同学最方便的日常食堂。热门档口有烤盘饭和小份菜，适合做东校区基础食堂。它的核心优势不是网红，而是近、快、稳定。',
    rant:
      '对东区同学来说就是刚需。不是每次都惊艳，但下楼能吃上热饭就很重要。',
    features: ['东校区', '距离方便', '日常稳定', '正餐小吃都有'],
    signatureDishes: ['蜜雪冰城', '麻辣烫'],
    studentNotes: ['东区操场西侧', '适合东校区同学', '午饭高峰人多'],
    introBlocks: [
      {
        title: '食堂印象',
        content: '东区餐厅适合做东校区主力食堂，强调便利和稳定。',
      },
      {
        title: '推荐菜品',
        content: '小份菜味道不错，还有蜜雪冰城',
      },
      {
        title: '使用场景',
        content: '适合日常三餐，尤其适合不想跑主校区和点外卖的同学。',
      },
    ],
  },
  {
    id: 'dongqu_qingzhen',
    name: '东区清真餐厅',
    shortName: '东区清真',
    image: dongquQingzhenImg,
    rating: 4.7,
    location: '东区餐厅东北侧一层',
    openHours: '06:30 - 21:30',
    avgPrice: '人均 ¥15 - ¥28',
    peakQueue: '11:45 - 12:15',
    bestTime: '11:20 前、12:45 后',
    summary:
      '东区清真餐厅位于东区餐厅东北侧一层，是东区的清真餐饮选择。公开菜单里出现过豆花时蔬和牛肉爆三丁，适合做清真与东校区双标签。对于住在东区、有清真饮食需求的同学来说很实用。',
    rant:
      '东区清真胜在不用跨校区找清真餐。饭点排队有，但比跑远路强多了。',
    features: ['东区清真', '位置明确', '牛肉菜品', '正餐友好'],
    signatureDishes: ['豆花时蔬', '牛肉爆三丁'],
    studentNotes: ['东区餐厅东北侧一层', '适合清真需求用户筛选', '午餐建议提前'],
    introBlocks: [
      {
        title: '餐厅特色',
        content: '东区清真餐厅适合在筛选里同时打上“东区”和“清真”标签。',
      },
      {
        title: '推荐菜品',
        content: '豆花时蔬、牛肉爆三丁可作为真实菜品展示。',
      },
      {
        title: '页面提示',
        content: '建议和东区餐厅分开建条目，方便用户按饮食需求查找。',
      },
    ],
  },
  {
    id: 'yimin',
    name: '益民餐厅',
    shortName: '益民',
    image: yiminImg,
    rating: 4.4,
    location: '明湖东侧家属区内 / 主校区东门外',
    openHours: '10:30 - 19:30',
    avgPrice: '人均 ¥16 - ¥30',
    peakQueue: '11:45 - 12:30',
    bestTime: '11:25 前、12:40 后',
    summary:
      '益民餐厅位置与家属区内，相较于学生食堂，更像社区型餐厅，有小吃和点菜两种形式，明档现钞、锅气十足',
    rant:
      '益民不是最热闹的学生食堂，但胜在人少一点、节奏慢一点。适合不想挤大食堂的时候去。',
    features: ['家属区附近', '相对安静', '适合点菜', '人流较稳'],
    signatureDishes: ['家常小炒', '盖饭套餐', '炸串'],
    studentNotes: ['东北菜', '适合错峰', '位置别和明湖主楼混淆'],
    introBlocks: [
      {
        title: '食堂定位',
        content: '益民餐厅适合做家属区附近的补充型餐厅。',
      },
      {
        title: '推荐菜品',
        content: '有很多经典东北菜，锅包肉、溜肉段都很好吃',
      },
      {
        title: '备注',
        content: '点菜后记得报桌号',
      },
    ],
  },
];

const HOME_CANTEEN_SPOT_IDS = [
  'xueyi',
  'minghu',
  'dongkuai',
  'xueer',
  'qingzhen',
  'xuesi',
  'liuyuan',
  'jiaogong',
  'dongqu',
  'yimin',
];

function getLowestPrice(avgPrice) {
  const matched = avgPrice.match(/¥(\d+)/);
  return matched ? Number(matched[1]) : 0;
}

function createHomeCanteenSpot(canteen, index) {
  return {
    id: `${canteen.id}-spot`,
    canteenId: canteen.id,
    name: canteen.name,
    image: canteen.image,
    rating: canteen.rating,
    price: getLowestPrice(canteen.avgPrice),
    valueNote: canteen.features[1] ?? canteen.features[0],
    stamp: '',
    comment: canteen.rant,
    recommendVotes: null,
    avoidVotes: null,
    sortOrder: index + 1,
  };
}

export const HOME_CANTEEN_SPOTS = HOME_CANTEEN_SPOT_IDS.map((id, index) =>
  {
    const canteen = CANTEENS.find(item => item.id === id);
    return canteen ? createHomeCanteenSpot(canteen, index) : null;
  }
).filter(Boolean);

export const HOME_RANKINGS = [
  {
    rank: 1,
    dishId: 'braised-beef-noodle',
    canteenId: 'xueer',
    dishName: '红烧牛肉面',
    score: 4.9,
    stamp: '必吃',
    recommendVotes: 188,
    avoidVotes: 9,
  },
  {
    rank: 2,
    dishId: 'black-pepper-chicken',
    canteenId: 'dongkuai',
    dishName: '黑椒鸡腿饭',
    score: 4.8,
    stamp: '必吃',
    recommendVotes: 170,
    avoidVotes: 13,
  },
  {
    rank: 3,
    dishId: 'tomato-beef-rice',
    canteenId: 'jiaogong',
    dishName: '番茄肥牛饭',
    score: 4.8,
    stamp: '必吃',
    recommendVotes: 165,
    avoidVotes: 15,
  },
  {
    rank: 4,
    dishId: 'sour-soup-rice-noodle',
    canteenId: 'minghu',
    dishName: '酸汤米线',
    score: 4.7,
    stamp: '推荐',
    recommendVotes: 142,
    avoidVotes: 18,
  },
  {
    rank: 5,
    dishId: 'beef-claypot-rice',
    canteenId: 'liuyuan',
    dishName: '牛肉煲仔饭',
    score: 4.7,
    stamp: '推荐',
    recommendVotes: 130,
    avoidVotes: 22,
  },
  {
    rank: 6,
    dishId: 'spicy-hot-pot',
    canteenId: 'xuesi',
    dishName: '麻辣香锅',
    score: 4.6,
    stamp: '推荐',
    recommendVotes: 124,
    avoidVotes: 33,
  },
  {
    rank: 7,
    dishId: 'mushroom-chicken-rice',
    canteenId: 'xueyi',
    dishName: '香菇滑鸡饭',
    score: 4.6,
    stamp: '推荐',
    recommendVotes: 113,
    avoidVotes: 24,
  },
  {
    rank: 8,
    dishId: 'vine-pepper-noodle',
    canteenId: 'dongqu',
    dishName: '藤椒鸡丝拌面',
    score: 4.6,
    stamp: '推荐',
    recommendVotes: 108,
    avoidVotes: 28,
  },
  {
    rank: 9,
    dishId: 'kungpao-chicken-rice',
    canteenId: 'xueyuan_dahuo',
    dishName: '宫保鸡丁盖饭',
    score: 4.5,
    stamp: '推荐',
    recommendVotes: 95,
    avoidVotes: 39,
  },
  {
    rank: 10,
    dishId: 'chicken-salad-bowl',
    canteenId: 'xueyuan_xican',
    dishName: '轻盈鸡胸沙拉碗',
    score: 4.5,
    stamp: '推荐',
    recommendVotes: 86,
    avoidVotes: 34,
  },
];
