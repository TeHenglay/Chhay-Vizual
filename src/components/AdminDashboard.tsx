import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import ProjectUploadForm from './ProjectUploadForm';

type Project = {
  id: string;
  title: string;
  description: string;
  category: string;
  year: string;
  image_url: string;
  image_urls: string[];
  created_at: string;
};

function DeleteModal({ title, onConfirm, onCancel }: { title: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-black/70" onClick={onCancel} />
      <div className="relative bg-brutalist-black border border-zinc-700 w-full max-w-sm p-8">
        <p className="text-[10px] font-mono tracking-[0.3em] opacity-40 mb-4">CONFIRM DELETE</p>
        <h3 className="text-2xl font-bold uppercase tracking-tighter leading-tight mb-2">Delete Project?</h3>
        <p className="text-sm opacity-50 mb-8 leading-relaxed">
          "<span className="text-brutalist-grey opacity-80">{title}</span>" will be permanently removed.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 border border-zinc-700 text-zinc-500 text-xs font-bold uppercase tracking-widest hover:border-zinc-500 hover:text-brutalist-grey transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 bg-red-600 text-white text-xs font-bold uppercase tracking-widest hover:bg-red-500 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) { navigate('/admin/login'); return; }
        setUser(session.user);
        loadProjects();
      } catch {
        navigate('/admin/login');
      }
    };
    checkAuth();
  }, [navigate]);

  const loadProjects = async () => {
    setLoading(true);
    const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    setProjects(data || []);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const handleDeleteProject = async (id: string) => {
    await supabase.from('projects').delete().eq('id', id);
    setDeleteTarget(null);
    loadProjects();
  };

  const handleFormDone = () => {
    setShowUploadForm(false);
    setEditingProject(null);
    loadProjects();
  };

  if (!user) return (
    <div className="min-h-screen bg-brutalist-black text-brutalist-grey font-sans flex items-center justify-center">
      <p className="text-[10px] font-mono tracking-[0.3em] opacity-40">LOADING...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-brutalist-black text-brutalist-grey font-sans">
      {/* Delete confirmation modal */}
      {deleteTarget && (
        <DeleteModal
          title={deleteTarget.title}
          onConfirm={() => handleDeleteProject(deleteTarget.id)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* Upload / Edit overlay */}
      {(showUploadForm || editingProject) && (
        <ProjectUploadForm
          onProjectAdded={handleFormDone}
          onCancel={() => { setShowUploadForm(false); setEditingProject(null); }}
          editProject={editingProject ?? undefined}
        />
      )}

      {/* Top bar */}
      <div className="border-b border-zinc-800 px-8 md:px-16 py-5 flex items-center justify-between sticky top-0 bg-brutalist-black z-10">
        <div>
          <p className="text-[10px] font-mono tracking-[0.3em] opacity-40">CHHAY VIZUAL</p>
          <p className="text-sm font-bold uppercase tracking-widest">Admin Dashboard</p>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-[10px] font-mono opacity-40 hidden md:block">{user.email}</span>
          <button
            onClick={handleLogout}
            className="px-5 py-2 border border-zinc-700 text-[10px] font-mono tracking-[0.2em] hover:border-brutalist-grey hover:text-brutalist-grey transition-colors"
          >
            LOGOUT
          </button>
        </div>
      </div>

      <div className="px-8 md:px-16 py-16">
        {/* Heading + add */}
        <div className="flex items-end justify-between mb-16 border-b border-zinc-800 pb-10">
          <div>
            <p className="text-[10px] font-mono tracking-[0.3em] opacity-40 mb-3">MANAGE</p>
            <h1 className="text-[clamp(3rem,8vw,8rem)] font-bold uppercase tracking-tighter leading-none">Projects</h1>
          </div>
          <button
            onClick={() => setShowUploadForm(true)}
            className="px-8 py-4 bg-brutalist-grey text-brutalist-black font-bold uppercase tracking-widest text-sm hover:bg-yellow-400 transition-colors duration-150 shrink-0 mb-2"
          >
            + Add Project
          </button>
        </div>

        {/* Grid */}
        {loading ? (
          <p className="text-[10px] font-mono tracking-[0.3em] opacity-40">LOADING PROJECTS...</p>
        ) : projects.length === 0 ? (
          <div className="border border-zinc-800 py-24 text-center">
            <p className="text-[10px] font-mono tracking-[0.3em] opacity-40">NO PROJECTS YET</p>
            <p className="text-sm opacity-30 mt-3">Click "+ Add Project" to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="border border-zinc-800 group">
                {/* Image */}
                <div className="w-full overflow-hidden bg-zinc-900 relative" style={{ height: '220px' }}>
                  {project.image_url ? (
                    <img
                      src={project.image_url}
                      alt={project.title}
                      loading="lazy"
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <p className="text-[10px] font-mono tracking-[0.2em] opacity-20">NO IMAGE</p>
                    </div>
                  )}
                  {/* Image count badge */}
                  {project.image_urls?.length > 1 && (
                    <span className="absolute bottom-3 right-3 bg-brutalist-black/80 text-brutalist-grey text-[10px] font-mono tracking-widest px-2 py-1">
                      {project.image_urls.length} IMGS
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-5 border-t border-zinc-800">
                  <p className="text-[10px] font-mono tracking-[0.3em] opacity-40 mb-1">
                    {project.category} &nbsp;·&nbsp; {project.year}
                  </p>
                  <h3 className="text-lg font-bold uppercase tracking-tighter leading-tight">{project.title}</h3>
                  {project.description && (
                    <p className="text-xs opacity-40 line-clamp-2 mt-2">{project.description}</p>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-3 mt-5">
                    <button
                      onClick={() => setEditingProject(project)}
                      className="flex-1 py-3 border border-zinc-600 text-xs font-bold uppercase tracking-widest hover:bg-yellow-400 hover:text-brutalist-black hover:border-yellow-400 transition-colors duration-150"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteTarget(project)}
                      className="flex-1 py-3 border border-zinc-600 text-xs font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors duration-150"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="text-[10px] font-mono tracking-[0.3em] opacity-20 mt-10">
          {projects.length} PROJECT{projects.length !== 1 ? 'S' : ''}
        </p>
      </div>
    </div>
  );
}
