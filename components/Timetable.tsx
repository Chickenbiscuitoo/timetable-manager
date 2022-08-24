import type { NextComponentType } from 'next'
import styles from '../styles/Timetable.module.css'
import useTimetableStore from '../store'
import { useEffect, useState } from 'react'

import { getPosition } from '../utils/getPosition'

import Cell from '../components/Cell'

const Timetable: NextComponentType = () => {
	const { rawTableData, addLesson } = useTimetableStore()

	// Fuction to make nested array from an array of objects
	function tableArrayFromList(list: any, rows: number, cols: number) {
		const arr = new Array(rows + 1)
			.fill(0)
			.map((_, i) => new Array(cols + 1).fill(undefined))
		rawTableData.forEach((lesson) => {
			const row = lesson.period
			const col = lesson.day
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
			<table className={styles.tg}>
				<thead>
					<tr>
						<th className={styles.num_cell}>x</th>
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
								<td className={styles.num_cell}>
									{i + 1}
								</td>
								{row
									.filter((_, ci) => ci)
									.map((cell, ci) => {
										return (
											<Cell
												key={getPosition(i, ci)}
												subject={cell?.subjects}
												position={getPosition(
													i,
													ci
												)}
												teacher={cell?.teachers}
											/>
										)
									})}
							</tr>
						))}
				</tbody>
			</table>
		</>
	)
}

export default Timetable
