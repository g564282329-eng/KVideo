// KVideo Cloudflare Pages 增强 Worker 脚本
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // 允许跨域请求
    const headers = new Headers(request.headers);
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type');

    // 处理 OPTIONS 预检请求
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers });
    }

    // 代理请求或直接返回静态资源
    try {
      return await fetch(request, { headers });
    } catch (e) {
      return new Response('Error: ' + e.message, { status: 500 });
    }
  },
};
