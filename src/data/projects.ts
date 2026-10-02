import data from './projects.json';

export type MediaItem = {
  src: string;
  type: 'image' | 'video';
  // Intrinsic size, so the page reserves space before the file arrives
  w?: number;
  h?: number;
  // Still frame shown before a video plays (and instead of it for reduced motion)
  poster?: string;
};

// Project list lives in projects.json so build scripts (sitemap, prerender) can read it.
// Fill in `location` and `description` there — project pages show them when present.
export type Project = {
  id: string;
  title: string;
  category: string;
  year: string;
  location?: string;
  description?: string;
  media: MediaItem[];
};

export const projects = data as Project[];
