import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import BentoGallery from '../components/BentoGallery';
import { useProjectsState, slugify } from '../hooks/useProjects';
import { useMeta } from '../hooks/useMeta';
import { projectMeta } from '../lib/seo';

export default function ProjectPage() {
  const { slug } = useParams();
  const { projects, ready } = useProjectsState();
  const index = projects.findIndex((p) => slugify(p.title) === slug);
  const project = projects[index];

  useMeta(useMemo(() => (project ? projectMeta(project) : null), [project]), {
    noindex: ready && !project,
  });

  if (!project) {
    // Uploaded projects arrive a moment after first render — wait before saying "not found"
    if (!ready) return <Layout><div className="min-h-[60vh]" aria-busy="true" /></Layout>;
    return (
      <Layout>
        <h1 className="text-[19px] md:text-[22px] font-light lg:pt-1">This project could not be found.</h1>
        <Link to="/projects" className="link-line inline-block mt-6 text-[13px] text-muted hover:text-ink">
          See all work
        </Link>
      </Layout>
    );
  }

  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];

  const meta = [
    { label: 'Category', value: project.category },
    { label: 'Year', value: project.year },
    { label: 'Location', value: project.location },
    { label: 'Renders', value: String(project.media.length) },
  ].filter((m): m is { label: string; value: string } => Boolean(m.value));

  return (
    <Layout>
      <header key={project.id} className="fade-up mb-14 lg:mb-20 lg:pt-1 grid grid-cols-1 md:grid-cols-2 gap-8">
        <h1 className="text-[clamp(1.75rem,3.4vw,2.75rem)] font-light tracking-[-0.02em] leading-[1.1] [text-wrap:balance]">
          {project.title}
        </h1>
        <div className="md:pt-2 flex flex-col gap-6">
          <dl className="text-[13px] grid grid-cols-[100px_auto] gap-x-4 gap-y-1.5 md:self-end">
            {meta.map(({ label, value }) => (
              <div key={label} className="contents">
                <dt className="text-muted">{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          {project.description && (
            <p className="text-[15px] leading-relaxed max-w-[60ch] [text-wrap:pretty]">{project.description}</p>
          )}
        </div>
      </header>

      <BentoGallery key={`media-${project.id}`} media={project.media} title={project.title} />

      <nav className="mt-20 border-t border-line pt-6 grid grid-cols-2 gap-6 text-[13px]" aria-label="More projects">
        <Link to={`/work/${slugify(prev.title)}`} className="group py-1">
          <span className="block text-muted mb-1">Previous</span>
          <span className="link-line">{prev.title}</span>
        </Link>
        <Link to={`/work/${slugify(next.title)}`} className="group py-1 text-right">
          <span className="block text-muted mb-1">Next</span>
          <span className="link-line">{next.title}</span>
        </Link>
      </nav>
    </Layout>
  );
}
