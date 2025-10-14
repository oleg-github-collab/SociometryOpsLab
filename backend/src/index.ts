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
  const fs = require('fs');
  const frontendPath = path.join(__dirname, 'public');

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    frontend: {
      path: frontendPath,
      exists: fs.existsSync(frontendPath),
      hasIndexHtml: fs.existsSync(path.join(frontendPath, 'index.html')),
      files: fs.existsSync(frontendPath) ? fs.readdirSync(frontendPath).length : 0
    }
  });
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

// Debug frontend paths - MUST be before API routes
app.get('/debug-frontend-info', (req, res) => {
  const fs = require('fs');
  const frontendPath = path.join(__dirname, 'public');

  const pathInfo = {
    path: frontendPath,
    exists: fs.existsSync(frontendPath),
    isDir: fs.existsSync(frontendPath) ? fs.statSync(frontendPath).isDirectory() : false,
    files: fs.existsSync(frontendPath) ? fs.readdirSync(frontendPath) : [],
    indexHtml: fs.existsSync(path.join(frontendPath, 'index.html'))
  };

  res.json({
    __dirname,
    'process.cwd()': process.cwd(),
    NODE_ENV: process.env.NODE_ENV,
    isProduction,
    frontendPath: pathInfo
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/metrics', metricsRoutes);

// Serve frontend static files in production
if (isProduction) {
  const fs = require('fs');

  // Frontend should be in dist/public after build
  const frontendPath = path.join(__dirname, 'public');

  console.log(`🔍 Looking for frontend at: ${frontendPath}`);

  if (fs.existsSync(frontendPath)) {
    console.log(`✅ Found frontend at: ${frontendPath}`);
    const files = fs.readdirSync(frontendPath);
    console.log(`📁 Frontend files: ${files.join(', ')}`);
  } else {
    console.error(`❌ Frontend not found at: ${frontendPath}`);
  }

  // Serve static files with proper headers for SPA
  app.use(express.static(frontendPath, {
    maxAge: '1d',
    etag: true
  }));

  // SPA fallback - serve index.html for all non-API routes
  app.use((req, res, next) => {
    // Skip API and debug routes
    if (req.path.startsWith('/api') || req.path.startsWith('/health') || req.path.startsWith('/debug')) {
      return next();
    }

    const indexPath = path.join(frontendPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      console.error(`❌ index.html not found at: ${indexPath}`);
      res.status(404).json({
        error: 'Frontend not found',
        path: indexPath,
        cwd: process.cwd(),
        __dirname
      });
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
