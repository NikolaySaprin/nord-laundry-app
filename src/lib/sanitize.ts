import xss, { IWhiteList } from 'xss';

// Strict config: no HTML allowed, only plain text output
const whitelist: IWhiteList = {};

const xssOptions = {
  whiteList: whitelist,
  stripIgnoreTag: true,
  stripIgnoreTagBody: ['script', 'style', 'iframe', 'object', 'embed'],
  allowCommentTag: false,
};

export function sanitizeText(input: unknown): string {
  if (typeof input !== 'string') return '';
  // Normalize odd whitespace and sanitize
  const normalized = input.replace(/[\u0000-\u001F\u007F]+/g, ' ').trim();
  return xss(normalized, xssOptions);
}

export function sanitizePayload<T extends Record<string, unknown>>(payload: T, keys: Array<keyof T>): T {
  const copy: Record<string, unknown> = { ...payload };
  for (const key of keys) {
    copy[String(key)] = sanitizeText(payload[key]);
  }
  return copy as T;
}

export function redactPhone(phone: string): string {
  // +7XXXXXXXXXX -> +7******XX
  if (!phone) return '';
  return phone.replace(/(\+?\d{0,2})\d{6}(\d{2})?$/, (_m, p1, p2 = '') => `${p1}******${p2}`);
}


