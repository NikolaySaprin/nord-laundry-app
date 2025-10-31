# Настройка Git репозитория

Документ описывает процесс настройки Git репозитория для Next.js приложения.

## Инициализация репозитория

1. Инициализация Git репозитория:

```bash
cd /path/to/nord-laundry-app
git init
```

2. Добавление всех файлов:

```bash
git add .
```

3. Первый коммит:

```bash
git commit -m "Initial commit: Nord Laundry Next.js application"
```

4. Создание репозитория на GitHub (или другом Git хостинге)

5. Добавление remote origin:

```bash
git remote add origin <repository-url>
```

6. Отправка кода:

```bash
git push -u origin main
```

## Настройка Git Secrets

Для безопасного хранения переменных окружения используется Git Secrets.

1. Установка git-secrets:

```bash
# macOS
brew install git-secrets

# Ubuntu/Debian
sudo apt-get install git-secrets
```

2. Настройка git-secrets для репозитория:

```bash
cd /path/to/nord-laundry-app
git secrets --install
git secrets --register-aws
```

3. Добавление паттернов для защиты секретов:

```bash
git secrets --add '.*\.env.*'
git secrets --add 'API_KEY'
git secrets --add 'DATABASE_URL'
git secrets --add 'BOT_WEBHOOK_URL'
git secrets --add 'TELEGRAM.*'
```

4. Создание файла .env.local.example:

```bash
cp env.example .env.local.example
```

5. Добавление .env.local.example в репозиторий:

```bash
git add .env.local.example
git commit -m "Add .env.local.example template"
```

## Настройка CI/CD (опционально)

Создание файла `.github/workflows/deploy.yml` для автоматического развертывания:

```yaml
name: Deploy Next.js App

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm install
      
    - name: Build
      run: npm run build
      
    - name: Deploy to server
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          cd /var/www/html/nord-laundry-app
          git pull origin main
          npm install
          npm run build
          pm2 restart nord-laundry-app
```

## Команды для работы с репозиторием

```bash
# Проверка статуса
git status

# Добавление изменений
git add .

# Коммит
git commit -m "Описание изменений"

# Отправка на сервер
git push origin main

# Получение изменений
git pull origin main

# Создание новой ветки
git checkout -b feature/new-feature

# Переключение на ветку
git checkout main

# Слияние ветки
git merge feature/new-feature
```

## .gitignore

Убедиться, что следующие файлы и папки добавлены в `.gitignore`:

```
# Dependencies
node_modules/
/.pnp
.pnp.js

# Testing
/coverage

# Production
/build
/.next/
/out/
dist/

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env*.local
.env

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts

# PM2
.pm2/
logs/
*.log

# IDE
.idea/
.vscode/
*.swp
*.swo
*~
```
