import React, { useState } from 'react';

interface Topping {
  id: number;
  name: string;
  price: number;
}

interface BreakfastProps {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  toppings: Topping[];
}

export default function BreakfastCard({ id, name, description, price, image, toppings }: BreakfastProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedToppings, setSelectedToppings] = useState<number[]>([]);

  const handleToppingToggle = (toppingId: number) => {
    setSelectedToppings(prev => 
      prev.includes(toppingId) 
        ? prev.filter(id => id !== toppingId)
        : [...prev, toppingId]
    );
  };

  const getTotalPrice = () => {
    const toppingsPrice = selectedToppings.reduce((total, toppingId) => {
      const topping = toppings.find(t => t.id === toppingId);
      return total + (topping?.price || 0);
    }, 0);
    return (price + toppingsPrice).toFixed(2);
  };

  const handleWhatsAppOrder = () => {
    const selectedToppingsText = selectedToppings
      .map(id => toppings.find(t => t.id === id)?.name)
      .join(', ');
    
    const message = `¡Hola! Me gustaría ordenar:\n
🍳 ${name}\n
🔸 Toppings: ${selectedToppingsText || 'Sin toppings adicionales'}\n
💰 Total: $${getTotalPrice()}`;

    const whatsappUrl = `https://wa.me/+123456789?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      <div 
        className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transform transition duration-300 hover:scale-105 hover:shadow-xl"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="relative">
          <img src={image} alt={name} className="w-full h-48 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"/>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-display font-bold text-dark">{name}</h3>
          <p className="text-gray-600 mt-2 text-sm">{description}</p>
          <div className="mt-4 flex justify-between items-center">
            <p className="text-primary font-bold text-xl">${price}</p>
            <button className="text-white bg-primary px-4 py-2 rounded-full text-sm font-semibold hover:bg-secondary transition">
              Personalizar
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-display font-bold text-dark">{name}</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3">Toppings Adicionales:</h3>
              <div className="space-y-3">
                {toppings.map(topping => (
                  <label key={topping.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedToppings.includes(topping.id)}
                        onChange={() => handleToppingToggle(topping.id)}
                        className="form-checkbox h-5 w-5 text-primary rounded border-gray-300"
                      />
                      <span className="ml-3">{topping.name}</span>
                    </div>
                    <span className="text-gray-600">+${topping.price}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="border-t pt-4">
              <div className="text-xl font-bold mb-6 flex justify-between">
                <span>Total:</span>
                <span className="text-primary">${getTotalPrice()}</span>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={handleWhatsAppOrder}
                  className="bg-green-500 text-white px-6 py-3 rounded-full flex-1 font-semibold hover:bg-green-600 transition"
                >
                  Ordenar por WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}