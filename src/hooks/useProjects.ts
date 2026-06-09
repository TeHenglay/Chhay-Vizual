import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { projects as staticProjects, MediaItem } from '../data/projects';

export type SlideProject = {
  id: string;
  title: string;
  category: string;
  year: string;
  hero: string;
  thumbs: string[];
};

export type PageProject = typeof staticProjects[number];

// Module-level cache — fetched once per page session
let slideCache: SlideProject[] | null = null;
let pageCache: PageProject[] | null = null;
let fetchPromise: Promise<void> = Promise.resolve();
let fetched = false;

function fetchProjects(): Promise<void> {
  if (fetched) return fetchPromise;
  fetched = true;
  fetchPromise = Promise.resolve(
    supabase
      .from('projects')
      .select('id, title, category, year, image_urls')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
      if (!data?.length) {
        slideCache = [];
        pageCache = [];
        return;
      }
      slideCache = data
        .map((p, i) => ({
          id: String(staticProjects.length + i + 1).padStart(2, '0'),
          title: p.title,
          category: p.category,
          year: p.year,
          hero: p.image_urls?.[0] ?? '',
          thumbs: (p.image_urls ?? []).slice(1, 4) as string[],
        }))
        .filter((p) => p.hero);

      pageCache = data
        .map((p, i) => ({
          id: String(staticProjects.length + i + 1).padStart(2, '0'),
          title: p.title,
          category: p.category,
          year: p.year,
          media: (p.image_urls ?? []).map((src: string) => ({ src, type: 'image' as const })) as MediaItem[],
        }))
        .filter((p) => p.media.length > 0) as PageProject[];
    })
  );
  return fetchPromise;
}

export function useSlideProjects(): SlideProject[] {
  const [projects, setProjects] = useState<SlideProject[]>(() =>
    slideCache ? [...slideCache, ...staticProjects.map(p => ({
      id: p.id,
      title: p.title,
      category: p.category,
      year: p.year,
      hero: p.media[0]?.src ?? '',
      thumbs: p.media.slice(1, 4).map(m => m.src),
    }))] : staticProjects.map(p => ({
      id: p.id,
      title: p.title,
      category: p.category,
      year: p.year,
      hero: p.media[0]?.src ?? '',
      thumbs: p.media.slice(1, 4).map(m => m.src),
    }))
  );

  useEffect(() => {
    if (slideCache !== null && slideCache.length >= 0) return;
    void fetchProjects().then(() => {
      if (slideCache?.length) {
        setProjects([
          ...slideCache,
          ...staticProjects.map(p => ({
            id: p.id,
            title: p.title,
            category: p.category,
            year: p.year,
            hero: p.media[0]?.src ?? '',
            thumbs: p.media.slice(1, 4).map(m => m.src),
          })),
        ]);
      }
    });
  }, []);

  return projects;
}

export function usePageProjects(): PageProject[] {
  const [projects, setProjects] = useState<PageProject[]>(() =>
    pageCache ? [...pageCache, ...staticProjects] : staticProjects
  );

  useEffect(() => {
    if (pageCache !== null) return;
    void fetchProjects().then(() => {
      if (pageCache?.length) {
        setProjects([...pageCache, ...staticProjects]);
      }
    });
  }, []);

  return projects;
}
