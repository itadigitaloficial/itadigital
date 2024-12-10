import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ThumbsUp, MessageSquare, Share2 } from 'lucide-react';
import { BlogService } from '../../services/blogService';
import { BlogPost } from '../../types/blog';

const POSTS_PER_PAGE = 6;

export function BlogList() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const blogService = BlogService.getInstance();

  useEffect(() => {
    loadPosts();
  }, [currentPage]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      // Aqui vamos buscar apenas posts publicados
      const data = await blogService.getPosts('published');
      setPosts(data);
      // Em uma implementação real, você receberia o total de páginas do backend
      setTotalPages(Math.ceil(data.length / POSTS_PER_PAGE));
    } catch (err: any) {
      console.error('Erro ao carregar posts:', err);
      setError('Não foi possível carregar os posts. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async (post: BlogPost) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.origin + '/blog/' + post.slug,
        });
      } catch (err) {
        console.error('Erro ao compartilhar:', err);
      }
    } else {
      // Fallback para copiar link
      navigator.clipboard.writeText(window.location.origin + '/blog/' + post.slug);
      // Aqui você pode adicionar um toast notification
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[...Array(POSTS_PER_PAGE)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-4">
            <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={loadPosts}
          className="btn-primary"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  const paginatedPosts = posts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedPosts.map((post) => (
          <article
            key={post.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            {post.coverImage && (
              <Link to={`/blog/${post.slug}`}>
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-48 object-cover hover:opacity-90 transition-opacity duration-300"
                />
              </Link>
            )}
            <div className="p-6">
              <Link to={`/blog/${post.slug}`}>
                <h2 className="text-xl font-semibold mb-2 hover:text-indigo-600 transition-colors duration-300">
                  {post.title}
                </h2>
              </Link>
              <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-1 hover:text-indigo-600 transition-colors duration-300">
                    <ThumbsUp size={16} />
                    <span>{post.likes}</span>
                  </button>
                  <Link
                    to={`/blog/${post.slug}#comments`}
                    className="flex items-center space-x-1 hover:text-indigo-600 transition-colors duration-300"
                  >
                    <MessageSquare size={16} />
                    <span>{post.comments?.length || 0}</span>
                  </Link>
                </div>
                <button
                  onClick={() => handleShare(post)}
                  className="flex items-center space-x-1 hover:text-indigo-600 transition-colors duration-300"
                >
                  <Share2 size={16} />
                  <span>Compartilhar</span>
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded-md ${
                currentPage === i + 1
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
