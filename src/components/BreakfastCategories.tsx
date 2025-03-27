import React from 'react';
import type { BreakfastCategory } from '../types/breakfast';

interface Props {
  categories: BreakfastCategory[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

export default function BreakfastCategories({ 
  categories, 
  selectedCategory, 
  onSelectCategory 
}: Props) {
  return (
    <div className="flex flex-wrap gap-4 justify-center mb-8">
      <button
        onClick={() => onSelectCategory(null)}
        className={`
          px-6 py-3 rounded-full font-semibold transition-all
          ${!selectedCategory 
            ? 'bg-primary text-white shadow-lg shadow-primary/25' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
        `}
      >
        🍳 Todos
      </button>
      {categories.map(category => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          className={`
            px-6 py-3 rounded-full font-semibold transition-all
            ${selectedCategory === category.id 
              ? 'bg-primary text-white shadow-lg shadow-primary/25' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
          `}
        >
          {category.icon} {category.name}
        </button>
      ))}
    </div>
  );
}