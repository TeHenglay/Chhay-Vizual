import { Link } from 'react-router-dom';
import Media from './Media';
import { useReveal } from '../hooks/useReveal';
import { SIZES } from '../lib/media';
import { slugify, type PageProject } from '../hooks/useProjects';

function Card({ project, index }: { project: PageProject; index: number }) {
  const ref = useReveal<HTMLAnchorElement>((index % 2) * 120);
  const cover = project.media.find((m) => m.type === 'image') ?? project.media[0];

  return (
    <Link ref={ref} to={`/work/${slugify(project.title)}`} className="reveal group block">
      <div className="aspect-[4/3] overflow-hidden bg-surface">
        {cover && (
          <Media
            item={cover}
            alt={project.title}
            sizes={SIZES.half}
            className="w-full h-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.025]"
          />
        )}
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-4 text-[13px]">
        <span className="link-line">{project.title}</span>
        <span className="text-muted shrink-0">
          {project.category}, {project.year}
        </span>
      </div>
    </Link>
  );
}

export default function ProjectGrid({ projects }: { projects: PageProject[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-14">
      {projects.map((p, i) => (
        <Card key={p.id} project={p} index={i} />
      ))}
    </div>
  );
}
