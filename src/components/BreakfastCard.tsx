import React, { useState } from 'react';

interface Beverage {
  id: number;
  name: string;
}

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
}

const teas_and_coffees: Beverage[] = [
  { id: 1, name: "Café de Altura Premium" },
  { id: 2, name: "Té Verde con Jazmín" },
  { id: 3, name: "Café Mocha con Canela" },
  { id: 4, name: "Té Chai Especiado" }
];

const juices: Beverage[] = [
  { id: 1, name: "Jugo de Naranja y Zanahoria" },
  { id: 2, name: "Jugo Verde Detox" },
  { id: 3, name: "Jugo de Frutos Rojos" },
  { id: 4, name: "Jugo Tropical de Mango y Maracuyá" }
];

const cakes: Beverage[] = [
  { id: 1, name: "Red Velvet" },
  { id: 2, name: "Torta de Zanahoria con Frosting" },
  { id: 3, name: "Cheesecake de Frutos del Bosque" },
  { id: 4, name: "Torta de Chocolate Belga" }
];

const customBowl: Topping = {
  id: 1,
  name: "Tazón Personalizado con Nombre",
  price: 5990
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
  }).format(price);
};

export default function BreakfastCard({ id, name, description, price, image }: BreakfastProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTea, setSelectedTea] = useState<number>(0);
  const [selectedJuice, setSelectedJuice] = useState<number>(0);
  const [selectedCake, setSelectedCake] = useState<number>(0);
  const [includeCustomBowl, setIncludeCustomBowl] = useState(false);
  const [additionalNotes, setAdditionalNotes] = useState('');

  const getTotalPrice = () => {
    const bowlPrice = includeCustomBowl ? customBowl.price : 0;
    return price + bowlPrice;
  };

  const handleModalClose = (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
    if (e.target === e.currentTarget) {
      setIsModalOpen(false);
    }
  };

  const handleWhatsAppOrder = () => {
    const selectedTeaName = teas_and_coffees.find(t => t.id === selectedTea)?.name || 'No seleccionado';
    const selectedJuiceName = juices.find(j => j.id === selectedJuice)?.name || 'No seleccionado';
    const selectedCakeName = cakes.find(c => c.id === selectedCake)?.name || 'No seleccionado';
    
    const message = `¡Hola! Me gustaría ordenar:\n
🍳 ${name}\n
☕ Bebida Caliente: ${selectedTeaName}\n
🥤 Jugo: ${selectedJuiceName}\n
🍰 Pastel: ${selectedCakeName}\n
${includeCustomBowl ? '🎨 Con Tazón Personalizado\n' : ''}
📝 Notas adicionales: ${additionalNotes || 'Ninguna'}\n
💰 Total: ${formatPrice(getTotalPrice())}`;

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
              <img src={image} alt={name} className="w-full h-64 object-cover rounded-lg" />
            </div>

            <div className="space-y-6">
              {/* Bebida Caliente */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Selecciona tu Té o Café:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {teas_and_coffees.map(beverage => (
                    <label key={beverage.id} className={`
                      flex items-center p-3 rounded-lg cursor-pointer transition
                      ${selectedTea === beverage.id ? 'bg-primary text-white' : 'bg-gray-50 hover:bg-gray-100'}
                    `}>
                      <input
                        type="radio"
                        name="tea_coffee"
                        checked={selectedTea === beverage.id}
                        onChange={() => setSelectedTea(beverage.id)}
                        className="hidden"
                      />
                      <span>{beverage.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Jugos */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Elige tu Jugo:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {juices.map(juice => (
                    <label key={juice.id} className={`
                      flex items-center p-3 rounded-lg cursor-pointer transition
                      ${selectedJuice === juice.id ? 'bg-primary text-white' : 'bg-gray-50 hover:bg-gray-100'}
                    `}>
                      <input
                        type="radio"
                        name="juice"
                        checked={selectedJuice === juice.id}
                        onChange={() => setSelectedJuice(juice.id)}
                        className="hidden"
                      />
                      <span>{juice.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Pasteles */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Selecciona tu Pastel:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {cakes.map(cake => (
                    <label key={cake.id} className={`
                      flex items-center p-3 rounded-lg cursor-pointer transition
                      ${selectedCake === cake.id ? 'bg-primary text-white' : 'bg-gray-50 hover:bg-gray-100'}
                    `}>
                      <input
                        type="radio"
                        name="cake"
                        checked={selectedCake === cake.id}
                        onChange={() => setSelectedCake(cake.id)}
                        className="hidden"
                      />
                      <span>{cake.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Tazón Personalizado */}
              <div>
                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                  <div>
                    <span className="font-semibold">{customBowl.name}</span>
                    <p className="text-sm text-gray-600">Añade un toque personal a tu desayuno</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-600">+{formatPrice(customBowl.price)}</span>
                    <input
                      type="checkbox"
                      checked={includeCustomBowl}
                      onChange={(e) => setIncludeCustomBowl(e.target.checked)}
                      className="form-checkbox h-5 w-5 text-primary rounded border-gray-300"
                    />
                  </div>
                </label>
              </div>

              {/* Notas Adicionales */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Notas Adicionales:</h3>
                <textarea
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="Ejemplo: Alergias, preferencias especiales, dedicatoria..."
                  className="w-full p-3 border rounded-lg focus:ring-primary focus:border-primary"
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
                  disabled={!selectedTea || !selectedJuice || !selectedCake}
                  className="bg-green-500 text-white px-6 py-3 rounded-full flex-1 font-semibold hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Ordenar por WhatsApp
                </button>
              </div>
              {(!selectedTea || !selectedJuice || !selectedCake) && (
                <p className="text-red-500 text-sm mt-2 text-center">
                  Por favor selecciona todas las opciones requeridas
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}