import { useState, useCallback, useEffect } from 'react';
import { useReveal } from '../hooks/useReveal';
import { useSlideProjects } from '../hooks/useProjects';

function getTitleFontSize(title: string) {
  const total = title.replace(/\s/g, '').length;
  const words = title.split(' ').length;
  const score = total + words * 3;
  if (score <= 10) return 'clamp(4rem, 18vw, 22rem)';
  if (score <= 14) return 'clamp(3rem, 12vw, 15rem)';
  if (score <= 18) return 'clamp(2.2rem, 8vw, 10rem)';
  if (score <= 22) return 'clamp(1.8rem, 6.5vw, 8rem)';
  return 'clamp(1.4rem, 5vw, 6rem)';
}

export default function SelectedWorks() {
  const projects = useSlideProjects();
  const [current, setCurrent] = useState(0);
  const [activeThumb, setActiveThumb] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const leftRef = useReveal<HTMLDivElement>();
  const rightRef = useReveal<HTMLDivElement>(150);

  const project = projects[current] ?? projects[0];

  const prev = useCallback(() => {
    setActiveThumb(null);
    setCurrent((c) => (c - 1 + projects.length) % projects.length);
  }, []);

  const next = useCallback(() => {
    setActiveThumb(null);
    setCurrent((c) => (c + 1) % projects.length);
  }, []);

  const goTo = useCallback((i: number) => {
    setActiveThumb(null);
    setCurrent(i);
  }, []);

  // Auto-slide every 3s, pause on hover/interaction
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setActiveThumb(null);
      setCurrent((c) => (c + 1) % projects.length);
    }, 3000);
    return () => clearInterval(id);
  }, [paused, projects.length]);

  return (
    <section
      className="relative w-full min-h-screen bg-brutalist-black flex flex-col md:flex-row items-start px-6 md:px-16 py-24 gap-12 overflow-hidden border-t border-zinc-800"
      id="selected-works"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Left */}
      <div ref={leftRef} className="reveal flex-1 flex flex-col z-10 md:sticky md:top-24 md:h-[calc(100vh-6rem)] relative">
        <div>
          <h2
            key={current}
            className="font-bold uppercase text-brutalist-grey mb-10 leading-[0.85] tracking-tighter animate-title-change"
            style={{ fontSize: getTitleFontSize(project.title) }}
          >
            {project.title.split(' ').map((word, i) => (
              <span key={i} className="block" style={{ wordBreak: 'keep-all', overflowWrap: 'normal' }}>{word}</span>
            ))}
          </h2>
          <p className="text-sm leading-relaxed tracking-wide font-light opacity-60 max-w-xs mb-10">
            A curated collection of projects exploring structural integrity, urban flow,
            and contemporary spatial aesthetics.
          </p>
        </div>

        <div className="mt-8 md:absolute md:bottom-32 md:left-0">
          <div className="text-[11px] font-mono tracking-[0.3em] opacity-40 mb-4">
            {String(current + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
          </div>
          <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-tighter mb-1">
            {project.title}
          </h3>
          <p className="text-[11px] uppercase tracking-[0.3em] opacity-40 mb-8">
            {project.category}  {project.year}
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={prev}
              aria-label="Previous project"
              className="w-12 h-12 border border-zinc-700 flex items-center justify-center hover:bg-brutalist-grey hover:text-brutalist-black transition-colors duration-150"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 5l-7 7 7 7"/>
              </svg>
            </button>
            <button
              onClick={next}
              aria-label="Next project"
              className="w-12 h-12 border border-zinc-700 flex items-center justify-center hover:bg-brutalist-grey hover:text-brutalist-black transition-colors duration-150"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
            <div className="flex items-center gap-2 ml-4">
              {projects.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-colors duration-150 ${i === current ? 'bg-brutalist-grey scale-125' : 'bg-zinc-600 hover:bg-zinc-400'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right: only prev/current/next rendered to avoid loading all images */}
      <div ref={rightRef} className="reveal flex-1 w-full flex flex-col gap-2 relative">
        <span className="absolute -top-4 -left-4 font-light text-2xl opacity-40 pointer-events-none select-none">+</span>

        <div className="w-full relative overflow-hidden" style={{ height: 'min(55vw, 560px)' }}>
          {projects.map((p, pi) => {
            const len = projects.length;
            const isActive = pi === current;
            const isAdjacent = pi === (current - 1 + len) % len || pi === (current + 1) % len;
            if (!isActive && !isAdjacent) return null;
            return (
              <div
                key={pi}
                className="absolute inset-0 transition-all duration-700 ease-in-out"
                style={{
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? 'scale(1)' : 'scale(1.04)',
                  willChange: 'opacity, transform',
                  pointerEvents: isActive ? 'auto' : 'none',
                }}
              >
                <img
                  src={p.hero}
                  alt={p.title}
                  decoding="async"
                  loading={isActive ? 'eager' : 'lazy'}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {p.thumbs.map((thumb, j) => (
                  <img
                    key={j}
                    src={thumb}
                    alt={`${p.title} view ${j + 2}`}
                    decoding="async"
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-150 pointer-events-none"
                    style={{ opacity: isActive && activeThumb === j ? 1 : 0, willChange: 'opacity' }}
                  />
                ))}
              </div>
            );
          })}
        </div>

        {/* Thumbnails — always 3, pad with hero if fewer available */}
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 3 }, (_, j) => {
            const src = project.thumbs[j] ?? project.hero;
            return (
              <div
                key={`${current}-${j}`}
                onMouseEnter={() => setActiveThumb(j)}
                onMouseLeave={() => setActiveThumb(null)}
                className={`overflow-hidden cursor-pointer transition-opacity duration-150 ${activeThumb === j ? 'opacity-100 ring-1 ring-brutalist-grey' : 'opacity-50 hover:opacity-100'}`}
              >
                <img
                  src={src}
                  alt={`${project.title} view ${j + 2}`}
                  decoding="async"
                  className="w-full object-cover"
                  style={{ height: 'min(16vw, 180px)' }}
                />
              </div>
            );
          })}
        </div>

        <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.2em] opacity-40 mt-1">
          <span>{project.id} / {project.title}</span>
          <span>{project.category} / {project.year}</span>
        </div>
      </div>
    </section>
  );
}
