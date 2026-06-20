# 🚀 Panduan Publish Ulang — Masjid Nurul Jannah

> **Kondisi saat ini:** Website dihapus dari CyberPanel. Domain sudah di Cloudflare. SSH & CyberPanel tersedia.

---

## 🗺️ Gambaran Alur

```
[Lokal Mac] → build → push GitHub
                                ↓
[SSH ke Server] → clone/pull → build → PM2 start
                                              ↓
[CyberPanel] → buat website → vHost proxy → port 4000
                                              ↓
[Cloudflare] → DNS sudah aktif → website live ✅
```

---

## ⚠️ Sebelum Mulai — Perbaiki Database Dulu!

Database kamu saat ini **error** (`ENOTFOUND`). Perbaiki dulu sebelum deploy.

1. Buka [Supabase Dashboard](https://supabase.com/dashboard) → pilih project `plunbdqyoxkygjikjkbi`
2. Pergi ke **Settings → Database → Connection string**
3. Copy **Session pooler** (port **6543**) dan **Direct connection**
4. Update `.env.local` di lokal:

```env
# Ganti dengan string koneksi terbaru dari Supabase
DATABASE_URL="postgresql://postgres.plunbdqyoxkygjikjkbi:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.plunbdqyoxkygjikjkbi:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
```

> [!IMPORTANT]
> Password asli: `NurulJannah@2026$` (sudah URL-encoded di file lama sebagai `NurulJannah%402026%24`)

---

## 📋 FASE 1 — Persiapan di Lokal (Mac)

### Step 1.1 — Test koneksi database

```bash
cd /Applications/MAMP/htdocs/nuruljannah
npm run dev
```

Buka http://localhost:3000 — pastikan tidak ada error database lagi.

### Step 1.2 — Build production

```bash
npm run build
```

> [!CAUTION]
> Jangan lanjut ke server jika build gagal. Fix error dulu di lokal.

### Step 1.3 — Push ke GitHub

```bash
git add .
git commit -m "fix: update database connection & ready for deploy"
git push origin main
```

---

## 📋 FASE 2 — Setup di CyberPanel

### Step 2.1 — Buat Website Baru

1. Login ke **CyberPanel** → `https://IP_SERVER:8090`
2. Menu **Websites** → **Create Website**
3. Isi:
   - **Domain:** `nuruljannah.web.id`
   - **Email:** *(email admin)*
   - **Package:** Default
   - **PHP:** Tidak perlu (Next.js app)
4. Klik **Create Website**

> [!NOTE]
> SSL dari Let's Encrypt bisa di-skip karena kita pakai **Cloudflare Flexible SSL** (Cloudflare yang handle SSL ke user, koneksi ke server pakai HTTP).

### Step 2.2 — Setup Reverse Proxy (vHost Config)

1. **Websites** → **List Websites** → klik `nuruljannah.web.id`
2. Pilih **vHost Conf**
3. Tambahkan blok berikut di bagian **paling bawah** file:

```apache
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

4. Klik **Save**
5. **Restart OpenLiteSpeed:** Pergi ke **Restart/Reload** → **Graceful Restart**

---

## 📋 FASE 3 — Setup di Server (SSH)

### Step 3.1 — Masuk ke Server

```bash
ssh kvm1@IP_SERVER -p 5903
sudo su -
```

### Step 3.2 — Cek apakah folder app masih ada

```bash
ls /home/nuruljannah.web.id/
```

**Jika folder `app` masih ada** → langsung ke Step 3.4

**Jika folder `app` tidak ada (baru)** → lanjut Step 3.3

### Step 3.3 — Clone repo (jika belum ada)

```bash
cd /home/nuruljannah.web.id
git clone https://github.com/afif23170si-ui/nuruljannah.web.id.git app
cd app
npm install
```

### Step 3.4 — Pull kode terbaru (jika folder sudah ada)

```bash
cd /home/nuruljannah.web.id/app
git pull origin main
npm install
```

### Step 3.5 — Setup `.env.local` di server

```bash
nano /home/nuruljannah.web.id/app/.env.local
```

Paste isi `.env.local` yang sudah diupdate (dari Fase 1), **DENGAN SATU PERUBAHAN PENTING**:

```env
# ⚠️ WAJIB ganti ke https:// untuk production!
NEXTAUTH_URL="https://nuruljannah.web.id"

# Sisanya sama seperti .env.local lokal
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
NEXTAUTH_SECRET="nuruljannah-secret-key-change-in-production-2026"
NEXT_PUBLIC_SUPABASE_URL="https://plunbdqyoxkygjikjkbi.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGci..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGci..."
NEXT_PUBLIC_MOSQUE_LATITUDE="1.6677856"
NEXT_PUBLIC_MOSQUE_LONGITUDE="101.4760945"
NEXT_PUBLIC_MOSQUE_NAME="Masjid Nurul Jannah"
CRON_SECRET=masjid-nuruljannah-sync-2026
```

Simpan: `Ctrl+O` → Enter → `Ctrl+X`

### Step 3.6 — Build & Deploy

```bash
cd /home/nuruljannah.web.id/app

# Generate Prisma client
npx prisma generate

# Build (ini yang paling lama, ~2-5 menit)
npm run build

# Jalankan deploy script otomatis
bash deploy.sh
```

> [!NOTE]
> Script `deploy.sh` sudah otomatis: copy file ke standalone, restart PM2, dan cek status.

### Step 3.7 — Verifikasi

```bash
# Cek PM2 berjalan
pm2 status nuruljannah

# Cek log (tidak boleh ada error)
pm2 logs nuruljannah --lines 20

# Test response langsung dari Node.js
curl -I http://127.0.0.1:4000
```

Jika output `pm2 status` menampilkan `online` ✅ → lanjut ke Fase 4.

---

## 📋 FASE 4 — Verifikasi Cloudflare

Domain sudah pernah connect ke Cloudflare, jadi kemungkinan besar DNS masih aktif. Cukup verifikasi:

1. Buka [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Pilih domain `nuruljannah.web.id`
3. Pastikan **DNS Records** ada:
   - `@` → Type **A** → IP Server → **Proxied (☁️ oranye)**
   - `www` → Type **A** → IP Server → **Proxied (☁️ oranye)**
4. Cek **SSL/TLS** → pastikan mode **Flexible**

> [!TIP]
> Jika DNS record masih ada dari sebelumnya, tidak perlu diubah apa-apa. Website langsung live setelah PM2 online.

---

## ✅ Test Akhir

```bash
# Dari server atau lokal
curl -I https://nuruljannah.web.id
```

Harus respond `200 OK`. Buka browser → https://nuruljannah.web.id

---

## 🐛 Troubleshooting Cepat

| Masalah | Solusi |
|---------|--------|
| Website `502 Bad Gateway` | PM2 belum jalan atau crash. Jalankan `pm2 logs nuruljannah` |
| PM2 status `errored` | Cek log: `pm2 logs nuruljannah --lines 50` |
| Error `cannot find module` | Ulangi `npm install` dan `npm run build` |
| Login redirect gagal | Pastikan `NEXTAUTH_URL="https://nuruljannah.web.id"` di `.env.local` server |
| Konten lama masih tampil | Clear Cloudflare cache: Dashboard → Caching → Purge Everything |
| Port 4000 sudah dipakai | `sudo lsof -i :4000` → `sudo kill -9 <PID>` |

---

## 📌 Ringkasan Perintah Server (Copy-Paste Ready)

```bash
# Masuk server
ssh kvm1@IP_SERVER -p 5903
sudo su -
cd /home/nuruljannah.web.id/app

# Pull & deploy
git pull origin main
npm install
npx prisma generate
npm run build
bash deploy.sh

# Verifikasi
pm2 status nuruljannah
pm2 logs nuruljannah --lines 10
curl -I http://127.0.0.1:4000
```
