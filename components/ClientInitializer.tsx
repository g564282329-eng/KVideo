'use client';

import React from 'react';
import { DEFAULT_SOURCES } from '@/lib/api/default-sources';

export default function ClientInitializer() {
  // 最朴素的 useEffect，确保在客户端执行
  React.useEffect(function() {
    // 先打印，证明 useEffect 跑起来了
    console.log("🔧 ClientInitializer 正在浏览器里执行！");
    
    if (typeof window !== 'undefined') {
      // 直接挂载，不做任何复杂操作
      (window as any).DEFAULT_SOURCES = DEFAULT_SOURCES;
      console.log("✅ 成功！window.DEFAULT_SOURCES =", (window as any).DEFAULT_SOURCES);
    }
  }, []);

  // 不渲染任何东西
  return null;
}
