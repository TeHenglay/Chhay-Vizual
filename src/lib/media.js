// Responsive-image helpers shared by the app and scripts/prerender.mjs.
// Width ladder generated next to each static .webp (name-640.webp, name-1200.webp).
const LADDER = [640, 1200];

const isStaticWebp = (src) => src.endsWith('.webp') && !/^https?:/.test(src);

/** srcset for a static image of known width; undefined for uploads (no variants). */
export function srcSetFor(src, w) {
  if (!w || !isStaticWebp(src)) return undefined;
  const stem = src.slice(0, -'.webp'.length);
  return [
    ...LADDER.filter((x) => x < w).map((x) => `${encodeURI(`${stem}-${x}.webp`)} ${x}w`),
    `${encodeURI(src)} ${w}w`,
  ].join(', ');
}

/** Smallest variant at least `min` px wide (for small previews). */
export function variantFor(src, w, min) {
  if (!w || !isStaticWebp(src)) return src;
  const x = LADDER.find((l) => l >= min && l < w);
  return x ? `${src.slice(0, -'.webp'.length)}-${x}.webp` : src;
}

// Rendered widths, matching the layout in Layout.tsx / ProjectGrid.tsx
export const SIZES = {
  full: '(min-width: 1024px) min(calc(100vw - 336px), 1192px), calc(100vw - 40px)',
  half: '(min-width: 1024px) min(calc((100vw - 360px) / 2), 584px), (min-width: 768px) calc((100vw - 64px) / 2), calc(100vw - 40px)',
};

/** The image a page paints first: an image, or a video's poster. */
export function leadImage(item) {
  if (!item) return undefined;
  if (item.type === 'image') return { src: item.src, w: item.w };
  return item.poster ? { src: item.poster, w: item.w } : undefined;
}
