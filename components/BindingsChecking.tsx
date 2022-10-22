import type { NextPage } from 'next'
import { useState } from 'react'

import useTimetableStore from '../store'

import { flatten } from '../utils/arraysFuncs'

const BindingsChecking: NextPage = () => {
	const [clicked, setClicked] = useState(false)

	const { bindings, teachers, classes } = useTimetableStore()

	// returns an array of teachers and count of lessons they teach
	const teachersTotalLessons = () => {
		// returns array of active teachers
		const activeTeachers = [
			...new Set(
				flatten(
					bindings.map((binding) =>
						binding.teachers.map((teacher) => teacher.id)
					)
				)
			),
		]

		const teachersLessons = activeTeachers.map((teacher) => {
			const lessonsUnprocessed = bindings.map((binding) =>
				binding.teachers
					.filter((tch) => teacher === tch.id)
					.map((tch) => tch.lessons)
			)
			const teachersTotal = flatten(lessonsUnprocessed).reduce(
				(acc: number, curr: number) => acc + curr,
				0
			)

			return {
				id: teacher,
				lessons: teachersTotal,
			}
		})

		return teachersLessons
	}

	return <div></div>
}

export default BindingsChecking
