import { useState, useEffect, useCallback } from 'react';
import { MediaItem } from '../data/projects';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import { useReveal } from '../hooks/useReveal';
import { usePageProjects, PageProject as Project } from '../hooks/useProjects';
type LightboxState = { projectId: string; mediaIndex: number } | null;


function ProjectBlock({
  project,
  onLightbox,
}: {
  project: Project;
  onLightbox: (mediaIndex: number) => void;
}) {
  const headerRef = useReveal<HTMLDivElement>();
  const gridRef = useReveal<HTMLDivElement>(120);

  const [hero, ...rest] = project.media;
  const heroHeight = 'clamp(240px, 55vw, 560px)';

  return (
    <div className="border-t border-zinc-800 pt-12">
      <div ref={headerRef} className="reveal flex items-end justify-between mb-10">
        <div>
          <span className="text-[10px] font-mono tracking-[0.3em] opacity-40 block mb-2">
            {project.id} / {project.category}
          </span>
          <h3 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter leading-none">
            {project.title}
          </h3>
        </div>
        <span className="text-sm opacity-40 font-mono shrink-0 ml-8">{project.year}</span>
      </div>

      <div ref={gridRef} className="reveal flex flex-col md:flex-row gap-3">
        {/* Hero image — left, fixed */}
        <div className="w-full md:w-1/2 shrink-0 overflow-hidden cursor-zoom-in group relative"
          onClick={() => onLightbox(0)}>
          {hero.type === 'video' ? (
            <>
              <video src={hero.src} autoPlay muted loop playsInline preload="none"
                className="w-full object-cover" style={{ height: heroHeight }} />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5 ml-0.5"><path d="M8 5v14l11-7z"/></svg>
                </div>
              </div>
            </>
          ) : (
            <img src={hero.src} alt={`${project.title} — ${project.category}`} loading="lazy" className="w-full object-cover" style={{ height: heroHeight }} />
          )}
        </div>

        {/* Remaining images — right, 2-col scrollable grid */}
        <div className="gallery-scroll flex-1 overflow-y-auto grid grid-cols-2 gap-3 content-start" style={{ maxHeight: heroHeight, minHeight: '200px' }}>
          {rest.map((item: MediaItem, i: number) => (
            <div key={i} className="overflow-hidden cursor-zoom-in group relative"
              style={{ height: 'calc((clamp(240px, 55vw, 560px) - 0.75rem) / 2)' }}
              onClick={() => onLightbox(i + 1)}>
              {item.type === 'video' ? (
                <>
                  <video src={item.src} autoPlay muted loop playsInline preload="none"
                    className="w-full h-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4 ml-0.5"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                  </div>
                </>
              ) : (
                <img src={item.src} alt={`${project.title} view ${i + 2}`} loading="lazy" className="w-full h-full object-cover" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const PER_PAGE = 8;

export default function ProjectsPage() {
  const projects = usePageProjects();
  const [page, setPage] = useState(0);
  const [lightbox, setLightbox] = useState<LightboxState>(null);
  const [showTop, setShowTop] = useState(false);
  const headingRef = useReveal<HTMLDivElement>();

  const totalPages = Math.ceil(projects.length / PER_PAGE);
  const visibleProjects = projects.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  const goToPage = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeProject = lightbox ? projects.find((p) => p.id === lightbox.projectId) ?? null : null;
  const activeMedia = activeProject ? activeProject.media[lightbox!.mediaIndex] : null;

  const navigate = useCallback((dir: -1 | 1) => {
    if (!lightbox || !activeProject) return;
    const next = (lightbox.mediaIndex + dir + activeProject.media.length) % activeProject.media.length;
    setLightbox({ projectId: lightbox.projectId, mediaIndex: next });
  }, [lightbox, activeProject]);

  useEffect(() => {
    const prev = document.title;
    document.title = 'Projects — Chhay Vizual';
    return () => { document.title = prev; };
  }, []);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') navigate(1);
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'Escape') setLightbox(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, navigate]);

  return (
    <div className="min-h-screen bg-brutalist-black text-brutalist-grey font-sans">
      <Header />
      <Navbar />

      {/* Page heading */}
      <div ref={headingRef} className="reveal pt-40 pb-16 px-8 md:px-16">
        <h2 className="text-[clamp(2rem,8vw,8rem)] font-bold uppercase tracking-tighter leading-none whitespace-nowrap">
          My Projects
        </h2>
        <p className="mt-6 text-sm opacity-50 tracking-wide max-w-lg">
          A complete collection of architectural visualization and 3D rendering work.
        </p>
      </div>

      {/* Projects */}
      <div className="px-8 md:px-16 flex flex-col gap-32">
        {visibleProjects.map((project) => (
          <ProjectBlock key={project.id} project={project}
            onLightbox={(idx) => setLightbox({ projectId: project.id, mediaIndex: idx })} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-8 md:px-16 py-24 flex items-center justify-center gap-4">
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page === 0}
            className="w-12 h-12 border border-zinc-700 flex items-center justify-center hover:bg-brutalist-grey hover:text-brutalist-black disabled:opacity-20 disabled:pointer-events-none transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => goToPage(i)}
              className={`w-12 h-12 border text-sm font-bold uppercase tracking-widest transition-colors ${
                i === page
                  ? 'bg-brutalist-grey text-brutalist-black border-brutalist-grey'
                  : 'border-zinc-700 hover:border-brutalist-grey'
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => goToPage(page + 1)}
            disabled={page === totalPages - 1}
            className="w-12 h-12 border border-zinc-700 flex items-center justify-center hover:bg-brutalist-grey hover:text-brutalist-black disabled:opacity-20 disabled:pointer-events-none transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>

          <span className="text-[10px] font-mono tracking-[0.3em] opacity-40 ml-2">
            {page + 1} / {totalPages}
          </span>
        </div>
      )}

      <div className="pb-16" />

      {/* Scroll to top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
        className={`fixed bottom-24 right-6 z-40 w-12 h-12 flex items-center justify-center bg-brutalist-grey text-brutalist-black hover:bg-yellow-400 transition-all duration-300 shadow-lg ${
          showTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
          <path d="M12 19V5M5 12l7-7 7 7"/>
        </svg>
      </button>

      {/* Lightbox */}
      {lightbox && activeMedia && activeProject && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-6"
          onClick={() => setLightbox(null)}
        >
          {/* Media */}
          <div className="relative max-w-full max-h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            {activeMedia.type === 'video' ? (
              <video src={activeMedia.src} controls autoPlay className="max-w-[90vw] max-h-[85vh] shadow-2xl" />
            ) : (
              <img src={activeMedia.src} alt={activeProject.title} className="max-w-[90vw] max-h-[85vh] object-contain shadow-2xl" />
            )}
          </div>

          {/* Prev arrow */}
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-black/60 hover:bg-yellow-400 hover:text-black text-white rounded-full transition-all text-xl"
            onClick={(e) => { e.stopPropagation(); navigate(-1); }}
          >
            &#8592;
          </button>

          {/* Next arrow */}
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-black/60 hover:bg-yellow-400 hover:text-black text-white rounded-full transition-all text-xl"
            onClick={(e) => { e.stopPropagation(); navigate(1); }}
          >
            &#8594;
          </button>

          {/* Counter */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-xs font-mono tracking-widest">
            {lightbox.mediaIndex + 1} / {activeProject.media.length}
          </div>

          {/* Close */}
          <button
            className="absolute top-6 right-8 text-white/60 hover:text-white text-3xl font-light transition-colors"
            onClick={() => setLightbox(null)}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
