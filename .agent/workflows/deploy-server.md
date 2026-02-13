---
description: Deploy/redeploy website ke private server via SSH + CyberPanel + Cloudflare
---

# Deploy Website ke Private Server

Dokumentasi deploy website **Masjid Nurul Jannah** (Next.js 16) ke private server dengan CyberPanel + Cloudflare.

// turbo-all

---

## 📋 Info Deployment

| Item | Detail |
|------|--------|
| Framework | Next.js 16 (standalone mode) |
| Process Manager | PM2 |
| Web Server | OpenLiteSpeed (CyberPanel) |
| CDN & DNS | Cloudflare (Free plan) |
| SSL | Cloudflare Flexible |
| Database | Supabase PostgreSQL (cloud) |
| Domain | `nuruljannah.web.id` |
| App Port | **4000** (port 3000 sudah dipakai OpenLiteSpeed/nghttpx) |
| GitHub Repo | `afif23170si-ui/nuruljannah.web.id` |
| Path di Server | `/home/nuruljannah.web.id/app` |
| SSH User | `kvm1` (lalu `sudo su -` ke root) |
| SSH Port | `5903` |

---

## 🔄 Update/Redeploy Website (Rutin)

> Jalankan ini **setiap kali** ada perubahan code yang sudah di-push ke GitHub.

### Di Mac (Lokal):

```bash
cd /Applications/MAMP/htdocs/nuruljannah
git add .
git commit -m "update: deskripsi perubahan"
git push origin main
```

### Di Server (SSH):

```bash
# Connect SSH
ssh kvm1@IP_SERVER -p 5903
sudo su -

# Pull & Rebuild
cd /home/nuruljannah.web.id/app
git pull origin main
npm install
npx prisma generate
npm run build

# Copy files ke standalone (WAJIB setelah setiap build)
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public
cp .env.local .next/standalone/.env.local

# Restart app
pm2 restart nuruljannah
```

> ⚠️ **PENTING:** 3 perintah `cp` di atas WAJIB dijalankan setelah setiap `npm run build` karena folder `.next/standalone/` dibikin ulang saat build.

---

## 🔧 Setup Server (Pertama Kali)

> Langkah-langkah berikut hanya perlu dilakukan **sekali** saat setup awal.

### Step 1: Install Node.js 20 LTS

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v  # pastikan v20.x
```

### Step 2: Install PM2

```bash
sudo npm install -g pm2
```

### Step 3: Buat Website di CyberPanel

1. Login ke CyberPanel (`https://IP_SERVER:8090`)
2. **Websites** → **Create Website**
3. Domain Name: `nuruljannah.web.id`
4. Issue SSL (Let's Encrypt) — opsional jika pakai Cloudflare Flexible

### Step 4: Setup Reverse Proxy di CyberPanel (vHost Conf)

1. **Websites** → **List Websites** → `nuruljannah.web.id` → **vHost Conf**
2. Tambahkan di bagian **paling bawah**:

```
extprocessor nodejsapp {
  type                    proxy
  address                 http://127.0.0.1:4000
  maxConns                100
  pcKeepAliveTimeout      60
  initTimeout             60
  retryTimeout            0
  respBuffer              0
}

context / {
  type                    proxy
  handler                 nodejsapp
  addDefaultCharset       off
}
```

3. Save, lalu restart OpenLiteSpeed:
```bash
sudo systemctl restart lsws
```

### Step 5: Clone & Install

```bash
cd /home/nuruljannah.web.id
git clone https://github.com/afif23170si-ui/nuruljannah.web.id.git app
cd app
npm install
```

### Step 6: Setup `.env.local`

```bash
nano /home/nuruljannah.web.id/app/.env.local
```

Paste (ganti value sesuai punya kamu):

```env
# Database - Supabase PostgreSQL
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# NextAuth.js — HARUS https://
NEXTAUTH_URL="https://nuruljannah.web.id"
NEXTAUTH_SECRET="your-secret-key"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGci..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGci..."

# Mosque Location
NEXT_PUBLIC_MOSQUE_LATITUDE="1.6677856"
NEXT_PUBLIC_MOSQUE_LONGITUDE="101.4760945"
NEXT_PUBLIC_MOSQUE_NAME="Masjid Nurul Jannah"
```

> ⚠️ `NEXTAUTH_URL` **HARUS** pakai `https://` — bukan `http://`

### Step 7: Build & Start

```bash
cd /home/nuruljannah.web.id/app
npx prisma generate
npm run build

# Copy files ke standalone
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public
cp .env.local .next/standalone/.env.local

# Start dengan PM2 (port 4000)
PORT=4000 HOSTNAME=0.0.0.0 NODE_OPTIONS="--max-http-header-size=65536" pm2 start .next/standalone/server.js --name nuruljannah
pm2 save
pm2 startup  # auto-start saat server reboot
```

### Step 8: Setup Cloudflare DNS

1. Buat akun di https://dash.cloudflare.com
2. Add site → `nuruljannah.web.id` → Free plan
3. DNS Records:
   - `@` → A → IP Server (Proxied ☁️)
   - `www` → A → IP Server (Proxied ☁️)
4. SSL/TLS → **Flexible**
5. Di DomaiNesia → ganti **Nameserver** ke yang diberikan Cloudflare
6. Tunggu propagasi (15 menit - 24 jam)

---

## 🐛 Masalah yang Ditemukan & Solusinya

### Problem 1: Port 3000 sudah dipakai OpenLiteSpeed

**Gejala:** Error `431 Request Header Fields Too Large` dengan `nghttpx`

**Penyebab:** OpenLiteSpeed internal proxy (nghttpx) sudah occupy port 3000, sehingga Node.js tidak bisa bind ke port yang sama.

**Solusi:** Gunakan **port 4000** untuk Node.js. Update vHost proxy config dari `127.0.0.1:3000` → `127.0.0.1:4000`.

---

### Problem 2: `.env.local` tidak terbaca di standalone mode

**Gejala:** Error `Environment variable not found: DATABASE_URL`

**Penyebab:** Next.js standalone server (`server.js` di `.next/standalone/`) tidak otomatis membaca `.env.local` dari project root. File `.env.local` hanya dibaca otomatis saat `next dev` atau `next build`.

**Solusi:** Copy `.env.local` ke folder standalone setelah setiap build:
```bash
cp .env.local .next/standalone/.env.local
```

---

### Problem 3: NEXTAUTH_URL harus `https://`

**Gejala:** Login redirect error atau cookie issues

**Penyebab:** Cloudflare menghandle SSL, jadi user mengakses via `https://`. Kalau `NEXTAUTH_URL` diset `http://`, NextAuth akan generate callback URL yang salah.

**Solusi:** Set `NEXTAUTH_URL="https://nuruljannah.web.id"` di `.env.local`.

---

## 🛠️ Troubleshooting

### Cek status app
```bash
pm2 status
pm2 logs nuruljannah --lines 50
```

### App crash / not running
```bash
pm2 delete nuruljannah
PORT=4000 HOSTNAME=0.0.0.0 NODE_OPTIONS="--max-http-header-size=65536" pm2 start /home/nuruljannah.web.id/app/.next/standalone/server.js --name nuruljannah
pm2 save
```

### Restart OpenLiteSpeed
```bash
sudo systemctl restart lsws
sudo systemctl status lsws
```

### Port sudah dipakai
```bash
sudo lsof -i :4000
sudo kill -9 <PID>
```

### Cek apakah Node.js response
```bash
curl -I http://127.0.0.1:4000
```

### Clear PM2 logs
```bash
pm2 flush nuruljannah
```