import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { generateToken } from '../middleware/auth';
import { z } from 'zod';

const prisma = new PrismaClient();

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

const viewerAuthSchema = z.object({
  password: z.string().min(1, 'Password is required'),
});

export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { username, password } = loginSchema.parse(req.body);

    const admin = await prisma.adminUser.findUnique({
      where: { username },
    });

    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken({
      id: admin.id,
      username: admin.username,
    });

    res.json({
      token,
      user: {
        id: admin.id,
        username: admin.username,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const viewerAuth = async (req: Request, res: Response) => {
  try {
    const { password } = viewerAuthSchema.parse(req.body);

    // Simple password check (can be configured via env variable)
    const VIEWER_PASSWORD = process.env.VIEWER_PASSWORD || 'viewer123';

    if (password === VIEWER_PASSWORD) {
      const token = generateToken({
        id: 0,
        username: 'viewer',
      });

      return res.json({
        access: true,
        token,
      });
    }

    res.status(401).json({ access: false, error: 'Invalid password' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    console.error('Viewer auth error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    res.json({ user: req.user });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
