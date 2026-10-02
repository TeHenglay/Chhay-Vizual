// Writes public/sitemap.xml from the static project list. Runs before every build.
// Projects uploaded through the admin panel are not included (they live in Supabase).
import { readFileSync, writeFileSync } from 'node:fs';
import { SITE, slugify } from '../src/lib/seo.js';

const projects = JSON.parse(readFileSync(new URL('../src/data/projects.json', import.meta.url), 'utf8'));

const urls = [
  { loc: '/', priority: '1.0' },
  { loc: '/projects', priority: '0.9' },
  ...projects.map((p) => ({ loc: `/work/${slugify(p.title)}`, priority: '0.8' })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(({ loc, priority }) => `  <url>\n    <loc>${SITE}${loc}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>${priority}</priority>\n  </url>`)
  .join('\n')}
</urlset>
`;

writeFileSync(new URL('../public/sitemap.xml', import.meta.url), xml);
console.log(`sitemap: ${urls.length} urls`);
