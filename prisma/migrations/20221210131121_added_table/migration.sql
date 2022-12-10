-- CreateTable
CREATE TABLE "BindingTeacherLessons" (
    "id" SERIAL NOT NULL,
    "bindingId" INTEGER NOT NULL,
    "teacherId" INTEGER NOT NULL,
    "lessons" INTEGER NOT NULL,

    CONSTRAINT "BindingTeacherLessons_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BindingTeacherLessons_bindingId_teacherId_key" ON "BindingTeacherLessons"("bindingId", "teacherId");

-- AddForeignKey
ALTER TABLE "BindingTeacherLessons" ADD CONSTRAINT "BindingTeacherLessons_bindingId_fkey" FOREIGN KEY ("bindingId") REFERENCES "Binding"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BindingTeacherLessons" ADD CONSTRAINT "BindingTeacherLessons_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
