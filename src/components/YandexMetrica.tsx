'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { YANDEX_METRICA_ID, sendYandexMetricaHit } from '@/lib/yandex-metrica';

/**
 * Сам счётчик инициализируется в <head> (app/layout.tsx).
 * Здесь — только хиты при клиентской навигации и noscript-пиксель.
 */
export function YandexMetrica() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Первый хит отправляет сам счётчик при init — дублировать не нужно
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    sendYandexMetricaHit(window.location.href, document.referrer);
  }, [pathname]);

  return (
    <noscript>
      <div>
        <img
          src={`https://mc.yandex.ru/watch/${YANDEX_METRICA_ID}`}
          style={{ position: 'absolute', left: '-9999px' }}
          alt=""
        />
      </div>
    </noscript>
  );
}
