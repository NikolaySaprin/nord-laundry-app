# Инструкции по развертыванию

Документ описывает процесс развертывания Next.js приложения на VPS с использованием Docker и Docker Compose для безопасного и изолированного запуска.

## Архитектура развертывания

Проект развертывается с использованием Docker Compose, который обеспечивает:
- Изоляцию сервисов через Docker контейнеры
- Безопасность через read-only файловые системы и ограничение прав
- Автоматический перезапуск при сбоях
- Управление зависимостями между сервисами

## Структура на сервере

```
/srv/nord/
├── web/                    # Next.js приложение
│   ├── Dockerfile          # Docker образ для веб-приложения
│   ├── .env.production     # Переменные окружения для продакшена
│   └── ...
├── bot/                    # Telegram/WhatsApp бот
│   ├── Dockerfile          # Docker образ для бота
│   ├── .env.production     # Переменные окружения для бота
│   └── ...
└── docker-compose.yml      # Конфигурация Docker Compose
```

## Требования

- Ubuntu 22.04+ или другой Linux дистрибутив
- Docker Engine 20.10+
- Docker Compose v2.0+
- Node.js 22+ (для сборки образов)
- Nginx (для reverse proxy)

## Ручное развертывание

### 1. Подготовка сервера

```bash
# Установка Docker (если не установлен)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Установка Docker Compose plugin
sudo mkdir -p /usr/local/lib/docker/cli-plugins
sudo curl -SL https://github.com/docker/compose/releases/download/v2.29.7/docker-compose-linux-x86_64 -o /usr/local/lib/docker/cli-plugins/docker-compose
sudo chmod +x /usr/local/lib/docker/cli-plugins/docker-compose
```

### 2. Клонирование и настройка проекта

```bash
# Создание директории для проектов
sudo mkdir -p /srv/nord
sudo chown -R $USER:$USER /srv/nord

# Клонирование репозиториев
cd /srv/nord
git clone <repository-url> web
git clone <bot-repository-url> bot
```

### 3. Настройка переменных окружения

#### Веб-приложение (`/srv/nord/web/.env.production`)

```bash
NODE_ENV=production
BOT_WEBHOOK_URL=http://webhook:3001/api/application
INTERNAL_SERVICE_HOSTS=bot,webhook
ALLOWED_ORIGINS=https://nord-laundry.ru
NEXT_PUBLIC_API_URL=https://nord-laundry.ru
```

#### Бот (`/srv/nord/bot/.env.production`)

```bash
NODE_ENV=production
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_GROUP_CHAT_ID=your_group_chat_id
ENABLE_WHATSAPP=true
CREATE_AUTH_ARCHIVE=false
```

### 4. Создание Docker Compose конфигурации

Создайте файл `/srv/nord/docker-compose.yml`:

```yaml
networks:
  internal:
    driver: bridge

services:
  web:
    build: ./web
    command: ["npm","run","start"]
    env_file: ./web/.env.production
    environment:
      NODE_ENV: production
      NEXT_TELEMETRY_DISABLED: "1"
    user: "1001:1001"
    read_only: true
    tmpfs:
      - /tmp
    security_opt:
      - no-new-privileges:true
    cap_drop: ["ALL"]
    depends_on: [bot, webhook]
    ports:
      - "127.0.0.1:3005:3000"
    networks: [internal]
    restart: unless-stopped

  bot:
    build: ./bot
    command: ["node","bot-runner.mjs"]
    env_file: ./bot/.env.production
    environment:
      NODE_ENV: production
    user: "1001:1001"
    read_only: true
    volumes:
      - bot-auth:/app/.wwebjs_auth
    tmpfs:
      - /tmp
    security_opt:
      - no-new-privileges:true
    cap_drop: ["ALL"]
    expose:
      - "3001"
    networks: [internal]
    restart: unless-stopped

  webhook:
    build: ./bot
    command: ["node","webhook-server.mjs"]
    env_file: ./bot/.env.production
    environment:
      NODE_ENV: production
    user: "1001:1001"
    read_only: true
    tmpfs:
      - /tmp
    security_opt:
      - no-new-privileges:true
    cap_drop: ["ALL"]
    expose:
      - "3001"
    networks: [internal]
    restart: unless-stopped

volumes:
  bot-auth:
```

### 5. Сборка и запуск

```bash
cd /srv/nord

# Сборка образов
docker compose build

# Запуск сервисов
docker compose up -d

# Проверка статуса
docker compose ps

# Просмотр логов
docker compose logs -f
```

## Настройка Nginx

Nginx используется как reverse proxy для HTTPS и маршрутизации трафика к контейнерам.

### Конфигурация Nginx

Создайте файл `/etc/nginx/sites-available/nord-laundry`:

```nginx
server {
    listen 80;
    server_name nord-laundry.ru www.nord-laundry.ru;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name nord-laundry.ru www.nord-laundry.ru;

    ssl_certificate /etc/letsencrypt/live/nord-laundry.ru/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/nord-laundry.ru/privkey.pem;
    ssl_trusted_certificate /etc/letsencrypt/live/nord-laundry.ru/chain.pem;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    ssl_prefer_server_ciphers off;
    ssl_protocols TLSv1.2 TLSv1.3;

    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    location / {
        proxy_pass http://127.0.0.1:3005;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Port $server_port;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
        proxy_send_timeout 60s;
    }

    location ~ /(\.)(?!well-known) {
        deny all;
        access_log off;
        log_not_found off;
    }

    location ~* (\.env|\.git|wp-config) {
        deny all;
        return 404;
    }
}
```

### Активация конфигурации

```bash
# Создание символической ссылки
sudo ln -s /etc/nginx/sites-available/nord-laundry /etc/nginx/sites-enabled/

# Проверка конфигурации
sudo nginx -t

# Перезагрузка Nginx
sudo systemctl reload nginx
```

## Мониторинг и управление

### Просмотр статуса

```bash
cd /srv/nord

# Статус всех сервисов
docker compose ps

# Логи всех сервисов
docker compose logs

# Логи конкретного сервиса
docker compose logs web
docker compose logs bot
docker compose logs webhook

# Следить за логами в реальном времени
docker compose logs -f
```

### Перезапуск сервисов

```bash
cd /srv/nord

# Перезапуск всех сервисов
docker compose restart

# Перезапуск конкретного сервиса
docker compose restart web

# Пересоздание и перезапуск (после изменений в коде)
docker compose up -d --force-recreate web
```

### Обновление приложения

```bash
cd /srv/nord

# Обновление кода
cd web
git pull origin main
cd ../bot
git pull origin main
cd ..

# Пересборка и перезапуск
docker compose build
docker compose up -d
```

## Безопасность

### Ограничения контейнеров

- **Read-only файловая система**: Контейнеры работают в режиме только для чтения
- **No new privileges**: Контейнеры не могут повышать привилегии
- **Capability dropping**: Все Linux capabilities удалены
- **Non-root user**: Контейнеры работают от пользователя с UID 1001
- **Network isolation**: Сервисы изолированы в отдельной Docker сети

### Firewall правила

Настроены iptables правила для ограничения исходящего трафика из контейнеров:
- Разрешены только необходимые соединения (Telegram API, внутренняя сеть)
- Блокировка всех остальных исходящих соединений

## Переменные окружения

### Веб-приложение

- `BOT_WEBHOOK_URL` - URL webhook для отправки заявок (только внутренние хосты)
- `INTERNAL_SERVICE_HOSTS` - Разрешенные внутренние хосты (через запятую)
- `ALLOWED_ORIGINS` - Разрешенные источники для CORS/CSRF
- `NEXT_PUBLIC_API_URL` - Публичный URL приложения

**Важно**: `BOT_WEBHOOK_URL` должен указывать только на внутренние хосты (bot, webhook) для предотвращения SSRF атак.

### Бот

- `TELEGRAM_BOT_TOKEN` - Токен Telegram бота
- `TELEGRAM_GROUP_CHAT_ID` - ID группы Telegram для заявок
- `ENABLE_WHATSAPP` - Включить/выключить WhatsApp бота

## Устранение проблем

### Контейнеры не запускаются

```bash
# Проверка логов
docker compose logs

# Проверка конфигурации
docker compose config

# Пересоздание контейнеров
docker compose down
docker compose up -d
```

### Проблемы с сетью

```bash
# Проверка сети
docker network inspect nord_internal

# Пересоздание сети
docker compose down
docker compose up -d
```

### Проблемы с правами доступа

```bash
# Проверка владельца файлов
ls -la /srv/nord

# Исправление прав
sudo chown -R deployer:deployer /srv/nord
```

## Автоматическое развертывание

Для автоматического развертывания через GitHub Actions см. `.github/workflows/deploy.yml`.
