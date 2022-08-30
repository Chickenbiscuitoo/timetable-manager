import type { NextPage } from 'next'
import styles from '../styles/Stats.module.css'

import { flatten } from '../utils/arraysFuncs'

import { useState } from 'react'
import useTimetableStore from '../store'

const Stats: NextPage = () => {
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
		let classId = 9
		const getClassLessons = teacher.lessons.forEach((lesson) => {
			if (lesson.class === classId) {
				classLessons.push({
					[classId]: [classLessons[classId - 9], lesson],
				})
			}
			classId++
		})

		return classLessons
	})

	return <div></div>
}

export default Stats
