import { NextPage } from 'next'
import useTimetableStore from '../store'

import { useState } from 'react'

import ClassesManagerCell from './ClassesManagerCell'
import SortButton from './SortButton'

const ClassesManager: NextPage = () => {
	const { classes } = useTimetableStore()
	const [sortAsc, setSortAsc] = useState(true)

	const handleSort = () => {
		setSortAsc(!sortAsc)
	}

	return (
		<div>
			<div className="overflow-x-auto w-full max-h-screen">
				<table className="table w-full">
					<thead className="select-none">
						<tr>
							<th>
								<SortButton
									asc={sortAsc}
									handleClick={handleSort}
								/>
							</th>
							<th>Name</th>
							<th>Teacher</th>
							<th>Lessons</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{classes
							.sort(
								(a, b) =>
									(sortAsc ? 1 : -1) *
									(a.name > b.name ? 1 : -1)
							)
							.map((cl) => (
								<ClassesManagerCell
									key={cl.id}
									id={cl.id}
									name={cl.name}
									teacher={cl.teacher}
									grade={cl.grade}
								/>
							))}
					</tbody>
					<tfoot>
						<tr>
							<th></th>
							<th>Name</th>
							<th>Teacher</th>
							<th>Lessons</th>
							<th></th>
						</tr>
					</tfoot>
				</table>
			</div>
		</div>
	)
}

export default ClassesManager
