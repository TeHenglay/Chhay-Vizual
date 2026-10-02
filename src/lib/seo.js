// Page metadata shared by the app (client-side navigation) and scripts/prerender.mjs
// (static HTML per route, for crawlers and link previews that don't run JavaScript).
// Plain JS so the Node build scripts can import it without a TypeScript step.

export const SITE = 'https://chhay-vizual.vercel.app';
export const SITE_NAME = 'Chhay Vizual';
const DEFAULT_IMAGE = '/og-image.jpg';

export function slugify(title) {
  return title
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export const absolute = (path) => SITE + encodeURI(path);

// Search results show ~155 characters; cut on a word boundary
const clip = (text, max = 155) =>
  text.length <= max ? text : text.slice(0, text.lastIndexOf(' ', max - 1)).replace(/[,.;:]$/, '') + '…';

const coverOf = (project) => {
  const img = project.media.find((m) => m.type === 'image');
  return img ? img.src : project.media.find((m) => m.poster)?.poster;
};

export function homeMeta() {
  return {
    title: 'Chhay Vizual — Architectural Visualization & 3D Rendering, Phnom Penh',
    description:
      'Architectural visualization studio of Te Hengchhay in Phnom Penh, Cambodia. Photoreal 3D renderings and animations for residential, interior and hospitality projects.',
    path: '/',
    image: DEFAULT_IMAGE,
  };
}

export function workMeta(count) {
  return {
    title: 'Work — Chhay Vizual',
    description: `All ${count} architectural visualization projects by Chhay Vizual: residential, interior design, spatial and hospitality renderings.`,
    path: '/projects',
    image: DEFAULT_IMAGE,
  };
}

export function projectMeta(project) {
  const path = `/work/${slugify(project.title)}`;
  const views = project.media.length;
  const hasVideo = project.media.some((m) => m.type === 'video');
  const fallback =
    `${project.title}: ${project.category.toLowerCase()} visualization by Chhay Vizual (${project.year}). ` +
    `${views} rendered ${views === 1 ? 'view' : 'views'}${hasVideo ? ' and an animation' : ''}` +
    `${project.location ? `, ${project.location}` : ''}.`;
  const image = coverOf(project) ?? DEFAULT_IMAGE;

  return {
    title: `${project.title} — ${project.category} | Chhay Vizual`,
    description: clip(project.description || fallback),
    path,
    image,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: project.title,
      genre: project.category,
      dateCreated: project.year,
      ...(project.description ? { description: project.description } : {}),
      ...(project.location ? { locationCreated: { '@type': 'Place', name: project.location } } : {}),
      url: SITE + path,
      image: project.media.filter((m) => m.type === 'image').slice(0, 6).map((m) => absolute(m.src)),
      creator: { '@type': 'Person', name: 'Te Hengchhay', url: SITE },
      publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE },
    },
  };
}
