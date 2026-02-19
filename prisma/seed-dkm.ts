import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PERIOD = "2025-2028";

const members = [
  // === PEMBINA ===
  { name: "Lurah Tanjung Palas", position: "Pembina", section: "PEMBINA", order: 1 },
  { name: "Ketua RT 06 Tanjung Palas", position: "Pembina", section: "PEMBINA", order: 2 },
  { name: "Ketua RT 07 Tanjung Palas", position: "Pembina", section: "PEMBINA", order: 3 },

  // === PENASEHAT ===
  { name: "Sudirman", position: "Penasehat", section: "PENASEHAT", order: 10 },
  { name: "Hadianto", position: "Penasehat", section: "PENASEHAT", order: 11 },

  // === BPH ===
  { name: "Ns. Rico, S.Kep", position: "Ketua", section: "BPH", order: 20 },
  { name: "Zapri Salis, SKM., MKM", position: "Wakil Ketua", section: "BPH", order: 21 },
  { name: "Wiwit Sulistyanto, ST", position: "Sekretaris", section: "BPH", order: 22 },
  { name: "M. Yusuf", position: "Bendahara", section: "BPH", order: 23 },

  // === IMAM MASJID ===
  { name: "Rahmat Fernanda Aziz, S.Pd", position: "Imam Masjid", section: "IMAM", order: 30 },
  { name: "Abdurrahman", position: "Imam Masjid", section: "IMAM", order: 31 },
  { name: "H. Edi", position: "Imam Masjid", section: "IMAM", order: 32 },
  { name: "Nasir", position: "Imam Masjid", section: "IMAM", order: 33 },

  // === GHARIM ===
  { name: "M. Sayid", position: "Gharim (Petugas Harian)", section: "GHARIM", order: 40 },

  // === BIDANG DAKWAH ===
  { name: "Ust. Irwandi", position: "Koordinator", section: "BIDANG_DAKWAH", order: 50 },
  { name: "Rasman", position: "Anggota", section: "BIDANG_DAKWAH", order: 51 },
  { name: "Agus Andi", position: "Anggota", section: "BIDANG_DAKWAH", order: 52 },
  { name: "Hafiz Ghalib", position: "Anggota", section: "BIDANG_DAKWAH", order: 53 },

  // === BIDANG FARDHU KIFAYAH ===
  { name: "H. Edi", position: "Koordinator", section: "BIDANG_FARDHU_KIFAYAH", order: 60 },
  { name: "Muda Pane", position: "Anggota", section: "BIDANG_FARDHU_KIFAYAH", order: 61 },
  { name: "Zulkifli", position: "Anggota", section: "BIDANG_FARDHU_KIFAYAH", order: 62 },
  { name: "Azuar", position: "Anggota", section: "BIDANG_FARDHU_KIFAYAH", order: 63 },
  { name: "Tri Purwono", position: "Anggota", section: "BIDANG_FARDHU_KIFAYAH", order: 64 },
  { name: "Rozali", position: "Anggota", section: "BIDANG_FARDHU_KIFAYAH", order: 65 },

  // === BIDANG PENDIDIKAN ===
  { name: "Abdul Rahman", position: "Koordinator", section: "BIDANG_PENDIDIKAN", order: 70 },
  { name: "Leily Hadita", position: "Anggota", section: "BIDANG_PENDIDIKAN", order: 71 },

  // === BIDANG PEMBANGUNAN ===
  { name: "Iwan Nawawi", position: "Koordinator", section: "BIDANG_PEMBANGUNAN", order: 80 },
  { name: "Winarso", position: "Anggota", section: "BIDANG_PEMBANGUNAN", order: 81 },

  // === BIDANG REMAJA MASJID ===
  { name: "Sumeri", position: "Koordinator", section: "BIDANG_REMAJA", order: 90 },
  { name: "Idris", position: "Anggota", section: "BIDANG_REMAJA", order: 91 },
  { name: "Lana", position: "Anggota", section: "BIDANG_REMAJA", order: 92 },
  { name: "Bayu", position: "Anggota", section: "BIDANG_REMAJA", order: 93 },

  // === BIDANG KEBERSIHAN & KEAMANAN ===
  { name: "M. Sayid", position: "Koordinator", section: "BIDANG_KEBERSIHAN", order: 100 },
  { name: "Abu Darda'", position: "Anggota", section: "BIDANG_KEBERSIHAN", order: 101 },
  { name: "Suporianto", position: "Anggota", section: "BIDANG_KEBERSIHAN", order: 102 },
  { name: "Hendrik Alam", position: "Anggota", section: "BIDANG_KEBERSIHAN", order: 103 },
  { name: "Ilham Amin", position: "Anggota", section: "BIDANG_KEBERSIHAN", order: 104 },
  { name: "Niftah", position: "Anggota", section: "BIDANG_KEBERSIHAN", order: 105 },

  // === BIDANG SARANA & PRASARANA ===
  { name: "M. Nasri", position: "Koordinator", section: "BIDANG_SARANA", order: 110 },
  { name: "Dadang", position: "Anggota", section: "BIDANG_SARANA", order: 111 },
  { name: "Surya", position: "Anggota", section: "BIDANG_SARANA", order: 112 },
  { name: "Hamdanis", position: "Anggota", section: "BIDANG_SARANA", order: 113 },

  // === BIDANG PERWIRITAN IBU-IBU ===
  { name: "Irva Lentri", position: "Koordinator", section: "BIDANG_PERWIRITAN", order: 120 },
  { name: "Desy Isnaini", position: "Anggota", section: "BIDANG_PERWIRITAN", order: 121 },
  { name: "Leily Hadita", position: "Anggota", section: "BIDANG_PERWIRITAN", order: 122 },
  { name: "Sundari", position: "Anggota", section: "BIDANG_PERWIRITAN", order: 123 },
  { name: "Ratna Wulandari", position: "Anggota", section: "BIDANG_PERWIRITAN", order: 124 },
  { name: "Nurfina", position: "Anggota", section: "BIDANG_PERWIRITAN", order: 125 },
];

async function main() {
  console.log("🗑️  Deleting existing DKM members...");
  await prisma.dkmMember.deleteMany();

  console.log(`📥 Inserting ${members.length} DKM members...`);
  for (const member of members) {
    await prisma.dkmMember.create({
      data: {
        ...member,
        period: PERIOD,
        isActive: true,
      },
    });
  }

  console.log(`✅ Done! ${members.length} members inserted for period ${PERIOD}`);
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
