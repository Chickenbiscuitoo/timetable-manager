/*
  Warnings:

  - A unique constraint covering the columns `[subjectId,classId]` on the table `Binding` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Binding_subjectId_classId_key" ON "Binding"("subjectId", "classId");
