import { useEffect, useRef } from 'react';
import type { MediaItem } from '../data/projects';
import { srcSetFor } from '../lib/media';

type Props = {
  media: MediaItem[];
  index: number;
  title: string;
  onIndex: (index: number) => void;
  onClose: () => void;
};

const navButton =
  'absolute top-1/2 -translate-y-1/2 z-10 h-12 w-12 flex items-center justify-center text-ink/70 hover:text-ink bg-brutalist-black/40 hover:bg-brutalist-black/70 backdrop-blur-sm transition-colors';

/**
 * Full-screen viewer for a project's media, uncropped. A native modal <dialog>
 * gives focus trapping, Escape to close and focus return to the clicked tile.
 * Arrow keys and swipes step through the set.
 */
export default function Lightbox({ media, index, title, onIndex, onClose }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const touchX = useRef<number | null>(null);
  const item = media[index];
  const count = media.length;
  const go = (step: number) => onIndex((index + step + count) % count);

  useEffect(() => {
    const el = dialog.current;
    if (el && !el.open) el.showModal();
    // showModal focuses the first control (Previous); start on Close instead
    closeButton.current?.focus();
    // Keep the page behind from scrolling while the viewer is open
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = 'hidden';
    // No el.close() here: it fires onClose, and StrictMode's test unmount in dev
    // would then shut the viewer the moment it opens. Unmounting removes the dialog anyway.
    return () => {
      root.style.overflow = prev;
    };
  }, []);

  // Warm the neighbours so stepping through feels instant
  useEffect(() => {
    if (count < 2) return;
    for (const m of [media[(index + 1) % count], media[(index - 1 + count) % count]]) {
      const src = m.type === 'image' ? m.src : m.poster;
      if (src) new Image().src = src;
    }
  }, [index, media, count]);

  return (
    <dialog
      ref={dialog}
      aria-label={`${title}, view ${index + 1} of ${count}`}
      onClose={onClose}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(1);
        else if (e.key === 'ArrowLeft') go(-1);
      }}
      // Clicking the dark area around the media closes it
      onClick={(e) => { if (e.target === e.currentTarget || (e.target as HTMLElement).dataset.backdrop) dialog.current?.close(); }}
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
      }}
      className="lightbox fixed inset-0 m-0 h-[100dvh] max-h-none w-screen max-w-none p-0 bg-brutalist-black text-ink backdrop:bg-transparent"
    >
      <div data-backdrop="true" className="relative h-full w-full flex items-center justify-center px-4 py-16 md:px-20">
        {item.type === 'video' ? (
          <video
            key={item.src}
            src={item.src}
            poster={item.poster}
            width={item.w}
            height={item.h}
            controls
            autoPlay
            muted
            loop
            playsInline
            className="lightbox-media max-h-full max-w-full object-contain"
          />
        ) : (
          <img
            key={item.src}
            src={item.src}
            srcSet={srcSetFor(item.src, item.w)}
            sizes="100vw"
            width={item.w}
            height={item.h}
            alt={`${title}, view ${index + 1} of ${count}`}
            className="lightbox-media max-h-full max-w-full w-auto h-auto object-contain"
          />
        )}

        {count > 1 && (
          <>
            <button type="button" onClick={() => go(-1)} aria-label="Previous image" className={`${navButton} left-2 md:left-6`}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                <path d="M10 2L4 8l6 6" />
              </svg>
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Next image" className={`${navButton} right-2 md:right-6`}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                <path d="M6 2l6 6-6 6" />
              </svg>
            </button>
          </>
        )}
      </div>

      <div className="absolute top-0 inset-x-0 flex items-center justify-between px-5 md:px-6 h-14 text-[13px]">
        <p className="text-muted tabular-nums" aria-live="polite">
          {index + 1} / {count}
        </p>
        <button
          type="button"
          ref={closeButton}
          onClick={() => dialog.current?.close()}
          className="h-11 -mr-3 px-3 flex items-center gap-2 text-ink/80 hover:text-ink transition-colors"
        >
          <span>Close</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
            <path d="M1 1l10 10M11 1L1 11" />
          </svg>
        </button>
      </div>
    </dialog>
  );
}
