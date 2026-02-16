# Rekomendasi Deployment Workflow - Website Masjid
## Solusi Problem Deployment yang Sering Terjadi

> **Problem Saat Ini:**
> - Build gagal di server (import hilang, dev mode error)
> - 503 / website down (PM2 jalankan server.js bukan server-wrapper.js)
> - Upload gagal / Invalid URL (Proxy duplikat header, wrapper tidak di-copy)
> - Manual deployment via SSH + bash script yang error-prone

---

## 🎯 REKOMENDASI: 3 OPSI DEPLOYMENT

### **OPSI A: Full Vercel (RECOMMENDED ⭐)**
**Paling mudah, otomatis, gratis untuk Next.js**

#### Keuntungan:
- ✅ **Zero config** - push ke GitHub = auto deploy
- ✅ **Tidak perlu SSH, PM2, server management**
- ✅ **Preview deployment** untuk setiap PR
- ✅ **Rollback instant** kalau ada masalah
- ✅ **Built-in CDN, caching, optimization**
- ✅ **Gratis untuk hobby/personal project**
- ✅ **No proxy header issues** - sudah di-handle Vercel

#### Cara Setup:
```bash
# 1. Connect GitHub repo ke Vercel
# Di https://vercel.com/new

# 2. Configure environment variables
POSTGRES_PRISMA_URL=your_production_db_url
POSTGRES_URL_NON_POOLING=your_production_db_url
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=https://your-domain.vercel.app
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_key

# 3. Deploy
git push origin main  # Otomatis deploy!
```

#### Workflow Baru:
```
Local → Test → Git Push → Vercel Auto Deploy → Live! ✨
```

#### Database Options:
1. **Tetap pakai database di server** (via connection string)
2. **Pindah ke Vercel Postgres** (easier, recommended)
3. **Pakai Neon, Supabase, atau PlanetScale** (serverless friendly)

#### Biaya:
- **Hobby plan**: GRATIS
- **Pro plan**: $20/bulan (kalau butuh lebih banyak bandwidth)

---

### **OPSI B: Server Sendiri + Automated CI/CD**
**Tetap pakai server, tapi deployment otomatis via GitHub Actions**

#### Keuntungan:
- ✅ **Full control** atas server
- ✅ **Database lokal** di server yang sama
- ✅ **Otomatis deploy** tanpa SSH manual
- ✅ **Bisa custom configuration**
- ⚠️ Butuh setup awal (sekali saja)

#### Setup GitHub Actions:

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /path/to/website
            git pull origin main
            npm install
            npx prisma generate
            npx prisma migrate deploy
            npm run build
            pm2 restart nuruljannah || pm2 start npm --name nuruljannah -- start
```

#### Setup Secrets di GitHub:
1. Pergi ke repo → Settings → Secrets and variables → Actions
2. Tambahkan:
   - `SERVER_HOST`: IP server kamu
   - `SERVER_USER`: username SSH
   - `SSH_PRIVATE_KEY`: private key SSH kamu

#### Workflow Baru:
```
Local → Test → Git Push → GitHub Actions → Auto Deploy! ✨
```

#### Fix Current Issues:

**1. Build gagal di server:**
```bash
# Pastikan .env.production ada
# .env.production
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="https://your-domain.com"
```

**2. PM2 jalankan file yang benar:**
```json
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'nuruljannah',
    script: 'server-wrapper.js', // BUKAN server.js!
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};

// Restart dengan config
pm2 delete nuruljannah
pm2 start ecosystem.config.js
pm2 save
```

**3. Copy server-wrapper.js ke standalone:**
```bash
# Setelah build
npm run build

# Copy wrapper yang benar
cp server-wrapper.js .next/standalone/
cp -r .next/static .next/standalone/.next/
cp -r public .next/standalone/

# Restart PM2
pm2 restart nuruljannah
```

**4. Fix proxy header duplikat (Nginx):**
```nginx
# /etc/nginx/sites-available/nuruljannah
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        
        # HAPUS SEMUA proxy_set_header yang duplikat
        # Hanya pakai yang ini:
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # JANGAN tambahkan lagi!
    }
}

# Test config
sudo nginx -t

# Reload
sudo systemctl reload nginx
```

---

### **OPSI C: Keep Current Setup + Fix Script**
**Tetap manual, tapi perbaiki deploy.sh**

#### Perbaikan deploy.sh:

```bash
#!/bin/bash
# deploy.sh - FIXED VERSION

set -e  # Exit on error

echo "🚀 Starting deployment..."

# 1. Pull latest code
echo "📥 Pulling latest code..."
git pull origin main

# 2. Install dependencies
echo "📦 Installing dependencies..."
npm install

# 3. Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# 4. Run migrations
echo "🗄️  Running database migrations..."
npx prisma migrate deploy

# 5. Build Next.js
echo "🏗️  Building Next.js..."
npm run build

# 6. Copy files to standalone
echo "📁 Copying files to standalone..."
cp server-wrapper.js .next/standalone/ 2>/dev/null || echo "server-wrapper.js not found, skipping"
cp -r .next/static .next/standalone/.next/ 2>/dev/null || echo ".next/static not found, skipping"
cp -r public .next/standalone/ 2>/dev/null || echo "public not found, skipping"

# 7. Copy .env.local to standalone (penting!)
echo "🔑 Copying environment file..."
cp .env.local .next/standalone/.env.local 2>/dev/null || cp .env.production .next/standalone/.env.production

# 8. Restart PM2
echo "🔄 Restarting PM2..."
pm2 restart nuruljannah || pm2 start ecosystem.config.js

# 9. Save PM2 config
pm2 save

echo "✅ Deployment complete!"
echo "🌐 Check: http://your-domain.com"
```

#### Bikin file ini executable:
```bash
chmod +x deploy.sh
```

#### Cara pakai:
```bash
# Di Mac (local)
npm run build  # Test dulu
git add .
git commit -m "feat: new feature"
git push

# Di Server (SSH)
bash deploy.sh
```

---

## 📊 COMPARISON TABLE

| Aspek | Opsi A: Vercel | Opsi B: CI/CD | Opsi C: Manual Fix |
|-------|----------------|---------------|-------------------|
| **Kemudahan** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| **Otomatis** | ✅ Full auto | ✅ Auto via GH Actions | ❌ Manual SSH |
| **Biaya** | Gratis / $20 | Biaya server | Biaya server |
| **Kontrol** | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Rollback** | ✅ 1 click | ⭐⭐⭐ | ⭐ |
| **Error-prone** | ❌ Very low | ⭐ Low | ⚠️ High |
| **Preview** | ✅ Per PR | ❌ No | ❌ No |
| **Setup Time** | 10 menit | 30 menit | 5 menit |

---

## 🎯 REKOMENDASI SAYA

Berdasarkan situasi kamu:

### **Pilih OPSI A (Vercel)** jika:
- ✅ Mau simple, no hassle
- ✅ Fokus develop, bukan manage server
- ✅ Belum butuh custom server config
- ✅ Traffic masih reasonable (< 100GB/bulan)

**Ini yang paling masuk akal untuk project masjid!**

### **Pilih OPSI B (CI/CD)** jika:
- ✅ Sudah invest banyak di server setup
- ✅ Butuh full control
- ✅ Database besar & lokal
- ✅ Mau belajar DevOps

### **Pilih OPSI C (Manual Fix)** jika:
- ✅ Budget SANGAT ketat (no spare $20)
- ✅ Deployment jarang (1-2x/bulan)
- ✅ Comfortable dengan SSH
- ⚠️ Tapi ini tetap error-prone!

---

## 🚀 QUICK START: MIGRASI KE VERCEL (Recommended)

### Step 1: Preparation (5 menit)
```bash
# Di local
# 1. Pastikan .env punya semua variable
cat .env.local

# 2. Pastikan next.config.js oke
# Kalau ada output: 'standalone', HAPUS atau ubah jadi:
# output: 'standalone' → HAPUS baris ini (Vercel handle otomatis)
```

### Step 2: Create Vercel Project (3 menit)
1. Buka https://vercel.com
2. Login dengan GitHub
3. Click "Add New" → "Project"
4. Pilih repo website masjid
5. Vercel auto-detect Next.js → Click "Deploy"

### Step 3: Configure Environment (2 menit)
Di Vercel dashboard:
1. Settings → Environment Variables
2. Tambahkan semua dari .env.local:
   ```
   DATABASE_URL
   NEXTAUTH_SECRET
   NEXTAUTH_URL (ganti dengan Vercel URL)
   SUPABASE_URL
   SUPABASE_SERVICE_ROLE_KEY
   ```
3. Redeploy

### Step 4: Point Domain (optional)
1. Settings → Domains
2. Add custom domain: `masjidinuruljannah.com`
3. Update DNS record:
   ```
   Type: CNAME
   Name: @ (atau subdomain)
   Value: cname.vercel-dns.com
   ```

### Step 5: Test & Monitor
```bash
# Push perubahan
git push origin main

# Vercel auto deploy!
# Check deployment di: https://vercel.com/your-username/project-name
```

---

## 🔧 TROUBLESHOOTING COMMON ISSUES

### Issue: Database Connection Failed
**Solusi:**
```bash
# Pastikan database bisa diakses dari luar
# Di server database:
sudo ufw allow 5432/tcp  # PostgreSQL
sudo nano /etc/postgresql/*/main/pg_hba.conf

# Tambahkan:
host    all    all    0.0.0.0/0    md5

# Restart PostgreSQL
sudo systemctl restart postgresql
```

### Issue: Build Memory Error
**Solusi:**
```javascript
// next.config.js
module.exports = {
  experimental: {
    // Reduce memory usage
    workerThreads: false,
    cpus: 1
  }
}
```

### Issue: Environment Variables Not Working
**Solusi:**
```bash
# Vercel: Redeploy setelah tambah env vars
# Server: Pastikan ada .env.production

# Check env di runtime:
console.log('DB URL:', process.env.DATABASE_URL ? 'OK' : 'MISSING');
```

---

## 📝 MIGRATION CHECKLIST (Vercel)

Pre-migration:
- [ ] Backup database
- [ ] Export semua media files
- [ ] Simpan semua environment variables
- [ ] Test build locally: `npm run build`

Migration:
- [ ] Create Vercel project
- [ ] Configure environment variables
- [ ] First deployment success
- [ ] Test all features
- [ ] Configure custom domain (optional)

Post-migration:
- [ ] Monitor for 24 hours
- [ ] Check error logs di Vercel
- [ ] Verify all uploads work
- [ ] Test database connections

Cleanup (setelah yakin stable):
- [ ] Stop PM2 di server lama
- [ ] Optional: Keep server for database only
- [ ] Update DNS to Vercel
- [ ] Remove old Nginx config

---

## 💰 COST COMPARISON

### Current Setup (Server Sendiri)
```
VPS/Server: ~$5-20/bulan
Domain: ~$10-15/tahun
SSL: Gratis (Let's Encrypt)
Time: Banyak troubleshooting ⏰

Total: ~$5-20/bulan + waktu troubleshooting
```

### Vercel Setup
```
Hosting: GRATIS (Hobby) atau $20/bulan (Pro)
Domain: ~$10-15/tahun
SSL: Gratis (included)
Time: Almost zero maintenance ⚡

Total: $0-20/bulan + no troubleshooting!
```

**Kesimpulan:** Kalau budget memungkinkan, Vercel jauh lebih hemat waktu!

---

## 🎓 LEARNING RESOURCES

### Vercel Deployment:
- [Next.js Vercel Deployment](https://nextjs.org/docs/deployment)
- [Vercel Docs](https://vercel.com/docs)

### GitHub Actions CI/CD:
- [GitHub Actions Tutorial](https://docs.github.com/en/actions)
- [Deploy to VPS via SSH](https://github.com/marketplace/actions/ssh-remote-commands)

### PM2 Best Practices:
- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [PM2 Ecosystem File](https://pm2.keymetrics.io/docs/usage/application-declaration/)

---

## ✅ FINAL RECOMMENDATION

**Untuk website masjid dengan situasi kamu:**

1. **Short term (sekarang):** 
   - Fix deploy.sh script (OPSI C)
   - Biar bisa deploy dengan minimal error

2. **Long term (1-2 minggu ke depan):**
   - **Migrate ke Vercel** (OPSI A) ⭐
   - Setup otomatis, fokus develop fitur
   - Zero hassle deployment

3. **Alternative (kalau harus keep server):**
   - Setup GitHub Actions CI/CD (OPSI B)
   - Otomatis, tapi tetap full control

---

**Next Steps:**

1. **Mau simple & cepat?** → Vercel (30 menit setup)
2. **Mau tetap di server tapi otomatis?** → GitHub Actions (1 jam setup)
3. **Mau perbaiki yang sekarang?** → Fix deploy.sh (10 menit)

**Pilih yang mana?** 🤔
