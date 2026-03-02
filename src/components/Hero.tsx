import { useEffect, useRef } from 'react';

export default function Hero() {
  const xRef = useRef<HTMLSpanElement>(null);
  const yRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (xRef.current) xRef.current.textContent = Math.round(e.clientX / 2).toString().padStart(3, '0');
      if (yRef.current) yRef.current.textContent = Math.round(e.clientY / 100).toString().padStart(3, '0');
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <main
      className="relative min-h-screen flex flex-col justify-center items-center pt-20"
      id="hero"
    >
      {/* Grid Markers */}
      <span
        className="absolute font-light opacity-50 pointer-events-none select-none text-brutalist-grey"
        style={{ top: '25%', left: '25%', transform: 'translate(-50%, -50%)' }}
      >
        +
      </span>
      <span
        className="absolute font-light opacity-50 pointer-events-none select-none text-brutalist-grey"
        style={{ top: '50%', right: '25%', transform: 'translate(50%, -50%)' }}
      >
        +
      </span>

      {/* Hero Headline */}
      <section className="w-full text-center px-4">
        <div className="flex flex-col md:flex-row md:justify-center md:gap-[0.2em]">
          <span
            className="hero-text uppercase text-brutalist-grey hero-word"
            style={{ fontSize: 'clamp(3.5rem, 22vw, 14rem)', fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1, display: 'flex', justifyContent: 'center', whiteSpace: 'nowrap' }}
          >
            CHHAY
          </span>
          <span
            className="hero-text uppercase text-brutalist-grey hero-word"
            style={{ fontSize: 'clamp(3.5rem, 22vw, 14rem)', fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1, display: 'flex', justifyContent: 'center', whiteSpace: 'nowrap' }}
          >
            VIZUAL
          </span>
        </div>
        <p className="uppercase tracking-[0.2em] md:tracking-[0.4em] text-base sm:text-2xl md:text-4xl mt-2 text-brutalist-grey opacity-70">
          ARCHITECTURAL <span className="opacity-50">✦</span> VISUALIZATION
        </p>
        <p className="uppercase tracking-[0.15em] md:tracking-[0.3em] text-sm sm:text-lg md:text-2xl mt-1 text-brutalist-grey opacity-40">
          DESIGN <span className="opacity-50">·</span> RENDER <span className="opacity-50">·</span> VISUAL
        </p>
      </section>

      {/* Description */}
      <section className="hero-sub mt-12 flex flex-col items-center max-w-lg text-center px-6">
        <div className="mb-4 opacity-70">
          <svg
            fill="none"
            height="24"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            width="24"
          >
            <rect height="18" rx="2" width="18" x="3" y="3" />
            <path d="M3 12h18M12 3v18" />
          </svg>
        </div>
        <p className="text-sm md:text-base leading-relaxed tracking-wide font-light">
          Exploring the intersection of structural integrity, urban flow, and
          contemporary spatial aesthetics. Focusing on brutalist concrete systems
          and minimalist interiors.
        </p>
      </section>

      {/* Technical Coordinates Overlay */}
      <div className="absolute bottom-40 right-10 hidden md:block">
        <div className="text-[10px] tracking-[0.2em] font-mono opacity-60">
          X : <span ref={xRef}>522</span>&nbsp;&nbsp;&nbsp;Y : <span ref={yRef}>006</span>
        </div>
      </div>
    </main >
  );
}
