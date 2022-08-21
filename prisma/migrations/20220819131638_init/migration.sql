-- CreateTable
CREATE TABLE "Teacher" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "shortname" VARCHAR(5) NOT NULL,
    "email" VARCHAR(255) NOT NULL,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subject" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "shortname" VARCHAR(5) NOT NULL,
    "committee" INTEGER NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Committee" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "chairman" INTEGER NOT NULL,

    CONSTRAINT "Committee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Class" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "teacher" INTEGER NOT NULL,

    CONSTRAINT "Class_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lesson" (
    "id" SERIAL NOT NULL,
    "class" INTEGER NOT NULL,
    "day" INTEGER NOT NULL,
    "period" INTEGER NOT NULL,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_LessonToSubject" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_LessonToTeacher" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Committee_chairman_key" ON "Committee"("chairman");

-- CreateIndex
CREATE UNIQUE INDEX "Class_teacher_key" ON "Class"("teacher");

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_day_period_class_key" ON "Lesson"("day", "period", "class");

-- CreateIndex
CREATE UNIQUE INDEX "_LessonToSubject_AB_unique" ON "_LessonToSubject"("A", "B");

-- CreateIndex
CREATE INDEX "_LessonToSubject_B_index" ON "_LessonToSubject"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_LessonToTeacher_AB_unique" ON "_LessonToTeacher"("A", "B");

-- CreateIndex
CREATE INDEX "_LessonToTeacher_B_index" ON "_LessonToTeacher"("B");

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_committee_fkey" FOREIGN KEY ("committee") REFERENCES "Committee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Committee" ADD CONSTRAINT "Committee_chairman_fkey" FOREIGN KEY ("chairman") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_teacher_fkey" FOREIGN KEY ("teacher") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_class_fkey" FOREIGN KEY ("class") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LessonToSubject" ADD CONSTRAINT "_LessonToSubject_A_fkey" FOREIGN KEY ("A") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LessonToSubject" ADD CONSTRAINT "_LessonToSubject_B_fkey" FOREIGN KEY ("B") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LessonToTeacher" ADD CONSTRAINT "_LessonToTeacher_A_fkey" FOREIGN KEY ("A") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LessonToTeacher" ADD CONSTRAINT "_LessonToTeacher_B_fkey" FOREIGN KEY ("B") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;
