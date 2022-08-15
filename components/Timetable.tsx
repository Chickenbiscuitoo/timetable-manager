import type { NextComponentType } from 'next'
import styles from '../styles/Timetable.module.css'

import useTimetableStore from '../store'
import { useState } from 'react'

const Timetable: NextComponentType = () => {
	const { timetableData } = useTimetableStore()

	function tableArrayFromList(list: any, rows: number, cols: number) {
		const arr = new Array(rows + 1)
			.fill(0)
			.map((_, i) => new Array(cols + 1).fill(undefined))
		timetableData.forEach((lesson) => {
			const row = lesson.lesson_id % 100
			const col = Math.floor(lesson.lesson_id / 100)
			arr[row][col] = lesson
		})
		return arr
	}

	const [tableData, setTableData] = useState(
		tableArrayFromList(timetableData, 12, 5)
	)

	return (
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
	)
}

export default Timetable
