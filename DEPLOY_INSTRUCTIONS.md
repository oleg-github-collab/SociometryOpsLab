# 🚀 Інструкція з Deploy на GitHub та Railway

## Крок 1: Створити GitHub репозиторій

### Варіант A: Через GitHub CLI (рекомендовано)

```bash
# 1. Авторизуйтесь у GitHub CLI (якщо ще не зробили)
gh auth login
# Виберіть: GitHub.com -> HTTPS -> Login with a web browser

# 2. Створіть репозиторій
gh repo create opslab-analytics --public --source=. --remote=origin --description="🚀 OpsLab Analytics - Team dynamics and sociometry platform" --push
```

### Варіант B: Вручну через GitHub.com

1. Відкрийте https://github.com/new
2. Repository name: `opslab-analytics`
3. Description: `🚀 OpsLab Analytics - Team dynamics and sociometry platform`
4. Public
5. НЕ додавайте README, .gitignore, або license (вони вже є)
6. Натисніть "Create repository"

7. Підключіть локальний репозиторій:
```bash
git remote add origin https://github.com/YOUR_USERNAME/opslab-analytics.git
git branch -M main
git push -u origin main
```

## Крок 2: Deploy Backend на Railway

### 1. Встановіть Railway CLI

```bash
npm install -g @railway/cli
```

### 2. Авторизуйтесь

```bash
railway login
# Відкриється браузер для авторизації
```

### 3. Створіть новий проект

```bash
railway init
# Виберіть: Empty Project
# Назва: opslab-analytics
```

### 4. Додайте PostgreSQL

```bash
railway add
# Виберіть: PostgreSQL
```

### 5. Отримайте DATABASE_URL

```bash
railway variables
# Скопіюйте значення DATABASE_URL
```

### 6. Встановіть змінні середовища

```bash
# Встановіть всі необхідні змінні
railway variables set JWT_SECRET="your-super-secret-jwt-key-minimum-32-characters-long"
railway variables set NODE_ENV="production"
railway variables set ADMIN_USERNAME="Oleh"
railway variables set ADMIN_PASSWORD="QwertY24$"
railway variables set VIEWER_PASSWORD="viewer123"
railway variables set PORT="3000"

# DATABASE_URL вже встановлено автоматично PostgreSQL
```

### 7. Deploy Backend

```bash
# Перейдіть у папку backend
cd backend

# Deploy
railway up

# Дочекайтесь завершення deploy
```

### 8. Запустіть міграції

```bash
# Запустіть міграції бази даних
railway run npx prisma migrate deploy

# Seed бази даних (створює admin користувача)
railway run npx prisma db seed
```

### 9. Отримайте URL бекенду

```bash
railway domain
# Railway надасть вам URL типу: https://opslab-analytics-production.up.railway.app
```

## Крок 3: Deploy Frontend на Railway (або Vercel)

### Варіант A: Deploy на Railway

```bash
# Створіть ще один проект Railway для frontend
railway init
# Виберіть: Empty Project
# Назва: opslab-analytics-frontend

# Перейдіть у папку frontend
cd frontend

# Створіть .env.production
echo "VITE_API_URL=https://YOUR_BACKEND_URL.up.railway.app/api" > .env.production

# Deploy
railway up

# Отримайте домен
railway domain
```

### Варіант B: Deploy на Vercel (рекомендовано для frontend)

```bash
# Встановіть Vercel CLI
npm i -g vercel

# Перейдіть у папку frontend
cd frontend

# Створіть .env.production
echo "VITE_API_URL=https://YOUR_BACKEND_URL.up.railway.app/api" > .env.production

# Deploy
vercel

# Слідуйте інструкціям:
# - Link to existing project? No
# - Project name: opslab-analytics
# - Directory: ./
# - Override settings? No

# Deploy в production
vercel --prod
```

## Крок 4: Налаштування CORS

Оновіть змінну `FRONTEND_URL` на бекенді:

```bash
railway variables set FRONTEND_URL="https://your-frontend-url.vercel.app"
```

Або у `.env` файлі бекенду додайте:
```
FRONTEND_URL=https://your-frontend-url.vercel.app
```

## Крок 5: Перевірка

1. **Перевірте Backend**:
   ```bash
   curl https://your-backend-url.up.railway.app/health
   # Повинно повернути: {"status":"ok","timestamp":"..."}
   ```

2. **Перевірте Frontend**:
   - Відкрийте https://your-frontend-url
   - Спробуйте увійти як viewer (password: viewer123)
   - Спробуйте увійти як admin (Oleh / QwertY24$)

3. **Перевірте базу даних**:
   ```bash
   # Підключіться до Railway
   railway link

   # Відкрийте Prisma Studio
   railway run npx prisma studio
   ```

## 🔧 Troubleshooting

### Backend не запускається

```bash
# Перевірте логи
railway logs

# Перевірте змінні
railway variables

# Перевірте статус
railway status
```

### Frontend не підключається до Backend

1. Перевірте `VITE_API_URL` у `.env.production`
2. Перевірте CORS налаштування на backend
3. Перевірте мережеві запити в DevTools (F12)

### База даних не працює

```bash
# Перевірте підключення
railway run npx prisma db push

# Запустіть міграції знову
railway run npx prisma migrate deploy

# Re-seed
railway run npx prisma db seed
```

## 📊 Моніторинг

### Railway Dashboard

1. Відкрийте https://railway.app/dashboard
2. Виберіть ваш проект
3. Перегляньте:
   - Deployments
   - Logs
   - Metrics
   - Variables

### Корисні команди

```bash
# Перегляд логів у реальному часі
railway logs -f

# Перезапуск сервісу
railway restart

# Перегляд метрик
railway metrics

# Відкрити проект у браузері
railway open
```

## 🌐 Власний домен (опціонально)

### На Railway

```bash
# Додати власний домен
railway domain add your-domain.com

# Railway надасть вам DNS записи для додавання
```

### На Vercel

```bash
# Додати власний домен
vercel domains add your-domain.com

# Слідуйте інструкціям для налаштування DNS
```

## 🔐 Безпека Production

Перед запуском у production:

- [ ] Змініть `JWT_SECRET` на складний випадковий рядок (32+ символів)
- [ ] Змініть пароль адміністратора
- [ ] Змініть пароль viewer
- [ ] Увімкніть HTTPS (Railway робить це автоматично)
- [ ] Налаштуйте CORS тільки для ваших доменів
- [ ] Налаштуйте резервне копіювання бази даних
- [ ] Додайте моніторинг помилок (Sentry)
- [ ] Налаштуйте логування

## 📝 Автоматичний Deploy

### GitHub Actions для Railway

Створіть `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Railway

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Install Railway CLI
        run: npm i -g @railway/cli

      - name: Deploy
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
        run: |
          railway up --service backend
```

Отримайте `RAILWAY_TOKEN`:
```bash
railway whoami --token
```

Додайте в GitHub Secrets: Settings → Secrets → New repository secret

## ✅ Checklist Deploy

### Backend
- [ ] Railway project створено
- [ ] PostgreSQL додано
- [ ] Змінні середовища встановлено
- [ ] Backend задеплоєно
- [ ] Міграції запущено
- [ ] База даних засіяна
- [ ] Health endpoint працює
- [ ] Домен отримано

### Frontend
- [ ] Build успішний
- [ ] VITE_API_URL налаштовано
- [ ] Frontend задеплоєно
- [ ] Домен отримано
- [ ] Login працює
- [ ] Dashboard відображається

### Безпека
- [ ] JWT_SECRET змінено
- [ ] Паролі змінено
- [ ] CORS налаштовано
- [ ] HTTPS активовано

## 🎉 Готово!

Ваш OpsLab Analytics платформа запущена у production! 🚀

**URLs:**
- Backend: https://your-backend.up.railway.app
- Frontend: https://your-frontend.vercel.app
- Database: Railway Dashboard

**Credentials:**
- Admin: Oleh / QwertY24$ (змініть!)
- Viewer: viewer123 (змініть!)

---

**Потрібна допомога?** Перевірте логи: `railway logs -f`
