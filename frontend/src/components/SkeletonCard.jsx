// src/components/SkeletonCard.js
import React from 'react';

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      {/* Shimmering image placeholder */}
      <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
      <div className="p-6">
        {/* Shimmering text placeholders */}
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-md w-3/4 mb-3 animate-pulse"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-1/2 mb-4 animate-pulse"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-full mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-full mb-4 animate-pulse"></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-full animate-pulse"></div>
      </div>
    </div>
  );
}

export default SkeletonCard;