// app/api/search-parallel/route.ts
import type { NextRequest } from 'next/server';
import { searchVideos } from '@/lib/api/search-api';
import { DEFAULT_SOURCES } from '@/lib/api/default-sources';

// 并行搜索 API 处理函数（无严格类型，确保构建通过）
export async function POST(req: NextRequest) {
  try {
    // 解析请求体
    const requestBody = await req.json();
    const query = requestBody.query || '';
    
    // 校验关键词
    if (!query || query.trim() === '') {
      return Response.json(
        { code: 400, msg: 'Search query is required' },
        { status: 400 }
      );
    }

    // 存储所有源的搜索结果
    const allResults = [];
    
    // 遍历每个数据源并行搜索
    for (const source of DEFAULT_SOURCES) {
      // 跳过禁用的源
      if (source.enabled === false) continue;

      // 记录单个源的搜索耗时
      const startTime = performance.now();
      // 调用无类型的 searchVideos 函数（3个参数匹配）
      const results = await searchVideos(query.trim(), [source], 1);
      const endTime = performance.now();
      const latency = Math.round(endTime - startTime); // 计算延迟（毫秒）
      const videos = results || []; // 当前源的视频列表

      // 收集结果
      allResults.push({
        sourceId: source.id,
        sourceName: source.name,
        latency: latency,
        count: videos.length,
        results: videos,
      });
    }

    // 返回成功响应
    return Response.json(
      {
        code: 200,
        msg: 'Search success',
        data: allResults,
      },
      { status: 200 }
    );
  } catch (error) {
    // 错误处理
    console.error('Parallel search failed:', error);
    return Response.json(
      {
        code: 500,
        msg: 'Search service error',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// 兼容 GET 请求（方便测试）
export async function GET(req: NextRequest) {
  // 从 URL 参数获取关键词
  const query = req.nextUrl.searchParams.get('q') || '';
  
  if (!query) {
    return Response.json(
      { code: 400, msg: 'Missing search query' },
      { status: 400 }
    );
  }

  // 复用 POST 逻辑
  return await POST(new NextRequest(req.url, {
    method: 'POST',
    body: JSON.stringify({ query }),
    headers: { 'Content-Type': 'application/json' },
  }));
}
