import type { Project } from '../data/projects';

export type PageMeta = {
  title: string;
  description: string;
  path: string;
  image: string;
  jsonLd?: Record<string, unknown>;
};

export const SITE: string;
export const SITE_NAME: string;
export function slugify(title: string): string;
export function absolute(path: string): string;
export function homeMeta(): PageMeta;
export function workMeta(count: number): PageMeta;
export function projectMeta(project: Project): PageMeta;
