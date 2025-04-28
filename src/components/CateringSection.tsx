import React from 'react';
import CateringCard from './CateringCard';
import type { CateringItem } from '../lib/contentful';

interface Props {
  items: CateringItem[];
  'client:load'?: boolean;
}

export default function CateringSection({ items }: Props) {
  const [selectedType, setSelectedType] = React.useState<'dulce' | 'salado' | null>(null);

  const filteredItems = selectedType 
    ? items.filter(item => item.type === selectedType)
    : items;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-display font-bold text-center text-dark mb-4">
          Catering
        </h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
          Perfectos para eventos, reuniones y celebraciones especiales
        </p>

        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => setSelectedType(null)}
            className={`
              px-6 py-3 rounded-full font-semibold transition-all
              ${!selectedType 
                ? 'bg-primary text-white shadow-lg shadow-primary/25' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
            `}
          >
            Todos
          </button>
          <button
            onClick={() => setSelectedType('dulce')}
            className={`
              px-6 py-3 rounded-full font-semibold transition-all
              ${selectedType === 'dulce'
                ? 'bg-primary text-white shadow-lg shadow-primary/25' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
            `}
          >
            Dulce
          </button>
          <button
            onClick={() => setSelectedType('salado')}
            className={`
              px-6 py-3 rounded-full font-semibold transition-all
              ${selectedType === 'salado'
                ? 'bg-primary text-white shadow-lg shadow-primary/25' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
            `}
          >
            Salado
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map(item => (
            <CateringCard 
              key={item.name}
              {...item}
              client:load
            />
          ))}
        </div>
      </div>
    </section>
  );
}