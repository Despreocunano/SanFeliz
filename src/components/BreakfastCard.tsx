import React, { useState } from 'react';
import PaymentButton from './PaymentButton';

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
  price: 6990
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
  const [preferenceId, setPreferenceId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const getTotalPrice = () => {
    const bowlPrice = includeCustomBowl ? customBowl.price : 0;
    return price + bowlPrice;
  };

  const handleModalClose = (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
    if (e.target === e.currentTarget) {
      setIsModalOpen(false);
      setCurrentStep(1);
    }
  };

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [
            {
              title: name,
              quantity: 1,
              currency_id: 'CLP',
              unit_price: getTotalPrice()
            }
          ],
          payer: {
            name: "Test User",
            email: "test.user@email.com"
          }
        }),
      });

      const data = await response.json();
      setPreferenceId(data.id);
      setCurrentStep(2);
    } catch (error) {
      console.error('Error creating preference:', error);
    } finally {
      setIsLoading(false);
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

  const isSelectionComplete = selectedTea && selectedJuice && selectedCake;

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

            {currentStep === 1 ? (
              <>
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
                  <div className="flex flex-col space-y-4">
                    <button
                      onClick={handlePayment}
                      disabled={!isSelectionComplete || isLoading}
                      className="bg-primary text-white px-6 py-4 rounded-full font-semibold hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed w-full flex items-center justify-center space-x-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Procesando...</span>
                        </>
                      ) : (
                        <>
                          <span>Continuar al Pago</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleWhatsAppOrder}
                      disabled={!isSelectionComplete}
                      className="bg-green-500 text-white px-6 py-4 rounded-full font-semibold hover:bg-green-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed w-full flex items-center justify-center space-x-2"
                    >
                      <span>Ordenar por WhatsApp</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.04 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M8.53 7.33C8.37 7.33 8.1 7.39 7.87 7.64C7.65 7.89 7 8.5 7 9.71C7 10.93 7.89 12.1 8 12.27C8.14 12.44 9.76 14.94 12.25 16C12.84 16.27 13.3 16.42 13.66 16.53C14.25 16.72 14.79 16.69 15.22 16.63C15.7 16.56 16.68 16.03 16.89 15.45C17.1 14.87 17.1 14.38 17.04 14.27C16.97 14.17 16.81 14.11 16.56 14C16.31 13.86 15.09 13.26 14.87 13.18C14.64 13.1 14.5 13.06 14.31 13.3C14.15 13.55 13.67 14.11 13.53 14.27C13.38 14.44 13.24 14.46 13 14.34C12.74 14.21 11.94 13.95 11 13.11C10.26 12.45 9.77 11.64 9.62 11.39C9.5 11.15 9.61 11 9.73 10.89C9.84 10.78 10 10.6 10.1 10.45C10.23 10.31 10.27 10.2 10.35 10.04C10.43 9.87 10.39 9.73 10.33 9.61C10.27 9.5 9.77 8.26 9.56 7.77C9.36 7.29 9.16 7.35 9 7.34C8.86 7.34 8.7 7.33 8.53 7.33Z"/>
                      </svg>
                    </button>
                  </div>
                  {!isSelectionComplete && (
                    <p className="text-red-500 text-sm mt-2 text-center">
                      Por favor selecciona todas las opciones requeridas
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h3 className="text-xl font-semibold mb-2">Resumen de tu Pedido</h3>
                  <p className="text-gray-600">Total a pagar: {formatPrice(getTotalPrice())}</p>
                </div>
                
                {preferenceId && (
                  <PaymentButton 
                    preferenceId={preferenceId} 
                    publicKey={import.meta.env.PUBLIC_MERCADOPAGO_PUBLIC_KEY}
                  />
                )}
                
                <button
                  onClick={() => setCurrentStep(1)}
                  className="w-full text-gray-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300"
                >
                  Volver a las opciones
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}