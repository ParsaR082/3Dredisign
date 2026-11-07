#!/usr/bin/env bash

# =========================================================
# Urum Sima - Automated Safe Deployment Script
# =========================================================

# Wrap in a subshell so if pasted directly into Termius, 'exit' won't close SSH session
(
  set -o pipefail

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
  echo -e "${CYAN}${BOLD}       🚀 شروع عملیات استقرار و آپدیت اروم‌سیما      ${NC}"
  echo -e "${CYAN}${BOLD}====================================================${NC}"

  # 1. رفتن به دایرکتوری پروژه
  if [ -d "$APP_DIR" ]; then
    cd "$APP_DIR" || exit 1
  fi
  echo -e "${YELLOW}📁 دایرکتوری کاری: $(pwd)${NC}"

  # 2. جلوگیری از مصرف بی‌رویه رم و محافظت از اتصال SSH در برابر قفل شدن
  export NEXT_TELEMETRY_DISABLED=1
  export NODE_OPTIONS="--max-old-space-size=1536"

  # 3. کنار گذاشتن تغییرات محلی برای جلوگیری از خطای تداخل
  echo -e "\n${CYAN}📦 [مرحله ۱/۴] کنار گذاشتن تغییرات فایل‌های محلی...${NC}"
  git stash

  # 4. دریافت آخرین کدهای برنچ اصلی
  echo -e "\n${CYAN}⬇️  [مرحله ۲/۴] دریافت آخرین تغییرات از origin/main...${NC}"
  git checkout main
  if ! git pull origin main; then
    echo -e "\n${RED}❌ خطای گیت پول! عملیات استقرار متوقف شد.${NC}"
    exit 1
  fi

  LATEST_COMMIT=$(git log -n 1 --oneline)
  echo -e "${GREEN}✓ آخرین کامیت دریافت شد: ${BOLD}$LATEST_COMMIT${NC}"

  # 5. اجرای بیلد پروژه با اولویت مناسب پردازنده برای حفظ اتصال SSH
  echo -e "\n${CYAN}🔨 [مرحله ۳/۴] اجرای بیلد Next.js با حفاظت از منابع سرور...${NC}"
  echo -e "${YELLOW}⏳ در حال بیلد... لطفاً صبر کنید (اتصال ترمیوس باز خواهد ماند)...${NC}"

  if nice -n 15 npm run build; then
    echo -e "\n${GREEN}✓ بیلد با موفقیت ۱۰۰٪ کامل شد!${NC}"
  else
    echo -e "\n${RED}====================================================${NC}"
    echo -e "${RED}❌ بیلد با خطا مواجه شد!${NC}"
    echo -e "${YELLOW}⚠️  دستور pm2 restart برای جلوگیری از قطعی سایت لغو گردید.${NC}"
    echo -e "${RED}====================================================${NC}"
    exit 1
  fi

  # 6. ری‌استارت PM2 تنها پس از موفقیت بیلد
  echo -e "\n${CYAN}🔄 [مرحله ۴/۴] ری‌استارت پروسه سرور ($APP_NAME)...${NC}"
  pm2 restart "$APP_NAME"

  echo -e "\n${GREEN}${BOLD}====================================================${NC}"
  echo -e "${GREEN}${BOLD}       🎉 آپدیت با موفقیت کامل انجام و سایت نوسازی شد! ${NC}"
  echo -e "${GREEN}${BOLD}       کامیت فعال: $LATEST_COMMIT${NC}"
  echo -e "${GREEN}${BOLD}====================================================${NC}\n"

  pm2 status "$APP_NAME"
)
