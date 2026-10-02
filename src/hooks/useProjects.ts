import { useState, useEffect } from 'react';
import { projects as staticProjects, type MediaItem, type Project } from '../data/projects';

export type PageProject = Project;

type Row = {
  title: string;
  category: string;
  year: string;
  description: string | null;
  image_urls: string[] | null;
};

const VIDEO_EXT = /\.(mp4|mov|webm)(\?|$)/i;

// Module-level cache — fetched once per page session
let remoteCache: PageProject[] | null = null;
let fetchPromise: Promise<void> | null = null;

function fetchProjects(): Promise<void> {
  // Supabase is loaded on demand so it stays out of the first-paint bundle
  fetchPromise ??= import('../lib/supabase')
    .then(({ supabase }) =>
      supabase
        .from('projects')
        .select('title, category, year, description, image_urls')
        .order('created_at', { ascending: false })
    )
    .then(({ data }) => {
      remoteCache = ((data ?? []) as Row[])
        .map((p, i) => ({
          id: String(staticProjects.length + i + 1).padStart(2, '0'),
          title: p.title,
          category: p.category,
          year: p.year,
          description: p.description?.trim() || undefined,
          media: (p.image_urls ?? []).map(
            (src): MediaItem => ({ src, type: VIDEO_EXT.test(src) ? 'video' : 'image' })
          ),
        }))
        .filter((p) => p.media.length > 0);
    })
    .catch(() => {
      remoteCache = [];
    });
  return fetchPromise;
}

const merge = () => [...(remoteCache ?? []), ...staticProjects];

/** All projects (uploaded first), plus whether the remote fetch has settled. */
export function useProjectsState(): { projects: PageProject[]; ready: boolean } {
  const [state, setState] = useState(() => ({ projects: merge(), ready: remoteCache !== null }));

  useEffect(() => {
    if (remoteCache !== null) return;
    let alive = true;
    const load = () =>
      void fetchProjects().then(() => {
        if (alive) setState({ projects: merge(), ready: true });
      });
    // Static projects are already on screen; fetch uploads once the browser is idle
    // so the request never competes with first paint
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
    idle(load);
    return () => { alive = false; };
  }, []);

  return state;
}

export function usePageProjects(): PageProject[] {
  return useProjectsState().projects;
}

export { slugify } from '../lib/seo';
