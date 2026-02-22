import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Create Admin User
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@nuruljannah.web.id" },
    update: {},
    create: {
      name: "Administrator",
      email: "admin@nuruljannah.web.id",
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log("✅ Admin user created:", admin.email);

  // Create Bendahara User
  const bendaharaPassword = await bcrypt.hash("bendahara123", 10);
  const bendahara = await prisma.user.upsert({
    where: { email: "bendahara@nuruljannah.web.id" },
    update: {},
    create: {
      name: "Bendahara Masjid",
      email: "bendahara@nuruljannah.web.id",
      password: bendaharaPassword,
      role: "BENDAHARA",
    },
  });
  console.log("✅ Bendahara user created:", bendahara.email);

  // Create Takmir User
  const takmirPassword = await bcrypt.hash("takmir123", 10);
  const takmir = await prisma.user.upsert({
    where: { email: "takmir@nuruljannah.web.id" },
    update: {},
    create: {
      name: "Takmir Masjid",
      email: "takmir@nuruljannah.web.id",
      password: takmirPassword,
      role: "TAKMIR",
    },
  });
  console.log("✅ Takmir user created:", takmir.email);

  // Create Pengelola TPA User
  const tpaPassword = await bcrypt.hash("tpa123", 10);
  const pengelolaTpa = await prisma.user.upsert({
    where: { email: "tpa@nuruljannah.web.id" },
    update: {},
    create: {
      name: "Pengelola TPA",
      email: "tpa@nuruljannah.web.id",
      password: tpaPassword,
      role: "PENGELOLA_TPA",
    },
  });
  console.log("✅ Pengelola TPA user created:", pengelolaTpa.email);

  // Create Site Settings (merged from MosqueProfile + SiteSettings)
  const siteSettings = await prisma.siteSettings.upsert({
    where: { id: "site-settings-1" },
    update: {},
    create: {
      id: "site-settings-1",
      mosqueName: "Nurul Jannah",
      tagline: "Pusat Ibadah, Dakwah, dan Pendidikan Islam",
      address: "Jl. Sriwedari Ujung Gg. Tanjung II, Kel. Tanjung Palas, Kec. Dumai Timur, Kota Dumai, Riau, 28826",
      city: "Dumai",
      province: "Riau",
      phone: "+62 0852-2544-1245",
      email: "masjidnuruljannahtp@gmail.com",
      description:
        "Masjid Nurul Jannah adalah pusat kegiatan ibadah, pendidikan Islam, dan aktivitas sosial umat. Didirikan dengan tujuan menjadi rumah bagi seluruh jamaah dalam mendekatkan diri kepada Allah SWT.",
      vision:
        "Menjadi masjid yang makmur, mencerahkan, dan menjadi pusat peradaban Islam yang rahmatan lil alamin.",
      mission:
        "1. Menyelenggarakan kegiatan ibadah yang khusyuk dan berkualitas\n2. Menyediakan pendidikan Islam untuk semua kalangan\n3. Mengembangkan kegiatan sosial dan pemberdayaan umat\n4. Memanfaatkan teknologi untuk syiar Islam",
      latitude: -6.2,
      longitude: 106.816666,
    },
  });
  console.log("✅ Site settings created:", siteSettings.mosqueName);

  // Create Sample DKM Members
  const dkmMembers = [
    { name: "H. Ahmad Syafii", position: "Ketua DKM", order: 1 },
    { name: "Ustadz Muhammad Ridwan", position: "Wakil Ketua", order: 2 },
    { name: "H. Farid Abdullah", position: "Sekretaris", order: 3 },
    { name: "Ibu Hj. Siti Aminah", position: "Bendahara", order: 4 },
    { name: "Ustadz Zainuddin", position: "Ketua Bidang Dakwah", order: 5 },
  ];

  for (const member of dkmMembers) {
    await prisma.dkmMember.upsert({
      where: { id: `dkm-${member.order}` },
      update: {},
      create: {
        id: `dkm-${member.order}`,
        ...member,
        period: "2024-2027",
        isActive: true,
      },
    });
  }
  console.log("✅ DKM members created:", dkmMembers.length);

  // Create Sample Kajian Schedules
  const kajianSchedules = [
    {
      title: "Kajian Ahad Pagi",
      speaker: "Ustadz Muhammad Ridwan",
      topic: "Fiqih Ibadah",
      dayOfWeek: 0, // Sunday
      time: "08:00",
      location: "Masjid Nurul Jannah",
    },
    {
      title: "Kajian Ba'da Maghrib",
      speaker: "Ustadz Zainuddin",
      topic: "Tafsir Al-Quran",
      dayOfWeek: 2, // Tuesday
      time: "18:30",
      location: "Masjid Nurul Jannah",
    },
    {
      title: "Majelis Dzikir",
      speaker: "Habib Ali",
      topic: "Dzikir & Sholawat",
      dayOfWeek: 4, // Thursday
      time: "19:30",
      location: "Masjid Nurul Jannah",
    },
  ];

  for (let i = 0; i < kajianSchedules.length; i++) {
    await prisma.kajianSchedule.upsert({
      where: { id: `kajian-${i + 1}` },
      update: {},
      create: {
        id: `kajian-${i + 1}`,
        ...kajianSchedules[i],
        isActive: true,
      },
    });
  }
  console.log("✅ Kajian schedules created:", kajianSchedules.length);

  // Create TPA Classes
  const tpaClasses = [
    { name: "Kelas Iqra 1", description: "Untuk pemula belajar huruf hijaiyah" },
    { name: "Kelas Iqra 2", description: "Lanjutan Iqra 1-3" },
    { name: "Kelas Al-Quran", description: "Belajar membaca Al-Quran" },
    { name: "Kelas Tahfidz", description: "Hafalan Juz Amma" },
  ];

  for (let i = 0; i < tpaClasses.length; i++) {
    await prisma.tpaClass.upsert({
      where: { name: tpaClasses[i].name },
      update: {},
      create: {
        ...tpaClasses[i],
        schedule: "Senin - Jumat, 15:30 - 17:00",
        isActive: true,
      },
    });
  }
  console.log("✅ TPA classes created:", tpaClasses.length);

  console.log("\n🎉 Seed completed successfully!");
  console.log("\n📋 Login Credentials:");
  console.log("   Admin: admin@nuruljannah.web.id / admin123");
  console.log("   Bendahara: bendahara@nuruljannah.web.id / bendahara123");
  console.log("   Takmir: takmir@nuruljannah.web.id / takmir123");
  console.log("   TPA: tpa@nuruljannah.web.id / tpa123");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
