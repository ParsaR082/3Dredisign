#!/usr/bin/env bash

# =========================================================
# Urum Sima - Automated Safe Deployment Script
# =========================================================

# Navigate to project directory
cd /var/www/urumsima_next || exit 1
echo "📁 Working directory: $(pwd)"

# Resource protection to prevent high CPU/RAM load and keep SSH alive
export NEXT_TELEMETRY_DISABLED=1
export NODE_OPTIONS="--max-old-space-size=1536"

# 1. Stash local changes to avoid merge conflicts
echo "📦 [1/4] Stashing local changes..."
git stash

# 2. Pull latest code from origin/main
echo "⬇️  [2/4] Pulling latest code from origin/main..."
git checkout main
if ! git pull origin main; then
  echo "❌ Git pull failed! Deployment aborted."
  exit 1
fi

echo "✓ Latest commit: $(git log -n 1 --oneline)"

# 3. Safe production build with nice priority
echo "🔨 [3/4] Running Next.js build (npm run build)..."
if nice -n 15 npm run build; then
  echo "✓ Build completed successfully!"
else
  echo "❌ Build failed! Skipping pm2 restart to prevent downtime."
  exit 1
fi

# 4. Restart PM2 process only on build success
echo "🔄 [4/4] Restarting PM2 process (urumsima-next)..."
pm2 restart urumsima-next

echo "🎉 Deployment finished successfully!"
pm2 status urumsima-next
