# 📑 OpsLab Analytics - Complete Documentation Index

Welcome to the OpsLab Analytics platform! This index will guide you through all available documentation.

## 🚀 Getting Started (Start Here!)

1. **[QUICK_START.md](QUICK_START.md)** ⭐ **Start here!**
   - 5-minute setup guide
   - One-command installation
   - Login credentials
   - Common issues

2. **[SETUP.md](SETUP.md)** 📚 **Detailed guide**
   - Complete installation instructions
   - Database setup (local or Railway)
   - Configuration options
   - Troubleshooting

3. **[README.md](README.md)** 📖 **Project overview**
   - Features and capabilities
   - Technology stack
   - API documentation
   - Deployment guide

## 📊 Project Information

4. **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** 📊 **Status report**
   - What's been built
   - What's missing
   - Completion percentage
   - Development roadmap

## 🗂️ Project Structure

```
SociometryOpsLab/
│
├── 📚 Documentation
│   ├── INDEX.md              ← You are here!
│   ├── QUICK_START.md        ← Start with this
│   ├── SETUP.md              ← Detailed setup
│   ├── README.md             ← Project overview
│   └── PROJECT_SUMMARY.md    ← Status & roadmap
│
├── 🔧 Backend (Node.js + Express + PostgreSQL)
│   ├── src/
│   │   ├── controllers/      → Request handlers
│   │   ├── middleware/       → Auth, validation
│   │   ├── routes/           → API routes
│   │   ├── types/            → TypeScript types
│   │   └── index.ts          → Server entry
│   ├── prisma/
│   │   ├── schema.prisma     → Database schema
│   │   └── seed.ts           → Sample data
│   ├── package.json
│   ├── .env.example
│   └── .env                  → Your config
│
├── 🎨 Frontend (React + TypeScript + Vite)
│   ├── src/
│   │   ├── components/       → Reusable UI
│   │   ├── pages/
│   │   │   ├── admin/        → Admin panel
│   │   │   └── viewer/       → Dashboards
│   │   ├── stores/           → State management
│   │   ├── types/            → TypeScript types
│   │   ├── utils/            → API client
│   │   ├── styles/           → Global CSS
│   │   └── App.tsx           → Main app
│   ├── package.json
│   └── .env
│
├── 🚀 Deployment
│   ├── railway.json          → Railway config
│   └── verify-setup.sh       → Setup checker
│
└── 📦 Root
    ├── package.json          → Workspace config
    └── .gitignore
```

## 🎯 Quick Reference

### Installation Commands
```bash
# One-command setup (recommended)
npm run setup

# Or manual setup
cd backend && npm install
cd ../frontend && npm install
cd backend && npm run prisma:migrate
cd backend && npm run prisma:seed

# Start development
npm run dev
```

### Access Points
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **API Health**: http://localhost:3000/health
- **Database GUI**: `cd backend && npx prisma studio`

### Login Credentials
```
Admin Panel (/admin/login):
  Username: Oleh
  Password: QwertY24$

Viewer Dashboard (/):
  Password: viewer123
```

### Important Files

#### Configuration
- `backend/.env` - Backend environment variables
- `frontend/.env` - Frontend environment variables
- `backend/prisma/schema.prisma` - Database schema

#### Main Entry Points
- `backend/src/index.ts` - Backend server
- `frontend/src/main.tsx` - Frontend app
- `frontend/src/App.tsx` - React app & routing

#### API Files
- `backend/src/routes/auth.ts` - Authentication routes
- `backend/src/routes/members.ts` - Members CRUD
- `backend/src/routes/assessments.ts` - Assessments CRUD
- `frontend/src/utils/api.ts` - API client

## 📋 Common Tasks

### Development
```bash
# Start both servers
npm run dev

# Start separately
npm run dev:backend   # Terminal 1
npm run dev:frontend  # Terminal 2

# View database
npm run prisma:studio
```

### Database
```bash
cd backend

# Generate Prisma client
npm run prisma:generate

# Create migration
npx prisma migrate dev --name migration_name

# Apply migrations
npm run prisma:migrate

# Reset database (WARNING: deletes data)
npx prisma migrate reset

# Seed data
npm run prisma:seed

# View database GUI
npx prisma studio
```

### Building
```bash
# Build backend
cd backend && npm run build

# Build frontend
cd frontend && npm run build

# Build both
npm run build
```

### Deployment
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway init
railway up

# See full deployment guide in SETUP.md
```

## 🎨 Component Examples

### Creating a New Page
```typescript
// frontend/src/pages/YourPage.tsx
import { motion } from 'framer-motion';

export default function YourPage() {
  return (
    <div className="min-h-screen bg-bg-900">
      <header className="glass border-b border-bg-600">
        <h1 className="text-2xl font-bold text-gradient">
          Your Page Title
        </h1>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Your content */}
        </motion.div>
      </main>
    </div>
  );
}
```

### Creating an API Endpoint
```typescript
// backend/src/controllers/yourController.ts
import { Request, Response } from 'express';

export const yourEndpoint = async (req: Request, res: Response) => {
  try {
    // Your logic here
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// backend/src/routes/your.ts
import { Router } from 'express';
import { yourEndpoint } from '../controllers/yourController';
import { authenticateAdmin } from '../middleware/auth';

const router = Router();
router.get('/', authenticateAdmin, yourEndpoint);
export default router;

// backend/src/index.ts
import yourRoutes from './routes/your';
app.use('/api/your', yourRoutes);
```

## 🔍 Finding Things

### Looking for Authentication?
- Backend: `backend/src/controllers/authController.ts`
- Middleware: `backend/src/middleware/auth.ts`
- Frontend store: `frontend/src/stores/authStore.ts`

### Looking for Database Schema?
- Schema: `backend/prisma/schema.prisma`
- Migrations: `backend/prisma/migrations/`
- Seed data: `backend/prisma/seed.ts`

### Looking for UI Components?
- Pages: `frontend/src/pages/`
- Components: `frontend/src/components/`
- Styles: `frontend/src/styles/global.css`
- Tailwind config: `frontend/tailwind.config.js`

### Looking for API Integration?
- API client: `frontend/src/utils/api.ts`
- Types: `frontend/src/types/index.ts`
- Backend routes: `backend/src/routes/`

## 🐛 Troubleshooting

### App won't start?
1. Check [QUICK_START.md](QUICK_START.md) - Common Issues section
2. Run verification script: `./verify-setup.sh`
3. Check [SETUP.md](SETUP.md) - Troubleshooting section

### Database issues?
1. Verify DATABASE_URL in `backend/.env`
2. Run: `cd backend && npx prisma migrate reset`
3. Re-seed: `npm run prisma:seed`

### Frontend errors?
1. Clear cache: `cd frontend && rm -rf node_modules && npm install`
2. Check browser console for errors
3. Verify backend is running: `curl http://localhost:3000/health`

### Authentication not working?
1. Re-seed database: `cd backend && npm run prisma:seed`
2. Clear localStorage in browser
3. Check JWT_SECRET is set in `backend/.env`

## 📚 Learning Resources

### Backend Technologies
- [Node.js Docs](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Prisma Docs](https://www.prisma.io/docs)
- [PostgreSQL Tutorial](https://www.postgresql.org/docs/)

### Frontend Technologies
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [Three.js](https://threejs.org/docs/)
- [D3.js](https://d3js.org/)

### Tools
- [Vite Guide](https://vitejs.dev/guide/)
- [React Router](https://reactrouter.com/)
- [Zustand Docs](https://docs.pmnd.rs/zustand/)
- [React Query](https://tanstack.com/query/)

## 🎯 Development Workflow

### Day-to-day Development
1. **Start servers**: `npm run dev`
2. **Make changes**: Edit files in `src/`
3. **See changes**: Auto-reload (HMR)
4. **View DB**: `npm run prisma:studio`
5. **Commit**: `git add . && git commit -m "message"`

### Adding a New Feature
1. **Plan**: Write in PROJECT_SUMMARY.md
2. **Backend**: Add API endpoint if needed
3. **Frontend**: Create component/page
4. **Connect**: Wire up API calls
5. **Test**: Verify functionality
6. **Document**: Update relevant docs

### Before Deploying
1. **Test locally**: All features work
2. **Update .env**: Set production values
3. **Build**: `npm run build` succeeds
4. **Migrate**: Database migrations applied
5. **Deploy**: Follow SETUP.md deployment guide

## 📞 Getting Help

1. **Check Documentation**:
   - QUICK_START.md for quick issues
   - SETUP.md for detailed issues
   - PROJECT_SUMMARY.md for project status

2. **Run Verification**:
   ```bash
   ./verify-setup.sh
   ```

3. **Check Logs**:
   - Backend: Terminal where backend runs
   - Frontend: Browser console (F12)
   - Database: Prisma Studio

4. **Search Issues**:
   - GitHub Issues
   - Stack Overflow
   - Technology-specific docs

5. **Ask for Help**:
   - Open GitHub issue with error details
   - Include: OS, Node version, error message
   - Email: support@opslab.uk

## ✅ Quick Checklist

### First Time Setup
- [ ] Install Node.js 20+
- [ ] Clone/download project
- [ ] Run `npm run setup`
- [ ] Configure `backend/.env`
- [ ] Start with `npm run dev`
- [ ] Login and test

### Before Committing
- [ ] Code works locally
- [ ] No console errors
- [ ] Formatted code
- [ ] Updated documentation
- [ ] Committed with clear message

### Before Deploying
- [ ] All features tested
- [ ] Production .env configured
- [ ] Database backed up
- [ ] Build succeeds
- [ ] Migrations applied

## 🎉 You're Ready!

If you've read this far, you're ready to start developing!

**Next Steps:**
1. Follow [QUICK_START.md](QUICK_START.md)
2. Run `npm run dev`
3. Open http://localhost:5173
4. Start building! 🚀

---

**Last Updated:** 2025-10-14
**Project Version:** 1.0.0-beta
**Documentation Version:** 1.0

**Need help?** Start with [QUICK_START.md](QUICK_START.md)!
