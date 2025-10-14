#!/bin/bash
set -e

echo "=== Starting OpsLab Backend ==="
echo "Current directory: $(pwd)"
echo "DATABASE_URL set: ${DATABASE_URL:+yes}"

echo ""
echo "=== Running Prisma Migrations ==="
npx prisma migrate deploy || {
    echo "ERROR: Migration failed!"
    echo "Continuing anyway..."
}

echo ""
echo "=== Seeding Database ==="
npx prisma db seed || {
    echo "ERROR: Seed failed!"
    echo "Continuing anyway..."
}

echo ""
echo "=== Starting Node Server ==="
node dist/index.js
