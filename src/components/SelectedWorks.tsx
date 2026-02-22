import { useState, useCallback, useEffect } from 'react';
import { useReveal } from '../hooks/useReveal';

const projects = [
  {
    id: '01',
    title: 'Aura Sandstone Villa',
    category: 'Residential',
    year: '2024',
    hero: '/Chay_Visual/Aura Sandstone Villa/Exterior View 1.webp',
    thumbs: [
      '/Chay_Visual/Aura Sandstone Villa/Inteiror 1.webp',
      '/Chay_Visual/Aura Sandstone Villa/Interior 2.webp',
      '/Chay_Visual/Aura Sandstone Villa/Pool View.webp',
    ],
  },
  {
    id: '02',
    title: 'Japandi Homestay',
    category: 'Interior Design',
    year: '2024',
    hero: '/Chay_Visual/Japandi/Home stay view1.jpg',
    thumbs: [
      '/Chay_Visual/Japandi/Home stay view2.jpg',
      '/Chay_Visual/Japandi/Homestay View3.jpg',
      '/Chay_Visual/Japandi/Homestay View4.jpg',
    ],
  },
  {
    id: '03',
    title: 'Contemporary Kitchen',
    category: 'Interior Design',
    year: '2023',
    hero: '/Chay_Visual/kitchen/Kitchen1.webp',
    thumbs: [
      '/Chay_Visual/kitchen/Dinning Table.webp',
      '/Chay_Visual/kitchen/Kitchen 2.webp',
      '/Chay_Visual/kitchen/Living Room 1.webp',
    ],
  },
  {
    id: '04',
    title: 'Room Series',
    category: 'Spatial Design',
    year: '2023',
    hero: '/Chay_Visual/Room/1-.jpg',
    thumbs: [
      '/Chay_Visual/Room/3-.jpg',
      '/Chay_Visual/Room/4.jpg',
      '/Chay_Visual/Room/5.jpg',
    ],
  },
  {
    id: '05',
    title: 'The Sauna Suite',
    category: 'Wellness & Hospitality',
    year: '2024',
    hero: '/Chay_Visual/The Sauna Suite/02. Indoor Pool.jpg',
    thumbs: [
      '/Chay_Visual/The Sauna Suite/03. Pool 2_.jpg',
      '/Chay_Visual/The Sauna Suite/04. Outdoor1_.jpg',
      '/Chay_Visual/The Sauna Suite/11. Lving Room_.jpg',
    ],
  },
  {
    id: '06',
    title: 'Emerald Oasis',
    category: 'Residential',
    year: '2024',
    hero: '/Chay_Visual/Emerald Oasis/Entrance 1.jpg',
    thumbs: [
      '/Chay_Visual/Emerald Oasis/Living Room.jpg',
      '/Chay_Visual/Emerald Oasis/Dinning 1.jpg',
      '/Chay_Visual/Emerald Oasis/Study Room 1.jpg',
    ],
  },
  {
    id: '07',
    title: 'Mid-Mod Muse',
    category: 'Interior Design',
    year: '2024',
    hero: '/Chay_Visual/Mid-Mod Muse/01. Living Room.jpg',
    thumbs: [
      '/Chay_Visual/Mid-Mod Muse/03. Dinning table.jpg',
      '/Chay_Visual/Mid-Mod Muse/07. workplace.jpg',
      '/Chay_Visual/Mid-Mod Muse/12. Game room.jpg',
    ],
  },
  {
    id: '08',
    title: 'The Digital Dojo',
    category: 'Spatial Design',
    year: '2025',
    hero: '/Chay_Visual/The Digital Dojo/2 (1).jpg',
    thumbs: [
      '/Chay_Visual/The Digital Dojo/4.jpg',
      '/Chay_Visual/The Digital Dojo/6.jpg',
      '/Chay_Visual/The Digital Dojo/9.jpg',
    ],
  },
  {
    id: '09',
    title: 'Whispers of Calm',
    category: 'Interior Design',
    year: '2025',
    hero: '/Chay_Visual/Whispers of Calm/Living room 1 (1).jpg',
    thumbs: [
      '/Chay_Visual/Whispers of Calm/Dinning Room.jpg',
      '/Chay_Visual/Whispers of Calm/Living Room 2 (1).jpg',
      '/Chay_Visual/Whispers of Calm/COffee.jpg',
    ],
  },
  {
    id: '10',
    title: "The Artisan's Rest",
    category: 'Interior Design',
    year: '2025',
    hero: "/Chay_Visual/The Artisan's Rest/1 Bedview.jpg",
    thumbs: [
      "/Chay_Visual/The Artisan's Rest/2 Cafe Machine.jpg",
      "/Chay_Visual/The Artisan's Rest/6 Piano.jpg",
      "/Chay_Visual/The Artisan's Rest/Bathroom 1.jpg",
    ],
  },
  {
    id: '11',
    title: 'The Mosaic Residence',
    category: 'Residential',
    year: '2025',
    hero: '/Chay_Visual/The Mosaic Residence/05. Living Room_.jpg',
    thumbs: [
      '/Chay_Visual/The Mosaic Residence/01. Table View.jpg',
      '/Chay_Visual/The Mosaic Residence/03. Kitchen_.jpg',
      '/Chay_Visual/The Mosaic Residence/06. Bedroom 01_.jpg',
    ],
  },
  {
    id: '12',
    title: 'The Sunlit Foyer',
    category: 'Interior Design',
    year: '2025',
    hero: '/Chay_Visual/The Sunlit Foyer/Entrance1-.jpg',
    thumbs: [
      '/Chay_Visual/The Sunlit Foyer/Hallway1.jpg',
      '/Chay_Visual/The Sunlit Foyer/Kitchen-.jpg',
      '/Chay_Visual/The Sunlit Foyer/Bathroom-.jpg',
    ],
  },
];

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
  const [current, setCurrent] = useState(0);
  const [activeThumb, setActiveThumb] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const leftRef = useReveal<HTMLDivElement>();
  const rightRef = useReveal<HTMLDivElement>(150);

  const project = projects[current];

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
  }, [paused]);

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
              className="w-12 h-12 border border-zinc-700 flex items-center justify-center hover:bg-brutalist-grey hover:text-brutalist-black transition-colors duration-150"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 5l-7 7 7 7"/>
              </svg>
            </button>
            <button
              onClick={next}
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

      {/* Right: ALL images pre-rendered in DOM, visibility toggled via opacity only */}
      <div ref={rightRef} className="reveal flex-1 w-full flex flex-col gap-2 relative">
        <span className="absolute -top-4 -left-4 font-light text-2xl opacity-40 pointer-events-none select-none">+</span>

        {/* Hero stack  every project rendered, only active one visible */}
        <div className="w-full relative overflow-hidden" style={{ height: 'min(55vw, 560px)' }}>
          {projects.map((p, pi) => (
            <div
              key={pi}
              className="absolute inset-0 transition-all duration-700 ease-in-out"
              style={{
                opacity: pi === current ? 1 : 0,
                transform: pi === current ? 'scale(1)' : 'scale(1.04)',
                willChange: 'opacity, transform',
                pointerEvents: pi === current ? 'auto' : 'none',
              }}
            >
              {/* Base hero */}
              <img
                src={p.hero}
                alt={p.title}
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Thumb overlays for this project */}
              {p.thumbs.map((thumb, j) => (
                <img
                  key={j}
                  src={thumb}
                  alt={`${p.title} view ${j + 2}`}
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-150 pointer-events-none"
                  style={{ opacity: pi === current && activeThumb === j ? 1 : 0, willChange: 'opacity' }}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Thumbnails  current project only */}
        <div className="grid grid-cols-3 gap-2">
          {project.thumbs.map((thumb, j) => (
            <div
              key={`${current}-${j}`}
              onMouseEnter={() => setActiveThumb(j)}
              onMouseLeave={() => setActiveThumb(null)}
              className={`overflow-hidden cursor-pointer transition-opacity duration-150 ${activeThumb === j ? 'opacity-100 ring-1 ring-brutalist-grey' : 'opacity-50 hover:opacity-100'}`}
            >
              <img
                src={thumb}
                alt={`${project.title} view ${j + 2}`}
                decoding="async"
                className="w-full object-cover"
                style={{ height: 'min(16vw, 180px)' }}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.2em] opacity-40 mt-1">
          <span>{project.id} / {project.title}</span>
          <span>{project.category} / {project.year}</span>
        </div>
      </div>
    </section>
  );
}
