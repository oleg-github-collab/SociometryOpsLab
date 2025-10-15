# 🚀 Railway Deployment - OpsLab Analytics

## Швидкий Deploy (5 хвилин)

### 1. Створи Railway Project

1. Іди на https://railway.app/new
2. Натисни **"Deploy from GitHub repo"**
3. Вибери: **oleg-github-collab/SociometryOpsLab**
4. Railway автоматично почне білдити!

### 2. Додай PostgreSQL

1. В Railway project натисни **"+ New"**
2. Вибери **"Database" → "Add PostgreSQL"**
3. Railway автоматично створить DATABASE_URL

### 3. Встанови Environment Variables

У твоєму Railway service → **Variables** → додай:

```bash
NODE_ENV=production
JWT_SECRET=opslab-production-jwt-secret-key-2025-minimum-32-characters-required
ADMIN_USERNAME=Oleh
ADMIN_PASSWORD=QwertY24$
VIEWER_PASSWORD=viewer123
PORT=3000
```

### 4. Створи Public Domain

1. **Settings → Networking**
2. Натисни **"Generate Domain"**
3. Отримаєш URL типу: `https://your-app.up.railway.app`

### 5. Виконай Database Setup

1. Відкрий **PostgreSQL service → Data → Query**
2. Скопіюй SQL з файлу `railway-db-setup.sql`
3. Виконай всі команди

## ✅ Готово!

Відкрий твій Railway URL - повинна завантажитись React app!

**Admin Panel:**
- URL: `https://your-app.up.railway.app/admin/login`
- Username: `Oleh`
- Password: `QwertY24$`

**Viewer Dashboard:**
- URL: `https://your-app.up.railway.app/viewer/login`
- Password: `viewer123`

---

## 📁 Структура Monorepo

```
SociometryOpsLab/
├── backend/              # Express API
│   ├── src/
│   └── dist/
│       └── public/       # Frontend files copied here
├── frontend/             # React App
│   └── dist/             # Built files
└── nixpacks.toml         # Railway build config
```

## 🔧 Як працює білд:

1. **Install**: Backend + Frontend npm packages
2. **Build Backend**: TypeScript → `backend/dist`
3. **Build Frontend**: React → `frontend/dist`
4. **Copy**: `frontend/dist/*` → `backend/dist/public/`
5. **Serve**: Backend serves API (`/api/*`) + Frontend (всі інші routes)

## 🧪 Тестування після деплою:

```bash
# Health check
curl https://your-app.up.railway.app/health

# API test
curl https://your-app.up.railway.app/api/members

# Frontend (відкрий в браузері)
open https://your-app.up.railway.app
```

## 🐛 Troubleshooting

### Frontend не завантажується (404)
- Перевір Railway build logs - шукай рядок "✅ SUCCESS: Frontend copied"
- Перевір `/health` endpoint - має показати `"exists": true`

### Database помилки
- Перевір що PostgreSQL service створений
- Перевір що DATABASE_URL автоматично додався до variables
- Виконай SQL з `railway-db-setup.sql`

### API 500 errors
- Перевір що всі environment variables встановлені
- Перевір Railway deployment logs

---

**GitHub**: https://github.com/oleg-github-collab/SociometryOpsLab
