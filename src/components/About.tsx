import { useReveal } from '../hooks/useReveal';

const details = [
  { label: 'Based in', value: 'Phnom Penh, Cambodia' },
  { label: 'Available for', value: 'Freelance' },
  { label: 'Languages', value: 'Khmer, English' },
  { label: 'Education', value: 'BSc (Hons.) Architectural Studies, Limkokwing University' },
  { label: 'Software', value: '3ds Max, Corona Render, Lumion, Enscape, SketchUp, Revit, AutoCAD, Photoshop, Illustrator' },
];

export default function About() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section id="about" className="scroll-mt-24 lg:scroll-mt-10 pt-32">
      <h2 className="text-[13px] text-muted border-t border-line pt-4 mb-10">About</h2>

      <div ref={ref} className="reveal grid grid-cols-1 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-10 md:gap-14">
        <img
          src="/about-me.webp"
          width={840}
          height={614}
          alt="Te Hengchhay"
          loading="lazy"
          className="w-full max-w-[420px] aspect-[4/5] object-cover grayscale hover:grayscale-0 transition-[filter] duration-700"
        />

        <div className="flex flex-col gap-12">
          <p className="text-[19px] md:text-[22px] leading-[1.5] font-light max-w-[36ch]">
            I'm a 3D artist with more than four years in architectural visualization,
            working closely with architects, designers and clients to turn their ideas
            into realistic renderings and animations.
          </p>

          <dl className="text-[13px] border-t border-line">
            {details.map(({ label, value }) => (
              <div key={label} className="grid grid-cols-[120px_1fr] gap-4 py-3 border-b border-line">
                <dt className="text-muted">{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
