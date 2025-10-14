-- OpsLab Analytics Database Setup Script
-- Run this in Railway PostgreSQL Query tab

-- Drop existing tables if needed (uncomment if you want to reset)
-- DROP TABLE IF EXISTS metrics CASCADE;
-- DROP TABLE IF EXISTS assessments CASCADE;
-- DROP TABLE IF EXISTS members CASCADE;
-- DROP TABLE IF EXISTS admin_users CASCADE;

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    "passwordHash" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- Create members table
CREATE TABLE IF NOT EXISTS members (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,
    "fullName" VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    position VARCHAR(255),
    "experienceMonths" INTEGER,
    "employmentType" VARCHAR(50),
    "isActive" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- Create assessments table
CREATE TABLE IF NOT EXISTS assessments (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "respondentCode" VARCHAR(10) NOT NULL,
    "fillTimeMinutes" INTEGER,
    leadership JSONB,
    expertise JSONB,
    collaboration JSONB,
    innovation JSONB,
    reliability JSONB,
    communication JSONB,
    adaptability JSONB,
    mentorship JSONB,
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
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT assessments_respondentCode_fkey FOREIGN KEY ("respondentCode") REFERENCES members(code)
);

-- Create metrics table
CREATE TABLE IF NOT EXISTS metrics (
    id SERIAL PRIMARY KEY,
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
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT metrics_memberCode_assessmentId_key UNIQUE ("memberCode", "assessmentId"),
    CONSTRAINT metrics_memberCode_fkey FOREIGN KEY ("memberCode") REFERENCES members(code),
    CONSTRAINT metrics_assessmentId_fkey FOREIGN KEY ("assessmentId") REFERENCES assessments(id)
);

-- Insert admin user (username: Oleh, password: QwertY24$)
-- Password hash generated with bcrypt, 12 rounds
INSERT INTO admin_users (username, "passwordHash")
VALUES ('Oleh', '$2b$12$AqB/jHy1Tbuk//8ML84s.u1nY6jfdBew3scm01nmZzRKTC7CoYTua')
ON CONFLICT (username) DO NOTHING;

-- Insert sample members
INSERT INTO members (code, "fullName", email, position, "experienceMonths", "employmentType") VALUES
('2002', 'Veronika Sheludko', 'veronika@opslab.uk', 'CEO', 60, 'Full-time'),
('2003', 'John Smith', 'john@opslab.uk', 'CTO', 48, 'Full-time'),
('2004', 'Anna Johnson', 'anna@opslab.uk', 'Product Manager', 36, 'Full-time'),
('2005', 'Ivan Petrov', 'ivan@opslab.uk', 'Senior Developer', 42, 'Full-time')
ON CONFLICT (code) DO NOTHING;

-- Verify tables were created
SELECT 'admin_users' as table_name, COUNT(*) as count FROM admin_users
UNION ALL
SELECT 'members', COUNT(*) FROM members
UNION ALL
SELECT 'assessments', COUNT(*) FROM assessments
UNION ALL
SELECT 'metrics', COUNT(*) FROM metrics;
