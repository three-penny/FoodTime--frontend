import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const workspaceRoot = process.cwd();
const filesToCheck = [
  'src/styles/theme.css',
  'src/views/home/HomeView.vue',
  'src/views/canteen/CanteenDetailView.vue',
  'src/views/dish/DishListView.vue',
  'src/views/dish/DishDetailView.vue',
  'src/views/review/ReviewEntryView.vue',
  'src/views/profile/ProfileCenterView.vue',
  'src/components/print/Stamp.vue',
  'src/components/print/ScoreLine.vue',
  'src/components/print/PrintStamp.vue',
  'src/components/print/PrintSectionHead.vue',
  'src/components/print/ErrataStrip.vue',
  'src/components/print/LeaderDotsRow.vue',
  'src/components/print/TicketSeparator.vue',
  'src/components/print/RhythmDivider.vue',
  'src/components/print/VoteButtons.vue',
];

function readAll() {
  return filesToCheck.map((relativePath) => {
    const filePath = path.join(workspaceRoot, relativePath);
    return fs.readFileSync(filePath, 'utf8');
  });
}

describe('style guard', () => {
  it('disallows non-none box-shadow and translateY lift effects', () => {
    const contents = readAll().join('\n');

    const shadowMatches = [
      ...contents.matchAll(/box-shadow\s*:\s*([^;]+)/g),
    ].map((match) => match[1].trim().toLowerCase());

    for (const value of shadowMatches) {
      expect(value).toContain('none');
    }

    expect(contents).not.toMatch(/translateY\s*\(/);
  });

  it('uses only approved palette in source styles', () => {
    const allowed = new Set([
      '#f2efe6',
      '#ece8de',
      '#e1dccf',
      '#d3ccbe',
      '#3a2418',
      '#c9341e',
      '#9d2a1a',
      '#5b7a3a',
      '#f6f3eb',
    ]);
    const contents = readAll().join('\n').toLowerCase();
    const hexMatches = contents.match(/#[0-9a-f]{6}/g) || [];

    for (const hex of hexMatches) {
      expect(allowed.has(hex)).toBe(true);
    }
  });
});
