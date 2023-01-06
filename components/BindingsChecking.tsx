import type { NextPage } from 'next'
import { useState } from 'react'

import useTimetableStore from '../store'

import { flatten } from '../utils/arraysFuncs'

const BindingsChecking: NextPage = () => {
	const [clicked, setClicked] = useState(false)

	const { bindings, teachers, classes, selectedGrade } =
		useTimetableStore()

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

	const warningsTeachersTotalLessons = () => {
		const teacherMinLessons = 4
		const teacherMaxLessons = 22

		const teachersLessons = teachersTotalLessons()

		return teachersLessons.map((entry, i) => {
			const teacher = teachers.find((tch) => tch.id === entry.id)

			if (!teacher) {
				return
			}

			if (entry.lessons < teacherMinLessons) {
				return (
					<div
						key={teacher.id}
						className="alert alert-warning shadow-lg justify-center mt-2"
					>
						<div>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="stroke-current flex-shrink-0 h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
								/>
							</svg>
							<span>
								<h5 className="inline font-semibold mr-1">
									{teacher?.name}
								</h5>
								<h5 className="inline">
									is teaching too few lessons!
								</h5>
							</span>
						</div>
					</div>
				)
			} else if (entry.lessons > teacherMaxLessons) {
				return (
					<div
						key={teacher.id}
						className="alert alert-error shadow-lg justify-center mt-2"
					>
						<div>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="stroke-current flex-shrink-0 h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<span>
								<h5 className="inline font-semibold mr-1">
									{teacher?.name}
								</h5>
								<h5 className="inline">
									is teaching too many lessons!
								</h5>
							</span>
						</div>
					</div>
				)
			}
		})
	}

	const classTeacherTeaching = classes
		.filter((cl) => cl.grade === selectedGrade)
		.map((cl) => {
			const classTeachers = bindings
				.filter((binding) => binding.cl.id === cl.id)
				.map((binding) =>
					binding.teachers.map((teacher) => teacher.id)
				)

			const classTeacherTeaching = flatten(classTeachers).includes(
				cl.teacher.id
			)

			return {
				id: cl.id,
				teacherTeaching: classTeacherTeaching,
			}
		})

	const warningsClassTeacherTeaching = () => {
		return classTeacherTeaching.map((entry) => {
			const cl = classes.find((cl) => cl.id === entry.id)

			if (!entry.teacherTeaching) {
				return (
					<div
						key={cl?.id}
						className="alert alert-warning shadow-lg justify-center mt-2"
					>
						<div>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="stroke-current flex-shrink-0 h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<span>
								<h5 className="inline font-semibold mr-1">
									{cl?.name}
								</h5>
								<h5 className="inline">
									does not have a class teacher teaching
									it!
								</h5>
							</span>
						</div>
					</div>
				)
			}
		})
	}

	return (
		<div className="overflow-y-auto overflow-x-hidden">
			{warningsTeachersTotalLessons()}
			{warningsClassTeacherTeaching()}
		</div>
	)
}

export default BindingsChecking
