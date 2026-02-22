import { useReveal } from '../hooks/useReveal';

const details = [
  { label: 'Based In', value: 'Phnom Penh, Cambodia' },
  { label: 'Available For', value: 'Freelance' },
  { label: 'Languages', value: 'Khmer, English' },
  { label: 'Education', value: 'BSc (Hons.) Architectural Studies — Limkokwing University' },
];

export default function About() {
  const headingRef = useReveal<HTMLHeadingElement>();
  const contentRef = useReveal<HTMLDivElement>(120);

  return (
    <section className="py-32 px-6 md:px-20 border-t border-zinc-800" id="about">

      {/* Section label */}
      <h2 ref={headingRef} className="reveal text-[clamp(3rem,10vw,10rem)] font-bold uppercase tracking-tighter leading-none mb-20">
        About US
      </h2>

      {/* Content — image left, text right */}
      <div ref={contentRef} className="reveal flex flex-col md:flex-row gap-12 md:gap-20 items-start">

        {/* Photo */}
        <div className="w-full md:w-[420px] shrink-0 relative">
          <img
            src="/about-me.JPG"
            alt="Te Hengchhay"
            className="w-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
          />
          <span className="absolute -top-3 -left-3 text-brutalist-grey/30 text-xl font-light select-none">+</span>
          <span className="absolute -bottom-3 -right-3 text-brutalist-grey/30 text-xl font-light select-none">+</span>
        </div>

        {/* Bio + details */}
        <div className="flex flex-col gap-12 flex-1">

          {/* Bio text */}
          <div>
            <p className="text-base md:text-lg leading-relaxed font-light opacity-90">
              As a passionate 3D Artist with more than 4 years diving deep into the world of architectural
              visualization, I've honed my ability to bring building concepts to life in the most visually stunning
              ways. There's nothing more satisfying to me than working closely with architects, designers, and
              clients, using my skills with top-notch software and tools, to transform their ideas into realistic,
              eye-catching 3D renderings and animations.
            </p>
          </div>

          {/* Personal details */}
          <div className="border-t border-zinc-800 pt-10 grid grid-cols-2 gap-6">
            {details.map(({ label, value }) => (
              <div key={label}>
                <p className="text-[10px] uppercase tracking-[0.3em] opacity-40 mb-1">{label}</p>
                <p className="text-sm font-medium">{value}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-6">
            <a
              href="https://t.me/Hengchhay08"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-brutalist-grey text-brutalist-black text-xs uppercase tracking-[0.25em] font-semibold hover:bg-white transition-colors duration-200"
            >
              Get In Touch
            </a>
          </div>
        </div>
      </div>

    </section>
  );
}

