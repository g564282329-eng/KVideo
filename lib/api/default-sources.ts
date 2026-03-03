import type { VideoSource } from '@/lib/types';

export const DEFAULT_SOURCES: VideoSource[] = [
  {
    id: "stable-test-source",
    name: "稳定测试源",
    baseUrl: "https://www.ygdy8.cc", // 真实可访问的影视源站
    searchPath: "/api/ajax_search.php",
    detailPath: "/api/ajax_detail.php",
    enabled: true,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }
  }
];
