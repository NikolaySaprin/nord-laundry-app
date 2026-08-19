'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useScrollLock } from '@/hooks/useScrollLock';
import { sendYandexMetricaEvent, YandexMetricaEvents } from '@/lib/yandex-metrica';

// Lazy load ContactModal - загружается только при клике
const ContactModal = dynamic(() => import('./ContactModal').then(mod => ({ default: mod.ContactModal })), {
  ssr: false,
});

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  useScrollLock(isMobileMenuOpen || isContactModalOpen);

  const handleClick = () => {
    setIsContactModalOpen(true)
    sendYandexMetricaEvent(YandexMetricaEvents.GET_A_PAYMENT_BTN)
  }

  return (
    <>
      <header className="hidden lg:block bg-white shadow-[0px_0.0625rem_0.25rem_0px_rgba(0,0,0,0.15)] h-[5rem] fixed top-0 left-0 right-0 z-50">
        <div className="max-w-[87.5rem] mx-auto px-[2.5rem] h-full flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-[6.875rem] h-[2.0625rem] relative">
              <Image src="/assets/logo_nord.svg" alt="Nord Logo" fill className="object-contain" />
            </div>
          </div>

          <nav className="bg-[#E3EAF6] rounded-[4.25rem] p-[0.125rem] flex items-center">
            <Link href="/#services" className="bg-transparent rounded-[4.25rem] px-[1rem] py-[0.25rem] text-[#2C4495] font-montserrat font-medium text-[0.875rem] leading-[1.43] uppercase hover:bg-white transition-colors">
              Услуги
            </Link>
            <Link href="/#pricing" className="bg-transparent rounded-[4.25rem] px-[1rem] py-[0.25rem] text-[#2C4495] font-montserrat font-medium text-[0.875rem] leading-[1.43] uppercase hover:bg-white transition-colors">
              Цены
            </Link>
            <Link href="/#promotions" className="bg-transparent rounded-[4.25rem] px-[1rem] py-[0.25rem] text-[#2C4495] font-montserrat font-medium text-[0.875rem] leading-[1.43] uppercase hover:bg-white transition-colors">
              Акции
            </Link>
            <Link href="/#packaging" className="bg-transparent rounded-[4.25rem] px-[1rem] py-[0.25rem] text-[#2C4495] font-montserrat font-medium text-[0.875rem] leading-[1.43] uppercase hover:bg-white transition-colors">
              Упаковка
            </Link>
            <Link href="/#clients-cases" className="bg-transparent rounded-[4.25rem] px-[1rem] py-[0.25rem] text-[#2C4495] font-montserrat font-medium text-[0.875rem] leading-[1.43] uppercase hover:bg-white transition-colors">
              Кейсы
            </Link>
            <Link href="/#footer" className="bg-transparent rounded-[4.25rem] px-[1rem] py-[0.25rem] text-[#2C4495] font-montserrat font-medium text-[0.875rem] leading-[1.43] uppercase hover:bg-white transition-colors">
              Контакты
            </Link>
          </nav>

          {/* Contact Info & CTA */}
          <div className="flex items-center gap-[1.5rem]">
            {/* Phone - Full number for larger screens */}
            <div className="hidden xl:block text-[#2C4495] font-montserrat font-medium text-[1rem] leading-[1.25]">
              +7 (950) 483-60-65
            </div>

            {/* Phone - Icon for smaller screens */}
            <Link
              href="tel:+79504836065"
              className="xl:hidden flex items-center justify-center w-[1.75rem] h-[1.75rem] relative"
              title="Позвонить"
              onClick={() => sendYandexMetricaEvent(YandexMetricaEvents.PHONE)}
            >
              <Image src="/assets/phone-icon.svg" alt="Phone" fill className="object-contain" />
            </Link>

            {/* Social Links */}
            <div className="flex items-center gap-[0.875rem]">
              <Link
                href="https://wa.me/79504836065"
                className="flex items-center justify-center w-[1.75rem] h-[1.75rem] relative"
                title="WhatsApp"
                target="_blank"
                rel="noopener"
                onClick={() => sendYandexMetricaEvent(YandexMetricaEvents.WHATS)}
              >
                <Image src="/assets/whatsapp-icon.svg" alt="WhatsApp" fill className="object-contain" />
              </Link>
              <Link
                href="https://t.me/nord_laundry_bot"
                className="flex items-center justify-center w-[1.75rem] h-[1.75rem] relative"
                title="Telegram"
                target="_blank"
                rel="noopener"
                onClick={() => sendYandexMetricaEvent(YandexMetricaEvents.TELEGRAM)}
              >
                <Image src="/assets/telegram-icon.svg" alt="Telegram" fill className="object-contain" />
              </Link>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleClick}
              className="bg-[#E3EAF6] rounded-[4.25rem] px-[1.5rem] py-[0.625rem] flex items-center justify-center text-[#2C4495] font-montserrat font-medium text-[0.875rem] leading-[1.43] uppercase"
            >
              Получить расчет за 5 минут
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="lg:hidden bg-white shadow-[0px_0.0625rem_0.25rem_0px_rgba(0,0,0,0.25)] h-[3.75rem] flex items-center justify-between fixed top-0 left-0 right-0 z-50">
        {/* Logo */}
        <div className="flex items-center ml-[1rem]">
          <div className="w-[6.5rem] h-[1.625rem] relative">
            <Image src="/assets/logo_nord.svg" alt="Nord Logo" fill className="object-contain" />
          </div>
        </div>

        {/* Social Links */}
        <div className="flex items-center justify-center flex-1 mx-auto">
          <div className="flex items-center gap-[1.25rem]">
            <Link
              href="https://wa.me/79504836065"
              className="flex items-center justify-center w-[1.5rem] h-[1.5rem] relative"
              title="WhatsApp"
              target="_blank"
              rel="noopener"
              onClick={() => sendYandexMetricaEvent(YandexMetricaEvents.WHATS)}
            >
              <Image src="/assets/whatsapp-icon.svg" alt="WhatsApp" fill className="object-contain" />
            </Link>
            <Link
              href="https://t.me/nord_laundry_bot"
              className="flex items-center justify-center w-[1.5rem] h-[1.5rem] relative"
              title="Telegram"
              target="_blank"
              rel="noopener"
              onClick={() => sendYandexMetricaEvent(YandexMetricaEvents.TELEGRAM)}
            >
              <Image src="/assets/telegram-icon.svg" alt="Telegram" fill className="object-contain" />
            </Link>
            <Link
              href="tel:+79504836065"
              className="flex items-center justify-center w-[1.5rem] h-[1.5rem] relative"
              title="Позвонить"
              onClick={() => sendYandexMetricaEvent(YandexMetricaEvents.PHONE)}
            >
              <Image src="/assets/phone-icon.svg" alt="Phone" fill className="object-contain" />
            </Link>
          </div>
        </div>

        {/* Menu Button */}
        <button
          className="bg-[#E3EAF6] rounded-[4.25rem] px-[1.125rem] py-[0.375rem] flex items-center gap-[0.75rem] mr-[1rem] z-10 relative"
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Открыть меню"
        >
          <span className="text-[#2C4495] font-montserrat font-medium text-[0.75rem] leading-[1.67]">
            Меню
          </span>
          <div className="w-[1.5rem] h-[1.5rem] bg-white rounded-full flex items-center justify-center relative">
            <Image src="/mobile-menu-icon.svg" alt="Menu" width={36} height={36} className="object-contain" />
          </div>
        </button>
      </header>

      {/* Mobile Menu Popup */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed inset-0 bg-white w-full h-full overflow-hidden z-40">
            {/* Close Button */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-[30px] right-[30px] w-[32px] h-[32px] bg-black/20 rounded-full flex items-center justify-center z-50"
              aria-label="Закрыть"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L13 13M1 13L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {/* Decorative elements - with pointer-events-none to prevent click interference */}
            <div className="absolute top-[56px] right-[-99px] w-[209px] h-[231px] pointer-events-none transform rotate-[27deg] z-0 opacity-100">
              <Image src="/assets/decorative/mobile-menu-snowflake-1.svg" alt="" fill className="object-contain" />
            </div>
            <div className="absolute bottom-[10px] right-[0px] w-[132px] h-[145px] pointer-events-none z-0">
              <Image src="/assets/decorative/mobile-menu-snowflake-2.svg" alt="" fill className="object-contain" />
            </div>
            {/* Top-left snowflake (same as bottom modal snowflake) */}
            <div className="absolute top-[10px] left-[10px] w-[132px] h-[145px] pointer-events-none z-0">
              <Image src="/assets/snowflake-1.svg" alt="" fill className="object-contain" />
            </div>

            <div className="p-[30px] pt-[90px] relative z-20">
              {/* Navigation buttons */}
              <div className="mb-[40px] flex justify-center">
                <div className="flex flex-col gap-[4px]">
                  <Link
                    href="/#services"
                    className="text-[#2C4495] font-montserrat font-medium text-[16px] leading-[20px] uppercase text-center py-[12px] w-full block transition-colors relative z-10"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setTimeout(() => {
                        document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                  >
                    УСЛУГИ
                  </Link>
                  <Link
                    href="/#pricing"
                    className="text-[#2C4495] font-montserrat font-medium text-[16px] leading-[20px] uppercase text-center py-[12px] w-full block transition-colors relative z-10"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setTimeout(() => {
                        document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                  >
                    ЦЕНЫ
                  </Link>
                  <Link
                    href="/#promotions"
                    className="text-[#2C4495] font-montserrat font-medium text-[16px] leading-[20px] uppercase text-center py-[12px] w-full block transition-colors relative z-10"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setTimeout(() => {
                        document.getElementById('promotions')?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                  >
                    АКЦИИ
                  </Link>
                  <Link
                    href="/#packaging"
                    className="text-[#2C4495] font-montserrat font-medium text-[16px] leading-[20px] uppercase text-center py-[12px] w-full block transition-colors relative z-10"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setTimeout(() => {
                        document.getElementById('packaging')?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                  >
                    УПАКОВКА
                  </Link>
                  <Link
                    href="/#clients-cases"
                    className="text-[#2C4495] font-montserrat font-medium text-[16px] leading-[20px] uppercase text-center py-[12px] w-full block transition-colors relative z-10"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setTimeout(() => {
                        document.getElementById('clients-cases')?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                  >
                    КЕЙСЫ
                  </Link>
                  <Link
                    href="/#footer"
                    className="text-[#2C4495] font-montserrat font-medium text-[16px] leading-[20px] uppercase text-center py-[12px] w-full block transition-colors relative z-10"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setTimeout(() => {
                        document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                  >
                    КОНТАКТЫ
                  </Link>
                </div>
              </div>

              {/* Contact buttons */}
              <div className="space-y-[16px] mt-auto relative z-20">
                <Link
                  href="https://wa.me/79504836065"
                  className="w-[85%] mx-auto bg-transparent border border-[#2C4495] text-[#2C4495] font-montserrat font-medium text-[14px] leading-[24px] px-[20px] py-[12px] rounded-[50px] flex items-center justify-center transition-colors relative h-[48px] pr-[60px]"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    sendYandexMetricaEvent(YandexMetricaEvents.WHATS);
                  }}
                  target="_blank"
                  rel="noopener"
                >
                  НАПИСАТЬ В WHATSAPP
                  <Image src="/assets/whatsapp-icon.svg" alt="WhatsApp" width={28} height={28} className="absolute right-[20px] top-1/2 transform -translate-y-1/2 object-contain" />
                </Link>

                <Link
                  href="https://t.me/nord_laundry_bot"
                  className="w-[85%] mx-auto bg-transparent border border-[#2C4495] text-[#2C4495] font-montserrat font-medium text-[14px] leading-[24px] px-[20px] py-[12px] rounded-[50px] flex items-center justify-center transition-colors relative h-[48px] pr-[60px]"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    sendYandexMetricaEvent(YandexMetricaEvents.TELEGRAM);
                  }}
                  target="_blank"
                  rel="noopener"
                >
                  НАПИСАТЬ В ТЕЛЕГРАМ
                  <Image src="/assets/telegram-icon.svg" alt="Telegram" width={28} height={28} className="absolute right-[20px] top-1/2 transform -translate-y-1/2 object-contain" />
                </Link>

                <Link
                  href="tel:+79504836065"
                  className="w-[85%] mx-auto bg-transparent border border-[#2C4495] text-[#2C4495] font-montserrat font-medium text-[14px] leading-[24px] px-[20px] py-[12px] rounded-[50px] flex items-center justify-center transition-colors relative h-[48px] pr-[60px]"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    sendYandexMetricaEvent(YandexMetricaEvents.PHONE);
                  }}
                >
                  ПОЗВОНИТЬ
                  <Image src="/assets/phone-icon.svg" alt="Phone" width={28} height={28} className="absolute right-[20px] top-1/2 transform -translate-y-1/2 object-contain" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => {
          setIsContactModalOpen(false);
          setTimeout(() => {
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.overflowY = '';
            document.body.style.paddingRight = '';
            (document.body.style as any).touchAction = '';
            (document.body.style as any).overscrollBehavior = '';
          }, 100);
        }}
      />

    </>
  );
};