'use client';

import { useState, useCallback } from 'react';

export const useRateLimitNotification = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState<string>('');

  const showNotification = useCallback((customMessage?: string) => {
    if (customMessage) {
      setMessage(customMessage);
    } else {
      setMessage('Слишком много запросов. Свяжитесь с нами любым удобным способом');
    }
    
    setIsVisible(true);
    
    // Не скрываем автоматически, пусть пользователь сам закроет или использует контакты
    // setTimeout(() => {
    //   setIsVisible(false);
    // }, 10000);
  }, []);

  const hideNotification = useCallback(() => {
    setIsVisible(false);
  }, []);

  return {
    isVisible,
    message,
    showNotification,
    hideNotification
  };
};

