import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.MERCADOPAGO_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        items: body.items,
        back_urls: {
          success: `${import.meta.env.SITE_URL}/success`,
          failure: `${import.meta.env.SITE_URL}/failure`,
          pending: `${import.meta.env.SITE_URL}/pending`
        },
        auto_return: "approved",
        payment_methods: {
          excluded_payment_types: [
            {
              id: "ticket"
            }
          ],
          installments: 1
        }
      })
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error creating preference:', error);
    return new Response(JSON.stringify({ error: 'Error creating preference' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};