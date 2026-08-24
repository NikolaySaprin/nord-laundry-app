'use client';

import { useState } from 'react';
import { normalizePhoneNumber } from '@/lib/form-validation';
import { sendYandexMetricaEvent, YandexMetricaEvents } from '@/lib/yandex-metrica';
import { UseFormSubmitOptions, UseFormSubmitReturn, FormSource } from '@/types/forms';
import { UseFormReset, UseFormSetError } from 'react-hook-form';
import { sanitizeText } from '@/lib/sanitize';

function getYandexMetricaEventName(source: FormSource): typeof YandexMetricaEvents[keyof typeof YandexMetricaEvents] | null {
  switch (source) {
    case 'modal_form':
      return YandexMetricaEvents.FORM_MODAL;
    case 'services_form':
      return YandexMetricaEvents.FORM_SERVIS;
    case 'bottom_form':
      return YandexMetricaEvents.FORM_KEIS;
    default:
      return null;
  }
}


export function useFormSubmit({
  source,
  onSuccess,
  onError
}: UseFormSubmitOptions): UseFormSubmitReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const submitForm = async (data: any, reset: UseFormReset<any>, setError?: UseFormSetError<any>) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setIsSuccess(false);
    
    try {
      const normalizedData = {
        ...data,
        name: sanitizeText(data.name),
        sphere: data.sphere ? sanitizeText(data.sphere) : undefined,
        email: data.email ? sanitizeText(data.email) : undefined,
        phone: normalizePhoneNumber(sanitizeText(data.phone)),
        source
      };
      
      
      if (process.env.NODE_ENV === 'development') {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        reset();
        setIsSuccess(true);
        
        const eventName = getYandexMetricaEventName(source);
        if (eventName) {
          sendYandexMetricaEvent(eventName);
        }
        
        if (onSuccess) {
          onSuccess();
        }
        return;
      }
      
      const response = await fetch('/api/submit-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(normalizedData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка при отправке заявки');
      }

      reset();
      setIsSuccess(true);
      
      const eventName = getYandexMetricaEventName(source);
      if (eventName) {
        sendYandexMetricaEvent(eventName);
      }
      
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Ошибка при отправке заявки. Пожалуйста, попробуйте еще раз.';
      
      setSubmitError(errorMessage);
      console.error('Ошибка отправки формы:', error);
      
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    submitError,
    isSuccess,
    submitForm
  };
}