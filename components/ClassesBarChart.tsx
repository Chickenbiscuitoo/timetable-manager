import { NextPage } from 'next'
import { useState } from 'react'

import useTimetableStore from '../store'
import { flatten } from '../utils/arraysFuncs'

import BarChart from './charts/BarChart'

const ClassesBarChart: NextPage = () => {
	const { bindings, classes } = useTimetableStore()

	const classesStats = classes.map((cl) => {
		const classesLessons = bindings
			.filter((b) => b.cl.id === cl.id)
			.map((binding) =>
				binding.teachers.map((teacher) => teacher.lessons)
			)

		const lessons = flatten(classesLessons).reduce(
			(acc: number, curr: number) => acc + curr,
			0
		)

		return { name: cl.name, lessons }
	})

	const [classesData, setUserData] = useState({
		labels: classes.map((cl) => cl.name),
		datasets: [
			{
				label: 'Lessons Teaching',
				data: classesStats.map((cl) => cl.lessons),
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
				<BarChart chartData={classesData} />
			</div>
		</div>
	)
}

export default ClassesBarChart
