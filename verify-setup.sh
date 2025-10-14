#!/bin/bash

# OpsLab Analytics - Setup Verification Script
# This script checks if your environment is properly configured

echo "🔍 OpsLab Analytics - Setup Verification"
echo "========================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
CHECKS_PASSED=0
CHECKS_FAILED=0

# Check function
check() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $1"
        ((CHECKS_PASSED++))
    else
        echo -e "${RED}✗${NC} $1"
        ((CHECKS_FAILED++))
    fi
}

# Check Node.js
echo "Checking Node.js..."
node --version > /dev/null 2>&1
check "Node.js is installed ($(node --version))"

# Check if Node version is 20+
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -ge 20 ]; then
    check "Node.js version is 20 or higher"
else
    echo -e "${RED}✗${NC} Node.js version should be 20+ (current: $(node --version))"
    ((CHECKS_FAILED++))
fi

# Check npm
echo "Checking npm..."
npm --version > /dev/null 2>&1
check "npm is installed ($(npm --version))"

# Check if backend directory exists
echo "Checking project structure..."
[ -d "backend" ]
check "Backend directory exists"

[ -d "frontend" ]
check "Frontend directory exists"

# Check backend files
[ -f "backend/package.json" ]
check "Backend package.json exists"

[ -f "backend/prisma/schema.prisma" ]
check "Prisma schema exists"

[ -f "backend/.env" ] || [ -f "backend/.env.example" ]
check "Backend environment config exists"

# Check frontend files
[ -f "frontend/package.json" ]
check "Frontend package.json exists"

[ -f "frontend/vite.config.ts" ]
check "Vite config exists"

[ -f "frontend/tailwind.config.js" ]
check "Tailwind config exists"

# Check if dependencies are installed
echo "Checking dependencies..."
if [ -d "backend/node_modules" ]; then
    check "Backend dependencies installed"
else
    echo -e "${YELLOW}⚠${NC} Backend dependencies not installed (run: cd backend && npm install)"
    ((CHECKS_FAILED++))
fi

if [ -d "frontend/node_modules" ]; then
    check "Frontend dependencies installed"
else
    echo -e "${YELLOW}⚠${NC} Frontend dependencies not installed (run: cd frontend && npm install)"
    ((CHECKS_FAILED++))
fi

# Check if .env file is configured
echo "Checking configuration..."
if [ -f "backend/.env" ]; then
    if grep -q "DATABASE_URL=" backend/.env && ! grep -q "your-database-url-here" backend/.env; then
        check "Database URL configured"
    else
        echo -e "${YELLOW}⚠${NC} DATABASE_URL needs to be set in backend/.env"
        ((CHECKS_FAILED++))
    fi

    if grep -q "JWT_SECRET=" backend/.env && ! grep -q "your-secret-key" backend/.env; then
        check "JWT_SECRET configured"
    else
        echo -e "${YELLOW}⚠${NC} JWT_SECRET needs to be set in backend/.env"
        ((CHECKS_FAILED++))
    fi
else
    echo -e "${RED}✗${NC} backend/.env file not found (copy from .env.example)"
    ((CHECKS_FAILED++))
fi

# Check PostgreSQL (optional)
echo "Checking database..."
if command -v psql &> /dev/null; then
    check "PostgreSQL client installed"
else
    echo -e "${YELLOW}⚠${NC} PostgreSQL not found locally (you can use Railway instead)"
fi

# Check if Prisma client is generated
if [ -d "backend/node_modules/.prisma" ]; then
    check "Prisma client generated"
else
    echo -e "${YELLOW}⚠${NC} Prisma client not generated (run: cd backend && npx prisma generate)"
    ((CHECKS_FAILED++))
fi

# Summary
echo ""
echo "========================================"
echo "Summary:"
echo -e "${GREEN}Passed: $CHECKS_PASSED${NC}"
if [ $CHECKS_FAILED -gt 0 ]; then
    echo -e "${RED}Failed: $CHECKS_FAILED${NC}"
else
    echo -e "${GREEN}Failed: 0${NC}"
fi
echo "========================================"
echo ""

if [ $CHECKS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ Setup verification complete! You're ready to start the app.${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Run: npm run dev"
    echo "2. Open: http://localhost:5173"
    echo "3. Login with: Oleh / QwertY24$"
else
    echo -e "${YELLOW}⚠️  Some checks failed. Please review the issues above.${NC}"
    echo ""
    echo "Common solutions:"
    echo "1. Install dependencies: npm run install:all"
    echo "2. Configure .env: cp backend/.env.example backend/.env"
    echo "3. Setup database: npm run setup"
    echo "4. See SETUP.md for detailed instructions"
fi
