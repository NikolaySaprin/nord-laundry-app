import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const VALIDATE_URL = 'https://smartcaptcha.cloud.yandex.ru/validate'
const ALLOWED_CAPTCHA_HOSTS = new Set(['nord-laundry.ru', 'www.nord-laundry.ru'])
const VALIDATE_TIMEOUT_MS = 5_000
const MAX_TOKEN_LENGTH = 8_192

type SmartCaptchaResponse = {
  status?: unknown
  host?: unknown
}

function json(body: Record<string, unknown>, status: number) {
  return NextResponse.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
    },
  })
}

function getClientIp(request: NextRequest): string {
  const realIp = request.headers.get('x-real-ip')?.trim()
  if (realIp) {
    return realIp.slice(0, 64)
  }

  const forwardedIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  return forwardedIp?.slice(0, 64) || 'unknown'
}

function isAllowedRequestOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin')
  if (!origin) {
    return true
  }

  try {
    const originUrl = new URL(origin)
    const requestHost = request.headers.get('host')?.split(':')[0]?.toLowerCase()
    return (
      originUrl.hostname.toLowerCase() === requestHost ||
      (process.env.NODE_ENV !== 'production' && originUrl.hostname === 'localhost')
    )
  } catch {
    return false
  }
}

export async function POST(request: NextRequest) {
  if (!isAllowedRequestOrigin(request)) {
    return json({ success: false }, 403)
  }

  const contentLength = Number(request.headers.get('content-length') || '0')
  if (Number.isFinite(contentLength) && contentLength > 10_000) {
    return json({ success: false }, 413)
  }

  const serverKey = process.env.YANDEX_SMARTCAPTCHA_SERVER_KEY
  if (!serverKey) {
    return json({ success: false, unavailable: true }, 503)
  }

  let token: unknown
  try {
    const body = await request.json()
    token = body?.token
  } catch {
    return json({ success: false }, 400)
  }

  if (typeof token !== 'string' || token.length === 0 || token.length > MAX_TOKEN_LENGTH) {
    return json({ success: false }, 400)
  }

  const form = new URLSearchParams({
    secret: serverKey,
    token,
    ip: getClientIp(request),
  })

  try {
    const response = await fetch(VALIDATE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form,
      cache: 'no-store',
      signal: AbortSignal.timeout(VALIDATE_TIMEOUT_MS),
    })

    if (!response.ok) {
      return json({ success: false, unavailable: true }, 503)
    }

    const result = await response.json() as SmartCaptchaResponse
    if (result.status !== 'ok') {
      return json({ success: false }, 403)
    }

    if (
      typeof result.host === 'string' &&
      result.host.length > 0 &&
      !ALLOWED_CAPTCHA_HOSTS.has(result.host.toLowerCase())
    ) {
      return json({ success: false }, 403)
    }

    return json({ success: true }, 200)
  } catch {
    return json({ success: false, unavailable: true }, 503)
  }
}
