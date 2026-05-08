// @author Codex

import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import HomeHero from './HomeHero.vue';

describe('HomeHero', () => {
  it('uses smooth wave top edge and shows two-line title', async () => {
    const wrapper = mount(HomeHero);

    const hero = wrapper.get('[data-test="home-hero"]');
    expect(hero.classes()).toContain('hero--wave-top');
    expect(hero.classes()).not.toContain('torn-edge');
    expect(wrapper.get('.hero__title').text()).toBe('北交干饭吧');
    const titleLines = wrapper.findAll('.hero__title-line');
    expect(titleLines).toHaveLength(2);
    expect(titleLines[0].text()).toBe('北交');
    expect(titleLines[1].text()).toBe('干饭吧');
    expect(wrapper.find('.hero__decor--aunt').exists()).toBe(false);
  });
});
