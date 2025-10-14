#!/bin/bash

# OpsLab Analytics - Quick Deploy Script
# Цей скрипт автоматизує deploy на GitHub та Railway

echo "🚀 OpsLab Analytics - Quick Deploy"
echo "===================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Check if git is initialized
echo -e "${BLUE}Step 1: Checking Git...${NC}"
if [ ! -d .git ]; then
    echo "Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit: OpsLab Analytics Platform"
fi
echo -e "${GREEN}✓ Git ready${NC}"
echo ""

# Step 2: Push to GitHub
echo -e "${BLUE}Step 2: Creating GitHub Repository...${NC}"
echo "Enter your GitHub username:"
read github_username

echo "Creating repository on GitHub..."
gh repo create opslab-analytics \
    --public \
    --source=. \
    --remote=origin \
    --description="🚀 OpsLab Analytics - Team dynamics and sociometry platform with 3D visualizations" \
    --push

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ GitHub repository created!${NC}"
    echo "URL: https://github.com/$github_username/opslab-analytics"
else
    echo -e "${YELLOW}⚠ GitHub push failed. Please check 'gh auth status'${NC}"
    echo "Run 'gh auth login' to authenticate"
fi
echo ""

# Step 3: Railway Setup
echo -e "${BLUE}Step 3: Setting up Railway...${NC}"
echo "Make sure you're logged in to Railway"
echo "Run: railway login"
echo ""
echo "Press Enter to continue after logging in..."
read

# Initialize Railway project
echo "Initializing Railway project..."
railway init

# Add PostgreSQL
echo "Adding PostgreSQL..."
railway add

# Get DATABASE_URL
echo ""
echo -e "${YELLOW}Important: Copy the DATABASE_URL from Railway variables${NC}"
railway variables

echo ""
echo "Press Enter after you've noted the DATABASE_URL..."
read

# Set environment variables
echo ""
echo -e "${BLUE}Setting environment variables...${NC}"
echo "Enter JWT_SECRET (min 32 characters):"
read jwt_secret

railway variables set JWT_SECRET="$jwt_secret"
railway variables set NODE_ENV="production"
railway variables set ADMIN_USERNAME="Oleh"
railway variables set ADMIN_PASSWORD="QwertY24$"
railway variables set VIEWER_PASSWORD="viewer123"
railway variables set PORT="3000"

echo -e "${GREEN}✓ Variables set${NC}"
echo ""

# Deploy backend
echo -e "${BLUE}Step 4: Deploying Backend...${NC}"
cd backend
railway up
cd ..

echo ""
echo -e "${GREEN}✓ Backend deployed!${NC}"
echo ""

# Run migrations
echo -e "${BLUE}Step 5: Running Database Migrations...${NC}"
cd backend
railway run npx prisma migrate deploy
railway run npx prisma db seed
cd ..

echo -e "${GREEN}✓ Database ready${NC}"
echo ""

# Get backend URL
echo -e "${BLUE}Getting backend URL...${NC}"
backend_url=$(railway domain)

echo ""
echo -e "${GREEN}✓ Backend URL: $backend_url${NC}"
echo ""

# Deploy frontend
echo -e "${BLUE}Step 6: Deploying Frontend...${NC}"
echo "Choose deployment platform:"
echo "1) Vercel (recommended)"
echo "2) Railway"
read -p "Enter choice (1 or 2): " platform_choice

cd frontend

if [ "$platform_choice" = "1" ]; then
    echo "Creating .env.production for Vercel..."
    echo "VITE_API_URL=https://$backend_url/api" > .env.production

    echo "Deploying to Vercel..."
    vercel --prod

elif [ "$platform_choice" = "2" ]; then
    echo "Creating .env.production for Railway..."
    echo "VITE_API_URL=https://$backend_url/api" > .env.production

    echo "Deploying to Railway..."
    railway up
    railway domain
fi

cd ..

echo ""
echo -e "${GREEN}✓ Frontend deployed!${NC}"
echo ""

# Summary
echo "===================================="
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo "===================================="
echo ""
echo "📊 Your OpsLab Analytics is live!"
echo ""
echo "Backend URL: https://$backend_url"
echo "Frontend URL: (check above output)"
echo ""
echo "Admin Login:"
echo "  Username: Oleh"
echo "  Password: QwertY24$ (CHANGE THIS!)"
echo ""
echo "Viewer Password: viewer123 (CHANGE THIS!)"
echo ""
echo "Next steps:"
echo "1. Visit your frontend URL"
echo "2. Test login"
echo "3. Change default passwords"
echo "4. Configure your custom domain (optional)"
echo ""
echo "For detailed instructions, see DEPLOY_INSTRUCTIONS.md"
echo ""
echo "🎉 Happy analyzing!"
