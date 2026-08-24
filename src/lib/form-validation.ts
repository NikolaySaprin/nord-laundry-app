import { z } from 'zod';

export const baseFormSchema = z.object({
  name: z.string()
    .min(2, "Имя должно содержать минимум 2 символа")
    .max(100, "Имя не должно превышать 100 символов"),
  phone: z.string()
    .regex(
      /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/,
      "Введите корректный номер телефона"
    ),
  privacy: z.coerce.boolean()
    .refine(val => val === true, "Необходимо согласие с политикой конфиденциальности")
});

export const unifiedFormSchema = baseFormSchema.extend({
  sphere: z.string().optional(), // Используется для sphere или industry
  email: z.string().email("Введите корректный email").optional().or(z.literal(''))
});

export type UnifiedFormData = z.infer<typeof unifiedFormSchema>;

export type FormSource = 'contact_form' | 'bottom_form' | 'services_form' | 'modal_form';

export type ApplicationSubmission = UnifiedFormData & {
  source: FormSource;
};

export const formatPhoneNumber = (value: string): string => {
  const digits = value.replace(/\D/g, '');
  
  if (!digits) return '';
  
  let normalizedDigits = digits;
  if (digits.startsWith('8')) {
    normalizedDigits = '7' + digits.slice(1);
  } else if (digits.startsWith('7')) {
    normalizedDigits = digits;
  } else {
    normalizedDigits = '7' + digits;
  }
  
  if (normalizedDigits.length <= 1) {
    return `+7 (${normalizedDigits}`;
  } else if (normalizedDigits.length <= 4) {
    return `+7 (${normalizedDigits.slice(1, 4)}`;
  } else if (normalizedDigits.length <= 7) {
    return `+7 (${normalizedDigits.slice(1, 4)}) ${normalizedDigits.slice(4, 7)}`;
  } else if (normalizedDigits.length <= 9) {
    return `+7 (${normalizedDigits.slice(1, 4)}) ${normalizedDigits.slice(4, 7)}-${normalizedDigits.slice(7, 9)}`;
  } else {
    return `+7 (${normalizedDigits.slice(1, 4)}) ${normalizedDigits.slice(4, 7)}-${normalizedDigits.slice(7, 9)}-${normalizedDigits.slice(9, 11)}`;
  }
};

export const normalizePhoneNumber = (value: string): string => {
  const digits = value.replace(/\D/g, '');
  if (digits.startsWith('8') || digits.startsWith('7')) {
    return `+7${digits.slice(1)}`;
  } else if (!digits.startsWith('+')) {
    return `+7${digits}`;
  }
  
  return digits;
};

export const extendedFormSchema = unifiedFormSchema;