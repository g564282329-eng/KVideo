import type { VideoSource } from '@/lib/types';

// 替换为测试可用的临时数据源
export const DEFAULT_SOURCES: VideoSource[] = [
  {
    id: "test-source",
    name: "测试影视源",
    baseUrl: "https://jx.jsonplayer.com",
    searchPath: "/api.php",
    detailPath: "/api.php",
    enabled: true,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Referer': 'https://jx.jsonplayer.com/'
    }
  }
];
