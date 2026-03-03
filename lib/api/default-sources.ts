import type { VideoSource } from '@/lib/types';

export const DEFAULT_SOURCES: VideoSource[] = [
  {
    id: "new-working-source",
    name: "新可用影视源",
    baseUrl: "https://api.leyuanbo.com",
    searchPath: "/api/v1/search",
    detailPath: "/api/v1/detail",
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  }
];
