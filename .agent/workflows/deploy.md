---
description: Deploy website to Vercel with custom domain
---

# Deploy Website to Vercel

Workflow untuk deploy website Masjid Nurul Jannah ke Vercel dengan domain custom nuruljannah.web.id.

## Prerequisites
- Code sudah di-commit dan push ke GitHub repository
- Sudah punya akun Vercel (atau siap untuk sign up)
- Sudah punya domain nuruljannah.web.id dengan akses ke DNS management

## Step 1: Pastikan Code Terbaru di GitHub

// turbo
```bash
cd /Applications/MAMP/htdocs/nuruljannah
git status
```

Jika ada perubahan yang belum di-commit:
```bash
git add .
git commit -m "Ready for production deployment"
git push origin main
```

## Step 2: Setup Vercel

1. **Buat Akun Vercel** (jika belum punya)
   - Buka: https://vercel.com/signup
   - Pilih "Continue with GitHub"
   - Login dengan akun GitHub
   - Authorize Vercel

2. **Import Repository**
   - Di Vercel Dashboard, klik "Add New..." → "Project"
   - Klik "Import Git Repository"
   - Cari: `afif23170si-ui/nuruljannah.web.id`
   - Klik "Import"

3. **Configure Project**
   - Project Name: `nuruljannah`
   - Framework: Next.js (auto-detected)
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Install Command: `npm install`

4. **Add Environment Variables**
   - Klik "Environment Variables"
   - Add variabel berikut (jika ada file .env.local):
     ```
     DATABASE_URL=<your-database-url>
     AUTH_SECRET=<generate-random-string>
     AUTH_TRUST_HOST=true
     ```
   
   ⚠️ **PENTING**: Jangan lupa AUTH_TRUST_HOST=true untuk production!

5. **Deploy**
   - Klik "Deploy"
   - Tunggu build selesai (2-5 menit)
   - Website akan dapat diakses di: `nuruljannah.vercel.app`

## Step 3: Verifikasi Deployment

1. Buka: `https://nuruljannah.vercel.app`
2. Test:
   - ✅ Homepage loading
   - ✅ Prayer times widget berfungsi
   - ✅ Navigasi berfungsi
   - ✅ Responsive di mobile

## Step 4: Setup Custom Domain

1. **Di Vercel Dashboard**
   - Buka project → "Settings" → "Domains"
   - Masukkan: `nuruljannah.web.id`
   - Klik "Add"
   - Catat DNS records yang ditampilkan

2. **Configure DNS di Domain Provider**
   - Login ke domain provider (tempat beli nuruljannah.web.id)
   - Buka DNS Management
   - Tambah/Edit records:
     ```
     Type: A
     Name: @
     Value: 76.76.21.21
     
     Type: CNAME
     Name: www
     Value: cname.vercel-dns.com
     ```
   - Save changes

3. **Tunggu DNS Propagation**
   - Biasanya 5-30 menit
   - Check di: https://dnschecker.org
   - Vercel akan auto-verify dan setup SSL

## Step 5: Verifikasi Domain Live

1. Buka: `https://nuruljannah.web.id`
2. Pastikan:
   - ✅ HTTPS aktif (lock icon)
   - ✅ Website loading dari domain custom
   - ✅ Redirect dari www ke non-www

## 🎉 Done!

Website sekarang LIVE di https://nuruljannah.web.id

**Auto-Deployment:**
Setiap kali push ke GitHub main branch, Vercel akan otomatis deploy update terbaru!

## Troubleshooting

### Build Failed
- Check Vercel deployment logs
- Pastikan environment variables sudah di-set
- Test build di local: `npm run build`

### Domain tidak bisa diakses
- Check DNS di https://dnschecker.org
- Tunggu 24-48 jam untuk full propagation
- Flush DNS di Mac:
  ```bash
  sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
  ```

### SSL Certificate Error
- Tunggu 5-10 menit setelah DNS configured
- Check di Vercel Settings → Domains untuk status
