import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ThumbsUp, MessageSquare, Share2, Calendar, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { BlogService } from '../../services/blogService';
import { BlogPost as BlogPostType, BlogComment } from '../../types/blog';
import { CommentSection } from './CommentSection';

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const blogService = BlogService.getInstance();

  useEffect(() => {
    loadPost();
  }, [slug]);

  const loadPost = async () => {
    if (!slug) return;

    try {
      setLoading(true);
      setError(null);
      const data = await blogService.getPostBySlug(slug);
      if (!data) {
        throw new Error('Post não encontrado');
      }
      setPost(data);
    } catch (err: any) {
      console.error('Erro ao carregar post:', err);
      setError(err.message || 'Erro ao carregar o post');
      if (err.message === 'Post não encontrado') {
        navigate('/blog');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!post) return;

    try {
      await blogService.likePost(post.id);
      setPost(prev => prev ? { ...prev, likes: prev.likes + 1 } : null);
    } catch (err) {
      console.error('Erro ao curtir post:', err);
    }
  };

  const handleShare = async () => {
    if (!post) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Erro ao compartilhar:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      // Aqui você pode adicionar um toast notification
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={() => navigate('/blog')}
          className="btn-primary"
        >
          Voltar para o Blog
        </button>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="flex items-center justify-between text-gray-500 mb-6">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <User size={16} className="mr-1" />
              {post.author?.name}
            </span>
            <span className="flex items-center">
              <Calendar size={16} className="mr-1" />
              {new Date(post.publishedAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              className="flex items-center space-x-1 hover:text-indigo-600 transition-colors duration-300"
            >
              <ThumbsUp size={16} />
              <span>{post.likes}</span>
            </button>
            <button
              onClick={handleShare}
              className="flex items-center space-x-1 hover:text-indigo-600 transition-colors duration-300"
            >
              <Share2 size={16} />
              <span>Compartilhar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Cover Image */}
      {post.coverImage && (
        <div className="mb-8">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-96 object-cover rounded-lg"
          />
        </div>
      )}

      {/* Content */}
      <div className="prose max-w-none mb-12">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="mb-12">
          <div className="flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Comments Section */}
      <CommentSection postId={post.id} comments={post.comments || []} />
    </article>
  );
}
