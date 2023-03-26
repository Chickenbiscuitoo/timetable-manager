import { NextPage } from 'next'
import useTimetableStore from '../store'

import { useState } from 'react'

import TeachersManagerCell from './TeachersManagerCell'
import SortButton from './SortButton'

const TeachersManager: NextPage = () => {
	const { teachers } = useTimetableStore()
	const [sortAsc, setSortAsc] = useState(true)

	const handleSort = () => {
		setSortAsc(!sortAsc)
	}

	return (
		<div>
			<div className="overflow-x-auto w-full max-h-screen">
				<table className="table w-full">
					<thead>
						<tr>
							<th>
								<SortButton
									asc={sortAsc}
									handleClick={handleSort}
								/>
							</th>
							<th>Name</th>
							<th>Email</th>
							<th>Lessons Teaching</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{teachers
							.sort(
								(a, b) =>
									(sortAsc ? 1 : -1) *
									(a.name > b.name ? 1 : -1)
							)
							.map((teacher) => (
								<TeachersManagerCell
									key={teacher.id}
									id={teacher.id}
									name={teacher.name}
									shortname={teacher.shortname}
									email={teacher.email}
								/>
							))}
					</tbody>
					<tfoot>
						<tr>
							<th></th>
							<th>Name</th>
							<th>Email</th>
							<th>Lessons Teaching</th>
							<th></th>
						</tr>
					</tfoot>
				</table>
			</div>
		</div>
	)
}

export default TeachersManager
