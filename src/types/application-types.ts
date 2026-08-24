
export type Application = {
  name: string;
  phone: string;
  sphere?: string;
  email?: string;
  source: 'website_form' | 'whatsapp' | 'telegram_direct' | 'contact_form' | 'bottom_form' | 'services_form' | 'modal_form';
  userIdentifierTelegram?: string;
  userNameTelegram?: string;
  userUsernameTelegram?: string;
  userMessage?: string;
  telegramUserId?: number;
}