import React from 'react';
import type { BreakfastCategory } from '../lib/contentful';

interface Props {
  categories: BreakfastCategory[];
  selectedCategory: string | null;
  onSelectCategory: (categoryName: string | null) => void;
}

export default function BreakfastCategories({ 
  categories, 
  selectedCategory, 
  onSelectCategory 
}: Props) {
  return (
    <div className="overflow-x-auto pb-4 mb-8 -mx-4 px-4 sm:px-0 sm:overflow-x-visible sm:mx-0">
      <div className="flex gap-4 min-w-max sm:min-w-0 sm:flex-wrap sm:justify-center">
        <button
          onClick={() => onSelectCategory(null)}
          className={`
            px-6 py-3 rounded-full font-semibold transition-all whitespace-nowrap
            ${!selectedCategory 
              ? 'bg-primary text-white shadow-lg shadow-primary/25' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
          `}
        >
          🍳 Todos
        </button>
        {categories.map(category => (
          <button
            key={category.name}
            onClick={() => onSelectCategory(category.name)}
            className={`
              px-6 py-3 rounded-full font-semibold transition-all whitespace-nowrap
              ${selectedCategory === category.name 
                ? 'bg-primary text-white shadow-lg shadow-primary/25' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
            `}
          >
            {category.icon} {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}