import { useEffect } from 'react';
import { absolute, SITE, type PageMeta } from '../lib/seo';

function setTag(selector: string, attr: 'content' | 'href', value: string, create: () => HTMLElement) {
  let el = document.head.querySelector<HTMLElement>(selector);
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

const meta = (key: 'name' | 'property', value: string) => () => {
  const el = document.createElement('meta');
  el.setAttribute(key, value);
  return el;
};

/**
 * Keeps <head> in sync on client-side navigation. The same values are baked into
 * static HTML per route at build time (scripts/prerender.mjs) for non-JS crawlers.
 */
export function useMeta(page: PageMeta | null, { noindex = false } = {}) {
  useEffect(() => {
    if (!page) return;
    const url = SITE + page.path;
    const image = absolute(page.image);
    document.title = page.title;
    setTag('meta[name="description"]', 'content', page.description, meta('name', 'description'));
    setTag('link[rel="canonical"]', 'href', url, () => {
      const el = document.createElement('link');
      el.setAttribute('rel', 'canonical');
      return el;
    });
    for (const [key, value] of [
      ['og:title', page.title],
      ['og:description', page.description],
      ['og:url', url],
      ['og:image', image],
    ]) setTag(`meta[property="${key}"]`, 'content', value, meta('property', key));
    for (const [key, value] of [
      ['twitter:title', page.title],
      ['twitter:description', page.description],
      ['twitter:image', image],
    ]) setTag(`meta[name="${key}"]`, 'content', value, meta('name', key));

    const ld = document.getElementById('page-jsonld');
    if (page.jsonLd) {
      const el = ld ?? Object.assign(document.createElement('script'), { id: 'page-jsonld', type: 'application/ld+json' });
      el.textContent = JSON.stringify(page.jsonLd);
      if (!ld) document.head.appendChild(el);
    } else ld?.remove();
  }, [page]);

  useEffect(() => {
    if (!noindex) return;
    const el = meta('name', 'robots')();
    el.setAttribute('content', 'noindex, nofollow');
    document.head.appendChild(el);
    return () => el.remove();
  }, [noindex]);
}
