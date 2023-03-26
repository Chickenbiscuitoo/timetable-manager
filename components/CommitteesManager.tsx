import { NextPage } from 'next'
import useTimetableStore from '../store'

import { useState } from 'react'

import CommitteesManagerCell from './CommitteesManagerCell'
import SortButton from './SortButton'

const CommitteesManager: NextPage = () => {
	const { committees } = useTimetableStore()
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
							<th>Subjects</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{committees
							.sort(
								(a, b) =>
									(sortAsc ? 1 : -1) *
									(a.name > b.name ? 1 : -1)
							)
							.map((committee) => (
								<CommitteesManagerCell
									key={committee.id}
									id={committee.id}
									name={committee.name}
								/>
							))}
					</tbody>
					<tfoot>
						<tr>
							<th></th>
							<th>Name</th>
							<th>Subjects</th>
							<th></th>
						</tr>
					</tfoot>
				</table>
			</div>
		</div>
	)
}

export default CommitteesManager
