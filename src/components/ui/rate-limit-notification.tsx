'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { sendYandexMetricaEvent, YandexMetricaEvents } from '@/lib/yandex-metrica';

interface RateLimitNotificationProps {
  isVisible: boolean;
  message: string;
  onClose: () => void;
}

export const RateLimitNotification: React.FC<RateLimitNotificationProps> = ({ 
  isVisible, 
  message,
  onClose
}) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isVisible) {
      // Автоскрытие через 10 секунд
      timeoutRef.current = setTimeout(() => {
        onClose();
      }, 10000);

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 left-4 sm:top-6 sm:left-6 bg-red-500 text-white px-4 py-3 sm:px-6 rounded-lg shadow-lg z-[100000] max-w-md">
      <div className="flex items-start gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <svg className="w-5 h-5 flex-shrink-0 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <div className="flex-1 min-w-0">
            <span className="font-montserrat font-medium text-sm sm:text-base leading-relaxed text-white block">
              {message}
            </span>
            <div className="flex items-center justify-start gap-3 mt-3">
              <Link 
                href="tel:+74952114295" 
                onClick={() => sendYandexMetricaEvent(YandexMetricaEvents.PHONE)}
                className="w-[1.75rem] h-[1.75rem] sm:w-[2rem] sm:h-[2rem] relative flex-shrink-0 hover:opacity-80 transition-opacity [&>img]:brightness-0 [&>img]:invert"
                aria-label="Позвонить"
              >
                <Image src="/assets/phone-icon.svg" alt="Телефон" fill className="object-contain" />
              </Link>
              <Link 
                href="https://wa.me/79852114295" 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => sendYandexMetricaEvent(YandexMetricaEvents.WHATS)}
                className="w-[1.75rem] h-[1.75rem] sm:w-[2rem] sm:h-[2rem] relative flex-shrink-0 hover:opacity-80 transition-opacity"
                aria-label="WhatsApp"
              >
                <Image src="/assets/whatsapp-icon.svg" alt="WhatsApp" fill className="object-contain" />
              </Link>
              <Link 
                href="https://t.me/nord_laundry_bot" 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => sendYandexMetricaEvent(YandexMetricaEvents.TELEGRAM)}
                className="w-[1.75rem] h-[1.75rem] sm:w-[2rem] sm:h-[2rem] relative flex-shrink-0 hover:opacity-80 transition-opacity"
                aria-label="Telegram"
              >
                <Image src="/assets/telegram-icon.svg" alt="Telegram" fill className="object-contain" />
              </Link>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 w-5 h-5 flex items-center justify-center hover:opacity-80 transition-opacity"
          aria-label="Закрыть"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L11 11M1 11L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

