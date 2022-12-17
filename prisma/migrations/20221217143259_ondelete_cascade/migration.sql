-- DropForeignKey
ALTER TABLE "BindingTeacherLessons" DROP CONSTRAINT "BindingTeacherLessons_bindingId_fkey";

-- DropForeignKey
ALTER TABLE "BindingTeacherLessons" DROP CONSTRAINT "BindingTeacherLessons_teacherId_fkey";

-- AddForeignKey
ALTER TABLE "BindingTeacherLessons" ADD CONSTRAINT "BindingTeacherLessons_bindingId_fkey" FOREIGN KEY ("bindingId") REFERENCES "Binding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BindingTeacherLessons" ADD CONSTRAINT "BindingTeacherLessons_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;
