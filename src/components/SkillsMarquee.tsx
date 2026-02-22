const skills = [
  'Microsoft Office',
  '3DS Max',
  'Corona Render',
  'Lumion',
  'Adobe Photoshop',
  'Adobe Illustrator',
  'Auto CAD',
  'Sketch Up',
  'Enscape',
];

const Separator = () => (
  <span className="mx-10 text-brutalist-grey/20 text-lg select-none">✦</span>
);

const Track = () => (
  <>
    {skills.map((skill, i) => (
      <span key={i} className="flex items-center shrink-0">
        <span className="text-sm md:text-base font-semibold uppercase tracking-[0.2em] text-brutalist-grey whitespace-nowrap">
          {skill}
        </span>
        <Separator />
      </span>
    ))}
  </>
);

export default function SkillsMarquee() {
  return (
    <div className="w-full border-t border-b border-zinc-800 bg-brutalist-black py-5 overflow-hidden">
      {/* animate-marquee moves -50%: since we have 2 identical tracks, it loops perfectly */}
      <div className="flex animate-marquee">
        <Track />
        <Track />
      </div>
    </div>
  );
}

