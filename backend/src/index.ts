import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';

// Import routes
import authRoutes from './routes/auth';
import memberRoutes from './routes/members';
import assessmentRoutes from './routes/assessments';
import metricsRoutes from './routes/metrics';

// Import DB initialization
import { initializeDatabase } from './db-init-simple';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Security middleware
app.use(helmet());

// CORS - allow same origin in production (monorepo) or localhost in dev
const corsOrigins: string[] = isProduction
  ? [process.env.FRONTEND_URL, process.env.RAILWAY_PUBLIC_DOMAIN].filter((url): url is string => Boolean(url))
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(
  cors({
    origin: corsOrigins.length > 0 ? corsOrigins : true,
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Debug endpoint
app.get('/debug/db', async (req, res) => {
  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    const memberCount = await prisma.member.count();
    const adminCount = await prisma.adminUser.count();

    await prisma.$disconnect();

    res.json({
      status: 'ok',
      database: 'connected',
      counts: {
        members: memberCount,
        admins: adminCount,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      database: 'failed',
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });
  }
});

// Debug frontend paths
app.get('/debug/frontend', (req, res) => {
  const fs = require('fs');
  const possiblePaths = [
    path.join(__dirname, '../../frontend/dist'),
    path.join(__dirname, '../../../frontend/dist'),
    path.join(process.cwd(), 'frontend/dist'),
    '/app/frontend/dist'
  ];

  const pathsInfo = possiblePaths.map(p => ({
    path: p,
    exists: fs.existsSync(p),
    isDir: fs.existsSync(p) && fs.statSync(p).isDirectory(),
    files: fs.existsSync(p) ? fs.readdirSync(p).slice(0, 10) : []
  }));

  res.json({
    __dirname,
    'process.cwd()': process.cwd(),
    NODE_ENV: process.env.NODE_ENV,
    isProduction,
    paths: pathsInfo
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/metrics', metricsRoutes);

// Serve frontend static files in production
if (isProduction) {
  // Try multiple possible paths for frontend dist
  const possiblePaths = [
    path.join(__dirname, '../../frontend/dist'),
    path.join(__dirname, '../../../frontend/dist'),
    path.join(process.cwd(), 'frontend/dist'),
    '/app/frontend/dist'
  ];

  let frontendPath = possiblePaths[0];

  // Find the correct path
  const fs = require('fs');
  for (const testPath of possiblePaths) {
    if (fs.existsSync(testPath)) {
      frontendPath = testPath;
      console.log(`✅ Found frontend at: ${frontendPath}`);
      break;
    } else {
      console.log(`❌ Frontend not found at: ${testPath}`);
    }
  }

  // Serve static files
  app.use(express.static(frontendPath));

  // SPA fallback - serve index.html for all non-API routes
  app.get('*', (req, res) => {
    // Skip API routes
    if (req.path.startsWith('/api') || req.path.startsWith('/health') || req.path.startsWith('/debug')) {
      return res.status(404).json({ error: 'Route not found' });
    }

    const indexPath = path.join(frontendPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      console.error(`❌ index.html not found at: ${indexPath}`);
      res.status(404).json({ error: 'Frontend not found', path: indexPath });
    }
  });
} else {
  // 404 handler for development
  app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });
}

// Error handler
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error('=== ERROR ===');
    console.error('Path:', req.path);
    console.error('Method:', req.method);
    console.error('Error:', err);
    console.error('Stack:', err.stack);
    console.error('=============');
    res.status(500).json({
      error: 'Internal server error',
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
  }
);

// Initialize database and start server
async function startServer() {
  try {
    console.log('Initializing database...');
    await initializeDatabase();
    console.log('Database initialized successfully');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
}

startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  process.exit(0);
});
