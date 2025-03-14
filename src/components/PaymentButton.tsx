import { useState, useEffect } from 'react';

interface PaymentButtonProps {
  preferenceId: string;
  publicKey: string;
}

export default function PaymentButton({ preferenceId, publicKey }: PaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMercadoPago = async () => {
      const mp = new MercadoPago(publicKey, {
        locale: 'es-CL'
      });

      mp.checkout({
        preference: {
          id: preferenceId
        },
        render: {
          container: '.cho-container',
          label: 'Pagar',
        }
      });

      setIsLoading(false);
    };

    const script = document.createElement('script');
    script.src = "https://sdk.mercadopago.com/js/v2";
    script.onload = () => loadMercadoPago();
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [preferenceId, publicKey]);

  return (
    <div className="flex flex-col items-center space-y-4">
      {isLoading && (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <span className="ml-2">Cargando método de pago...</span>
        </div>
      )}
      <div className="cho-container w-full"></div>
    </div>
  );
}