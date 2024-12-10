import React, { useState, useEffect } from 'react';
import { X, Upload, Plus } from 'lucide-react';
import { BlogService } from '../../../services/blogService';
import { BlogPost } from '../../../types/blog';
import ReactMarkdown from 'react-markdown';

interface BlogPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  post?: BlogPost | null;
}

export function BlogPostModal({ isOpen, onClose, onSave, post }: BlogPostModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [newTag, setNewTag] = useState('');
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);

  const blogService = BlogService.getInstance();

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setExcerpt(post.excerpt);
      setCoverImage(post.coverImage);
      setTags(post.tags);
      setStatus(post.status);
    } else {
      resetForm();
    }
  }, [post]);

  const resetForm = () => {
    setTitle('');
    setContent('');
    setExcerpt('');
    setCoverImage('');
    setTags([]);
    setStatus('draft');
    setNewTag('');
    setPreview(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const imageUrl = await blogService.uploadImage(file);
      setCoverImage(imageUrl);
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const postData = {
      title,
      slug,
      content,
      excerpt,
      coverImage,
      authorId: 'current-user-id', // TODO: Get from auth context
      tags,
      status
    };

    try {
      setLoading(true);
      if (post) {
        await blogService.updatePost(post.id, postData);
      } else {
        await blogService.createPost(postData);
      }
      onSave();
    } catch (error) {
      console.error('Erro ao salvar post:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">
            {post ? 'Editar Post' : 'Novo Post'}
          </h2>
          <div className="flex gap-4">
            <button
              onClick={() => setPreview(!preview)}
              className="btn-secondary"
            >
              {preview ? 'Editar' : 'Preview'}
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {preview ? (
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">{title}</h1>
            {coverImage && (
              <img
                src={coverImage}
                alt={title}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
            )}
            <div className="prose max-w-none">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-field w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Resumo
              </label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="input-field w-full h-20"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Conteúdo (Markdown)
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="input-field w-full h-64 font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Imagem de Capa
              </label>
              <div className="flex items-center gap-4">
                {coverImage && (
                  <img
                    src={coverImage}
                    alt="Cover"
                    className="w-24 h-24 object-cover rounded"
                  />
                )}
                <label className="btn-secondary cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Upload size={20} className="mr-2" />
                  Upload
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="input-field flex-1"
                  placeholder="Nova tag"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="btn-secondary"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
                className="input-field w-full"
              >
                <option value="draft">Rascunho</option>
                <option value="published">Publicado</option>
              </select>
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
