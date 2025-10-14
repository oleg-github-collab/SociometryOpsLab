import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function initializeDatabase() {
  try {
    console.log('🔍 Checking database connection...');

    // Test connection
    await prisma.$connect();
    console.log('✅ Database connected');

    // Check if members table exists
    const result = await prisma.$queryRawUnsafe<Array<{ count: number }>>(
      `SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'members'`
    );

    const tablesExist = Number(result[0]?.count) > 0;

    if (tablesExist) {
      console.log('✅ Database tables already exist');

      // Check if admin exists
      const adminCount = await prisma.adminUser.count();
      if (adminCount === 0) {
        console.log('Creating default admin user...');
        const hashedPassword = await bcrypt.hash('QwertY24$', 12);
        await prisma.adminUser.create({
          data: {
            username: 'Oleh',
            passwordHash: hashedPassword,
          },
        });
        console.log('✅ Admin user created');
      }

      await prisma.$disconnect();
      return true;
    }

    console.log('📝 Creating database schema...');

    // Create tables using raw SQL
    const sqlCommands = [
      // Admin users table
      `CREATE TABLE IF NOT EXISTS "admin_users" (
        "id" SERIAL NOT NULL,
        "username" VARCHAR(50) NOT NULL,
        "passwordHash" VARCHAR(255) NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
      )`,

      `CREATE UNIQUE INDEX IF NOT EXISTS "admin_users_username_key" ON "admin_users"("username")`,

      // Members table
      `CREATE TABLE IF NOT EXISTS "members" (
        "id" SERIAL NOT NULL,
        "code" VARCHAR(10) NOT NULL,
        "fullName" VARCHAR(255) NOT NULL,
        "email" VARCHAR(255) NOT NULL,
        "position" VARCHAR(255),
        "experienceMonths" INTEGER,
        "employmentType" VARCHAR(50),
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "members_pkey" PRIMARY KEY ("id")
      )`,

      `CREATE UNIQUE INDEX IF NOT EXISTS "members_code_key" ON "members"("code")`,
      `CREATE UNIQUE INDEX IF NOT EXISTS "members_email_key" ON "members"("email")`,

      // Assessments table
      `CREATE TABLE IF NOT EXISTS "assessments" (
        "id" SERIAL NOT NULL,
        "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "respondentCode" VARCHAR(10) NOT NULL,
        "fillTimeMinutes" INTEGER,
        "leadership" JSONB,
        "expertise" JSONB,
        "collaboration" JSONB,
        "innovation" JSONB,
        "reliability" JSONB,
        "communication" JSONB,
        "adaptability" JSONB,
        "mentorship" JSONB,
        "selfLeadership" JSONB,
        "selfExpertise" JSONB,
        "selfCollaboration" JSONB,
        "competencyMatrix" JSONB,
        "frequentCollaboration" JSONB,
        "desiredCollaboration" JSONB,
        "learningSources" JSONB,
        "teamTrustIndex" DECIMAL(3,2),
        "psychologicalSafety" DECIMAL(3,2),
        "roleSatisfaction" DECIMAL(3,2),
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "assessments_pkey" PRIMARY KEY ("id")
      )`,

      // Metrics table
      `CREATE TABLE IF NOT EXISTS "metrics" (
        "id" SERIAL NOT NULL,
        "memberCode" VARCHAR(10) NOT NULL,
        "assessmentId" INTEGER NOT NULL,
        "meanRankLeadership" DECIMAL(4,2),
        "meanRankExpertise" DECIMAL(4,2),
        "stdLeadership" DECIMAL(4,2),
        "stdExpertise" DECIMAL(4,2),
        "top3CountLeadership" INTEGER,
        "statusScore" DECIMAL(4,3),
        "maeLeadership" DECIMAL(4,2),
        "biasLeadership" DECIMAL(4,2),
        "accuracyLeadership" DECIMAL(4,2),
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "metrics_pkey" PRIMARY KEY ("id")
      )`,

      `CREATE UNIQUE INDEX IF NOT EXISTS "metrics_memberCode_assessmentId_key" ON "metrics"("memberCode", "assessmentId")`,
    ];

    // Execute each command separately
    for (const sql of sqlCommands) {
      await prisma.$executeRawUnsafe(sql);
    }

    console.log('✅ Tables created');

    // Add foreign keys
    await prisma.$executeRawUnsafe(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'assessments_respondentCode_fkey') THEN
          ALTER TABLE "assessments" ADD CONSTRAINT "assessments_respondentCode_fkey"
          FOREIGN KEY ("respondentCode") REFERENCES "members"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
        END IF;
      END $$;
    `);

    await prisma.$executeRawUnsafe(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'metrics_memberCode_fkey') THEN
          ALTER TABLE "metrics" ADD CONSTRAINT "metrics_memberCode_fkey"
          FOREIGN KEY ("memberCode") REFERENCES "members"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
        END IF;
      END $$;
    `);

    await prisma.$executeRawUnsafe(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'metrics_assessmentId_fkey') THEN
          ALTER TABLE "metrics" ADD CONSTRAINT "metrics_assessmentId_fkey"
          FOREIGN KEY ("assessmentId") REFERENCES "assessments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
        END IF;
      END $$;
    `);

    console.log('✅ Foreign keys added');

    // Create default admin user
    const hashedPassword = await bcrypt.hash('QwertY24$', 12);
    await prisma.adminUser.create({
      data: {
        username: 'Oleh',
        passwordHash: hashedPassword,
      },
    });

    console.log('✅ Admin user created');

    // Create sample members
    const sampleMembers = [
      { code: '2002', fullName: 'Veronika Sheludko', email: 'veronika@opslab.uk', position: 'CEO', experienceMonths: 60, employmentType: 'Full-time' },
      { code: '2003', fullName: 'John Smith', email: 'john@opslab.uk', position: 'CTO', experienceMonths: 48, employmentType: 'Full-time' },
    ];

    for (const member of sampleMembers) {
      await prisma.member.create({ data: member });
    }

    console.log('✅ Sample members created');

    await prisma.$disconnect();
    console.log('✅ Database initialization complete!');
    return true;
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    await prisma.$disconnect();
    return false;
  }
}
