export default {
  async fetch(request, env, ctx) {
    const headers = new Headers(request.headers);
    
    // 允许跨域
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type, User-Agent');

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers, status: 204 });
    }

    try {
      return await fetch(request, { headers });
    } catch (e) {
      return new Response('Error: ' + e.message, { status: 500, headers });
    }
  },
};
