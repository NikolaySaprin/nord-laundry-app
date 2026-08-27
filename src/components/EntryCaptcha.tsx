'use client'

import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'

const CAPTCHA_SCRIPT_URL = 'https://smartcaptcha.cloud.yandex.ru/captcha.js'
const SESSION_KEY = 'nord-entry-captcha-passed-v1'
const CALLBACK_NAME = 'nordEntryCaptchaCallback'
const SCRIPT_TIMEOUT_MS = 10_000
const VERIFY_TIMEOUT_MS = 7_000

const EXCLUDED_ROUTE_PREFIXES = [
  '/admin',
  '/api',
  '/checkout',
  '/internal',
  '/pay',
  '/payment',
  '/service',
  '/webhook',
  '/_next',
]

type CaptchaState = 'loading' | 'ready' | 'verifying' | 'failed' | 'unavailable'

declare global {
  interface Window {
    nordEntryCaptchaCallback?: (token: string) => void
    smartCaptcha?: {
      reset: () => void
    }
  }
}

function isExcludedRoute(pathname: string): boolean {
  return EXCLUDED_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  )
}

function rememberPass(): void {
  try {
    window.sessionStorage.setItem(SESSION_KEY, '1')
  } catch {
    // Storage can be unavailable in privacy modes. The visitor is still allowed through.
  }
}

function wasPassedInThisSession(): boolean {
  try {
    return window.sessionStorage.getItem(SESSION_KEY) === '1'
  } catch {
    return false
  }
}

export function EntryCaptcha({ clientKey }: { clientKey: string }) {
  const pathname = usePathname()
  const excluded = useMemo(() => isExcludedRoute(pathname), [pathname])
  const [visible, setVisible] = useState(false)
  const [state, setState] = useState<CaptchaState>('loading')

  const continueWithoutCaptcha = useCallback(() => {
    rememberPass()
    setVisible(false)
  }, [])

  const verifyToken = useCallback(async (token: string) => {
    if (!token || state === 'verifying') {
      return
    }

    setState('verifying')
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), VERIFY_TIMEOUT_MS)

    try {
      const response = await fetch('/api/entry-captcha/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
        cache: 'no-store',
        signal: controller.signal,
      })

      if (response.ok) {
        rememberPass()
        setVisible(false)
        return
      }

      if (response.status === 403) {
        setState('failed')
        window.smartCaptcha?.reset()
        return
      }

      setState('unavailable')
    } catch {
      setState('unavailable')
    } finally {
      window.clearTimeout(timeout)
    }
  }, [state])

  useEffect(() => {
    if (excluded || wasPassedInThisSession()) {
      setVisible(false)
      return
    }

    setVisible(true)
    setState(clientKey ? 'loading' : 'unavailable')
  }, [clientKey, excluded])

  useEffect(() => {
    if (!visible) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [visible])

  useEffect(() => {
    window.nordEntryCaptchaCallback = verifyToken
    return () => {
      delete window.nordEntryCaptchaCallback
    }
  }, [verifyToken])

  useEffect(() => {
    if (!visible || !clientKey || state !== 'loading') {
      return
    }

    const timeout = window.setTimeout(() => setState('unavailable'), SCRIPT_TIMEOUT_MS)
    return () => window.clearTimeout(timeout)
  }, [clientKey, state, visible])

  useEffect(() => {
    if (!visible || !clientKey || state !== 'ready') {
      return
    }

    const container = document.querySelector('[data-entry-captcha-container="true"]')
    if (!container || container.childElementCount > 0) {
      return
    }

    let rendered = false
    const observer = new MutationObserver(() => {
      if (container.childElementCount > 0) {
        rendered = true
        observer.disconnect()
      }
    })
    observer.observe(container, { childList: true, subtree: true })

    const timeout = window.setTimeout(() => {
      observer.disconnect()
      if (!rendered && container.childElementCount === 0) {
        setState('unavailable')
      }
    }, SCRIPT_TIMEOUT_MS)

    return () => {
      observer.disconnect()
      window.clearTimeout(timeout)
    }
  }, [clientKey, state, visible])

  if (!visible || excluded) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-[2147483647] flex min-h-[100dvh] items-center justify-center overflow-y-auto bg-[#142451]/70 px-4 py-8 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="entry-captcha-title"
      aria-describedby="entry-captcha-description"
    >
      <div className="w-full max-w-[28rem] rounded-[1.75rem] bg-white px-5 py-7 text-center shadow-[0_24px_80px_rgba(13,31,78,0.32)] sm:px-9 sm:py-9">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#EAF0FF] text-[#3264F6]" aria-hidden="true">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 3 4.5 6v5.4c0 4.7 3.2 8.1 7.5 9.6 4.3-1.5 7.5-4.9 7.5-9.6V6L12 3Z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
        </div>

        <h1 id="entry-captcha-title" className="text-balance text-[1.35rem] font-semibold leading-tight text-[#172653] sm:text-[1.6rem]">
          Подтвердите, что вы не робот
        </h1>
        <p id="entry-captcha-description" className="mt-2 text-[0.95rem] text-[#65708D] sm:text-base">
          Это займёт несколько секунд
        </p>

        {clientKey && state !== 'unavailable' && (
          <>
            <Script
              id="yandex-smartcaptcha"
              src={CAPTCHA_SCRIPT_URL}
              strategy="afterInteractive"
              onLoad={() => setState((current) => current === 'loading' ? 'ready' : current)}
              onError={() => setState('unavailable')}
            />
            <div className="mt-7 flex min-h-[100px] items-center justify-center">
              <div
                className="smart-captcha"
                data-sitekey={clientKey}
                data-callback={CALLBACK_NAME}
                data-hl="ru"
                data-entry-captcha-container="true"
              />
            </div>
          </>
        )}

        {state === 'verifying' && (
          <p className="mt-5 text-sm text-[#65708D]" role="status">Проверяем результат…</p>
        )}

        {state === 'failed' && (
          <p className="mt-5 text-sm text-[#9C3B3B]" role="alert">
            Не удалось подтвердить проверку. Пожалуйста, попробуйте ещё раз.
          </p>
        )}

        {state === 'unavailable' && (
          <div className="mt-7" role="alert">
            <p className="text-sm leading-relaxed text-[#65708D]">
              Сервис проверки сейчас недоступен. Вы можете продолжить работу с сайтом.
            </p>
            <button
              type="button"
              onClick={continueWithoutCaptcha}
              className="mt-5 min-h-12 w-full rounded-full bg-[#3264F6] px-6 py-3 font-medium text-white transition-colors hover:bg-[#274FC5] focus:outline-none focus:ring-2 focus:ring-[#3264F6] focus:ring-offset-2"
            >
              Продолжить
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
