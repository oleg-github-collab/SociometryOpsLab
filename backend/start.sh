#!/bin/bash
set -e

echo "=== Starting OpsLab Backend ==="
echo "Current directory: $(pwd)"
echo "DATABASE_URL set: ${DATABASE_URL:+yes}"

echo ""
echo "=== Starting Node Server (DB init happens in app) ==="
node dist/index.js
