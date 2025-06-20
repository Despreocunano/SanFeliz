import React, { useState } from 'react';
import type { Beverage, Cake, BreakfastAddition, BreakfastType } from '../lib/contentful';

interface Props {
  name: string;
  description: string;
  price: number;
  image: string;
  type?: 'simple' | 'double' | 'bowl';
  beverages: Beverage[];
  cakes: Cake[];
  featured?: boolean;
  'client:load'?: boolean;
  features?: string[];
  availableAdditions?: BreakfastAddition[];
  availableTypes?: BreakfastType[];
}

interface SelectionCounts {
  [key: string]: number;
}

const formatPrice = (price: number | undefined) => {
  if (typeof price === 'undefined' || isNaN(price)) return '';
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
  }).format(price);
};

export default function BreakfastCard({ 
  name, 
  description, 
  price, 
  image, 
  type = 'simple',
  beverages,
  cakes,
  featured = false,
  features = [],
  availableAdditions = [],
  availableTypes = []
}: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHotBeverage, setSelectedHotBeverage] = useState<string>('');
  const [selectedColdBeverage, setSelectedColdBeverage] = useState<string>('');
  const [selectedCake, setSelectedCake] = useState<string>('');
  const [selectedAddition, setSelectedAddition] = useState<string>('');
  const [selectedBreakfastType, setSelectedBreakfastType] = useState<string>('');
  const [hotBeverageCounts, setHotBeverageCounts] = useState<SelectionCounts>({});
  const [coldBeverageCounts, setColdBeverageCounts] = useState<SelectionCounts>({});
  const [cakeCounts, setCakeCounts] = useState<SelectionCounts>({});
  const [includeCustomBowl, setIncludeCustomBowl] = useState(false);
  const [additionalNotes, setAdditionalNotes] = useState('');

  const hotBeverages = beverages.filter(b => b.type === 'hot');
  const coldBeverages = beverages.filter(b => b.type === 'cold');

  const customBowl = {
    name: "Tazón Personalizado",
    price: 4990
  };

  const getTotalSelections = (counts: SelectionCounts) => {
    return Object.values(counts).reduce((sum, count) => sum + count, 0);
  };

  const handleCountChange = (
    name: string,
    counts: SelectionCounts,
    setCounts: React.Dispatch<React.SetStateAction<SelectionCounts>>,
    increment: boolean
  ) => {
    const currentCount = counts[name] || 0;
    const totalSelections = getTotalSelections(counts);

    if (increment && totalSelections >= 2) return;
    if (!increment && currentCount === 0) return;

    setCounts(prev => ({
      ...prev,
      [name]: increment ? (currentCount + 1) : (currentCount - 1)
    }));
  };

  const SelectionButton = ({ 
    name, 
    counts, 
    setCounts 
  }: { 
    name: string; 
    counts: SelectionCounts; 
    setCounts: React.Dispatch<React.SetStateAction<SelectionCounts>> 
  }) => (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => handleCountChange(name, counts, setCounts, false)}
        className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
      >
        -
      </button>
      <span className="w-8 text-center">{counts[name] || 0}</span>
      <button
        onClick={() => handleCountChange(name, counts, setCounts, true)}
        className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
      >
        +
      </button>
    </div>
  );

  const getTotalPrice = () => {
    const bowlPrice = !featured && includeCustomBowl ? customBowl.price : 0;
    const additionPrice = selectedAddition ? 
      availableAdditions.find(a => a.name === selectedAddition)?.price || 0 : 0;
    const typePrice = selectedBreakfastType ? 
      availableTypes.find(t => t.name === selectedBreakfastType)?.price || 0 : 0;
    return price + bowlPrice + additionPrice + typePrice;
  };

  const handleModalClose = (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
    if (e.target === e.currentTarget) {
      setIsModalOpen(false);
    }
  };

  const handleModalOpen = () => {
    const fbq = window.fbq;
    if (typeof fbq === 'function') {
      fbq('track', 'ViewContent', {
        content_name: name,
        content_type: 'product',
        content_ids: [name],
        value: price,
        currency: 'CLP'
      });
    }
    setIsModalOpen(true);
  };

  const handleWhatsAppOrder = () => {
    if (!isFormValid()) return;

    const fbq = window.fbq;
    if (typeof fbq === 'function') {
      fbq('track', 'Purchase', {
        content_name: name,
        content_type: 'product',
        content_ids: [name],
        value: getTotalPrice(),
        currency: 'CLP'
      });
    }

    let message = `¡Hola! Me gustaría ordenar:\n\n🍳 ${name}\n`;

    if (selectedAddition) {
      const addition = availableAdditions.find(a => a.name === selectedAddition);
      message += `➕ Agregado: ${addition?.name}${addition?.price ? ` (${formatPrice(addition.price)})` : ''}\n`;
    }

    if (selectedBreakfastType) {
      const breakfastType = availableTypes.find(t => t.name === selectedBreakfastType);
      message += `📦 Tipo: ${breakfastType?.name}${breakfastType?.price ? ` (${formatPrice(breakfastType.price)})` : ''}\n`;
    }

    if (type === 'simple' && (hotBeverages.length > 0 || coldBeverages.length > 0 || cakes.length > 0)) {
      if (hotBeverages.length > 0) {
        const selectedHotBeverageName = hotBeverages.find(b => b.name === selectedHotBeverage)?.name || 'No seleccionado';
        message += `☕ Bebida Caliente: ${selectedHotBeverageName}\n`;
      }
      if (coldBeverages.length > 0) {
        const selectedColdBeverageName = coldBeverages.find(b => b.name === selectedColdBeverage)?.name || 'No seleccionado';
        message += `🥤 Bebida Fría: ${selectedColdBeverageName}\n`;
      }
      if (cakes.length > 0) {
        const selectedCakeName = cakes.find(c => c.name === selectedCake)?.name || 'No seleccionado';
        message += `🍰 Pastel: ${selectedCakeName}\n`;
      }
    } else if (type === 'double') {
      if (hotBeverages.length > 0) {
        message += '\nBebidas Calientes:\n';
        Object.entries(hotBeverageCounts).forEach(([name, count]) => {
          if (count > 0) {
            message += `☕ ${name} x${count}\n`;
          }
        });
      }

      if (coldBeverages.length > 0) {
        message += '\nBebidas Frías:\n';
        Object.entries(coldBeverageCounts).forEach(([name, count]) => {
          if (count > 0) {
            message += `🥤 ${name} x${count}\n`;
          }
        });
      }

      if (cakes.length > 0) {
        message += '\nPasteles:\n';
        Object.entries(cakeCounts).forEach(([name, count]) => {
          if (count > 0) {
            message += `🍰 ${name} x${count}\n`;
          }
        });
      }
    }

    if (includeCustomBowl) {
      message += `\n🎨 Con Tazón Personalizado\n`;
    }

    message += `\n📝 Notas adicionales: ${additionalNotes || 'Ninguna'}\n`;
    message += `\n💰 Total: ${formatPrice(getTotalPrice())}`;

    const whatsappUrl = `https://wa.me/+56967449210?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const renderSimpleBreakfastOptions = () => (
    <div className="space-y-8">
      {hotBeverages.length > 0 && (
        <div>
          <h3 className="font-semibold text-lg mb-4">Selecciona tu Té o Café:</h3>
          <div className="grid grid-cols-1 gap-3">
            {hotBeverages.map(beverage => (
              <label
                key={beverage.name}
                className={`
                  flex items-center p-4 rounded-lg cursor-pointer transition border
                  ${selectedHotBeverage === beverage.name 
                    ? 'border-primary bg-primary/5 text-primary' 
                    : 'border-gray-200 hover:border-primary/50'}
                `}
              >
                <input
                  type="radio"
                  name="hotBeverage"
                  checked={selectedHotBeverage === beverage.name}
                  onChange={() => setSelectedHotBeverage(beverage.name)}
                  className="w-4 h-4 text-primary"
                />
                <span className="ml-3">{beverage.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {coldBeverages.length > 0 && (
        <div>
          <h3 className="font-semibold text-lg mb-4">Selecciona tu Jugo Natural:</h3>
          <div className="grid grid-cols-1 gap-3">
            {coldBeverages.map(beverage => (
              <label
                key={beverage.name}
                className={`
                  flex items-center p-4 rounded-lg cursor-pointer transition border
                  ${selectedColdBeverage === beverage.name 
                    ? 'border-primary bg-primary/5 text-primary' 
                    : 'border-gray-200 hover:border-primary/50'}
                `}
              >
                <input
                  type="radio"
                  name="coldBeverage"
                  checked={selectedColdBeverage === beverage.name}
                  onChange={() => setSelectedColdBeverage(beverage.name)}
                  className="w-4 h-4 text-primary"
                />
                <span className="ml-3">{beverage.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {cakes.length > 0 && (
        <div>
          <h3 className="font-semibold text-lg mb-4">Selecciona tu Pastel:</h3>
          <div className="grid grid-cols-1 gap-3">
            {cakes.map(cake => (
              <label
                key={cake.name}
                className={`
                  flex items-center p-4 rounded-lg cursor-pointer transition border
                  ${selectedCake === cake.name 
                    ? 'border-primary bg-primary/5 text-primary' 
                    : 'border-gray-200 hover:border-primary/50'}
                `}
              >
                <input
                  type="radio"
                  name="cake"
                  checked={selectedCake === cake.name}
                  onChange={() => setSelectedCake(cake.name)}
                  className="w-4 h-4 text-primary"
                />
                <span className="ml-3">{cake.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderDoubleBreakfastOptions = () => (
    <div className="space-y-8">
      {hotBeverages.length > 0 && (
        <div>
          <h3 className="font-semibold text-lg mb-4">Bebidas Calientes (Elige hasta 2):</h3>
          <div className="space-y-3">
            {hotBeverages.map(beverage => (
              <div
                key={beverage.name}
                className="flex items-center justify-between p-4 rounded-lg border border-gray-200"
              >
                <span>{beverage.name}</span>
                <SelectionButton
                  name={beverage.name}
                  counts={hotBeverageCounts}
                  setCounts={setHotBeverageCounts}
                />
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Seleccionados: {getTotalSelections(hotBeverageCounts)}/2
          </p>
        </div>
      )}

      {coldBeverages.length > 0 && (
        <div>
          <h3 className="font-semibold text-lg mb-4">Jugos Naturales (Elige hasta 2):</h3>
          <div className="space-y-3">
            {coldBeverages.map(beverage => (
              <div
                key={beverage.name}
                className="flex items-center justify-between p-4 rounded-lg border border-gray-200"
              >
                <span>{beverage.name}</span>
                <SelectionButton
                  name={beverage.name}
                  counts={coldBeverageCounts}
                  setCounts={setColdBeverageCounts}
                />
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Seleccionados: {getTotalSelections(coldBeverageCounts)}/2
          </p>
        </div>
      )}

      {cakes.length > 0 && (
        <div>
          <h3 className="font-semibold text-lg mb-4">Pasteles (Elige hasta 2):</h3>
          <div className="space-y-3">
            {cakes.map(cake => (
              <div
                key={cake.name}
                className="flex items-center justify-between p-4 rounded-lg border border-gray-200"
              >
                <span>{cake.name}</span>
                <SelectionButton
                  name={cake.name}
                  counts={cakeCounts}
                  setCounts={setCakeCounts}
                />
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Seleccionados: {getTotalSelections(cakeCounts)}/2
          </p>
        </div>
      )}
    </div>
  );

  const renderBowlOnlyOptions = () => (
    <div className="space-y-6">      
      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features?.map((feature: string) => (
          <div key={feature} className="flex items-start space-x-2">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-gray-700">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAdditionalOptions = () => (
    <div className="space-y-8">
      {availableAdditions.length > 0 && (
        <div>
          <h3 className="font-semibold text-lg mb-4">Agregados Especiales:</h3>
          <div className="grid grid-cols-1 gap-3">
            {availableAdditions.map(addition => (
              <label
                key={addition.name}
                className={`
                  flex items-center justify-between p-4 rounded-lg cursor-pointer transition border
                  ${selectedAddition === addition.name 
                    ? 'border-primary bg-primary/5 text-primary' 
                    : 'border-gray-200 hover:border-primary/50'}
                `}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="addition"
                    checked={selectedAddition === addition.name}
                    onChange={() => setSelectedAddition(addition.name)}
                    className="w-4 h-4 text-primary"
                  />
                  <div className="ml-3">
                    <span>{addition.name}</span>
                    {addition.description && (
                      <p className="text-sm text-gray-500">{addition.description}</p>
                    )}
                  </div>
                </div>
                {addition.price && (
                  <span className="font-semibold">+{formatPrice(addition.price)}</span>
                )}
              </label>
            ))}
          </div>
        </div>
      )}

      {availableTypes.length > 0 && (
        <div>
          <h3 className="font-semibold text-lg mb-4">Tipo de Desayuno:</h3>
          <div className="grid grid-cols-1 gap-3">
            {availableTypes.map(breakfastType => (
              <label
                key={breakfastType.name}
                className={`
                  flex items-center justify-between p-4 rounded-lg cursor-pointer transition border
                  ${selectedBreakfastType === breakfastType.name 
                    ? 'border-primary bg-primary/5 text-primary' 
                    : 'border-gray-200 hover:border-primary/50'}
                `}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="breakfastType"
                    checked={selectedBreakfastType === breakfastType.name}
                    onChange={() => setSelectedBreakfastType(breakfastType.name)}
                    className="w-4 h-4 text-primary"
                  />
                  <div className="ml-3">
                    <span>{breakfastType.name}</span>
                    {breakfastType.description && (
                      <p className="text-sm text-gray-500">{breakfastType.description}</p>
                    )}
                  </div>
                </div>
                {breakfastType.price && (
                  <span className="font-semibold">+{formatPrice(breakfastType.price)}</span>
                )}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const isFormValid = () => {
    if (type === 'simple') {
      const needsHotBeverage = hotBeverages.length > 0;
      const needsColdBeverage = coldBeverages.length > 0;
      const needsCake = cakes.length > 0;

      return (!needsHotBeverage || selectedHotBeverage !== '') && 
             (!needsColdBeverage || selectedColdBeverage !== '') && 
             (!needsCake || selectedCake !== '');
    } else if (type === 'double') {
      const hotBeveragesValid = hotBeverages.length === 0 || getTotalSelections(hotBeverageCounts) === 2;
      const coldBeveragesValid = coldBeverages.length === 0 || getTotalSelections(coldBeverageCounts) === 2;
      const cakesValid = cakes.length === 0 || getTotalSelections(cakeCounts) === 2;

      return hotBeveragesValid && coldBeveragesValid && cakesValid;
    } else if (type === 'bowl') {
      return true;
    }
    return false;
  };

  return (
    <>
      <div 
        className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transform transition duration-300 hover:scale-105 hover:shadow-xl"
        onClick={handleModalOpen}
      >
        <div className="relative">
          <img 
            src={image} 
            alt={name} 
            className={`w-full ${featured ? 'h-[600px]' : 'h-48'} object-cover`}
            onError={(e) => {
              console.error('Image failed to load:', image);
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"/>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-display font-bold text-dark">{name}</h3>
          <p className="text-gray-600 mt-2 text-sm line-clamp-2">{description}</p>
          <div className="mt-4 flex justify-between items-center">
            <p className="text-primary font-bold text-xl">{formatPrice(price)}</p>
            <button className="text-white bg-primary px-4 py-2 rounded-full text-sm font-semibold hover:bg-secondary transition">
              Personalizar
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={handleModalClose}
        >
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-display font-bold text-dark">{name}</h2>
                <p className="text-gray-600 mt-2">{description}</p>
              </div>
              <button 
                onClick={handleModalClose}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="mb-8">
              <img 
                src={image} 
                alt={name} 
                className={`w-full ${featured ? 'h-[600px]' : 'h-64'} object-cover rounded-lg`}
                onError={(e) => {
                  console.error('Modal image failed to load:', image);
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>

            <div className="space-y-6">
              {type === 'simple' && renderSimpleBreakfastOptions()}
              {type === 'double' && renderDoubleBreakfastOptions()}
              {type === 'bowl' && renderBowlOnlyOptions()}
              {renderAdditionalOptions()}

              {/* Tazón Personalizado - Only show if not featured */}
              {!featured && (
                <div>
                  <label className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-primary/50 transition cursor-pointer">
                    <div>
                      <span className="font-semibold">{customBowl.name}</span>
                      <p className="text-sm text-gray-600">Añade un toque personal</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-600">+{formatPrice(customBowl.price)}</span>
                      <input
                        type="checkbox"
                        checked={includeCustomBowl}
                        onChange={(e) => setIncludeCustomBowl(e.target.checked)}
                        className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary"
                      />
                    </div>
                  </label>
                </div>
              )}

              {/* Notas Adicionales */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Notas Adicionales:</h3>
                <textarea
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="Ejemplo: Alergias, preferencias especiales, dedicatoria..."
                  className="w-full p-4 border border-gray-200 rounded-lg focus:ring-primary focus:border-primary"
                  rows={4}
                />
              </div>
            </div>

            <div className="border-t mt-6 pt-6">
              <div className="text-xl font-bold mb-6 flex justify-between">
                <span>Total:</span>
                <span className="text-primary">{formatPrice(getTotalPrice())}</span>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={handleWhatsAppOrder}
                  disabled={!isFormValid()}
                  className={`
                    w-full py-4 rounded-full font-semibold transition
                    ${isFormValid()
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'}
                  `}
                >
                  Ordenar por WhatsApp
                </button>
              </div>
              {!isFormValid() && type !== 'bowl' && (
                <p className="text-red-500 text-sm mt-2 text-center">
                  {type === 'simple' 
                    ? 'Por favor selecciona todas las opciones disponibles'
                    : 'Por favor selecciona 2 opciones de cada categoría disponible'}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}