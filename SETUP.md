# 🚀 OpsLab Analytics - Complete Setup Guide

## 📋 Prerequisites

Before starting, ensure you have:
- ✅ Node.js 20.x or higher ([Download](https://nodejs.org/))
- ✅ Git ([Download](https://git-scm.com/))
- ✅ PostgreSQL 15+ **OR** Railway account ([Sign up](https://railway.app/))
- ✅ Code editor (VS Code recommended)

## 🎯 Quick Start (5 minutes)

### Step 1: Install Dependencies

\`\`\`bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
\`\`\`

### Step 2: Setup Database

#### Option A: Local PostgreSQL
\`\`\`bash
# Create database
createdb opslab

# Update backend/.env
DATABASE_URL="postgresql://localhost:5432/opslab"
\`\`\`

#### Option B: Railway (Recommended)
\`\`\`bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Create project
railway init

# Add PostgreSQL
railway add
# Select: PostgreSQL

# Get DATABASE_URL
railway variables
# Copy the DATABASE_URL value
\`\`\`

### Step 3: Configure Environment

\`\`\`bash
cd backend
cp .env.example .env
\`\`\`

Edit `backend/.env`:
\`\`\`env
DATABASE_URL="postgresql://your-railway-url-here"
JWT_SECRET="your-super-secret-key-min-32-chars"
ADMIN_USERNAME="Oleh"
ADMIN_PASSWORD="QwertY24$"
NODE_ENV="development"
PORT=3000
FRONTEND_URL="http://localhost:5173"
VIEWER_PASSWORD="viewer123"
\`\`\`

### Step 4: Initialize Database

\`\`\`bash
cd backend

# Generate Prisma Client
npm run prisma:generate

# Create database tables
npm run prisma:migrate

# Seed admin user and sample data
npm run prisma:seed
\`\`\`

You should see:
\`\`\`
✅ Admin user created: Oleh
✅ Sample member created: Veronika Sheludko
✅ Sample member created: John Smith
🎉 Seeding completed!
\`\`\`

### Step 5: Start Development Servers

**Terminal 1 - Backend:**
\`\`\`bash
cd backend
npm run dev
\`\`\`

**Terminal 2 - Frontend:**
\`\`\`bash
cd frontend
npm run dev
\`\`\`

### Step 6: Access Application

- 🌐 **Frontend**: http://localhost:5173
- 🔧 **Backend API**: http://localhost:3000
- 🔐 **Admin Panel**: http://localhost:5173/admin/login

**Admin Login:**
- Username: `Oleh`
- Password: `QwertY24$`

**Viewer Access:**
- Password: `viewer123` (set in .env)

## 🎨 Project Structure

\`\`\`
SociometryOpsLab/
├── backend/                    # Node.js + Express + Prisma
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── seed.ts            # Database seeding
│   ├── src/
│   │   ├── controllers/       # Route handlers
│   │   ├── middleware/        # Auth, validation
│   │   ├── routes/            # API routes
│   │   ├── types/             # TypeScript types
│   │   └── index.ts           # Server entry point
│   ├── package.json
│   └── .env
├── frontend/                   # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── pages/             # Route pages
│   │   │   ├── admin/         # Admin panel pages
│   │   │   └── viewer/        # Viewer dashboard pages
│   │   ├── stores/            # Zustand state management
│   │   ├── types/             # TypeScript types
│   │   ├── utils/             # API client, helpers
│   │   ├── styles/            # Global CSS
│   │   ├── App.tsx            # Main app component
│   │   └── main.tsx           # Entry point
│   ├── package.json
│   └── vite.config.ts
├── railway.json                # Railway deployment config
├── .gitignore
├── README.md
└── SETUP.md                    # This file
\`\`\`

## 🔧 Database Management

### View Database
\`\`\`bash
cd backend

# Open Prisma Studio (GUI)
npx prisma studio
# Opens at http://localhost:5555
\`\`\`

### Reset Database
\`\`\`bash
cd backend

# WARNING: Deletes all data!
npx prisma migrate reset

# Re-seed
npm run prisma:seed
\`\`\`

### Create Migration
\`\`\`bash
cd backend

# After changing schema.prisma
npx prisma migrate dev --name your_migration_name
\`\`\`

## 🚀 Deployment to Railway

### 1. Prepare for Deployment

\`\`\`bash
# Ensure all changes are committed
git add .
git commit -m "Ready for deployment"
\`\`\`

### 2. Deploy Backend

\`\`\`bash
cd backend

# Deploy
railway up

# Run migrations on production
railway run npx prisma migrate deploy

# Seed production database
railway run npx prisma db seed
\`\`\`

### 3. Set Production Environment Variables

\`\`\`bash
railway variables set JWT_SECRET="production-secret-32-chars-minimum"
railway variables set NODE_ENV="production"
railway variables set VIEWER_PASSWORD="your-production-viewer-password"
\`\`\`

### 4. Get Backend URL

\`\`\`bash
railway domain
# Note the URL (e.g., https://your-app.up.railway.app)
\`\`\`

### 5. Deploy Frontend

\`\`\`bash
cd frontend

# Create .env.production
echo "VITE_API_URL=https://your-backend-url.up.railway.app/api" > .env.production

# Build
npm run build

# Deploy
railway up
\`\`\`

### 6. Verify Deployment

Visit your Railway frontend URL and test:
1. Viewer login (enter viewer password)
2. Admin login (Oleh / QwertY24$)
3. Create a test member
4. View visualizations

## 🧪 Testing the Application

### 1. Test Admin Panel

1. Go to http://localhost:5173/admin/login
2. Login with `Oleh` / `QwertY24$`
3. Navigate to Members
4. Add a new member:
   - Code: `2004`
   - Name: `Test User`
   - Email: `test@example.com`
   - Position: `Developer`
5. Verify member appears in table

### 2. Test Viewer Dashboard

1. Go to http://localhost:5173
2. Enter viewer password: `viewer123`
3. View dashboard stats
4. Click "3D Team Space"
5. Verify 3D visualization loads

### 3. Test API Directly

\`\`\`bash
# Health check
curl http://localhost:3000/health

# Get members (no auth required)
curl http://localhost:3000/api/members

# Admin login
curl -X POST http://localhost:3000/api/auth/admin/login \\
  -H "Content-Type: application/json" \\
  -d '{"username":"Oleh","password":"QwertY24$"}'
\`\`\`

## 🐛 Troubleshooting

### Backend won't start

**Error: "Cannot connect to database"**
\`\`\`bash
# Check DATABASE_URL is correct
cd backend
cat .env | grep DATABASE_URL

# Test connection
npx prisma db push
\`\`\`

**Error: "Port 3000 already in use"**
\`\`\`bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or change port in .env
PORT=3001
\`\`\`

### Frontend won't start

**Error: "Module not found"**
\`\`\`bash
cd frontend

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
\`\`\`

**Error: "API requests failing"**
\`\`\`bash
# Check backend is running
curl http://localhost:3000/health

# Check VITE_API_URL in frontend
cat .env | grep VITE_API_URL
\`\`\`

### Database errors

**Error: "Prisma Client not generated"**
\`\`\`bash
cd backend
npm run prisma:generate
\`\`\`

**Error: "Migration failed"**
\`\`\`bash
cd backend

# Reset migrations (WARNING: deletes data)
npx prisma migrate reset

# Or fix manually
npx prisma migrate resolve --applied "migration_name"
\`\`\`

### Admin login not working

\`\`\`bash
cd backend

# Re-run seed to recreate admin user
npm run prisma:seed

# Or create manually
npx prisma studio
# Create user in admin_users table
\`\`\`

## 📊 Adding Sample Data

### Add More Members

Edit `backend/prisma/seed.ts` and add to `sampleMembers`:

\`\`\`typescript
const sampleMembers = [
  {
    code: '2005',
    fullName: 'Your Name',
    email: 'your@email.com',
    position: 'Your Position',
    experienceMonths: 36,
    employmentType: 'Full-time',
    isActive: true,
  },
  // Add more...
];
\`\`\`

Then run:
\`\`\`bash
cd backend
npm run prisma:seed
\`\`\`

### Import from CSV

1. Create CSV file: `members.csv`
\`\`\`csv
code,fullName,email,position,experienceMonths,employmentType
2006,Alice Johnson,alice@example.com,Designer,24,Full-time
2007,Bob Williams,bob@example.com,Developer,18,Part-time
\`\`\`

2. Use bulk import API (via Postman or admin panel):
\`\`\`bash
curl -X POST http://localhost:3000/api/members/bulk-import \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -d @members.json
\`\`\`

## 🎯 Next Steps

1. **Customize Design**: Edit `frontend/tailwind.config.js` for colors
2. **Add Visualizations**: Implement remaining chart components
3. **Add Assessment Forms**: Create multi-step assessment input
4. **Implement Calculations**: Add sociometric calculations
5. **Add Export Features**: PDF/CSV export functionality
6. **Mobile Testing**: Test on real mobile devices
7. **Production Deployment**: Deploy to Railway/Vercel

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Three.js Documentation](https://threejs.org/docs/)
- [D3.js Documentation](https://d3js.org/)
- [Railway Documentation](https://docs.railway.app/)

## 🆘 Getting Help

If you encounter issues:

1. Check this guide
2. Review error messages carefully
3. Check console logs (browser & terminal)
4. Search GitHub issues
5. Ask in Discord/Slack (if available)

## ✅ Deployment Checklist

Before deploying to production:

- [ ] Change admin password
- [ ] Change JWT_SECRET (32+ characters)
- [ ] Change viewer password
- [ ] Enable HTTPS
- [ ] Set NODE_ENV=production
- [ ] Configure CORS for production domain
- [ ] Test all features
- [ ] Set up database backups
- [ ] Configure monitoring (Sentry, etc.)
- [ ] Add custom domain
- [ ] Test on mobile devices

---

**Need help?** Open an issue on GitHub or contact support@opslab.uk

**Happy coding! 🚀**
