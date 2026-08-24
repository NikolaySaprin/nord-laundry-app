"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { sendYandexMetricaEvent, YandexMetricaEvents } from '@/lib/yandex-metrica'

export function Footer() {
  return (
    <footer id="footer" className="bg-[#2C4495] text-white relative overflow-hidden">
      <div className="hidden lg:block">
        <div className="max-w-[80rem] mx-auto py-[4rem] relative">

          <div className="absolute top-[3rem] right-[2rem] w-[6rem] h-[6rem] opacity-25 pointer-events-none">
            <div className="grid grid-cols-5 gap-[0.4rem]">
              {Array.from({ length: 25 }).map((_, i) => (
                <div key={i} className="w-[0.4rem] h-[0.4rem] bg-white/30 rounded-full"></div>
              ))}
            </div>
          </div>

          <div className="mb-[3rem]">
            <div className="w-[20.36rem] flex justify-center">
              <div className="w-[13.75rem] h-[4.125rem] relative">
                <Image src="/assets/footer_logo.svg" alt="Nord Logo" fill className="object-contain" />
              </div>
            </div>
          </div>

          <div className="mb-[3rem]">
            <div className="w-[20.36rem] flex justify-center">
              <p className="text-white font-montserrat font-normal text-[1rem] leading-[1.5] max-w-[17.6875rem] text-center">
                Профессиональная прачечная для вашего бизнеса. Качество, надежность и индивидуальный подход.
              </p>
            </div>
          </div>

          <div className="flex items-start mb-[3rem]">
            <div className="flex-shrink-0">
              <div className="flex flex-col gap-[1.25rem]">
                <Button asChild className="bg-transparent border border-white text-white font-montserrat font-medium text-[1rem] leading-[1.5] px-[2.125rem] py-[1.6875rem] rounded-[3.125rem] flex items-center justify-center gap-[0.75rem] w-[20.36rem] h-[3.5rem] uppercase hover:bg-white/10 transition-colors">
                  <Link href="https://wa.me/79154268594" target="_blank" rel="noopener noreferrer" onClick={() => sendYandexMetricaEvent(YandexMetricaEvents.WHATS)}>
                    Написать в Whatsapp
                    <div className="w-[2rem] h-[2rem] relative">
                      <Image src="/assets/whatsapp-icon.svg" alt="WhatsApp" fill className="object-contain" />
                    </div>
                  </Link>
                </Button>

                <Button asChild className="bg-transparent border border-white text-white font-montserrat font-medium text-[1rem] leading-[1.5] px-[2.125rem] py-[1.6875rem] rounded-[3.125rem] flex items-center justify-center gap-[0.75rem] w-[20.36rem] h-[3.5rem] uppercase hover:bg-white/10 transition-colors">
                  <Link href="https://t.me/nord_laundry_bot" target="_blank" rel="noopener noreferrer" onClick={() => sendYandexMetricaEvent(YandexMetricaEvents.TELEGRAM)}>
                    Написать в Телеграм
                    <div className="w-[2rem] h-[2rem] relative">
                      <Image src="/assets/telegram-icon.svg" alt="Telegram" fill className="object-contain" />
                    </div>
                  </Link>
                </Button>

                <Button asChild className="bg-transparent border border-white text-white font-montserrat font-medium text-[1rem] leading-[1.5] px-[2.125rem] py-[1.6875rem] rounded-[3.125rem] flex items-center justify-center w-[20.36rem] h-[3.5rem] uppercase hover:bg-white/10 transition-colors relative">
                  <Link href="tel:+79154268594" onClick={() => sendYandexMetricaEvent(YandexMetricaEvents.PHONE)}>
                    <span className="absolute left-1/2 transform -translate-x-1/2">Позвонить</span>
                    <div className="w-[2rem] h-[2rem] relative ml-[13.5rem]">
                      <Image src="/assets/phone-icon.svg" alt="Phone" fill className="object-contain" />
                    </div>
                  </Link>
                </Button>
              </div>
            </div>

            <div className="flex-1 flex justify-center">
              <div className="flex flex-col">
                <h3 className="text-white font-montserrat font-medium text-[1.5rem] leading-[1] lg:pb-[2rem]">
                  Клиентам:
                </h3>
                <div className="flex flex-col gap-[1.5rem]">
                  <Link href="/" className="text-white font-montserrat font-medium text-[1.5rem] leading-[1] hover:text-white/80 transition-colors">
                    Главная
                  </Link>
                  <Link href="/#services" className="text-white font-montserrat font-medium text-[1.5rem] leading-[1] hover:text-white/80 transition-colors">
                    Услуги
                  </Link>
                  <Link href="/#pricing" className="text-white font-montserrat font-medium text-[1.5rem] leading-[1] hover:text-white/80 transition-colors">
                    Цены
                  </Link>
                  <Link href="/#footer" className="text-white font-montserrat font-medium text-[1.5rem] leading-[1] hover:text-white/80 transition-colors">
                    Контакты
                  </Link>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0">
              <div className="flex flex-col gap-[2.125rem]">
                <h3 className="text-white font-montserrat font-medium text-[1.5rem] leading-[1] lg:pb-[2rem]">
                  Контакты:
                </h3>
                <div className="space-y-[1.5rem] -mt-[2.5rem]">
                  <div>
                    <p className="text-white/50 font-montserrat font-medium text-[1rem] leading-[1.5] uppercase mb-2">
                      ТЕЛЕФОН:
                    </p>
                    <Link href="tel:+79154268594" onClick={() => sendYandexMetricaEvent(YandexMetricaEvents.PHONE)} className="text-white font-montserrat font-medium text-[1.5rem] leading-[1] hover:text-white/80 transition-colors" >
                      +7 (915) 426-85-94
                    </Link>
                  </div>

                  <div>
                    <p className="text-white/50 font-montserrat font-medium text-[1rem] leading-[1.5] uppercase mb-2">
                      ПОЧТА:
                    </p>
                    <Link href="mailto:nordlaundry@gmail.com" className="text-white font-montserrat font-medium text-[1.5rem] leading-[1] hover:text-white/80 transition-colors">
                      nordlaundry@gmail.com
                    </Link>
                  </div>

                  <div>
                    <p className="text-white/50 font-montserrat font-medium text-[1rem] leading-[1.5] uppercase mb-2">
                      АДРЕС:
                    </p>
                    <p className="text-white font-montserrat font-medium text-[1.5rem] leading-[1.5]">
                      109316, г. Москва,<br />
                       ул. Талалихина, д. 41, с. 3
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 pt-8 border-t border-white/20">
            <div className="flex justify-between items-center">
              <p className="text-white/50 font-montserrat font-medium text-[1rem] leading-[1.5]">
                © {new Date().getFullYear()} Nord Laundry. Все права защищены.
              </p>
              <Link href="/privacy-policy" className="text-white/50 font-montserrat font-medium text-[1rem] leading-[1.5] hover:text-white transition-colors">
                Политика конфиденциальности
              </Link>
            </div>
            <div className="pt-4 border-t border-white/20">
              <p className="text-white font-montserrat font-medium text-[1rem] leading-[1.5]">
                Разработано{' '}
                <Link 
                  href="https://t.me/nikolaysnow77" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white underline"
                >
                  Snow Studio
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        <div className="px-[1.625rem] py-[5rem] relative">
          {/* Decorative elements - positioned safely */}
          <div className="absolute top-[1rem] right-[1rem] w-[4rem] h-[4rem] opacity-[0.375] pointer-events-none">
            <div className="grid grid-cols-5 gap-[0.3rem]">
              {Array.from({ length: 25 }).map((_, i) => (
                <div key={i} className="w-[0.3rem] h-[0.3rem] bg-white/30 rounded-full"></div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-[5rem]">
            {/* Logo and Description */}
            <div className="flex flex-col gap-[1.25rem]">
              <div className="w-[13.75rem] h-[4.125rem] relative">
                <Image src="/assets/footer_logo.svg" alt="Nord Logo" fill className="object-contain" />
              </div>
              <p className="text-white font-montserrat font-normal text-[1rem] leading-[1.5] max-w-[20.8125rem]">
                Профессиональная прачечная для вашего бизнеса. Качество, надежность и индивидуальный подход.
              </p>
            </div>

            {/* Contact Buttons */}
            <div className="flex flex-col gap-[1.5rem]">
              <Button asChild className="bg-transparent border border-white text-white font-montserrat font-medium text-[0.875rem] leading-[1.71] px-[2.125rem] py-[1rem] rounded-[3.125rem] flex items-center justify-end w-full uppercase relative">
                <Link href="https://wa.me/79154268594" target="_blank" rel="noopener noreferrer" onClick={() => sendYandexMetricaEvent(YandexMetricaEvents.WHATS)}>
                  <span className="absolute left-1/2 transform -translate-x-1/2">Написать в Whatsapp</span>
                  <div className="w-[1.5rem] h-[1.5rem] relative ml-[4rem]">
                    <Image src="/assets/whatsapp-icon.svg" alt="WhatsApp" fill className="object-contain" />
                  </div>
                </Link>
              </Button>

              <Button asChild className="bg-transparent border border-white text-white font-montserrat font-medium text-[0.875rem] leading-[1.71] px-[2.125rem] py-[1rem] rounded-[3.125rem] flex items-center justify-end w-full uppercase relative">
                <Link href="https://t.me/nord_laundry_bot" target="_blank" rel="noopener noreferrer" onClick={() => sendYandexMetricaEvent(YandexMetricaEvents.TELEGRAM)}>
                  <span className="absolute left-1/2 transform -translate-x-1/2">Написать в Телеграм</span>
                  <div className="w-[1.5rem] h-[1.5rem] relative ml-[4rem]">
                    <Image src="/assets/telegram-icon.svg" alt="Telegram" fill className="object-contain" />
                  </div>
                </Link>
              </Button>

              <Button asChild className="bg-transparent border border-white text-white font-montserrat font-medium text-[0.875rem] leading-[1.71] px-[2.125rem] py-[1rem] rounded-[3.125rem] flex items-center justify-end w-full uppercase relative">
                <Link href="tel:+79154268594" onClick={() => sendYandexMetricaEvent(YandexMetricaEvents.PHONE)}>
                  <span className="absolute left-1/2 transform -translate-x-1/2">Позвонить</span>
                  <div className="w-[1.5rem] h-[1.5rem] relative ml-[4rem]">
                    <Image src="/assets/phone-icon.svg" alt="Phone" fill className="object-contain" />
                  </div>
                </Link>
              </Button>
            </div>

            {/* Contact Information */}
            <div className="space-y-[2.125rem]">
              <h3 className="text-white font-montserrat font-medium text-[1.25rem] leading-[1.2]">
                Контакты:
              </h3>

              <div className="space-y-[2.125rem]">
                <div>
                  <p className="text-white/50 font-montserrat font-medium text-[0.875rem] leading-[1.71] uppercase">
                    ТЕЛЕФОН:
                  </p>
                  <Link href="tel:+79154268594" onClick={() => sendYandexMetricaEvent(YandexMetricaEvents.PHONE)} className="text-white font-montserrat font-medium text-[1.125rem] leading-[1.33] hover:text-white/80 transition-colors">
                    +7 (915) 426-85-94
                  </Link>
                </div>

                <div>
                  <p className="text-white/50 font-montserrat font-medium text-[0.875rem] leading-[1.71] uppercase">
                    Почта:
                  </p>
                  <Link href="mailto:nordlaundry@gmail.com" className="text-white font-montserrat font-medium text-[1.125rem] leading-[1.33]">
                    nordlaundry@gmail.com
                  </Link>
                </div>

                <div>
                  <p className="text-white/50 font-montserrat font-medium text-[0.875rem] leading-[1.71] uppercase">
                    Адрес:
                  </p>
                  <p className="text-white font-montserrat font-medium text-[1.125rem] leading-[1.33]">
                    109316, г. Москва, ул. Талалихина, д. 41, с. 3
                  </p>
                </div>
              </div>
            </div>

            {/* Legal Links */}
            <div className="flex flex-col gap-[1.5rem]">
              <Link href="/privacy-policy" className="text-white/50 font-montserrat font-medium text-[0.875rem] leading-[1.71] hover:text-white transition-colors">
                Политика конфиденциальности
              </Link>
              <Link href="#" className="text-white/50 font-montserrat font-medium text-[0.875rem] leading-[1.71] hover:text-white transition-colors">
                © {new Date().getFullYear()} Nord Laundry. Все права защищены.
              </Link>
            </div>

            {/* Developer Credit */}
            <div className="pt-[1.5rem] border-t border-white">
            <p className="text-white font-montserrat font-medium text-[0.875rem] leading-[1.71]">
            Разработано{' '}
                <Link 
                  href="https://t.me/nikolaysnow77" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white  underline"
                >
                  Snow Studio
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}