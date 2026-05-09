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
    expect(routeMap.login).toBe('/login');
    expect(routeMap.register).toBe('/register');
    expect(routeMap.dishUpload).toBe('/dishes/upload');
    expect(routeMap.userSubmissions).toBe('/submissions');
    expect(routeMap.rantWall).toBe('/rants');
    expect(routeMap.adminAudit).toBe('/admin/audit');
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

  it('marks platform routes as authenticated pages except auth entry pages', () => {
    const protectedRouteNames = [
      'homeCanteenSelect',
      'canteenDetail',
      'dishList',
      'dishDetail',
      'reviewCreate',
      'dishUpload',
      'userSubmissions',
      'messageCenter',
      'rantWall',
    ];

    protectedRouteNames.forEach((name) => {
      const target = routes.find(item => item.name === name);
      expect(target.meta).toEqual({ requiresAuth: true });
    });

    expect(routes.find(item => item.name === 'login').meta).toBeUndefined();
    expect(routes.find(item => item.name === 'register').meta).toBeUndefined();
  });

  it('marks admin audit route as admin-only', () => {
    const adminAudit = routes.find(item => item.name === 'adminAudit');

    expect(adminAudit.meta).toEqual({
      requiresAuth: true,
      requiresAdmin: true,
    });
  });
});
