import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Calculate mean from array of numbers
const calculateMean = (values: number[]): number => {
  if (values.length === 0) return 0;
  return values.reduce((sum, val) => sum + val, 0) / values.length;
};

// Calculate standard deviation
const calculateStdDev = (values: number[]): number => {
  if (values.length === 0) return 0;
  const mean = calculateMean(values);
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  return Math.sqrt(variance);
};

// Calculate status score (normalized ranking)
const calculateStatusScore = (rankings: number[], teamSize: number): number => {
  const weights = rankings.map(rank => teamSize - rank + 1);
  const maxWeight = teamSize * (teamSize + 1) / 2;
  const sumWeights = weights.reduce((a, b) => a + b, 0);
  return sumWeights / maxWeight;
};

// Get team metrics overview
export const getTeamMetrics = async (req: Request, res: Response) => {
  try {
    const members = await prisma.member.findMany({
      where: { isActive: true },
      include: {
        assessments: {
          orderBy: { timestamp: 'desc' },
          take: 1,
        },
      },
    });

    const assessments = await prisma.assessment.findMany({
      orderBy: { timestamp: 'desc' },
      take: 10,
    });

    // Calculate basic team metrics
    const teamMetrics = {
      totalMembers: members.length,
      activeMembers: members.filter(m => m.isActive).length,
      totalAssessments: assessments.length,
      averageTeamTrust: calculateMean(
        assessments
          .map(a => a.teamTrustIndex)
          .filter((v): v is number => v !== null)
          .map(v => Number(v))
      ),
      averagePsychologicalSafety: calculateMean(
        assessments
          .map(a => a.psychologicalSafety)
          .filter((v): v is number => v !== null)
          .map(v => Number(v))
      ),
      averageRoleSatisfaction: calculateMean(
        assessments
          .map(a => a.roleSatisfaction)
          .filter((v): v is number => v !== null)
          .map(v => Number(v))
      ),
    };

    res.json(teamMetrics);
  } catch (error) {
    console.error('Get team metrics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get member metrics
export const getMemberMetrics = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;

    const member = await prisma.member.findUnique({
      where: { code },
      include: {
        assessments: {
          orderBy: { timestamp: 'desc' },
        },
        metrics: {
          orderBy: { updatedAt: 'desc' },
        },
      },
    });

    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    // Get all assessments to calculate comparative metrics
    const allAssessments = await prisma.assessment.findMany({
      orderBy: { timestamp: 'desc' },
    });

    // Calculate leadership rankings for this member
    const leadershipRankings = allAssessments
      .map(a => {
        const leadership = a.leadership as Record<string, number> | null;
        return leadership?.[code];
      })
      .filter((v): v is number => v !== undefined && v !== null);

    // Calculate expertise rankings
    const expertiseRankings = allAssessments
      .map(a => {
        const expertise = a.expertise as Record<string, number> | null;
        return expertise?.[code];
      })
      .filter((v): v is number => v !== undefined && v !== null);

    const memberMetrics = {
      member,
      leadership: {
        meanRank: calculateMean(leadershipRankings),
        stdDev: calculateStdDev(leadershipRankings),
        top3Count: leadershipRankings.filter(r => r <= 3).length,
        statusScore: calculateStatusScore(leadershipRankings, allAssessments.length),
      },
      expertise: {
        meanRank: calculateMean(expertiseRankings),
        stdDev: calculateStdDev(expertiseRankings),
        top3Count: expertiseRankings.filter(r => r <= 3).length,
        statusScore: calculateStatusScore(expertiseRankings, allAssessments.length),
      },
    };

    res.json(memberMetrics);
  } catch (error) {
    console.error('Get member metrics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Calculate and save metrics for a specific assessment
export const calculateAssessmentMetrics = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const assessment = await prisma.assessment.findUnique({
      where: { id: parseInt(id) },
    });

    if (!assessment) {
      return res.status(404).json({ error: 'Assessment not found' });
    }

    const members = await prisma.member.findMany({
      where: { isActive: true },
    });

    // Calculate metrics for each member based on this assessment
    const metricsPromises = members.map(async (member) => {
      const leadership = assessment.leadership as Record<string, number> | null;
      const expertise = assessment.expertise as Record<string, number> | null;

      if (!leadership || !expertise) {
        return null;
      }

      const leadershipRank = leadership[member.code];
      const expertiseRank = expertise[member.code];

      if (leadershipRank === undefined || expertiseRank === undefined) {
        return null;
      }

      // Create or update metrics
      return prisma.metric.upsert({
        where: {
          memberCode_assessmentId: {
            memberCode: member.code,
            assessmentId: assessment.id,
          },
        },
        create: {
          memberCode: member.code,
          assessmentId: assessment.id,
          meanRankLeadership: leadershipRank,
          meanRankExpertise: expertiseRank,
          statusScore: calculateStatusScore([leadershipRank, expertiseRank], members.length),
        },
        update: {
          meanRankLeadership: leadershipRank,
          meanRankExpertise: expertiseRank,
          statusScore: calculateStatusScore([leadershipRank, expertiseRank], members.length),
        },
      });
    });

    const metrics = await Promise.all(metricsPromises);

    res.json({
      message: 'Metrics calculated successfully',
      count: metrics.filter(m => m !== null).length,
    });
  } catch (error) {
    console.error('Calculate metrics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
