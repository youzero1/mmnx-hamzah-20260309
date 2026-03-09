'use client';

import { CalculationData } from '@/types';
import LikeButton from './LikeButton';
import CommentSection from './CommentSection';

interface FeedItemProps {
  calculation: CalculationData;
  onUpdate: () => void;
}

export default function FeedItem({ calculation, onUpdate }: FeedItemProps) {
  const date = new Date(calculation.createdAt);
  const formatted = date.toLocaleString();

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-primary-700 font-bold text-sm">
              {calculation.username.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-semibold text-gray-800">{calculation.username}</p>
            <p className="text-xs text-gray-400">{formatted}</p>
          </div>
        </div>
        <span className="text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded-full font-medium">
          #calculation
        </span>
      </div>

      <div className="bg-gray-900 rounded-xl p-4 mb-4">
        <p className="text-gray-300 text-sm mb-1">{calculation.expression}</p>
        <p className="text-white text-3xl font-light">= {calculation.result}</p>
      </div>

      <div className="flex items-center gap-3">
        <LikeButton
          calculationId={calculation.id}
          initialLikeCount={calculation.likeCount}
          onUpdate={onUpdate}
        />
        <CommentSection
          calculationId={calculation.id}
          commentCount={calculation.commentCount}
        />
      </div>
    </div>
  );
}
