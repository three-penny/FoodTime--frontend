import canteen1 from '../assets/images/canteen/食堂1.png';
import canteen2 from '../assets/images/canteen/食堂2.png';
import canteen3 from '../assets/images/canteen/食堂3.png';
import canteen4 from '../assets/images/canteen/食堂4.png';
import canteen5 from '../assets/images/canteen/食堂5.png';
import canteen6 from '../assets/images/canteen/食堂6.png';

import stall1 from '../assets/images/stalls/档口01.webp';
import stall2 from '../assets/images/stalls/档口02.jpg';

import dishBraisedBeef from '../assets/images/dishs/红烧牛肉面.jpg';
import dishBlackPepper from '../assets/images/dishs/黑胶鸡腿饭.png';
import dishTomatoBeef from '../assets/images/dishs/番茄肥牛饭.jpg';
import dishBeefClaypot from '../assets/images/dishs/煲仔饭.webp';
import dishSourSoup from '../assets/images/dishs/酸汤米线.png';

const CANTEEN_IMAGE_MAP = {
  '食堂1.png': canteen1,
  '食堂2.png': canteen2,
  '食堂3.png': canteen3,
  '食堂4.png': canteen4,
  '食堂5.png': canteen5,
  '食堂6.png': canteen6,
};

const STALL_IMAGE_MAP = {
  '档口01.webp': stall1,
  '档口02.jpg': stall2,
};

const DISH_IMAGE_MAP = {
  '红烧牛肉面.jpg': dishBraisedBeef,
  '黑胶鸡腿饭.png': dishBlackPepper,
  '番茄肥牛饭.jpg': dishTomatoBeef,
  '煲仔饭.webp': dishBeefClaypot,
  '酸汤米线.png': dishSourSoup,
};

export function resolveCanteenImage(imageUrl) {
  return CANTEEN_IMAGE_MAP[imageUrl] || CANTEEN_IMAGE_MAP['食堂1.png'];
}

export function resolveStallImage(imageUrl) {
  return STALL_IMAGE_MAP[imageUrl] || STALL_IMAGE_MAP['档口01.webp'];
}

export function resolveDishImage(imageUrl) {
  return DISH_IMAGE_MAP[imageUrl] || DISH_IMAGE_MAP['番茄肥牛饭.jpg'];
}
