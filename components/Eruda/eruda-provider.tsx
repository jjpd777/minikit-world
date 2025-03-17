
'use client';
import { useEffect } from 'react';

export function ErudaProvider() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('eruda').then(({ default: eruda }) => {
        if (!eruda._isInit) {
          eruda.init();
        }
      });
    }
  }, []);

  return null;
}
