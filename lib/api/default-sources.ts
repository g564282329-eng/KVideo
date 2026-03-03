import type { VideoSource } from '@/lib/types';

export const DEFAULT_SOURCES: VideoSource[] = [
  {
    id: "universal-video-source",
    name: "通用影视源",
    baseUrl: "https://api.pianku.cc",
    searchPath: "/api/search",
    detailPath: "/api/detail",
    enabled: true,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Referer': 'https://api.pianku.cc/'
    }
  }
];
