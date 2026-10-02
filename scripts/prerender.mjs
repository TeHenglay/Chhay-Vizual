// After `vite build` (client) and `vite build --ssr` (dist-ssr): write one static
// HTML file per route containing the rendered page plus that page's title,
// description, canonical URL, share image, structured data and a preload for its
// first image. Visitors see content before any JavaScript runs, crawlers and link
// previews (Google, Telegram, Facebook) read it directly, and React hydrates it.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { homeMeta, workMeta, projectMeta, absolute, SITE } from '../src/lib/seo.js';
import { srcSetFor, leadImage, SIZES } from '../src/lib/media.js';

const dist = new URL('../dist/', import.meta.url);
const template = readFileSync(new URL('index.html', dist), 'utf8');
const projects = JSON.parse(readFileSync(new URL('../src/data/projects.json', import.meta.url), 'utf8'));
const ssrEntry = fileURLToPath(new URL('../dist-ssr/entry-server.js', import.meta.url));
const { render: renderApp } = await import(pathToFileURL(ssrEntry).href);

const ROOT = '<div id="root"></div>';
if (!template.includes(ROOT)) throw new Error('prerender: empty #root not found in dist/index.html');

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function setAttr(html, selector, attr, value) {
  // selector like: meta name="description" | meta property="og:title" | link rel="canonical"
  const re = new RegExp('(<' + selector + '[^>]*?[ \\t\\n]' + attr + '=")[^"]*(")');
  if (!re.test(html)) throw new Error(`prerender: <${selector}> not found in index.html`);
  return html.replace(re, (_, open, close) => open + esc(value) + close);
}

function render(route, meta, lead) {
  const url = SITE + meta.path;
  const image = absolute(meta.image);
  let html = template.replace(/<title>[^<]*<\/title>/, () => `<title>${esc(meta.title)}</title>`);
  html = setAttr(html, 'meta name="description"', 'content', meta.description);
  html = setAttr(html, 'link rel="canonical"', 'href', url);
  html = setAttr(html, 'meta property="og:title"', 'content', meta.title);
  html = setAttr(html, 'meta property="og:description"', 'content', meta.description);
  html = setAttr(html, 'meta property="og:url"', 'content', url);
  html = setAttr(html, 'meta property="og:image"', 'content', image);
  html = setAttr(html, 'meta name="twitter:title"', 'content', meta.title);
  html = setAttr(html, 'meta name="twitter:description"', 'content', meta.description);
  html = setAttr(html, 'meta name="twitter:image"', 'content', image);

  const extra = [];
  if (lead) {
    const set = srcSetFor(lead.src, lead.w);
    extra.push(
      `<link rel="preload" as="image" href="${esc(encodeURI(lead.src))}"` +
        (set ? ` imagesrcset="${esc(set)}" imagesizes="${esc(SIZES.full)}"` : '') +
        ` fetchpriority="high" />`
    );
  }
  if (meta.jsonLd) {
    const json = JSON.stringify(meta.jsonLd).replace(/</g, '\\u003c');
    extra.push(`<script type="application/ld+json" id="page-jsonld">${json}</script>`);
  }
  html = html.replace('</head>', () => `  ${extra.join('\n    ')}\n  </head>`);

  // data-route lets main.tsx hydrate only when the URL matches what was rendered
  const body = `<div id="root" data-route="${route}">${renderApp(route)}</div>`;
  return html.replace(ROOT, () => body);
}

function write(route, html) {
  // "/" -> index.html, "/projects" -> projects.html (served at /projects via cleanUrls)
  const file = fileURLToPath(new URL(route === '/' ? 'index.html' : `.${route}.html`, dist));
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
}

const lead = (p) => leadImage(p?.media[0]);

// Project pages first: "/" overwrites dist/index.html, which is also the template
const pages = [
  ...projects.map((p) => {
    const meta = projectMeta(p);
    const og = `/og/${meta.path.split('/').pop()}.jpg`;
    if (existsSync(new URL(`../public${og}`, import.meta.url))) meta.image = og;
    return [meta.path, render(meta.path, meta, lead(p))];
  }),
  ['/projects', render('/projects', workMeta(projects.length), undefined)],
  ['/', render('/', homeMeta(), lead(projects[0]))],
  // Empty client-rendered shell for every other URL (admin, unknown paths) — see vercel.json
  ['/app', template.replace(/<link rel="canonical"[^>]*>\s*/, '')],
];
for (const [route, html] of pages) write(route, html);
console.log(`prerender: ${pages.length} pages`);
