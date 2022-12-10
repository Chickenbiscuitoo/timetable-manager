/*
  Warnings:

  - The primary key for the `BindingTeacherLessons` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `BindingTeacherLessons` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "BindingTeacherLessons_bindingId_teacherId_key";

-- AlterTable
ALTER TABLE "BindingTeacherLessons" DROP CONSTRAINT "BindingTeacherLessons_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "BindingTeacherLessons_pkey" PRIMARY KEY ("bindingId", "teacherId");
