import { useState, useEffect } from 'react';

interface PaymentButtonProps {
  preferenceId: string;
  publicKey: string;
}

export default function PaymentButton({ preferenceId, publicKey }: PaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [mpInstance, setMpInstance] = useState<any>(null);

  useEffect(() => {
    const loadMercadoPago = async () => {
      try {
        if (!window.MercadoPago) {
          const script = document.createElement('script');
          script.src = "https://sdk.mercadopago.com/js/v2";
          script.async = true;
          
          script.onload = () => {
            const mp = new window.MercadoPago(publicKey, {
              locale: 'es-CL'
            });
            setMpInstance(mp);
            initializeCheckout(mp);
          };
          
          document.body.appendChild(script);
        } else {
          const mp = new window.MercadoPago(publicKey, {
            locale: 'es-CL'
          });
          setMpInstance(mp);
          initializeCheckout(mp);
        }
      } catch (error) {
        console.error('Error loading MercadoPago:', error);
        setIsLoading(false);
      }
    };

    const initializeCheckout = (mp: any) => {
      try {
        const container = document.querySelector('.cho-container');
        if (container) {
          mp.checkout({
            preference: {
              id: preferenceId
            },
            render: {
              container: '.cho-container',
              label: 'Pagar ahora',
              type: 'wallet',
              customization: {
                visual: {
                  buttonBackground: '#FF6B2B',
                  borderRadius: '9999px'
                }
              }
            }
          });
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing checkout:', error);
        setIsLoading(false);
      }
    };

    loadMercadoPago();

    return () => {
      // Cleanup if needed
      if (mpInstance) {
        // Any cleanup code for MP instance
      }
    };
  }, [preferenceId, publicKey]);

  return (
    <div className="flex flex-col items-center space-y-4 w-full">
      {isLoading ? (
        <div className="flex items-center justify-center p-4 w-full">
          <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
            <span className="text-gray-700">Preparando método de pago...</span>
          </div>
        </div>
      ) : (
        <div className="w-full space-y-4">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold text-gray-800">Pago Seguro con Mercado Pago</span>
              </div>
            </div>
            
            <div className="cho-container">
              {/* MercadoPago button will be rendered here */}
            </div>
            
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 pt-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Transacción procesada de forma segura</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}