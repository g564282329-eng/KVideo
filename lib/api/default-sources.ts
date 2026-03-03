import type { VideoSource } from '@/lib/types';

// Default predefined video sources - Real Chinese video APIs
export const DEFAULT_SOURCES: VideoSource[] = [
  {
    id: "public-parse-1",
    name: "公共解析源",
    baseUrl: "https://api.pianku.me",
    searchPath: "/api.php",
    detailPath: "/api.php", // ✅ 补上类型要求的必填字段
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  }
];
