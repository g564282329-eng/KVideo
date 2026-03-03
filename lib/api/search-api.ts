import type { VideoSource, SearchResult, ApiSearchResponse } from '@/lib/types';
import { fetchWithTimeout, withRetry } from './http-utils';
import { DEFAULT_SOURCES } from './default-sources';

/**
 * 搜索视频（支持指定源列表+分页）
 * @param query 搜索关键词
 * @param sources 可选：指定搜索的源列表（默认用全局数据源）
 * @param page 可选：页码（默认第1页）
 * @returns 搜索结果数组
 */
export async function searchVideos(
  query: string,
  sources?: VideoSource[], // 新增：支持指定源列表
  page: number = 1 // 新增：分页参数（默认第1页）
): Promise<SearchResult[]> {
  // 优先使用传入的源列表，否则用默认数据源
  const activeSources = sources || DEFAULT_SOURCES;
  // 过滤禁用的源
  const validSources = activeSources.filter(source => source.enabled !== false);

  if (typeof window !== 'undefined') {
    console.log(`🔍 搜索关键词: ${query}, 源数量: ${validSources.length}, 页码: ${page}`);
  }

  const promises = validSources.map(async (source) => {
    try {
      const url = new URL(`${source.baseUrl}${source.searchPath}`);
      url.searchParams.set('wd', query.trim());
      url.searchParams.set('page', page.toString()); // 传递分页参数
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

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
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
      console.error(`源 ${source.name} 搜索失败:`, error);
      return [];
    }
  });

  const results = await Promise.allSettled(promises);
  return results
    .filter(res => res.status === 'fulfilled')
    .flatMap(res => (res as PromiseFulfilledResult<SearchResult[]>).value)
    .filter(Boolean);
}

// 兼容原有调用方式
export const search = searchVideos;
