import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash, Eye, EyeOff, ThumbsUp, MessageSquare } from 'lucide-react';
import { BlogService } from '../../services/blogService';
import { BlogPost } from '../../types/blog';
import { BlogPostModal } from './modals/BlogPostModal';
import ReactMarkdown from 'react-markdown';

export function BlogManagement() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');

  const blogService = BlogService.getInstance();

  useEffect(() => {
    loadPosts();
  }, [filter]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await blogService.getPosts(filter);
      setPosts(data);
    } catch (err: any) {
      console.error('Erro ao carregar posts:', err);
      setError(err.message || 'Erro ao carregar posts');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    await loadPosts();
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('Tem certeza que deseja excluir este post?')) return;

    try {
      setError(null);
      await blogService.deletePost(postId);
      await loadPosts();
    } catch (err: any) {
      console.error('Erro ao excluir post:', err);
      setError(err.message || 'Erro ao excluir post');
    }
  };

  const handleStatusChange = async (post: BlogPost) => {
    try {
      setError(null);
      await blogService.updatePost(post.id, {
        status: post.status === 'published' ? 'draft' : 'published'
      });
      await loadPosts();
    } catch (err: any) {
      console.error('Erro ao alterar status:', err);
      setError(err.message || 'Erro ao alterar status');
    }
  };

  if (loading) return <div className="p-4">Carregando...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Blog</h2>
          <p className="text-gray-600">Gerencie seus posts</p>
        </div>
        <div className="flex gap-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="border rounded-lg px-3 py-2"
          >
            <option value="all">Todos</option>
            <option value="published">Publicados</option>
            <option value="draft">Rascunhos</option>
          </select>
          <button
            onClick={() => {
              setSelectedPost(null);
              setIsModalOpen(true);
            }}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            Novo Post
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        {posts.map(post => (
          <div
            key={post.id}
            className="bg-white rounded-lg shadow-md p-6 border border-gray-100"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                <p className="text-gray-600 mb-2">{post.excerpt}</p>
                <div className="flex gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <ThumbsUp size={16} />
                    {post.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare size={16} />
                    {post.views}
                  </span>
                  <span>
                    {new Date(post.publishedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleStatusChange(post)}
                  className={`btn-icon ${
                    post.status === 'published' ? 'text-green-500' : 'text-gray-500'
                  }`}
                  title={post.status === 'published' ? 'Despublicar' : 'Publicar'}
                >
                  {post.status === 'published' ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
                <button
                  onClick={() => {
                    setSelectedPost(post);
                    setIsModalOpen(true);
                  }}
                  className="btn-icon"
                  title="Editar"
                >
                  <Edit size={20} />
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="btn-icon text-red-500"
                  title="Excluir"
                >
                  <Trash size={20} />
                </button>
              </div>
            </div>

            {post.coverImage && (
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}

            <div className="prose max-w-none">
              <ReactMarkdown>{post.content.slice(0, 200)}...</ReactMarkdown>
            </div>

            <div className="mt-4 flex gap-2">
              {post.tags.map(tag => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <BlogPostModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedPost(null);
          }}
          onSave={handleSave}
          post={selectedPost}
        />
      )}
    </div>
  );
}
