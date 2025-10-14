import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function initializeDatabase() {
  try {
    console.log('Checking database tables...');

    // Check if tables exist
    const result = await prisma.$queryRaw<Array<{exists: boolean}>>`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'members'
      );
    `;

    const tablesExist = result[0]?.exists;

    if (!tablesExist) {
      console.log('Tables do not exist. Creating schema...');

      // Create admin_users table
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "admin_users" (
            "id" SERIAL NOT NULL,
            "username" VARCHAR(50) NOT NULL,
            "passwordHash" VARCHAR(255) NOT NULL,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
        );

        CREATE UNIQUE INDEX IF NOT EXISTS "admin_users_username_key" ON "admin_users"("username");

        CREATE TABLE IF NOT EXISTS "members" (
            "id" SERIAL NOT NULL,
            "code" VARCHAR(10) NOT NULL,
            "fullName" VARCHAR(255) NOT NULL,
            "email" VARCHAR(255) NOT NULL,
            "position" VARCHAR(255),
            "experienceMonths" INTEGER,
            "employmentType" VARCHAR(50),
            "isActive" BOOLEAN NOT NULL DEFAULT true,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL,
            CONSTRAINT "members_pkey" PRIMARY KEY ("id")
        );

        CREATE UNIQUE INDEX IF NOT EXISTS "members_code_key" ON "members"("code");
        CREATE UNIQUE INDEX IF NOT EXISTS "members_email_key" ON "members"("email");

        CREATE TABLE IF NOT EXISTS "assessments" (
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
        );

        CREATE TABLE IF NOT EXISTS "metrics" (
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
            "updatedAt" TIMESTAMP(3) NOT NULL,
            CONSTRAINT "metrics_pkey" PRIMARY KEY ("id")
        );

        CREATE UNIQUE INDEX IF NOT EXISTS "metrics_memberCode_assessmentId_key" ON "metrics"("memberCode", "assessmentId");
      `);

      // Add foreign keys separately
      await prisma.$executeRawUnsafe(`
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM pg_constraint WHERE conname = 'assessments_respondentCode_fkey'
          ) THEN
            ALTER TABLE "assessments" ADD CONSTRAINT "assessments_respondentCode_fkey"
            FOREIGN KEY ("respondentCode") REFERENCES "members"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
          END IF;

          IF NOT EXISTS (
            SELECT 1 FROM pg_constraint WHERE conname = 'metrics_memberCode_fkey'
          ) THEN
            ALTER TABLE "metrics" ADD CONSTRAINT "metrics_memberCode_fkey"
            FOREIGN KEY ("memberCode") REFERENCES "members"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
          END IF;

          IF NOT EXISTS (
            SELECT 1 FROM pg_constraint WHERE conname = 'metrics_assessmentId_fkey'
          ) THEN
            ALTER TABLE "metrics" ADD CONSTRAINT "metrics_assessmentId_fkey"
            FOREIGN KEY ("assessmentId") REFERENCES "assessments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
          END IF;
        END $$;
      `);

      console.log('✅ Database schema created successfully');
    } else {
      console.log('✅ Database tables already exist');
    }

    await prisma.$disconnect();
    return true;
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    await prisma.$disconnect();
    throw error;
  }
}
