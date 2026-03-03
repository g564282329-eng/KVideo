'use client'; // 必须保留，标记为客户端组件

// 👇 补全：必须显式导入 React 和 useEffect
import React, { useEffect } from 'react';
import { DEFAULT_SOURCES } from '@/lib/api/default-sources';

export default function ClientInitializer() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).DEFAULT_SOURCES = DEFAULT_SOURCES;
      console.log("✅ 数据源已挂载到 window!", window.DEFAULT_SOURCES);
    }
  }, []);

  return null; // 不渲染 UI
}
