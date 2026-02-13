#!/bin/bash

# ==========================================
# 🚀 Deploy Script - Masjid Nurul Jannah
# ==========================================
# Jalankan di server: bash deploy.sh
# Atau: ./deploy.sh (jika sudah chmod +x)

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
npm install --production=false
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
echo "📁 Copying static files & env to standalone..."
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public
cp .env.local .next/standalone/.env.local
echo ""

# 6. Restart PM2
echo "🔄 Restarting app..."
pm2 restart "$APP_NAME" 2>/dev/null || {
  echo "⚠️  App belum ada di PM2, starting fresh..."
  PORT=4000 HOSTNAME=0.0.0.0 NODE_OPTIONS="--max-http-header-size=65536" \
    pm2 start .next/standalone/server.js --name "$APP_NAME"
}
pm2 save
echo ""

# 7. Verify
sleep 3
echo "✅ Checking app status..."
pm2 status "$APP_NAME"
echo ""

echo "🎉 Deploy selesai! Website: https://nuruljannah.web.id"
echo ""
