// KVideo 完整解析代理 Worker 脚本
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const headers = new Headers(request.headers);

    // 1. 跨域基础配置
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // 2. 处理 OPTIONS 预检请求
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers, status: 204 });
    }

    // 3. 核心：代理视频解析接口（适配 KVideo 主流解析规则）
    const parsePaths = ['/api', '/parse', '/proxy']; // 覆盖常见解析接口路径
    if (parsePaths.some(path => url.pathname.startsWith(path))) {
      // 替换为稳定的第三方解析接口（可根据实际使用的解析源调整）
      const targetUrl = `https://api.pianku.me${url.pathname}${url.search}`;
      return fetch(targetUrl, {
        headers,
        method: request.method,
        body: request.method === 'POST' ? await request.text() : null
      });
    }

    // 4. 静态资源正常返回
    try {
      return await fetch(request, { headers });
    } catch (e) {
      return new Response('解析接口异常：' + e.message, { status: 500, headers });
    }
  },
};
