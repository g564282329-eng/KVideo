import type { VideoSource } from '@/lib/types';
// 该源已验证：支持JSON返回、含封面/影视信息、适配基础搜索逻辑
export const DEFAULT_SOURCES: VideoSource[] = [
  {
    id: "valid-video-source",
    name: "可用影视源",
    baseUrl: "https://jx.qqwtt.com",
    searchPath: "/api/v1/search",
    detailPath: "/api/v1/info",
    enabled: true,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Referer': 'https://jx.qqwtt.com/'
    }
  }
];
