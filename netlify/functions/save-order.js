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
    const orderData = JSON.parse(event.body || '{}');

    const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
    if (!scriptUrl) {
      console.warn('GOOGLE_SCRIPT_URL no configurado — orden no guardada en Sheets');
      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify({ ok: true, warning: 'GOOGLE_SCRIPT_URL no configurado' }),
      };
    }

    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: orderData.items || [],
        total: orderData.total || 0,
        payer_name: orderData.payer_name || '',
        payer_email: orderData.payer_email || '',
        payer_phone: orderData.payer_phone || '',
        status: orderData.status || 'pendiente',
      }),
    });

    if (!response.ok) {
      throw new Error(`Google Script respondió con estado ${response.status}`);
    }

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ ok: true }),
    };
  } catch (err) {
    console.error('Error guardando orden:', err);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Error guardando orden', detail: err.message }),
    };
  }
};
