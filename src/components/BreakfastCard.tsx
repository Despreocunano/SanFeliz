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

interface SelectionCounts {
  [key: number]: number;
}

export default function BreakfastCard({ id, name, description, price, image, type = 'simple' }: BreakfastProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTea, setSelectedTea] = useState<number>(0);
  const [selectedJuice, setSelectedJuice] = useState<number>(0);
  const [selectedCake, setSelectedCake] = useState<number>(0);
  const [teaCounts, setTeaCounts] = useState<SelectionCounts>({});
  const [juiceCounts, setJuiceCounts] = useState<SelectionCounts>({});
  const [cakeCounts, setCakeCounts] = useState<SelectionCounts>({});
  const [includeCustomBowl, setIncludeCustomBowl] = useState(false);
  const [additionalNotes, setAdditionalNotes] = useState('');

  const getTotalSelections = (counts: SelectionCounts) => {
    return Object.values(counts).reduce((sum, count) => sum + count, 0);
  };

  const handleCountChange = (
    id: number,
    counts: SelectionCounts,
    setCounts: React.Dispatch<React.SetStateAction<SelectionCounts>>,
    increment: boolean
  ) => {
    const currentCount = counts[id] || 0;
    const totalSelections = getTotalSelections(counts);

    if (increment && totalSelections >= 2) return;
    if (!increment && currentCount === 0) return;

    setCounts(prev => ({
      ...prev,
      [id]: increment ? (currentCount + 1) : (currentCount - 1)
    }));
  };

  const SelectionButton = ({ 
    id, 
    counts, 
    setCounts 
  }: { 
    id: number; 
    counts: SelectionCounts; 
    setCounts: React.Dispatch<React.SetStateAction<SelectionCounts>> 
  }) => (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => handleCountChange(id, counts, setCounts, false)}
        className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
      >
        -
      </button>
      <span className="w-8 text-center">{counts[id] || 0}</span>
      <button
        onClick={() => handleCountChange(id, counts, setCounts, true)}
        className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
      >
        +
      </button>
    </div>
  );

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
      const selectedTeaName = teas_and_coffees.find(t => t.id === selectedTea)?.name || 'No seleccionado';
      const selectedJuiceName = juices.find(j => j.id === selectedJuice)?.name || 'No seleccionado';
      const selectedCakeName = cakes.find(c => c.id === selectedCake)?.name || 'No seleccionado';

      message += `☕ Bebida Caliente: ${selectedTeaName}\n`;
      message += `🥤 Jugo: ${selectedJuiceName}\n`;
      message += `🍰 Pastel: ${selectedCakeName}\n`;
    } else if (type === 'double') {
      message += '\nBebidas Calientes:\n';
      Object.entries(teaCounts).forEach(([id, count]) => {
        if (count > 0) {
          const tea = teas_and_coffees.find(t => t.id === Number(id));
          message += `☕ ${tea?.name} x${count}\n`;
        }
      });

      message += '\nJugos:\n';
      Object.entries(juiceCounts).forEach(([id, count]) => {
        if (count > 0) {
          const juice = juices.find(j => j.id === Number(id));
          message += `🥤 ${juice?.name} x${count}\n`;
        }
      });

      message += '\nPasteles:\n';
      Object.entries(cakeCounts).forEach(([id, count]) => {
        if (count > 0) {
          const cake = cakes.find(c => c.id === Number(id));
          message += `🍰 ${cake?.name} x${count}\n`;
        }
      });
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
    <div className="space-y-8">
      <div>
        <h3 className="font-semibold text-lg mb-4">Selecciona tu Té o Café:</h3>
        <div className="grid grid-cols-1 gap-3">
          {teas_and_coffees.map(beverage => (
            <label
              key={beverage.id}
              className={`
                flex items-center p-4 rounded-lg cursor-pointer transition border
                ${selectedTea === beverage.id 
                  ? 'border-primary bg-primary/5 text-primary' 
                  : 'border-gray-200 hover:border-primary/50'}
              `}
            >
              <input
                type="radio"
                name="tea_coffee"
                checked={selectedTea === beverage.id}
                onChange={() => setSelectedTea(beverage.id)}
                className="w-4 h-4 text-primary"
              />
              <span className="ml-3">{beverage.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-4">Selecciona tu Jugo:</h3>
        <div className="grid grid-cols-1 gap-3">
          {juices.map(juice => (
            <label
              key={juice.id}
              className={`
                flex items-center p-4 rounded-lg cursor-pointer transition border
                ${selectedJuice === juice.id 
                  ? 'border-primary bg-primary/5 text-primary' 
                  : 'border-gray-200 hover:border-primary/50'}
              `}
            >
              <input
                type="radio"
                name="juice"
                checked={selectedJuice === juice.id}
                onChange={() => setSelectedJuice(juice.id)}
                className="w-4 h-4 text-primary"
              />
              <span className="ml-3">{juice.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-4">Selecciona tu Pastel:</h3>
        <div className="grid grid-cols-1 gap-3">
          {cakes.map(cake => (
            <label
              key={cake.id}
              className={`
                flex items-center p-4 rounded-lg cursor-pointer transition border
                ${selectedCake === cake.id 
                  ? 'border-primary bg-primary/5 text-primary' 
                  : 'border-gray-200 hover:border-primary/50'}
              `}
            >
              <input
                type="radio"
                name="cake"
                checked={selectedCake === cake.id}
                onChange={() => setSelectedCake(cake.id)}
                className="w-4 h-4 text-primary"
              />
              <span className="ml-3">{cake.name}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDoubleBreakfastOptions = () => (
    <div className="space-y-8">
      <div>
        <h3 className="font-semibold text-lg mb-4">Bebidas Calientes (Elige hasta 2):</h3>
        <div className="space-y-3">
          {teas_and_coffees.map(beverage => (
            <div
              key={beverage.id}
              className="flex items-center justify-between p-4 rounded-lg border border-gray-200"
            >
              <span>{beverage.name}</span>
              <SelectionButton
                id={beverage.id}
                counts={teaCounts}
                setCounts={setTeaCounts}
              />
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Seleccionados: {getTotalSelections(teaCounts)}/2
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-4">Jugos (Elige hasta 2):</h3>
        <div className="space-y-3">
          {juices.map(juice => (
            <div
              key={juice.id}
              className="flex items-center justify-between p-4 rounded-lg border border-gray-200"
            >
              <span>{juice.name}</span>
              <SelectionButton
                id={juice.id}
                counts={juiceCounts}
                setCounts={setJuiceCounts}
              />
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Seleccionados: {getTotalSelections(juiceCounts)}/2
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-4">Pasteles (Elige hasta 2):</h3>
        <div className="space-y-3">
          {cakes.map(cake => (
            <div
              key={cake.id}
              className="flex items-center justify-between p-4 rounded-lg border border-gray-200"
            >
              <span>{cake.name}</span>
              <SelectionButton
                id={cake.id}
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
    </div>
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
      return selectedTea > 0 && selectedJuice > 0 && selectedCake > 0;
    } else if (type === 'double') {
      return getTotalSelections(teaCounts) === 2 &&
             getTotalSelections(juiceCounts) === 2 &&
             getTotalSelections(cakeCounts) === 2;
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
                <label className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-primary/50 transition cursor-pointer">
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
                      className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary"
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
                    ? 'Por favor selecciona una opción de cada categoría'
                    : 'Por favor selecciona 2 opciones de cada categoría'}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}