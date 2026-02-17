/*
  Warnings:

  - You are about to drop the column `date` on the `officer_schedules` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[dayOfWeek,prayer,role]` on the table `officer_schedules` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dayOfWeek` to the `officer_schedules` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "officer_schedules_date_prayer_role_key";

-- AlterTable
ALTER TABLE "officer_schedules" DROP COLUMN "date",
ADD COLUMN     "dayOfWeek" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "officer_schedules_dayOfWeek_prayer_role_key" ON "officer_schedules"("dayOfWeek", "prayer", "role");
