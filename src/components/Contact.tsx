import { useReveal } from '../hooks/useReveal';
import { Suspense, lazy } from 'react';
const BustOfDavid = lazy(() => import('./BustOfDavid'));

const socials = [
  { label: 'TikTok', href: 'https://www.tiktok.com/@chhayvizual' },
  { label: 'Telegram', href: 'https://t.me/Hengchhay08' },
  { label: 'Behance', href: 'https://www.behance.net/tehengchhay168' },
];

export default function Contact() {
  const labelRef = useReveal<HTMLHeadingElement>();
  const emailRef = useReveal<HTMLAnchorElement>(100);
  const infoRef = useReveal<HTMLDivElement>(200);
  const footerRef = useReveal<HTMLDivElement>(300);

  return (
    <section
      className="border-t border-zinc-800 flex flex-col overflow-hidden bg-brutalist-grey text-brutalist-black"
      id="contact"
    >
      {/* Main content: left text + right 3D spanning full height */}
      <div className="flex flex-col md:flex-row w-full flex-1" style={{ background: 'linear-gradient(to bottom, transparent 0%, #ffff00 100%)' }}>

        {/* Left column: all text */}
        <div ref={infoRef} className="reveal flex flex-col justify-between flex-1 px-6 md:px-20 pt-32 pb-16">
          {/* Top: label + big email */}
          <div className="flex flex-col items-start text-left mb-20">
            <h2 ref={labelRef} className="reveal text-sm uppercase tracking-[0.5em] mb-16 opacity-50">[ 03 ] Connect</h2>
            <a
              ref={emailRef}
              href="mailto:chhayvizual@gmail.com"
              className="reveal block text-4xl md:text-6xl font-bold hover:italic transition-all duration-500 break-all"
            >
              CHHAYVIZUAL@GMAIL.COM
            </a>
          </div>

          {/* Bottom: contact details */}
          <div className="flex flex-col gap-8">
            {/* Phone */}
            <div className="flex items-start gap-5">
              <svg className="mt-1 shrink-0 opacity-60" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.06 6.06l.98-.98a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] opacity-40 mb-2">Telegram</p>
                <a href="tel:+85596898 9504" className="text-xl font-semibold hover:opacity-70 transition-opacity">+855 96 898 9504</a>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-5">
              <svg className="mt-1 shrink-0 opacity-60" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] opacity-40 mb-2">Email</p>
                <a href="mailto:chhayvizual@gmail.com" className="text-xl font-semibold hover:opacity-70 transition-opacity">chhayvizual@gmail.com</a>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-5">
              <svg className="mt-1 shrink-0 opacity-60" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] opacity-40 mb-2">Address</p>
                <p className="text-xl font-semibold leading-relaxed max-w-sm">#078, St 2, Tmei Village, Takmao Commune,<br/>Takmao District, Kandal Province, Cambodia.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: 3D Bust centered vertically */}
        <div className="flex-1 flex items-center justify-center" style={{ minHeight: '400px' }}>
          <div style={{ width: '100%', height: 'clamp(400px, 70vw, 900px)', marginTop: '40px' }}>
            <Suspense fallback={<div className="w-full h-full flex items-center justify-center opacity-30 text-xs uppercase tracking-widest">Loading 3D...</div>}>
              <BustOfDavid />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div ref={footerRef} className="reveal grid grid-cols-2 md:grid-cols-4 gap-8 text-[10px] tracking-[0.3em] uppercase opacity-50 w-full px-6 md:px-20 pt-10 pb-10 border-t border-zinc-900 bg-brutalist-black text-brutalist-grey">
        {socials.map(({ label, href }) => (
          <a key={label} href={href} className="hover:opacity-100 transition-opacity">{label}</a>
        ))}
        <p>© 2026 TE HENGCHHAY</p>
      </div>
    </section>
  );
}
