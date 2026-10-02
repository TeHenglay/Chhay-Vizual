import { useMemo } from 'react';
import Layout from '../components/Layout';
import ProjectGrid from '../components/ProjectGrid';
import { usePageProjects } from '../hooks/useProjects';
import { useMeta } from '../hooks/useMeta';
import { workMeta } from '../lib/seo';

export default function ProjectsPage() {
  const projects = usePageProjects();

  useMeta(useMemo(() => workMeta(projects.length), [projects.length]));

  return (
    <Layout>
      <header className="fade-up mb-14 lg:mb-20 lg:pt-1 flex items-baseline justify-between gap-6">
        <h1 className="text-[19px] md:text-[22px] font-light">Work</h1>
        <span className="text-[13px] text-muted">{projects.length} projects</span>
      </header>
      <ProjectGrid projects={projects} />
    </Layout>
  );
}
