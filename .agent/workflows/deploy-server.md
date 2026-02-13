---
description: Deploy/redeploy website ke private server via SSH + CyberPanel
---

# Deploy Website ke Private Server

Workflow deploy website Masjid Nurul Jannah ke private server dengan CyberPanel.

// turbo-all

## 🔧 Bagian A: Persiapan di Lokal (Jalankan di Mac kamu)

### Step 1: Pastikan Code Terbaru di GitHub

```bash
cd /Applications/MAMP/htdocs/nuruljannah
git add .
git commit -m "Setup for private server deployment"
git push origin main
```

---

## 🖥️ Bagian B: Setup Server (Pertama Kali Saja)

> Jalankan semua command di bawah ini via SSH ke server kamu.
> Contoh: `ssh username@IP_SERVER -p PORT`

### Step 2: Install Node.js 20 LTS

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v  # pastikan v20.x
npm -v
```

### Step 3: Install PM2 (Process Manager)

```bash
sudo npm install -g pm2
```

### Step 4: Buat Website di CyberPanel

1. Login ke CyberPanel (biasanya `https://IP_SERVER:8090`)
2. Masuk ke **Websites** → **Create Website**
3. Isi:
   - **Domain Name**: `nuruljannah.web.id`
   - **PHP**: bisa pilih apapun (tidak dipakai, website ini Node.js)
   - **SSL**: centang untuk auto-issue Let's Encrypt
4. Klik **Create Website**

### Step 5: Setup Reverse Proxy di CyberPanel

> Ini supaya traffic dari `nuruljannah.web.id` diteruskan ke Next.js yang jalan di port 3000.

**Opsi A: Via CyberPanel UI (Recommended)**
1. Buka **Websites** → **List Websites** → Pilih `nuruljannah.web.id`
2. Buka menu **vHost Conf** (atau **Manage** → **vHost Conf**)
3. Tambahkan config berikut di bagian yang sesuai:

Untuk **OpenLiteSpeed**, tambah di dalam context block:

```
extprocessor nodejsapp {
  type                    proxy
  address                 http://127.0.0.1:3000
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

> ⚠️ Setelah edit vHost, restart OpenLiteSpeed dari CyberPanel: **Server Status** → **LiteSpeed Status** → **Restart**

**Opsi B: Via Terminal (Alternatif)**
Jika CyberPanel menggunakan Nginx, edit file conf:
```bash
sudo nano /etc/nginx/conf.d/nuruljannah.web.id.conf
```
Tambahkan:
```nginx
server {
    listen 80;
    server_name nuruljannah.web.id www.nuruljannah.web.id;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```
```bash
sudo nginx -t
sudo systemctl reload nginx
```

### Step 6: Clone Repository di Server

```bash
cd /home/nuruljannah.web.id
git clone https://github.com/afif23170si-ui/nuruljannah.web.id.git app
cd app
npm install
```

### Step 7: Setup Environment Variables di Server

```bash
nano /home/nuruljannah.web.id/app/.env.local
```

Paste isi berikut (ganti value sesuai punya kamu):

```env
DATABASE_URL=postgresql://...your-neon-url...
DIRECT_URL=postgresql://...your-neon-direct-url...

NEXTAUTH_URL=https://nuruljannah.web.id
NEXTAUTH_SECRET=...your-secret...

NEXT_PUBLIC_SUPABASE_URL=https://...your-supabase-url...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...your-anon-key...
SUPABASE_SERVICE_ROLE_KEY=...your-service-role-key...

NEXT_PUBLIC_MOSQUE_LATITUDE=...latitude...
NEXT_PUBLIC_MOSQUE_LONGITUDE=...longitude...
NEXT_PUBLIC_MOSQUE_NAME=Masjid Nurul Jannah
```

> ⚠️ **PENTING**: `NEXTAUTH_URL` harus diubah ke `https://nuruljannah.web.id`

### Step 8: Build & Run

```bash
cd /home/nuruljannah.web.id/app

# Generate Prisma client
npx prisma generate

# Build Next.js
npm run build

# Copy static files ke standalone
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public

# Start dengan PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # ikuti perintah yang muncul untuk auto-start saat reboot
```

### Step 9: Setup DNS

Di domain provider kamu (tempat beli `nuruljannah.web.id`):

```
Type: A
Name: @
Value: <IP_SERVER_KAMU>
TTL: 3600

Type: A
Name: www
Value: <IP_SERVER_KAMU>
TTL: 3600
```

Cek propagasi DNS di: https://dnschecker.org

---

## 🔄 Bagian C: Redeploy (Update Website)

> Jalankan ini setiap kali ada update di GitHub.

### Via SSH di Server:

```bash
cd /home/nuruljannah.web.id/app
git pull origin main
npm install
npx prisma generate
npm run build
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public
pm2 restart nuruljannah
```

---

## ✅ Checklist Verifikasi

- [ ] Website bisa diakses di `https://nuruljannah.web.id`
- [ ] HTTPS aktif (lock icon di browser)
- [ ] Homepage loading dengan baik
- [ ] Prayer Times widget berfungsi
- [ ] Login admin berfungsi
- [ ] PM2 status: `pm2 status` menunjukkan app running

---

## 🛠️ Troubleshooting

### Build Error
```bash
cd /home/nuruljannah.web.id/app
npm run build 2>&1 | tail -50
```

### App Crash / Not Running
```bash
pm2 logs nuruljannah --lines 50
```

### Port 3000 Sudah Dipakai
```bash
sudo lsof -i :3000
# Kill process jika perlu
sudo kill -9 <PID>
pm2 restart nuruljannah
```

### Restart Semua
```bash
pm2 delete nuruljannah
pm2 start ecosystem.config.js
pm2 save
```

### Cek OpenLiteSpeed Status
```bash
sudo systemctl status lsws
sudo systemctl restart lsws
```
