declare global {
  interface Window {
    ym: (counterId: number, method: string, target?: any, params?: any) => void;
  }
}

export const YANDEX_METRICA_ID = 104366457;

// Официальный сниппет Яндекс.Метрики. Встраивается в <head> на сервере (см. app/layout.tsx),
// поэтому счётчик срабатывает до гидрации и не теряет быстрые отказы.
export const YANDEX_METRICA_SNIPPET = `
(function(m,e,t,r,i,k,a){
  m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
  m[i].l=1*new Date();
  for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
  k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
})(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js?id=${YANDEX_METRICA_ID}', 'ym');

ym(${YANDEX_METRICA_ID}, 'init', {
  ssr: true,
  webvisor: true,
  clickmap: true,
  referrer: document.referrer,
  url: location.href,
  accurateTrackBounce: true,
  trackLinks: true
});
`;

export const sendYandexMetricaEvent = (eventName: typeof YandexMetricaEvents[keyof typeof YandexMetricaEvents], params?: any) => {
  if (typeof window !== 'undefined' && window.ym) {
    window.ym(YANDEX_METRICA_ID, 'reachGoal', eventName, params);
  }
};

// Просмотр страницы при клиентской навигации (SPA-переходы Next.js)
export const sendYandexMetricaHit = (url: string, referrer?: string) => {
  if (typeof window !== 'undefined' && window.ym) {
    window.ym(YANDEX_METRICA_ID, 'hit', url, referrer ? { referer: referrer } : undefined);
  }
};

export const YandexMetricaEvents = {
  FORM_MODAL: 'form-modal',
  FORM_SERVIS: 'form-servis',
  FORM_KEIS: 'form-keis',
  PHONE: 'phone',
  WHATS: 'whats',
  TELEGRAM: 'telegram',
  TRIAL_WASHING_BTN: 'trial-washing-btn',
  SERVICES_HORECA_BTN: 'services-horeca-btn',
  SERVICES_FITNESS_BTN: 'services-fitness-btn',
  SERVICES_SPA_BTN: 'services-spa-btn',
  SERVICES_POOL_BTN: 'services-pool-btn',
  SERVICES_PRODUCTION_BTN: 'services-production-btn',
  SERVICES_RETAIL_BTN: 'services-retail-btn',
  SERVICES_REAL_ESTATE_BTN: 'services-real-estate-btn',
  SERVICES_BAKERY_BTN: 'services-bakery-btn',
  PROMOTION_FIRST_WASH: 'promotion-first-wash',
  PROMOTION_SECOND_MONTH: 'promotion-second-month',
  PROMOTION_WHITE_BONUS: 'promotion-white-bonus',
  PROMOTION_MORE_THAN_3_TONS: 'promotion-more-than-3-tons',
  PROCESS_BTN: 'process-btn',
  PRICING_TO_1_TON_BTN: 'pricing-to-1-ton-btn',
  PRICING_TO_2_TON_BTN: 'pricing-to-2-ton-btn',
  PRICING_TO_3_TON_BTN: 'pricing-to-3-ton-btn',
  GET_A_PAYMENT_BTN: 'get-a-payment-btn',
} as const;
