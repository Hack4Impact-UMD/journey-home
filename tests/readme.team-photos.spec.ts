/**
 * tests/readme.team-photos.spec.ts
 * Test library/framework: Playwright Test (@playwright/test)
 * Purpose: Validate README's "Meet the Team" section structure and referenced assets based on the PR diff.
 * Scope: Unit-like validation over README.md contents (names, roles, image tags) and existence checks for local assets.
 */

import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const readReadme = (): string => {
  const readmePath = path.join(process.cwd(), 'README.md');
  expect.soft(fs.existsSync(readmePath), 'README.md should exist at repo root').toBe(true);
  return fs.readFileSync(readmePath, 'utf8');
};

const extractHeadshotTags = (markdown: string): string[] =>
  [...markdown.matchAll(/<img[^>]+src="public\/team-photos\/[^"]+"[^>]*>/g)].map(m => m[0]);

const extractHeadshotSrcs = (markdown: string): string[] =>
  [...markdown.matchAll(/<img[^>]+src="(public\/team-photos\/[^"]+)"/g)].map(m => m[1]);

const expectedNames = [
  'Kalpana Iyer',
  'Laila Shakoor',
  'Arnav Dadarya',
  'Joel Chemmanur',
  'Sohayainder Kaur',
  'Tracy Tan',
  'Katie Yang',
  'Anya Jain',
  'Sarayu Jilludumudi',
  'Amber Li',
  'Savya Miriyala',
  'Ritika Pokharel',
  'Tanvi Tewary',
  'Jibran',
];

test.describe('README "Meet the Team" - team photos', () => {
  test('section header exists', () => {
    const md = readReadme();
    expect(md).toMatch(/###\s+👥\s+Meet the Team/);
  });

  test('includes expected member names from the PR diff', () => {
    const md = readReadme();
    for (const name of expectedNames) {
      expect.soft(md, `Missing team member name "${name}"`).toContain(`<b>${name}</b>`);
    }
  });

  test('has exactly one headshot image per listed member', () => {
    const md = readReadme();
    const headshotTags = extractHeadshotTags(md);
    expect(headshotTags.length).toBe(expectedNames.length);
  });

  test('each headshot uses 100x100 dimensions and proper rounded/cover styles', () => {
    const md = readReadme();
    const headshotTags = extractHeadshotTags(md);
    for (const tag of headshotTags) {
      expect.soft(tag).toMatch(/height="100"/);
      expect.soft(tag).toMatch(/width="100"/);
      expect.soft(tag).toMatch(/border-radius:50%/);
      expect.soft(tag).toMatch(/object-fit:cover/);
    }
  });

  test('all referenced local headshot image files exist on disk (including placeholder)', () => {
    const md = readReadme();
    const srcs = Array.from(new Set(extractHeadshotSrcs(md)));
    for (const src of srcs) {
      const diskPath = path.join(process.cwd(), src);
      expect.soft(fs.existsSync(diskPath), `Missing image file: ${src}`).toBe(true);
    }
  });

  test('role badge counts match expected totals', () => {
    const md = readReadme();
    const count = (needle: string) => (md.match(new RegExp(needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;

    expect(count('_product_manager-')).toBe(2);
    expect(count('_technical_lead-')).toBe(2);
    expect(count('_designer-')).toBe(3);
    expect(count('_engineer-')).toBe(6);
    expect(count('_mentor-')).toBe(1);
  });

  test('each team entry is wrapped in an anchor link to the org site', () => {
    const md = readReadme();
    const anchors = md.match(/<a href="https:\/\/umd\.hack4impact\.org\/">/g) || [];
    expect(anchors.length).toBe(expectedNames.length);
  });
});