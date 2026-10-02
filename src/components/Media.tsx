import { useEffect, useRef, useState } from 'react';
import type { MediaItem } from '../data/projects';
import { srcSetFor, SIZES } from '../lib/media';
import { isHydrated } from '../lib/hydration';

type Props = {
  item: MediaItem;
  alt: string;
  className?: string;
  /** Above the fold: load immediately at high priority (the page's LCP image). */
  priority?: boolean;
  /** Show a pause/play control on videos (off for small grid covers). */
  controls?: boolean;
  /** Rendered width hint for picking a srcset candidate. */
  sizes?: string;
};

// Autoplay only where it's cheap and wanted: not with reduced motion, not on
// phones, not with Data Saver. Otherwise the poster shows until the viewer presses play.
function shouldAutoplay() {
  if (typeof window === 'undefined') return false;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return (
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
    window.matchMedia('(min-width: 768px)').matches &&
    !conn?.saveData
  );
}

type ImgProps = {
  src: string;
  w?: number;
  h?: number;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

function Img({ src, w, h, alt, className = '', priority, sizes }: ImgProps) {
  const [loaded, setLoaded] = useState(false);
  // Prerendered images are already painted; only images mounted later fade in
  const [fade] = useState(() => isHydrated() && !priority);
  return (
    <img
      ref={(el) => { if (el?.complete && el.naturalWidth) setLoaded(true); }}
      src={src}
      srcSet={srcSetFor(src, w)}
      sizes={sizes}
      alt={alt}
      width={w}
      height={h}
      loading={priority ? 'eager' : 'lazy'}
      // React 18 doesn't know fetchPriority yet; the lowercase attribute passes through
      {...(priority ? { fetchpriority: 'high' } : {})}
      decoding="async"
      onLoad={() => setLoaded(true)}
      className={`${fade ? 'media-fade' : ''} ${loaded ? 'is-loaded' : ''} ${className}`}
    />
  );
}

function Video({ item, alt, className = '', controls, priority, sizes }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  // Starts paused so server and client markup match; autoplay is decided after mount
  const [playing, setPlaying] = useState(false);
  useEffect(() => { if (shouldAutoplay()) setPlaying(true); }, []);
  // The poster is a real <img> (responsive, prioritised) until the first frame plays
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (playing) v.play().catch(() => setPlaying(false));
    else v.pause();
  }, [playing]);

  return (
    <div className="relative w-full h-full">
      <video
        ref={ref}
        src={item.src}
        width={item.w}
        height={item.h}
        muted
        loop
        playsInline
        autoPlay={playing}
        preload={playing ? 'auto' : 'none'}
        aria-label={alt}
        onPlaying={() => { setStarted(true); setPlaying(true); }}
        onPause={() => setPlaying(false)}
        className={className}
      />
      {item.poster && !started && (
        <Img
          src={item.poster}
          w={item.w}
          h={item.h}
          alt=""
          priority={priority}
          sizes={sizes}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      {controls && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setPlaying((p) => !p);
          }}
          aria-label={playing ? 'Pause video' : 'Play video'}
          className="absolute z-10 bottom-3 right-3 h-11 min-w-11 px-3 flex items-center justify-center gap-2 bg-brutalist-black/70 text-ink text-[12px] backdrop-blur-sm hover:bg-brutalist-black transition-colors"
        >
          <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor" aria-hidden>
            {playing ? <path d="M0 0h3.5v12H0zM6.5 0H10v12H6.5z" /> : <path d="M0 0l10 6-10 6z" />}
          </svg>
          <span>{playing ? 'Pause' : 'Play'}</span>
        </button>
      )}
    </div>
  );
}

/** Responsive image, or a muted looping video with a poster and optional controls. */
export default function Media({ item, sizes = SIZES.full, ...rest }: Props) {
  if (item.type === 'video') return <Video item={item} sizes={sizes} {...rest} />;
  return <Img src={item.src} w={item.w} h={item.h} sizes={sizes} {...rest} />;
}
