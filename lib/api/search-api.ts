// lib/api/search-api.ts - 纯英文语法，适配类型
import type { VideoSource, SearchResult, ApiSearchResponse } from '@/lib/types';
import { fetchWithTimeout, withRetry } from './http-utils';
import { DEFAULT_SOURCES } from './default-sources';

/**
 * 搜索视频（支持指定源列表+分页）
 * @param query 搜索关键词
 * @param sources 可选：指定搜索的源列表
 * @param page 可选：页码（默认第1页）
 * @returns 搜索结果数组
 */
export async function searchVideos(
  query: string,
  sources?: VideoSource[],
  page: number = 1
): Promise<SearchResult[]> {
  const activeSources = sources || DEFAULT_SOURCES;
  const validSources = activeSources.filter(source => source.enabled !== false);

  if (typeof window !== 'undefined') {
    console.log(`🔍 Search query: ${query}, sources: ${validSources.length}, page: ${page}`);
  }

  const promises = validSources.map(async (source) => {
    try {
      const url = new URL(`${source.baseUrl}${source.searchPath}`);
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
      const data: ApiSearchResponse = await response.json();

      return (data.list || []).map(item => ({
        vod_id: item.vod_id,
        vod_name: item.vod_name,
        vod_pic: item.vod_pic,
        vod_remarks: item.vod_remarks,
        source: source.id,
        source_name: source.name,
      })) as SearchResult[];
    } catch (error) {
      console.error(`Source ${source.name} search failed:`, error);
      return [];
    }
  });

  const results = await Promise.allSettled(promises);
  return results
    .filter(res => res.status === 'fulfilled')
    .flatMap(res => (res as PromiseFulfilledResult<SearchResult[]>).value)
    .filter(Boolean);
}

export const search = searchVideos;
