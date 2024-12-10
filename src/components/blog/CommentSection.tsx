import React, { useState } from 'react';
import { ThumbsUp, Reply, MoreVertical } from 'lucide-react';
import { BlogComment } from '../../types/blog';
import { BlogService } from '../../services/blogService';
import { useAuth } from '../../hooks/useAuth';

interface CommentSectionProps {
  postId: string;
  comments: BlogComment[];
}

export function CommentSection({ postId, comments: initialComments }: CommentSectionProps) {
  const [comments, setComments] = useState<BlogComment[]>(initialComments);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const blogService = BlogService.getInstance();

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      // Redirecionar para login ou mostrar modal de login
      return;
    }

    if (!newComment.trim()) return;

    try {
      setLoading(true);
      const comment = await blogService.addComment(postId, {
        content: newComment,
        parentId: replyTo,
        authorId: user.uid,
      });

      setComments(prev => [comment, ...prev]);
      setNewComment('');
      setReplyTo(null);
    } catch (err) {
      console.error('Erro ao adicionar comentário:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (!user) return;

    try {
      await blogService.likeComment(postId, commentId);
      setComments(prev =>
        prev.map(comment =>
          comment.id === commentId
            ? { ...comment, likes: comment.likes + 1 }
            : comment
        )
      );
    } catch (err) {
      console.error('Erro ao curtir comentário:', err);
    }
  };

  // Organiza comentários em uma estrutura hierárquica
  const organizeComments = (comments: BlogComment[]): BlogComment[] => {
    const commentMap = new Map<string, BlogComment>();
    const rootComments: BlogComment[] = [];

    comments.forEach(comment => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    comments.forEach(comment => {
      if (comment.parentId) {
        const parent = commentMap.get(comment.parentId);
        if (parent && parent.replies) {
          parent.replies.push(commentMap.get(comment.id)!);
        }
      } else {
        rootComments.push(commentMap.get(comment.id)!);
      }
    });

    return rootComments;
  };

  const renderComment = (comment: BlogComment, depth = 0) => (
    <div
      key={comment.id}
      className={`${depth > 0 ? 'ml-8' : ''} mb-4`}
    >
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex justify-between mb-2">
          <div className="flex items-center space-x-2">
            {comment.author?.photoURL && (
              <img
                src={comment.author.photoURL}
                alt={comment.author.name}
                className="w-8 h-8 rounded-full"
              />
            )}
            <div>
              <div className="font-medium">{comment.author?.name}</div>
              <div className="text-sm text-gray-500">
                {new Date(comment.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <MoreVertical size={16} />
          </button>
        </div>

        <p className="text-gray-700 mb-3">{comment.content}</p>

        <div className="flex items-center space-x-4 text-sm">
          <button
            onClick={() => handleLikeComment(comment.id)}
            className="flex items-center space-x-1 text-gray-500 hover:text-indigo-600"
          >
            <ThumbsUp size={14} />
            <span>{comment.likes}</span>
          </button>
          <button
            onClick={() => setReplyTo(comment.id)}
            className="flex items-center space-x-1 text-gray-500 hover:text-indigo-600"
          >
            <Reply size={14} />
            <span>Responder</span>
          </button>
        </div>
      </div>

      {/* Respostas recursivas */}
      {comment.replies?.map(reply => renderComment(reply, depth + 1))}
    </div>
  );

  const organizedComments = organizeComments(comments);

  return (
    <div className="mt-8" id="comments">
      <h3 className="text-2xl font-bold mb-6">Comentários ({comments.length})</h3>

      {/* Formulário de comentário */}
      <form onSubmit={handleSubmitComment} className="mb-8">
        <div className="mb-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={
              replyTo
                ? "Escreva uma resposta..."
                : "Deixe seu comentário..."
            }
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            rows={3}
          />
        </div>
        <div className="flex items-center justify-between">
          {replyTo && (
            <button
              type="button"
              onClick={() => setReplyTo(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              Cancelar resposta
            </button>
          )}
          <button
            type="submit"
            disabled={loading || !newComment.trim()}
            className="btn-primary"
          >
            {loading ? "Enviando..." : "Enviar comentário"}
          </button>
        </div>
      </form>

      {/* Lista de comentários */}
      <div className="space-y-4">
        {organizedComments.map(comment => renderComment(comment))}
      </div>
    </div>
  );
}
