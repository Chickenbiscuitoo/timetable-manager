import type { NextComponentType } from 'next'
import useTimetableStore from '../store'
import { useEffect, useState } from 'react'

import BindingsCell from './BindingsCell'

const BindingsTable: NextComponentType = () => {
	const { bindings, selectedGrade, classes, subjects } =
		useTimetableStore()

	const selectedGradeTableData = bindings.filter(
		(binding) => binding.cl?.grade === selectedGrade
	)

	// Fuction to make nested array from an array of objects
	function tableArrayFromList(list: any, rows: number, cols: number) {
		// Create an empty 2D array with the given number of rows and cols
		const arr = new Array(rows + 1)
			.fill(0)
			.map((_, i) => new Array(cols + 1).fill(undefined))
		selectedGradeTableData.forEach((binding) => {
			// Get index of bindings subject in arr bindings
			const bindingSubjectIndex = subjects.findIndex(
				(subject) => subject.id === binding.subject.id
			)
			// Get index of bindings class in arr classes
			const bindingClassIndex = classes
				.filter((cl) => cl.grade === selectedGrade)
				.findIndex((cl) => cl.id === binding.cl.id)

			const row = bindingSubjectIndex + 1
			const col = bindingClassIndex + 1
			arr[row][col] = binding
		})

		// Populates emply cells with class and subject
		return arr.map((row, rowIndex) =>
			row.map((col, colIndex) => {
				if (col === undefined) {
					const bindingSubjectIndex = rowIndex - 1
					const bindingClassIndex = colIndex - 1
					const subject = subjects[bindingSubjectIndex]
					const cl = classes.filter(
						(cl) => cl.grade === selectedGrade
					)[bindingClassIndex]
					return {
						cl,
						subject,
						teachers: [],
					}
				} else {
					return col
				}
			})
		)
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

	const getClassTotalLessons = (cl: number) => {
		const clBindings = bindings.filter(
			(binding) => binding.cl.id === cl
		)

		let totalLessons = 0
		clBindings.forEach((binding) => {
			binding.teachers.forEach((teacher) => {
				totalLessons += teacher.lessons
			})
		})

		return totalLessons
	}

	return (
		<div className="w-full p-5">
			<table className="table table-zebra w-full h-full devide-black table-fixed rounded-full border-separate">
				<thead>
					<tr>
						<th className="border border-slate-600 text-center"></th>
						{classes
							.filter((cl) => cl.grade === selectedGrade)
							.map((cl, i) => (
								<th
									key={cl.id}
									className="border border-slate-600 text-center"
								>
									<h1 className="mt-1 font-bold text-base">
										{cl.name}
									</h1>
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
									<h3>{subjects[i]?.name}</h3>
								</td>
								{row
									.filter((_, ci) => ci)
									.map((cell, ci) => {
										const cellKey = parseInt(
											`${i + 1}${
												ci + 1
											}${selectedGrade}`
										)

										return (
											<BindingsCell
												key={cellKey}
												bindingId={cell?.id}
												cl={cell?.cl}
												subject={
													cell?.subject ||
													subjects[i]
												}
												teachers={cell?.teachers}
											/>
										)
									})}
							</tr>
						))}
				</tbody>
				<tfoot>
					<tr>
						<th className="border border-slate-600 text-center">
							TOTAL
						</th>
						{classes
							.filter((cl) => cl.grade === selectedGrade)
							.map((cl, i) => (
								<th
									key={cl.id}
									className="border border-slate-600 text-center"
								>
									<h1 className="font-semibold text-primary text-base">
										{getClassTotalLessons(cl.id)}
									</h1>
								</th>
							))}
					</tr>
				</tfoot>
			</table>
		</div>
	)
}

export default BindingsTable
