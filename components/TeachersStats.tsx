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
							<th key={tch.id}>{tch.name}</th>
						))}
					</tr>
				</thead>
				<tbody>
					{classStats.map((cl, i) => {
						const clName = classes.find(
							(cla) => cla.id === i + 1
						)?.name

						return (
							<tr key={i}>
								<td>{clName}</td>
								{cl.map((teacher) => (
									<td key={teacher.name}>
										{teacher.lessonsNumber}
									</td>
								))}
							</tr>
						)
					})}
				</tbody>
				<tfoot>
					<tr>
						<th></th>
						{teachers.map((tch) => (
							<th key={tch.email}>{tch.name}</th>
						))}
					</tr>
				</tfoot>
			</table>
		</div>
	)
}

export default TeachersStats
