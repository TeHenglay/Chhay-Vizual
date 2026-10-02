import { useReveal } from '../hooks/useReveal';

const rows = [
  { label: 'Telegram', value: '+855 96 898 9504', href: 'https://t.me/Hengchhay08' },
  { label: 'Email', value: 'chhayvizual@gmail.com', href: 'mailto:chhayvizual@gmail.com' },
  { label: 'Address', value: '#078, St 2, Tmei Village, Takmao Commune, Takmao District, Kandal Province, Cambodia' },
];

export default function Contact() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section id="contact" className="scroll-mt-24 lg:scroll-mt-10 pt-32">
      <h2 className="text-[13px] text-muted border-t border-line pt-4 mb-10">Contact</h2>

      <div ref={ref} className="reveal">
        <p className="text-[19px] md:text-[22px] leading-[1.5] font-light max-w-[36ch] mb-6">
          Open for new projects. Send drawings, references and a deadline.
        </p>
        <a
          href="mailto:chhayvizual@gmail.com"
          className="link-line inline-block text-[clamp(1.75rem,4.2vw,3.25rem)] font-light tracking-[-0.02em] leading-tight hover:text-accent"
        >
          chhayvizual@gmail.com
        </a>

        <dl className="mt-14 text-[13px] border-t border-line max-w-[720px]">
          {rows.map(({ label, value, href }) => (
            <div key={label} className="grid grid-cols-[120px_1fr] gap-4 py-3 border-b border-line">
              <dt className="text-muted">{label}</dt>
              <dd>
                {href ? (
                  <a href={href} className="link-line" target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
                    {value}
                  </a>
                ) : (
                  value
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
