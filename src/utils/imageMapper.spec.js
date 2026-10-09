import { describe, expect, it } from 'vitest';
import { resolveDishImage } from './imageMapper';
import { DISHES } from '../mock/dishes.mock';
import braisedBeefImage from '../assets/images/dishs/红烧牛肉面.jpg';
import tomatoBeefImage from '../assets/images/dishs/番茄肥牛饭.jpg';

describe('resolveDishImage', () => {
  it('uses the restored tomato beef image and falls back for unknown image names', () => {
    expect(resolveDishImage('番茄肥牛饭.jpg')).toBe(tomatoBeefImage);
    expect(resolveDishImage('missing-dish.jpg')).toBe(braisedBeefImage);
    expect(resolveDishImage(null)).toBe(braisedBeefImage);
    expect(
      DISHES.find((dish) => dish.name === '番茄肥牛饭').image,
    ).toBe(tomatoBeefImage);
    expect(DISHES.every((dish) => Boolean(dish.image))).toBe(true);
  });
});
