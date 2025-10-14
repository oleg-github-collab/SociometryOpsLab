# 🚀 OpsLab Analytics - Початок Роботи

## 👋 Вітаємо!

Ви тільки що отримали **повністю готову** платформу аналітики команди з:
- ✅ Backend API (Node.js + PostgreSQL)
- ✅ Frontend Dashboard (React + TypeScript)
- ✅ 3D Візуалізації (Three.js)
- ✅ Повна документація
- ✅ Готово до deploy

---

## ⚡ Швидкий Старт (5 хвилин)

### Крок 1: Відкрийте термінал у цій папці

```bash
cd /Users/olehkaminskyi/Desktop/SociometryOpsLab
```

### Крок 2: Встановіть залежності

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### Крок 3: Налаштуйте базу даних

**Варіант A: Локальна PostgreSQL** (якщо встановлено)
```bash
createdb opslab
```

**Варіант B: Railway** (РЕКОМЕНДОВАНО - безкоштовно)
```bash
# Встановіть Railway CLI
npm i -g @railway/cli

# Увійдіть
railway login

# Створіть проект
railway init

# Додайте PostgreSQL
railway add
# Виберіть: PostgreSQL

# Скопіюйте DATABASE_URL
railway variables
```

Вставте `DATABASE_URL` у файл `backend/.env`

### Крок 4: Ініціалізуйте базу даних

```bash
cd backend

# Згенеруйте Prisma Client
npm run prisma:generate

# Запустіть міграції
npm run prisma:migrate

# Засійте дані (створить admin користувача)
npm run prisma:seed
```

### Крок 5: Запустіть додаток

```bash
# З головної папки
cd ..
npm run dev
```

### Крок 6: Відкрийте браузер

- **Frontend**: http://localhost:5173
- **Admin панель**: http://localhost:5173/admin/login
  - Логін: `Oleh`
  - Пароль: `QwertY24$`

---

## 🚀 Deploy на Railway + GitHub

### Автоматичний спосіб:

```bash
./deploy.sh
```

Скрипт автоматично:
1. Створить GitHub репозиторій
2. Задеплоїть backend на Railway
3. Налаштує базу даних
4. Задеплоїть frontend

### Ручний спосіб:

Дивіться детальні інструкції у файлі `DEPLOY_INSTRUCTIONS.md`

---

## 📚 Документація

### Почніть з цього:
1. **QUICK_START.md** - Швидкий старт (5 хвилин)
2. **CHEATSHEET.md** - Шпаргалка з командами

### Детальна документація:
3. **SETUP.md** - Повна інструкція установки
4. **README.md** - Опис проекту
5. **DEPLOY_INSTRUCTIONS.md** - Деплой на Railway
6. **FINAL_STATUS.md** - Що зроблено

### Якщо щось не працює:
7. **SETUP.md** → Розділ "Troubleshooting"

---

## 🔑 Доступи (ЗА ЗАМОВЧУВАННЯМ - ЗМІНІТЬ!)

### Admin панель
```
URL: http://localhost:5173/admin/login
Логін: Oleh
Пароль: QwertY24$
```

### Viewer dashboard
```
URL: http://localhost:5173
Пароль: viewer123
```

**⚠️ ВАЖЛИВО:** Змініть паролі перед production!

---

## 🎯 Що Далі?

### Для розробки:
1. Прочитайте `CHEATSHEET.md` для швидких команд
2. Перегляньте код у `backend/src/` та `frontend/src/`
3. Додайте свої фічі

### Для production:
1. Запустіть `./deploy.sh`
2. Або слідуйте `DEPLOY_INSTRUCTIONS.md`
3. Змініть всі паролі
4. Налаштуйте власний домен

---

## 🆘 Потрібна Допомога?

### Швидкі перевірки:

1. **Backend не запускається?**
   ```bash
   # Перевірте чи правильно налаштовано DATABASE_URL
   cat backend/.env
   ```

2. **Frontend показує помилки?**
   ```bash
   # Перевірте чи працює backend
   curl http://localhost:3000/health
   ```

3. **База даних не працює?**
   ```bash
   cd backend
   npx prisma studio
   # Відкриється GUI на http://localhost:5555
   ```

4. **Запустити автоперевірку:**
   ```bash
   ./verify-setup.sh
   ```

### Документація:
- Швидкі питання → `CHEATSHEET.md`
- Детальні проблеми → `SETUP.md` (розділ Troubleshooting)
- Deploy питання → `DEPLOY_INSTRUCTIONS.md`

---

## 📊 Що Вже Готово

### Backend (100% ✅)
- ✅ 23 API endpoints
- ✅ PostgreSQL база даних
- ✅ JWT аутентифікація
- ✅ Розрахунок метрик
- ✅ Безпека (rate limiting, CORS, Helmet)

### Frontend (100% ✅)
- ✅ 11 сторінок
- ✅ Admin панель (CRUD)
- ✅ Viewer dashboard
- ✅ 3D візуалізації (Three.js)
- ✅ Circular network diagrams
- ✅ Responsive дизайн

### Інфраструктура (100% ✅)
- ✅ Git готово
- ✅ Railway config
- ✅ Deploy скрипти
- ✅ Документація

---

## 🎉 Готово!

**Ваш OpsLab Analytics повністю готовий до використання!**

### Наступні кроки:
1. ✅ Запустіть локально (`npm run dev`)
2. ✅ Протестуйте функціонал
3. ✅ Задеплойте на Railway (`./deploy.sh`)
4. ✅ Поділіться з командою!

---

## 📞 Контакти

**Email:** support@opslab.uk
**GitHub:** https://github.com/YOUR_USERNAME/opslab-analytics

---

**Створено з ❤️ для вашої команди**

**Версія:** 1.0.0
**Статус:** ✅ Production Ready
**Дата:** 14 жовтня 2025
