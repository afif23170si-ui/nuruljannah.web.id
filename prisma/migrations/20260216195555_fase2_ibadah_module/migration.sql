/*
  Warnings:

  - You are about to drop the `PrayerTimeSetting` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "OfficerRole" AS ENUM ('IMAM', 'MUADZIN', 'KHATIB');

-- CreateEnum
CREATE TYPE "PrayerTime" AS ENUM ('FAJR', 'DHUHR', 'ASR', 'MAGHRIB', 'ISHA', 'JUMAT');

-- DropTable
DROP TABLE "PrayerTimeSetting";

-- CreateTable
CREATE TABLE "prayer_time_settings" (
    "id" TEXT NOT NULL,
    "method" INTEGER NOT NULL DEFAULT 20,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Jakarta',
    "fajrOffset" INTEGER NOT NULL DEFAULT 10,
    "dhuhrOffset" INTEGER NOT NULL DEFAULT 5,
    "asrOffset" INTEGER NOT NULL DEFAULT 5,
    "maghribOffset" INTEGER NOT NULL DEFAULT 5,
    "ishaOffset" INTEGER NOT NULL DEFAULT 10,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prayer_time_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prayer_officers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "role" "OfficerRole" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prayer_officers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "officer_schedules" (
    "id" TEXT NOT NULL,
    "officerId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "prayer" "PrayerTime" NOT NULL,
    "role" "OfficerRole" NOT NULL,
    "notes" TEXT,

    CONSTRAINT "officer_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "khutbah" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "khatib" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "theme" TEXT,
    "summary" TEXT,
    "audioUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "khutbah_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "officer_schedules_date_prayer_role_key" ON "officer_schedules"("date", "prayer", "role");

-- AddForeignKey
ALTER TABLE "officer_schedules" ADD CONSTRAINT "officer_schedules_officerId_fkey" FOREIGN KEY ("officerId") REFERENCES "prayer_officers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
