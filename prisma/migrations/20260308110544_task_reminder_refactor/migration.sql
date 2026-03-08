/*
  Warnings:

  - You are about to drop the column `reminderTime` on the `Task` table. All the data in the column will be lost.
  - Added the required column `reminderOffsetMinutes` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `taskScheduledTime` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "reminderTime",
ADD COLUMN     "reminderOffsetMinutes" INTEGER NOT NULL,
ADD COLUMN     "taskScheduledTime" TEXT NOT NULL;
