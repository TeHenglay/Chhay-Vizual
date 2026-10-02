import type { MediaItem } from '../data/projects';

export function srcSetFor(src: string, w?: number): string | undefined;
export function variantFor(src: string, w: number | undefined, min: number): string;
export const SIZES: { full: string; half: string };
export function leadImage(item: MediaItem | undefined): { src: string; w?: number } | undefined;
