import React, { useEffect, useRef, useState } from 'react';
import { fetchHeatmapData}  from '../AnalyticsDashboard/api';

export default function HeatmapView() {
  const canvasRef = useRef(null);
  const [page, setPage] = useState('/');
  const [loading, setLoading] = useState(false);

  const loadHeatmap = async () => {
    setLoading(true);
    try {
      const points = await fetchHeatmapData(page);
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Draw background
      ctx.fillStyle = '#f3f4f6';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // Draw click points as translucent circles
      points.forEach(point => {
        const x = point.x * canvas.width;
        const y = point.y * canvas.height;
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(239, 68, 68, 0.4)';
        ctx.fill();
        ctx.fillStyle = 'rgba(239, 68, 68, 0.8)';
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 2 * Math.PI);
        ctx.fill();
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHeatmap();
  }, [page]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Page URL</label>
        <input
          type="text"
          value={page}
          onChange={(e) => setPage(e.target.value)}
          placeholder="/, /about, /research, etc."
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
        />
      </div>
      {loading && <div className="text-center text-gray-500">Loading heatmap...</div>}
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="w-full h-auto border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-900"
      />
      <p className="text-sm text-gray-500">Click density heatmap for selected page (last 30 days).</p>
    </div>
  );
}