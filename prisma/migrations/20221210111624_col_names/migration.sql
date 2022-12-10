/*
  Warnings:

  - You are about to drop the column `class` on the `Binding` table. All the data in the column will be lost.
  - You are about to drop the column `subject` on the `Binding` table. All the data in the column will be lost.
  - You are about to drop the column `teacher` on the `Class` table. All the data in the column will be lost.
  - You are about to drop the column `chairman` on the `Committee` table. All the data in the column will be lost.
  - You are about to drop the column `class` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `commitee` on the `Subject` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[teacherId]` on the table `Class` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[chairmanId]` on the table `Committee` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[day,period,classId]` on the table `Lesson` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `classId` to the `Binding` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subjectId` to the `Binding` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teacherId` to the `Class` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chairmanId` to the `Committee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `classId` to the `Lesson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `commiteeId` to the `Subject` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Binding" DROP CONSTRAINT "Binding_class_fkey";

-- DropForeignKey
ALTER TABLE "Binding" DROP CONSTRAINT "Binding_subject_fkey";

-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_teacher_fkey";

-- DropForeignKey
ALTER TABLE "Committee" DROP CONSTRAINT "Committee_chairman_fkey";

-- DropForeignKey
ALTER TABLE "Lesson" DROP CONSTRAINT "Lesson_class_fkey";

-- DropForeignKey
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_commitee_fkey";

-- DropIndex
DROP INDEX "Class_teacher_key";

-- DropIndex
DROP INDEX "Committee_chairman_key";

-- DropIndex
DROP INDEX "Lesson_day_period_class_key";

-- AlterTable
ALTER TABLE "Binding" DROP COLUMN "class",
DROP COLUMN "subject",
ADD COLUMN     "classId" INTEGER NOT NULL,
ADD COLUMN     "subjectId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Class" DROP COLUMN "teacher",
ADD COLUMN     "teacherId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Committee" DROP COLUMN "chairman",
ADD COLUMN     "chairmanId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "class",
ADD COLUMN     "classId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Subject" DROP COLUMN "commitee",
ADD COLUMN     "commiteeId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Class_teacherId_key" ON "Class"("teacherId");

-- CreateIndex
CREATE UNIQUE INDEX "Committee_chairmanId_key" ON "Committee"("chairmanId");

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_day_period_classId_key" ON "Lesson"("day", "period", "classId");

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_commiteeId_fkey" FOREIGN KEY ("commiteeId") REFERENCES "Committee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Committee" ADD CONSTRAINT "Committee_chairmanId_fkey" FOREIGN KEY ("chairmanId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Binding" ADD CONSTRAINT "Binding_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Binding" ADD CONSTRAINT "Binding_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
