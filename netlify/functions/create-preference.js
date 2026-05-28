const { MercadoPagoConfig, Preference } = require('mercadopago');

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

exports.handler = async (event) => {
  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Método no permitido' }),
    };
  }

  try {
    const { items, payer_email } = JSON.parse(event.body || '{}');

    if (!items || !Array.isArray(items) || items.length === 0) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'Se requieren items' }),
      };
    }

    const accessToken = process.env.MP_ACCESS_TOKEN;
    if (!accessToken) {
      return {
        statusCode: 503,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'MP_ACCESS_TOKEN no configurado' }),
      };
    }

    const client = new MercadoPagoConfig({ accessToken });
    const preference = new Preference(client);

    const baseUrl = '/.netlify/functions';

    const result = await preference.create({
      body: {
        items: items.map((item) => ({
          title: item.title,
          quantity: Number(item.quantity),
          unit_price: Number(item.unit_price),
          currency_id: 'MXN',
        })),
        payer: payer_email ? { email: payer_email } : undefined,
        back_urls: {
          success: `${baseUrl}/payment-success`,
          failure: `${baseUrl}/payment-failure`,
          pending: `${baseUrl}/payment-pending`,
        },
        auto_return: 'approved',
      },
    });

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        init_point: result.init_point,
        sandbox_init_point: result.sandbox_init_point,
        preference_id: result.id,
      }),
    };
  } catch (err) {
    console.error('Error creando preferencia de Mercado Pago:', err);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Error interno del servidor', detail: err.message }),
    };
  }
};
