import React, { useState } from 'react';
import BreakfastCategories from './BreakfastCategories';
import BreakfastCard from './BreakfastCard';
import { breakfasts, breakfastCategories } from '../data/breakfast';

export default function BreakfastMenu() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredBreakfasts = selectedCategory
    ? breakfasts.filter(breakfast => breakfast.categoryId === selectedCategory)
    : breakfasts;

  return (
    <div className="space-y-8">
      <BreakfastCategories
        categories={breakfastCategories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredBreakfasts.map(breakfast => (
          <BreakfastCard key={breakfast.id} {...breakfast} />
        ))}
      </div>
    </div>
  );
}