/*
  Warnings:

  - You are about to drop the column `bindingId` on the `Teacher` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Teacher" DROP CONSTRAINT "Teacher_bindingId_fkey";

-- AlterTable
ALTER TABLE "Teacher" DROP COLUMN "bindingId";

-- CreateTable
CREATE TABLE "_BindingToTeacher" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BindingToTeacher_AB_unique" ON "_BindingToTeacher"("A", "B");

-- CreateIndex
CREATE INDEX "_BindingToTeacher_B_index" ON "_BindingToTeacher"("B");

-- AddForeignKey
ALTER TABLE "_BindingToTeacher" ADD CONSTRAINT "_BindingToTeacher_A_fkey" FOREIGN KEY ("A") REFERENCES "Binding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BindingToTeacher" ADD CONSTRAINT "_BindingToTeacher_B_fkey" FOREIGN KEY ("B") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;
