# 🚀 OpsLab Analytics Platform

A premium-grade, enterprise-level team analytics platform for visualizing team dynamics, competency assessments, and collaboration networks with cinematic animations and advanced data visualizations.

## ✨ Features

### 🔐 Admin Panel
- **Secure Authentication**: JWT-based login system (Username: `Oleh`, Password: `QwertY24$`)
- **Member Management**: Full CRUD operations for team members
- **Assessment Input**: Complex multi-step form for assessment data
- **Bulk Import/Export**: CSV/Excel import with validation
- **Real-time Dashboard**: Overview stats and quick actions

### 📊 Viewer Dashboard
- **Password Protection**: Simple password-based access for viewers
- **Multiple Visualizations**:
  - 3D Team Space (Three.js + React Three Fiber)
  - Circular Network Diagram (D3.js + SVG)
  - Interactive Heatmaps
  - Force-Directed Graphs
  - Competency Scatter Plots
  - Radar Charts
- **Mobile-First Design**: Native app experience on all devices
- **PWA Support**: Installable as a mobile/desktop app

### 🎨 Design System
- **Glass Morphism**: Modern glassmorphic UI elements
- **Neon Accents**: Glowing effects and animations
- **Dark Theme**: Eye-friendly dark color scheme
- **Fluid Typography**: Responsive text scaling
- **GSAP Animations**: Professional cinematic animations

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js 20.x
- **Framework**: Express.js
- **Database**: PostgreSQL 15+ (Railway)
- **ORM**: Prisma
- **Authentication**: JWT + bcrypt
- **Validation**: Zod

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 3.x
- **State Management**: Zustand
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod

### Visualization
- **3D**: Three.js + React Three Fiber
- **Charts**: D3.js, Recharts, Nivo, Chart.js
- **Animation**: GSAP, Framer Motion, Lottie

### Deployment
- **Platform**: Railway.app
- **CI/CD**: Automatic deployments from Git
- **Database**: Railway PostgreSQL

## 📦 Installation

### Prerequisites
- Node.js 20.x or higher
- PostgreSQL 15+ (or Railway account)
- npm or yarn

### 1. Clone Repository
\`\`\`bash
git clone https://github.com/yourusername/opslab-analytics.git
cd opslab-analytics
\`\`\`

### 2. Backend Setup
\`\`\`bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your database URL and secrets
# DATABASE_URL="postgresql://user:password@localhost:5432/opslab"
# JWT_SECRET="your-secret-key"

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database (creates admin user)
npm run prisma:seed

# Start development server
npm run dev
\`\`\`

### 3. Frontend Setup
\`\`\`bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
\`\`\`

### 4. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Admin Login**: http://localhost:5173/admin/login

## 🚀 Deployment to Railway

### 1. Install Railway CLI
\`\`\`bash
npm i -g @railway/cli
railway login
\`\`\`

### 2. Create Project
\`\`\`bash
railway init
\`\`\`

### 3. Add PostgreSQL Database
\`\`\`bash
railway add
# Select PostgreSQL
\`\`\`

### 4. Set Environment Variables
\`\`\`bash
railway variables set JWT_SECRET="your-production-secret"
railway variables set ADMIN_USERNAME="Oleh"
railway variables set ADMIN_PASSWORD="QwertY24$"
railway variables set NODE_ENV="production"
\`\`\`

### 5. Deploy Backend
\`\`\`bash
cd backend
railway up

# Run migrations
railway run npx prisma migrate deploy
railway run npx prisma db seed
\`\`\`

### 6. Deploy Frontend
\`\`\`bash
cd frontend

# Build for production
npm run build

# Deploy to Railway
railway up
\`\`\`

### 7. Link Custom Domain (Optional)
\`\`\`bash
railway domain
\`\`\`

## 📱 Database Schema

### Members Table
\`\`\`sql
CREATE TABLE members (
  id SERIAL PRIMARY KEY,
  code VARCHAR(10) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  position VARCHAR(255),
  experience_months INTEGER,
  employment_type VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

### Assessments Table
\`\`\`sql
CREATE TABLE assessments (
  id SERIAL PRIMARY KEY,
  timestamp TIMESTAMP DEFAULT NOW(),
  respondent_code VARCHAR(10) REFERENCES members(code),
  fill_time_minutes INTEGER,
  leadership JSONB,
  expertise JSONB,
  collaboration JSONB,
  -- ... 8 competencies total
  team_trust_index DECIMAL(3,2),
  psychological_safety DECIMAL(3,2),
  role_satisfaction DECIMAL(3,2),
  created_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

## 🔑 Admin Credentials

**Default Admin Account:**
- Username: `Oleh`
- Password: `QwertY24$`

⚠️ **Important**: Change the admin password in production!

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/admin/login` - Admin login
- `POST /api/auth/viewer/auth` - Viewer authentication
- `GET /api/auth/me` - Get current user

### Members
- `GET /api/members` - Get all members (paginated)
- `GET /api/members/:code` - Get member by code
- `POST /api/members` - Create member (admin only)
- `PUT /api/members/:code` - Update member (admin only)
- `DELETE /api/members/:code` - Soft delete member (admin only)
- `POST /api/members/bulk-import` - Bulk import (admin only)

### Assessments
- `GET /api/assessments` - Get all assessments (paginated)
- `GET /api/assessments/:id` - Get assessment by ID
- `POST /api/assessments` - Create assessment (admin only)
- `PUT /api/assessments/:id` - Update assessment (admin only)
- `DELETE /api/assessments/:id` - Delete assessment (admin only)

## 🎨 Component Architecture

### Core Components (To Be Implemented)
\`\`\`
components/
├── admin/
│   ├── MemberForm.tsx       # CRUD form for members
│   ├── AssessmentForm.tsx   # Multi-step assessment input
│   ├── DataTable.tsx        # Reusable data table
│   └── MatrixInput.tsx      # Competency matrix input
├── viewer/
│   ├── Team3D.tsx           # 3D visualization
│   ├── CircularNetwork.tsx  # Circular diagram
│   ├── Heatmap.tsx          # Interactive heatmap
│   ├── ForceGraph.tsx       # Force-directed graph
│   └── RadarChart.tsx       # Competency radar
├── ui/
│   ├── Button.tsx
│   ├── Modal.tsx
│   ├── Card.tsx
│   └── Input.tsx
└── layout/
    ├── AdminLayout.tsx
    └── ViewerLayout.tsx
\`\`\`

## 🧪 Testing

\`\`\`bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# E2E tests
npm run test:e2e
\`\`\`

## 📈 Performance Optimizations

- **Code Splitting**: Lazy loading for routes
- **Virtual Scrolling**: For large lists
- **Memoization**: React.memo for expensive components
- **Web Workers**: For heavy calculations
- **Service Workers**: Offline support and caching
- **Image Optimization**: Lazy loading and responsive images

## 🔒 Security Features

- HTTPS only
- JWT authentication
- CORS configuration
- Rate limiting
- Input validation (Zod)
- SQL injection prevention (Prisma)
- XSS protection
- Password hashing (bcrypt, 12 rounds)

## 🌐 Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Android)

## 📱 PWA Features

- Installable on home screen
- Offline support
- Push notifications (future)
- Native-like UI
- Touch gestures
- Pull-to-refresh

## 🎯 Roadmap

- [ ] Advanced heatmap with clustering
- [ ] Timeline visualization
- [ ] Sankey diagram for collaboration flows
- [ ] PDF report generation
- [ ] CSV/Excel export
- [ ] Real-time updates (WebSockets)
- [ ] Advanced filters and search
- [ ] User roles and permissions
- [ ] Email notifications
- [ ] Mobile native apps (React Native)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Credits

- **Design**: Inspired by modern analytics platforms
- **Icons**: Emoji (built-in)
- **Fonts**: Inter, JetBrains Mono (Google Fonts)

## 📞 Support

For issues and questions:
- GitHub Issues: [link]
- Email: support@opslab.uk

---

**Built with ❤️ by the OpsLab Team**

🌟 Star this repo if you find it useful!
