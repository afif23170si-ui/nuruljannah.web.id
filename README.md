# 🕌 Masjid Nurul Jannah — Website Resmi

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=for-the-badge&logo=prisma)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=for-the-badge&logo=tailwindcss)

**Platform manajemen masjid digital yang lengkap — jadwal sholat, keuangan, TPA/TPQ, galeri, dan konten berbasis peran.**

🌐 **Live:** [https://nuruljannah.web.id](https://nuruljannah.web.id)

</div>

---

## 📋 Daftar Isi

- [Tentang Project](#-tentang-project)
- [Fitur Utama](#-fitur-utama)
- [Tech Stack](#-tech-stack)
- [Struktur Project](#-struktur-project)
- [Prasyarat](#-prasyarat)
- [Instalasi & Setup Lokal](#-instalasi--setup-lokal)
- [Konfigurasi Environment](#-konfigurasi-environment)
- [Database](#-database)
- [Peran Pengguna (Role)](#-peran-pengguna-role)
- [API Endpoints](#-api-endpoints)
- [Deployment](#-deployment)
- [Scripts](#-scripts)

---

## 🌟 Tentang Project

**Website Masjid Nurul Jannah** adalah platform digital terintegrasi yang dirancang khusus untuk kebutuhan manajemen masjid modern. Dibangun dengan teknologi terkini (Next.js 16, React 19, TypeScript), platform ini memungkinkan pengurus masjid untuk mengelola seluruh aspek operasional secara digital — mulai dari jadwal sholat, keuangan transparan, hingga manajemen santri TPA/TPQ.

Sistem ini menerapkan **role-based access control (RBAC)** sehingga setiap pengurus hanya dapat mengakses fitur sesuai wewenangnya.

---

## ✨ Fitur Utama

### 🌐 Portal Publik
| Fitur | Keterangan |
|-------|-----------|
| **Beranda** | Informasi utama masjid, waktu sholat hari ini, pengumuman |
| **Jadwal Sholat** | Waktu sholat & iqamah otomatis via API myQuran (KEMENAG) + kalender Hijriah |
| **Ibadah** | Jadwal imam & muadzin, jadwal khutbah Jum'at |
| **Agenda Masjid** | Event rutin dan event khusus (kajian, program sosial, dll.) |
| **Artikel & Berita** | Konten islami: artikel, berita, kajian, khutbah, pengumuman |
| **Keuangan Publik** | Laporan keuangan transparan (pemasukan & pengeluaran masjid) |
| **ZISWAF** | Informasi zakat, infaq, sedekah, dan wakaf |
| **Galeri** | Album foto kegiatan masjid |
| **TPA/TPQ** | Informasi program pendidikan Al-Qur'an |
| **Profil Masjid** | Sejarah, visi-misi, struktur DKM, dan lokasi |

### 🔐 Panel Admin
| Modul | Fitur |
|-------|-------|
| **Dashboard** | Ringkasan statistik: keuangan, jamaah, artikel, santri |
| **Manajemen Artikel** | Buat, edit, publish artikel dengan rich text editor (Tiptap) |
| **Keuangan** | Input pemasukan/pengeluaran, manajemen dana, laporan |
| **Jadwal Ibadah** | Atur jadwal imam, muadzin, dan khutbah |
| **Kajian** | Jadwal kajian rutin dan speaker |
| **Pengumuman** | Buat & kelola banner pengumuman (INFO/WARNING/URGENT) |
| **TPA/TPQ** | Manajemen kelas, guru, santri, dan absensi |
| **Galeri** | Upload & kelola foto per album via Supabase Storage |
| **Donasi** | Rekap data donatur |
| **DKM** | Manajemen struktur & anggota DKM |
| **Pengguna** | Manajemen akun pengurus |
| **Pengaturan** | Profil masjid, rekening bank, QRIS, sosial media |

---

## 🛠 Tech Stack

### Frontend
- **[Next.js 16](https://nextjs.org/)** — React framework dengan App Router
- **[React 19](https://react.dev/)** — UI library terbaru
- **[TypeScript 5](https://www.typescriptlang.org/)** — Static typing
- **[Tailwind CSS 4](https://tailwindcss.com/)** — Utility-first CSS
- **[Tiptap](https://tiptap.dev/)** — Rich text editor untuk konten artikel
- **[Framer Motion](https://www.framer.com/motion/)** — Animasi UI
- **[Recharts](https://recharts.org/)** — Grafik keuangan
- **[Lucide React](https://lucide.dev/)** — Icon library
- **[React Hook Form](https://react-hook-form.com/)** + **[Zod](https://zod.dev/)** — Form & validasi
- **[Radix UI](https://www.radix-ui.com/)** — Komponen UI accessible
- **[Sonner](https://sonner.emilkowal.ski/)** — Toast notifications

### Backend & Database
- **[Prisma ORM 5](https://www.prisma.io/)** — Type-safe database client
- **[Supabase](https://supabase.com/)** — PostgreSQL database & file storage
- **[Neon Serverless](https://neon.tech/)** — Serverless PostgreSQL adapter
- **[NextAuth.js v5](https://authjs.dev/)** — Autentikasi session-based
- **[bcryptjs](https://github.com/dcodeIO/bcrypt.js)** — Hash password

### Deployment & Infrastructure
- **[PM2](https://pm2.keymetrics.io/)** — Process manager (production)
- **Next.js Standalone** — Output mode untuk server deployment
- **GitHub Actions** — CI/CD pipeline otomatis
- **CyberPanel + Cloudflare** — Web server & CDN

---

## 📁 Struktur Project

```
nuruljannah/
├── prisma/
│   ├── schema.prisma          # Skema database lengkap
│   ├── seed.ts                # Seed data utama
│   └── seed-dkm.ts            # Seed data DKM
│
├── src/
│   ├── app/
│   │   ├── (public)/          # Halaman publik (tanpa auth)
│   │   │   ├── page.tsx       # Beranda
│   │   │   ├── ibadah/        # Jadwal ibadah & sholat
│   │   │   ├── agenda/        # Agenda & event masjid
│   │   │   ├── artikel/       # Artikel & berita
│   │   │   ├── galeri/        # Galeri foto
│   │   │   ├── keuangan/      # Laporan keuangan publik
│   │   │   ├── ziswaf/        # Info ZISWAF
│   │   │   ├── tpa/           # Info TPA/TPQ
│   │   │   ├── profil/        # Profil masjid & DKM
│   │   │   ├── infaq/         # Donasi & infaq
│   │   │   └── login/         # Halaman login admin
│   │   │
│   │   ├── admin/             # Panel admin (butuh auth)
│   │   │   ├── page.tsx       # Dashboard admin
│   │   │   ├── artikel/       # Manajemen artikel
│   │   │   ├── keuangan/      # Manajemen keuangan
│   │   │   ├── kajian/        # Jadwal kajian
│   │   │   ├── ibadah/        # Jadwal imam & muadzin
│   │   │   ├── pengumuman/    # Manajemen pengumuman
│   │   │   ├── tpa/           # Manajemen TPA/TPQ
│   │   │   ├── gallery/       # Manajemen galeri
│   │   │   ├── donasi/        # Data donasi
│   │   │   ├── dkm/           # Manajemen DKM
│   │   │   ├── users/         # Manajemen pengguna
│   │   │   ├── funds/         # Manajemen dana
│   │   │   └── settings/      # Pengaturan situs
│   │   │
│   │   └── api/
│   │       ├── auth/          # NextAuth endpoints
│   │       ├── prayer-sync/   # Cron sync jadwal sholat
│   │       └── prayer-today/  # Endpoint jadwal sholat hari ini
│   │
│   ├── components/
│   │   ├── admin/             # Komponen khusus admin
│   │   ├── home/              # Komponen beranda
│   │   ├── ibadah/            # Komponen jadwal ibadah
│   │   ├── public/            # Komponen halaman publik
│   │   ├── layout/            # Navbar, Footer, Sidebar
│   │   └── ui/                # Komponen UI reusable (shadcn-style)
│   │
│   ├── actions/               # Server Actions (Next.js)
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utilities (prisma, auth, supabase)
│   └── types/                 # TypeScript types & interfaces
│
├── public/                    # Aset statis (gambar, ikon)
├── deploy.sh                  # Script deployment ke server
├── ecosystem.config.js        # Konfigurasi PM2
├── server-wrapper.js          # Wrapper server standalone
├── next.config.ts             # Konfigurasi Next.js
└── .env.local                 # Environment variables (lokal)
```

---

## ✅ Prasyarat

Pastikan perangkat Anda sudah terinstal:

- **Node.js** `>= 20.x` — [Download](https://nodejs.org/)
- **npm** `>= 10.x` (bundled dengan Node.js)
- **Git** — [Download](https://git-scm.com/)
- Akun **Supabase** — [supabase.com](https://supabase.com) (database & storage)

---

## 🚀 Instalasi & Setup Lokal

### 1. Clone Repository

```bash
git clone https://github.com/your-username/nuruljannah.git
cd nuruljannah
```

### 2. Install Dependencies

```bash
npm install
```

> Perintah `postinstall` akan otomatis menjalankan `prisma generate`.

### 3. Konfigurasi Environment

Salin file contoh environment dan isi dengan nilai yang sesuai:

```bash
cp .env.local.example .env.local
```

Lihat bagian [Konfigurasi Environment](#-konfigurasi-environment) untuk detail lengkap.

### 4. Setup Database

```bash
# Push schema ke database
npm run db:push

# (Opsional) Jalankan seed data awal
npm run db:seed
```

### 5. Jalankan Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

**Akses Admin Panel:** [http://localhost:3000/admin](http://localhost:3000/admin)

---

## ⚙️ Konfigurasi Environment

Buat file `.env.local` di root project dengan variabel berikut:

```env
# ==========================================
# DATABASE — Supabase PostgreSQL
# ==========================================

# Session Pooler (untuk runtime/query)
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/postgres?pgbouncer=true"

# Direct Connection (untuk migrasi Prisma)
DIRECT_URL="postgresql://USER:PASSWORD@HOST:5432/postgres"

# ==========================================
# NEXTAUTH.JS — Autentikasi
# ==========================================

NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-random-secret-key-min-32-chars"

# ==========================================
# SUPABASE — Storage & Database
# ==========================================

NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"

# ==========================================
# LOKASI MASJID — Untuk Jadwal Sholat
# ==========================================

NEXT_PUBLIC_MOSQUE_LATITUDE="1.6677856"
NEXT_PUBLIC_MOSQUE_LONGITUDE="101.4760945"
NEXT_PUBLIC_MOSQUE_NAME="Masjid Nurul Jannah"

# ==========================================
# CRON — Sinkronisasi Jadwal Sholat
# ==========================================

CRON_SECRET="your-cron-secret-key"
```

### Cara Mendapatkan Konfigurasi Supabase

1. Login ke [supabase.com](https://supabase.com) → buka project Anda
2. Pergi ke **Settings → Database** untuk mendapatkan `DATABASE_URL` dan `DIRECT_URL`
3. Pergi ke **Settings → API** untuk mendapatkan `SUPABASE_URL`, `ANON_KEY`, dan `SERVICE_ROLE_KEY`

> ⚠️ **Jangan commit** file `.env.local` ke repository. File ini sudah terdaftar di `.gitignore`.

---

## 🗄️ Database

Project ini menggunakan **PostgreSQL** via **Supabase** dengan **Prisma ORM**.

### Model Utama

| Model | Keterangan |
|-------|-----------|
| `User` | Akun pengguna/pengurus masjid |
| `Post` | Artikel, berita, kajian, khutbah |
| `Finance` | Pencatatan pemasukan & pengeluaran |
| `Fund` | Jenis-jenis dana (Kas Umum, Zakat, Wakaf, dll.) |
| `MosqueEvent` | Event & agenda masjid |
| `KajianSchedule` | Jadwal kajian rutin |
| `DailyPrayerTime` | Data waktu sholat harian (dari API myQuran) |
| `PrayerTimeSetting` | Konfigurasi lokasi & offset iqamah |
| `PrayerOfficer` | Data imam & muadzin |
| `OfficerSchedule` | Jadwal petugas per waktu sholat |
| `Khutbah` | Arsip rekaman khutbah Jum'at |
| `TpaTeacher` | Data guru TPA/TPQ |
| `TpaStudent` | Data santri TPA/TPQ |
| `TpaClass` | Kelas TPA/TPQ |
| `TpaAttendance` | Absensi santri |
| `GalleryAlbum` | Album foto |
| `GalleryImage` | Foto dalam album |
| `Announcement` | Pengumuman/banner |
| `DkmMember` | Anggota DKM |
| `SiteSettings` | Pengaturan situs (profil, kontak, rekening) |
| `AuditLog` | Log aktivitas admin |

### Perintah Database

```bash
# Push schema ke database (tanpa migrasi)
npm run db:push

# Jalankan seed data
npm run db:seed

# Buka Prisma Studio (GUI database)
npm run db:studio
```

---

## 👥 Peran Pengguna (Role)

Sistem menggunakan **Role-Based Access Control (RBAC)** dengan 5 tingkatan:

| Role | Hak Akses |
|------|-----------|
| `ADMIN` | Akses penuh ke semua fitur & pengaturan |
| `BENDAHARA` | Manajemen keuangan, dana, dan laporan finansial |
| `TAKMIR` | Konten artikel, pengumuman, jadwal ibadah, kajian |
| `PENGELOLA_TPA` | Manajemen TPA: kelas, guru, santri, absensi |
| `JAMAAH` | Akses read-only (login tanpa akses admin panel) |

---

## 🔌 API Endpoints

| Endpoint | Method | Keterangan |
|----------|--------|-----------|
| `/api/auth/[...nextauth]` | GET/POST | NextAuth.js authentication handler |
| `/api/prayer-today` | GET | Jadwal sholat hari ini |
| `/api/prayer-sync` | POST | Sinkronisasi data jadwal sholat dari myQuran API |

> **Keamanan:** Endpoint `/api/prayer-sync` dilindungi dengan `CRON_SECRET` di header `Authorization`.

---

## 🚢 Deployment

### Deployment ke Server (Via SSH + PM2)

Project dikonfigurasi untuk deployment ke **private server** menggunakan PM2.

#### Menggunakan Script Otomatis

```bash
bash deploy.sh
```

Script ini akan:
1. `git pull origin main` — Tarik kode terbaru
2. `npm install` — Install dependencies
3. `npx prisma generate` — Generate Prisma client
4. `npm run build` — Build Next.js (standalone mode)
5. Salin file statis ke direktori standalone
6. Restart PM2 via `ecosystem.config.js`

#### Konfigurasi PM2 (`ecosystem.config.js`)

```js
{
  name: "nuruljannah",
  script: ".next/standalone/server-wrapper.js",
  cwd: "/home/nuruljannah.web.id/app",
  env: {
    NODE_ENV: "production",
    PORT: 4000,
    HOSTNAME: "0.0.0.0"
  },
  max_memory_restart: "512M"
}
```

#### Perintah PM2 Manual

```bash
# Start aplikasi
pm2 start ecosystem.config.js

# Restart aplikasi
pm2 restart nuruljannah

# Cek status
pm2 status nuruljannah

# Lihat log
pm2 logs nuruljannah

# Simpan konfigurasi PM2
pm2 save
```

### Deployment Otomatis (GitHub Actions)

Project mendukung CI/CD otomatis via **GitHub Actions**. Push ke branch `main` akan memicu proses deployment ke server secara otomatis.

Konfigurasi terdapat di `.github/` directory.

---

## 📜 Scripts

| Script | Perintah | Keterangan |
|--------|----------|-----------|
| Dev server | `npm run dev` | Jalankan server development |
| Build | `npm run build` | Build untuk production |
| Start | `npm run start` | Jalankan server production |
| Lint | `npm run lint` | Cek kualitas kode dengan ESLint |
| DB Push | `npm run db:push` | Terapkan schema Prisma ke database |
| DB Seed | `npm run db:seed` | Isi database dengan data awal |
| DB Studio | `npm run db:studio` | Buka Prisma Studio (GUI database) |

---

## 🗺️ Roadmap

- [ ] Notifikasi push waktu sholat (PWA)
- [ ] Fitur donasi online dengan payment gateway
- [ ] Laporan keuangan PDF export
- [ ] Aplikasi mobile (React Native)
- [ ] Integrasi live streaming kajian

---

## 📄 Lisensi

Project ini bersifat **private** dan dikembangkan khusus untuk **Masjid Nurul Jannah**.  
Hak cipta © 2026 Masjid Nurul Jannah. Seluruh hak dilindungi.

---

<div align="center">

Dikembangkan dengan ❤️ untuk kemajuan Masjid Nurul Jannah

🌐 [nuruljannah.web.id](https://nuruljannah.web.id)

</div>
