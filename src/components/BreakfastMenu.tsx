import React, { useState } from 'react';
import BreakfastCategories from './BreakfastCategories';
import BreakfastCard from './BreakfastCard';
import type { Breakfast, BreakfastCategory, Beverage, Cake } from '../lib/contentful';

interface Props {
  breakfasts: Breakfast[];
  categories: BreakfastCategory[];
  beverages: Beverage[];
  cakes: Cake[];
}

export default function BreakfastMenu({ breakfasts, categories, beverages, cakes }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  if (!breakfasts?.length) {
    console.warn('No breakfasts available');
    return null;
  }

  const filteredBreakfasts = selectedCategory
    ? breakfasts.filter(breakfast => breakfast.category.fields.name === selectedCategory)
    : breakfasts;

  return (
    <div className="space-y-8">
      <BreakfastCategories
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredBreakfasts.map(breakfast => {
          console.log(`Rendering breakfast "${breakfast.name}":`);
          console.log('- Media data:', breakfast.media);

          let imageUrl = 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=600';
          
          if (breakfast.media?.fields?.file?.url) {
            imageUrl = `https:${breakfast.media.fields.file.url}`;
          }

          console.log('- Final image URL:', imageUrl);

          return (
            <BreakfastCard 
              key={breakfast.name}
              name={breakfast.name}
              description={breakfast.description}
              price={breakfast.price}
              image={imageUrl}
              type={breakfast.type}
              beverages={beverages}
              cakes={cakes}
              client:load
            />
          );
        })}
      </div>
    </div>
  );
}