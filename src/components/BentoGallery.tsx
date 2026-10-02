import { useState, type CSSProperties } from 'react';
import type { MediaItem } from '../data/projects';
import Media from './Media';
import Lightbox from './Lightbox';

// Project detail images as a bento grid. Runs of portrait renders are packed into
// tiles (one large + four small, rows of three or four), landscape renders run full
// width or in pairs. Below md everything stacks at its own aspect ratio.

type Entry = { item: MediaItem; index: number };
type Group =
  | { kind: 'five'; items: Entry[]; flip: boolean }
  | { kind: 'four' | 'three' | 'two' | 'pair'; items: Entry[] }
  | { kind: 'full' | 'single'; items: Entry[] };

// Unknown sizes (admin uploads) count as landscape
const isPortrait = (m: MediaItem) => Boolean(m.w && m.h && m.h > m.w);

function portraitGroups(run: Entry[], flipStart: boolean): Group[] {
  const groups: Group[] = [];
  let rest = run;
  let flip = flipStart;
  let lastWasFive = false;
  while (rest.length) {
    const n = rest.length;
    // Never leave a lone one or two behind: 6 -> 3+3, 7 -> 4+3, 9 -> 5+4
    const take: number = n <= 5 ? n : n === 6 ? 3 : n === 7 ? 4 : lastWasFive ? 3 : 5;
    const items = rest.slice(0, take);
    rest = rest.slice(take);
    if (take === 5) {
      groups.push({ kind: 'five', items, flip });
      flip = !flip;
    } else {
      groups.push({ kind: (['single', 'two', 'three', 'four'] as const)[take - 1], items });
    }
    lastWasFive = take === 5;
  }
  return groups;
}

function landscapeGroups(run: Entry[]): Group[] {
  const groups: Group[] = [];
  // Odd count: the first one runs full width, the rest in pairs
  let rest = run;
  if (rest.length % 2) {
    groups.push({ kind: 'full', items: rest.slice(0, 1) });
    rest = rest.slice(1);
  }
  for (let i = 0; i < rest.length; i += 2) groups.push({ kind: 'pair', items: rest.slice(i, i + 2) });
  return groups;
}

function bentoGroups(media: MediaItem[]): Group[] {
  const groups: Group[] = [];
  let flip = false;
  let i = 0;
  while (i < media.length) {
    const portrait = isPortrait(media[i]);
    const run: Entry[] = [];
    while (i < media.length && isPortrait(media[i]) === portrait) run.push({ item: media[i], index: i++ });
    if (portrait) {
      const g = portraitGroups(run, flip);
      flip = g.filter((x) => x.kind === 'five').length % 2 ? !flip : flip;
      groups.push(...g);
    } else {
      groups.push(...landscapeGroups(run));
    }
  }
  return groups;
}

// Rendered width as a fraction of the content column (matches SIZES in lib/media.js)
const sizesFor = (f: number) =>
  f === 1
    ? '(min-width: 1024px) min(calc(100vw - 336px), 1192px), calc(100vw - 40px)'
    : `(min-width: 1024px) min(calc((100vw - 336px) * ${f}), ${Math.round(1192 * f)}px), (min-width: 768px) calc((100vw - 64px) * ${f}), calc(100vw - 40px)`;

// md+ grid per group; the group's aspect ratio keeps every tile close to 3:4
const GROUP_CLASS: Record<Group['kind'], string> = {
  five: 'md:grid md:grid-cols-4 md:grid-rows-2 md:aspect-[3/2]',
  four: 'md:grid md:grid-cols-4 md:grid-rows-1 md:aspect-[3/1]',
  three: 'md:grid md:grid-cols-3 md:grid-rows-1 md:aspect-[9/4]',
  two: 'md:grid md:grid-cols-2 md:grid-rows-1 md:aspect-[3/2]',
  pair: 'md:grid md:grid-cols-2 md:items-start',
  full: '',
  single: 'md:w-1/2 md:mx-auto',
};

function cellLayout(group: Group, pos: number): { className: string; fraction: number } {
  switch (group.kind) {
    case 'five': {
      if (pos === 0) {
        return { className: `md:col-span-2 md:row-span-2 ${group.flip ? 'md:col-start-3' : 'md:col-start-1'} md:row-start-1`, fraction: 0.5 };
      }
      const col = (group.flip ? ['md:col-start-1', 'md:col-start-2'] : ['md:col-start-3', 'md:col-start-4'])[(pos - 1) % 2];
      const row = pos <= 2 ? 'md:row-start-1' : 'md:row-start-2';
      return { className: `${col} ${row}`, fraction: 0.25 };
    }
    case 'four':
      return { className: '', fraction: 0.25 };
    case 'three':
      return { className: '', fraction: 1 / 3 };
    case 'two':
    case 'pair':
    case 'single':
      return { className: '', fraction: 0.5 };
    case 'full':
      return { className: '', fraction: 1 };
  }
}

export default function BentoGallery({ media, title }: { media: MediaItem[]; title: string }) {
  const groups = bentoGroups(media);
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="flex flex-col gap-3 md:gap-4">
      {groups.map((group) => {
        // Tiles inside a cropped grid fill their cell; the rest keep their own shape on md too
        const cropped = group.kind === 'five' || group.kind === 'four' || group.kind === 'three' || group.kind === 'two';
        return (
          <div key={group.items[0].item.src} className={`flex flex-col gap-3 md:gap-4 ${GROUP_CLASS[group.kind]}`}>
            {group.items.map(({ item, index }, pos) => {
              const { className, fraction } = cellLayout(group, pos);
              return (
                <div
                  key={item.src}
                  className={`group relative bg-surface overflow-hidden aspect-[var(--ar)] ${cropped ? 'md:aspect-auto md:min-h-0' : ''} ${className}`}
                  // Reserve the right height before the file arrives
                  style={{ '--ar': item.w && item.h ? `${item.w} / ${item.h}` : '16 / 9' } as CSSProperties}
                >
                  <Media
                    item={item}
                    alt={`${title}, view ${index + 1} of ${media.length}`}
                    priority={index === 0}
                    controls
                    // The lead image keeps the full-width sizes the prerendered preload uses
                    sizes={sizesFor(index === 0 ? 1 : fraction)}
                    className="w-full h-full object-cover block transition-transform duration-700 ease-out group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                  {/* Sits under the video's play/pause control (z-10), over everything else */}
                  <button
                    type="button"
                    onClick={() => setOpen(index)}
                    aria-label={`View ${title}, view ${index + 1} of ${media.length}, full screen`}
                    className="absolute inset-0 cursor-zoom-in focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
                  />
                </div>
              );
            })}
          </div>
        );
      })}
      {open !== null && (
        <Lightbox media={media} index={open} title={title} onIndex={setOpen} onClose={() => setOpen(null)} />
      )}
    </div>
  );
}
