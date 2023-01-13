import { NextPage } from 'next'
import { useState } from 'react'

import useTimetableStore from '../store'

import BarChart from './charts/BarChart'

const CommitteesBarChart: NextPage = () => {
	const { subjects, committees } = useTimetableStore()

	const committeesStats = committees.map((committee) => {
		let subjectsNum = 0

		subjects.forEach((subject) => {
			if (subject.committeeId === committee.id) {
				subjectsNum++
			}
		})

		return { name: committee.name, subjectsNum }
	})

	const [committeesData, setcommitteesData] = useState({
		labels: committees.map((committee) => committee.name),
		datasets: [
			{
				label: 'Number of subjects in each committee',
				data: committeesStats.map(
					(committee) => committee.subjectsNum
				),
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
				<BarChart chartData={committeesData} />
			</div>
		</div>
	)
}

export default CommitteesBarChart
