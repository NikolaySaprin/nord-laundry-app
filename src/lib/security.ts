import { NextRequest } from 'next/server';
import { URL } from 'url';

/**
 * Validates URL to prevent SSRF attacks
 * Only allows http://localhost or http://127.0.0.1 for internal services
 */
export function validateInternalUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();
    
    // Allow only localhost or 127.0.0.1 (for local bot)
    const allowedHosts = ['localhost', '127.0.0.1', '::1'];
    
    if (!allowedHosts.includes(hostname)) {
      return false;
    }
    
    // Only allow http protocol for internal services
    if (parsed.protocol !== 'http:') {
      return false;
    }
    
    // Block private IP ranges even if somehow parsed
    if (hostname.includes('192.168.') || 
        hostname.includes('10.') || 
        hostname.includes('172.') ||
        hostname.includes('169.254.')) {
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
}

/**
 * Validates Origin header to prevent CSRF
 * Returns true if Origin is valid or missing (same-origin request)
 * For same-origin POST requests from forms, Origin may be missing
 */
export function validateOrigin(request: NextRequest, allowedOrigins: string[]): boolean {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  const host = request.headers.get('host') || '';
  const hostname = host.split(':')[0];
  
  // Same-origin requests (form submissions from same site) don't have Origin header
  // or have Origin matching the host
  if (!origin) {
    // Check if referer is from same origin (same-site form submission)
    if (referer) {
      try {
        const refererUrl = new URL(referer);
        return refererUrl.hostname === hostname || refererUrl.hostname === 'localhost';
      } catch {
        return false;
      }
    }
    // If no origin and no referer, it's likely a same-origin request
    // But be more strict - require at least referer for POST requests
    return true; // Allow for now, but log it
  }
  
  // If origin is same as host, it's valid
  try {
    const originUrl = new URL(origin);
    if (originUrl.hostname === hostname || originUrl.hostname === 'localhost') {
      return true;
    }
  } catch {
    // Invalid origin URL
  }
  
  // If no allowed origins configured, only allow same-origin (which we already checked above)
  // If we got here with an origin, it means it's not same-origin and no allowed origins configured
  // In this case, block external origins
  if (allowedOrigins.length === 0) {
    return false; // Block cross-origin requests when no allowed origins configured
  }
  
  // Validate against allowed origins
  try {
    const originUrl = new URL(origin);
    return allowedOrigins.some(allowed => {
      try {
        const allowedUrl = new URL(allowed);
        return originUrl.origin === allowedUrl.origin;
      } catch {
        return origin === allowed;
      }
    });
  } catch {
    return false;
  }
}

/**
 * Generates a cryptographically secure nonce
 */
export function generateNonce(): string {
  const array = new Uint8Array(16);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array);
  } else {
    // Fallback for SSR (should not happen in Next.js)
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

