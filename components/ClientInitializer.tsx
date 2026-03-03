'use client'; // 👈 关键：标记为客户端组件，确保在浏览器运行

import { DEFAULT_SOURCES } from '@/lib/api/default-sources';

// 这个组件本身不渲染任何 UI，只负责初始化全局状态
export default function ClientInitializer() {
  // 在 useEffect 中执行，确保在客户端挂载
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).DEFAULT_SOURCES = DEFAULT_SOURCES;
      console.log("✅ 数据源已挂载到 window!", window.DEFAULT_SOURCES);
    }
  }, []);

  return null; // 不渲染任何内容
}
