import { NextPage } from 'next'
import { useState } from 'react'

import useTimetableStore from '../store'
import { flatten } from '../utils/arraysFuncs'

import BarChart from './charts/BarChart'

const SubjectsBarChart: NextPage = () => {
	const { bindings, subjects } = useTimetableStore()

	const subjectsStats = subjects.map((subject) => {
		const subjectsLessons = bindings
			.filter((b) => b.subject.id === subject.id)
			.map((binding) =>
				binding.teachers.map((teacher) => teacher.lessons)
			)

		const lessons = flatten(subjectsLessons).reduce(
			(acc: number, curr: number) => acc + curr,
			0
		)

		return { name: subject.name, lessons }
	})

	const [subjectsData, setSubjectsData] = useState({
		labels: subjects.map((subject) => subject.name),
		datasets: [
			{
				label: 'Lessons',
				data: subjectsStats.map((subject) => subject.lessons),
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
				<BarChart chartData={subjectsData} />
			</div>
		</div>
	)
}

export default SubjectsBarChart
