import type { NextPage } from 'next'

import useTimetableStore from '../store'

const TeachersTable: NextPage = () => {
	const { teachers, subjects, classes, bindings } = useTimetableStore()

	const teacherClassLessonsCount = teachers.map((teacher) => {
		const classBindings = classes.map((cl) =>
			bindings
				.filter(
					(bind) =>
						bind.cl.id == cl.id &&
						bind.teachers.some((tch) => tch.id == teacher.id)
				)
				.map(
					(bind) =>
						bind.teachers.find((tch) => tch.id == teacher.id)
							?.lessons
				)
				.reduce((partialSum = 0, a = 0) => partialSum + a, 0)
		)

		return {
			id: teacher.id,
			name: teacher.name,
			classesCount: classBindings as number[],
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
					{teacherClassLessonsCount.map((tch) => {
						return (
							<tr key={tch.id}>
								<td className="font-bold text-md text-primary">
									{tch.name}
								</td>
								{tch.classesCount.map((count, i) => (
									<td key={i}>{count}</td>
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
