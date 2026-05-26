import React from 'react';

// Placeholder – implement actual cohort table using your backend data structure
export default function RetentionMatrix({ data }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <p className="text-center text-gray-500">
        Cohort retention analysis will appear here once backend queries are fully implemented.
      </p>
      <p className="text-sm text-gray-400 text-center mt-2">
        Expecting weekly retention matrix with weeks 0–12.
      </p>
    </div>
  );
}