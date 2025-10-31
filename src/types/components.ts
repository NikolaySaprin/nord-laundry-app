
export interface ApplicationFormProps {
  title: string;
  description: string;
  showSphereField?: boolean;
  source: 'contact_form' | 'bottom_form' | 'services_form';
  buttonText?: string;
}

export interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export interface UnifiedFormProps {
  source: 'contact_form' | 'bottom_form' | 'services_form' | 'modal_form';
  showSphereField?: boolean;
  spherePlaceholder?: string;
  buttonText?: string;
  onSuccess?: () => void;
  className?: string;
}

export interface SuccessNotificationProps {
  isVisible: boolean;
  message?: string;
}

export interface NotificationContextType {
  showSuccessNotification: (message?: string) => void;
  hideSuccessNotification: () => void;
  showRateLimitNotification: (message?: string) => void;
  hideRateLimitNotification: () => void;
}

export interface NotificationProviderProps {
  children: React.ReactNode;
}

export interface DecorativeElementProps {
  type?: 'dots' | 'snowflake';
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'custom';
  customPosition?: string;
  className?: string;
  mobileOnly?: boolean;
  desktopOnly?: boolean;
}

export interface DecorativePatternProps {
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'custom';
  customPosition?: string;
  opacity?: number;
  width?: string;
  height?: string;
  mobileOnly?: boolean;
  desktopOnly?: boolean;
  className?: string;
}

