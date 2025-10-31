import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory rate limiter per IP for API endpoint
// Window: 300s, Limit: 3 requests
const RATE_LIMIT_WINDOW_MS = 300_000;
const RATE_LIMIT_MAX = 3;
const ipToTimestamps: Map<string, number[]> = new Map();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const timestamps = ipToTimestamps.get(ip) || [];
  const recent = timestamps.filter((t) => t > windowStart);
  recent.push(now);
  ipToTimestamps.set(ip, recent);
  return recent.length > RATE_LIMIT_MAX;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const response = NextResponse.next();

  // Only apply rate limiting to API endpoint
  // CSP is handled in next.config.js to avoid blocking Next.js hydration
  if (req.method === 'POST' && pathname === '/api/submit-application') {
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      'unknown';

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Слишком много запросов. Свяжитесь с нами любым удобным способом' },
        {
          status: 429,
          headers: {
            'Retry-After': '300',
          },
        }
      );
    }
  }

  return response;
}

export const config = {
  // Apply only to API routes for rate limiting
  // CSP is set in next.config.js for all routes to avoid blocking Next.js internals
  matcher: ['/api/submit-application'],
};


