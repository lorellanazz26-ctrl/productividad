export async function onRequestGet(context) {
  const { env } = context;
  const { RELAY_BASE_URL, RELAY_SECRET } = env;

  try {
    const relayUrl = `${RELAY_BASE_URL}/api/status`;
    const upstream = await fetch(relayUrl, {
      headers: { 'x-relay-secret': RELAY_SECRET },
    });
    const checks = await upstream.json();

    return new Response(JSON.stringify(checks), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error de conexión con el relay:', err.message);
    return new Response(
      JSON.stringify([{ name: 'API Despachos (ZigZag)', ok: false }]),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
