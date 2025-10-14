-- CreateTable
CREATE TABLE "admin_users" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "passwordHash" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "members" (
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

-- CreateTable
CREATE TABLE "assessments" (
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

-- CreateTable
CREATE TABLE "metrics" (
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

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_username_key" ON "admin_users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "members_code_key" ON "members"("code");

-- CreateIndex
CREATE UNIQUE INDEX "members_email_key" ON "members"("email");

-- CreateIndex
CREATE UNIQUE INDEX "metrics_memberCode_assessmentId_key" ON "metrics"("memberCode", "assessmentId");

-- AddForeignKey
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_respondentCode_fkey" FOREIGN KEY ("respondentCode") REFERENCES "members"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "metrics" ADD CONSTRAINT "metrics_memberCode_fkey" FOREIGN KEY ("memberCode") REFERENCES "members"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "metrics" ADD CONSTRAINT "metrics_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "assessments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
