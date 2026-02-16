#!/bin/bash

# ==========================================
# 🚀 Deploy Script - Masjid Nurul Jannah
# ==========================================
# Dijalankan otomatis oleh GitHub Actions,
# atau manual di server: bash deploy.sh

set -e  # Stop jika ada error

APP_DIR="/home/nuruljannah.web.id/app"
APP_NAME="nuruljannah"

echo ""
echo "🕌 =========================================="
echo "   Deploy Masjid Nurul Jannah"
echo "   $(date '+%Y-%m-%d %H:%M:%S')"
echo "=========================================="
echo ""

cd "$APP_DIR"

# 1. Pull latest code
echo "📥 Pulling latest code..."
git pull origin main
echo ""

# 2. Install dependencies
echo "📦 Installing dependencies..."
npm ci --production=false 2>/dev/null || npm install --production=false
echo ""

# 3. Generate Prisma client
echo "🗄️  Generating Prisma client..."
npx prisma generate
echo ""

# 4. Build
echo "🔨 Building Next.js..."
npm run build
echo ""

# 5. Copy files ke standalone (WAJIB setelah setiap build!)
echo "📁 Copying files to standalone..."
STANDALONE_DIR="$APP_DIR/.next/standalone"

cp -r .next/static "$STANDALONE_DIR/.next/static"
echo "  ✅ .next/static"

cp -r public "$STANDALONE_DIR/public"
echo "  ✅ public"

cp .env.local "$STANDALONE_DIR/.env.local"
echo "  ✅ .env.local"

if [ -f "server-wrapper.js" ]; then
  cp server-wrapper.js "$STANDALONE_DIR/server-wrapper.js"
  echo "  ✅ server-wrapper.js"
else
  echo "  ❌ server-wrapper.js NOT FOUND! Deployment may fail."
  exit 1
fi
echo ""

# 6. Create logs directory if not exists
mkdir -p "$APP_DIR/logs"

# 7. Restart PM2 using ecosystem config
echo "🔄 Restarting app..."
if pm2 describe "$APP_NAME" > /dev/null 2>&1; then
  pm2 delete "$APP_NAME" 2>/dev/null || true
fi

# Start with ecosystem config (always uses server-wrapper.js)
pm2 start "$APP_DIR/ecosystem.config.js"
pm2 save
echo ""

# 8. Verify
sleep 3
echo "✅ Checking app status..."
pm2 status "$APP_NAME"
echo ""

echo "🎉 Deploy selesai! Website: https://nuruljannah.web.id"
echo ""
