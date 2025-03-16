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
  type?: 'simple' | 'double' | 'bowl';
  'client:load'?: boolean;
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
  price: 6990
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
  }).format(price);
};

export default function BreakfastCard({ id, name, description, price, image, type = 'simple' }: BreakfastProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTea1, setSelectedTea1] = useState<number>(0);
  const [selectedTea2, setSelectedTea2] = useState<number>(0);
  const [selectedJuice1, setSelectedJuice1] = useState<number>(0);
  const [selectedJuice2, setSelectedJuice2] = useState<number>(0);
  const [selectedCake1, setSelectedCake1] = useState<number>(0);
  const [selectedCake2, setSelectedCake2] = useState<number>(0);
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
    let message = `¡Hola! Me gustaría ordenar:\n\n🍳 ${name}\n`;

    if (type === 'simple') {
      const selectedTeaName = teas_and_coffees.find(t => t.id === selectedTea1)?.name || 'No seleccionado';
      const selectedJuiceName = juices.find(j => j.id === selectedJuice1)?.name || 'No seleccionado';
      const selectedCakeName = cakes.find(c => c.id === selectedCake1)?.name || 'No seleccionado';
      
      message += `☕ Bebida Caliente: ${selectedTeaName}\n`;
      message += `🥤 Jugo: ${selectedJuiceName}\n`;
      message += `🍰 Pastel: ${selectedCakeName}\n`;
    } else if (type === 'double') {
      const selectedTeaName1 = teas_and_coffees.find(t => t.id === selectedTea1)?.name || 'No seleccionado';
      const selectedTeaName2 = teas_and_coffees.find(t => t.id === selectedTea2)?.name || 'No seleccionado';
      const selectedJuiceName1 = juices.find(j => j.id === selectedJuice1)?.name || 'No seleccionado';
      const selectedJuiceName2 = juices.find(j => j.id === selectedJuice2)?.name || 'No seleccionado';
      const selectedCakeName1 = cakes.find(c => c.id === selectedCake1)?.name || 'No seleccionado';
      const selectedCakeName2 = cakes.find(c => c.id === selectedCake2)?.name || 'No seleccionado';
      
      message += `\nPersona 1:\n`;
      message += `☕ Bebida Caliente: ${selectedTeaName1}\n`;
      message += `🥤 Jugo: ${selectedJuiceName1}\n`;
      message += `🍰 Pastel: ${selectedCakeName1}\n`;
      
      message += `\nPersona 2:\n`;
      message += `☕ Bebida Caliente: ${selectedTeaName2}\n`;
      message += `🥤 Jugo: ${selectedJuiceName2}\n`;
      message += `🍰 Pastel: ${selectedCakeName2}\n`;
    }

    if (includeCustomBowl) {
      message += `\n🎨 Con Tazón Personalizado\n`;
    }

    message += `\n📝 Notas adicionales: ${additionalNotes || 'Ninguna'}\n`;
    message += `\n💰 Total: ${formatPrice(getTotalPrice())}`;

    const whatsappUrl = `https://wa.me/+123456789?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const renderSimpleBreakfastOptions = () => (
    <>
      <div>
        <h3 className="font-semibold text-lg mb-3">Selecciona tu Té o Café:</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {teas_and_coffees.map(beverage => (
            <label key={beverage.id} className={`
              flex items-center p-3 rounded-lg cursor-pointer transition
              ${selectedTea1 === beverage.id ? 'bg-primary text-white' : 'bg-gray-50 hover:bg-gray-100'}
            `}>
              <input
                type="radio"
                name="tea_coffee"
                checked={selectedTea1 === beverage.id}
                onChange={() => setSelectedTea1(beverage.id)}
                className="hidden"
              />
              <span>{beverage.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-3">Elige tu Jugo:</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {juices.map(juice => (
            <label key={juice.id} className={`
              flex items-center p-3 rounded-lg cursor-pointer transition
              ${selectedJuice1 === juice.id ? 'bg-primary text-white' : 'bg-gray-50 hover:bg-gray-100'}
            `}>
              <input
                type="radio"
                name="juice"
                checked={selectedJuice1 === juice.id}
                onChange={() => setSelectedJuice1(juice.id)}
                className="hidden"
              />
              <span>{juice.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-3">Selecciona tu Pastel:</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {cakes.map(cake => (
            <label key={cake.id} className={`
              flex items-center p-3 rounded-lg cursor-pointer transition
              ${selectedCake1 === cake.id ? 'bg-primary text-white' : 'bg-gray-50 hover:bg-gray-100'}
            `}>
              <input
                type="radio"
                name="cake"
                checked={selectedCake1 === cake.id}
                onChange={() => setSelectedCake1(cake.id)}
                className="hidden"
              />
              <span>{cake.name}</span>
            </label>
          ))}
        </div>
      </div>
    </>
  );

  const renderDoubleBreakfastOptions = () => (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Persona 1 */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-primary">Persona 1</h3>
          
          <div>
            <h4 className="font-semibold text-lg mb-3">Té o Café:</h4>
            <div className="space-y-2">
              {teas_and_coffees.map(beverage => (
                <label key={beverage.id} className={`
                  flex items-center p-3 rounded-lg cursor-pointer transition
                  ${selectedTea1 === beverage.id ? 'bg-primary text-white' : 'bg-gray-50 hover:bg-gray-100'}
                `}>
                  <input
                    type="radio"
                    name="tea_coffee_1"
                    checked={selectedTea1 === beverage.id}
                    onChange={() => setSelectedTea1(beverage.id)}
                    className="hidden"
                  />
                  <span>{beverage.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-3">Jugo:</h4>
            <div className="space-y-2">
              {juices.map(juice => (
                <label key={juice.id} className={`
                  flex items-center p-3 rounded-lg cursor-pointer transition
                  ${selectedJuice1 === juice.id ? 'bg-primary text-white' : 'bg-gray-50 hover:bg-gray-100'}
                `}>
                  <input
                    type="radio"
                    name="juice_1"
                    checked={selectedJuice1 === juice.id}
                    onChange={() => setSelectedJuice1(juice.id)}
                    className="hidden"
                  />
                  <span>{juice.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-3">Pastel:</h4>
            <div className="space-y-2">
              {cakes.map(cake => (
                <label key={cake.id} className={`
                  flex items-center p-3 rounded-lg cursor-pointer transition
                  ${selectedCake1 === cake.id ? 'bg-primary text-white' : 'bg-gray-50 hover:bg-gray-100'}
                `}>
                  <input
                    type="radio"
                    name="cake_1"
                    checked={selectedCake1 === cake.id}
                    onChange={() => setSelectedCake1(cake.id)}
                    className="hidden"
                  />
                  <span>{cake.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Persona 2 */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-primary">Persona 2</h3>
          
          <div>
            <h4 className="font-semibold text-lg mb-3">Té o Café:</h4>
            <div className="space-y-2">
              {teas_and_coffees.map(beverage => (
                <label key={beverage.id} className={`
                  flex items-center p-3 rounded-lg cursor-pointer transition
                  ${selectedTea2 === beverage.id ? 'bg-primary text-white' : 'bg-gray-50 hover:bg-gray-100'}
                `}>
                  <input
                    type="radio"
                    name="tea_coffee_2"
                    checked={selectedTea2 === beverage.id}
                    onChange={() => setSelectedTea2(beverage.id)}
                    className="hidden"
                  />
                  <span>{beverage.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-3">Jugo:</h4>
            <div className="space-y-2">
              {juices.map(juice => (
                <label key={juice.id} className={`
                  flex items-center p-3 rounded-lg cursor-pointer transition
                  ${selectedJuice2 === juice.id ? 'bg-primary text-white' : 'bg-gray-50 hover:bg-gray-100'}
                `}>
                  <input
                    type="radio"
                    name="juice_2"
                    checked={selectedJuice2 === juice.id}
                    onChange={() => setSelectedJuice2(juice.id)}
                    className="hidden"
                  />
                  <span>{juice.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-3">Pastel:</h4>
            <div className="space-y-2">
              {cakes.map(cake => (
                <label key={cake.id} className={`
                  flex items-center p-3 rounded-lg cursor-pointer transition
                  ${selectedCake2 === cake.id ? 'bg-primary text-white' : 'bg-gray-50 hover:bg-gray-100'}
                `}>
                  <input
                    type="radio"
                    name="cake_2"
                    checked={selectedCake2 === cake.id}
                    onChange={() => setSelectedCake2(cake.id)}
                    className="hidden"
                  />
                  <span>{cake.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderBowlOnlyOptions = () => (
    <div className="space-y-6">
      <div className="prose max-w-none">
        <p className="text-lg text-gray-700 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );

  const isFormValid = () => {
    if (type === 'simple') {
      return selectedTea1 && selectedJuice1 && selectedCake1;
    } else if (type === 'double') {
      return selectedTea1 && selectedJuice1 && selectedCake1 &&
             selectedTea2 && selectedJuice2 && selectedCake2;
    } else if (type === 'bowl') {
      return true;
    }
    return false;
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
              {type === 'simple' && renderSimpleBreakfastOptions()}
              {type === 'double' && renderDoubleBreakfastOptions()}
              {type === 'bowl' && renderBowlOnlyOptions()}

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
                  disabled={!isFormValid()}
                  className="bg-green-500 text-white px-6 py-3 rounded-full flex-1 font-semibold hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Ordenar por WhatsApp
                </button>
              </div>
              {!isFormValid() && type !== 'bowl' && (
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