# Nord Laundry


Профессиональная прачечная для бизнеса, построенная на Next.js 15 с оптимизацией для SEO.

## Технологии

- **Next.js 15** - React фреймворк с App Router
- **TypeScript** - типизированный JavaScript
- **Tailwind CSS** - utility-first CSS фреймворк
- **Radix UI** - компоненты интерфейса
- **Lucide React** - иконки
- **Swiper** - слайдер
- **React Hook Form** - управление формами
- **Zod** - валидация схем
- **xss** - защита от XSS атак

## Особенности

- ✅ **SEO оптимизация** - мета-теги, sitemap, robots.txt
- ✅ **Серверные компоненты** - для лучшей производительности
- ✅ **Оптимизация изображений** - Next.js Image компонент
- ✅ **Адаптивный дизайн** - мобильная версия
- ✅ **Типизация** - полная поддержка TypeScript
- ✅ **Современный UI** - компоненты Radix UI
- ✅ **Интеграция с Telegram** - отправка заявок через webhook
- ✅ **Безопасность** - защита от XSS, CSRF, SSRF, rate limiting

## Быстрый старт

### Установка зависимостей

```bash
npm install
```

### Настройка переменных окружения

Создать файл `.env.local` в корне проекта на основе `env.example`:

```bash
cp env.example .env.local
```

Обязательные переменные:
- `BOT_WEBHOOK_URL` - URL webhook для отправки заявок (только localhost/127.0.0.1)
- `ALLOWED_ORIGINS` - разрешенные источники для CORS/CSRF (опционально)
- `NEXT_PUBLIC_API_URL` - публичный URL приложения

### Запуск в режиме разработки

```bash
npm run dev
```

Приложение доступно по адресу `http://localhost:3000`

### Сборка для продакшена

```bash
npm run build
```

### Запуск продакшен версии

```bash
npm start
```

## Структура проекта

```
├── src/
│   ├── app/                # App Router (Next.js 13+)
│   │   ├── api/           # API routes
│   │   ├── globals.css    # Глобальные стили
│   │   ├── layout.tsx     # Корневой layout
│   │   └── page.tsx       # Главная страница
│   ├── components/         # React компоненты
│   │   ├── client/        # Клиентские компоненты
│   │   ├── server/        # Серверные компоненты
│   │   └── ui/            # UI компоненты (Radix UI)
│   ├── lib/               # Утилиты
│   │   ├── security.ts    # Функции безопасности
│   │   ├── sanitize.ts    # Санитизация данных
│   │   └── form-validation.ts # Валидация форм
│   ├── hooks/             # React хуки
│   ├── types/             # TypeScript типы
│   └── middleware.ts      # Next.js middleware
├── public/                # Статические файлы
├── package.json           # Зависимости проекта
└── next.config.js         # Конфигурация Next.js
```

## SEO настройки

Проект включает:
- Мета-теги для социальных сетей (Open Graph)
- Структурированные данные
- Sitemap.xml (автогенерация)
- Robots.txt (автогенерация)
- Оптимизация изображений через Next.js Image
- Семантическая разметка HTML

## Безопасность

Реализованные меры защиты:
- **XSS Protection** - санитизация всех пользовательских данных
- **CSRF Protection** - валидация Origin/Referer заголовков
- **SSRF Protection** - валидация внутренних URL
- **Rate Limiting** - ограничение количества запросов
- **Security Headers** - CSP, HSTS, X-Frame-Options и др.
- **Data Sanitization** - маскировка PII в логах

Подробнее в [SECURITY.md](./SECURITY.md)

## Развертывание

Проект готов для развертывания на:
- VPS с Docker и Docker Compose (рекомендуется)
- Vercel
- Netlify
- AWS
- Любой хостинг с поддержкой Node.js

Инструкции по развертыванию в [DEPLOYMENT.md](./DEPLOYMENT.md)

## Доступные скрипты

- `npm run dev` - запуск в режиме разработки
- `npm run build` - сборка для продакшена
- `npm start` - запуск продакшен версии
- `npm run lint` - проверка кода линтером

## Лицензия

MIT
