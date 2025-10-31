# Security Hardening Guide

Документ описывает реализованные меры безопасности и рекомендации для поддержания безопасности проекта.

## Реализованные меры защиты

### 1. XSS (Cross-Site Scripting) Protection

- **Библиотека**: `xss` v1.0.15 (проверена на компрометацию)
- **Реализация**:
  - Все пользовательские данные очищаются через `sanitizeText()` перед отправкой
  - Клиентская санитизация в `use-form-submit.ts`
  - Серверная санитизация в API route перед валидацией
- **Защита**: Блокирует HTML/JS инъекции в формах
- **Файлы**: `src/lib/sanitize.ts`, `src/hooks/use-form-submit.ts`, `src/app/api/submit-application/route.ts`

### 2. CSP (Content Security Policy) с Nonce

- **Реализация**: Динамический nonce для каждого запроса через middleware
- **Особенности**:
  - `script-src` использует `nonce-{nonce}` и `strict-dynamic` для безопасной загрузки скриптов
  - Яндекс.Метрика работает через nonce, гарантированно и безопасно
  - Убран `unsafe-inline` из script-src (кроме fallback в next.config.js)
- **Файлы**: `src/middleware.ts`, `src/lib/yandex-metrica.ts`

### 3. SSRF (Server-Side Request Forgery) Protection

- **Защита URL webhook**: Валидация `BOT_WEBHOOK_URL` в `src/lib/security.ts`
- **Ограничения**:
  - Разрешены только `localhost`, `127.0.0.1`, `::1`
  - Только протокол `http://` для внутренних сервисов
  - Блокировка приватных IP диапазонов
- **Файл**: `src/app/api/submit-application/route.ts`

### 4. CSRF (Cross-Site Request Forgery) Protection

- **Защита**: Валидация Origin/Referer заголовков
- **Логика**:
  - Разрешены same-origin запросы (без Origin или с Origin=host)
  - Проверка Referer для POST запросов
  - Логирование подозрительных запросов
- **Файл**: `src/lib/security.ts` → `validateOrigin()`

### 5. Rate Limiting

- **Ограничение**: 3 запроса в 5 минут на IP
- **Реализация**: In-memory хранилище в middleware
- **Улучшение для продакшена**: Рекомендуется использовать Redis для распределенного rate limiting
- **Файл**: `src/middleware.ts`

### 6. Security Headers

- **X-Frame-Options**: `DENY` (защита от clickjacking)
- **X-Content-Type-Options**: `nosniff` (защита от MIME-sniffing)
- **Strict-Transport-Security**: HSTS с preload
- **Permissions-Policy**: Отключение ненужных функций браузера
- **Cross-Origin Policies**: COOP, COEP, CORP для изоляции
- **Файл**: `next.config.js`

### 7. Data Sanitization в логах

- **Маскировка PII**: Номера телефонов маскируются в логах через `redactPhone()`
- **Файл**: `src/lib/sanitize.ts`

## Переменные окружения

### Требуемые переменные

```bash
# URL webhook для отправки заявок (должен быть localhost/127.0.0.1)
BOT_WEBHOOK_URL=http://localhost:3001/api/application

# Разрешенные источники для CORS (через запятую)
ALLOWED_ORIGINS=https://nord-laundry.ru,http://localhost:3000
```

**Важно**: `BOT_WEBHOOK_URL` должен указывать только на localhost/127.0.0.1 для предотвращения SSRF атак.

## Проверка npm пакетов

### Аудит безопасности

```bash
npm audit
```

Статус: ✅ 0 уязвимостей (проверено)

### Проверка на вредоносные пакеты

Регулярная проверка установленных пакетов:

```bash
npm ls | grep -E "babelcli|crossenv|d3.js|fabric-js|http-proxy.js|jquery.js|mariadb|mongose|mssql.js"
```

### Рекомендации по обновлениям

- Регулярно обновлять зависимости: `npm update`
- Проверять changelog перед major обновлениями
- Использовать `npm outdated` для проверки устаревших пакетов

## Типы атак и защита

| Тип атаки | Защита | Статус |
|-----------|--------|--------|
| XSS | xss библиотека, CSP | ✅ |
| SSRF | Валидация URL | ✅ |
| CSRF | Origin/Referer валидация | ✅ |
| Clickjacking | X-Frame-Options | ✅ |
| MIME-sniffing | X-Content-Type-Options | ✅ |
| DoS | Rate limiting | ✅ |
| SQL Injection | Нет БД | N/A |
| Command Injection | Нет exec в пользовательском коде | ✅ |
| Path Traversal | Next.js защита | ✅ |

## Проверка перед деплоем

1. Проверить, что `BOT_WEBHOOK_URL` указывает на localhost/127.0.0.1
2. Убедиться, что `ALLOWED_ORIGINS` содержит только разрешенные домены
3. Проверить, что все секреты в `.env` файлах, а не в коде
4. Запустить `npm audit` для проверки уязвимостей
5. Проверить логи на наличие маскированных данных

## Обновление безопасности

Для поддержания актуальности:
1. Еженедельно: `npm audit`
2. Ежемесячно: Проверка обновлений зависимостей
3. Ежеквартально: Полный аудит безопасности кода

## Контакты для вопросов безопасности

При обнаружении уязвимостей связаться с разработчиком https://t.me/nikolaysnow77 .
