/*
  Warnings:

  - You are about to drop the column `teacher` on the `Class` table. All the data in the column will be lost.
  - You are about to drop the column `chairman` on the `Committee` table. All the data in the column will be lost.
  - You are about to drop the column `committee` on the `Subject` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[teacher_id]` on the table `Class` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[chairman_id]` on the table `Committee` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `teacher_id` to the `Class` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chairman_id` to the `Committee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `commitee_id` to the `Subject` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_teacher_fkey";

-- DropForeignKey
ALTER TABLE "Committee" DROP CONSTRAINT "Committee_chairman_fkey";

-- DropForeignKey
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_committee_fkey";

-- DropIndex
DROP INDEX "Class_teacher_key";

-- DropIndex
DROP INDEX "Committee_chairman_key";

-- AlterTable
ALTER TABLE "Class" DROP COLUMN "teacher",
ADD COLUMN     "teacher_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Committee" DROP COLUMN "chairman",
ADD COLUMN     "chairman_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Subject" DROP COLUMN "committee",
ADD COLUMN     "commitee_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Class_teacher_id_key" ON "Class"("teacher_id");

-- CreateIndex
CREATE UNIQUE INDEX "Committee_chairman_id_key" ON "Committee"("chairman_id");

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_commitee_id_fkey" FOREIGN KEY ("commitee_id") REFERENCES "Committee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Committee" ADD CONSTRAINT "Committee_chairman_id_fkey" FOREIGN KEY ("chairman_id") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
