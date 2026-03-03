// app/api/search-parallel/route.ts
import { NextRequest } from 'next/server'; // 修复：移除 type，直接导入值
import { searchVideos } from '@/lib/api/search-api';
import { DEFAULT_SOURCES } from '@/lib/api/default-sources';

// Parallel search API handler
export async function POST(req: NextRequest) {
  try {
    const requestBody = await req.json();
    const query = requestBody.query || '';
    
    if (!query || query.trim() === '') {
      return Response.json(
        { code: 400, msg: 'Search query is required' },
        { status: 400 }
      );
    }

    const allResults = [];
    for (const source of DEFAULT_SOURCES) {
      if (source.enabled === false) continue;

      const startTime = performance.now();
      const results = await searchVideos(query.trim(), [source], 1);
      const endTime = performance.now();
      const latency = Math.round(endTime - startTime);
      const videos = results || [];

      allResults.push({
        sourceId: source.id,
        sourceName: source.name,
        latency: latency,
        count: videos.length,
        results: videos,
      });
    }

    return Response.json(
      {
        code: 200,
        msg: 'Search success',
        data: allResults,
      },
      { status: 200 }
    );
  } catch (error) {
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

// Compatibility with GET requests
export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('q') || '';
  
  if (!query) {
    return Response.json(
      { code: 400, msg: 'Missing search query' },
      { status: 400 }
    );
  }

  // Reuse POST logic
  return await POST(new NextRequest(req.url, {
    method: 'POST',
    body: JSON.stringify({ query }),
    headers: { 'Content-Type': 'application/json' },
  }));
}
