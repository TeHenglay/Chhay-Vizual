import { Link } from 'react-router-dom';

const socials = [
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/chhayvizual',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: 'Telegram',
    href: 'https://t.me/Hengchhay08',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21.5 2.5 2.5 9.5l7 2m12-9-5 17-5-7m5-10-7 9" />
        <path d="m9.5 11.5 5 5" />
      </svg>
    ),
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@chhayvizual',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
      </svg>
    ),
  },
  {
    label: 'Behance',
    href: 'https://www.behance.net/tehengchhay168',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
        <path d="M7.5 11.25c.97 0 1.75-.78 1.75-1.75S8.47 7.75 7.5 7.75H4v3.5h3.5zm.25 2.25H4v3.75h3.75c1.1 0 2-.9 2-2s-.9-1.75-2-1.75zM2 6h6.25C10.6 6 12.5 7.4 12.5 9.5c0 1.3-.7 2.4-1.75 3 1.4.5 2.25 1.7 2.25 3.25C13 18 11 20 8.5 20H2V6zm13.5 2.5h5.5v-1.5h-5.5v1.5zm2.75 9c1.1 0 2-.6 2.3-1.5h2c-.5 2-2.2 3.5-4.3 3.5-2.8 0-4.75-2-4.75-4.75s2-4.75 4.75-4.75c2.8 0 4.75 2.2 4.75 5.25v.25h-7c.3 1.25 1.1 2 2.25 2zm2-5.5c-.25-1.1-1-1.75-2-1.75s-1.75.65-2 1.75H20.25z" />
      </svg>
    ),
  },
];

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 px-8 md:px-14 py-7 flex justify-between items-center">
      {/* Left — Logo */}
      <Link to="/">
        <img
          src="/chay-logo.png"
          alt="Chhay Vizual"
          className="h-16 w-auto object-contain"
        />
      </Link>

      {/* Right — Social icons */}
      <div className="flex items-center gap-7">
        {socials.map(({ label, href, icon }) => (
          <a
            key={label}
            href={href}
            aria-label={label}
            className="text-brutalist-grey/50 hover:text-brutalist-grey transition-colors duration-200"
          >
            {icon}
          </a>
        ))}
      </div>
    </header>
  );
}
