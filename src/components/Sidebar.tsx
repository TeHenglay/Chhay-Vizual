import { useEffect, useRef, useState } from 'react';
import type { MouseEvent, RefObject } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { usePageProjects, slugify } from '../hooks/useProjects';
import { variantFor } from '../lib/media';

const socials = [
  { label: 'Behance', href: 'https://www.behance.net/tehengchhay168' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@chhayvizual' },
  { label: 'Telegram', href: 'https://t.me/Hengchhay08' },
  { label: 'Facebook', href: 'https://www.facebook.com/chhayvizual' },
];

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-3 group">
      <img src="/chay-logo-96.webp" alt="" width={32} height={32} className="h-8 w-8 object-contain" />
      <span className="text-[13px] font-semibold tracking-[0.2em] uppercase">Chhay Vizual</span>
    </Link>
  );
}

type Preview = { src: string; title: string } | null;

// Floating cover image that follows the cursor while a project title is hovered.
// Positioned through a ref so mouse moves don't re-render the sidebar.
function HoverPreview({ preview, posRef }: { preview: Preview; posRef: RefObject<HTMLDivElement> }) {
  const [shown, setShown] = useState<Preview>(null);

  // Keep the last image mounted while it fades out
  useEffect(() => {
    if (preview) setShown(preview);
  }, [preview]);

  return (
    <div
      ref={posRef}
      aria-hidden
      className="hidden lg:block fixed top-0 left-0 z-50 pointer-events-none w-[340px] will-change-transform"
    >
      <div
        className={`aspect-[4/3] overflow-hidden bg-brutalist-black transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          preview ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.97]'
        }`}
      >
        {shown && <img key={shown.src} src={shown.src} alt="" className="w-full h-full object-cover" />}
      </div>
    </div>
  );
}

function NavContent({ onNavigate }: { onNavigate?: () => void }) {
  const projects = usePageProjects();
  const [preview, setPreview] = useState<Preview>(null);
  const posRef = useRef<HTMLDivElement>(null);

  const movePreview = (e: MouseEvent) => {
    const el = posRef.current;
    if (!el) return;
    const h = el.offsetHeight || 255;
    const y = Math.min(Math.max(e.clientY - h / 2, 16), window.innerHeight - h - 16);
    el.style.transform = `translate3d(${e.clientX + 32}px, ${y}px, 0)`;
  };

  const itemCls = ({ isActive }: { isActive: boolean }) =>
    `group flex items-baseline gap-2.5 -ml-[15px] py-1.5 lg:py-1 transition-colors duration-200 ${
      isActive ? 'text-ink' : 'text-muted hover:text-ink'
    }`;

  // Section links: sentence case, same size as the list — no tracked caps
  const headCls = ({ isActive }: { isActive: boolean }) =>
    `inline-block py-1.5 lg:py-0 transition-colors ${isActive ? 'text-ink' : 'text-muted hover:text-ink'}`;

  return (
    <nav className="flex flex-col gap-10 text-[13px] leading-snug" aria-label="Main">
      <div>
        <NavLink to="/projects" end onClick={onNavigate} className={headCls}>
          All work
        </NavLink>
        <ul className="mt-2 lg:mt-3" onMouseLeave={() => setPreview(null)}>
          {projects.map((p) => {
            const c = p.media.find((m) => m.type === 'image') ?? p.media[0];
            const cover = c && variantFor(c.type === 'video' ? c.poster ?? c.src : c.src, c.w, 640);
            return (
            <li key={p.id}>
              <NavLink
                to={`/work/${slugify(p.title)}`}
                onClick={() => { setPreview(null); onNavigate?.(); }}
                onMouseEnter={(e) => { movePreview(e); if (cover) setPreview({ src: cover, title: p.title }); }}
                onMouseMove={movePreview}
                className={itemCls}
              >
                {({ isActive }) => (
                  <>
                    <span
                      aria-hidden
                      className={`inline-block h-[5px] w-[5px] shrink-0 -translate-y-[2px] transition-colors ${
                        isActive ? 'bg-accent' : 'bg-transparent'
                      }`}
                    />
                    <span>{p.title}</span>
                  </>
                )}
              </NavLink>
            </li>
            );
          })}
        </ul>
        <HoverPreview preview={preview} posRef={posRef} />
      </div>

      <ul className="flex flex-col lg:gap-1.5">
        <li>
          <Link to="/#about" onClick={onNavigate} className={headCls({ isActive: false })}>
            About
          </Link>
        </li>
        <li>
          <Link to="/#contact" onClick={onNavigate} className={headCls({ isActive: false })}>
            Contact
          </Link>
        </li>
      </ul>
    </nav>
  );
}

function Socials() {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-muted">
      {socials.map(({ label, href }) => (
        <li key={label}>
          <a href={href} target="_blank" rel="noopener noreferrer" className="link-line inline-block py-1.5 lg:py-1 hover:text-ink">
            {label}
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <>
      {/* Desktop — fixed column on the left */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-[var(--sidebar)] flex-col justify-between px-10 py-10 overflow-y-auto z-40">
        <div className="flex flex-col gap-14">
          <div>
            <Brand />
            <p className="mt-5 text-[13px] leading-relaxed text-muted">
              Architectural visualization
              <br />
              Phnom Penh, Cambodia
            </p>
          </div>
          <NavContent />
        </div>
        <div className="pt-14">
          <Socials />
        </div>
      </aside>

      {/* Mobile — slim bar with a full-screen menu */}
      <header className="lg:hidden fixed top-0 inset-x-0 z-50 flex items-center justify-between px-5 h-16 bg-brutalist-black/90 backdrop-blur-sm">
        <Brand />
        <button
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="h-11 -mr-3 px-3 text-[13px] text-ink"
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </header>

      {open && (
        <div id="mobile-menu" className="lg:hidden fixed inset-0 top-16 z-40 bg-brutalist-black overflow-y-auto px-5 pt-8 pb-12 fade-up">
          <NavContent onNavigate={() => setOpen(false)} />
          <div className="mt-12">
            <Socials />
          </div>
        </div>
      )}
    </>
  );
}
