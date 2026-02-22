import { useEffect, useRef, useState } from 'react';
import { useReveal } from '../hooks/useReveal';
import type { ReactElement } from 'react';

const icons: Record<string, ReactElement> = {
  'Microsoft Office': (
    <svg viewBox="0 0 48 48" width="36" height="36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2"  y="2"  width="20" height="20" rx="2" fill="#F25022"/>
      <rect x="26" y="2"  width="20" height="20" rx="2" fill="#7FBA00"/>
      <rect x="2"  y="26" width="20" height="20" rx="2" fill="#00A4EF"/>
      <rect x="26" y="26" width="20" height="20" rx="2" fill="#FFB900"/>
    </svg>
  ),
  '3DS Max': (
    <img src="/skill-logo/3dsmax.png" alt="3DS Max" width="36" height="36" style={{ objectFit: 'contain' }} />
  ),
  'Corona Render': (
    <img src="/skill-logo/corona.png" alt="Corona Render" width="36" height="36" style={{ objectFit: 'contain' }} />
  ),
  'Lumion': (
    <img src="/skill-logo/lumion.svg" alt="Lumion" width="36" height="36" style={{ objectFit: 'contain' }} />
  ),
  'Adobe Photoshop': (
    <svg viewBox="0 0 48 48" width="36" height="36" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="4" fill="#001E36"/>
      <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle" fill="#31A8FF" fontSize="16" fontWeight="bold" fontFamily="sans-serif">Ps</text>
    </svg>
  ),
  'Adobe Illustrator': (
    <svg viewBox="0 0 48 48" width="36" height="36" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="4" fill="#330000"/>
      <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle" fill="#FF9A00" fontSize="16" fontWeight="bold" fontFamily="sans-serif">Ai</text>
    </svg>
  ),
  'Auto CAD': (
    <img src="/skill-logo/autocad.png" alt="Auto CAD" width="36" height="36" style={{ objectFit: 'contain' }} />
  ),
  'Sketch Up': (
    <img src="/skill-logo/SketchUp.png" alt="Sketch Up" width="36" height="36" style={{ objectFit: 'contain' }} />
  ),
  'Revit': (
    <img src="/skill-logo/revit.png" alt="Revit" width="36" height="36" style={{ objectFit: 'contain' }} />
  ),
};

const skills = [
  { name: 'Microsoft Office',  pct: 90 },
  { name: '3DS Max',           pct: 95 },
  { name: 'Corona Render',     pct: 90 },
  { name: 'Lumion',            pct: 88 },
  { name: 'Adobe Photoshop',   pct: 85 },
  { name: 'Adobe Illustrator', pct: 80 },
  { name: 'Auto CAD',          pct: 85 },
  { name: 'Sketch Up',         pct: 78 },
  { name: 'Revit',            pct: 82 },
];

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const [animated, setAnimated] = useState(false);
  const headingRef = useReveal<HTMLDivElement>();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-32 px-6 md:px-20 border-t border-zinc-800" id="skills">
      <div ref={headingRef} className="reveal flex items-end justify-between mb-16">
        <h2 className="text-[clamp(2.5rem,7vw,7rem)] font-bold uppercase tracking-tighter leading-none">Skills</h2>
        <span className="text-[10px] uppercase tracking-[0.4em] opacity-40 mb-2">[ Software Proficiency ]</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map(({ name, pct }, i) => (
          <div key={name} className="group border border-zinc-800 hover:border-zinc-600 bg-zinc-900/30 hover:bg-zinc-900/60 p-6 transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="shrink-0 opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                {icons[name]}
              </div>
              <div className="flex-1 flex items-start justify-between gap-2">
                <p className="text-sm font-semibold uppercase tracking-[0.12em] leading-tight">{name}</p>
                <span className="text-xl font-bold tracking-tighter text-brutalist-grey/60 group-hover:text-brutalist-grey transition-colors duration-300 shrink-0">
                  {pct}%
                </span>
              </div>
            </div>
            <div className="w-full h-[3px] bg-zinc-800 relative overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-brutalist-grey"
                style={{
                  width: animated ? `${pct}%` : '0%',
                  transition: animated ? `width 1s cubic-bezier(0.4,0,0.2,1) ${i * 80}ms` : 'none',
                }}
              />
            </div>
            <div className="flex justify-between mt-2">
              {[0, 25, 50, 75, 100].map((v) => (
                <span key={v} className="text-[9px] font-mono opacity-20">{v}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
