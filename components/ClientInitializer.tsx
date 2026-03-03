'use client';
import React, { useEffect } from 'react';
import { DEFAULT_SOURCES } from '@/lib/api/default-sources';

export default function ClientInitializer() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 👇 关键：用 (window as any) 绕过 TypeScript 类型检查
      (window as any).DEFAULT_SOURCES = DEFAULT_SOURCES;
      console.log("✅ 数据源已挂载到 window!", (window as any).DEFAULT_SOURCES);
    }
  }, []);

  return null;
}
