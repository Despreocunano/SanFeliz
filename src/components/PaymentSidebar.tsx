import React, { useEffect } from 'react';

interface PaymentSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  preferenceId: string;
  publicKey: string;
}

export default function PaymentSidebar({ isOpen, onClose, preferenceId, publicKey }: PaymentSidebarProps) {
  useEffect(() => {
    if (isOpen && preferenceId) {
      // @ts-ignore
      const mp = new (window as any).MercadoPago(publicKey);
      const checkout = mp.checkout({
        preference: {
          id: preferenceId,
        },
        theme: {
          elementsColor: '#FF6B2B',
          headerColor: '#FF6B2B',
        },
        render: {
          container: '.cho-container',
          label: 'Pagar',
        }
      });
    }
  }, [isOpen, preferenceId, publicKey]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div 
        className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300"
        style={{ transform: isOpen ? 'translateX(0)' : 'translateX(100%)' }}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-display font-bold text-gray-800">Realizar Pago</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="cho-container"></div>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Pago seguro procesado por Mercado Pago</p>
          </div>
        </div>
      </div>
    </div>
  );
}