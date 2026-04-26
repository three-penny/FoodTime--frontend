// @author Codex

import beefClaypotRiceImage from '../assets/images/dishs/煲仔饭.webp';
import tomatoBeefRiceImage from '../assets/images/dishs/番茄肥牛饭.jpg';
import braisedBeefNoodleImage from '../assets/images/dishs/红烧牛肉面.jpg';
import sourSoupRiceNoodleImage from '../assets/images/dishs/酸汤米线.png';
import blackPepperChickenImage from '../assets/images/dishs/黑胶鸡腿饭.png';
import { CANTEENS } from './canteens.mock';

const DISH_IDS = [
  'braised-beef-noodle',
  'black-pepper-chicken',
  'spicy-hot-pot',
  'tomato-beef-rice',
  'chicken-salad-bowl',
  'mushroom-chicken-rice',
  'sour-soup-rice-noodle',
  'vine-pepper-noodle',
  'beef-claypot-rice',
  'kungpao-chicken-rice',
  'tomato-egg-noodle',
  'crispy-fish-rice',
];

const DISH_IMAGES = [
  braisedBeefNoodleImage,
  blackPepperChickenImage,
  tomatoBeefRiceImage,
  beefClaypotRiceImage,
  sourSoupRiceNoodleImage,
];

const DISH_IMAGE_BY_NAME = {
  红烧牛肉面: braisedBeefNoodleImage,
  黑椒鸡腿饭: blackPepperChickenImage,
  麻辣香锅: beefClaypotRiceImage,
  番茄肥牛饭: tomatoBeefRiceImage,
  鸡胸沙拉碗: tomatoBeefRiceImage,
  香菇鸡肉饭: blackPepperChickenImage,
  酸汤米线: sourSoupRiceNoodleImage,
  藤椒鸡丝面: sourSoupRiceNoodleImage,
  牛肉煲仔饭: beefClaypotRiceImage,
  宫保鸡丁饭: blackPepperChickenImage,
  番茄鸡蛋面: tomatoBeefRiceImage,
  酥皮鱼排饭: beefClaypotRiceImage,
};

// 用户后续录入菜品时，只需要维护这里的 5 个字段：
// 菜名 name、所在餐厅 canteenId、档口 stall、打分 rating、点评 comment。
const DISH_FORM_ROWS = [
  {
    name: '红烧牛肉面',
    canteenId: 'xueyuan_dahuo',
    stall: '一碗顶一顿',
    rating: 4.9,
    comment: '阿姨今天给肉给得很实在，记住这班人。',
  },
  {
    name: '黑椒鸡腿饭',
    canteenId: 'xueyuan_dahuo',
    stall: '肉量够狠',
    rating: 4.8,
    comment: '别在 12 点后去，晚 10 分钟就得排半小时。',
  },
  {
    name: '麻辣香锅',
    canteenId: 'xuesi',
    stall: '自选热锅',
    rating: 4.6,
    comment: '挑菜别贪多，称重那一刻会心痛。',
  },
  {
    name: '番茄肥牛饭',
    canteenId: 'jiaogong',
    stall: '酸甜稳妥',
    rating: 4.8,
    comment: '课间冲过去五分钟拿到，效率党福音。',
  },
  {
    name: '鸡胸沙拉碗',
    canteenId: 'jiaogong',
    stall: '轻食窗口',
    rating: 4.5,
    comment: '健身搭子聚会指定款。',
  },
  {
    name: '香菇鸡肉饭',
    canteenId: 'xueyi',
    stall: '家常盖饭',
    rating: 4.6,
    comment: '饿狠了就点这份，基本不会后悔。',
  },
  {
    name: '酸汤米线',
    canteenId: 'qingzhen',
    stall: '夜宵首选',
    rating: 4.7,
    comment: '考试周晚上最常见的“续命套餐”。',
  },
  {
    name: '藤椒鸡丝面',
    canteenId: 'dongqu',
    stall: '清爽麻香',
    rating: 4.6,
    comment: '第一口平平，后劲很上头。',
  },
  {
    name: '牛肉煲仔饭',
    canteenId: 'liuyuan',
    stall: '锅气略贵',
    rating: 4.7,
    comment: '锅底脆感看师傅手法，偶尔会翻车。',
  },
  {
    name: '宫保鸡丁饭',
    canteenId: 'dongkuai',
    stall: '下饭小炒',
    rating: 4.5,
    comment: '分量看心情，遇到手稳阿姨能开心一整天。',
  },
  {
    name: '番茄鸡蛋面',
    canteenId: 'minghu',
    stall: '热汤面',
    rating: 4.3,
    comment: '考试周压力大时，别对它期待太高。',
  },
  {
    name: '酥皮鱼排饭',
    canteenId: 'xuesi',
    stall: '炸物窗口',
    rating: 4.4,
    comment: '运气好是惊喜，运气差是复盘素材。',
  },
];

function getCanteenName(canteenId) {
  return CANTEENS.find(canteen => canteen.id === canteenId)?.name ?? '未知餐厅';
}

function getDishImage(row, index) {
  return DISH_IMAGE_BY_NAME[row.name] ?? DISH_IMAGES[index % DISH_IMAGES.length];
}

function createDish(row, index) {
  return {
    id: DISH_IDS[index] ?? `dish-${index + 1}`,
    ...row,
    canteenName: getCanteenName(row.canteenId),
    image: getDishImage(row, index),
    description: row.comment,
    valueNote: row.stall,
    price: null,
    monthlySales: null,
    tags: [],
  };
}

export const DISHES = DISH_FORM_ROWS.map(createDish);

export const HOME_RECOMMENDATION_IDS = DISHES.map(dish => dish.id);
