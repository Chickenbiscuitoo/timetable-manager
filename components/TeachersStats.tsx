import type { NextPage } from 'next'
import styles from '../styles/Stats.module.css'

import { flatten } from '../utils/arraysFuncs'

import { useState } from 'react'
import useTimetableStore from '../store'

const TeachersStats: NextPage = () => {
	const { teachers, subjects, classes, rawTableData } =
		useTimetableStore()

	const teachersLessons = teachers.map((teacher) => {
		const teacherLessons = rawTableData.filter((lesson) =>
			lesson.teachers?.some((t) => t.id === teacher.id)
		)

		return {
			id: teacher.id,
			name: teacher.name,
			lessons: teacherLessons,
		}
	})

	const teachersStats = teachersLessons.map((teacher) => {
		const classLessons: any = []
		classes.forEach((cl) => {
			const clLessons = teacher.lessons.filter(
				(lesson) => lesson.class === cl.id
			)
			classLessons.push(clLessons)
		})
		return {
			id: teacher.id,
			name: teacher.name,
			lessons: classLessons,
		}
	})

	const teacherItems = teachersStats.map((teacher) => {
		return (
			<div>
				<h3>{teacher.name}</h3>
				{teacher.lessons.map((cl: any, i: any) => {
					const clName = classes.find(
						(cla) => cla.id === i + 1
					)?.name
					return (
						<div>
							<h4>{clName}</h4>
							<h5>Number of lessons: {cl.length}</h5>
						</div>
					)
				})}
			</div>
		)
	})

	return <>{teacherItems}</>
}

export default TeachersStats
