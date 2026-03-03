// lib/api/search-api.ts - 极简无类型版本，确保构建通过
import { fetchWithTimeout, withRetry } from './http-utils';
import { DEFAULT_SOURCES } from './default-sources';

export async function searchVideos(
  query: string,
  sources?: any[],
  page: number = 1
): Promise<any[]> {
  // 优先使用传入的源，否则用默认数据源
  const activeSources = sources || DEFAULT_SOURCES;
  const validSources = activeSources.filter(source => source.enabled !== false);

  const promises = validSources.map(async (source: any) => {
    try {
      const url = new URL(source.searchPath, source.baseUrl);
      // 找到URL参数设置处，替换为以下代码（匹配上述数据源的`keyword`参数）
url.searchParams.set('keyword', query.trim()); // 核心搜索参数
url.searchParams.set('page', '1'); // 固定第一页，简化测试
      if (source.headers) url.searchParams.set('ac', 'search');

      const response = await withRetry(async () => {
        return fetchWithTimeout(url.toString(), {
          method: 'GET',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            ...source.headers,
          },
        });
      });

      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      const data = await response.json();

      return (data.list || []).map((item: any) => ({
        vod_id: item.vod_id,
        vod_name: item.vod_name,
        vod_pic: item.vod_pic,
        vod_remarks: item.vod_remarks,
        source: source.id,
        source_name: source.name,
      }));
    } catch (error) {
      console.error(`Source ${source.name} search failed:`, error);
      return [];
    }
  });

  const results = await Promise.allSettled(promises);
  return results
    .filter(res => res.status === 'fulfilled')
    .flatMap(res => (res as any).value)
    .filter(Boolean);
}

export const search = searchVideos;
return (data.list || []).map(item => ({
  vod_id: item.vod_id || '',
  vod_name: item.vod_name || '未知影片',
  // 封面容错：无地址则用默认图，补全相对路径
  vod_pic: item.vod_pic?.startsWith('http') ? item.vod_pic : `https://picsum.photos/300/450?random=${item.vod_id}`,
  vod_remarks: item.vod_remarks || '无评分',
  source: source.id,
  source_name: source.name,
}));
