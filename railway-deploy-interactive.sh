#!/bin/bash

# OpsLab Analytics - Railway Interactive Deploy
# Цей скрипт допоможе задеплоїти проект на Railway

echo "🚀 OpsLab Analytics - Railway Deploy"
echo "====================================="
echo ""
echo "Railway Project: https://railway.com/project/7eb60fec-f690-4ba3-b443-ae369bef6735"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check Railway CLI
echo -e "${BLUE}Перевірка Railway CLI...${NC}"
if ! command -v railway &> /dev/null; then
    echo -e "${RED}❌ Railway CLI не встановлено${NC}"
    echo "Встановіть: npm i -g @railway/cli"
    exit 1
fi
echo -e "${GREEN}✓ Railway CLI встановлено${NC}"
echo ""

# Check login
echo -e "${BLUE}Перевірка авторизації...${NC}"
RAILWAY_USER=$(railway whoami 2>&1 | head -n 1)
if [[ $RAILWAY_USER == *"not logged in"* ]]; then
    echo -e "${RED}❌ Не авторизовано${NC}"
    echo "Запустіть: railway login"
    exit 1
fi
echo -e "${GREEN}✓ Авторизовано: $RAILWAY_USER${NC}"
echo ""

# Project info
echo -e "${BLUE}Інформація про проект:${NC}"
railway status
echo ""

# Step 1: Backend Service
echo -e "${YELLOW}========================================${NC}"
echo -e "${BLUE}Крок 1: Створення Backend Service${NC}"
echo -e "${YELLOW}========================================${NC}"
echo ""
echo "Будь ласка, виконайте наступні дії в Railway Dashboard:"
echo "1. Відкрийте: https://railway.com/project/7eb60fec-f690-4ba3-b443-ae369bef6735"
echo "2. Натисніть '+ New'"
echo "3. Виберіть 'Database' → 'Add PostgreSQL'"
echo "4. Дочекайтесь створення (30 сек)"
echo "5. Натисніть '+ New' знову"
echo "6. Виберіть 'Empty Service'"
echo "7. Назвіть: 'backend'"
echo ""
read -p "Натисніть Enter після створення backend сервісу..." </dev/tty

# Link to backend service
echo ""
echo -e "${BLUE}Linking до backend сервісу...${NC}"
cd backend
railway service backend
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}⚠ Не вдалося link. Спробуйте вручну: railway service backend${NC}"
fi
echo ""

# Step 2: Deploy Backend
echo -e "${YELLOW}========================================${NC}"
echo -e "${BLUE}Крок 2: Deploy Backend${NC}"
echo -e "${YELLOW}========================================${NC}"
echo ""
echo "Деплоїмо backend на Railway..."
railway up
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Backend задеплоєно!${NC}"
else
    echo -e "${RED}❌ Deploy не вдався${NC}"
    echo "Спробуйте вручну: cd backend && railway up"
    exit 1
fi
echo ""

# Step 3: Set Variables
echo -e "${YELLOW}========================================${NC}"
echo -e "${BLUE}Крок 3: Встановлення Змінних Середовища${NC}"
echo -e "${YELLOW}========================================${NC}"
echo ""

echo "Введіть JWT_SECRET (мінімум 32 символи):"
echo "Або натисніть Enter для генерації автоматично"
read -p "JWT_SECRET: " jwt_secret </dev/tty
if [ -z "$jwt_secret" ]; then
    jwt_secret="opslab-$(openssl rand -hex 16)-production-2025"
    echo "Згенеровано: $jwt_secret"
fi

echo ""
echo "Встановлюємо змінні..."
railway variables set JWT_SECRET="$jwt_secret"
railway variables set NODE_ENV="production"
railway variables set ADMIN_USERNAME="Oleh"
railway variables set ADMIN_PASSWORD="QwertY24$"
railway variables set VIEWER_PASSWORD="viewer123"
railway variables set PORT="3000"
railway variables set FRONTEND_URL="https://opslab-analytics.vercel.app"

echo -e "${GREEN}✓ Змінні встановлено${NC}"
echo ""

# Step 4: Run Migrations
echo -e "${YELLOW}========================================${NC}"
echo -e "${BLUE}Крок 4: Запуск Міграцій${NC}"
echo -e "${YELLOW}========================================${NC}"
echo ""
echo "Запускаємо Prisma міграції..."
railway run npx prisma migrate deploy
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Міграції виконано${NC}"
else
    echo -e "${YELLOW}⚠ Міграції можливо не виконано${NC}"
fi
echo ""

echo "Засіваємо базу даних..."
railway run npx prisma db seed
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ База даних засіяна${NC}"
else
    echo -e "${YELLOW}⚠ Seed можливо не виконано${NC}"
fi
echo ""

# Step 5: Get Backend URL
echo -e "${YELLOW}========================================${NC}"
echo -e "${BLUE}Крок 5: Отримання Backend URL${NC}"
echo -e "${YELLOW}========================================${NC}"
echo ""
echo "Генеруємо домен..."
BACKEND_URL=$(railway domain 2>&1 | tail -n 1)
echo ""
echo -e "${GREEN}Backend URL: $BACKEND_URL${NC}"
echo ""

# Step 6: Test Backend
echo -e "${YELLOW}========================================${NC}"
echo -e "${BLUE}Крок 6: Тестування Backend${NC}"
echo -e "${YELLOW}========================================${NC}"
echo ""
echo "Перевіряємо health endpoint..."
sleep 5  # Wait for deployment
HEALTH_CHECK=$(curl -s "https://$BACKEND_URL/health" 2>&1)
if [[ $HEALTH_CHECK == *"ok"* ]]; then
    echo -e "${GREEN}✓ Backend працює!${NC}"
    echo "Response: $HEALTH_CHECK"
else
    echo -e "${YELLOW}⚠ Backend можливо ще запускається...${NC}"
    echo "Перевірте через 1-2 хвилини: https://$BACKEND_URL/health"
fi
echo ""

# Step 7: Frontend Deploy
echo -e "${YELLOW}========================================${NC}"
echo -e "${BLUE}Крок 7: Deploy Frontend${NC}"
echo -e "${YELLOW}========================================${NC}"
echo ""
echo "Виберіть платформу для frontend:"
echo "1) Vercel (рекомендовано)"
echo "2) Railway"
echo "3) Пропустити"
read -p "Ваш вибір (1/2/3): " frontend_choice </dev/tty

cd ../frontend

if [ "$frontend_choice" = "1" ]; then
    echo ""
    echo "Перевірка Vercel CLI..."
    if ! command -v vercel &> /dev/null; then
        echo "Встановлення Vercel CLI..."
        npm i -g vercel
    fi

    echo "Створення .env.production..."
    echo "VITE_API_URL=https://$BACKEND_URL/api" > .env.production

    echo ""
    echo "Deploy на Vercel..."
    vercel --prod

    echo ""
    echo -e "${GREEN}✓ Frontend задеплоєно на Vercel${NC}"

elif [ "$frontend_choice" = "2" ]; then
    echo ""
    echo "Створіть frontend сервіс у Dashboard:"
    echo "1. Відкрийте: https://railway.com/project/7eb60fec-f690-4ba3-b443-ae369bef6735"
    echo "2. Натисніть '+ New' → 'Empty Service' → 'frontend'"
    read -p "Натисніть Enter після створення..." </dev/tty

    railway service frontend

    echo "Створення .env.production..."
    echo "VITE_API_URL=https://$BACKEND_URL/api" > .env.production

    echo ""
    echo "Deploy на Railway..."
    railway up

    echo ""
    echo "Генерація домену..."
    railway domain

    echo ""
    echo -e "${GREEN}✓ Frontend задеплоєно на Railway${NC}"
else
    echo -e "${YELLOW}Frontend deploy пропущено${NC}"
fi

# Summary
echo ""
echo -e "${YELLOW}========================================${NC}"
echo -e "${GREEN}✓ Deploy Завершено!${NC}"
echo -e "${YELLOW}========================================${NC}"
echo ""
echo "📊 OpsLab Analytics успішно задеплоєно!"
echo ""
echo "Backend URL: https://$BACKEND_URL"
echo "Health Check: https://$BACKEND_URL/health"
echo ""
echo "Frontend URL: (перевірте вище)"
echo ""
echo "Admin Login:"
echo "  Username: Oleh"
echo "  Password: QwertY24$ (ЗМІНІТЬ!)"
echo ""
echo "Viewer Password: viewer123 (ЗМІНІТЬ!)"
echo ""
echo "Railway Dashboard:"
echo "https://railway.com/project/7eb60fec-f690-4ba3-b443-ae369bef6735"
echo ""
echo "Наступні кроки:"
echo "1. Змініть паролі (railway variables set ...)"
echo "2. Налаштуйте custom domain (railway domain add your-domain.com)"
echo "3. Протестуйте всі функції"
echo "4. Налаштуйте monitoring"
echo ""
echo "🎉 Готово! Насолоджуйтесь вашим OpsLab Analytics!"
echo ""
