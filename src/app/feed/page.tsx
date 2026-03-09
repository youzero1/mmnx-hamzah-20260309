'use client';

import { useState, useEffect } from 'react';
import FeedItem from '@/components/FeedItem';
import { CalculationData } from '@/types';

export default function FeedPage() {
  const [calculations, setCalculations] = useState<CalculationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCalculations = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/calculations');
      if (!res.ok) throw new Error('Failed to fetch calculations');
      const data = await res.json();
      setCalculations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalculations();
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-primary-700">Feed</h1>
        <button
          onClick={fetchCalculations}
          className="btn-secondary text-sm"
        >
          Refresh
        </button>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && calculations.length === 0 && (
        <div className="card text-center py-16">
          <p className="text-gray-500 text-lg">No calculations shared yet.</p>
          <p className="text-gray-400 mt-2">Be the first to share one from the Calculator!</p>
        </div>
      )}

      <div className="space-y-6">
        {calculations.map((calc) => (
          <FeedItem key={calc.id} calculation={calc} onUpdate={fetchCalculations} />
        ))}
      </div>
    </div>
  );
}
