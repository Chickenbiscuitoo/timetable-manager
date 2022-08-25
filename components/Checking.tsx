// či daný učiteľ neučí menej ako 22 a viac ako jeho maximum
// či sú pokryté všetky hodiny predmetu učiteľmi
// či triedny učiteľ učí nejaký predmet vo svojej triede
// či má trieda priradené všetky hodiny

import type { NextPage } from 'next'
import styles from '../styles/Checking.module.css'

import { flatten } from '../utils/arraysFuncs'

import useTimetableStore from '../store'

const Checking: NextPage = () => {
	const { rawTableData, teachers, selectedClass, classes } =
		useTimetableStore()

	// array of teachers and count of lessons they teach
	const teachersStats = teachers.map((teacher) => {
		// list of all teachers that are teaching some lessons
		const activeTeachers = rawTableData.map((lesson) =>
			lesson.teachers?.map((teacher) => teacher.id)
		)

		const teacherLessons = flatten(activeTeachers).filter(
			(id: number) => id === teacher.id
		)

		return {
			id: teacher.id,
			name: teacher.name,
			lessons: teacherLessons.length,
		}
	})

	const classTeacherTeaching = () => {
		// TODO: MAKE MORE SIMPLE
		const classTeacher = classes
			.filter((cl) => cl.id === selectedClass)
			.map((cl) => cl.teacher_id)[0]

		const classLessons = rawTableData.filter(
			(lesson) => lesson.class === selectedClass
		)

		// list of all teachers that are teaching some lessons
		const activeTeachersInClass = classLessons.map((lesson) =>
			lesson.teachers?.map((teacher) => teacher.id)
		)

		const teacherLessons = flatten(activeTeachersInClass).filter(
			(id: number) => id === classTeacher
		)

		if (teacherLessons.length > 0) {
			return true
		} else {
			return false
		}
	}

	classTeacherTeaching()
	return <div>jou</div>
}

export default Checking
