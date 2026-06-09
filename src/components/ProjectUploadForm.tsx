import React, { useState, useRef } from 'react';
import { supabase } from '../lib/supabase';

interface ProjectUploadFormProps {
  onProjectAdded: () => void;
  onCancel: () => void;
  editProject?: {
    id: string;
    title: string;
    description: string;
    category: string;
    year: string;
    image_url: string;
    image_urls: string[];
  };
}

const CATEGORIES = ['Interior Design', 'Residential', 'Spatial Design', 'Wellness & Hospitality'];
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/quicktime'];
const ALLOWED_EXTS = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'mp4', 'mov'];

export default function ProjectUploadForm({ onProjectAdded, onCancel, editProject }: ProjectUploadFormProps) {
  const isEditing = !!editProject;
  const [title, setTitle] = useState(editProject?.title ?? '');
  const [description, setDescription] = useState(editProject?.description ?? '');
  const [category, setCategory] = useState(editProject?.category ?? 'Interior Design');
  const [year, setYear] = useState(editProject?.year ?? new Date().getFullYear().toString());

  // Existing saved URLs — user can remove individual ones
  const [existingUrls, setExistingUrls] = useState<string[]>(editProject?.image_urls ?? []);

  // New files to upload and append
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const addInputRef = useRef<HTMLInputElement>(null);

  const handleAddFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const invalid = files.find(f => !ALLOWED_TYPES.includes(f.type));
    if (invalid) { setError(`File type not allowed: ${invalid.name}`); return; }
    setError(null);
    setNewFiles(prev => [...prev, ...files]);
    Promise.all(
      files.map(file => new Promise<string>(resolve => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      }))
    ).then(previews => setNewPreviews(prev => [...prev, ...previews]));
    // Reset input so the same file can be added again
    e.target.value = '';
  };

  const removeExisting = (index: number) => {
    setExistingUrls(prev => prev.filter((_, i) => i !== index));
  };

  const removeNew = (index: number) => {
    setNewFiles(prev => prev.filter((_, i) => i !== index));
    setNewPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (!title.trim()) throw new Error('Please enter a project title');

      // Upload new files
      const uploadedUrls: string[] = [];
      for (const image of newFiles) {
        const rawExt = image.name.split('.').pop()?.toLowerCase() ?? '';
        const fileExt = ALLOWED_EXTS.includes(rawExt) ? rawExt : 'bin';
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('projects')
          .upload(`project-images/${fileName}`, image);
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from('projects').getPublicUrl(`project-images/${fileName}`);
        uploadedUrls.push(data.publicUrl);
      }

      const imageUrls = [...existingUrls, ...uploadedUrls];

      const payload = {
        title: title.trim(),
        description: description.trim(),
        category,
        year,
        image_url: imageUrls[0] ?? null,
        image_urls: imageUrls,
        updated_at: new Date().toISOString(),
      };

      if (isEditing) {
        const { error: updateError } = await supabase.from('projects').update(payload).eq('id', editProject.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase.from('projects').insert(payload);
        if (insertError) throw insertError;
      }

      onProjectAdded();
    } catch (err: any) {
      setError(err.message || 'Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  const totalCount = existingUrls.length + newPreviews.length;

  return (
    <div className="fixed inset-0 bg-brutalist-black z-50 overflow-y-auto">
      <div className="max-w-2xl mx-auto px-8 py-16">
        {/* Header */}
        <div className="flex items-start justify-between mb-12">
          <div>
            <p className="text-[10px] font-mono tracking-[0.3em] opacity-40 mb-3">
              {isEditing ? 'EDIT PROJECT' : 'NEW PROJECT'}
            </p>
            <h2 className="text-5xl font-bold uppercase tracking-tighter leading-none">
              {isEditing ? 'Edit' : 'Upload'}<br />Project
            </h2>
          </div>
          <button onClick={onCancel} className="text-zinc-600 hover:text-brutalist-grey transition-colors text-2xl font-light mt-2">✕</button>
        </div>

        {error && (
          <div className="border border-red-500/40 bg-red-500/10 text-red-400 px-4 py-3 text-sm font-mono mb-8">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-10">
          <div>
            <label className="block text-[10px] font-mono tracking-[0.3em] opacity-40 mb-3">PROJECT TITLE *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter project name"
              className="w-full px-0 py-3 bg-transparent border-b border-zinc-700 text-brutalist-grey placeholder-zinc-600 focus:outline-none focus:border-brutalist-grey transition-colors"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <label className="block text-[10px] font-mono tracking-[0.3em] opacity-40 mb-3">CATEGORY</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-0 py-3 bg-transparent border-b border-zinc-700 text-brutalist-grey focus:outline-none focus:border-brutalist-grey transition-colors appearance-none cursor-pointer"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="bg-brutalist-black">{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-mono tracking-[0.3em] opacity-40 mb-3">YEAR</label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="2025"
                className="w-full px-0 py-3 bg-transparent border-b border-zinc-700 text-brutalist-grey placeholder-zinc-600 focus:outline-none focus:border-brutalist-grey transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono tracking-[0.3em] opacity-40 mb-3">DESCRIPTION</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your project..."
              rows={3}
              className="w-full px-0 py-3 bg-transparent border-b border-zinc-700 text-brutalist-grey placeholder-zinc-600 focus:outline-none focus:border-brutalist-grey transition-colors resize-none"
            />
          </div>

          {/* Images */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-[10px] font-mono tracking-[0.3em] opacity-40">
                IMAGES — FIRST IS HERO
                {totalCount > 0 && <span className="ml-2 opacity-60">({totalCount})</span>}
              </label>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {/* Existing images */}
              {existingUrls.map((url, i) => (
                <div key={`existing-${i}`} className="relative group aspect-square">
                  <img src={url} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
                  {i === 0 && (
                    <span className="absolute bottom-1 left-1 text-[8px] font-mono tracking-widest bg-brutalist-black/80 text-yellow-400 px-1">HERO</span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeExisting(i)}
                    className="absolute top-1 right-1 w-5 h-5 bg-black/70 text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                  >
                    ✕
                  </button>
                </div>
              ))}

              {/* New file previews */}
              {newPreviews.map((src, i) => (
                <div key={`new-${i}`} className="relative group aspect-square ring-1 ring-yellow-400/40">
                  <img src={src} alt={`New ${i + 1}`} className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 left-1 text-[8px] font-mono tracking-widest bg-brutalist-black/80 text-yellow-400 px-1">NEW</span>
                  <button
                    type="button"
                    onClick={() => removeNew(i)}
                    className="absolute top-1 right-1 w-5 h-5 bg-black/70 text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                  >
                    ✕
                  </button>
                </div>
              ))}

              {/* + Add button */}
              <button
                type="button"
                onClick={() => addInputRef.current?.click()}
                className="aspect-square border border-dashed border-zinc-600 hover:border-brutalist-grey hover:bg-zinc-900 transition-colors flex flex-col items-center justify-center gap-1 cursor-pointer"
              >
                <span className="text-2xl text-zinc-500 leading-none">+</span>
                <span className="text-[9px] font-mono tracking-widest text-zinc-600">ADD</span>
              </button>
            </div>

            <input
              ref={addInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleAddFiles}
              className="hidden"
            />

            {totalCount === 0 && (
              <p className="text-[10px] font-mono tracking-[0.2em] opacity-30 mt-3">
                Click + to add images — PNG, JPG, WEBP, MP4
              </p>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-4 border border-zinc-700 text-zinc-500 font-bold uppercase tracking-widest text-sm hover:border-zinc-500 hover:text-brutalist-grey transition-colors"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-4 bg-brutalist-grey text-brutalist-black font-bold uppercase tracking-widest text-sm hover:bg-yellow-400 disabled:opacity-40 transition-colors duration-150"
            >
              {loading ? 'SAVING...' : isEditing ? 'SAVE CHANGES' : 'UPLOAD PROJECT'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
