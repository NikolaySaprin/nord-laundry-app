# Инструкции по развертыванию

Документ описывает процесс развертывания Next.js приложения на VPS с использованием PM2 и GitHub Actions для автоматического развертывания.

## Автоматическое развертывание (Рекомендуется)

Проект настроен для автоматического развертывания через GitHub Actions. При пуше в ветку `main` автоматически запускается деплой на VPS.

### Требуемые секреты в GitHub

- `VPS_HOST` - IP адрес или домен VPS
- `VPS_USER` - имя пользователя для SSH подключения
- `VPS_SSH_KEY` - приватный SSH ключ для подключения к серверу

### Процесс автоматического деплоя

1. Обновляется код в `/var/www/html/nord-laundry-app/`
2. Устанавливаются зависимости (`npm install`)
3. Собирается приложение (`npm run build`)
4. Копируется `ecosystem.config.js` в `/var/www/html/`
5. Создаются папки для логов
6. Перезапускаются PM2 процессы

## Структура на сервере

```
/var/www/html/
├── nord-laundry-app/          # Приложение
│   ├── .next/                 # Собранное приложение
│   ├── logs/                  # Логи приложения
│   ├── .env.local             # Переменные окружения
│   └── ...
└── ecosystem.config.js        # PM2 конфигурация
```

## Ручное развертывание

Для первого развертывания или ручной настройки сервера:

### Развертывание Next.js приложения

1. Клонирование репозитория:

```bash
cd /var/www/html
git clone <repository-url> nord-laundry-app
cd nord-laundry-app
```

2. Установка зависимостей:

```bash
npm install
```

3. Настройка переменных окружения:

```bash
# Копирование примера файла
cp env.example .env.local

# Редактирование .env.local
nano .env.local
```

4. Сборка приложения:

```bash
npm run build
```

5. Создание папки для логов:

```bash
mkdir -p logs
```

## Настройка PM2

1. Установка PM2 глобально:

```bash
npm install -g pm2
```

2. Копирование ecosystem.config.js в корень `/var/www/html`:

```bash
cp /var/www/html/nord-laundry-app/ecosystem.config.js /var/www/html/
```

3. Создание папок для логов:

```bash
mkdir -p /var/www/html/nord-laundry-app/logs
```

4. Запуск приложения:

```bash
cd /var/www/html
pm2 start ecosystem.config.js
```

5. Настройка автозапуска:

```bash
pm2 startup
pm2 save
```

## Мониторинг

```bash
# Просмотр статуса всех процессов
pm2 status

# Просмотр логов приложения
pm2 logs nord-laundry-app

# Перезапуск приложения
pm2 restart nord-laundry-app

# Остановка всех процессов
pm2 stop all

# Удаление всех процессов
pm2 delete all
```

## Обновление

### Обновление приложения

```bash
cd /var/www/html/nord-laundry-app
git pull origin main
npm install
npm run build
pm2 restart nord-laundry-app
```

## Логи

Логи сохраняются в `/var/www/html/nord-laundry-app/logs/`

## Переменные окружения

### Приложение (.env.local)

```bash
# Webhook для отправки заявок (только localhost для безопасности)
BOT_WEBHOOK_URL=http://localhost:3001/api/application

# Next.js Configuration
NEXT_PUBLIC_API_URL=https://nord-laundry.ru

# Разрешенные источники для CORS/CSRF (через запятую)
ALLOWED_ORIGINS=https://nord-laundry.ru,http://localhost:3000
```

**Важно**: Файл `.env.local` должен быть создан на сервере в папке `/var/www/html/nord-laundry-app/`. Без этого файла форма на сайте будет возвращать ошибку 500.

**Внимание**: `BOT_WEBHOOK_URL` должен указывать только на localhost/127.0.0.1 для предотвращения SSRF атак.

## Настройка Nginx

Для правильной работы статических файлов (изображений) настраивается Nginx.

### Конфигурация Nginx для nord-laundry.ru

Создание файла `/etc/nginx/sites-available/nord-laundry.ru`:

```nginx
server {
    listen 80;
    server_name nord-laundry.ru www.nord-laundry.ru;

    # Обслуживание статических изображений напрямую
    location /assets/ {
        alias /var/www/html/nord-laundry-app/public/assets/;
        expires 30d;
        add_header Cache-Control "public, immutable";
        
        # Поддержка различных форматов изображений
        location ~* \.(jpg|jpeg|png|gif|svg|webp)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Проксирование к Next.js приложению
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Активация конфигурации

```bash
# Создание символической ссылки
sudo ln -s /etc/nginx/sites-available/nord-laundry.ru /etc/nginx/sites-enabled/

# Проверка конфигурации
sudo nginx -t

# Перезагрузка Nginx
sudo systemctl reload nginx
```

### Проверка работы

```bash
# Проверка доступности изображений
curl -I http://nord-laundry.ru/assets/logo_nord.svg

# Должен вернуть 200 OK
```

## Исправление проблем с деплоем

### Проблема: PM2 не может найти ecosystem.config.js

При ошибках типа:
```
Error: PM2][ERROR] File ecosystem.config.js not found
npm error path /var/www/html/package.json
```

**Решение:**

1. Остановка всех процессов PM2:

```bash
pm2 stop all
pm2 delete all
```

2. Проверка структуры:

```bash
ls -la /var/www/html/
# Должно быть:
# nord-laundry-app/
# ecosystem.config.js (этот файл должен быть здесь!)
```

3. Если ecosystem.config.js отсутствует в `/var/www/html/`, скопировать его:

```bash
cp /var/www/html/nord-laundry-app/ecosystem.config.js /var/www/html/
```

4. Создание папок для логов:

```bash
mkdir -p /var/www/html/nord-laundry-app/logs
```

5. Запуск приложения:

```bash
cd /var/www/html
pm2 start ecosystem.config.js
```
