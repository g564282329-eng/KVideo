import type { VideoSource, SearchResult, ApiSearchResponse } from '@/lib/types';
import { fetchWithTimeout, withRetry } from './http-utils';
// 👇 新增：直接导入数据源，不再依赖 window
import { DEFAULT_SOURCES } from './default-sources';

/**
 * 并行搜索多个视频源
 * @param query 搜索关键词
 * @param type 视频类型（可选）
 * @returns 合并后的搜索结果
 */
export async function searchVideos(
  query: string,
  type?: string
): Promise<SearchResult[]> {
  // 👇 核心修改：直接使用导入的数据源，移除 window 依赖
  const sources = DEFAULT_SOURCES;
  
  // 可选调试日志（仅在浏览器端执行）
  if (typeof window !== 'undefined') {
    console.log("🔍 搜索已加载数据源:", sources);
  }

  // 过滤掉禁用的源
  const activeSources = sources.filter(source => source.enabled !== false);

  // 并行请求所有活跃源
  const promises = activeSources.map(async (source) => {
    try {
      const url = new URL(`${source.baseUrl}${source.searchPath}`);
      url.searchParams.set('wd', query);
      if (type) url.searchParams.set('ac', type);

      const response = await withRetry(async () => {
        return fetchWithTimeout(url.toString(), {
          method: 'GET',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            ...source.headers,
          },
        });
      });

      if (!response.ok) {
        throw new Error(`源 ${source.name} 请求失败: ${response.status}`);
      }

      const data: ApiSearchResponse = await response.json();
      
      // 格式化结果
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
      return []; // 单个源失败不影响整体
    }
  });

  // 等待所有请求完成，合并结果
  const results = await Promise.allSettled(promises);
  return results
    .filter(result => result.status === 'fulfilled')
    .flatMap(result => (result as PromiseFulfilledResult<SearchResult[]>).value)
    .filter(Boolean);
}

// 导出简化的搜索函数（兼容原有调用）
export const search = searchVideos;
