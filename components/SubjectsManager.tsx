import { NextPage } from 'next'
import useTimetableStore from '../store'

import { useState } from 'react'

import SubjectsManagerCell from './SubjectsManagerCell'
import SortButton from './SortButton'

const SubjectsManager: NextPage = () => {
	const { subjects } = useTimetableStore()
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
							<th>Commitee</th>
							<th>Lessons</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{subjects
							.sort(
								(a, b) =>
									(sortAsc ? 1 : -1) *
									(a.name > b.name ? 1 : -1)
							)
							.map((subject) => (
								<SubjectsManagerCell
									key={subject.id}
									id={subject.id}
									name={subject.name}
									shortname={subject.shortname}
									committee_id={subject.committeeId}
								/>
							))}
					</tbody>
					<tfoot>
						<tr>
							<th></th>
							<th>Name</th>
							<th>Commitee</th>
							<th>Lessons</th>
							<th></th>
						</tr>
					</tfoot>
				</table>
			</div>
		</div>
	)
}

export default SubjectsManager
