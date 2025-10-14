-- Create tables
CREATE TABLE IF NOT EXISTS "admins" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "members" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "members_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "assessments" (
    "id" TEXT NOT NULL,
    "memberCode" TEXT NOT NULL,
    "assessmentDate" TIMESTAMP(3) NOT NULL,
    "teamTrustIndex" DECIMAL(10,2),
    "communicationScore" DECIMAL(10,2),
    "cooperationLevel" DECIMAL(10,2),
    "stressLevel" DECIMAL(10,2),
    "workSatisfaction" DECIMAL(10,2),
    "productivityScore" DECIMAL(10,2),
    "leadershipPotential" DECIMAL(10,2),
    "adaptabilityScore" DECIMAL(10,2),
    "innovationIndex" DECIMAL(10,2),
    "conflictResolution" DECIMAL(10,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assessments_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "metrics" (
    "id" TEXT NOT NULL,
    "memberCode" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "metricName" TEXT NOT NULL,
    "metricValue" DECIMAL(10,2) NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "metrics_pkey" PRIMARY KEY ("id")
);

-- Create unique indexes
CREATE UNIQUE INDEX IF NOT EXISTS "admins_username_key" ON "admins"("username");
CREATE UNIQUE INDEX IF NOT EXISTS "members_code_key" ON "members"("code");
CREATE UNIQUE INDEX IF NOT EXISTS "metrics_memberCode_assessmentId_key" ON "metrics"("memberCode", "assessmentId");

-- Create indexes
CREATE INDEX IF NOT EXISTS "assessments_memberCode_idx" ON "assessments"("memberCode");
CREATE INDEX IF NOT EXISTS "assessments_assessmentDate_idx" ON "assessments"("assessmentDate");
CREATE INDEX IF NOT EXISTS "metrics_memberCode_idx" ON "metrics"("memberCode");
CREATE INDEX IF NOT EXISTS "metrics_assessmentId_idx" ON "metrics"("assessmentId");

-- Add foreign keys
ALTER TABLE "assessments" DROP CONSTRAINT IF EXISTS "assessments_memberCode_fkey";
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_memberCode_fkey" FOREIGN KEY ("memberCode") REFERENCES "members"("code") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "metrics" DROP CONSTRAINT IF EXISTS "metrics_memberCode_fkey";
ALTER TABLE "metrics" ADD CONSTRAINT "metrics_memberCode_fkey" FOREIGN KEY ("memberCode") REFERENCES "members"("code") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "metrics" DROP CONSTRAINT IF EXISTS "metrics_assessmentId_fkey";
ALTER TABLE "metrics" ADD CONSTRAINT "metrics_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Insert admin user (password: QwertY24$)
INSERT INTO "admins" ("id", "username", "password", "createdAt", "updatedAt")
VALUES (
    'admin-' || substr(md5(random()::text), 1, 8),
    'Oleh',
    '$2b$10$YourHashedPasswordHere',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT ("username") DO NOTHING;
