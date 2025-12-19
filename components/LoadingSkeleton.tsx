import React from 'react';

export const ProjectCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-600 border-2 border-black dark:border-white rounded-lg p-6 shadow-neo dark:shadow-[2px_2px_0px_0px_#fff] animate-pulse">
      <div className="flex items-start justify-between mb-4 gap-4">
        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-500 rounded-md"></div>
        <div className="flex-1">
          <div className="h-6 bg-gray-200 dark:bg-gray-500 rounded mb-2 w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-500 rounded w-1/4"></div>
        </div>
      </div>
      <div className="h-4 bg-gray-200 dark:bg-gray-500 rounded mb-2"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-500 rounded w-5/6"></div>
    </div>
  );
};

export const ToolCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-600 border-2 border-black dark:border-white rounded-lg p-6 shadow-neo dark:shadow-[2px_2px_0px_0px_#fff] animate-pulse">
      <div className="h-6 bg-gray-200 dark:bg-gray-500 rounded mb-3 w-2/3"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-500 rounded mb-2"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-500 rounded w-4/5"></div>
    </div>
  );
};

export const ReviewSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-600 border-2 border-black dark:border-white rounded-lg p-4 shadow-neo-sm animate-pulse">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-500 rounded-full"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 dark:bg-gray-500 rounded w-1/3 mb-2"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-500 rounded w-1/4"></div>
        </div>
      </div>
      <div className="h-4 bg-gray-200 dark:bg-gray-500 rounded mb-2"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-500 rounded w-5/6"></div>
    </div>
  );
};
