#!/usr/bin/env bash

# =========================================================
# Urum Sima - Automated Safe Deployment Script
# =========================================================

set -eo pipefail

# ANSI Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

APP_DIR="/var/www/urumsima_next"
APP_NAME="urumsima-next"

echo -e "${CYAN}${BOLD}====================================================${NC}"
echo -e "${CYAN}${BOLD}       🚀 Starting Urum Sima Deployment Process      ${NC}"
echo -e "${CYAN}${BOLD}====================================================${NC}"

# 1. Navigate to project directory
if [ -d "$APP_DIR" ]; then
  cd "$APP_DIR"
fi
echo -e "${YELLOW}📁 Working directory: $(pwd)${NC}"

# 2. Stash local changes to avoid merge conflicts with auto-saved settings
echo -e "\n${CYAN}📦 [Step 1/4] Stashing local changes...${NC}"
git stash

# 3. Pull latest code from main
echo -e "\n${CYAN}⬇️  [Step 2/4] Pulling latest code from origin/main...${NC}"
git checkout main
if ! git pull origin main; then
  echo -e "\n${RED}❌ Git pull failed! Aborting deployment.${NC}"
  exit 1
fi

LATEST_COMMIT=$(git log -n 1 --oneline)
echo -e "${GREEN}✓ Successfully updated to commit: ${BOLD}$LATEST_COMMIT${NC}"

# 4. Run Next.js production build
echo -e "\n${CYAN}🔨 [Step 3/4] Running Next.js build (npm run build)...${NC}"
if npm run build; then
  echo -e "\n${GREEN}✓ Build completed successfully!${NC}"
else
  echo -e "\n${RED}====================================================${NC}"
  echo -e "${RED}❌ BUILD FAILED!${NC}"
  echo -e "${YELLOW}⚠️  pm2 restart was SKIPPED to prevent site downtime.${NC}"
  echo -e "${RED}====================================================${NC}"
  exit 1
fi

# 5. Restart PM2 only after successful build
echo -e "\n${CYAN}🔄 [Step 4/4] Restarting PM2 process ($APP_NAME)...${NC}"
pm2 restart "$APP_NAME"

echo -e "\n${GREEN}${BOLD}====================================================${NC}"
echo -e "${GREEN}${BOLD}       🎉 Deployment Successful! Live site updated! ${NC}"
echo -e "${GREEN}${BOLD}       Commit: $LATEST_COMMIT${NC}"
echo -e "${GREEN}${BOLD}====================================================${NC}\n"

pm2 status "$APP_NAME"
