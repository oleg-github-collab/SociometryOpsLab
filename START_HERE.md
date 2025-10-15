# 🎯 OpsLab Analytics - Початок роботи

## ✅ Що вже готово:

- ✅ **Backend API** (Node.js + Express + Prisma)
- ✅ **Frontend** (React + TypeScript + Vite)
- ✅ **Database Schema** (PostgreSQL)
- ✅ **Monorepo Config** (nixpacks.toml)
- ✅ **GitHub Repository**: https://github.com/oleg-github-collab/SociometryOpsLab

---

## 🚀 Деплой на Railway (СВІЖИЙ СТАРТ)

### Варіант 1: Новий Railway Project (Рекомендую)

1. **Іди на Railway**: https://railway.app/new

2. **Deploy from GitHub**:
   - Натисни "Deploy from GitHub repo"
   - Вибери `oleg-github-collab/SociometryOpsLab`
   - Railway автоматично виявить `nixpacks.toml` і почне білдити

3. **Додай PostgreSQL**:
   - В project натисни "+ New"
   - Вибери "Database" → "Add PostgreSQL"

4. **Встанови Variables** (в service → Variables):
   ```
   NODE_ENV=production
   JWT_SECRET=opslab-production-jwt-secret-key-2025-minimum-32-characters-required
   ADMIN_USERNAME=Oleh
   ADMIN_PASSWORD=QwertY24$
   VIEWER_PASSWORD=viewer123
   ```

5. **Generate Domain**:
   - Settings → Networking → "Generate Domain"

6. **Setup Database**:
   - PostgreSQL → Data → Query
   - Виконай SQL з файлу `railway-db-setup.sql`

7. **ГОТОВО!** Відкрий свій Railway URL 🎉

---

### Варіант 2: Використати існуючий Railway Project

Якщо хочеш використати поточний project:

1. **Видали старий backend service** (опціонально)

2. **Створи новий service**:
   - "+ New" → "GitHub Repo"
   - Вибери `SociometryOpsLab`

3. **Variables**: (такі ж як в Варіанті 1)

4. **Database**: Використай існуючий PostgreSQL або створи новий

5. **Deploy!**

---

## 📋 Після деплою:

### Перевір що все працює:

```bash
# 1. Health check (має показати frontend: exists=true)
curl https://your-app.up.railway.app/health

# 2. Database check (має показати members і admins)
curl https://your-app.up.railway.app/debug/db

# 3. API test
curl https://your-app.up.railway.app/api/members

# 4. Frontend (відкрий в браузері)
open https://your-app.up.railway.app
```

### Логін:

**Admin Panel** (`/admin/login`):
- Username: `Oleh`
- Password: `QwertY24$`

**Viewer Dashboard** (`/viewer/login`):
- Password: `viewer123`

---

## 📁 Структура проекту:

```
SociometryOpsLab/
├── backend/                   # Node.js API
│   ├── src/
│   │   ├── index.ts          # Serves API + Frontend
│   │   ├── routes/           # API routes
│   │   ├── controllers/      # Business logic
│   │   └── middleware/       # Auth, CORS, etc.
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema
│   │   └── seed.ts           # Sample data
│   └── dist/                 # Compiled JS
│       └── public/           # Frontend files (copied during build)
│
├── frontend/                  # React App
│   ├── src/
│   │   ├── pages/            # 11 pages (admin + viewer)
│   │   ├── components/       # Reusable components
│   │   └── lib/              # API client, store
│   └── dist/                 # Built files
│
├── nixpacks.toml             # Railway build config
├── railway-db-setup.sql      # Database initialization
└── RAILWAY_DEPLOY.md         # Детальні інструкції

```

---

## 🔧 Як працює Monorepo:

1. **Build Phase**:
   - Білдиться backend (`tsc` → `backend/dist`)
   - Білдиться frontend (`vite build` → `frontend/dist`)
   - Frontend копіюється в `backend/dist/public/`

2. **Runtime**:
   - Backend Express serve:
     - API routes: `/api/*` → REST API
     - All other routes → Frontend SPA (React Router)

3. **Single URL** для всього:
   - `https://your-app.up.railway.app/` → React App
   - `https://your-app.up.railway.app/api/members` → API

---

## 📚 Документація:

- `RAILWAY_DEPLOY.md` - Детальний гайд по деплою
- `railway-db-setup.sql` - SQL для створення таблиць
- `CURRENT_STATUS_FINAL.md` - Поточний статус системи
- Backend API docs - дивись `backend/src/routes/`

---

## 💡 Tips:

- Railway автоматично редеплоїть при push в GitHub
- Логи дивись в Railway dashboard → Deployments → View Logs
- Environment variables можна міняти без редеплою
- PostgreSQL має автоматичні backups

---

**Питання?** Дивись `RAILWAY_DEPLOY.md` або Railway docs: https://docs.railway.app

**GitHub**: https://github.com/oleg-github-collab/SociometryOpsLab
