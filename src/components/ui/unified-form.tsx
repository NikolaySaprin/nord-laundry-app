'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { unifiedFormSchema, UnifiedFormData } from '@/lib/form-validation';
import { useFormSubmit } from '@/hooks/use-form-submit';
import { useNotification } from '@/contexts/notification-context';
import { UnifiedFormProps } from '@/types/components';
import Link from 'next/link';
import { sendYandexMetricaEvent, YandexMetricaEvents } from '@/lib/yandex-metrica';

export const UnifiedForm: React.FC<UnifiedFormProps> = ({
  source,
  showSphereField = false,
  spherePlaceholder = 'Ваша сфера (не обязательно)',
  buttonText = 'Получить КП',
  onSuccess,
  className = ''
}) => {
  const { showRateLimitNotification } = useNotification();
  const router = useRouter();

  const form = useForm<UnifiedFormData>({
    resolver: zodResolver(unifiedFormSchema),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: {
      name: '',
      phone: '',
      sphere: '',
      privacy: true
    }
  });

  const { isSubmitting, submitError, submitForm } = useFormSubmit({
    source,
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }

      router.push('/thanks');
    }
  });

  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 640); // sm breakpoint
    };

    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // Показывать уведомление на desktop при ошибке rate limit
  useEffect(() => {
    if (submitError && submitError.includes('Слишком много запросов') && isDesktop) {
      showRateLimitNotification(submitError);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitError, isDesktop]);

  const onSubmit = async (data: UnifiedFormData) => {
    await submitForm(data, form.reset, form.setError);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue('phone', e.target.value);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue('name', e.target.value);
  };

  const handleSphereChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue('sphere', e.target.value);
  };

  const handlePrivacyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue('privacy', e.target.checked);
  };

  return (
    <>

      <form onSubmit={form.handleSubmit(onSubmit)} className={`space-y-[1.25rem] ${className}`}>
        {/* Поле имени */}
        <div className="flex items-center gap-[0.5rem] p-[0.625rem_1rem] border border-[#D7DAE2] rounded-[0.5rem] bg-white">
          <input
            type="text"
            placeholder="Ваше имя"
            value={form.watch('name') || ''}
            onChange={handleNameChange}
            className="flex-1 text-[#202124] font-montserrat font-normal text-[0.875rem] lg:text-[1rem] leading-[1.71] lg:leading-[1.5] bg-transparent border-none outline-none"
          />
          <Image src="/form-icon/people-Icon.svg" alt="" width={24} height={24} className="object-contain" />
        </div>
        {form.formState.errors.name && (
          <p className="text-red-500 text-xs mt-1">
            {form.formState.errors.name.message}
          </p>
        )}

        {/* Поле телефона */}
        <div className="flex items-center gap-[0.5rem] p-[0.625rem_1rem] border border-[#D7DAE2] rounded-[0.5rem] bg-white">
          <input
            type="tel"
            placeholder="+7 (999) 999-99-99"
            value={form.watch('phone') || ''}
            onChange={handlePhoneChange}
            className="flex-1 text-[#202124] font-montserrat font-normal text-[0.875rem] lg:text-[1rem] leading-[1.71] lg:leading-[1.5] bg-transparent border-none outline-none"
          />
          <Image src="/form-icon/phone-Icon.svg" alt="" width={24} height={24} className="object-contain" />
        </div>
        {form.formState.errors.phone && (
          <p className="text-red-500 text-xs mt-1">
            {form.formState.errors.phone.message}
          </p>
        )}

        {/* Поле сферы (если включено) */}
        {showSphereField && (
          <div className="flex items-start gap-[0.5rem] p-[0.625rem_1rem] border border-[#D7DAE2] rounded-[0.5rem] bg-white min-h-[2.75rem] lg:min-h-[4rem]">
            <input
              type="text"
              placeholder={spherePlaceholder}
              value={form.watch('sphere') || ''}
              onChange={handleSphereChange}
              className="flex-1 text-[#202124] font-montserrat font-normal text-[0.875rem] lg:text-[1rem] leading-[1.71] lg:leading-[1.5] bg-transparent border-none outline-none placeholder:text-[#999EAD] placeholder:whitespace-normal placeholder:break-words"
            />
            <Image src="/form-icon/pencil-Icon.svg" alt="" width={24} height={24} className="flex-shrink-0 mt-[0.125rem] object-contain" />
          </div>
        )}

        {/* Кнопка и чекбокс */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-[1.25rem]">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#3264F6] hover:bg-[#2950D4] text-white font-montserrat font-medium text-[0.875rem] leading-[1.43] px-[1rem] py-[0.625rem] rounded-[0.5rem] lg:rounded-[2.125rem] h-[2.75rem] w-full lg:w-auto flex items-center justify-center"
          >
            {isSubmitting ? 'Отправка...' : buttonText}
          </Button>

          <div className="flex flex-col">
            <div className="flex items-center gap-[0.625rem] px-[1.25rem] lg:px-0">
              <input
                type="checkbox"
                id={`privacy-${source}`}
                checked={form.watch('privacy') || false}
                onChange={handlePrivacyChange}
                className="w-[1rem] h-[1rem] border-2 border-[#999EAD] bg-[#D9D9D9] rounded-[0.125rem]"
              />
              <label htmlFor={`privacy-${source}`} className="text-[#202124] font-montserrat font-normal text-[0.75rem] leading-[1.22]">
                Отправляя форму Вы соглашаетесь с{' '}
                <Link href="/privacy-policy" className="underline hover:text-[#3264F6] transition-colors">
                  политикой конфиденциальности
                </Link>
              </label>
            </div>
            {form.formState.errors.privacy && (
              <p className="text-red-500 text-xs mt-1 px-[1.25rem] lg:px-0">
                {form.formState.errors.privacy.message}
              </p>
            )}
          </div>
        </div>

        {/* Показывать ошибку rate limit только на mobile, на desktop показывается уведомление */}
        {submitError && submitError.includes('Слишком много запросов') && !isDesktop && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-3 rounded relative mt-4 w-full">
            <div className="flex flex-col gap-3">
              <p className="text-[0.875rem] font-montserrat font-medium leading-[1.4]">
                {submitError}
              </p>
              <div className="flex items-center justify-center gap-4">
                <Link
                  href="tel:+79504836065"
                  onClick={() => sendYandexMetricaEvent(YandexMetricaEvents.PHONE)}
                  className="w-[2rem] h-[2rem] relative flex-shrink-0 hover:opacity-80 transition-opacity"
                  aria-label="Позвонить"
                >
                  <Image src="/assets/phone-icon.svg" alt="Телефон" fill className="object-contain" />
                </Link>
                <Link
                  href="https://wa.me/79504836065"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => sendYandexMetricaEvent(YandexMetricaEvents.WHATS)}
                  className="w-[2rem] h-[2rem] relative flex-shrink-0 hover:opacity-80 transition-opacity"
                  aria-label="WhatsApp"
                >
                  <Image src="/assets/whatsapp-icon.svg" alt="WhatsApp" fill className="object-contain" />
                </Link>
                <Link
                  href="https://t.me/nord_laundry_bot"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => sendYandexMetricaEvent(YandexMetricaEvents.TELEGRAM)}
                  className="w-[2rem] h-[2rem] relative flex-shrink-0 hover:opacity-80 transition-opacity"
                  aria-label="Telegram"
                >
                  <Image src="/assets/telegram-icon.svg" alt="Telegram" fill className="object-contain" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Остальные ошибки показываем всегда */}
        {submitError && !submitError.includes('Слишком много запросов') && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4 md:max-w-[20rem]">
            <span className="block sm:inline">{submitError}</span>
          </div>
        )}
      </form>
    </>
  );
};
