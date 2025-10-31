'use client';

import React, { createContext, useContext } from 'react';
import { useSuccessNotification } from '@/hooks/use-success-notification';
import { useRateLimitNotification } from '@/hooks/use-rate-limit-notification';
import { SuccessNotification } from '@/components/ui/success-notification';
import { RateLimitNotification } from '@/components/ui/rate-limit-notification';
import { NotificationContextType, NotificationProviderProps } from '@/types/components';

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const { isVisible: isSuccessVisible, message: successMessage, showNotification: showSuccess, hideNotification: hideSuccess } = useSuccessNotification();
  const { isVisible: isRateLimitVisible, message: rateLimitMessage, showNotification: showRateLimit, hideNotification: hideRateLimit } = useRateLimitNotification();

  const showSuccessNotification = (customMessage?: string) => {
    showSuccess(customMessage);
  };

  const hideSuccessNotification = () => {
    hideSuccess();
  };

  const showRateLimitNotification = (customMessage?: string) => {
    showRateLimit(customMessage);
  };

  const hideRateLimitNotification = () => {
    hideRateLimit();
  };

  return (
    <NotificationContext.Provider value={{ 
      showSuccessNotification, 
      hideSuccessNotification,
      showRateLimitNotification,
      hideRateLimitNotification
    }}>
      {children}
      <SuccessNotification isVisible={isSuccessVisible} message={successMessage} />
      <RateLimitNotification isVisible={isRateLimitVisible} message={rateLimitMessage} onClose={hideRateLimit} />
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
