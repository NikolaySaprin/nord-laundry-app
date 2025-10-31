import { YandexMetricaEvents } from "@/lib/yandex-metrica";
import { PricingTier } from "@/types/price";

export const pricingTiers: PricingTier[] = [
    {
      id: 1,
      image: "/assets/pricing-small.webp",
      title: "До 1 тонны",
      price: "80 р/кг",
      description: "Идеально для небольших проектов",
      YMtype: YandexMetricaEvents.PRICING_TO_1_TON_BTN
    },  
    {
      id: 2,
      image: "/assets/pricing-medium.webp",
      title: "От 1 до 2 тонн",
      price: "75 р/кг",
      description: "Оптимальный выбор для большинства клиентов",
      YMtype: YandexMetricaEvents.PRICING_TO_2_TON_BTN
    },
    {
      id: 3,
      image: "/assets/pricing-large.webp",
      title: "От 3 тонн",
      price: "70 р/кг",
      description: "Максимальная выгода для крупных объемов",                    
      YMtype: YandexMetricaEvents.PRICING_TO_3_TON_BTN
    }
  ]