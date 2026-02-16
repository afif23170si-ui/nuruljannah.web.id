# Roadmap Migrasi Website Masjid - SIMPLIFIED VERSION
## Kondisi: No Real Data, Clean Start 🚀

> **Situasi Saat Ini:**
> - ✅ Website sudah live di server pribadi
> - ✅ Workflow: Local → GitHub → SSH git pull
> - ✅ Database: Supabase (local) vs Server Database (production)
> - ✅ Data: Hanya config dasar (jadwal sholat, lokasi) - **BELUM ADA DATA REAL**
> 
> **Kesimpulan:** Ini adalah **GOLDEN OPPORTUNITY** untuk implementasi struktur baru tanpa kompleksitas migrasi data!

---

## 🎯 STRATEGI MIGRASI YANG DISEDERHANAKAN

Karena belum ada data real, kita bisa **skip migrasi data** dan langsung **build struktur baru**!

### Workflow Baru:
```
1. Backup config yang ada (jadwal sholat, lokasi)
2. Build struktur baru di local
3. Test di local sampai stabil
4. Push ke GitHub
5. Pull di server
6. Run migration sekali jalan
7. Restore config yang di-backup
```

**Timeline:** ~8-10 minggu (2-2.5 bulan) - **JAUH LEBIH CEPAT!**

---

## 📋 FASE MIGRASI (6 FASE SAJA)

### **FASE 0: Backup & Preparation** ⏱️ 3 hari

#### Backup Config yang Ada
```bash
# Di server production
cd /path/to/website
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');

async function backup() {
  const data = {
    mosqueProfile: await prisma.mosqueProfile.findFirst(),
    siteSettings: await prisma.siteSettings.findFirst(),
    prayerTimeSetting: await prisma.prayerTimeSetting.findFirst(),
  };
  
  fs.writeFileSync('backup_config.json', JSON.stringify(data, null, 2));
  console.log('✅ Backup saved to backup_config.json');
}

backup();
"
```

#### Setup Development
```bash
# Di local
git checkout -b feature/new-structure
npm install
```

#### Checklist:
- [ ] Backup config production (jadwal sholat, lokasi, profile masjid)
- [ ] Create feature branch
- [ ] Document current database state

---

### **FASE 1: Core Schema Refactor** ⏱️ 1.5 minggu

Langsung implement schema baru tanpa migrasi kompleks.

#### 1.1 New Prisma Schema

```prisma
// schema.prisma - STRUKTUR BARU

// ==========================================
// AUTH & USER MANAGEMENT (UNCHANGED)
// ==========================================
model User {
  id            String    @id @default(cuid())
  name          String
  email         String    @unique
  password      String
  role          UserRole
  isActive      Boolean   @default(true)
  
  // Relations
  articles      Article[]
  transactions  Transaction[]
  serviceRequests ServiceRequest[]
  serviceHistory ServiceStatusHistory[]
  auditLogs     AuditLog[]
  accounts      Account[]
  sessions      Session[]
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  @@map("users")
}

enum UserRole {
  ADMIN
  BENDAHARA
  TAKMIR
  PENGELOLA_PROGRAM
  JAMAAH
}

// NextAuth models (unchanged)
model Account { /* ... existing ... */ }
model Session { /* ... existing ... */ }
model VerificationToken { /* ... existing ... */ }

// ==========================================
// 2. PROFIL MASJID (SIMPLIFIED - MERGE)
// ==========================================
model SiteSettings {
  id              String   @id @default(cuid())
  
  // Profile
  mosqueName      String
  tagline         String?
  description     String?  @db.Text
  address         String?  @db.Text
  village         String?
  district        String?
  city            String?
  province        String?
  postalCode      String?
  
  // Contact
  phone           String?
  email           String?
  whatsapp        String?
  
  // Social Media
  facebook        String?
  instagram       String?
  twitter         String?
  youtube         String?
  
  // Banking
  bankAccounts    Json?    // Array of {bank, accountNumber, accountName}
  
  // Location
  latitude        Float?
  longitude       Float?
  
  // Branding
  logoUrl         String?
  
  // History & Vision
  history         String?  @db.Text
  vision          String?  @db.Text
  mission         String?  @db.Text
  
  updatedAt       DateTime @updatedAt
  
  @@map("site_settings")
}

model DkmMember {
  id          String   @id @default(cuid())
  name        String
  position    String
  photo       String?
  order       Int
  period      String?
  isActive    Boolean  @default(true)
  
  @@map("dkm_members")
}

// ==========================================
// 3. IBADAH MODULE
// ==========================================
model PrayerTimeSetting {
  id              String   @id @default(cuid())
  method          Int      @default(2) // 1-13, see Aladhan API
  latitude        Float
  longitude       Float
  timezone        String   @default("Asia/Jakarta")
  
  // Iqamah offsets (in minutes)
  fajrOffset      Int      @default(10)
  dhuhrOffset     Int      @default(5)
  asrOffset       Int      @default(5)
  maghribOffset   Int      @default(5)
  ishaOffset      Int      @default(10)
  
  updatedAt       DateTime @updatedAt
  
  @@map("prayer_time_settings")
}

model PrayerOfficer {
  id          String   @id @default(cuid())
  name        String
  phone       String?
  role        OfficerRole
  isActive    Boolean  @default(true)
  notes       String?
  
  // Relations
  schedules   OfficerSchedule[]
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@map("prayer_officers")
}

model OfficerSchedule {
  id          String   @id @default(cuid())
  officerId   String
  officer     PrayerOfficer @relation(fields: [officerId], references: [id], onDelete: Cascade)
  
  date        DateTime @db.Date
  prayer      PrayerTime
  role        OfficerRole
  
  notes       String?
  
  @@unique([date, prayer, role])
  @@map("officer_schedules")
}

model Khutbah {
  id          String   @id @default(cuid())
  date        DateTime @db.Date
  khatib      String
  title       String
  theme       String?
  summary     String?  @db.Text
  audioUrl    String?
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@map("khutbah")
}

enum OfficerRole {
  IMAM
  MUADZIN
  KHATIB
}

enum PrayerTime {
  FAJR
  DHUHR
  ASR
  MAGHRIB
  ISHA
  JUMAT
}

// ==========================================
// 4. RAMADHAN CENTER (SEASONAL)
// ==========================================
model RamadhanConfig {
  id              String   @id @default(cuid())
  year            Int      @unique
  hijriYear       Int
  startDate       DateTime @db.Date
  endDate         DateTime @db.Date
  isActive        Boolean  @default(false)
  
  welcomeMessage  String?  @db.Text
  imsakiyahData   Json?    // Array of daily data
  
  // Relations
  tarawihSchedules TarawihSchedule[]
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@map("ramadhan_configs")
}

model TarawihSchedule {
  id            String   @id @default(cuid())
  configId      String
  config        RamadhanConfig @relation(fields: [configId], references: [id], onDelete: Cascade)
  
  date          DateTime @db.Date
  rakaat        Int      @default(8)
  
  // Officers
  imamName      String
  bilalName     String?
  
  // Kultum
  kultumSpeaker String?
  kultumTheme   String?
  kultumAudio   String?
  
  notes         String?
  
  @@unique([configId, date])
  @@map("tarawih_schedules")
}

// ==========================================
// 5. PROGRAM MODULE
// ==========================================
model Program {
  id            String   @id @default(cuid())
  name          String
  slug          String   @unique
  category      ProgramCategory
  description   String?  @db.Text
  
  // Schedule
  schedule      String?  // "Senin-Jumat 16:00-17:30"
  location      String?
  
  // Capacity
  capacity      Int?
  enrolled      Int      @default(0)
  
  // Period
  startDate     DateTime? @db.Date
  endDate       DateTime? @db.Date
  
  // Status
  isActive      Boolean  @default(true)
  registrationOpen Boolean @default(true)
  
  // Seasonal tag (optional)
  seasonalTag   String?  // "RAMADHAN_2026"
  
  // Relations
  instructors   ProgramInstructor[]
  participants  ProgramParticipant[]
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@map("programs")
}

model ProgramInstructor {
  id          String   @id @default(cuid())
  programId   String
  program     Program  @relation(fields: [programId], references: [id], onDelete: Cascade)
  
  name        String
  role        String?  // "Pengajar Utama", "Asisten"
  phone       String?
  email       String?
  photo       String?
  isActive    Boolean  @default(true)
  
  @@map("program_instructors")
}

model ProgramParticipant {
  id              String   @id @default(cuid())
  programId       String
  program         Program  @relation(fields: [programId], references: [id], onDelete: Cascade)
  
  // Personal Info
  name            String
  birthDate       DateTime? @db.Date
  gender          Gender?
  
  // Contact
  phone           String?
  email           String?
  address         String?  @db.Text
  
  // Parent/Guardian (for kids)
  parentName      String?
  parentPhone     String?
  
  // Enrollment
  enrollmentDate  DateTime @default(now())
  status          ParticipantStatus @default(ACTIVE)
  
  // Relations
  attendances     ProgramAttendance[]
  
  notes           String?  @db.Text
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@map("program_participants")
}

model ProgramAttendance {
  id            String   @id @default(cuid())
  participantId String
  participant   ProgramParticipant @relation(fields: [participantId], references: [id], onDelete: Cascade)
  
  date          DateTime @db.Date
  status        AttendanceStatus
  notes         String?
  
  @@unique([participantId, date])
  @@map("program_attendances")
}

enum ProgramCategory {
  PENDIDIKAN      // TPQ, TPA, Tahfidz, Kelas Islam
  SOSIAL          // Santunan, Beasiswa
  KEPEMUDAAN      // Remaja Masjid, Mentoring
  PEMBERDAYAAN    // Pelatihan, Qurban Kolektif
}

enum ParticipantStatus {
  ACTIVE
  INACTIVE
  GRADUATED
  DROPPED
}

enum AttendanceStatus {
  PRESENT
  ABSENT
  SICK
  PERMISSION
  LATE
}

enum Gender {
  MALE
  FEMALE
}

// ==========================================
// 6. AGENDA / EVENT MODULE
// ==========================================
model Event {
  id            String   @id @default(cuid())
  title         String
  slug          String   @unique
  description   String?  @db.Text
  
  category      EventCategory
  
  // Date & Time
  startDate     DateTime
  endDate       DateTime?
  time          String?  // "08:00 - 12:00"
  
  // Location
  location      String?
  
  // Details
  speaker       String?
  organizer     String?
  
  // Registration
  maxParticipants Int?
  registrationLink String?
  
  // Recurrence (for kajian rutin)
  isRecurring   Boolean  @default(false)
  recurrenceRule String? // "WEEKLY:FRI", "MONTHLY:1,15"
  
  // Status
  isActive      Boolean  @default(true)
  
  // Seasonal (optional)
  seasonalTag   String?
  
  // Media
  thumbnail     String?
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@map("events")
}

enum EventCategory {
  // Recurring
  KAJIAN_RUTIN
  
  // One-time (AGENDA)
  TABLIGH_AKBAR
  SEMINAR
  WORKSHOP
  LOMBA
  KAJIAN_SPESIAL
  HARI_BESAR_ISLAM
  PERINGATAN
  
  // Internal
  INTERNAL_DKM
}

// ==========================================
// 7. LAYANAN JAMAAH
// ==========================================
model ServiceRequest {
  id              String   @id @default(cuid())
  type            ServiceType
  status          ServiceStatus @default(PENDING)
  priority        Priority @default(NORMAL)
  
  // Requester
  requesterName   String
  requesterPhone  String
  requesterEmail  String?
  
  // Details (flexible JSON)
  details         Json
  notes           String?  @db.Text
  
  // Scheduling
  preferredDate   DateTime? @db.Date
  scheduledDate   DateTime? @db.Date
  completedDate   DateTime? @db.Date
  
  // Assignment
  assignedTo      String?
  assignee        User?    @relation(fields: [assignedTo], references: [id])
  
  // Tracking
  statusHistory   ServiceStatusHistory[]
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@map("service_requests")
}

model ServiceStatusHistory {
  id          String   @id @default(cuid())
  requestId   String
  request     ServiceRequest @relation(fields: [requestId], references: [id], onDelete: Cascade)
  
  status      ServiceStatus
  notes       String?  @db.Text
  
  changedBy   String
  changer     User     @relation(fields: [changedBy], references: [id])
  changedAt   DateTime @default(now())
  
  @@map("service_status_history")
}

enum ServiceType {
  PENDAFTARAN_NIKAH
  REKOMENDASI_NIKAH
  KONSULTASI_USTADZ
  PERMOHONAN_IMAM
  PERMOHONAN_KHATIB
  PENGADUAN
  SARAN
  LAINNYA
}

enum ServiceStatus {
  PENDING
  REVIEWED
  IN_PROGRESS
  SCHEDULED
  COMPLETED
  REJECTED
  CANCELLED
}

enum Priority {
  LOW
  NORMAL
  HIGH
  URGENT
}

// ==========================================
// 8. ZISWAF (KEUANGAN & DONASI)
// ==========================================
model Transaction {
  id              String   @id @default(cuid())
  
  type            TransactionType
  category        TransactionCategory
  amount          Decimal  @db.Decimal(12, 2)
  date            DateTime @db.Date
  
  description     String?
  
  // Donor Info (untuk income)
  donorName       String?
  donorPhone      String?
  donorEmail      String?
  isAnonymous     Boolean  @default(false)
  
  // Campaign relation
  campaignId      String?
  campaign        Campaign? @relation(fields: [campaignId], references: [id])
  
  // Qurban relation
  qurbanSlotId    String?
  qurbanSlot      QurbanSlot? @relation(fields: [qurbanSlotId], references: [id])
  
  // Payment
  receiptNumber   String?  @unique
  paymentMethod   PaymentMethod?
  proofUrl        String?
  
  // Seasonal (optional)
  seasonalTag     String?  // "RAMADHAN_2026"
  
  notes           String?  @db.Text
  
  createdBy       String
  creator         User     @relation(fields: [createdBy], references: [id])
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@map("transactions")
}

model Campaign {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  description String   @db.Text
  
  goal        Decimal  @db.Decimal(12, 2)
  collected   Decimal  @db.Decimal(12, 2) @default(0)
  
  startDate   DateTime @db.Date
  endDate     DateTime? @db.Date
  
  isActive    Boolean  @default(true)
  isFeatured  Boolean  @default(false)
  
  thumbnail   String?
  
  // Relations
  transactions Transaction[]
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@map("campaigns")
}

model QurbanSlot {
  id          String   @id @default(cuid())
  year        Int
  animalType  AnimalType
  slotNumber  Int      // 1 for kambing, 1-7 for sapi
  totalSlots  Int      // 1 for kambing, 7 for sapi
  price       Decimal  @db.Decimal(12, 2)
  status      SlotStatus @default(AVAILABLE)
  
  // Relations
  participants QurbanParticipant[]
  transactions Transaction[]
  
  @@unique([year, animalType, slotNumber])
  @@map("qurban_slots")
}

model QurbanParticipant {
  id          String   @id @default(cuid())
  slotId      String
  slot        QurbanSlot @relation(fields: [slotId], references: [id], onDelete: Cascade)
  
  name        String
  phone       String
  address     String?  @db.Text
  
  isPaid      Boolean  @default(false)
  paidAmount  Decimal? @db.Decimal(12, 2)
  
  createdAt   DateTime @default(now())
  
  @@map("qurban_participants")
}

enum TransactionType {
  INCOME
  EXPENSE
}

enum TransactionCategory {
  // Income
  ZAKAT_MAAL
  ZAKAT_FITRAH
  FIDYAH
  INFAQ
  SEDEKAH
  WAKAF
  QURBAN
  CAMPAIGN
  KOTAK_AMAL
  TRANSFER
  DONASI
  
  // Expense
  OPERASIONAL
  SOSIAL
  RENOVASI
  PENDIDIKAN
  PROGRAM
  LAINNYA
}

enum PaymentMethod {
  CASH
  TRANSFER
  QRIS
  EWALLET
  OTHER
}

enum AnimalType {
  KAMBING
  SAPI
}

enum SlotStatus {
  AVAILABLE
  RESERVED
  PAID
  FULL
}

// ==========================================
// 9. INFORMASI & MEDIA
// ==========================================
model Article {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  excerpt     String?
  content     String   @db.Text
  
  category    ArticleCategory @default(ARTIKEL)
  
  thumbnail   String?
  
  authorId    String
  author      User     @relation(fields: [authorId], references: [id])
  
  status      ContentStatus @default(DRAFT)
  publishedAt DateTime?
  
  views       Int      @default(0)
  isFeatured  Boolean  @default(false)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@map("articles")
}

enum ArticleCategory {
  ARTIKEL
  BERITA
  TUTORIAL
}

enum ContentStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

model Announcement {
  id          String   @id @default(cuid())
  title       String
  content     String   @db.Text
  type        AnnouncementType @default(INFO)
  
  startDate   DateTime @db.Date
  endDate     DateTime? @db.Date
  
  isActive    Boolean  @default(true)
  priority    Int      @default(0)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@map("announcements")
}

enum AnnouncementType {
  INFO
  WARNING
  URGENT
  PROMO
}

model GalleryAlbum {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  description String?  @db.Text
  coverImage  String?
  
  eventDate   DateTime? @db.Date
  
  images      GalleryImage[]
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@map("gallery_albums")
}

model GalleryImage {
  id          String   @id @default(cuid())
  albumId     String
  album       GalleryAlbum @relation(fields: [albumId], references: [id], onDelete: Cascade)
  
  url         String
  caption     String?
  order       Int      @default(0)
  
  @@map("gallery_images")
}

model MediaFile {
  id              String   @id @default(cuid())
  filename        String
  originalName    String
  fileType        MediaType
  fileSize        Int
  url             String
  
  description     String?
  category        String?
  
  uploadedBy      String
  uploadedAt      DateTime @default(now())
  
  @@map("media_files")
}

enum MediaType {
  PDF
  AUDIO
  VIDEO
  IMAGE
  DOCUMENT
}

// ==========================================
// AUDIT LOG
// ==========================================
model AuditLog {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  
  action      String   // "CREATE_ARTICLE", "DELETE_USER"
  entity      String   // "Article", "User"
  entityId    String?
  
  before      Json?
  after       Json?
  
  ipAddress   String?
  userAgent   String?
  
  createdAt   DateTime @default(now())
  
  @@map("audit_logs")
}
```

#### 1.2 Create Migration
```bash
# Di local
npx prisma migrate dev --name new_structure
```

#### 1.3 Seed Initial Data
```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Restore backed up config
  const backup = require('../backup_config.json');
  
  // Create or update SiteSettings
  await prisma.siteSettings.upsert({
    where: { id: 'default' },
    update: {
      mosqueName: backup.mosqueProfile?.name || 'Masjid Nurul Jannah',
      address: backup.mosqueProfile?.address,
      // ... map other fields
    },
    create: {
      id: 'default',
      mosqueName: 'Masjid Nurul Jannah',
      // ... default values
    }
  });
  
  // Restore prayer time settings
  if (backup.prayerTimeSetting) {
    await prisma.prayerTimeSetting.create({
      data: backup.prayerTimeSetting
    });
  }
  
  console.log('✅ Seed completed');
}

main();
```

#### Checklist:
- [ ] Create new schema.prisma
- [ ] Run migration in local
- [ ] Create seed script
- [ ] Test seed with backed up data
- [ ] Verify all models created

---

### **FASE 2: Build Server Actions** ⏱️ 2 minggu

Karena struktur baru, kita perlu server actions baru.

#### 2.1 Structure
```
src/actions/
├── auth.ts (unchanged)
├── settings.ts (update)
├── ibadah/
│   ├── prayer-times.ts
│   ├── officers.ts
│   └── khutbah.ts
├── ramadhan/
│   ├── config.ts
│   └── tarawih.ts
├── program/
│   ├── programs.ts
│   ├── instructors.ts
│   ├── participants.ts
│   └── attendance.ts
├── agenda/
│   └── events.ts
├── layanan/
│   └── service-requests.ts
├── ziswaf/
│   ├── transactions.ts
│   ├── campaigns.ts
│   └── qurban.ts
└── informasi/
    ├── articles.ts
    ├── announcements.ts
    ├── gallery.ts
    └── media.ts
```

#### 2.2 Example: Program Actions
```typescript
// src/actions/program/programs.ts
"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth-guard";

export async function getPrograms(category?: string) {
  return await prisma.program.findMany({
    where: category ? { category: category as any } : undefined,
    include: {
      instructors: true,
      _count: { select: { participants: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
}

export async function createProgram(data: any) {
  await requireRole(['ADMIN', 'PENGELOLA_PROGRAM']);
  
  const program = await prisma.program.create({
    data: {
      ...data,
      slug: slugify(data.name),
    }
  });
  
  revalidatePath('/admin/program');
  return program;
}

// ... dst
```

#### Checklist:
- [ ] Create action files for all modules
- [ ] Implement CRUD operations
- [ ] Add role-based guards
- [ ] Add revalidation
- [ ] Test all actions

---

### **FASE 3: Build Admin Pages** ⏱️ 3 minggu

Admin panel untuk manage semua modul.

#### 3.1 Admin Layout Update
```typescript
// components/admin/Sidebar.tsx
const ADMIN_NAV = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/admin',
    roles: ['ADMIN', 'BENDAHARA', 'TAKMIR', 'PENGELOLA_PROGRAM']
  },
  {
    label: 'Ibadah',
    icon: Mosque,
    submenu: [
      { label: 'Pengaturan Waktu', href: '/admin/ibadah/settings' },
      { label: 'Petugas', href: '/admin/ibadah/officers' },
      { label: 'Jadwal Petugas', href: '/admin/ibadah/schedules' },
      { label: 'Khutbah Jumat', href: '/admin/ibadah/khutbah' },
    ],
    roles: ['ADMIN', 'TAKMIR']
  },
  {
    label: 'Ramadhan',
    icon: Moon,
    submenu: [
      { label: 'Konfigurasi', href: '/admin/ramadhan/config' },
      { label: 'Tarawih', href: '/admin/ramadhan/tarawih' },
    ],
    roles: ['ADMIN', 'TAKMIR'],
    conditional: async () => {
      const config = await getRamadhanConfig();
      return config?.isActive;
    }
  },
  {
    label: 'Program',
    icon: GraduationCap,
    href: '/admin/program',
    roles: ['ADMIN', 'PENGELOLA_PROGRAM']
  },
  {
    label: 'Agenda',
    icon: Calendar,
    href: '/admin/agenda',
    roles: ['ADMIN', 'TAKMIR']
  },
  {
    label: 'Layanan',
    icon: Headphones,
    href: '/admin/layanan',
    roles: ['ADMIN', 'TAKMIR']
  },
  {
    label: 'ZISWAF',
    icon: Wallet,
    submenu: [
      { label: 'Transaksi', href: '/admin/ziswaf/transactions' },
      { label: 'Campaign', href: '/admin/ziswaf/campaigns' },
      { label: 'Qurban', href: '/admin/ziswaf/qurban' },
      { label: 'Laporan', href: '/admin/ziswaf/reports' },
    ],
    roles: ['ADMIN', 'BENDAHARA']
  },
  {
    label: 'Informasi',
    icon: FileText,
    submenu: [
      { label: 'Pengumuman', href: '/admin/informasi/announcements' },
      { label: 'Artikel', href: '/admin/informasi/articles' },
      { label: 'Galeri', href: '/admin/informasi/gallery' },
      { label: 'Media', href: '/admin/informasi/media' },
    ],
    roles: ['ADMIN', 'TAKMIR']
  },
  {
    label: 'Users',
    icon: Users,
    href: '/admin/users',
    roles: ['ADMIN']
  },
  {
    label: 'Pengaturan',
    icon: Settings,
    href: '/admin/settings',
    roles: ['ADMIN']
  },
];
```

#### 3.2 Build Pages
```
app/admin/
├── page.tsx (dashboard)
├── ibadah/
│   ├── settings/page.tsx
│   ├── officers/page.tsx
│   ├── schedules/page.tsx
│   └── khutbah/page.tsx
├── ramadhan/
│   ├── config/page.tsx
│   └── tarawih/page.tsx
├── program/
│   ├── page.tsx
│   ├── new/page.tsx
│   ├── [id]/page.tsx
│   ├── [id]/instructors/page.tsx
│   ├── [id]/participants/page.tsx
│   └── [id]/attendance/page.tsx
├── agenda/
│   ├── page.tsx
│   ├── new/page.tsx
│   └── [id]/page.tsx
├── layanan/
│   ├── page.tsx
│   └── [id]/page.tsx
├── ziswaf/
│   ├── transactions/page.tsx
│   ├── campaigns/page.tsx
│   ├── qurban/page.tsx
│   └── reports/page.tsx
└── informasi/
    ├── announcements/page.tsx
    ├── articles/page.tsx
    ├── gallery/page.tsx
    └── media/page.tsx
```

#### Checklist:
- [ ] Update sidebar
- [ ] Build all admin pages
- [ ] Implement CRUD forms
- [ ] Add role-based access control
- [ ] Test all workflows

---

### **FASE 4: Build Public Pages** ⏱️ 2 minggu

User-facing pages.

#### 4.1 New Navigation
```typescript
// components/layout/Header.tsx
const PUBLIC_NAV = [
  { label: 'Beranda', href: '/' },
  {
    label: 'Profil',
    submenu: [
      { label: 'Tentang', href: '/profil' },
      { label: 'Visi Misi', href: '/profil#visi-misi' },
      { label: 'Struktur DKM', href: '/profil#struktur' },
      { label: 'Fasilitas', href: '/profil#fasilitas' },
    ]
  },
  {
    label: 'Ibadah',
    submenu: [
      { label: 'Jadwal Sholat', href: '/ibadah/jadwal' },
      { label: 'Petugas', href: '/ibadah/petugas' },
      { label: 'Khutbah Jumat', href: '/ibadah/khutbah' },
      { label: 'Kajian Rutin', href: '/ibadah/kajian' },
    ]
  },
  // Conditional
  {
    label: 'Ramadhan',
    href: '/ramadhan',
    conditional: true
  },
  { label: 'Program', href: '/program' },
  { label: 'Agenda', href: '/agenda' },
  {
    label: 'Layanan',
    submenu: [
      { label: 'Pendaftaran Nikah', href: '/layanan/nikah' },
      { label: 'Konsultasi', href: '/layanan/konsultasi' },
      { label: 'Imam & Khatib', href: '/layanan/imam-khatib' },
      { label: 'Pengaduan', href: '/layanan/pengaduan' },
    ]
  },
  {
    label: 'ZISWAF',
    submenu: [
      { label: 'Donasi Sekarang', href: '/ziswaf' },
      { label: 'Zakat', href: '/ziswaf/zakat' },
      { label: 'Qurban', href: '/ziswaf/qurban' },
      { label: 'Campaign', href: '/ziswaf/campaign' },
      { label: 'Laporan', href: '/ziswaf/laporan' },
    ]
  },
  {
    label: 'Informasi',
    submenu: [
      { label: 'Pengumuman', href: '/informasi/pengumuman' },
      { label: 'Artikel', href: '/informasi/artikel' },
      { label: 'Galeri', href: '/informasi/galeri' },
    ]
  },
];
```

#### 4.2 Build Pages
```
app/(public)/
├── page.tsx (beranda - aggregator)
├── profil/page.tsx
├── ibadah/
│   ├── page.tsx
│   ├── jadwal/page.tsx
│   ├── petugas/page.tsx
│   ├── khutbah/page.tsx
│   └── kajian/page.tsx
├── ramadhan/
│   ├── page.tsx
│   ├── imsakiyah/page.tsx
│   ├── tarawih/page.tsx
│   ├── kegiatan/page.tsx
│   └── zakat/page.tsx
├── program/
│   ├── page.tsx
│   ├── [slug]/page.tsx
│   └── kategori/[category]/page.tsx
├── agenda/
│   ├── page.tsx
│   └── [slug]/page.tsx
├── layanan/
│   ├── page.tsx
│   ├── nikah/page.tsx
│   ├── konsultasi/page.tsx
│   ├── imam-khatib/page.tsx
│   ├── pengaduan/page.tsx
│   └── status/[id]/page.tsx
├── ziswaf/
│   ├── page.tsx
│   ├── zakat/page.tsx
│   ├── infaq/page.tsx
│   ├── wakaf/page.tsx
│   ├── qurban/page.tsx
│   ├── campaign/[slug]/page.tsx
│   └── laporan/page.tsx
└── informasi/
    ├── pengumuman/page.tsx
    ├── artikel/
    │   ├── page.tsx
    │   └── [slug]/page.tsx
    └── galeri/
        ├── page.tsx
        └── [slug]/page.tsx
```

#### Checklist:
- [ ] Update header navigation
- [ ] Build all public pages
- [ ] Make responsive
- [ ] Add SEO metadata
- [ ] Test user flows

---

### **FASE 5: Testing & Optimization** ⏱️ 1 minggu

#### 5.1 Testing Checklist
```
□ Functional Testing
  □ All CRUD operations work
  □ Forms validate correctly
  □ File uploads work
  □ Search & filters work

□ Role-Based Access
  □ ADMIN can access everything
  □ BENDAHARA only sees ZISWAF
  □ TAKMIR sees correct modules
  □ PENGELOLA_PROGRAM sees Program only
  □ Unauthorized access blocked

□ User Experience
  □ Navigation is intuitive
  □ Forms have good UX
  □ Error messages are clear
  □ Loading states work

□ Mobile Responsive
  □ All pages work on mobile
  □ Forms usable on mobile
  □ Tables responsive

□ Performance
  □ Pages load fast
  □ Images optimized
  □ Queries efficient
```

#### 5.2 Optimization
```typescript
// Add caching where appropriate
import { unstable_cache } from 'next/cache';

export const getPrayerTimesToday = unstable_cache(
  async () => {
    // ... query
  },
  ['prayer-times-today'],
  { revalidate: 3600 } // 1 hour
);
```

#### Checklist:
- [ ] Test all features
- [ ] Fix bugs
- [ ] Optimize queries
- [ ] Add loading states
- [ ] Improve error handling

---

### **FASE 6: Deployment** ⏱️ 3 hari

#### 6.1 Pre-deployment
```bash
# Di local - final check
npm run build
npm run start # test production build

# Check migration files
ls prisma/migrations/
```

#### 6.2 Deployment Steps
```bash
# 1. Push to GitHub
git add .
git commit -m "feat: implement new structure"
git push origin feature/new-structure

# Create PR & merge to main after review

# 2. SSH ke server
ssh user@your-server.com
cd /path/to/website

# 3. Pull latest code
git pull origin main

# 4. Install dependencies
npm install

# 5. Run migration
npx prisma migrate deploy

# 6. Seed data (restore config)
npx prisma db seed

# 7. Build
npm run build

# 8. Restart (jika pakai PM2)
pm2 restart nuruljannah

# Atau restart service
sudo systemctl restart nuruljannah
```

#### 6.3 Post-deployment Verification
```bash
# Check logs
pm2 logs nuruljannah
# atau
journalctl -u nuruljannah -f

# Test critical endpoints
curl https://your-domain.com/
curl https://your-domain.com/api/health
```

#### 6.4 Smoke Test Checklist
```
□ Website loads
□ Login works
□ Admin dashboard loads
□ Prayer times display
□ Create test program
□ Create test transaction
□ Upload image to gallery
□ Submit service request
```

#### Checklist:
- [ ] Backup production database
- [ ] Push to GitHub
- [ ] Pull in server
- [ ] Run migrations
- [ ] Restore config
- [ ] Build & restart
- [ ] Smoke test
- [ ] Monitor for 24h

---

## 📋 QUICK REFERENCE

### Git Workflow
```bash
# Development
git checkout -b feature/module-name
# ... work ...
git add .
git commit -m "feat: description"
git push origin feature/module-name

# Deployment
git checkout main
git merge feature/module-name
git push origin main

# Server
ssh user@server
cd /path/to/website
git pull origin main
npm install
npx prisma migrate deploy
npm run build
pm2 restart nuruljannah
```

### Database Management
```bash
# Local
npx prisma migrate dev --name migration_name
npx prisma db seed
npx prisma studio # browse database

# Production
npx prisma migrate deploy
npx prisma db seed
```

### Debugging
```bash
# Check logs
pm2 logs nuruljannah

# Check database connection
npx prisma db pull

# Check migrations
npx prisma migrate status
```

---

## 🎯 SUCCESS METRICS

| Metric | Target |
|--------|--------|
| Migration Time | 8-10 weeks |
| Zero Downtime | ✅ |
| Data Loss | 0% |
| All Features Work | 100% |
| Mobile Responsive | 100% |
| Page Load Time | < 2s |

---

## 💡 TIPS PENTING

1. **Commit Often**
   ```bash
   # Good practice
   git add .
   git commit -m "feat(ibadah): add prayer officer CRUD"
   ```

2. **Test in Local First**
   - Build locally: `npm run build`
   - Test production mode: `npm run start`
   - Fix issues before pushing

3. **Incremental Deployment**
   - Deploy per module
   - Don't deploy everything at once
   - Test each deployment

4. **Keep Backups**
   - Backup before each major change
   - Keep at least 3 backups
   - Test restore procedure

5. **Monitor After Deployment**
   - Check logs for 24 hours
   - Watch for errors
   - Be ready to rollback

---

## 📞 TROUBLESHOOTING

### Migration Fails
```bash
# Reset migration (local only!)
npx prisma migrate reset

# If production migration fails
# 1. Don't panic
# 2. Check error message
# 3. Fix schema
# 4. Create new migration
npx prisma migrate dev --name fix_migration
```

### Build Fails
```bash
# Clear cache
rm -rf .next
npm run build

# Check for TypeScript errors
npm run type-check
```

### Site Not Loading After Deployment
```bash
# Check if process running
pm2 status

# Restart
pm2 restart nuruljannah

# Check logs
pm2 logs nuruljannah --lines 100
```

---

## ✅ FINAL CHECKLIST

Pre-deployment:
- [ ] All features tested locally
- [ ] Production build successful
- [ ] Database backup created
- [ ] Migration files ready
- [ ] Seed script ready

Deployment:
- [ ] Code pushed to GitHub
- [ ] Pulled in server
- [ ] Dependencies installed
- [ ] Migrations run successfully
- [ ] Seed completed
- [ ] Build completed
- [ ] Service restarted

Post-deployment:
- [ ] Website loads
- [ ] Login works
- [ ] All modules accessible
- [ ] No errors in logs
- [ ] Mobile responsive working

---

**Timeline:** 8-10 minggu (2-2.5 bulan)

**Status:** Ready to start! 🚀

**Catatan:** Karena belum ada data real, migrasi ini jadi jauh lebih simple. Kamu bisa langsung implement struktur baru tanpa khawatir data loss!
