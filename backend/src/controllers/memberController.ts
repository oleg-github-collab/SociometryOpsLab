import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const memberSchema = z.object({
  code: z.string().min(1).max(10),
  fullName: z.string().min(1).max(255),
  email: z.string().email().max(255),
  position: z.string().max(255).optional(),
  experienceMonths: z.number().int().positive().optional(),
  employmentType: z.string().max(50).optional(),
  isActive: z.boolean().optional().default(true),
});

export const getAllMembers = async (req: Request, res: Response) => {
  try {
    const { active, search, page = '1', limit = '20' } = req.query;

    const where: any = {};

    if (active !== undefined) {
      where.isActive = active === 'true';
    }

    if (search) {
      where.OR = [
        { fullName: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } },
        { code: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const [members, total] = await Promise.all([
      prisma.member.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.member.count({ where }),
    ]);

    res.json({
      data: members,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        totalPages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error) {
    console.error('Get members error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMemberByCode = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;

    const member = await prisma.member.findUnique({
      where: { code },
      include: {
        assessments: {
          orderBy: { timestamp: 'desc' },
          take: 10,
        },
        metrics: {
          orderBy: { updatedAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    res.json(member);
  } catch (error) {
    console.error('Get member error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createMember = async (req: Request, res: Response) => {
  try {
    const data = memberSchema.parse(req.body);

    const member = await prisma.member.create({
      data,
    });

    res.status(201).json(member);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    console.error('Create member error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateMember = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    const data = memberSchema.partial().parse(req.body);

    const member = await prisma.member.update({
      where: { code },
      data,
    });

    res.json(member);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    console.error('Update member error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteMember = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;

    // Soft delete
    const member = await prisma.member.update({
      where: { code },
      data: { isActive: false },
    });

    res.json({ message: 'Member deactivated successfully', member });
  } catch (error) {
    console.error('Delete member error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const bulkImportMembers = async (req: Request, res: Response) => {
  try {
    const { members } = req.body;

    if (!Array.isArray(members)) {
      return res.status(400).json({ error: 'Members must be an array' });
    }

    const validatedMembers = members.map((m) => memberSchema.parse(m));

    const results = await prisma.$transaction(
      validatedMembers.map((data) =>
        prisma.member.upsert({
          where: { code: data.code },
          update: data,
          create: data,
        })
      )
    );

    res.status(201).json({
      message: `${results.length} members imported successfully`,
      data: results,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    console.error('Bulk import error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
