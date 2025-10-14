# 🚀 Railway Deploy - Покрокова Інструкція

## ✅ Що Вже Зроблено

- ✅ Railway CLI встановлено
- ✅ Авторизовано як: work.olegkaminskyi@gmail.com
- ✅ Проект створено: `opslab-analytics`
- ✅ URL проекту: https://railway.com/project/7eb60fec-f690-4ba3-b443-ae369bef6735

## 🎯 Наступні Кроки (Вручну через Термінал)

### Крок 1: Відкрийте Railway Dashboard

```bash
# Відкрийте цей URL у браузері:
https://railway.com/project/7eb60fec-f690-4ba3-b443-ae369bef6735
```

### Крок 2: Додайте PostgreSQL

1. У Dashboard натисніть **"+ New"**
2. Виберіть **"Database"**
3. Виберіть **"Add PostgreSQL"**
4. Дочекайтесь створення (займе ~30 секунд)

### Крок 3: Створіть Backend Service

1. Натисніть **"+ New"** знову
2. Виберіть **"Empty Service"**
3. Назвіть: `backend`

### Крок 4: Deploy Backend через CLI

Тепер, коли сервіс створено, можна задеплоїти:

```bash
# Перейдіть у папку backend
cd /Users/olehkaminskyi/Desktop/SociometryOpsLab/backend

# Link до backend сервісу
railway service backend

# Deploy
railway up
```

### Крок 5: Встановіть Змінні Середовища

Після deploy, встановіть змінні:

```bash
# JWT Secret (мінімум 32 символи)
railway variables set JWT_SECRET="opslab-super-secret-jwt-key-2025-production-ready-32chars"

# Node Environment
railway variables set NODE_ENV="production"

# Admin Credentials
railway variables set ADMIN_USERNAME="Oleh"
railway variables set ADMIN_PASSWORD="QwertY24$"

# Viewer Password
railway variables set VIEWER_PASSWORD="viewer123"

# Port
railway variables set PORT="3000"

# Frontend URL (додамо пізніше)
railway variables set FRONTEND_URL="https://your-frontend.vercel.app"
```

**ВАЖЛИВО:** `DATABASE_URL` вже встановлено автоматично PostgreSQL сервісом!

### Крок 6: Запустіть Міграції

```bash
# Запустіть Prisma міграції
railway run npx prisma migrate deploy

# Засійте базу даних (створить admin користувача)
railway run npx prisma db seed
```

### Крок 7: Отримайте Backend URL

```bash
# Згенеруйте домен
railway domain

# Або перевірте статус
railway status
```

Ви отримаєте URL типу: `https://opslab-analytics-production.up.railway.app`

### Крок 8: Перевірте Backend

```bash
# Перевірте health endpoint
curl https://YOUR_BACKEND_URL.up.railway.app/health

# Повинно повернути:
# {"status":"ok","timestamp":"..."}
```

---

## 🎨 Deploy Frontend на Vercel

### Крок 1: Встановіть Vercel CLI

```bash
npm i -g vercel
```

### Крок 2: Авторизуйтесь

```bash
vercel login
```

### Крок 3: Створіть .env.production

```bash
cd /Users/olehkaminskyi/Desktop/SociometryOpsLab/frontend

# Створіть файл з backend URL
echo "VITE_API_URL=https://YOUR_BACKEND_URL.up.railway.app/api" > .env.production
```

### Крок 4: Deploy

```bash
# Deploy
vercel

# Або одразу в production
vercel --prod
```

Слідуйте інструкціям:
- Link to existing project? **No**
- Project name: **opslab-analytics**
- Directory: **./** (просто Enter)
- Override settings? **No**

### Крок 5: Оновіть FRONTEND_URL на Backend

```bash
cd /Users/olehkaminskyi/Desktop/SociometryOpsLab/backend

# Встановіть URL фронтенду
railway variables set FRONTEND_URL="https://YOUR_VERCEL_URL.vercel.app"
```

---

## 🔧 Альтернатива: Використання Railway для Frontend

Якщо не хочете Vercel, можна задеплоїти frontend теж на Railway:

```bash
cd /Users/olehkaminskyi/Desktop/SociometryOpsLab/frontend

# Створіть frontend сервіс у Railway Dashboard
# + New → Empty Service → "frontend"

# Link до frontend сервісу
railway service frontend

# Створіть .env.production
echo "VITE_API_URL=https://YOUR_BACKEND_URL.up.railway.app/api" > .env.production

# Deploy
railway up

# Згенеруйте домен
railway domain
```

---

## ✅ Перевірка

### 1. Backend
```bash
curl https://YOUR_BACKEND_URL.up.railway.app/health
curl https://YOUR_BACKEND_URL.up.railway.app/api/members
```

### 2. Frontend
Відкрийте браузер:
- `https://YOUR_FRONTEND_URL`
- Спробуйте увійти як viewer (password: viewer123)
- Спробуйте увійти як admin (Oleh / QwertY24$)

### 3. База Даних
```bash
cd backend
railway run npx prisma studio
```

---

## 🐛 Troubleshooting

### Backend не запускається

```bash
# Перевірте логи
cd backend
railway logs

# Перевірте змінні
railway variables

# Перевірте статус
railway status
```

### Database Connection Error

```bash
# Перевірте чи DATABASE_URL встановлено
railway variables | grep DATABASE_URL

# Якщо немає, встановіть вручну з Dashboard:
# Settings → PostgreSQL → Connection → DATABASE_URL
```

### Frontend не підключається до Backend

1. Перевірте `VITE_API_URL` у `.env.production`
2. Перевірте CORS на backend (FRONTEND_URL змінна)
3. Відкрийте DevTools (F12) → Network → перевірте запити

---

## 🎉 Готово!

Після всіх кроків ваш OpsLab Analytics буде доступний:

- **Backend API**: https://opslab-analytics-production.up.railway.app
- **Frontend**: https://opslab-analytics.vercel.app (або ваш URL)
- **Admin Panel**: https://opslab-analytics.vercel.app/admin/login
- **Viewer Dashboard**: https://opslab-analytics.vercel.app

---

## 📞 URL Проекту

**Railway Project:**
https://railway.com/project/7eb60fec-f690-4ba3-b443-ae369bef6735

**Збережіть цей URL!** Ви зможете керувати проектом через Dashboard.

---

## 🔐 Важливо Після Deploy

1. **Змініть паролі:**
   ```bash
   railway variables set ADMIN_PASSWORD="new-secure-password"
   railway variables set VIEWER_PASSWORD="new-viewer-password"
   railway variables set JWT_SECRET="new-random-32-char-secret"
   ```

2. **Налаштуйте Custom Domain** (опціонально):
   ```bash
   railway domain add your-domain.com
   ```

3. **Налаштуйте Backups** у Railway Dashboard

4. **Додайте Monitoring** (Sentry, LogRocket, etc.)

---

**Статус:** ✅ Railway проект створено, готовий до deploy
**Дата:** 14 жовтня 2025
