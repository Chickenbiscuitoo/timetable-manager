import type { NextPage } from 'next'
import styles from '../styles/Checking.module.css'
import { useState } from 'react'

import { flatten } from '../utils/arraysFuncs'

import useTimetableStore from '../store'

const Checking: NextPage = () => {
	const [hovered, setHovered] = useState(false)

	const { rawTableData, teachers, selectedClass, classes } =
		useTimetableStore()

	// returns  an array of teachers and count of lessons they teach
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

	const teachersInvalid = teachersStats.map((teacher) => {
		if (teacher.lessons > 28) {
			return (
				<div className={styles.invalid} key={teacher.id}>
					{teacher.name} - {teacher.lessons}
				</div>
			)
		} else if (teacher.lessons < 22) {
			return (
				<div className={styles.warning} key={teacher.id}>
					{teacher.name} - {teacher.lessons}
				</div>
			)
		}
	})

	const classTeacherTeaching = () => {
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

	const classLessonsNumInvalid = () => {
		const classLessons = rawTableData.filter(
			(lesson) => lesson.class === selectedClass
		)

		if (classLessons.length > 30) {
			return (
				<div className={styles.invalid}>
					{classLessons.length} - too many lessons
				</div>
			)
		} else if (classLessons.length < 20) {
			return (
				<div className={styles.warning}>
					{classLessons.length} - too few lessons
				</div>
			)
		}
	}

	const lessonsWithoutTeacher = () => {
		const classLessons = rawTableData.filter(
			(lesson) => lesson.class === selectedClass
		)

		const noTeacherLessons = classLessons.filter(
			(lesson) => lesson.teachers === undefined
		)

		return noTeacherLessons.map((lesson) => {
			return (
				<div key={lesson.id} className={styles.invalid}>
					{lesson.day}:{lesson.period} - no teacher
				</div>
			)
		})
	}
	return (
		<div>
			{!classTeacherTeaching() && (
				<p className={styles.invalid}>
					Class teacher is not teaching any lessons!
				</p>
			)}
			{classLessonsNumInvalid()}
			{lessonsWithoutTeacher()}
			<div
				onMouseEnter={() => setHovered(true)}
				onMouseLeave={() => setHovered(false)}
			>
				<p>Teachers teaching invalid number of lessons (hover)</p>
				{hovered && (
					<div className={styles.teachers_list}>
						{teachersInvalid}
					</div>
				)}
			</div>
		</div>
	)
}

export default Checking
