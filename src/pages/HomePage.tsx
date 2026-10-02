import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Media from '../components/Media';
import ProjectGrid from '../components/ProjectGrid';
import About from '../components/About';
import Contact from '../components/Contact';
import { usePageProjects, slugify } from '../hooks/useProjects';
import { useMeta } from '../hooks/useMeta';
import { homeMeta } from '../lib/seo';

const META = homeMeta();

export default function HomePage() {
  const projects = usePageProjects();
  const [featured, ...rest] = projects;
  useMeta(META);

  return (
    <Layout>
      {/* Not shown, but kept as the page's heading for search engines and screen readers */}
      <h1 className="sr-only">Chhay Vizual — architectural visualization by Te Hengchhay, Phnom Penh</h1>

      {featured && (
        // Stretched link: the whole block is clickable, while the video's
        // pause button sits above it instead of being nested inside a link
        <article className="group relative">
          <div className="aspect-[4/3] md:aspect-[16/9] overflow-hidden bg-surface">
            <Media item={featured.media[0]} alt={featured.title} priority controls className="w-full h-full object-cover" />
          </div>
          <div className="mt-3 flex items-baseline justify-between gap-4 text-[13px]">
            <Link
              to={`/work/${slugify(featured.title)}`}
              className="link-line after:content-[''] after:absolute after:inset-0"
            >
              {featured.title}
            </Link>
            <span className="text-muted">
              {featured.category}, {featured.year}
            </span>
          </div>
        </article>
      )}

      <div className="mt-14">
        <ProjectGrid projects={rest} />
      </div>

      <About />
      <Contact />
    </Layout>
  );
}
