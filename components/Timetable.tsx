import type { NextComponentType } from 'next'
import styles from '../styles/Timetable.module.css'

import useTimetableStore from '../store'
import { useEffect, useState } from 'react'

const Timetable: NextComponentType = () => {
	const { rawTableData, addLesson } = useTimetableStore()

	// Fuction to make nested array from array of objects
	function tableArrayFromList(list: any, rows: number, cols: number) {
		const arr = new Array(rows + 1)
			.fill(0)
			.map((_, i) => new Array(cols + 1).fill(undefined))
		rawTableData.forEach((lesson) => {
			const row = lesson.lesson_id % 100
			const col = Math.floor(lesson.lesson_id / 100)
			arr[row][col] = lesson
		})
		return arr
	}

	const [tableData, setTableData] = useState(
		tableArrayFromList(rawTableData, 11, 5)
	)

	useEffect(() => {
		setTableData(tableArrayFromList(rawTableData, 11, 5))
	}, [rawTableData])

	return (
		<>
			<table>
				<thead>
					<tr>
						<th>x</th>
						<th>Monday</th>
						<th>Tuesday</th>
						<th>Wednesday</th>
						<th>Thursday</th>
						<th>Friday</th>
					</tr>
				</thead>
				<tbody>
					{tableData
						.filter((_, i) => i)
						.map((row, i) => (
							<tr key={i}>
								<td>{i + 1}</td>
								{row
									.filter((_, ci) => ci)
									.map((cell, ci) => (
										<td key={i * 100 + ci}>
											{cell?.subject}
										</td>
									))}
							</tr>
						))}
				</tbody>
			</table>
			<button onClick={() => addLesson(305, 'PBE', 'CP')}>
				Add Lesson
			</button>
		</>
	)
}

export default Timetable
