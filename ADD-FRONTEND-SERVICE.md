# Як додати Frontend Service на Railway

## Крок 1: Відкрий Railway Project
https://railway.com/project/7eb60fec-f690-4ba3-b443-ae369bef6735

## Крок 2: Додай новий Service

1. Натисни кнопку **"+ New"** (в правому верхньому куті або в центрі канвасу)

2. Вибери **"GitHub Repo"**

3. Вибери репозиторій: **oleg-github-collab/SociometryOpsLab**

4. Railway автоматично створить новий сервіс і почне його деплоїти

## Крок 3: Налаштуй Service

Railway створить сервіс, але треба налаштувати його для frontend:

### 3.1 Settings → General

- **Service Name**: змінь на `frontend` (опціонально, для зручності)

### 3.2 Settings → Source

- **Root Directory**: встанови `frontend`

  Це найважливіше! Railway буде білдити тільки папку frontend.

### 3.3 Settings → Variables

Додай ці environment variables:

```
VITE_API_URL=https://backend-production-121be.up.railway.app/api
VITE_APP_NAME=OpsLab Analytics
VITE_APP_VERSION=1.0.0
NODE_ENV=production
```

**Як додати змінні:**
- Натисни **"+ New Variable"**
- Введи назву змінної (наприклад `VITE_API_URL`)
- Введи значення
- Натисни **"Add"**
- Повтори для всіх змінних

### 3.4 Settings → Networking

- Натисни **"Generate Domain"**
- Railway створить публічний URL типу: `https://sociometryopslab-production-xxxx.up.railway.app`
- **Скопіюй цей URL!** Він буде потрібен для CORS

## Крок 4: Онови CORS на Backend

Після створення frontend domain:

1. Перейди до **backend service** в Railway

2. **Settings → Variables**

3. Знайди змінну `FRONTEND_URL` та оновити її значення на твій frontend URL:
   ```
   FRONTEND_URL=https://твій-frontend-url.up.railway.app
   ```

4. Backend автоматично перезапуститься

## Крок 5: Налаштуй Database (якщо ще не зробив)

1. В Railway проекті знайди **PostgreSQL service**

2. Перейди до **Data → Query**

3. Відкрий файл `railway-db-setup.sql` з корня проекту

4. Скопіюй весь SQL код і вставни в Query tab

5. Натисни **"Run Query"** або **Execute**

6. Перевір що таблиці створилися:
   ```sql
   SELECT table_name FROM information_schema.tables
   WHERE table_schema = 'public'
   ORDER BY table_name;
   ```

   Повинні бути таблиці:
   - admin_users
   - members
   - assessments
   - metrics

## Крок 6: Тестування

### Backend API:
```bash
# Health check
curl https://backend-production-121be.up.railway.app/health

# Database check
curl https://backend-production-121be.up.railway.app/debug/db

# Admin login test
curl -X POST https://backend-production-121be.up.railway.app/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"Oleh","password":"QwertY24$"}'
```

### Frontend:
Відкрий в браузері твій frontend URL

**Тестові акаунти:**

Admin Panel:
- URL: `https://твій-frontend-url/admin/login`
- Username: `Oleh`
- Password: `QwertY24$`

Viewer Dashboard:
- URL: `https://твій-frontend-url/viewer/login`
- Password: `viewer123`

## Troubleshooting

### Frontend білдиться але показує помилки
- Перевір що `Root Directory` = `frontend`
- Перевір що всі environment variables додані
- Подивись logs: Settings → Deployments → Latest → View Logs

### API запити не працюють (CORS errors)
- Перевір що `FRONTEND_URL` на backend відповідає реальному frontend URL
- Перевір що `VITE_API_URL` на frontend правильний
- Перезапусти backend service після зміни FRONTEND_URL

### Database помилки
- Перевір що SQL скрипт виконався успішно
- Перевір логи backend service
- Спробуй `/debug/db` endpoint

## Структура після деплою

```
Railway Project: opslab-analytics
├── backend service
│   ├── Root: /backend
│   ├── URL: https://backend-production-121be.up.railway.app
│   └── Env: DATABASE_URL, JWT_SECRET, FRONTEND_URL, etc.
│
├── frontend service
│   ├── Root: /frontend
│   ├── URL: https://твій-frontend-url.up.railway.app
│   └── Env: VITE_API_URL, VITE_APP_NAME, etc.
│
└── PostgreSQL service
    └── Tables: admin_users, members, assessments, metrics
```

---

**Після виконання всіх кроків:**
- Backend доступний за: https://backend-production-121be.up.railway.app
- Frontend доступний за: https://твій-frontend-url.up.railway.app
- Система повністю працює! 🎉
