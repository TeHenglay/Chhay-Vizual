import { Link } from 'react-router-dom';

const navLinks = [
  { label: 'Home',    href: '/',        internal: true },
  { label: 'Work',    href: '/projects', internal: true },
  { label: 'About',   href: '/#about',  internal: true },
  { label: 'Contact', href: '/#contact', internal: true },
];

export default function Navbar() {
  return (
    <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-1 md:gap-2 px-3 md:px-6 py-3 md:py-4 rounded-2xl bg-[#1a1a1a]/95 backdrop-blur-md border border-white/10 shadow-2xl">
        {/* Nav Links */}
        {navLinks.map(({ label, href, internal }) =>
          internal ? (
            <Link
              key={label}
              to={href}
              className="px-3 md:px-5 py-2 md:py-2.5 rounded-xl text-sm md:text-base font-medium text-brutalist-grey transition-all duration-200 whitespace-nowrap hover:bg-brutalist-grey hover:text-brutalist-black"
            >
              {label}
            </Link>
          ) : (
            <a
              key={label}
              href={href}
              className="px-3 md:px-5 py-2 md:py-2.5 rounded-xl text-sm md:text-base font-medium text-brutalist-grey transition-all duration-200 whitespace-nowrap hover:bg-brutalist-grey hover:text-brutalist-black"
            >
              {label}
            </a>
          )
        )}
      </div>
    </nav>
  );
}
