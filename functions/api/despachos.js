export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const month = url.searchParams.get('month');
  const year = url.searchParams.get('year');

  if (!month || !year) {
    return new Response(JSON.stringify({ error: 'Faltan parámetros month y year' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { RELAY_BASE_URL, RELAY_SECRET } = env;

  try {
    const relayUrl = `${RELAY_BASE_URL}/api/despachos?month=${month}&year=${year}`;
    const upstream = await fetch(relayUrl, {
      headers: { 'x-relay-secret': RELAY_SECRET },
    });

    if (!upstream.ok) {
      console.error('Error del relay:', upstream.status, upstream.statusText);
      return new Response(JSON.stringify({ error: 'No se pudo obtener datos de despachos' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await upstream.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error de conexión con el relay:', err.message);
    return new Response(JSON.stringify({ error: 'Error de conexión con la API de despachos' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
