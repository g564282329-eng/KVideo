import type { VideoSource } from '@/lib/types';
export const DEFAULT_SOURCES: VideoSource[] = [
  {
    id: "active-source",
    name: "有效影视源",
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
