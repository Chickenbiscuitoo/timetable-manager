import type { NextPage } from 'next'

import useTimetableStore from '../store'

import { flatten } from '../utils/arraysFuncs'

const SubjectsTable: NextPage = () => {
	const { subjects, classes, bindings } = useTimetableStore()

	const subjectsStats = subjects.map((subject) => {
		const classLessonsCount = classes.map((cl) => {
			const clLessons = bindings
				.filter((binding) => binding.cl.id === cl.id)
				.filter((binding) => binding.subject.id === subject.id)
				.map((bd) => bd.teachers?.map((tch) => tch.lessons))

			if (clLessons.length === 0) {
				return 0
			} else {
				return flatten(clLessons).reduce(
					(a: number, b: number) => a + b
				)
			}
		})

		return {
			id: subject.id,
			name: subject.name,
			classLessonsCount,
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
					{subjectsStats.map((subject) => {
						return (
							<tr key={subject.id}>
								<td className="font-bold text-md text-primary">
									{subject.name}
								</td>
								{subject.classLessonsCount.map((cl, i) => (
									<td key={i}>{cl}</td>
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

export default SubjectsTable
