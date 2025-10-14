# 🎯 Railway Monorepo - Поточний Статус

## ✅ Що працює:

- **Backend API**: https://backend-production-121be.up.railway.app
  - Health: ✅ `/health`
  - Database: ✅ `/debug/db` - 2 members, 1 admin
  - Members API: ✅ `/api/members`
  - Auth API: ✅ `/api/auth/admin/login`

- **Database**: ✅ PostgreSQL працює
  - Таблиці створені
  - Admin користувач: `Oleh` / `QwertY24$`
  - 2 sample members

## ⚠️ Що НЕ працює:

- **Frontend**: ❌ Білд може не відбуватися або файли в неправильному місці
  - Root `/` повертає 404
  - Frontend dist не знайдено

## 📋 Налаштування Monorepo:

### Структура:
```
SociometryOpsLab/
├── backend/          # Node.js API
│   └── dist/         # Compiled JS
├── frontend/         # React App
│   └── dist/         # Should contain built files
└── railway.toml      # Monorepo config
```

### Railway Build:
```toml
buildCommand = "
  cd backend && npm install && npx prisma generate && npm run build &&
  cd ../frontend && npm install && npm run build
"
```

### Backend serves Frontend:
- Backend index.ts має код для serve static files з `frontend/dist`
- В production шукає frontend за різними шляхами

## 🔧 Проблема:

Frontend білд може:
1. Не відбуватися (npm run build fails)
2. Білдитися в неправильне місце
3. Файли не копіюються в контейнер

## 💡 Рішення:

Потрібно перевірити Railway logs для build process:
https://railway.com/project/7eb60fec-f690-4ba3-b443-ae369bef6735/service/6ffe5736-30b5-4b6d-83ca-c3c076fff71e

Шукати в логах:
- `Building Frontend`
- Помилки при `npm run build` в frontend
- Чи створюється `frontend/dist`

## 🧪 Тестування:

```bash
# Backend API
curl https://backend-production-121be.up.railway.app/health
curl https://backend-production-121be.up.railway.app/debug/db
curl https://backend-production-121be.up.railway.app/api/members

# Admin login
curl -X POST https://backend-production-121be.up.railway.app/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"Oleh","password":"QwertY24$"}'

# Frontend (should work after fix)
open https://backend-production-121be.up.railway.app
```

## 📊 Environment Variables:

Backend має:
- `DATABASE_URL` ✅
- `NODE_ENV=production` ✅
- `JWT_SECRET` ✅
- `FRONTEND_URL` ✅

Frontend `.env.production`:
- `VITE_API_URL=/api` ✅ (relative for monorepo)

---

**Наступні кроки:**
1. Перевір Railway build logs
2. Якщо frontend не білдиться - треба виправити build command
3. Після успішного білду - все має працювати на одному URL
