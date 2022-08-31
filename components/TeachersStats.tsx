import type { NextPage } from 'next'
import styles from '../styles/Stats.module.css'

import { flatten } from '../utils/arraysFuncs'

import { useState } from 'react'
import useTimetableStore from '../store'

const TeachersStats: NextPage = () => {
	const { teachers, subjects, classes, rawTableData } =
		useTimetableStore()

	const classStats = classes.map((cl) => {
		const activeTeachers = rawTableData
			.filter((lesson) => lesson.class === cl.id)
			.map((lesson) => lesson.teachers?.map((teacher) => teacher.id))
		const classTeachers = flatten(activeTeachers)

		return teachers.map((teacher) => ({
			id: teacher.id,
			name: teacher.name,
			lessonsNumber: classTeachers.filter(
				(id: number) => id === teacher.id
			).length,
		}))
	})

	return (
		<div className="overflow-x-auto">
			<table className="table table-compact w-full">
				<thead>
					<tr>
						<th></th>
						{teachers.map((tch) => (
							<th>{tch.name}</th>
						))}
					</tr>
				</thead>
				<tbody>
					{classStats.map((cl, i) => {
						const clName = classes.find(
							(cla) => cla.id === i + 1
						)?.name

						return (
							<tr>
								<td>{clName}</td>
								{cl.map((teacher) => (
									<td>{teacher.lessonsNumber}</td>
								))}
							</tr>
						)
					})}
				</tbody>
				<tfoot>
					<tr>
						<th></th>
						{teachers.map((tch) => (
							<th>{tch.name}</th>
						))}
					</tr>
				</tfoot>
			</table>
		</div>
	)
}

export default TeachersStats

// const teachersLessons = teachers.map((teacher) => {
// 	const teacherLessons = rawTableData.filter((lesson) =>
// 		lesson.teachers?.some((t) => t.id === teacher.id)
// 	)

// 	return {
// 		id: teacher.id,
// 		name: teacher.name,
// 		lessons: teacherLessons,
// 	}
// })

// const teachersStats = teachersLessons.map((teacher) => {
// 	const classLessons: any = []
// 	classes.forEach((cl) => {
// 		const clLessons = teacher.lessons.filter(
// 			(lesson) => lesson.class === cl.id
// 		)
// 		classLessons.push(clLessons)
// 	})
// 	return {
// 		id: teacher.id,
// 		name: teacher.name,
// 		lessons: classLessons,
// 	}
// })

// const teacherItems = teachersStats.map((teacher) => {
// 	return (
// 		<div>
// 			<div>{teacher.name}</div>
// 			<div>
// 				{teacher.lessons.map((cl: any, i: any) => {
// 					const clName = classes.find(
// 						(cla) => cla.id === i + 1
// 					)?.name
// 					return (
// 						<div>
// 							<h4>{clName}</h4>
// 							<span>
// 								<h5>Lessons: </h5>
// 								<h5>{cl.length}</h5>
// 							</span>
// 						</div>
// 					)
// 				})}
// 			</div>
// 		</div>
// 	)
// })
