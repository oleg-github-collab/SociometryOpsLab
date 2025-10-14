# OpsLab Analytics - Railway Deployment Guide

## Поточний статус

- ✅ Backend задеплоєно: https://backend-production-121be.up.railway.app
- ✅ GitHub репозиторій: https://github.com/oleg-github-collab/SociometryOpsLab
- ⏳ Frontend: потрібно створити окремий сервіс
- ⏳ Database: потрібно виконати SQL скрипт

## Крок 1: Налаштування бази даних

1. Відкрий Railway проект: https://railway.com/project/7eb60fec-f690-4ba3-b443-ae369bef6735

2. Знайди PostgreSQL service → вкладка **Data** → **Query**

3. Скопіюй весь вміст файлу `railway-db-setup.sql` та виконай його

4. Перевір що таблиці створилися:
   ```sql
   SELECT table_name FROM information_schema.tables
   WHERE table_schema = 'public';
   ```

## Крок 2: Створення Frontend Service

1. В Railway проекті натисни **"+ New"**

2. Вибери **"GitHub Repo"**

3. Вибери репозиторій: **oleg-github-collab/SociometryOpsLab**

4. Railway створить новий сервіс

5. Перейди в **Settings** нового сервісу:

   **Root Directory:**
   ```
   frontend
   ```

   **Environment Variables** (додай ці змінні):
   ```
   VITE_API_URL=https://backend-production-121be.up.railway.app/api
   VITE_APP_NAME=OpsLab Analytics
   VITE_APP_VERSION=1.0.0
   NODE_ENV=production
   ```

6. В розділі **Settings → Networking** натисни **Generate Domain**

7. Збережи згенерований URL (наприклад: `https://frontend-production-xxxxx.up.railway.app`)

## Крок 3: Оновлення CORS на Backend

Після створення frontend service, потрібно оновити CORS на backend:

1. Запиши frontend URL з попереднього кроку

2. В Railway backend service → **Variables** → додай/оновити:
   ```
   FRONTEND_URL=https://frontend-production-xxxxx.up.railway.app
   ```

3. Backend автоматично перезапуститься з новими налаштуваннями CORS

## Крок 4: Тестування системи

### Backend endpoints:

- Health check: https://backend-production-121be.up.railway.app/health
- Debug DB: https://backend-production-121be.up.railway.app/debug/db
- Admin login: POST https://backend-production-121be.up.railway.app/api/auth/admin/login

**Тест admin login:**
```bash
curl -X POST https://backend-production-121be.up.railway.app/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"Oleh","password":"QwertY24$"}'
```

### Frontend:

Відкрий frontend URL в браузері та перевір:

1. **Landing page** (`/`) - повинна відкритися головна сторінка
2. **Admin login** (`/admin/login`) - логін: `Oleh`, пароль: `QwertY24$`
3. **Viewer login** (`/viewer/login`) - пароль: `viewer123`

## Структура проекту

```
SociometryOpsLab/
├── backend/              # Node.js + Express + Prisma
│   ├── src/
│   ├── prisma/
│   ├── nixpacks.toml    # Railway backend config
│   └── package.json
├── frontend/            # React + TypeScript + Vite
│   ├── src/
│   ├── nixpacks.toml   # Railway frontend config
│   └── package.json
├── railway.toml        # Root Railway config (backend)
└── railway-db-setup.sql # Database initialization script
```

## Credentials

### Admin Panel
- Username: `Oleh`
- Password: `QwertY24$`

### Viewer Dashboard
- Password: `viewer123`

## URLs

- **Backend API:** https://backend-production-121be.up.railway.app
- **Frontend:** (after deployment) https://frontend-production-xxxxx.up.railway.app
- **Railway Project:** https://railway.com/project/7eb60fec-f690-4ba3-b443-ae369bef6735
- **GitHub Repo:** https://github.com/oleg-github-collab/SociometryOpsLab

## Environment Variables

### Backend
```
DATABASE_URL=postgresql://... (auto from Railway)
JWT_SECRET=opslab-production-jwt-secret-key-2025-minimum-32-characters-required
ADMIN_USERNAME=Oleh
ADMIN_PASSWORD=QwertY24$
VIEWER_PASSWORD=viewer123
FRONTEND_URL=https://frontend-production-xxxxx.up.railway.app
NODE_ENV=production
PORT=3000
```

### Frontend
```
VITE_API_URL=https://backend-production-121be.up.railway.app/api
VITE_APP_NAME=OpsLab Analytics
VITE_APP_VERSION=1.0.0
NODE_ENV=production
```

## Troubleshooting

### Backend 500 errors
- Перевір що database таблиці створені: `/debug/db` endpoint
- Перевір Railway logs для backend service

### Frontend не підключається до API
- Перевір CORS налаштування на backend (FRONTEND_URL)
- Перевір що VITE_API_URL правильний в frontend environment variables

### Database connection errors
- Перевір що DATABASE_URL встановлений в backend service
- Перевір що PostgreSQL service запущений в Railway
