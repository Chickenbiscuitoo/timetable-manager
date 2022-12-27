import type { NextPage } from 'next'

import useTimetableStore from '../store'

const TeachersTable: NextPage = () => {
	const { teachers, subjects, classes, bindings } = useTimetableStore()

	const teachersStats = teachers.map((teacher) => {
		const teacherToClass = classes.map((cl) =>
			bindings
				.filter((binding) => binding.cl.id === cl.id)
				.map((binding) => binding.teachers?.map((tch) => tch.id))
				.filter((tch) => tch?.includes(teacher.id))
		)

		return {
			id: teacher.id,
			name: teacher.name,
			classesCount: teacherToClass,
		}
	})

	return (
		<div className="overflow-x-auto">
			<table className="table table-compact w-full table-zebra">
				<thead>
					<tr>
						<th></th>
						{classes.map((cl) => (
							<th key={cl.id} className="text-primary">
								{cl.name}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{teachersStats.map((tch) => {
						return (
							<tr key={tch.id}>
								<td className="font-bold text-md text-primary">
									{tch.name}
								</td>
								{tch.classesCount.map((cl, i) => (
									<td key={i}>{cl.length}</td>
								))}
							</tr>
						)
					})}
				</tbody>
				<tfoot>
					<tr>
						<th></th>
						{classes.map((cl) => (
							<th key={cl.name} className="text-primary">
								{cl.name}
							</th>
						))}
					</tr>
				</tfoot>
			</table>
		</div>
	)
}

export default TeachersTable
