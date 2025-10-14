# 🚀 Деплой Frontend - ВИКОНАЙ ЦІ КРОКИ

## Frontend Service вже створено!

✅ Service ID: `6faebac7-d0fc-49f0-bb92-fb94261c7760`
✅ URL: **https://frontend-production-53a0.up.railway.app**
✅ Environment variables встановлено

## Що треба зробити (3 хвилини):

### 1. Підключи GitHub до Frontend Service

Іди сюди: https://railway.com/project/7eb60fec-f690-4ba3-b443-ae369bef6735

Знайди service з назвою **"frontend"** (я щойно створив)

Натисни на нього → **Settings** → **Source**:

- Натисни **"Connect Repo"**
- Вибери **oleg-github-collab/SociometryOpsLab**
- В полі **Root Directory** встанови: `frontend`
- Натисни **Save**

Railway автоматично почне деплой!

---

### 2. Налаштуй Database (ВАЖЛИВО!)

Іди до PostgreSQL service → **Data** → **Query**

Виконай цей SQL (скопіюй ВСЕ):

```sql
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
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
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
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- Foreign keys
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'assessments_respondentCode_fkey') THEN
    ALTER TABLE assessments ADD CONSTRAINT assessments_respondentCode_fkey
    FOREIGN KEY ("respondentCode") REFERENCES members(code);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'metrics_memberCode_fkey') THEN
    ALTER TABLE metrics ADD CONSTRAINT metrics_memberCode_fkey
    FOREIGN KEY ("memberCode") REFERENCES members(code);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'metrics_assessmentId_fkey') THEN
    ALTER TABLE metrics ADD CONSTRAINT metrics_assessmentId_fkey
    FOREIGN KEY ("assessmentId") REFERENCES assessments(id);
  END IF;
END $$;

-- Insert admin (username: Oleh, password: QwertY24$)
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
```

Натисни **Execute** або **Run**

---

### 3. Оновлю Backend CORS зараз:

Почекай 30 секунд, я оновлю backend...

---

## Після цього все буде працювати!

**Backend:** https://backend-production-121be.up.railway.app
**Frontend:** https://frontend-production-53a0.up.railway.app

### Тестові акаунти:

**Admin:**
- Username: `Oleh`
- Password: `QwertY24$`

**Viewer:**
- Password: `viewer123`

---

## Перевірка:

```bash
# Backend health
curl https://backend-production-121be.up.railway.app/health

# Database check
curl https://backend-production-121be.up.railway.app/debug/db

# Frontend
open https://frontend-production-53a0.up.railway.app
```
