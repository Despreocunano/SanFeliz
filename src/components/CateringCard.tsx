import React, { useState } from 'react';
import type { CateringItem } from '../lib/contentful';

interface Props extends CateringItem {
  'client:load'?: boolean;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
  }).format(price);
};

export default function CateringCard({ name, description, image, options }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  const handleModalClose = (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
    if (e.target === e.currentTarget) {
      setIsModalOpen(false);
    }
  };

  const selectedOptionData = options.find(opt => opt.name === selectedOption);
  const basePrice = options[0].price; // Lowest price option

  const handleWhatsAppOrder = () => {
    if (!selectedOptionData) return;

    // Track the conversion event
    if (window.fbq) {
      fbq('track', 'InitiateCheckout', {
        content_name: name,
        content_type: 'catering',
        value: selectedOptionData.price,
        currency: 'CLP'
      });
    }

    const message = `¡Hola! Me gustaría ordenar:\n\n🍽️ ${name}\n📦 ${selectedOptionData.name}\n💰 ${formatPrice(selectedOptionData.price)}\n\n📝 Notas adicionales: ${additionalNotes || 'Ninguna'}`;

    const whatsappUrl = `https://wa.me/+56967449210?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const imageUrl = `https:${image.fields.file.url}`;

  return (
    <>
      <div 
        className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transform transition duration-300 hover:scale-105 hover:shadow-xl"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="relative">
          <img 
            src={imageUrl} 
            alt={name} 
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"/>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-display font-bold text-dark">{name}</h3>
          <p className="text-gray-600 mt-2 text-sm line-clamp-2">{description}</p>
          <div className="mt-4 flex justify-between items-center">
            <div className="text-primary font-bold">
              <span className="text-sm">Desde</span>
              <p className="text-xl">{formatPrice(basePrice)}</p>
            </div>
            <button className="text-white bg-primary px-4 py-2 rounded-full text-sm font-semibold hover:bg-secondary transition">
              Ver Opciones
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
                src={imageUrl}
                alt={name} 
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-4">Selecciona la cantidad:</h3>
                <div className="grid grid-cols-1 gap-3">
                  {options.map(option => (
                    <label
                      key={option.name}
                      className={`
                        flex items-center justify-between p-4 rounded-lg cursor-pointer transition border
                        ${selectedOption === option.name 
                          ? 'border-primary bg-primary/5 text-primary' 
                          : 'border-gray-200 hover:border-primary/50'}
                      `}
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="option"
                          checked={selectedOption === option.name}
                          onChange={() => setSelectedOption(option.name)}
                          className="w-4 h-4 text-primary"
                        />
                        <span className="ml-3">{option.name}</span>
                      </div>
                      <span className="font-semibold">{formatPrice(option.price)}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">Notas Adicionales:</h3>
                <textarea
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="Ejemplo: Fecha de entrega, lugar, preferencias especiales..."
                  className="w-full p-4 border border-gray-200 rounded-lg focus:ring-primary focus:border-primary"
                  rows={4}
                />
              </div>
            </div>

            <div className="border-t mt-6 pt-6">
              <div className="text-xl font-bold mb-6 flex justify-between">
                <span>Total:</span>
                <span className="text-primary">
                  {selectedOptionData ? formatPrice(selectedOptionData.price) : '-'}
                </span>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={handleWhatsAppOrder}
                  disabled={!selectedOption}
                  className={`
                    w-full py-4 rounded-full font-semibold transition
                    ${selectedOption
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'}
                  `}
                >
                  Ordenar por WhatsApp
                </button>
              </div>
              {!selectedOption && (
                <p className="text-red-500 text-sm mt-2 text-center">
                  Por favor selecciona una opción
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}