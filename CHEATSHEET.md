# 🚀 OpsLab Analytics - Cheat Sheet

Швидка довідка для роботи з проектом.

## 📦 Встановлення (One-liner)

```bash
npm run install:all && cd backend && npm run prisma:generate && npm run prisma:migrate && npm run prisma:seed
```

## 🏃 Запуск

```bash
# Обидва сервери одразу
npm run dev

# Окремо
npm run dev:backend   # Backend на :3000
npm run dev:frontend  # Frontend на :5173
```

## 🔑 Доступ

### URLs
```
Frontend:     http://localhost:5173
Backend:      http://localhost:3000
Health:       http://localhost:3000/health
DB GUI:       npx prisma studio (з папки backend)
```

### Credentials
```
Admin:
  URL: http://localhost:5173/admin/login
  Username: Oleh
  Password: QwertY24$

Viewer:
  URL: http://localhost:5173
  Password: viewer123
```

## 📊 API Endpoints

### Auth
```bash
# Admin login
curl -X POST http://localhost:3000/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"Oleh","password":"QwertY24$"}'

# Viewer auth
curl -X POST http://localhost:3000/api/auth/viewer/auth \
  -H "Content-Type: application/json" \
  -d '{"password":"viewer123"}'
```

### Members
```bash
# Get all members
curl http://localhost:3000/api/members

# Get member by code
curl http://localhost:3000/api/members/2002

# Create member (需要 admin token)
curl -X POST http://localhost:3000/api/members \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "2004",
    "fullName": "New Member",
    "email": "new@example.com",
    "position": "Developer"
  }'
```

### Metrics
```bash
# Get team metrics
curl http://localhost:3000/api/metrics/team

# Get member metrics
curl http://localhost:3000/api/metrics/member/2002
```

## 🗄️ База Даних

```bash
cd backend

# Відкрити Prisma Studio (GUI)
npx prisma studio

# Створити міграцію
npx prisma migrate dev --name your_name

# Застосувати міграції
npx prisma migrate deploy

# Скинути БД (WARNING: видаляє дані!)
npx prisma migrate reset

# Засіяти дані
npm run prisma:seed

# Згенерувати Prisma Client
npm run prisma:generate
```

## 🔧 Корисні Команди

### Git
```bash
# Статус
git status

# Коміт
git add .
git commit -m "Your message"

# Push
git push origin main
```

### Railway
```bash
# Login
railway login

# Ініціалізація
railway init

# Додати PostgreSQL
railway add

# Змінні
railway variables
railway variables set KEY="value"

# Deploy
railway up

# Логи
railway logs
railway logs -f  # Real-time

# Домен
railway domain

# Відкрити dashboard
railway open
```

### Vercel (Frontend)
```bash
# Login
vercel login

# Deploy
vercel

# Production deploy
vercel --prod

# Домени
vercel domains add your-domain.com
```

## 🐛 Troubleshooting

### Backend не запускається
```bash
# Перевірити змінні
cat backend/.env

# Перевірити порт
lsof -ti:3000 | xargs kill -9

# Перезапустити
cd backend && npm run dev
```

### Frontend не підключається
```bash
# Перевірити backend
curl http://localhost:3000/health

# Перевірити змінні
cat frontend/.env

# Очистити cache
cd frontend
rm -rf node_modules .vite
npm install
```

### БД не працює
```bash
cd backend

# Скинути і пересіяти
npx prisma migrate reset
npm run prisma:seed

# Або тільки пересіяти
npx prisma db seed
```

### Prisma помилки
```bash
cd backend

# Регенерувати client
npm run prisma:generate

# Sync schema without migration
npx prisma db push
```

## 📝 Швидкі Зміни

### Змінити пароль admin
```typescript
// backend/prisma/seed.ts
const passwordHash = await bcrypt.hash('YourNewPassword', 12);
```

### Змінити пароль viewer
```bash
# backend/.env
VIEWER_PASSWORD="your-new-password"
```

### Додати нового члена команди
```typescript
// backend/prisma/seed.ts
const sampleMembers = [
  // ... existing members
  {
    code: '2010',
    fullName: 'Your Name',
    email: 'your@email.com',
    position: 'Your Position',
    experienceMonths: 24,
    employmentType: 'Full-time',
    isActive: true,
  },
];
```

### Змінити кольори
```javascript
// frontend/tailwind.config.js
theme: {
  extend: {
    colors: {
      primary: {
        500: '#YOUR_COLOR',
        // ...
      },
    },
  },
},
```

## 🔍 Моніторинг

### Логи Backend
```bash
# Development
tail -f backend/logs/app.log

# Production (Railway)
railway logs -f
```

### Логи Frontend
```bash
# Browser console
F12 -> Console

# Build errors
cd frontend && npm run build
```

### Database Queries
```bash
cd backend
npx prisma studio
# Opens GUI at http://localhost:5555
```

## 📦 Build для Production

```bash
# Backend
cd backend
npm run build
npm run start

# Frontend
cd frontend
npm run build
npm run preview  # Test production build
```

## 🚀 Quick Deploy

```bash
# Автоматичний deploy
./deploy.sh

# Або вручну
gh auth login
gh repo create opslab-analytics --public --source=. --push

railway login
railway init
railway add  # PostgreSQL
railway up

cd frontend
vercel --prod
```

## 📚 Документація

```
INDEX.md              - Індекс документації
QUICK_START.md        - Швидкий старт (5 хвилин)
SETUP.md              - Детальна інструкція
README.md             - Опис проекту
DEPLOY_INSTRUCTIONS.md - Інструкції деплою
FINAL_STATUS.md       - Фінальний статус
CHEATSHEET.md         - Ця сторінка
```

## 🆘 Допомога

1. Перевірте документацію вище
2. Запустіть `./verify-setup.sh`
3. Перевірте логи (browser console + terminal)
4. GitHub Issues
5. Email: support@opslab.uk

## ✅ Швидкий Чеклист

Перед deploy:
- [ ] Всі тести пройшли
- [ ] `npm run build` без помилок
- [ ] `.env` налаштовано
- [ ] Паролі змінено
- [ ] CORS налаштовано
- [ ] База даних засіяна
- [ ] Health endpoint працює

---

**Потрібна допомога?** Відкрийте QUICK_START.md або SETUP.md
