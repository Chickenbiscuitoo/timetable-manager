import type { NextComponentType } from 'next'
import useTimetableStore from '../store'
import { useEffect, useState } from 'react'

import BindingsCell from './BindingsCell'

const BindingsTable: NextComponentType = () => {
	const { bindings, selectedGrade, classes, subjects } =
		useTimetableStore()

	const selectedGradeTableData = bindings.filter(
		(binding) => binding.cl.grade === selectedGrade
	)

	// Fuction to make nested array from an array of objects
	function tableArrayFromList(list: any, rows: number, cols: number) {
		const arr = new Array(rows + 1)
			.fill(0)
			.map((_, i) => new Array(cols + 1).fill(undefined))
		selectedGradeTableData.forEach((binding) => {
			const row = binding.subject.id
			const col = binding.cl.id
			arr[row][col] = binding
		})
		return arr
	}

	const tableColsNum = classes.filter(
		(cl) => cl.grade === selectedGrade
	).length
	const tableRowsNum = subjects.length
	const [tableData, setTableData] = useState(
		tableArrayFromList(
			selectedGradeTableData,
			tableRowsNum,
			tableColsNum
		)
	)

	useEffect(() => {
		setTableData(
			tableArrayFromList(
				selectedGradeTableData,
				tableRowsNum,
				tableColsNum
			)
		)
	}, [bindings, selectedGrade])

	console.log(tableData)

	return (
		<div className="w-full p-5">
			<table className="table table-zebra w-full h-full devide-black table-fixed rounded-full border-separate">
				<thead>
					<tr>
						<th className="border border-slate-600 text-center"></th>
						{classes
							.filter((cl) => cl.grade === selectedGrade)
							.map((cl) => (
								<th className="border border-slate-600 text-center">
									{cl.name}
								</th>
							))}
					</tr>
				</thead>
				<tbody>
					{tableData
						.filter((_, i) => i)
						.map((row, i) => (
							<tr key={i}>
								<td className="border border-slate-600 text-center">
									<h3>
										{
											subjects.find(
												(subject) =>
													subject.id === i + 1
											)?.name
										}
									</h3>
								</td>
								{row
									.filter((_, ci) => ci)
									.map((cell, ci) => {
										console.log(cell)
										return (
											<BindingsCell
												cl={cell?.cl}
												subject={cell?.subject}
												teachers={cell?.teachers}
												lessons={cell?.lessons}
											/>
										)
									})}
							</tr>
						))}
				</tbody>
			</table>
		</div>
	)
}

export default BindingsTable
