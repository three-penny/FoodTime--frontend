import { describe, expect, it } from 'vitest';
import { routes } from './index';

describe('core routes', () => {
  it('contains four required routes with stable names and paths', () => {
    const routeMap = Object.fromEntries(
      routes.map(item => [item.name, item.path])
    );

    expect(routeMap.homeCanteenSelect).toBe('/');
    expect(routeMap.canteenDetail).toBe('/canteens/:canteenId');
    expect(routeMap.dishList).toBe('/canteens/:canteenId/dishes');
    expect(routeMap.dishDetail).toBe('/canteens/:canteenId/dishes/:dishId');
  });
});
