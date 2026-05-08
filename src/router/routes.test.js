import { describe, expect, it } from 'vitest';
import { routes } from './index';

describe('core routes', () => {
  it('contains required routes with stable names and paths', () => {
    const routeMap = Object.fromEntries(
      routes.map(item => [item.name, item.path])
    );

    expect(routeMap.homeCanteenSelect).toBe('/');
    expect(routeMap.canteenDetail).toBe('/canteens/:canteenId');
    expect(routeMap.dishList).toBe('/canteens/:canteenId/dishes');
    expect(routeMap.dishDetail).toBe('/canteens/:canteenId/dishes/:dishId');
    expect(routeMap.homeCanteenAnchor).toBe('/canteens');
    expect(routeMap.notFoundRedirect).toBe('/:pathMatch(.*)*');
  });

  it('redirects legacy and unknown paths away from an empty router view', () => {
    const canteenAnchor = routes.find(item => item.name === 'homeCanteenAnchor');
    const notFound = routes.find(item => item.name === 'notFoundRedirect');

    expect(canteenAnchor.redirect).toEqual({
      name: 'homeCanteenSelect',
      query: {
        section: 'canteens',
      },
    });
    expect(notFound.redirect).toBe('/');
  });
});
