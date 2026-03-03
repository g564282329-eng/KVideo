import type { VideoSource } from '@/lib/types';

export const DEFAULT_SOURCES: VideoSource[] = [
  {
    id: "new-working-source",
    name: "新可用影视源",
    // 替换为新的可用域名
    baseUrl: "https://api.example.com", 
    searchPath: "/api/v1/search",
    detailPath: "/api/v1/detail",
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  }
];

// 删除全局挂载代码（不再需要）
// if (typeof window !== 'undefined') {
//   (window as any).DEFAULT_SOURCES = DEFAULT_SOURCES;
// }
