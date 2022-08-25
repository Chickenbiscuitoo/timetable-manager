// či daný učiteľ neučí menej ako 22 a viac ako jeho maximum
// či sú pokryté všetky hodiny predmetu učiteľmi
// či triedny učiteľ učí nejaký predmet vo svojej triede
// či má trieda priradené všetky hodiny

import type { NextPage } from 'next'
import styles from '../styles/Checking.module.css'

import useTimetableStore from '../store'

const Checking: NextPage = () => {
	const { rawTableData, teachers, selectedClass } = useTimetableStore()

	const teachersStats = teachers.map((teacher) => {
		// function to turn 2D array into a simple array
		const flatten = (arr: any) =>
			arr.reduce(
				(flat: any, next: any) =>
					flat.concat(
						Array.isArray(next) ? flatten(next) : next
					),
				[]
			)

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

	console.log(teachersStats)

	return <div>jou</div>
}

export default Checking
