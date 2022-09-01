import type { NextComponentType } from 'next'
import useTimetableStore from '../store'
import { useEffect, useState } from 'react'

import { getPosition } from '../utils/getPosition'

import Cell from '../components/Cell'

const Timetable: NextComponentType = () => {
	const { rawTableData, selectedClass } = useTimetableStore()

	const selectedClassTableData = rawTableData.filter(
		(lesson) => lesson.class === selectedClass
	)

	// Fuction to make nested array from an array of objects
	function tableArrayFromList(list: any, rows: number, cols: number) {
		const arr = new Array(rows + 1)
			.fill(0)
			.map((_, i) => new Array(cols + 1).fill(undefined))
		selectedClassTableData.forEach((lesson) => {
			const row = lesson.period
			const col = lesson.day
			arr[row][col] = lesson
		})
		return arr
	}

	const [tableData, setTableData] = useState(
		tableArrayFromList(selectedClassTableData, 11, 5)
	)

	useEffect(() => {
		setTableData(tableArrayFromList(selectedClassTableData, 11, 5))
	}, [rawTableData, selectedClass])

	return (
		<>
			<div className="w-full">
				<table className="table table-zebra w-full h-full devide-black border-collapse border border-slate-500 table-fixed ">
					<thead>
						<tr>
							<th className="border border-slate-600 w-10">
								x
							</th>
							<th className="border border-slate-600">
								Monday
							</th>
							<th className="border border-slate-600">
								Tuesday
							</th>
							<th className="border border-slate-600">
								Wednesday
							</th>
							<th className="border border-slate-600">
								Thursday
							</th>
							<th className="border border-slate-600">
								Friday
							</th>
						</tr>
					</thead>
					<tbody>
						{tableData
							.filter((_, i) => i)
							.map((row, i) => (
								<tr key={i}>
									<td className="border border-slate-700 w-10">
										{i + 1}
									</td>
									{row
										.filter((_, ci) => ci)
										.map((cell, ci) => {
											return (
												<Cell
													key={getPosition(
														i,
														ci
													)}
													subject={
														cell?.subjects
													}
													position={getPosition(
														i,
														ci
													)}
													teacher={
														cell?.teachers
													}
												/>
											)
										})}
								</tr>
							))}
					</tbody>
				</table>
			</div>
		</>
	)
}

export default Timetable
