# ⚡ Quick Start Guide - 5 Minutes to Running App

## 🚀 One-Command Setup (Recommended)

If you have Node.js and PostgreSQL installed locally:

\`\`\`bash
# From project root
npm run setup
\`\`\`

This will:
1. Install all dependencies (backend + frontend)
2. Generate Prisma client
3. Run database migrations
4. Seed database with admin user and sample data

Then start both servers:
\`\`\`bash
npm run dev
\`\`\`

**That's it!** 🎉

Access the app at:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## 🔐 Login Credentials

**Admin Panel** (http://localhost:5173/admin/login)
- Username: `Oleh`
- Password: `QwertY24$`

**Viewer Dashboard** (http://localhost:5173)
- Password: `viewer123`

## 📋 Manual Setup (If one-command fails)

### 1. Install Dependencies
\`\`\`bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
\`\`\`

### 2. Setup Database

**Option A: Local PostgreSQL**
\`\`\`bash
createdb opslab
# Edit backend/.env and set:
# DATABASE_URL="postgresql://localhost:5432/opslab"
\`\`\`

**Option B: Railway (Free Cloud Database)**
\`\`\`bash
npm i -g @railway/cli
railway login
railway init
railway add  # Select PostgreSQL
railway variables  # Copy DATABASE_URL
# Paste DATABASE_URL in backend/.env
\`\`\`

### 3. Initialize Database
\`\`\`bash
cd backend
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
\`\`\`

### 4. Start Servers

**Terminal 1:**
\`\`\`bash
cd backend
npm run dev
\`\`\`

**Terminal 2:**
\`\`\`bash
cd frontend
npm run dev
\`\`\`

## ✅ Verify Installation

1. **Check Backend**: Visit http://localhost:3000/health
   - Should see: `{"status":"ok","timestamp":"..."}`

2. **Check Frontend**: Visit http://localhost:5173
   - Should see landing page with password prompt

3. **Test Admin Login**:
   - Go to http://localhost:5173/admin/login
   - Login with `Oleh` / `QwertY24$`
   - You should see the admin dashboard

4. **Check Database**:
   \`\`\`bash
   cd backend
   npx prisma studio
   \`\`\`
   - Opens GUI at http://localhost:5555
   - You should see 1 admin user and 2 sample members

## 🐛 Common Issues

### "Cannot connect to database"
\`\`\`bash
# Make sure PostgreSQL is running
postgres --version

# Or use Railway (free cloud option)
railway login
railway add  # Add PostgreSQL
\`\`\`

### "Port already in use"
\`\`\`bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or change port in backend/.env
PORT=3001
\`\`\`

### "Prisma Client not generated"
\`\`\`bash
cd backend
npm run prisma:generate
\`\`\`

### Dependencies fail to install
\`\`\`bash
# Make sure you have Node.js 20+
node --version

# If using older version, upgrade:
# macOS: brew install node@20
# Windows: Download from nodejs.org
\`\`\`

## 🎯 Next Steps

1. **Explore Admin Panel**: Add members, create assessments
2. **View Visualizations**: Check out 3D space and network diagrams
3. **Customize**: Edit colors in `frontend/tailwind.config.js`
4. **Deploy**: Follow deployment guide in SETUP.md

## 📚 Full Documentation

- [README.md](README.md) - Full project overview
- [SETUP.md](SETUP.md) - Detailed setup guide
- [Prisma Docs](https://www.prisma.io/docs) - Database ORM
- [React Docs](https://react.dev) - Frontend framework

## 🆘 Need Help?

1. Check [SETUP.md](SETUP.md) troubleshooting section
2. Check backend/frontend console for errors
3. Open GitHub issue with error details

**Happy coding! 🚀**
