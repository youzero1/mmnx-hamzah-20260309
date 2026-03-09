'use client';

import { useState, useEffect } from 'react';
import { CommentData } from '@/types';

interface CommentSectionProps {
  calculationId: number;
  commentCount: number;
}

export default function CommentSection({ calculationId, commentCount }: CommentSectionProps) {
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState<CommentData[]>([]);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [count, setCount] = useState(commentCount);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/comments?calculationId=${calculationId}`);
      if (!res.ok) throw new Error('Failed to fetch comments');
      const data = await res.json();
      setComments(data);
      setCount(data.length);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) fetchComments();
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ calculationId, content: content.trim(), username: 'Anonymous' }),
      });
      if (!res.ok) throw new Error('Failed to add comment');
      setContent('');
      await fetchComments();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-gray-50 text-gray-600 border border-gray-200 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 transition-all duration-200"
      >
        <span>💬</span>
        <span>{count} {count === 1 ? 'comment' : 'comments'}</span>
      </button>

      {open && (
        <div className="mt-4 border-t border-gray-100 pt-4">
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div className="space-y-3 mb-4">
              {comments.length === 0 && (
                <p className="text-gray-400 text-sm text-center py-2">No comments yet. Be the first!</p>
              )}
              {comments.map((c) => (
                <div key={c.id} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm text-primary-700">{c.username}</span>
                    <span className="text-xs text-gray-400">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm">{c.content}</p>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              maxLength={500}
            />
            <button
              type="submit"
              disabled={submitting || !content.trim()}
              className="btn-primary text-sm py-2 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? '...' : 'Post'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
