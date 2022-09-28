import { NextPage } from 'next'
import { useState } from 'react'

import useTimetableStore from '../store'
import { flatten } from '../utils/arraysFuncs'

import BarChart from './charts/BarChart'

const TeachersBarChart: NextPage = () => {
	const { rawTableData, teachers, selectedClass, classes } =
		useTimetableStore()

	// returns an array of teachers and count of lessons they teach
	const teachersStats = teachers
		.map((teacher) => {
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
		.filter((teacher) => teacher.lessons > 0)

	const [teachersData, setUserData] = useState({
		labels: teachersStats.map((teacher) => teacher.name),
		datasets: [
			{
				label: 'Lessons Teaching',
				data: teachersStats.map((teacher) => teacher.lessons),
				backgroundColor: [
					'rgba(75,192,192,1)',
					'#ecf0f1',
					'#50AF95',
					'#f3ba2f',
					'#2a71d0',
				],
				borderColor: 'black',
				borderWidth: 2,
			},
		],
	})

	return (
		<div>
			<div className="w-full">
				<BarChart chartData={teachersData} />
			</div>
		</div>
	)
}

export default TeachersBarChart
