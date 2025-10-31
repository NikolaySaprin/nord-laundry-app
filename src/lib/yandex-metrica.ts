declare global {
  interface Window {
    ym: (counterId: number, method: string, target: string, params?: any) => void;
  }
}

const YANDEX_METRICA_ID = 104366457;

export const initYandexMetrica = (nonce?: string) => {
  if (typeof window !== 'undefined') {
    // Check if already initialized by checking if ym function exists and was called
    if ((window as any).ym && (window as any).ym.a) {
      return;
    }
    
    // Initialize Yandex Metrica
    // Using original inline approach - CSP allows unsafe-inline for scripts
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = `
      (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
      m[i].l=1*new Date();
      for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
      k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
      (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

      ym(${YANDEX_METRICA_ID}, "init", {
           clickmap:true,
           trackLinks:true,
           accurateTrackBounce:true,
           webvisor:true
      });
    `;
    document.head.appendChild(script);

    const noscript = document.createElement('noscript');
    const img = document.createElement('img');
    img.src = `https://mc.yandex.ru/watch/${YANDEX_METRICA_ID}`;
    img.style.position = 'absolute';
    img.style.left = '-9999px';
    img.alt = '';
    noscript.appendChild(img);
    document.body.appendChild(noscript);
  }
};

export const sendYandexMetricaEvent = (eventName: typeof YandexMetricaEvents[keyof typeof YandexMetricaEvents], params?: any) => {
  if (typeof window !== 'undefined' && (window as any).ym) {
    (window as any).ym(YANDEX_METRICA_ID, 'reachGoal', eventName, params);
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
