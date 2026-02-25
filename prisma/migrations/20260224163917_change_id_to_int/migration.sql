/*
  Warnings:

  - The primary key for the `Habit` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Habit` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `HabitLog` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `HabitLog` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `habitId` on the `HabitLog` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "HabitLog" DROP CONSTRAINT "HabitLog_habitId_fkey";

-- AlterTable
ALTER TABLE "Habit" DROP CONSTRAINT "Habit_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Habit_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "HabitLog" DROP CONSTRAINT "HabitLog_pkey",
ADD COLUMN     "completed" BOOLEAN NOT NULL DEFAULT true,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "habitId",
ADD COLUMN     "habitId" INTEGER NOT NULL,
ADD CONSTRAINT "HabitLog_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "HabitLog_habitId_date_key" ON "HabitLog"("habitId", "date");

-- AddForeignKey
ALTER TABLE "HabitLog" ADD CONSTRAINT "HabitLog_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "Habit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
