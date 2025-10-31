import { NextRequest, NextResponse } from 'next/server';
import { extendedFormSchema } from '@/lib/form-validation';
import { sanitizePayload, redactPhone } from '@/lib/sanitize';
import { validateInternalUrl, validateOrigin } from '@/lib/security';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // CSRF protection: validate Origin header
    // Next.js has built-in CSRF protection, but we add extra layer
    // If ALLOWED_ORIGINS is empty, only same-origin requests are allowed
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',').filter(Boolean) || [];
    
    // Allow same-origin requests (forms from the same site don't have Origin header)
    // But validate cross-origin requests if ALLOWED_ORIGINS is configured
    const origin = request.headers.get('origin');
    if (origin && !validateOrigin(request, allowedOrigins)) {
      // Log suspicious request
      const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() 
        || request.headers.get('x-real-ip') 
        || 'unknown';
      console.warn('⚠️ CSRF protection: Blocked request with invalid Origin', {
        origin: origin,
        referer: request.headers.get('referer'),
        host: request.headers.get('host'),
        ip: clientIp,
        timestamp: new Date().toISOString()
      });
      return NextResponse.json(
        { error: 'Неразрешенный источник запроса' },
        { status: 403 }
      );
    }
    
    // If origin is missing and allowedOrigins is empty, it's likely same-origin (OK)
    // If origin is missing and allowedOrigins has values, still OK (same-origin)
    
    const body = await request.json();
    
    // Sanitize expected text fields defensively before validation
    const sanitizedBody = sanitizePayload(body, ['name', 'phone', 'sphere'] as any);
    const validationResult = extendedFormSchema.safeParse(sanitizedBody);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Неверные данные', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const application = {
      name: validationResult.data.name,
      phone: validationResult.data.phone,
      sphere: validationResult.data.sphere || '',
      source: body.source || 'website_form',
    };

    // SSRF protection: validate bot webhook URL
    const botWebhookUrl = process.env.BOT_WEBHOOK_URL || 'http://localhost:3001/api/application';
    if (!validateInternalUrl(botWebhookUrl)) {
      console.error('⚠️ Блокирован небезопасный URL для бота:', botWebhookUrl);
      return NextResponse.json(
        { error: 'Конфигурационная ошибка сервера' },
        { status: 500 }
      );
    }
    
    console.log('Отправка заявки в бот:', {
      url: botWebhookUrl,
      application: {
        name: application.name,
        phone: redactPhone(application.phone),
        sphere: application.sphere ? '[provided]' : '[empty]',
        source: application.source,
      },
      timestamp: new Date().toISOString()
    });
    
    let webhookSuccess = false;
    let webhookError = null;

    try {
      const webhookResponse = await fetch(botWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(application),
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });

      if (!webhookResponse.ok) {
        const errorText = await webhookResponse.text();
        webhookError = {
          status: webhookResponse.status,
          statusText: webhookResponse.statusText,
          url: botWebhookUrl,
          error: errorText,
          timestamp: new Date().toISOString()
        };
        console.error('Ошибка отправки в бот:', webhookError);
      } else {
        webhookSuccess = true;
        console.log('Заявка успешно отправлена в бот:', {
          status: webhookResponse.status,
          timestamp: new Date().toISOString()
        });
      }
    } catch (webhookFetchError) {
      webhookError = {
        error: webhookFetchError instanceof Error ? webhookFetchError.message : String(webhookFetchError),
        url: botWebhookUrl,
        timestamp: new Date().toISOString()
      };
      console.error('Не удалось подключиться к боту:', webhookError);
    }

    // Если webhook не удался, логируем это, но не возвращаем ошибку пользователю
    if (!webhookSuccess) {
      console.warn('⚠️ ВАЖНО: Заявка не отправлена в бот. Сохраните данные вручную:', {
        application,
        webhookError,
        timestamp: new Date().toISOString()
      });
      
      // TODO: Здесь можно добавить резервное сохранение в БД или файл
      // Например: await saveToDatabase(application);
    }
    
    return NextResponse.json(
      { success: true, message: 'Заявка успешно отправлена' },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Ошибка API маршрута:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}