import { Request, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const assessmentSchema = z.object({
  respondentCode: z.string().min(1).max(10),
  fillTimeMinutes: z.number().int().positive().optional(),
  leadership: z.record(z.number()).optional(),
  expertise: z.record(z.number()).optional(),
  collaboration: z.record(z.number()).optional(),
  innovation: z.record(z.number()).optional(),
  reliability: z.record(z.number()).optional(),
  communication: z.record(z.number()).optional(),
  adaptability: z.record(z.number()).optional(),
  mentorship: z.record(z.number()).optional(),
  selfLeadership: z.record(z.number()).optional(),
  selfExpertise: z.record(z.number()).optional(),
  selfCollaboration: z.record(z.number()).optional(),
  competencyMatrix: z.any().optional(),
  frequentCollaboration: z.array(z.string()).optional(),
  desiredCollaboration: z.array(z.string()).optional(),
  learningSources: z.array(z.string()).optional(),
  teamTrustIndex: z.number().min(0).max(10).optional(),
  psychologicalSafety: z.number().min(0).max(10).optional(),
  roleSatisfaction: z.number().min(0).max(10).optional(),
});

export const getAllAssessments = async (req: Request, res: Response) => {
  try {
    const { respondentCode, page = '1', limit = '20' } = req.query;

    const where: any = {};

    if (respondentCode) {
      where.respondentCode = respondentCode as string;
    }

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const [assessments, total] = await Promise.all([
      prisma.assessment.findMany({
        where,
        skip,
        take,
        orderBy: { timestamp: 'desc' },
        include: {
          respondent: {
            select: {
              code: true,
              fullName: true,
              position: true,
            },
          },
        },
      }),
      prisma.assessment.count({ where }),
    ]);

    res.json({
      data: assessments,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        totalPages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error) {
    console.error('Get assessments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAssessmentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const assessment = await prisma.assessment.findUnique({
      where: { id: parseInt(id) },
      include: {
        respondent: true,
        metrics: true,
      },
    });

    if (!assessment) {
      return res.status(404).json({ error: 'Assessment not found' });
    }

    res.json(assessment);
  } catch (error) {
    console.error('Get assessment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createAssessment = async (req: Request, res: Response) => {
  try {
    const data = assessmentSchema.parse(req.body);

    // Verify respondent exists
    const member = await prisma.member.findUnique({
      where: { code: data.respondentCode },
    });

    if (!member) {
      return res.status(404).json({ error: 'Respondent not found' });
    }

    // Convert decimals for PostgreSQL
    const assessmentData: any = { ...data };
    if (data.teamTrustIndex !== undefined) {
      assessmentData.teamTrustIndex = new Prisma.Decimal(data.teamTrustIndex);
    }
    if (data.psychologicalSafety !== undefined) {
      assessmentData.psychologicalSafety = new Prisma.Decimal(data.psychologicalSafety);
    }
    if (data.roleSatisfaction !== undefined) {
      assessmentData.roleSatisfaction = new Prisma.Decimal(data.roleSatisfaction);
    }

    const assessment = await prisma.assessment.create({
      data: assessmentData,
    });

    // Calculate metrics in background (optional)
    // await calculateMetricsForAssessment(assessment.id);

    res.status(201).json(assessment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    console.error('Create assessment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateAssessment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = assessmentSchema.partial().parse(req.body);

    // Convert decimals
    const updateData: any = { ...data };
    if (data.teamTrustIndex !== undefined) {
      updateData.teamTrustIndex = new Prisma.Decimal(data.teamTrustIndex);
    }
    if (data.psychologicalSafety !== undefined) {
      updateData.psychologicalSafety = new Prisma.Decimal(data.psychologicalSafety);
    }
    if (data.roleSatisfaction !== undefined) {
      updateData.roleSatisfaction = new Prisma.Decimal(data.roleSatisfaction);
    }

    const assessment = await prisma.assessment.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    res.json(assessment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    console.error('Update assessment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteAssessment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.assessment.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Assessment deleted successfully' });
  } catch (error) {
    console.error('Delete assessment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
