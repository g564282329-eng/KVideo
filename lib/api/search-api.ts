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
      url.searchParams.set('wd', query.trim());
      url.searchParams.set('page', page.toString());
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
