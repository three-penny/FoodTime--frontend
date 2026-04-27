// @author Codex

import stallImage1 from '../assets/images/stalls/档口01.webp';
import stallImage2 from '../assets/images/stalls/档口02.jpg';

const STALL_IMAGES = [stallImage1, stallImage2];

const defaultStalls = [
  {
    id: 'northwest-noodles',
    name: '西北面食',
    avgPrice: '¥12 - ¥20',
    bestTime: '11:20 前',
    summary: '主打热汤面、拌面和筋道面食，适合想吃一碗扎实主食的时候。',
    dishes: [
      {
        name: '油泼扯面',
        rating: 4.9,
        price: 15,
        comment: '辣香够直，面条筋道，适合赶课前快速补能量。',
      },
      {
        name: '牛肉拉面',
        rating: 4.8,
        price: 18,
        comment: '汤底清亮，牛肉片给得稳，冬天很加分。',
      },
      {
        name: '臊子面',
        rating: 4.7,
        price: 14,
        comment: '酸香开胃，饭点排队也值得等一小会儿。',
      },
      {
        name: '孜然羊肉拌面',
        rating: 4.6,
        price: 20,
        comment: '香味很冲，适合想吃重口味的晚上。',
      },
    ],
  },
  {
    id: 'fei-uncle-hunan',
    name: '费大叔湘菜',
    avgPrice: '¥16 - ¥26',
    bestTime: '12:40 后',
    summary: '偏下饭的小炒窗口，辣度直接，适合米饭党和重口味同学。',
    dishes: [
      {
        name: '小炒黄牛肉饭',
        rating: 4.9,
        price: 24,
        comment: '锅气足，辣度醒神，下午课不会犯困。',
      },
      {
        name: '农家一碗香',
        rating: 4.8,
        price: 22,
        comment: '鸡蛋和肉片都下饭，是窗口里的稳定选项。',
      },
      {
        name: '剁椒鸡腿饭',
        rating: 4.7,
        price: 21,
        comment: '剁椒香气明显，鸡腿比预期更嫩。',
      },
      {
        name: '湘味豆角肉末饭',
        rating: 4.5,
        price: 18,
        comment: '价格友好，适合不想花太多的时候。',
      },
    ],
  },
  {
    id: 'shandong-cuisine',
    name: '山东菜',
    avgPrice: '¥13 - ¥22',
    bestTime: '11:30 前',
    summary: '口味偏家常，菜量实在，适合想吃热菜配米饭的日常正餐。',
    dishes: [
      {
        name: '葱烧豆腐饭',
        rating: 4.8,
        price: 14,
        comment: '豆腐入味，葱香很稳，性价比不错。',
      },
      {
        name: '酱爆鸡丁饭',
        rating: 4.7,
        price: 19,
        comment: '咸香下饭，适合不知道吃什么的时候点。',
      },
      {
        name: '糖醋里脊饭',
        rating: 4.6,
        price: 21,
        comment: '酸甜口明显，外壳脆度看出锅时间。',
      },
      {
        name: '白菜粉条炖肉',
        rating: 4.5,
        price: 18,
        comment: '热乎朴素，适合冷天慢慢吃。',
      },
    ],
  },
  {
    id: 'yunnan-fried-rice',
    name: '云南炒饭',
    avgPrice: '¥12 - ¥19',
    bestTime: '13:00 后',
    summary: '炒饭出餐快，香气足，是赶时间但又想吃热乎饭的选择。',
    dishes: [
      {
        name: '云腿鸡蛋炒饭',
        rating: 4.8,
        price: 16,
        comment: '火腿咸香明显，米粒粒粒分明。',
      },
      {
        name: '菌菇牛肉炒饭',
        rating: 4.7,
        price: 19,
        comment: '菌香和牛肉都在线，适合当晚饭。',
      },
      {
        name: '酸菜肉末炒饭',
        rating: 4.6,
        price: 15,
        comment: '酸菜提味，越吃越顺口。',
      },
      {
        name: '番茄鸡蛋炒饭',
        rating: 4.4,
        price: 13,
        comment: '清爽不腻，适合想吃轻一点的时候。',
      },
    ],
  },
  {
    id: 'yunnan-rice-noodle',
    name: '云南米线',
    avgPrice: '¥14 - ¥24',
    bestTime: '晚饭错峰',
    summary: '米线汤底选择多，酸汤和菌汤都适合做晚课后的热汤补给。',
    dishes: [
      {
        name: '酸汤肥牛米线',
        rating: 4.9,
        price: 23,
        comment: '酸香开胃，肥牛量稳定，是窗口王牌。',
      },
      {
        name: '番茄牛肉米线',
        rating: 4.8,
        price: 22,
        comment: '汤底浓但不腻，适合不吃辣的同学。',
      },
      {
        name: '菌菇鸡汤米线',
        rating: 4.7,
        price: 20,
        comment: '鲜味柔和，晚饭吃很舒服。',
      },
      {
        name: '麻辣小锅米线',
        rating: 4.5,
        price: 18,
        comment: '辣感直接，适合想出汗的时候。',
      },
    ],
  },
  {
    id: 'grilled-pork-belly',
    name: '炙烤五花肉',
    avgPrice: '¥18 - ¥28',
    bestTime: '11:15 前',
    summary: '焦香肉类窗口，适合想吃烤肉饭、拌饭和高蛋白正餐的时候。',
    dishes: [
      {
        name: '炙烤五花肉饭',
        rating: 4.9,
        price: 26,
        comment: '焦边香气明显，配泡菜刚好解腻。',
      },
      {
        name: '黑椒鸡腿双拼饭',
        rating: 4.8,
        price: 25,
        comment: '肉量足，适合训练后补一顿。',
      },
      {
        name: '蒜香烤肉拌饭',
        rating: 4.7,
        price: 23,
        comment: '蒜香很上头，拌开后每口都有味。',
      },
      {
        name: '照烧肥牛饭',
        rating: 4.6,
        price: 24,
        comment: '甜咸口稳定，适合不想踩雷的时候。',
      },
    ],
  },
  {
    id: 'xiaogu-malaban',
    name: '小谷姐姐麻辣烫',
    avgPrice: '¥16 - ¥30',
    bestTime: '避开 12:00',
    summary: '自选称重窗口，丰俭由人，适合想自己控制菜量和口味的时候。',
    dishes: [
      {
        name: '招牌麻辣烫',
        rating: 4.8,
        price: 24,
        comment: '汤底香，丸子和青菜搭配很稳。',
      },
      {
        name: '番茄骨汤麻辣烫',
        rating: 4.7,
        price: 23,
        comment: '番茄汤底更柔和，不吃辣也能点。',
      },
      {
        name: '麻酱拌烫菜',
        rating: 4.6,
        price: 22,
        comment: '麻酱浓，适合想吃干拌口的时候。',
      },
      {
        name: '藤椒清汤烫菜',
        rating: 4.5,
        price: 21,
        comment: '藤椒香气清爽，吃完负担小。',
      },
    ],
  },
  {
    id: 'beef-soup',
    name: '牛肉汤',
    avgPrice: '¥15 - ¥25',
    bestTime: '早餐后段',
    summary: '热汤窗口，主打牛肉汤、粉丝和烧饼搭配，适合早午餐过渡。',
    dishes: [
      {
        name: '原汤牛肉粉丝',
        rating: 4.8,
        price: 18,
        comment: '汤头热乎，粉丝吸味，早课后很合适。',
      },
      {
        name: '牛肉汤配烧饼',
        rating: 4.7,
        price: 20,
        comment: '汤和烧饼组合扎实，一份能顶很久。',
      },
      {
        name: '番茄牛肉汤饭',
        rating: 4.6,
        price: 22,
        comment: '酸甜汤底配米饭，适合胃口一般的时候。',
      },
      {
        name: '萝卜牛腩汤',
        rating: 4.5,
        price: 24,
        comment: '萝卜吸汤，牛腩软烂度看当天火候。',
      },
    ],
  },
  {
    id: 'cotti-coffee',
    name: '库迪咖啡',
    avgPrice: '¥9 - ¥18',
    bestTime: '下午 15:00',
    summary: '咖啡和轻食补给点，适合自习、赶作业或饭后买一杯提神。',
    dishes: [
      {
        name: '生椰拿铁',
        rating: 4.8,
        price: 13,
        comment: '椰香明显，冰杯更适合下午提神。',
      },
      {
        name: '厚乳拿铁',
        rating: 4.7,
        price: 12,
        comment: '奶感重，适合不想喝太苦的时候。',
      },
      {
        name: '美式咖啡',
        rating: 4.6,
        price: 9,
        comment: '直接、便宜、提神，适合ddl前。',
      },
      {
        name: '火腿芝士可颂',
        rating: 4.4,
        price: 16,
        comment: '适合垫肚子，不建议当正餐主力。',
      },
    ],
  },
];

function createLongStudentComment(dish, stall, canteenName) {
  return `${dish.comment} 我会把它放在${canteenName}${stall.name}的稳定备选里：味道记忆点明确，出餐速度和价格都比较平衡，饭点排队能接受；如果想吃刚出锅的口感，建议错开最高峰再去。`;
}

/**
 * 为任意食堂生成默认档口数据。
 * @param {Object} canteen 食堂基础信息
 * @param {string} canteen.id 食堂 ID
 * @param {string} canteen.name 食堂名称
 * @returns {Array<Object>} 可直接用于食堂详情页渲染的档口列表
 */
export function createDefaultCanteenStalls(canteen) {
  if (!canteen) {
    return [];
  }

  return defaultStalls.map((stall, stallIndex) => {
    const stallImage = STALL_IMAGES[stallIndex % STALL_IMAGES.length];

    return {
      ...stall,
      image: stallImage,
      canteenId: canteen.id,
      dishes: stall.dishes.map((dish, index) => ({
        id: `${canteen.id}-${stall.id}-${index + 1}`,
        ...dish,
        comment: createLongStudentComment(dish, stall, canteen.name),
        canteenId: canteen.id,
        canteenName: canteen.name,
        stall: stall.name,
        image: stallImage,
        description: createLongStudentComment(dish, stall, canteen.name),
        monthlySales: null,
        tags: [stall.name],
      })),
    };
  });
}
