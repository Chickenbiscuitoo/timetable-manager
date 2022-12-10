/*
  Warnings:

  - You are about to drop the column `teacher_id` on the `Class` table. All the data in the column will be lost.
  - You are about to alter the column `name` on the `Class` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(32)`.
  - You are about to drop the column `chairman_id` on the `Committee` table. All the data in the column will be lost.
  - You are about to drop the column `commitee_id` on the `Subject` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[teacher]` on the table `Class` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[chairman]` on the table `Committee` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `grade` to the `Class` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teacher` to the `Class` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chairman` to the `Committee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `commitee` to the `Subject` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_teacher_id_fkey";

-- DropForeignKey
ALTER TABLE "Committee" DROP CONSTRAINT "Committee_chairman_id_fkey";

-- DropForeignKey
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_commitee_id_fkey";

-- DropIndex
DROP INDEX "Class_teacher_id_key";

-- DropIndex
DROP INDEX "Committee_chairman_id_key";

-- AlterTable
ALTER TABLE "Class" DROP COLUMN "teacher_id",
ADD COLUMN     "grade" INTEGER NOT NULL,
ADD COLUMN     "teacher" INTEGER NOT NULL,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(32);

-- AlterTable
ALTER TABLE "Committee" DROP COLUMN "chairman_id",
ADD COLUMN     "chairman" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Subject" DROP COLUMN "commitee_id",
ADD COLUMN     "commitee" INTEGER NOT NULL,
ALTER COLUMN "shortname" SET DATA TYPE VARCHAR(8);

-- AlterTable
ALTER TABLE "Teacher" ADD COLUMN     "bindingId" INTEGER,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(128),
ALTER COLUMN "shortname" SET DATA TYPE VARCHAR(8);

-- CreateTable
CREATE TABLE "Binding" (
    "id" SERIAL NOT NULL,
    "subject" INTEGER NOT NULL,
    "class" INTEGER NOT NULL,

    CONSTRAINT "Binding_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Class_teacher_key" ON "Class"("teacher");

-- CreateIndex
CREATE UNIQUE INDEX "Committee_chairman_key" ON "Committee"("chairman");

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_bindingId_fkey" FOREIGN KEY ("bindingId") REFERENCES "Binding"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_commitee_fkey" FOREIGN KEY ("commitee") REFERENCES "Committee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Committee" ADD CONSTRAINT "Committee_chairman_fkey" FOREIGN KEY ("chairman") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_teacher_fkey" FOREIGN KEY ("teacher") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Binding" ADD CONSTRAINT "Binding_class_fkey" FOREIGN KEY ("class") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Binding" ADD CONSTRAINT "Binding_subject_fkey" FOREIGN KEY ("subject") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
