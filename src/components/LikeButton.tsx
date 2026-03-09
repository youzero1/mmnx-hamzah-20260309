'use client';

import { useState } from 'react';

interface LikeButtonProps {
  calculationId: number;
  initialLikeCount: number;
  onUpdate?: () => void;
}

export default function LikeButton({ calculationId, initialLikeCount, onUpdate }: LikeButtonProps) {
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ calculationId, username: 'Anonymous' }),
      });
      if (!res.ok) throw new Error('Failed to toggle like');
      const data = await res.json();
      setLiked(data.liked);
      setLikeCount((prev) => (data.liked ? prev + 1 : prev - 1));
      onUpdate?.();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
        liked
          ? 'bg-red-50 text-red-600 border border-red-200'
          : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200'
      } disabled:opacity-60`}
    >
      <span>{liked ? '❤️' : '🤍'}</span>
      <span>{likeCount}</span>
    </button>
  );
}
