import type { NextPage } from 'next'
import { useState } from 'react'

import { flatten } from '../utils/arraysFuncs'

import useTimetableStore from '../store'

const Checking: NextPage = () => {
	const [clicked, setClicked] = useState(false)
	const [clickedTeachersMenu, setClickedTeachersMenu] = useState(false)

	const { rawTableData, teachers, selectedClass, classes } =
		useTimetableStore()

	// returns an array of teachers and count of lessons they teach
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
			shortName: teacher.shortname,
			lessons: teacherLessons.length,
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

	const handleClick = () => {
		setClicked((prevState) => !prevState)
	}

	const classLessonsNumInvalid = () => {
		const classLessons = rawTableData.filter(
			(lesson) => lesson.class === selectedClass
		)

		if (classLessons.length > 30) {
			return (
				<div className="alert alert-error shadow-lg justify-center mt-2">
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
							<h5 className="inline">
								Error: Too many lessons!
							</h5>
							<h5 className="inline font-bold ml-2">
								{classLessons.length}
							</h5>
						</span>
					</div>
				</div>
			)
		} else if (classLessons.length < 20) {
			return (
				<div className=" alert alert-warning shadow-lg justify-center mt-2">
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
							<h5 className="inline">
								Warning: Too few lessons!
							</h5>
							<h5 className="inline font-bold ml-2">
								{classLessons.length}
							</h5>
						</span>
					</div>
				</div>
			)
		} else {
			return (
				<div className="alert alert-success shadow-lg justify-center mt-2">
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
								d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<span>
							<h5 className="inline font-bold mr-1">
								{classLessons.length}
							</h5>
							<h5 className="inline">Lessons</h5>
						</span>
					</div>
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

		if (noTeacherLessons.length > 0) {
			return (
				<div
					onClick={handleClick}
					className="indicator w-full hover:cursor-pointer"
				>
					<span className="indicator-item badge badge-primary right-2 top-2">
						{noTeacherLessons.length}
					</span>
					<div className="alert alert-error shadow-lg justify-center mt-2 flex-col">
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
								<h5 className="inline">
									Error: No teacher assigned!
								</h5>
							</span>
						</div>
						{clicked && (
							<div className="grid grid-cols-5">
								{noTeacherLessons.map((lesson) => (
									<h5
										className="btn btn-outline"
										key={lesson.id}
									>
										{lesson.day}:{lesson.period}
									</h5>
								))}
							</div>
						)}
					</div>
				</div>
			)
		}
	}

	const teachersInvalid = () => {
		const teachersInv: any = []

		teachersStats.map((teacher) => {
			if (teacher.lessons > 28 || teacher.lessons < 22) {
				teachersInv.push({
					name: teacher.shortName,
					lessons: teacher.lessons,
				})
			}
		})

		return teachersInv
	}

	const teachersInvalidError = () => (
		<div
			onClick={() =>
				setClickedTeachersMenu((prevState) => !prevState)
			}
			className="indicator w-full hover:cursor-pointer"
		>
			<span className="indicator-item badge badge-primary right-2 top-2">
				{teachersInvalid().length}
			</span>
			<div className="alert alert-error shadow-lg justify-center mt-2 flex-col">
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
						<h5 className="inline">
							Error: Teacher teaching invalid number of
							lessons!
						</h5>
					</span>
				</div>
				{clickedTeachersMenu && (
					<div className="grid grid-cols-5">
						{teachersInvalid().map((tch: any) => (
							<h5
								key={tch.name}
								className="btn btn-outline btn-md"
							>
								{tch.name}: {tch.lessons}
							</h5>
						))}
					</div>
				)}
			</div>
		</div>
	)

	return (
		<div className="mt-5 max-h-96 overflow-y-auto overflow-x-hidden p-3">
			{!classTeacherTeaching() && (
				<div className="alert alert-error shadow-lg justify-center mt-2">
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
							<h5 className="inline">
								Error: Class teacher is not teaching any
								lesson!
							</h5>
						</span>
					</div>
				</div>
			)}
			{classLessonsNumInvalid()}
			{lessonsWithoutTeacher()}
			{teachersInvalidError()}
		</div>
	)
}

export default Checking
